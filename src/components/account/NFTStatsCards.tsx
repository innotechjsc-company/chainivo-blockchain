'use client';

import { Card } from '@/components/ui/card';
import { Package, ShoppingBag, DollarSign, AlertCircle } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface NFTStatsCardsProps {
  totalNFTs: number;
  onSale: number;
  notListed: number;
  totalValue: number;
  inactive: number;
}

export function NFTStatsCards({
  totalNFTs,
  onSale,
  notListed,
  totalValue,
  inactive,
}: NFTStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Total NFTs */}
      <Card className="glass p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Tổng NFT</div>
            <div className="text-2xl font-bold">{totalNFTs}</div>
          </div>
        </div>
      </Card>

      {/* On Sale */}
      <Card className="glass p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Đang bán</div>
            <div className="text-2xl font-bold text-green-400">{onSale}</div>
          </div>
        </div>
      </Card>

      {/* Not Listed */}
      <Card className="glass p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Chưa bán</div>
            <div className="text-2xl font-bold">{notListed}</div>
          </div>
        </div>
      </Card>

      {/* Total Value */}
      <Card className="glass p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Tổng giá trị</div>
            <div className="text-xl font-bold gradient-text">
              {formatNumber(totalValue)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
