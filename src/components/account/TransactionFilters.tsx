'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';
import type { TransactionHistoryFilters } from '@/types/TransactionHistory';
import { TRANSACTION_TYPE_LABELS, CURRENCY_LABELS } from '@/types/TransactionHistory';

interface TransactionFiltersProps {
  filters: TransactionHistoryFilters;
  onFilterChange: (key: keyof TransactionHistoryFilters, value: any) => void;
  onReset: () => void;
}

export function TransactionFilters({
  filters,
  onFilterChange,
  onReset,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo hash, ghi chú, địa chỉ..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange('searchQuery', e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Transaction Type Filter */}
      <Select
        value={filters.transactionType}
        onValueChange={(value) => onFilterChange('transactionType', value)}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Loai giao dich" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="investment">Đầu tư</SelectItem>
          <SelectItem value="staking">Staking</SelectItem>
          <SelectItem value="buy-nft">Mua NFT</SelectItem>
          <SelectItem value="sell-nft">Bán NFT</SelectItem>
          <SelectItem value="airdrop">Airdrop</SelectItem>
          <SelectItem value="other">Khác</SelectItem>
        </SelectContent>
      </Select>

      {/* Currency Filter */}
      <Select
        value={filters.currency}
        onValueChange={(value) => onFilterChange('currency', value)}
      >
        <SelectTrigger className="w-full md:w-[150px]">
          <SelectValue placeholder="Tien te" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="usdc">USDC</SelectItem>
          <SelectItem value="polygon">POLYGON</SelectItem>
          <SelectItem value="can">CAN</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset Button */}
      <Button variant="outline" onClick={onReset} className="gap-2">
        <RefreshCw className="w-4 h-4" />
        Reset
      </Button>
    </div>
  );
}
