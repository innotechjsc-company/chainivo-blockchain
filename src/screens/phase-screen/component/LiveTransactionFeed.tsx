"use client";

import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, Users } from "lucide-react";
import { PhaseService } from "@/api/services/phase-service";
import { TransactionHistoryResponse } from "@/types/TransactionHistory";
import { TOKEN_DEAULT_CURRENCY } from "@/api/config";

interface Transaction {
  id: string;
  user: string;
  amount: number;
  tokens: number;
  phase: number;
  timestamp: string | Date;
}

interface LiveTransactionFeedProps {
  phaseId?: string | number;
  limit?: number;
}

export const LiveTransactionFeed = ({
  phaseId,
  limit = 8,
}: LiveTransactionFeedProps) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const transactionsRef = useRef<any[]>([]);

  const getLatestTransactionId = (transactionList: any[]) => {
    if (!transactionList.length) {
      return undefined;
    }

    return transactionList.reduce((latest, current) => {
      const latestTimestamp = dayjs(latest?.createdAt ?? latest?.timestamp);
      const currentTimestamp = dayjs(current?.createdAt ?? current?.timestamp);

      if (!latestTimestamp.isValid()) {
        return current;
      }

      if (!currentTimestamp.isValid()) {
        return latest;
      }

      return currentTimestamp.valueOf() > latestTimestamp.valueOf()
        ? current
        : latest;
    }).id;
  };

  useEffect(() => {
    if (!phaseId) {
      return undefined;
    }

    let isMounted = true;
    let pollingTimer: ReturnType<typeof setInterval> | undefined;

    transactionsRef.current = [];
    setTransactions([]);

    const fetchInitialTransactions = async () => {
      const response = await PhaseService.getTransactionHistoryByPhaseId(
        phaseId.toString()
      );

      if (!isMounted) {
        return;
      }

      if (response.success && response.data) {
        const { transactions: historyTransactions } =
          response.data as unknown as TransactionHistoryResponse;

        const initialTransactions = (
          historyTransactions as unknown as Transaction[]
        ).slice(0, limit);

        transactionsRef.current = initialTransactions;
        setTransactions(initialTransactions);
      }
    };

    const fetchNewTransactions = async () => {
      const lastTransactionId = getLatestTransactionId(transactionsRef.current);

      const response = await PhaseService.getNewTransactions({
        phaseId: phaseId.toString(),
        lastTransactionId,
      });

      if (!isMounted) {
        return;
      }

      if (
        response.success &&
        Array.isArray(response.data) &&
        response.data.length
      ) {
        setTransactions((prevTransactions) => {
          const mergedTransactions = [
            ...(response.data ?? []),
            ...prevTransactions,
          ];

          const uniqueTransactions = Array.from(
            new Map(
              mergedTransactions.map((transaction) => [
                transaction.id,
                transaction,
              ])
            ).values()
          );

          const limitedTransactions = uniqueTransactions.slice(0, limit);

          transactionsRef.current = limitedTransactions;
          return limitedTransactions;
        });
      }
    };

    fetchInitialTransactions();
    pollingTimer = setInterval(fetchNewTransactions, 5000);

    return () => {
      isMounted = false;
      if (pollingTimer) {
        clearInterval(pollingTimer);
      }
    };
  }, [phaseId, limit]);

  const formatTime = (timestamp: string | Date) => {
    const parsedTimestamp = dayjs(timestamp);

    if (!parsedTimestamp.isValid()) {
      return "";
    }

    const now = dayjs();
    const minutes = now.diff(parsedTimestamp, "minute");

    if (minutes < 1) {
      return "Vừa xong";
    }

    if (minutes < 60) {
      return `${minutes} phút trước`;
    }

    const hours = now.diff(parsedTimestamp, "hour");

    if (hours < 24) {
      return `${hours} giờ trước`;
    }

    const days = now.diff(parsedTimestamp, "day");
    return `${days} ngày trước`;
  };

  const maskAddress = (address?: string | null) => {
    if (!address || address.length <= 8) {
      return address ?? "***";
    }

    const firstPart = address.slice(0, 4);
    const lastPart = address.slice(-4);

    return `${firstPart}***${lastPart}`;
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
                  <p className="text-sm font-medium">
                    {maskAddress(transaction.investorAddress)}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(transaction.createdAt ?? transaction.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">
                  ${transaction?.investmentAmount?.toLocaleString()}{" "}
                  {transaction?.paymentCurrency?.toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction?.tokensBought?.toLocaleString()}{" "}
                  {TOKEN_DEAULT_CURRENCY}
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
