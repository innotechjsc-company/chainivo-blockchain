import { useState, useMemo, useEffect } from "react";
import { NFT } from "./useNFTData";
import NFTService from "@/api/services/nft-service";
import { useSelector } from "react-redux";
import { useAppSelector } from "@/stores";
import { toast } from "sonner";

export interface NFTFiltersState {
  rarity: string[];
  priceRange: [number, number];
  type: string;
}

export const useNFTFilters = (nfts: NFT[]) => {
  const [filters, setFilters] = useState<NFTFiltersState>({
    rarity: [],
    priceRange: [0, 10000],
    type: "all",
  });

  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [searchNFTs, setSearchNFTs] = useState<any[]>([]);
  const [otherNFTsData, setOtherNFTsData] = useState<any[]>([]);
  const [otherNFTsAnalytics, setOtherNFTsAnalytics] = useState<any>(null);
  const userInfo = useAppSelector((state) => state.auth.user);

  const fetchUserNFTs = async () => {
    const response = await NFTService.getNFTsByOwner(
      userInfo?.walletAddress || ""
    );
    if (response.success) {
      setUserNFTs((response.data as any).nfts || []);
    } else {
      toast.error(response.message);
    }
  };

  const fetchOtherNFTs = async () => {
    const response = await NFTService.allNFTInMarketplace();

    if (response.success) {
      const data: any = response.data as any;

      // Handle different response structures
      // Case 1: { nfts: [...], analytics: {...} }
      // Case 2: { items: [...], analytics: {...} }
      // Case 3: { data: { nfts: [...], analytics: {...} } }
      // Case 4: Direct array with analytics at root level

      if (data?.nfts || data?.items) {
        setOtherNFTsData(data.nfts || data.items || []);
        if (data.analytics) {
          console.log(data.analytics);
          setOtherNFTsAnalytics(data.analytics);
        }
      } else if (Array.isArray(data)) {
        setOtherNFTsData(data);
        // Analytics might be at response level
        if ((response as any).analytics) {
          setOtherNFTsAnalytics((response as any).analytics);
        }
      } else if (data?.data) {
        // Nested structure
        setOtherNFTsData(
          data.data?.nfts || data.data?.items || data.data || []
        );
        if (data.data?.analytics || data.analytics) {
          setOtherNFTsAnalytics(data.data?.analytics || data.analytics);
        }
      } else {
        setOtherNFTsData(data || []);
        // Check if analytics exists at any level
        if (data?.analytics) {
          setOtherNFTsAnalytics(data.analytics);
        } else if ((response as any).analytics) {
          setOtherNFTsAnalytics((response as any).analytics);
        }
      }

      // Debug log to help identify the structure
      console.log("NFT Marketplace Response:", {
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : [],
        hasAnalytics: !!(data?.analytics || (response as any).analytics),
        responseKeys: Object.keys(response),
      });
    } else {
      toast.error(response.message);
    }
  };

  const searchMarketplace = async (
    override?: Partial<NFTFiltersState>
  ): Promise<boolean> => {
    const f = { ...filters, ...(override || {}) };
    const params: any = {
      page: 1,
      limit: 24,
      minPrice: String(f.priceRange[0]),
      maxPrice: String(f.priceRange[1]),
      level: f.rarity.join(","),
      type: f.type !== "all" ? f.type : undefined,
      isActive: "true",
    };
    const response = await NFTService.allNFTInMarketplace(params);
    if (response.success) {
      const data: any = response.data as any;
      setSearchNFTs(data?.nfts || data?.items || data || []);
      return true;
    } else {
      toast.error(response.message);
      return false;
    }
  };
  useEffect(() => {
    fetchOtherNFTs();
    fetchUserNFTs();
  }, []);

  const filteredNFTs = useMemo(() => {
    return nfts.filter((nft) => {
      // Type filter
      if (filters.type !== "all" && nft.type !== filters.type) {
        return false;
      }

      // Rarity filter
      if (filters.rarity.length > 0 && !filters.rarity.includes(nft.rarity)) {
        return false;
      }

      // Price range filter
      const priceValue = parseFloat(nft.price.split(" ")[0]);
      if (
        priceValue < filters.priceRange[0] ||
        priceValue > filters.priceRange[1]
      ) {
        return false;
      }

      return true;
    });
  }, [nfts, filters]);

  const tierNFTs = filteredNFTs.filter((nft) => nft.type === "tier");
  const otherNFTs = filteredNFTs.filter((nft) => nft.type === "other");

  const resetFilters = () => {
    setFilters({
      rarity: [],
      priceRange: [0, 10000],
      type: "all",
    });
    // Clear search results when resetting filters
    setSearchNFTs([]);
  };

  const hasActiveFilters =
    filters.rarity.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 10000 ||
    filters.type !== "all";

  return {
    filters,
    setFilters,
    filteredNFTs,
    tierNFTs,
    otherNFTs,
    resetFilters,
    hasActiveFilters,
    fetchUserNFTs,
    userNFTs,
    otherNFTsData,
    otherNFTsAnalytics,
    searchMarketplace,
    searchNFTs,
  };
};
