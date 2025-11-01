import { useState, useMemo } from "react";
import { MysteryBoxData } from "./useMysteryBoxData";

export interface MysteryBoxFilters {
  priceRange: [number, number];
  tierLevels: number[];
  rarities: string[];
  availability: "all" | "available" | "soldOut";
  sortBy:
    | "price-asc"
    | "price-desc"
    | "supply-asc"
    | "supply-desc"
    | "tier-asc"
    | "tier-desc";
}

export const useMysteryBoxFilters = (boxes: MysteryBoxData[]) => {
  const [filters, setFilters] = useState<MysteryBoxFilters>({
    priceRange: [0, 1000000], // Increase max to 1M CAN
    tierLevels: [],
    rarities: [],
    availability: "all",
    sortBy: "tier-asc",
  });

  const filteredBoxes = useMemo(() => {
    // Ensure boxes is an array
    const boxesArray = Array.isArray(boxes) ? boxes : [];
    let result = [...boxesArray];

    // Filter by price range
    result = result.filter(
      (box) =>
        box.price.amount >= filters.priceRange[0] &&
        box.price.amount <= filters.priceRange[1]
    );

    // Filter by tier levels
    if (filters.tierLevels.length > 0) {
      result = result.filter((box) =>
        filters.tierLevels.includes(box.tierLevel)
      );
    }

    // Filter by rarities
    if (filters.rarities.length > 0) {
      result = result.filter((box) => filters.rarities.includes(box.rarity));
    }

    // Filter by availability
    if (filters.availability === "available") {
      result = result.filter((box) => box.isActive && box.remainingSupply > 0);
    } else if (filters.availability === "soldOut") {
      result = result.filter((box) => box.remainingSupply === 0);
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.price.amount - b.price.amount;
        case "price-desc":
          return b.price.amount - a.price.amount;
        case "supply-asc":
          return a.remainingSupply - b.remainingSupply;
        case "supply-desc":
          return b.remainingSupply - a.remainingSupply;
        case "tier-asc":
          return a.tierLevel - b.tierLevel;
        case "tier-desc":
          return b.tierLevel - a.tierLevel;
        default:
          return 0;
      }
    });

    return result;
  }, [boxes, filters]);

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000000], // Match initial state
      tierLevels: [],
      rarities: [],
      availability: "all",
      sortBy: "tier-asc",
    });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.tierLevels.length > 0 ||
      filters.rarities.length > 0 ||
      filters.availability !== "all" ||
      filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 1000000
    );
  }, [filters]);

  return {
    filters,
    setFilters,
    filteredBoxes,
    resetFilters,
    hasActiveFilters,
  };
};
