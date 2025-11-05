import { useState } from "react";

export interface NFT {
  id: string;
  name: string;
  image: string;
  price: string;
  rarity: string;
  type: "tier" | "other";
  seller?: string;
  likes?: number;
  // For other NFTs
  totalValue?: string;
  pricePerShare?: string;
  sharesSold?: number;
  totalShares?: number;
  purchases?: number;
}

export const useNFTData = () => {
  const [nfts] = useState<NFT[]>([
    // Tier NFTs
    {
      id: "1",
      name: "Gold Tier NFT #1523",
      image: "/api/placeholder/300/300",
      price: "0.8 ETH",
      rarity: "Legendary",
      type: "tier",
      seller: "0x7a9f...3d2c",
    },
    {
      id: "2",
      name: "Platinum Tier NFT #0892",
      image: "/api/placeholder/300/300",
      price: "3.2 ETH",
      rarity: "Mythic",
      type: "tier",
      seller: "0x4b8c...9e1f",
    },
    {
      id: "3",
      name: "Silver Tier NFT #2341",
      image: "/api/placeholder/300/300",
      price: "0.28 ETH",
      rarity: "Epic",
      type: "tier",
      seller: "0x2f5d...7a8b",
    },
    {
      id: "4",
      name: "Bronze Tier NFT #4567",
      image: "/api/placeholder/300/300",
      price: "0.1 ETH",
      rarity: "Rare",
      type: "tier",
      seller: "0x8c3d...4f2a",
    },
    // Other NFTs
    {
      id: "5",
      name: "Cyber Punk #4231",
      image: "/api/placeholder/300/300",
      price: "2.5 ETH",
      rarity: "Divine",
      type: "other",
      seller: "0x1234...5678",
      totalValue: "250 ETH",
      pricePerShare: "2.5 ETH",
      sharesSold: 67,
      totalShares: 100,
      purchases: 892,
    },
    {
      id: "6",
      name: "Digital Warrior #892",
      image: "/api/placeholder/300/300",
      price: "1.8 ETH",
      rarity: "Legendary",
      type: "other",
      seller: "0xabcd...efgh",
      totalValue: "180 ETH",
      pricePerShare: "1.8 ETH",
      sharesSold: 45,
      totalShares: 100,
      purchases: 456,
    },
    {
      id: "7",
      name: "Future Vision #156",
      image: "/api/placeholder/300/300",
      price: "3.2 ETH",
      rarity: "Mythic",
      type: "other",
      seller: "0x9876...5432",
      totalValue: "320 ETH",
      pricePerShare: "3.2 ETH",
      sharesSold: 82,
      totalShares: 100,
      purchases: 678,
    },
    {
      id: "8",
      name: "Neon Dream #789",
      image: "/api/placeholder/300/300",
      price: "1.2 ETH",
      rarity: "Epic",
      type: "other",
      seller: "0x3456...7890",
      totalValue: "120 ETH",
      pricePerShare: "1.2 ETH",
      sharesSold: 23,
      totalShares: 100,
      purchases: 234,
    },
    {
      id: "9",
      name: "Quantum Blast #345",
      image: "/api/placeholder/300/300",
      price: "0.9 ETH",
      rarity: "Rare",
      type: "other",
      seller: "0x5678...9012",
      totalValue: "90 ETH",
      pricePerShare: "0.9 ETH",
      sharesSold: 15,
      totalShares: 100,
      purchases: 167,
    },
    {
      id: "10",
      name: "Cosmic Ray #901",
      image: "/api/placeholder/300/300",
      price: "0.5 ETH",
      rarity: "Common",
      type: "other",
      seller: "0x7890...1234",
      totalValue: "50 ETH",
      pricePerShare: "0.5 ETH",
      sharesSold: 8,
      totalShares: 100,
      purchases: 98,
    },
  ]);

  return { nfts };
};
