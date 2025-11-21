"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { NFTService } from "@/api/services/nft-service";
import type {
  NFTItem,
  Pagination,
  NFTStats,
  NFTType,
  NFTLevel,
} from "@/types/NFT";

// Type cho filter tabs
export type NFTFilterType =
  | "all"
  | "sale"
  | "not-listed"
  | "can-sell"
  | "can-staking";

// Type cho advanced filters
export interface AdvancedFilters {
  type: NFTType | "all";
  level: NFTLevel | "all";
  priceRange: {
    min: number;
    max: number;
  };
}

// Default advanced filters
const DEFAULT_ADVANCED_FILTERS: AdvancedFilters = {
  type: "all",
  level: "all",
  priceRange: {
    min: 0,
    max: Infinity,
  },
};

const PAGE_LIMIT = 9;

interface UseMyNFTCollectionResult {
  nfts: NFTItem[];
  stats: NFTStats;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  filter: NFTFilterType;
  setFilter: (filter: NFTFilterType) => void;
  advancedFilters: AdvancedFilters;
  setAdvancedFilters: (filters: AdvancedFilters) => void;
  resetAdvancedFilters: () => void;
  pagination: Pagination;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

/**
 * Hook fetch NFT collection cua user
 *
 * Chuc nang:
 * - Fetch danh sach NFT tu API /api/nft/my-nft
 * - Ho tro filter theo trang thai ban (all/sale/not-listed)
 * - Tinh toan stats (totalNFTs, onSale, notListed, totalValue, inactive)
 * - Handle loading va error state
 *
 * @example
 * const { nfts, stats, loading, error, filter, setFilter } = useMyNFTCollection();
 */
export function useMyNFTCollection(): UseMyNFTCollectionResult {
  const [allNFTs, setAllNFTs] = useState<NFTItem[]>([]); // Luu toan bo NFT
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NFTFilterType>("all");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(
    DEFAULT_ADVANCED_FILTERS
  );
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [hasMore, setHasMore] = useState(true);

  // Fetch NFTs tu API theo tung trang
  const fetchNFTs = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await NFTService.getNFTsByOwner({
        page,
        limit: PAGE_LIMIT,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      const data = response.data;
      if (response.success && data) {
        const paginationData: Pagination = data.pagination || {
          page,
          limit: PAGE_LIMIT,
          total: (data.nfts ?? []).length,
          totalPages: page,
          hasNextPage: (data.nfts ?? []).length === PAGE_LIMIT,
          hasPrevPage: page > 1,
        };

        setAllNFTs((prev) =>
          page === 1 ? data.nfts : [...prev, ...data.nfts]
        );
        setPagination(paginationData);
        setHasMore(Boolean(paginationData.hasNextPage));
      } else {
        const message = response.message || "Khong the tai danh sach NFT";
        setError(message);
        if (!append) {
          setAllNFTs([]);
          setHasMore(false);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Loi khong xac dinh";
      if (page === 1) {
        setError(message);
        setAllNFTs([]);
        setHasMore(false);
      }
    } finally {
      if (page === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, []);

  // Fetch data khi mount
  useEffect(() => {
    fetchNFTs(1);
  }, [fetchNFTs]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !pagination.hasNextPage) return;
    const nextPage = (pagination.page || 1) + 1;
    fetchNFTs(nextPage, true);
  }, [fetchNFTs, loading, loadingMore, pagination]);

  // Filter NFTs o client-side dua tren filter state va advanced filters
  const nfts = useMemo(() => {
    let filtered = allNFTs;
    // Filter theo sale status (all/sale/not-listed/can-sell/can-staking)
    if (filter === "sale") {
      filtered = filtered.filter((nft) => nft.isSale === true);
    } else if (filter === "not-listed") {
      filtered = filtered.filter((nft) => nft.isSale === false);
    } else if (filter === "can-sell") {
      filtered = filtered.filter((nft) => nft.isSale === false);
    } else if (filter === "can-staking") {
      filtered = filtered.filter((nft) => nft.isStaking === false);
    }

    // Filter theo type (normal, rank, mysteryBox, investment)
    if (advancedFilters.type !== "all") {
      filtered = filtered.filter((nft) => nft.type === advancedFilters.type);
    }

    // Filter theo level (rarity: 1, 2, 3, 4, 5)
    if (advancedFilters.level !== "all") {
      filtered = filtered.filter((nft) => nft.level === advancedFilters.level);
    }

    // Filter theo price range
    if (
      advancedFilters.priceRange.min > 0 ||
      advancedFilters.priceRange.max < Infinity
    ) {
      filtered = filtered.filter((nft) => {
        const price = nft.salePrice || nft.price;
        return (
          price >= advancedFilters.priceRange.min &&
          price <= advancedFilters.priceRange.max
        );
      });
    }

    return filtered;
  }, [allNFTs, filter, advancedFilters]);

  // Tinh toan stats tu TOAN BO NFTs
  const stats = useMemo((): NFTStats & {
    canSell: number;
    canStaking: number;
  } => {
    const totalNFTs = allNFTs.length;
    const onSale = allNFTs.filter((nft) => nft.isSale === true).length;
    const notListed = allNFTs.filter((nft) => nft.isSale === false).length;
    const canSell = allNFTs.filter((nft) => nft.isSale === false).length;
    const canStaking = allNFTs.filter((nft) => nft.isStaking === false).length;
    const inactive = allNFTs.filter((nft) => !nft.isActive).length;

    // Tinh tong gia tri: uu tien salePrice, neu khong co thi dung price
    const totalValue = allNFTs.reduce((sum, nft) => {
      return sum + (nft.salePrice || nft.price);
    }, 0);

    return {
      totalNFTs,
      onSale,
      notListed,
      totalValue,
      inactive,
      canSell,
      canStaking,
    };
  }, [allNFTs]);

  // Reset filter handler
  const handleSetFilter = useCallback((newFilter: NFTFilterType) => {
    setFilter(newFilter);
    // Reset ve trang 1 khi thay doi filter
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Reset advanced filters handler
  const resetAdvancedFilters = useCallback(() => {
    setAdvancedFilters(DEFAULT_ADVANCED_FILTERS);
  }, []);

  return {
    nfts,
    stats,
    loading,
    loadingMore,
    error,
    filter,
    setFilter: handleSetFilter,
    advancedFilters,
    setAdvancedFilters,
    resetAdvancedFilters,
    pagination,
    refetch: () => fetchNFTs(1),
    loadMore,
    hasMore,
  };
}

export default useMyNFTCollection;
