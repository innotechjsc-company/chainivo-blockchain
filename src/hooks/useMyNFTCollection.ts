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
  const [nfts, setNfts] = useState<NFTItem[]>([]);
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

  // Fetch NFTs tu API
  const fetchNFTs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Chuyen doi filter sang param API
      let isSale: boolean | undefined;
      if (filter === 'sale') {
        isSale = true;
      } else if (filter === 'not-listed') {
        isSale = false;
      }
      // filter === 'all' thi khong truyen param isSale

      const response = await NFTService.getNFTsByOwner({
        page: pagination.page,
        limit: pagination.limit,
        isSale,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (response.success && response.data) {
        setNfts(response.data.nfts);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Khong the tai danh sach NFT');
        setNfts([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Loi khong xac dinh');
      setNfts([]);
    } finally {
      setLoading(false);
    }
  }, [filter, pagination.page, pagination.limit]);

  // Fetch data khi filter thay doi
  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  // Tinh toan stats tu danh sach NFTs
  const stats = useMemo((): NFTStats => {
    const totalNFTs = nfts.length;
    const onSale = nfts.filter((nft) => nft.isSale).length;
    const notListed = nfts.filter((nft) => !nft.isSale).length;
    const inactive = nfts.filter((nft) => !nft.isActive).length;

    // Tinh tong gia tri: uu tien salePrice, neu khong co thi dung price
    const totalValue = nfts.reduce((sum, nft) => {
      return sum + (nft.salePrice || nft.price);
    }, 0);

    return {
      totalNFTs,
      onSale,
      notListed,
      totalValue,
      inactive,
    };
  }, [nfts]);

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