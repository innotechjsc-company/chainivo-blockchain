import { useMemo } from "react";
import { MysteryBoxData } from "./useMysteryBoxData";

export interface MysteryBoxStats {
  totalBoxes: number;
  totalSupply: number;
  soldBoxes: number;
  remainingBoxes: number;
  totalValue: number;
  soldValue: number;
  averagePrice: number;
  soldPercentage: number;
}

export const useMysteryBoxStats = (boxes: MysteryBoxData[]) => {
  const stats = useMemo(() => {
    // Ensure boxes is an array
    const boxesArray = Array.isArray(boxes) ? boxes : [];

    if (boxesArray.length === 0) {
      return {
        totalBoxes: 0,
        totalSupply: 0,
        soldBoxes: 0,
        remainingBoxes: 0,
        totalValue: 0,
        soldValue: 0,
        averagePrice: 0,
        soldPercentage: 0,
      };
    }

    const totalBoxes = boxesArray.length;
    const totalSupply = boxesArray.reduce((sum, box) => sum + box.maxSupply, 0);
    const soldBoxes = boxesArray.reduce(
      (sum, box) => sum + box.currentSupply,
      0
    );
    const remainingBoxes = boxesArray.reduce(
      (sum, box) => sum + box.remainingSupply,
      0
    );
    const totalValue = boxesArray.reduce(
      (sum, box) => sum + box.price.amount * box.maxSupply,
      0
    );
    const soldValue = boxesArray.reduce(
      (sum, box) => sum + box.price.amount * box.currentSupply,
      0
    );
    const averagePrice =
      boxesArray.length > 0
        ? boxesArray.reduce((sum, box) => sum + box.price.amount, 0) /
          boxesArray.length
        : 0;
    const soldPercentage =
      totalSupply > 0 ? (soldBoxes / totalSupply) * 100 : 0;

    return {
      totalBoxes,
      totalSupply,
      soldBoxes,
      remainingBoxes,
      totalValue,
      soldValue,
      averagePrice,
      soldPercentage,
    };
  }, [boxes]);

  // Mock chart data
  const chartData = useMemo(() => {
    return [
      { name: "Thường", value: 234, color: "#94a3b8" },
      { name: "Đồng", value: 123, color: "#cd7f32" },
      { name: "Bạc", value: 89, color: "#c0c0c0" },
      { name: "Vàng", value: 56, color: "#ffd700" },
      { name: "Kim Cương", value: 12, color: "#b9f2ff" },
    ];
  }, []);

  return { stats, chartData };
};
