'use client';

import { useSelector } from 'react-redux';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Copy, Check } from 'lucide-react';
import type { RootState } from '@/stores/store';
import type { TransactionHistoryItem, TransactionDirection } from '@/types/TransactionHistory';
import { TRANSACTION_TYPE_LABELS, CURRENCY_LABELS } from '@/types/TransactionHistory';
import { useState } from 'react';

interface TransactionTableProps {
  transactions: TransactionHistoryItem[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Xác định direction (sent/received)
  const getDirection = (tx: TransactionHistoryItem): TransactionDirection => {
    if (!user?.walletAddress) return 'received';
    return tx.from.toLowerCase() === user.walletAddress.toLowerCase() ? 'sent' : 'received';
  };

  // Badge màu cho transaction type
  const getTypeBadgeClass = (type: string) => {
    const colors: Record<string, string> = {
      investment: 'bg-blue-100 text-blue-700 border-blue-200',
      staking: 'bg-green-100 text-green-700 border-green-200',
      'buy-nft': 'bg-purple-100 text-purple-700 border-purple-200',
      'sell-nft': 'bg-orange-100 text-orange-700 border-orange-200',
      airdrop: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      other: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[type] || colors.other;
  };

  // Copy hash to clipboard
  const copyToClipboard = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Format address: rút gọn
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Check nếu address là user wallet
  const isUserWallet = (address: string) => {
    if (!user?.walletAddress) return false;
    return address.toLowerCase() === user.walletAddress.toLowerCase();
  };

  // Empty state
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 glass rounded-lg">
        <div className="text-muted-foreground mb-2">Chưa có giao dịch nào</div>
        <div className="text-sm text-muted-foreground">
          Hãy thử điều chỉnh bộ lọc hoặc bắt đầu giao dịch đầu tiên của bạn!
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Từ / Đến</TableHead>
              <TableHead className="text-right">Số tiền</TableHead>
              <TableHead>Hash</TableHead>
              <TableHead>Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => {
              const direction = getDirection(tx);
              const isSent = direction === 'sent';

              return (
                <TableRow key={tx.id}>
                  {/* Direction Icon */}
                  <TableCell>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSent ? 'bg-red-500/20' : 'bg-green-500/20'
                      }`}
                    >
                      {isSent ? (
                        <ArrowUp className="w-4 h-4 text-red-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </TableCell>

                  {/* Transaction Type Badge */}
                  <TableCell>
                    <Badge className={getTypeBadgeClass(tx.transactionType)}>
                      {TRANSACTION_TYPE_LABELS[tx.transactionType]}
                    </Badge>
                  </TableCell>

                  {/* From / To */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground">Từ:</span>
                        <code
                          className={`text-xs ${
                            isUserWallet(tx.from)
                              ? 'font-bold text-primary underline'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {formatAddress(tx.from)}
                        </code>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground">Đến:</span>
                        <code
                          className={`text-xs ${
                            isUserWallet(tx.to)
                              ? 'font-bold text-primary underline'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {formatAddress(tx.to)}
                        </code>
                      </div>
                    </div>
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="text-right">
                    <div className="font-semibold">
                      {tx.amount.toLocaleString('vi-VN')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {CURRENCY_LABELS[tx.currency]}
                    </div>
                  </TableCell>

                  {/* Transaction Hash */}
                  <TableCell>
                    {tx.transactionHash && tx.transactionHash.trim() ? (
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-muted-foreground">
                          {formatAddress(tx.transactionHash)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(tx.transactionHash)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          title="Sao chép"
                        >
                          {copiedHash === tx.transactionHash ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-yellow-600">Đang xử lý...</span>
                    )}
                  </TableCell>

                  {/* Timestamp */}
                  <TableCell>
                    <div className="text-sm">
                      {new Date(tx.createdAt).toLocaleString('vi-VN')}
                    </div>
                    {tx.notes && (
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]" title={tx.notes}>
                        {tx.notes}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
