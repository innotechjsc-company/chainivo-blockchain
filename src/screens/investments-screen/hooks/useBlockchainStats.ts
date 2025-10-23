import { useEffect, useState } from "react";

interface BlockchainData {
  total_can_supply: number;
  circulating_supply: number;
  total_holders: number;
  total_transactions: number;
  current_phase: number;
  total_value_locked: number;
}

export const useBlockchainStats = () => {
  const [stats, setStats] = useState<BlockchainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data for demonstration
        // TODO: Replace with actual API call
        const mockStats: BlockchainData = {
          total_can_supply: 100000000,
          circulating_supply: 45000000,
          total_holders: 12500,
          total_transactions: 850000,
          current_phase: 2,
          total_value_locked: 2500000,
        };

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setStats(mockStats);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch blockchain stats"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
