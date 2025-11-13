import { useState, useEffect } from "react";
import { MysteryBoxService } from "@/api/services";
import { config, TOKEN_DEAULT_CURRENCY } from "@/api/config";

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
  status: "available" | "out_of_stock" | "discontinued";
  isFeatured: boolean;
  publishedAt?: string;
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

        // Helper to construct full image URL
        const getImageUrl = (imageData: any): string => {
          if (!imageData?.url) return "/nft-box.jpg";

          const imageUrl = imageData.url;
          // Nếu URL đã là full URL (bắt đầu bằng http), dùng trực tiếp
          if (imageUrl.startsWith("http")) {
            return imageUrl;
          }
          // Nếu là relative path, ghép với API_BASE_URL
          return `${config.API_BASE_URL}${imageUrl}`;
        };

        const mappedBoxes: MysteryBoxData[] = mysteryBoxes.map((box: any) => {
          const tierInfo = getTierInfo(box.price);
          const dropRates = calculateDropRates(box.rewards);

          return {
            id: box.id,
            name: box.name,
            description: box.description || "",
            image: getImageUrl(box.image),
            price: {
              amount: box.price,
              currency: { TOKEN_DEAULT_CURRENCY },
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
            status: box.status || "available",
            isFeatured: box.isFeatured || false,
            publishedAt: box.publishedAt,
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
        setBoxes([]);
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
