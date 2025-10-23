"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, DollarSign, Activity } from "lucide-react";

interface TrendData {
  period: string;
  volume: number;
  transactions: number;
  averagePrice: number;
}

interface TransactionTrendsCardProps {
  trends: TrendData[];
  currentPeriod: string;
  setCurrentPeriod: (period: string) => void;
}

export const TransactionTrendsCard = ({
  trends,
  currentPeriod,
  setCurrentPeriod,
}: TransactionTrendsCardProps) => {
  const currentTrend = trends.find((trend) => trend.period === currentPeriod);

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Xu hướng giao dịch
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Period Selector */}
        <div className="flex gap-2">
          {trends.map((trend) => (
            <Button
              key={trend.period}
              variant={currentPeriod === trend.period ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPeriod(trend.period)}
              className="text-xs"
            >
              {trend.period}
            </Button>
          ))}
        </div>

        {/* Current Period Stats */}
        {currentTrend && (
          <div className="space-y-4">
            {/* Volume */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Tổng khối lượng
                </span>
              </div>
              <div className="text-2xl font-bold gradient-text">
                ${(currentTrend.volume / 1000).toFixed(0)}K
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-secondary" />
                <span className="text-sm text-muted-foreground">
                  Số giao dịch
                </span>
              </div>
              <div className="text-2xl font-bold text-secondary">
                {currentTrend.transactions}
              </div>
            </div>

            {/* Average Price */}
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">
                  Giá trung bình
                </span>
              </div>
              <div className="text-2xl font-bold text-accent">
                {currentTrend.averagePrice.toLocaleString()} CAN
              </div>
            </div>
          </div>
        )}

        {/* Trend Indicator */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/30">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400 font-semibold">+12.5%</span>
          <span className="text-xs text-muted-foreground">so với kỳ trước</span>
        </div>
      </CardContent>
    </Card>
  );
};
