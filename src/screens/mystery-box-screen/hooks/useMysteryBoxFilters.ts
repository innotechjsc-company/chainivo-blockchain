import { useState, useMemo } from "react";
import { MysteryBoxData } from "./useMysteryBoxData";

export interface MysteryBoxFilters {
  priceRange: [number, number];
  status: "all" | "available" | "out_of_stock" | "discontinued";
  isFeatured: "all" | "featured" | "regular";
  sortBy:
    | "price-asc"
    | "price-desc"
    | "newest"
    | "supply-asc"
    | "supply-desc";
}

export const useMysteryBoxFilters = (boxes: MysteryBoxData[]) => {
  const [filters, setFilters] = useState<MysteryBoxFilters>({
    priceRange: [0, 100000], // Max price in CAN tokens
    status: "all",
    isFeatured: "all",
    sortBy: "price-asc",
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

    // Filter by status
    if (filters.status !== "all") {
      result = result.filter((box) => box.status === filters.status);
    }

    // Filter by featured
    if (filters.isFeatured === "featured") {
      result = result.filter((box) => box.isFeatured === true);
    } else if (filters.isFeatured === "regular") {
      result = result.filter((box) => box.isFeatured === false);
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.price.amount - b.price.amount;
        case "price-desc":
          return b.price.amount - a.price.amount;
        case "newest":
          // Sort by publishedAt (newest first)
          const dateA = new Date(a.publishedAt || 0).getTime();
          const dateB = new Date(b.publishedAt || 0).getTime();
          return dateB - dateA;
        case "supply-asc":
          return a.remainingSupply - b.remainingSupply;
        case "supply-desc":
          return b.remainingSupply - a.remainingSupply;
        default:
          return 0;
      }
    });

    return result;
  }, [boxes, filters]);

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 100000],
      status: "all",
      isFeatured: "all",
      sortBy: "price-asc",
    });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 100000 ||
      filters.status !== "all" ||
      filters.isFeatured !== "all"
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
