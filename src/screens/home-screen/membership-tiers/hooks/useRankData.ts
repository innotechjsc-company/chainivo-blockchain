'use client';

import { useState, useEffect } from 'react';
import { RankService } from '@/api';
import { transformRanksToTiers } from '../utils/transformRankData';
import type { UITier } from '../utils/transformRankData';

interface UseRankDataReturn {
  tiers: UITier[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook để fetch và transform rank data
 */
export const useRankData = (): UseRankDataReturn => {
  const [tiers, setTiers] = useState<UITier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRanks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API với params: chỉ lấy active ranks, sort theo level
      const response = await RankService.getRanks({
        isActive: true,
        sortBy: 'level',
        sortOrder: 'asc',
        limit: 100, // Lấy tất cả ranks
      });

      if (response.success && response.data) {
        // Transform API data sang UI tier format
        const transformedTiers = transformRanksToTiers(response.data.data);
        setTiers(transformedTiers);
      } else {
        setError(
          response.error || 'Không thể tải danh sách hạng thành viên'
        );
      }
    } catch (err) {
      console.error('Lỗi khi fetch ranks:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data khi component mount
  useEffect(() => {
    fetchRanks();
  }, []);

  return {
    tiers,
    loading,
    error,
    refetch: fetchRanks,
  };
};
