"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

interface TransactionHistory {
  id: string;
  type: "purchase" | "sale";
  tier: string;
  buyer: string;
  seller: string;
  price: string;
  timestamp: string;
}

interface RealtimeHistoryCardProps {
  transactions: TransactionHistory[];
  loading?: boolean;
  error?: string | null;
}

export const RealtimeHistoryCard = ({
  transactions,
  loading = false,
  error = null,
}: RealtimeHistoryCardProps) => {
  if (loading) {
    return (
      <Card className="glass border-border/50">
        <CardHeader>
          <div className="h-6 bg-muted animate-pulse rounded w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass border-destructive/30">
        <CardContent className="py-6 text-center">
          <p className="text-destructive">Lỗi: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Lịch sử mua gần đây
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Chưa có giao dịch nào</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === "purchase"
                      ? "bg-green-500/20"
                      : "bg-blue-500/20"
                  }`}
                >
                  {transaction.type === "purchase" ? (
                    <ArrowDownRight className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {transaction.type === "purchase" ? "Mua" : "Bán"}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {transaction.tier}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {transaction.type === "purchase"
                      ? transaction.buyer
                      : transaction.seller}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-primary">
                  {transaction.price}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{transaction.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
