import { useState } from "react";

interface TierPackage {
  id: string;
  name: string;
  icon: string;
  color: string;
  price: string;
  usdPrice: string;
  buyers: number;
  nftDropRate: Array<{
    rarity: string;
    rate: string;
  }>;
  benefits: string[];
  popular: boolean;
}

export const useMembershipTiers = () => {
  const [tiers] = useState<TierPackage[]>([
    {
      id: "bronze",
      name: "Bronze",
      icon: "Star",
      color: "from-amber-700 to-amber-900",
      price: "50 CAN",
      usdPrice: "$10",
      buyers: 1247,
      nftDropRate: [
        { rarity: "Common", rate: "70%" },
        { rarity: "Rare", rate: "25%" },
        { rarity: "Epic", rate: "5%" },
      ],
      benefits: [
        "Phí giao dịch giảm 5%",
        "Truy cập NFT cơ bản",
        "1 nhiệm vụ/ngày",
      ],
      popular: false,
    },
    {
      id: "silver",
      name: "Silver",
      icon: "Zap",
      color: "from-gray-400 to-gray-600",
      price: "250 CAN",
      usdPrice: "$50",
      buyers: 856,
      nftDropRate: [
        { rarity: "Rare", rate: "50%" },
        { rarity: "Epic", rate: "40%" },
        { rarity: "Legendary", rate: "10%" },
      ],
      benefits: [
        "Phí giao dịch giảm 10%",
        "Truy cập NFT cao cấp",
        "3 nhiệm vụ/ngày",
        "Bonus staking +5%",
      ],
      popular: false,
    },
    {
      id: "gold",
      name: "Gold",
      icon: "Crown",
      color: "from-yellow-400 to-yellow-600",
      price: "750 CAN",
      usdPrice: "$150",
      buyers: 423,
      nftDropRate: [
        { rarity: "Epic", rate: "50%" },
        { rarity: "Legendary", rate: "40%" },
        { rarity: "Mythic", rate: "10%" },
      ],
      benefits: [
        "Phí giao dịch giảm 15%",
        "Truy cập toàn bộ NFT",
        "5 nhiệm vụ/ngày",
        "Bonus staking +10%",
        "Airdrop độc quyền",
      ],
      popular: true,
    },
    {
      id: "platinum",
      name: "Platinum",
      icon: "Crown",
      color: "from-cyan-400 to-purple-600",
      price: "2500 CAN",
      usdPrice: "$500",
      buyers: 127,
      nftDropRate: [
        { rarity: "Legendary", rate: "60%" },
        { rarity: "Mythic", rate: "30%" },
        { rarity: "Divine", rate: "10%" },
      ],
      benefits: [
        "Phí giao dịch MIỄN PHÍ",
        "NFT độc quyền",
        "Nhiệm vụ không giới hạn",
        "Bonus staking +20%",
        "Airdrop VIP",
      ],
      popular: false,
    },
  ]);

  return { tiers };
};
