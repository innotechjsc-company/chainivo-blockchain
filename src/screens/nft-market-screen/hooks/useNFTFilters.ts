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
  status?: string[];
  shares?: string[];
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
  const [loading, setLoading] = useState(true);
  const userInfo = useAppSelector((state) => state.auth.user);

  const fetchUserNFTs = async () => {
    if (!userInfo || !userInfo.walletAddress) {
      setUserNFTs([]);
      return;
    }
    try {
      const response = await NFTService.getNFTsByOwner(
        userInfo?.walletAddress || ""
      );
      if (response.success) {
        setUserNFTs((response.data as any).nfts || []);
      } else {
        toast.error(response.message);
        setUserNFTs([]);
      }
    } catch (error) {
      setUserNFTs([]);
    }
  };

  // Ensure we always return an array for downstream components (e.g. Grid uses slice)
  const normalizeNFTCollection = (input: any): any[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (Array.isArray(input.nfts)) return input.nfts;
    if (Array.isArray(input.items)) return input.items;
    if (Array.isArray(input.data)) return input.data;
    if (input.data) return normalizeNFTCollection(input.data);
    return [];
  };

  const fetchOtherNFTs = async () => {
    try {
      const response = await NFTService.allNFTInMarketplace();
      if (response.success) {
        const data: any = response.data as any;
        const list = normalizeNFTCollection(data);
        setOtherNFTsData(list);

        const analytics =
          (data && (data.analytics || data?.data?.analytics)) ||
          (response as any).analytics ||
          null;
        setOtherNFTsAnalytics(analytics);
      } else {
        toast.error(response.message);
        setOtherNFTsData([]);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setOtherNFTsData([]);
    }
  };

  // Helper function to filter NFTs based on filters
  const filterNFTsByCriteria = (
    nftsToFilter: any[],
    filterCriteria: NFTFiltersState
  ): any[] => {
    return nftsToFilter.filter((nft: any) => {
      // Type filter
      if (filterCriteria.type !== "all" && nft.type !== filterCriteria.type) {
        return false;
      }

      // Rarity filter (check level or rarity field)
      if (filterCriteria.rarity.length > 0) {
        const nftRarity = String(nft.level || nft.rarity || "");
        if (!filterCriteria.rarity.includes(nftRarity)) {
          return false;
        }
      }

      // Status filter
      if (filterCriteria.status && filterCriteria.status.length > 0) {
        const nftStatus = nft.isActive ? "active" : "inactive";
        if (!filterCriteria.status.includes(nftStatus)) {
          return false;
        }
      }

      // Shares availability filter
      if (filterCriteria.shares && filterCriteria.shares.length > 0) {
        const remainingShares = Number(
          nft.remainingShares ?? nft.availableShares ?? 0
        );
        const hasAvailableShares = remainingShares > 0;

        if (
          filterCriteria.shares.includes("available") &&
          !hasAvailableShares
        ) {
          return false;
        }
        if (filterCriteria.shares.includes("sold_out") && hasAvailableShares) {
          return false;
        }
      }

      // Price range filter
      const priceValue =
        nft.price ||
        nft.currentPrice?.amount ||
        nft.currentPrice?.price?.amount ||
        0;
      const numericPrice =
        typeof priceValue === "string"
          ? parseFloat(priceValue)
          : Number(priceValue);

      if (
        !isNaN(numericPrice) &&
        (numericPrice < filterCriteria.priceRange[0] ||
          numericPrice > filterCriteria.priceRange[1])
      ) {
        return false;
      }

      return true;
    });
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
      level: f.rarity.length > 0 ? f.rarity.join(",") : undefined,
      type: f.type !== "all" ? f.type : undefined,
      isActive: f.status?.includes("active")
        ? "true"
        : f.status?.includes("inactive")
        ? "false"
        : undefined,
    };

    try {
      // Search in marketplace
      const response = await NFTService.allNFTInMarketplace(params);
      let marketplaceResults: any[] = [];

      if (response.success) {
        const data: any = response.data as any;
        marketplaceResults = data?.nfts || data?.items || data || [];
      } else {
        toast.error(response.message);
      }

      // Filter userNFTs based on the same criteria
      const filteredUserNFTs = filterNFTsByCriteria(userNFTs, f);

      // Merge results from both sources
      // Use a Map to avoid duplicates based on id/_id/tokenId
      const mergedResults = new Map<string, any>();

      // Add marketplace results
      marketplaceResults.forEach((nft: any) => {
        const id = String(nft.id || nft._id || nft.tokenId || "");
        if (id && !mergedResults.has(id)) {
          mergedResults.set(id, nft);
        } else if (!id) {
          // If no ID, add with a unique key
          const uniqueKey = `marketplace-${mergedResults.size}`;
          mergedResults.set(uniqueKey, nft);
        }
      });

      // Add filtered user NFTs
      filteredUserNFTs.forEach((nft: any) => {
        const id = String(nft.id || nft._id || nft.tokenId || "");
        if (id && !mergedResults.has(id)) {
          mergedResults.set(id, nft);
        } else if (!id) {
          // If no ID, add with a unique key
          const uniqueKey = `user-${mergedResults.size}`;
          mergedResults.set(uniqueKey, nft);
        }
      });

      // Convert Map to Array
      const finalResults = Array.from(mergedResults.values());

      setSearchNFTs(finalResults);
      return true;
    } catch (error) {
      console.error("Error searching marketplace:", error);
      toast.error("Lỗi khi tìm kiếm NFT.");
      return false;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchOtherNFTs(), fetchUserNFTs()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userInfo]);

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
    loading,
  };
};
