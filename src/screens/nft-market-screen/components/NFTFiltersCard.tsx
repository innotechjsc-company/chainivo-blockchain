"use client";

import { useEffect, useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { NFTFiltersState } from "../hooks";

interface NFTFiltersCardProps {
  filters: NFTFiltersState;
  onFiltersChange: (filters: NFTFiltersState) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onSearch?: (filters: Partial<NFTFiltersState>) => Promise<boolean> | void;
}

export const NFTFiltersCard = ({
  filters,
  onFiltersChange,
  hasActiveFilters,
  onResetFilters,
  onSearch,
}: NFTFiltersCardProps) => {
  const [showFilters, setShowFilters] = useState(true);
  const [pendingRange, setPendingRange] = useState<[number, number]>(
    filters.priceRange
  );

  const rarityOptions = [
    { label: "Thường", value: "1", color: "bg-gray-500/20 text-gray-300" },
    { label: "Vàng", value: "2", color: "bg-yellow-500/20 text-yellow-300" },
    { label: "Bạch kim", value: "3", color: "bg-blue-500/20 text-blue-300" },
    { label: "Kim cương", value: "4", color: "bg-pink-500/20 text-pink-300" },
  ];

  const toggleRarity = (rarity: string) => {
    const newRarity = filters.rarity.includes(rarity)
      ? filters.rarity.filter((r) => r !== rarity)
      : [...filters.rarity, rarity];
    onFiltersChange({ ...filters, rarity: newRarity });
    // Removed automatic API call - only update local state
  };

  const handleApplyFilters = async () => {
    // Update filters with pending price range
    const updatedFilters = { ...filters, priceRange: pendingRange };
    onFiltersChange(updatedFilters);

    // Call API only when user clicks apply button
    if (onSearch) {
      try {
        await onSearch(updatedFilters);
      } catch (e) {
        console.error("Error applying filters:", e);
      }
    }
  };

  useEffect(() => {
    setPendingRange(filters.priceRange);
  }, [filters.priceRange]);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onResetFilters} className="gap-2">
            <X className="w-4 h-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {showFilters && (
        <Card className="glass">
          <CardContent className="p-6 space-y-6">
            {/* Type Filter */}
            <div>
              <label className="text-sm font-semibold mb-3 block">
                Tìm kiếm NFT
              </label>
              {/* <ToggleGroup
                type="single"
                value={filters.type}
                onValueChange={(value) =>
                  value && onFiltersChange({ ...filters, type: value })
                }
                className="justify-start flex-wrap"
              >
                <ToggleGroupItem
                  value="all"
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  Tất cả
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="tier"
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  NFT Hạng
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="other"
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  NFT Khác
                </ToggleGroupItem>
              </ToggleGroup> */}
            </div>

            {/* Rarity Filter */}
            <div>
              <label className="text-sm font-semibold mb-3 block">
                Độ hiếm (
                {filters.rarity.length > 0 ? filters.rarity.length : "Tất cả"})
              </label>
              <div className="flex flex-wrap gap-2">
                {rarityOptions.map((option) => (
                  <Badge
                    key={option.value}
                    className={`cursor-pointer transition-all ${
                      filters.rarity.includes(option.value)
                        ? option.color
                        : "bg-muted/20 text-muted-foreground hover:bg-muted/40"
                    }`}
                    onClick={() => toggleRarity(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="text-sm font-semibold mb-3 block">
                Khoảng giá: {pendingRange[0]} CAN - {pendingRange[1]} CAN
              </label>
              <Slider
                min={0}
                max={1000000}
                step={1}
                value={pendingRange}
                onValueChange={(v) =>
                  setPendingRange([
                    Math.round((v as [number, number])[0]),
                    Math.round((v as [number, number])[1]),
                  ])
                }
                className="w-full"
              />
            </div>

            {/* Apply Filters Button */}
            <div className="pt-4 border-t border-border/50">
              <Button
                onClick={handleApplyFilters}
                className="w-full cursor-pointer"
                variant="default"
              >
                Áp dụng bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
