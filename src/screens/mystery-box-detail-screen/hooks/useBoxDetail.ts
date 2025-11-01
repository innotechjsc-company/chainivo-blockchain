import { useState, useEffect } from "react";
import { MysteryBoxService } from "@/api/services";
import type { MysteryBoxData } from "@/screens/mystery-box-screen/hooks/useMysteryBoxData";
import { config } from "@/api/config";

export const useBoxDetail = (id: string) => {
  const [box, setBox] = useState<MysteryBoxData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchBoxDetail();
  }, [id]);

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

  const fetchBoxDetail = async () => {
    try {
      setIsLoading(true);
      const response = await MysteryBoxService.getBoxDetail(id);

      console.log("Box Detail API Response:", response);

      // Handle both wrapped and unwrapped responses
      let apiBox: any = null;

      if (response.success && response.data) {
        apiBox = response.data;
      } else if (response && typeof response === "object" && "id" in response) {
        // Direct response without wrapper
        apiBox = response;
      }

      if (apiBox && apiBox.id) {
        const tierInfo = getTierInfo(apiBox.price);

        const mappedBox: MysteryBoxData = {
          id: apiBox.id,
          name: apiBox.name,
          description: apiBox.description || "",
          image: apiBox.image?.url
            ? `${config.API_BASE_URL}${apiBox.image.url}`
            : "/nft-box.jpg",
          price: {
            amount: apiBox.price,
            currency: "CAN",
          },
          tierName: tierInfo.tierName,
          tierLevel: tierInfo.tierLevel,
          rarity: tierInfo.rarity,
          dropRates: {
            common: 0,
            uncommon: 0,
            rare: 0,
            epic: 0,
            legendary: 0,
          },
          rewards: apiBox.rewards || [],
          maxSupply: apiBox.totalStock || 0,
          currentSupply: apiBox.soldCount || 0,
          // If unlimited, set remainingSupply to -1 to indicate unlimited
          remainingSupply: apiBox.isUnlimited
            ? -1
            : (apiBox.totalStock || 0) - (apiBox.soldCount || 0),
          isActive: apiBox.isActive,
          isUnlimited: apiBox.isUnlimited || false,
          tierAttributes: {
            color: tierInfo.color,
            borderColor: tierInfo.borderColor,
            glowColor: tierInfo.glowColor,
            bonusMultiplier: tierInfo.bonusMultiplier,
          },
        };

        console.log("Mapped Box:", mappedBox);
        setBox(mappedBox);
      } else {
        setError("Không tìm thấy hộp bí ẩn");
      }
    } catch (err) {
      setError("Không thể tải thông tin hộp bí ẩn");
      console.error("Error fetching box detail:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { box, isLoading, error, refetch: fetchBoxDetail };
};
