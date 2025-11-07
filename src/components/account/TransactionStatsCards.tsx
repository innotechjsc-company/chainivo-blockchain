'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { TransactionHistoryStats } from '@/types/TransactionHistory';

interface TransactionStatsCardsProps extends TransactionHistoryStats {}

export function TransactionStatsCards({
  totalTransactions,
  completedCount,
  pendingCount,
  failedCount,
}: TransactionStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Transactions */}
      <Card className="glass p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Tổng giao dịch </div>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </div>
        </div>
      </Card>

      {/* Completed */}
      <Card className="glass p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Hoàn thành </div>
            <div className="text-2xl font-bold text-green-400">{completedCount}</div>
          </div>
        </div>
      </Card>

      {/* Pending */}
      <Card className="glass p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Đang xử lý </div>
            <div className="text-2xl font-bold text-yellow-400">{pendingCount}</div>
          </div>
        </div>
      </Card>

      {/* Failed */}
      <Card className="glass p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Thất bại</div>
            <div className="text-2xl font-bold text-red-400">{failedCount}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
