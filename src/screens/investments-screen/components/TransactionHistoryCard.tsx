"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  price_per_token: number;
  total_value: number;
  phase: number;
  status: string;
  created_at: string;
}

interface TransactionHistoryCardProps {
  transactions: Transaction[];
  loading?: boolean;
  error?: string | null;
}

export const TransactionHistoryCard = ({
  transactions,
  loading = false,
  error = null,
}: TransactionHistoryCardProps) => {
  const formatDistanceToNow = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-background to-background/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass">
              <CardContent className="py-8 text-center">
                <Clock className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-muted-foreground">
                  Đang tải lịch sử giao dịch...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-br from-background to-background/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="glass">
              <CardContent className="py-8 text-center">
                <p className="text-destructive">Lỗi: {error}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-background to-background/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="gradient-text">Lịch sử giao dịch</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Chưa có giao dịch nào
                </p>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.transaction_type === "buy"
                              ? "bg-green-500/20"
                              : "bg-red-500/20"
                          }`}
                        >
                          {tx.transaction_type === "buy" ? (
                            <ArrowDownRight className="w-5 h-5 text-green-400" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {tx.transaction_type === "buy" ? "Mua" : "Bán"}{" "}
                            {tx.amount.toLocaleString()} CAN
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Phase {tx.phase} • ${tx.price_per_token} / token
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ${tx.total_value.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 justify-end mt-1">
                          <Badge
                            variant={
                              tx.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {tx.status === "completed"
                              ? "Hoàn thành"
                              : tx.status === "pending"
                              ? "Đang xử lý"
                              : "Thất bại"}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(tx.created_at))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
