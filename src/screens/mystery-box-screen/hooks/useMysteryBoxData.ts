import { useState, useEffect } from "react";
import { MysteryBoxService } from "@/api/services";
import { config } from "@/api/config";

export interface Reward {
  id: string;
  rewardType: "token" | "nft";
  description?: string;
  tokenMinQuantity?: number;
  tokenMaxQuantity?: number;
  nftPriceMin?: number;
  nftPriceMax?: number;
  probability: number;
}

export interface MysteryBoxData {
  id: string;
  name: string;
  description: string;
  image: string;
  price: {
    amount: number;
    currency: string;
  };
  tierName: string;
  tierLevel: number;
  rarity: string;
  dropRates: {
    common: number;
    uncommon: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  rewards: Reward[];
  maxSupply: number;
  currentSupply: number;
  remainingSupply: number;
  isActive: boolean;
  isUnlimited?: boolean;
  tierAttributes: {
    color?: string;
    borderColor?: string;
    glowColor?: string;
    bonusMultiplier: number;
  };
}

export const useMysteryBoxData = () => {
  const [boxes, setBoxes] = useState<MysteryBoxData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMysteryBoxes();
  }, []);

  // Helper function to calculate drop rates from rewards
  const calculateDropRates = (rewards: any[]) => {
    const dropRates = {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };

    if (!rewards || rewards.length === 0) {
      return { common: 50, uncommon: 30, rare: 15, epic: 4, legendary: 1 };
    }

    // Calculate based on probability
    rewards.forEach((reward) => {
      const prob = reward.probability || 0;
      if (prob >= 50) dropRates.common += prob;
      else if (prob >= 30) dropRates.uncommon += prob;
      else if (prob >= 15) dropRates.rare += prob;
      else if (prob >= 5) dropRates.epic += prob;
      else dropRates.legendary += prob;
    });

    return dropRates;
  };

  // Helper to determine tier based on price
  const getTierInfo = (price: number) => {
    if (price >= 50000) {
      return {
        tierName: "Kim Cương",
        tierLevel: 5,
        rarity: "legendary",
        color: "#b9f2ff",
        borderColor: "#00bfff",
        glowColor: "#e0ffff",
        bonusMultiplier: 3,
      };
    } else if (price >= 20000) {
      return {
        tierName: "Vàng",
        tierLevel: 4,
        rarity: "epic",
        color: "#ffd700",
        borderColor: "#daa520",
        glowColor: "#ffed4e",
        bonusMultiplier: 2,
      };
    } else if (price >= 10000) {
      return {
        tierName: "Bạc",
        tierLevel: 3,
        rarity: "rare",
        color: "#c0c0c0",
        borderColor: "#a8a8a8",
        glowColor: "#e8e8e8",
        bonusMultiplier: 1.5,
      };
    } else if (price >= 5000) {
      return {
        tierName: "Đồng",
        tierLevel: 2,
        rarity: "uncommon",
        color: "#cd7f32",
        borderColor: "#8b4513",
        glowColor: "#d4a574",
        bonusMultiplier: 1.2,
      };
    } else {
      return {
        tierName: "Thường",
        tierLevel: 1,
        rarity: "common",
        color: "#94a3b8",
        borderColor: "#64748b",
        glowColor: "#cbd5e1",
        bonusMultiplier: 1,
      };
    }
  };

  const fetchMysteryBoxes = async () => {
    try {
      setIsLoading(true);
      const response = await MysteryBoxService.getMysteryBoxes();

      if (response.success && response.data) {
        // Map API data to component format
        const apiData = response.data as any;
        const mysteryBoxes = apiData.mysteryBoxes || [];

        const mappedBoxes: MysteryBoxData[] = mysteryBoxes.map((box: any) => {
          const tierInfo = getTierInfo(box.price);
          const dropRates = calculateDropRates(box.rewards);

          return {
            id: box.id,
            name: box.name,
            description: box.description || "",
            image: box.image?.url
              ? `${config.API_BASE_URL}${box.image.url}`
              : "/nft-box.jpg",
            price: {
              amount: box.price,
              currency: "CAN",
            },
            tierName: tierInfo.tierName,
            tierLevel: tierInfo.tierLevel,
            rarity: tierInfo.rarity,
            dropRates,
            rewards: box.rewards || [],
            maxSupply: box.totalStock || 0,
            currentSupply: box.soldCount || 0,
            // Calculate remainingSupply from totalStock and soldCount
            // to avoid backend inconsistency
            // If unlimited, set remainingSupply to -1 to indicate unlimited
            remainingSupply: box.isUnlimited
              ? -1
              : (box.totalStock || 0) - (box.soldCount || 0),
            isActive: box.isActive,
            isUnlimited: box.isUnlimited || false,
            tierAttributes: {
              color: tierInfo.color,
              borderColor: tierInfo.borderColor,
              glowColor: tierInfo.glowColor,
              bonusMultiplier: tierInfo.bonusMultiplier,
            },
          };
        });

        setBoxes(mappedBoxes);
      } else {
        // Mock data for development
        setBoxes([
          {
            id: "1",
            name: "Hộp Thường",
            description: "Hộp bí ẩn cơ bản với phần thưởng hấp dẫn",
            image: "/nft-box.jpg",
            price: {
              amount: 10,
              currency: "CAN",
            },
            tierName: "Thường",
            tierLevel: 1,
            rarity: "common",
            dropRates: {
              common: 60,
              uncommon: 25,
              rare: 10,
              epic: 4,
              legendary: 1,
            },
            rewards: [
              {
                id: "1",
                rewardType: "token",
                description: "Nhận được từ 10 - 100 CAN",
                tokenMinQuantity: 10,
                tokenMaxQuantity: 100,
                probability: 70,
              },
              {
                id: "2",
                rewardType: "nft",
                description: "Nhận được 1 NFT có giá từ 100 - 500 CAN",
                nftPriceMin: 100,
                nftPriceMax: 500,
                probability: 30,
              },
            ],
            maxSupply: 1000,
            currentSupply: 234,
            remainingSupply: 766,
            isActive: true,
            tierAttributes: {
              color: "#94a3b8",
              borderColor: "#64748b",
              glowColor: "#cbd5e1",
              bonusMultiplier: 1,
            },
          },
          {
            id: "2",
            name: "Hộp Đồng",
            description: "Hộp bí ẩn hạng Đồng với tỷ lệ rare cao hơn",
            image: "/tier-bronze.jpg",
            price: {
              amount: 50,
              currency: "CAN",
            },
            tierName: "Đồng",
            tierLevel: 2,
            rarity: "uncommon",
            dropRates: {
              common: 40,
              uncommon: 35,
              rare: 15,
              epic: 8,
              legendary: 2,
            },
            maxSupply: 500,
            currentSupply: 123,
            remainingSupply: 377,
            isActive: true,
            tierAttributes: {
              color: "#cd7f32",
              borderColor: "#8b4513",
              glowColor: "#d4a574",
              bonusMultiplier: 1.2,
            },
          },
          {
            id: "3",
            name: "Hộp Bạc",
            description: "Hộp bí ẩn hạng Bạc với phần thưởng giá trị",
            image: "/tier-silver.jpg",
            price: {
              amount: 100,
              currency: "CAN",
            },
            tierName: "Bạc",
            tierLevel: 3,
            rarity: "rare",
            dropRates: {
              common: 30,
              uncommon: 35,
              rare: 20,
              epic: 12,
              legendary: 3,
            },
            maxSupply: 300,
            currentSupply: 89,
            remainingSupply: 211,
            isActive: true,
            tierAttributes: {
              color: "#c0c0c0",
              borderColor: "#a8a8a8",
              glowColor: "#e8e8e8",
              bonusMultiplier: 1.5,
            },
          },
          {
            id: "4",
            name: "Hộp Vàng",
            description: "Hộp bí ẩn hạng Vàng với phần thưởng đặc biệt",
            image: "/tier-gold.jpg",
            price: {
              amount: 250,
              currency: "CAN",
            },
            tierName: "Vàng",
            tierLevel: 4,
            rarity: "epic",
            dropRates: {
              common: 20,
              uncommon: 30,
              rare: 25,
              epic: 20,
              legendary: 5,
            },
            maxSupply: 150,
            currentSupply: 56,
            remainingSupply: 94,
            isActive: true,
            tierAttributes: {
              color: "#ffd700",
              borderColor: "#daa520",
              glowColor: "#ffed4e",
              bonusMultiplier: 2,
            },
          },
          {
            id: "5",
            name: "Hộp Kim Cương",
            description: "Hộp bí ẩn hạng Kim Cương - Phần thưởng cực kỳ hiếm",
            image: "/tier-platinum.jpg",
            price: {
              amount: 500,
              currency: "CAN",
            },
            tierName: "Kim Cương",
            tierLevel: 5,
            rarity: "legendary",
            dropRates: {
              common: 10,
              uncommon: 20,
              rare: 30,
              epic: 30,
              legendary: 10,
            },
            maxSupply: 50,
            currentSupply: 12,
            remainingSupply: 38,
            isActive: true,
            tierAttributes: {
              color: "#b9f2ff",
              borderColor: "#00bfff",
              glowColor: "#e0ffff",
              bonusMultiplier: 3,
            },
          },
        ]);
      }
    } catch (err) {
      setError("Không thể tải dữ liệu hộp bí ẩn");
      console.error("Error fetching mystery boxes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { boxes, isLoading, error, refetch: fetchMysteryBoxes };
};
