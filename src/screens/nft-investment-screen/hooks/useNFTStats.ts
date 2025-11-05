import { useState } from "react";

interface NFTStats {
  totalNFTs: string;
  activeUsers: string;
  volume: string;
  averagePrice: string;
  volumeTrend: string;
  priceTrend: string;
}

export const useNFTStats = () => {
  const [stats] = useState<NFTStats>({
    totalNFTs: "15,234",
    activeUsers: "2,456",
    volume: "$8.5M",
    averagePrice: "0.85 ETH",
    volumeTrend: "+15.7%",
    priceTrend: "+5.2%",
  });

  const [volumeData] = useState([
    { name: "T1", value: 4.2 },
    { name: "T2", value: 5.8 },
    { name: "T3", value: 6.5 },
    { name: "T4", value: 7.2 },
    { name: "T5", value: 8.5 },
    { name: "T6", value: 9.1 },
  ]);

  const [priceData] = useState([
    { name: "T1", value: 0.65 },
    { name: "T2", value: 0.72 },
    { name: "T3", value: 0.68 },
    { name: "T4", value: 0.78 },
    { name: "T5", value: 0.82 },
    { name: "T6", value: 0.85 },
  ]);

  return { stats, volumeData, priceData };
};
