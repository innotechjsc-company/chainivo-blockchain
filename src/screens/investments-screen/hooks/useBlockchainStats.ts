import { useEffect, useState } from "react";
import createInvestment from "@/api/services/phase-service";

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
        const response = await createInvestment.getALLInfoOfPhase();
        if (response.success && response.data) {
          setStats(response.data as any);
        } else {
          setStats(null);
          setError("Không có dữ liệu thống kê");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Khong the lay thong ke blockchain"
        );
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
