"use client";

import { useEffect, useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { NFTFiltersState } from "@/screens/nft-market-screen/hooks";
import { TOKEN_DEAULT_CURRENCY } from "@/api/config";

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
  const [showFilters, setShowFilters] = useState(false);
  const [pendingRange, setPendingRange] = useState<[number, number]>(
    filters.priceRange
  );
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    type: true,
    rarity: true,
    status: true,
    shares: true,
    price: true,
  });

  // Luôn ẩn bộ lọc khi component mount hoặc load lại
  useEffect(() => {
    setShowFilters(false);
  }, []);

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const typeOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Biệt thự", value: "tier" },
    { label: "Đầu tư", value: "investment" },
  ];

  const rarityOptions = [
    { label: "Thường ", value: "1", color: "bg-gray-500/20 text-gray-300" },
    {
      label: "Bạc ",
      value: "2",
      color: "bg-gray-500/20 text-gray-300",
    },
    {
      label: "Vàng ",
      value: "3",
      color: "bg-yellow-500/20 text-yellow-300",
    },
    {
      label: "Bạch kim ",
      value: "4",
      color: "bg-blue-500/20 text-blue-300",
    },
    {
      label: "Kim cương ",
      value: "5",
      color: "bg-pink-500/20 text-pink-300",
    },
  ];

  const statusOptions = [
    { label: "Đang bán", value: "active", icon: "🟢" },
    { label: "Không bán", value: "inactive", icon: "🔴" },
  ];

  const sharesOptions = [
    { label: "Còn cổ phần", value: "available" },
    { label: "Hết cổ phần", value: "sold_out" },
  ];

  const toggleRarity = (rarity: string) => {
    // Single-select: nếu click vào rarity đã chọn thì bỏ chọn, nếu click vào rarity khác thì thay thế
    const newRarity = filters.rarity.includes(rarity)
      ? [] // Bỏ chọn nếu đã được chọn
      : [rarity]; // Chỉ chọn rarity mới, thay thế tất cả các lựa chọn trước đó
    onFiltersChange({ ...filters, rarity: newRarity });
  };

  const handleApplyFilters = async () => {
    // Cập nhật filters với khoảng giá đã chọn
    const updatedFilters = { ...filters, priceRange: pendingRange };
    onFiltersChange(updatedFilters);

    if (onSearch) {
      try {
        // Gọi searchMarketplace với filters đã cập nhật, bao gồm:
        // - level (rarity/độ hiếm) từ filters.rarity
        // - minPrice và maxPrice từ pendingRange (khoảng giá)
        const success = await onSearch(updatedFilters);
        if (success) {
          // Đóng bộ lọc sau khi tìm kiếm thành công (optional)
          // setShowFilters(false);
        }
      } catch (e) {
        console.error("Error applying filters:", e);
      }
    }
  };

  useEffect(() => {
    setPendingRange(filters.priceRange);
  }, [filters.priceRange]);

  // Helper to count active filters in a section
  const getActiveCount = (section: string): number => {
    switch (section) {
      case "type":
        return filters.type !== "all" ? 1 : 0;
      case "rarity":
        return filters.rarity.length;
      case "status":
        return (filters.status || []).length;
      case "shares":
        return (filters.shares || []).length;
      case "price":
        return filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000000
          ? 1
          : 0;
      default:
        return 0;
    }
  };

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
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="ml-2 bg-cyan-500/20 text-cyan-300"
            >
              {(filters.rarity.length || 0) +
                (filters.status?.length || 0) +
                (filters.shares?.length || 0) +
                (filters.type !== "all" ? 1 : 0) +
                (filters.priceRange[0] !== 0 ||
                filters.priceRange[1] !== 1000000
                  ? 1
                  : 0)}
            </Badge>
          )}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onResetFilters}
            className="gap-2 text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
            Xóa tất cả
          </Button>
        )}
      </div>

      {showFilters && (
        <Card className="glass border-cyan-500/20">
          <CardContent className="p-6 space-y-4">
            {/* Rarity Filter Section */}
            <div className="border-b border-border/30 pb-4">
              <button
                onClick={() => toggleSection("rarity")}
                className="w-full flex items-center justify-between mb-3 hover:text-cyan-400 transition-colors"
              >
                <label className="text-sm font-semibold cursor-pointer">
                  Độ hiếm
                  {getActiveCount("rarity") > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-cyan-500/20 text-cyan-300 text-xs"
                    >
                      {getActiveCount("rarity")}
                    </Badge>
                  )}
                </label>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.rarity ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
              {expandedSections.rarity && (
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
              )}
            </div>

            {/* Price Range Filter Section */}
            <div className="border-b border-border/30 pb-4">
              <button
                onClick={() => toggleSection("price")}
                className="w-full flex items-center justify-between mb-3 hover:text-cyan-400 transition-colors"
              >
                <label className="text-sm font-semibold cursor-pointer">
                  Khoảng giá
                  {getActiveCount("price") > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-cyan-500/20 text-cyan-300 text-xs"
                    >
                      {getActiveCount("price")}
                    </Badge>
                  )}
                </label>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.price ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
              {expandedSections.price && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      <span className="text-cyan-400 font-semibold">
                        {pendingRange[0].toLocaleString("vi-VN")}
                      </span>
                      {TOKEN_DEAULT_CURRENCY}
                    </span>
                    <span>~</span>
                    <span>
                      <span className="text-purple-400 font-semibold">
                        {pendingRange[1].toLocaleString("vi-VN")}
                      </span>
                      {TOKEN_DEAULT_CURRENCY}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={1000000}
                    step={10000}
                    value={pendingRange}
                    onValueChange={(v) =>
                      setPendingRange([
                        Math.round((v as [number, number])[0]),
                        Math.round((v as [number, number])[1]),
                      ])
                    }
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground text-center pt-1">
                    Khoảng giá: {pendingRange[0].toLocaleString("vi-VN")} -{" "}
                    {pendingRange[1].toLocaleString("vi-VN")}{" "}
                    {TOKEN_DEAULT_CURRENCY}
                  </div>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <div className="pt-2">
              <Button
                onClick={handleApplyFilters}
                className="w-full cursor-pointer bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold"
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
