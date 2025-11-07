'use client';

import React from 'react';
import type { NFTCurrency } from '@/types/NFT';

interface InvestmentProgressBarProps {
  soldShares: number;
  totalShares: number;
  totalInvestors: number;
  pricePerShare: number;
  currency: NFTCurrency;
  className?: string;
}

export default function InvestmentProgressBar({
  soldShares,
  totalShares,
  totalInvestors,
  pricePerShare,
  currency,
  className = '',
}: InvestmentProgressBarProps) {
  // Tinh ty le phan tram da ban
  const percentage = totalShares > 0 ? (soldShares / totalShares) * 100 : 0;
  const availableShares = totalShares - soldShares;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Tien do ban</span>
          <span className="font-medium">
            {soldShares}/{totalShares} co phan
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Thong tin chi tiet */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Nha dau tu</span>
          <div className="flex items-center gap-1 font-medium">
            <span>👥</span>
            <span>{totalInvestors}</span>
          </div>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Gia/co phan</span>
          <div className="font-medium">
            {pricePerShare} <span className="uppercase">{currency}</span>
          </div>
        </div>
      </div>

      {/* So co phan con lai */}
      {availableShares > 0 && (
        <div className="text-xs text-emerald-600 dark:text-emerald-400">
          Con {availableShares} co phan co san
        </div>
      )}
      {availableShares === 0 && (
        <div className="text-xs text-red-600 dark:text-red-400 font-medium">
          Da ban het
        </div>
      )}
    </div>
  );
}
