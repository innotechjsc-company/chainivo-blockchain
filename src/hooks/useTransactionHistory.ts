'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { TransactionService } from '@/api/services/transaction-service';
import type { RootState } from '@/stores/store';
import type {
  TransactionHistoryItem,
  TransactionHistoryFilters,
  TransactionHistoryStats,
  TransactionPagination,
  TransactionType,
  Currency,
} from '@/types/TransactionHistory';

interface UseTransactionHistoryResult {
  transactions: TransactionHistoryItem[];
  stats: TransactionHistoryStats;
  loading: boolean;
  error: string | null;
  filters: TransactionHistoryFilters;
  setFilter: (key: keyof TransactionHistoryFilters, value: any) => void;
  resetFilters: () => void;
  pagination: TransactionPagination;
  goToPage: (page: number) => void;
  refetch: () => void;
}

const defaultFilters: TransactionHistoryFilters = {
  page: 1,
  limit: 20,
  transactionType: 'all',
  currency: 'all',
  searchQuery: '',
};

/**
 * Hook fetch lich su giao dich cua user
 *
 * Chuc nang:
 * - Fetch danh sach giao dich tu API /api/list-transaction
 * - Ho tro filter theo loai giao dich, currency
 * - Client-side search theo hash, notes
 * - Pagination tu backend
 * - Tinh stats: totalTransactions, completedCount, pendingCount, failedCount
 *
 * @example
 * const { transactions, stats, loading, filters, setFilter, pagination, goToPage } = useTransactionHistory();
 */
export function useTransactionHistory(): UseTransactionHistoryResult {
  const user = useSelector((state: RootState) => state.auth.user);

  const [allTransactions, setAllTransactions] = useState<TransactionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionHistoryFilters>(defaultFilters);
  const [pagination, setPagination] = useState<TransactionPagination>({
    totalDocs: 0,
    limit: 20,
    page: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch giao dich tu API
  const fetchTransactions = useCallback(async () => {
    if (!user?.walletAddress) {
      setLoading(false);
      setAllTransactions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params: any = {
        page: filters.page,
        limit: filters.limit,
        walletAddress: user.walletAddress,
      };

      // Them filter neu khong phai 'all'
      if (filters.transactionType !== 'all') {
        params.transactionType = filters.transactionType;
      }

      const response = await TransactionService.getTransactionHistory(params);

      if (response.success && response.data) {
        setAllTransactions(response.data.transactions);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Khong the tai lich su giao dich');
        setAllTransactions([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Loi khong xac dinh');
      setAllTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [user?.walletAddress, filters.page, filters.limit, filters.transactionType]);

  // Fetch data khi mount hoac filters thay doi
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Client-side filter theo currency va search query
  const transactions = useMemo(() => {
    let filtered = [...allTransactions];

    // Filter theo currency
    if (filters.currency !== 'all') {
      filtered = filtered.filter((tx) => tx.currency === filters.currency);
    }

    // Client-side search theo hash, notes
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (tx) =>
          tx.transactionHash?.toLowerCase().includes(query) ||
          tx.notes?.toLowerCase().includes(query) ||
          tx.from?.toLowerCase().includes(query) ||
          tx.to?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allTransactions, filters.currency, filters.searchQuery]);

  // Tinh stats tu client-side data
  const stats = useMemo((): TransactionHistoryStats => {
    const totalTransactions = transactions.length;

    // Giao dich co transactionHash duoc coi la completed
    const completedCount = transactions.filter(
      (tx) => tx.transactionHash && tx.transactionHash.trim() !== ''
    ).length;

    // Giao dich khong co transactionHash duoc coi la pending
    const pendingCount = transactions.filter(
      (tx) => !tx.transactionHash || tx.transactionHash.trim() === ''
    ).length;

    // Failed count reserved cho tuong lai
    const failedCount = 0;

    return {
      totalTransactions,
      completedCount,
      pendingCount,
      failedCount,
    };
  }, [transactions]);

  // Update single filter
  const setFilter = useCallback(
    (key: keyof TransactionHistoryFilters, value: any) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value };

        // Reset ve trang 1 neu thay doi filter (tru page)
        if (key !== 'page') {
          newFilters.page = 1;
        }

        return newFilters;
      });
    },
    []
  );

  // Reset tat ca filters
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Chuyen trang
  const goToPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    transactions,
    stats,
    loading,
    error,
    filters,
    setFilter,
    resetFilters,
    pagination,
    goToPage,
    refetch: fetchTransactions,
  };
}

export default useTransactionHistory;