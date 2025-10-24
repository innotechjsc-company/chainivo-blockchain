"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, DollarSign, Activity } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface TrendData {
  period: string;
  volume: number;
  transactions: number;
  averagePrice: number;
}

// Chart configuration for shadcn/ui
const chartConfig = {
  transactions: {
    label: "Giao dịch",
    color: "hsl(var(--primary))",
  },
  volume: {
    label: "Khối lượng",
    color: "hsl(var(--secondary))",
  },
};

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
          Xu hướng giao dịch 24h
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Biểu đồ xu hướng 24h
            </h4>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <TrendingUp className="w-3 h-3" />
              <span>+23.5%</span>
            </div>
          </div>

          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <LineChart
              data={[
                { time: "00:00", transactions: 45, volume: 2300 },
                { time: "04:00", transactions: 32, volume: 1850 },
                { time: "08:00", transactions: 78, volume: 4200 },
                { time: "12:00", transactions: 125, volume: 6800 },
                { time: "16:00", transactions: 98, volume: 5400 },
                { time: "20:00", transactions: 156, volume: 8900 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === "transactions") return [value, "Giao dịch"];
                      if (name === "volume") return [`$${value}`, "Khối lượng"];
                      return [value, name];
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="var(--color-transactions)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-transactions)",
                  strokeWidth: 2,
                  r: 3,
                }}
                name="transactions"
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="var(--color-volume)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "var(--color-volume)", strokeWidth: 2, r: 3 }}
                name="volume"
              />
            </LineChart>
          </ChartContainer>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 rounded-lg p-2">
              <div className="text-xs text-muted-foreground">
                Tổng giao dịch
              </div>
              <div className="text-lg font-bold text-primary">534</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-2">
              <div className="text-xs text-muted-foreground">Khối lượng</div>
              <div className="text-lg font-bold text-secondary">29.5K CAN</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
