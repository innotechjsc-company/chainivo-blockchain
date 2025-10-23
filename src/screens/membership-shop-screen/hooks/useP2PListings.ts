import { useState } from "react";

interface P2PListing {
  id: number;
  tier: string;
  nftName: string;
  rarity: string;
  seller: string;
  price: string;
  usdPrice: string;
  listedTime: string;
  color: string;
}

export const useP2PListings = () => {
  const [listings] = useState<P2PListing[]>([
    {
      id: 1,
      tier: "Gold",
      nftName: "Gold Tier NFT #1523",
      rarity: "Legendary",
      seller: "0x7a9f...3d2c",
      price: "800 CAN",
      usdPrice: "$160",
      listedTime: "2 giờ trước",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: 2,
      tier: "Platinum",
      nftName: "Platinum Tier NFT #0892",
      rarity: "Mythic",
      seller: "0x4b8c...9e1f",
      price: "3200 CAN",
      usdPrice: "$640",
      listedTime: "5 giờ trước",
      color: "from-cyan-400 to-purple-600",
    },
    {
      id: 3,
      tier: "Silver",
      nftName: "Silver Tier NFT #2341",
      rarity: "Epic",
      seller: "0x2f5d...7a8b",
      price: "280 CAN",
      usdPrice: "$56",
      listedTime: "1 ngày trước",
      color: "from-gray-400 to-gray-600",
    },
  ]);

  return { listings };
};
