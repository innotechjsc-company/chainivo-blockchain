"use client";

import { useEffect, useState } from "react";
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

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        transaction_type: "buy",
        amount: 1000,
        price_per_token: 0.08,
        total_value: 80,
        phase: 2,
        status: "completed",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        transaction_type: "buy",
        amount: 500,
        price_per_token: 0.05,
        total_value: 25,
        phase: 1,
        status: "completed",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    // Simulate loading
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

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
      <Card className="glass">
        <CardContent className="py-8 text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
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
                        tx.status === "completed" ? "default" : "secondary"
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
  );
};
