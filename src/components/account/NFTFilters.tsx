'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Filter, X } from 'lucide-react';
import type { AdvancedFilters } from '@/hooks/useMyNFTCollection';
import type { NFTType, NFTLevel } from '@/types/NFT';

interface NFTFiltersProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onReset: () => void;
}

export function NFTFilters({ filters, onFiltersChange, onReset }: NFTFiltersProps) {
  // Local state cho price inputs (de hien thi gia tri nhap vao)
  const [minPrice, setMinPrice] = useState(filters.priceRange.min.toString());
  const [maxPrice, setMaxPrice] = useState(
    filters.priceRange.max === Infinity ? '' : filters.priceRange.max.toString()
  );

  // Handler thay doi type
  const handleTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      type: value as NFTType | 'all',
    });
  };

  // Handler thay doi level
  const handleLevelChange = (value: string) => {
    onFiltersChange({
      ...filters,
      level: value as NFTLevel | 'all',
    });
  };

  // Handler apply price range
  const handleApplyPriceRange = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;

    onFiltersChange({
      ...filters,
      priceRange: { min, max },
    });
  };

  // Handler reset filters
  const handleReset = () => {
    setMinPrice('0');
    setMaxPrice('');
    onReset();
  };

  // Kiem tra xem co filter nao dang active khong
  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.level !== 'all' ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < Infinity;

  return (
    <Card className="glass p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        {/* <h3 className="font-semibold">Lọc NFT</h3> */}
      <div className="flex justify-center gap-4">
        {/* Type Filter */}
        <div className="space-y-2">
          {/* <Label htmlFor="type-filter">Loại NFT</Label> */}
          <Select value={filters.type} onValueChange={handleTypeChange}>
            <SelectTrigger id="type-filter">
              <SelectValue placeholder="Chọn loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="normal">NFT Thường</SelectItem>
              <SelectItem value="rank">NFT Xếp hạng</SelectItem>
              <SelectItem value="mysteryBox">Hộp bí ẩn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Level Filter */}
        <div className="space-y-2">
          {/* <Label htmlFor="level-filter">Độ hiếm (Level)</Label> */}
          <Select value={filters.level} onValueChange={handleLevelChange}>
            <SelectTrigger id="level-filter">
              <SelectValue placeholder="Chọn độ hiếm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="1">Thường</SelectItem>
              <SelectItem value="2">Bạc</SelectItem>
              <SelectItem value="3">Vàng</SelectItem>
              <SelectItem value="4">Bạch kim</SelectItem>
              <SelectItem value="5">Kim cương</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Price Filter */}
        <div className="space-y-2">
          {/* <Label htmlFor="min-price">Giá tối thiểu</Label> */}
          <div className="flex gap-2">
            <Input
              id="min-price"
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={handleApplyPriceRange}
              min="0"
            />
          </div>
        </div>

        {/* Max Price Filter */}
        <div className="space-y-2">
          {/* <Label htmlFor="max-price">Giá tối đa</Label> */}
          <div className="flex gap-2">
            <Input
              id="max-price"
              type="number"
              placeholder="Không giới hạn"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={handleApplyPriceRange}
              min="0"
            />
          </div>
        </div>
      </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="ml-auto"
          >
            <X className="w-4 h-4 mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

    </Card>
  );
}