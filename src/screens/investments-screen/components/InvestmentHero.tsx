"use client";

import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  ArrowRight,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface BlockchainData {
  total_can_supply: number;
  circulating_supply: number;
  total_holders: number;
  total_transactions: number;
  current_phase: number;
  total_value_locked: number;
}

interface InvestmentHeroProps {
  className?: string;
}

const CHART_DATA = [
  { month: "T1", holders: 850, price: 0.15, projected: 1100 },
  { month: "T2", holders: 1200, price: 0.18, projected: 1600 },
  { month: "T3", holders: 1680, price: 0.22, projected: 2200 },
  { month: "T4", holders: 2350, price: 0.28, projected: 3100 },
  { month: "T5", holders: 3290, price: 0.35, projected: 4300 },
  { month: "T6", holders: 4600, price: 0.45, projected: 6000 },
  { month: "T7 (Dự kiến)", holders: null, price: null, projected: 7800 },
];

const INVESTMENT_PHASES = [
  {
    phase: 1,
    price: 0.15,
    coins: 10000000,
    progress: 100,
    status: "completed",
  },
  {
    phase: 2,
    price: 0.25,
    coins: 15000000,
    progress: 100,
    status: "completed",
  },
  { phase: 3, price: 0.45, coins: 20000000, progress: 65, status: "active" },
  { phase: 4, price: 0.75, coins: 25000000, progress: 0, status: "locked" },
];

// Chart configuration for shadcn/ui
const chartConfig = {
  holders: {
    label: "Người mua",
    color: "hsl(var(--primary))",
  },
  price: {
    label: "Đơn giá",
    color: "hsl(var(--accent))",
  },
  projected: {
    label: "Dự kiến",
    color: "hsl(var(--secondary))",
  },
};

export const InvestmentHero: React.FC<InvestmentHeroProps> = ({
  className = "",
}) => {
  const [stats, setStats] = useState<BlockchainData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Mock data for demonstration
    const mockStats: BlockchainData = {
      total_can_supply: 100000000,
      circulating_supply: 45000000,
      total_holders: 4600,
      total_transactions: 12500,
      current_phase: 3,
      total_value_locked: 20700000,
    };

    setStats(mockStats);
  }, []);

  const currentPhase = INVESTMENT_PHASES.find((p) => p.status === "active");
  const circulationRatio = stats
    ? (stats.circulating_supply / stats.total_can_supply) * 100
    : 0;

  // Calculate growth rates
  const holderGrowth =
    CHART_DATA.length >= 2
      ? ((CHART_DATA[CHART_DATA.length - 2].holders! -
          CHART_DATA[CHART_DATA.length - 3].holders!) /
          CHART_DATA[CHART_DATA.length - 3].holders!) *
        100
      : 0;
  const priceGrowth =
    CHART_DATA.length >= 2
      ? ((CHART_DATA[CHART_DATA.length - 2].price! -
          CHART_DATA[CHART_DATA.length - 3].price!) /
          CHART_DATA[CHART_DATA.length - 3].price!) *
        100
      : 0;
  const projectedGrowth =
    CHART_DATA.length >= 2
      ? ((CHART_DATA[CHART_DATA.length - 1].projected! -
          CHART_DATA[CHART_DATA.length - 2].projected!) /
          CHART_DATA[CHART_DATA.length - 2].projected!) *
        100
      : 0;

  return (
    <section
      className={`relative pt-20 pb-6 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 overflow-hidden ${className}`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Title - Compact */}
        <div className="text-center mb-4 animate-fade-in">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 animate-[fade-in_0.6s_ease-out]">
            <span className="gradient-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]">
              Đầu tư CAN TOKEN
            </span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto animate-[fade-in_0.8s_ease-out]">
            Nền tảng đầu tư blockchain an toàn, minh bạch và sinh lời cao
          </p>
        </div>

        {/* Main Grid - Reversed */}
        <div className="grid lg:grid-cols-3 gap-3 mb-3">
          {/* Current Phase Progress - LEFT SIDE */}
          <Card className="glass p-4 hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 border border-primary/30 animate-[fade-in_1s_ease-out] relative overflow-hidden group hover:scale-[1.02]">
            {/* Animated glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl group-hover:animate-[pulse_2s_ease-in-out_infinite]"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold gradient-text">
                  Phase hiện tại
                </h3>
                <Rocket className="w-5 h-5 text-primary animate-[bounce_2s_ease-in-out_infinite]" />
              </div>
              {currentPhase && (
                <div className="space-y-4">
                  <div className="text-center group-hover:scale-105 transition-transform duration-500">
                    <div className="text-4xl font-bold gradient-text mb-1 animate-[scale-in_0.5s_ease-out]">
                      Phase {currentPhase.phase}
                    </div>
                    <div className="text-lg font-semibold text-primary animate-[fade-in_0.8s_ease-out]">
                      ${currentPhase.price}/CAN
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Tiến độ bán</span>
                      <span className="font-bold text-primary">
                        {currentPhase.progress}%
                      </span>
                    </div>
                    <Progress value={currentPhase.progress} className="h-3" />
                    <div className="text-xs text-muted-foreground text-center">
                      {(
                        (currentPhase.coins * currentPhase.progress) /
                        100
                      ).toLocaleString()}{" "}
                      / {currentPhase.coins.toLocaleString()} CAN
                    </div>
                  </div>

                  <Button
                    size="default"
                    className="w-full font-semibold shadow-lg hover:shadow-xl hover:shadow-primary/30 cursor-pointer transition-all duration-300 hover:scale-105 animate-[fade-in_1.2s_ease-out] group/btn"
                    onClick={() => router.push(`/phase/${currentPhase.phase}`)}
                  >
                    <Rocket className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                    Đầu tư ngay
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Chart Section - RIGHT SIDE */}
          <Card className="lg:col-span-2 glass p-3 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 animate-[fade-in_1s_ease-out_0.2s] hover:scale-[1.01] group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold gradient-text">
                Tăng trưởng người mua & Giá token
              </h3>
              <TrendingUp className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <ChartContainer config={chartConfig} className="h-[120px] w-full">
              <LineChart data={CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        if (name === "holders")
                          return [value?.toLocaleString(), "Người mua"];
                        if (name === "price") return [`$${value}`, "Đơn giá"];
                        if (name === "projected")
                          return [value?.toLocaleString(), "Dự kiến"];
                        return [value, name];
                      }}
                    />
                  }
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="holders"
                  stroke="var(--color-holders)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-holders)", strokeWidth: 2, r: 3 }}
                  name="holders"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="price"
                  stroke="var(--color-price)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "var(--color-price)", strokeWidth: 2, r: 3 }}
                  name="price"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="projected"
                  stroke="var(--color-projected)"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ fill: "var(--color-projected)", strokeWidth: 2, r: 3 }}
                  name="projected"
                />
              </LineChart>
            </ChartContainer>
          </Card>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Card className="glass p-2.5 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105 animate-[fade-in_1s_ease-out_0.4s] group cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110">
                <Users className="w-4 h-4 text-primary group-hover:animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="text-base font-bold gradient-text leading-tight group-hover:scale-110 transition-transform">
                  +{holderGrowth.toFixed(1)}%
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Tăng người mua
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass p-2.5 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105 animate-[fade-in_1s_ease-out_0.5s] group cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors duration-300 group-hover:scale-110">
                <DollarSign className="w-4 h-4 text-accent group-hover:animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="text-base font-bold text-accent leading-tight group-hover:scale-110 transition-transform">
                  +{priceGrowth.toFixed(1)}%
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Tăng đơn giá
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass p-2.5 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105 animate-[fade-in_1s_ease-out_0.6s] group cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors duration-300 group-hover:scale-110">
                <Target className="w-4 h-4 text-secondary group-hover:animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="text-base font-bold text-secondary leading-tight group-hover:scale-110 transition-transform">
                  +{projectedGrowth.toFixed(1)}%
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Dự kiến kỳ sau
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass p-2.5 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105 animate-[fade-in_1s_ease-out_0.7s] group cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110">
                <TrendingUp className="w-4 h-4 text-primary group-hover:animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="text-base font-bold gradient-text leading-tight group-hover:scale-110 transition-transform">
                  {stats?.total_holders.toLocaleString() || "0"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Tổng NĐT
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
