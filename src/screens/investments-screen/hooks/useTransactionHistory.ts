import { useEffect, useState } from "react";
import { TransactionService } from "@/api/services/transaction-service";
import type { TransactionHistoryItem } from "@/types/TransactionHistory";
import { useAppSelector } from "@/stores";

export const useTransactionHistory = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [transactions, setTransactions] = useState<TransactionHistoryItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.walletAddress) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      const response =
        await TransactionService.getTransactionHistoryByWalletAddress();

      if (response.success && response.data?.transactions) {
        const latestTransactions = [...response.data.transactions].slice(0, 5);
        setTransactions(latestTransactions);
      } else {
        setTransactions([]);
        setError(
          response.message ||
            response.error ||
            "Không thể lấy lịch sử giao dịch"
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch transaction history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user?.walletAddress]);

  return { transactions, loading, error };
};
