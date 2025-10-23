import { useEffect, useState } from "react";

interface TransactionHistory {
  id: string;
  type: "purchase" | "sale";
  tier: string;
  buyer: string;
  seller: string;
  price: string;
  timestamp: string;
}

export const useRealtimeHistory = () => {
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data for demonstration
        // TODO: Replace with actual API call
        const mockTransactions: TransactionHistory[] = [
          {
            id: "1",
            type: "purchase",
            tier: "Gold",
            buyer: "0x7a9f...3d2c",
            seller: "0x4b8c...9e1f",
            price: "800 CAN",
            timestamp: "2 phút trước",
          },
          {
            id: "2",
            type: "sale",
            tier: "Platinum",
            buyer: "0x2f5d...7a8b",
            seller: "0x1e3a...5c7d",
            price: "3200 CAN",
            timestamp: "5 phút trước",
          },
          {
            id: "3",
            type: "purchase",
            tier: "Silver",
            buyer: "0x9b2e...8f1a",
            seller: "0x6d4c...3b9e",
            price: "280 CAN",
            timestamp: "8 phút trước",
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

    fetchHistory();
  }, []);

  return { transactions, loading, error };
};
