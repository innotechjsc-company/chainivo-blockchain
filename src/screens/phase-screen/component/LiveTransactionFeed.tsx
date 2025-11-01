"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Users } from "lucide-react";

interface Transaction {
  id: string;
  user: string;
  amount: number;
  tokens: number;
  phase: number;
  timestamp: Date;
}

interface LiveTransactionFeedProps {
  phaseId?: number;
  limit?: number;
}

export const LiveTransactionFeed = ({
  phaseId,
  limit = 8,
}: LiveTransactionFeedProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Generate mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        user: "0x1234...5678",
        amount: 1000,
        tokens: 12500,
        phase: 2,
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
      },
      {
        id: "2",
        user: "0x2345...6789",
        amount: 500,
        tokens: 6250,
        phase: 2,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        id: "3",
        user: "0x3456...7890",
        amount: 2000,
        tokens: 25000,
        phase: 2,
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
      },
      {
        id: "4",
        user: "0x4567...8901",
        amount: 750,
        tokens: 9375,
        phase: 2,
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
      },
      {
        id: "5",
        user: "0x5678...9012",
        amount: 1500,
        tokens: 18750,
        phase: 2,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
      },
    ];

    setTransactions(mockTransactions.slice(0, limit));

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTransactions((prev) => {
        const newTransaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          user: `0x${Math.random().toString(36).substr(2, 8)}...${Math.random()
            .toString(36)
            .substr(2, 4)}`,
          amount: Math.floor(Math.random() * 2000) + 100,
          tokens: Math.floor(Math.random() * 25000) + 1250,
          phase: phaseId || 2,
          timestamp: new Date(),
        };

        return [newTransaction, ...prev.slice(0, limit - 1)];
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [phaseId, limit]);

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    return `${hours} giờ trước`;
  };

  return (
    <Card className="glass border-accent/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Giao dịch gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/20 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{transaction.user}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(transaction.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">
                  ${transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.tokens.toLocaleString()} CAN
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tổng giao dịch hôm nay:</span>
            <Badge variant="outline" className="text-accent">
              $45,230
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">Số giao dịch:</span>
            <span className="text-sm font-medium">127</span>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
};
