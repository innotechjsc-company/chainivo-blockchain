import { useState } from "react";

interface TrendData {
  period: string;
  volume: number;
  transactions: number;
  averagePrice: number;
}

export const useTransactionTrends = () => {
  const [trends] = useState<TrendData[]>([
    {
      period: "24h",
      volume: 125000,
      transactions: 45,
      averagePrice: 2778,
    },
    {
      period: "7d",
      volume: 850000,
      transactions: 312,
      averagePrice: 2724,
    },
    {
      period: "30d",
      volume: 3200000,
      transactions: 1180,
      averagePrice: 2712,
    },
  ]);

  const [currentPeriod, setCurrentPeriod] = useState("24h");

  return { trends, currentPeriod, setCurrentPeriod };
};
