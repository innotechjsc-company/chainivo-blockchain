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
    priceRange: [0, 10],
    type: "all",
  });

  const [userNFTs, setUserNFTs] = useState<any[]>([]);
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
  useEffect(() => {
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
      priceRange: [0, 10],
      type: "all",
    });
  };

  const hasActiveFilters =
    filters.rarity.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 10 ||
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
  };
};
