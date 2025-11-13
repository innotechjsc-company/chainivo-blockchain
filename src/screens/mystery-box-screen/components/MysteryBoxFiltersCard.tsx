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
import { TOKEN_DEAULT_CURRENCY } from "@/api/config";

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
  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "available", label: "Còn hàng" },
    { value: "out_of_stock", label: "Hết hàng" },
    { value: "discontinued", label: "Ngừng bán" },
  ];

  const featuredOptions = [
    { value: "all", label: "Tất cả" },
    { value: "featured", label: "Nổi bật" },
    { value: "regular", label: "Thường" },
  ];

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
          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Khoảng giá ({TOKEN_DEAULT_CURRENCY}):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                value={filters.priceRange[0]}
                onChange={(e) => {
                  const newMin = parseInt(e.target.value) || 0;
                  onFiltersChange({
                    ...filters,
                    priceRange: [newMin, filters.priceRange[1]],
                  });
                }}
                className="w-24 px-2 py-1 border border-border rounded text-sm"
                placeholder="Min"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                min="0"
                value={filters.priceRange[1]}
                onChange={(e) => {
                  const newMax = parseInt(e.target.value) || 100000;
                  onFiltersChange({
                    ...filters,
                    priceRange: [filters.priceRange[0], newMax],
                  });
                }}
                className="w-24 px-2 py-1 border border-border rounded text-sm"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Status and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Trạng thái:
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    status: value as typeof filters.status,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Featured */}
            <div>
              <label className="text-sm font-medium mb-2 block">Nổi bật:</label>
              <Select
                value={filters.isFeatured}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    isFeatured: value as typeof filters.isFeatured,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {featuredOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                <SelectItem value="price-asc">Giá: Thấp đến Cao</SelectItem>
                <SelectItem value="price-desc">Giá: Cao đến Thấp</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="supply-asc">Số lượng: Ít nhất</SelectItem>
                <SelectItem value="supply-desc">
                  Số lượng: Nhiều nhất
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
