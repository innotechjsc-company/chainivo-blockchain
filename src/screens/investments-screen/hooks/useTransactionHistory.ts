import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  price_per_token: number;
  total_value: number;
  phase: number;
  status: string;
  created_at: string;
}

export const useTransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data for demonstration
        // TODO: Replace with actual API call
        const mockTransactions: Transaction[] = [
          {
            id: "1",
            transaction_type: "buy",
            amount: 1000,
            price_per_token: 0.08,
            total_value: 80,
            phase: 2,
            status: "completed",
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            transaction_type: "buy",
            amount: 500,
            price_per_token: 0.05,
            total_value: 25,
            phase: 1,
            status: "completed",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ];

        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setTransactions(mockTransactions);
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

    fetchTransactions();
  }, []);

  return { transactions, loading, error };
};
