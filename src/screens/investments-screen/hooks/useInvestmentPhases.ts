import { useState } from "react";

interface InvestmentPhase {
  id: number;
  name: string;
  status: "completed" | "active" | "locked";
  price: string;
  totalCoins: string;
  soldCoins: string;
  progress: number;
  bonus: string;
}

export const useInvestmentPhases = () => {
  const [phases] = useState<InvestmentPhase[]>([
    {
      id: 1,
      name: "Giai đoạn 1",
      status: "completed",
      price: "0.05 USD",
      totalCoins: "10,000,000",
      soldCoins: "10,000,000",
      progress: 100,
      bonus: "+20% Bonus",
    },
    {
      id: 2,
      name: "Giai đoạn 2",
      status: "active",
      price: "0.08 USD",
      totalCoins: "15,000,000",
      soldCoins: "8,750,000",
      progress: 58,
      bonus: "+15% Bonus",
    },
    {
      id: 3,
      name: "Giai đoạn 3",
      status: "locked",
      price: "0.12 USD",
      totalCoins: "20,000,000",
      soldCoins: "0",
      progress: 0,
      bonus: "+10% Bonus",
    },
    {
      id: 4,
      name: "Giai đoạn 4",
      status: "locked",
      price: "0.15 USD",
      totalCoins: "25,000,000",
      soldCoins: "0",
      progress: 0,
      bonus: "+5% Bonus",
    },
  ]);

  return { phases };
};
