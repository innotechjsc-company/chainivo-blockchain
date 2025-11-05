'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { NFTService } from '@/api/services/nft-service';
import type { NFTItem, Pagination, NFTStats } from '@/types/NFT';

// Type cho filter tabs
export type NFTFilterType = 'all' | 'sale' | 'not-listed';

interface UseMyNFTCollectionResult {
  nfts: NFTItem[];
  stats: NFTStats;
  loading: boolean;
  error: string | null;
  filter: NFTFilterType;
  setFilter: (filter: NFTFilterType) => void;
  pagination: Pagination;
  refetch: () => void;
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
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NFTFilterType>('all');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch TAT CA NFTs tu API (khong filter)
  const fetchNFTs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ALL NFTs - khong truyen isSale param
      const response = await NFTService.getNFTsByOwner({
        page: 1,
        limit: 100, // Tang limit de lay het NFT
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (response.success && response.data) {
        setAllNFTs(response.data.nfts);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Khong the tai danh sach NFT');
        setAllNFTs([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Loi khong xac dinh');
      setAllNFTs([]);
    } finally {
      setLoading(false);
    }
  }, []); // Khong phu thuoc vao filter nua

  // Fetch data khi mount
  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  // Filter NFTs o client-side dua tren filter state
  const nfts = useMemo(() => {
    if (filter === 'sale') {
      return allNFTs.filter((nft) => nft.isSale === true);
    } else if (filter === 'not-listed') {
      return allNFTs.filter((nft) => nft.isSale === false);
    }
    return allNFTs; // 'all'
  }, [allNFTs, filter]);

  // Tinh toan stats tu TOAN BO NFTs
  const stats = useMemo((): NFTStats => {
    const totalNFTs = allNFTs.length;
    const onSale = allNFTs.filter((nft) => nft.isSale === true).length;
    const notListed = allNFTs.filter((nft) => nft.isSale === false).length;
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
    };
  }, [allNFTs]);

  // Reset filter handler
  const handleSetFilter = useCallback((newFilter: NFTFilterType) => {
    setFilter(newFilter);
    // Reset ve trang 1 khi thay doi filter
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  return {
    nfts,
    stats,
    loading,
    error,
    filter,
    setFilter: handleSetFilter,
    pagination,
    refetch: fetchNFTs,
  };
}

export default useMyNFTCollection;