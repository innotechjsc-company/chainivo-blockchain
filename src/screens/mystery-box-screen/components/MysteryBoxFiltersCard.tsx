"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { MysteryBoxFilters } from "../hooks";

interface MysteryBoxFiltersCardProps {
  filters: MysteryBoxFilters;
  onFiltersChange: (filters: MysteryBoxFilters) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const MysteryBoxFiltersCard = ({
  filters,
  onFiltersChange,
  hasActiveFilters,
  onResetFilters,
}: MysteryBoxFiltersCardProps) => {
  const tierLevels = [
    { value: 1, label: "Thường" },
    { value: 2, label: "Đồng" },
    { value: 3, label: "Bạc" },
    { value: 4, label: "Vàng" },
    { value: 5, label: "Kim Cương" },
  ];

  const rarities = [
    { value: "common", label: "Thường" },
    { value: "uncommon", label: "Không phổ biến" },
    { value: "rare", label: "Hiếm" },
    { value: "epic", label: "Sử thi" },
    { value: "legendary", label: "Huyền thoại" },
  ];

  const toggleTierLevel = (level: number) => {
    const newLevels = filters.tierLevels.includes(level)
      ? filters.tierLevels.filter((l) => l !== level)
      : [...filters.tierLevels, level];
    onFiltersChange({ ...filters, tierLevels: newLevels });
  };

  const toggleRarity = (rarity: string) => {
    const newRarities = filters.rarities.includes(rarity)
      ? filters.rarities.filter((r) => r !== rarity)
      : [...filters.rarities, rarity];
    onFiltersChange({ ...filters, rarities: newRarities });
  };

  return (
    <Card className="glass mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <CardTitle>Bộ Lọc</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onResetFilters}>
              <X className="w-4 h-4 mr-2" />
              Xóa lọc
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tier Levels */}
          <div>
            <label className="text-sm font-medium mb-2 block">Hạng:</label>
            <div className="flex flex-wrap gap-2">
              {tierLevels.map((tier) => (
                <Badge
                  key={tier.value}
                  variant={
                    filters.tierLevels.includes(tier.value)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleTierLevel(tier.value)}
                >
                  {tier.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rarities */}
          <div>
            <label className="text-sm font-medium mb-2 block">Độ hiếm:</label>
            <div className="flex flex-wrap gap-2">
              {rarities.map((rarity) => (
                <Badge
                  key={rarity.value}
                  variant={
                    filters.rarities.includes(rarity.value)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleRarity(rarity.value)}
                >
                  {rarity.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Availability and Sort */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Availability */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Trạng thái:
              </label>
              <Select
                value={filters.availability}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    availability: value as typeof filters.availability,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="available">Còn hàng</SelectItem>
                  <SelectItem value="soldOut">Hết hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium mb-2 block">Sắp xếp:</label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    sortBy: value as typeof filters.sortBy,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tier-asc">Hạng: Thấp đến Cao</SelectItem>
                  <SelectItem value="tier-desc">Hạng: Cao đến Thấp</SelectItem>
                  <SelectItem value="price-asc">Giá: Thấp đến Cao</SelectItem>
                  <SelectItem value="price-desc">Giá: Cao đến Thấp</SelectItem>
                  <SelectItem value="supply-asc">Số lượng: Ít nhất</SelectItem>
                  <SelectItem value="supply-desc">
                    Số lượng: Nhiều nhất
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
