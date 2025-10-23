"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Layers, DollarSign } from "lucide-react";

interface BlockchainData {
  total_can_supply: number;
  circulating_supply: number;
  total_holders: number;
  total_transactions: number;
  current_phase: number;
  total_value_locked: number;
}

export const BlockchainStats = () => {
  const [stats, setStats] = useState<BlockchainData | null>(null);

  useEffect(() => {
    // Mock data for demonstration
    const mockStats: BlockchainData = {
      total_can_supply: 100000000,
      circulating_supply: 45000000,
      total_holders: 12500,
      total_transactions: 850000,
      current_phase: 2,
      total_value_locked: 2500000,
    };

    // Simulate loading
    setTimeout(() => {
      setStats(mockStats);
    }, 1000);
  }, []);

  if (!stats) return null;

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Thống kê Blockchain CAN
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Theo dõi realtime các chỉ số quan trọng của hệ sinh thái CAN token
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass border-primary/40 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Tổng cung CAN
              </CardTitle>
              <Layers className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">
                {(stats.total_can_supply / 1_000_000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.circulating_supply.toLocaleString()} đang lưu thông
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-secondary/40 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Tổng số holders
              </CardTitle>
              <Users className="w-5 h-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">
                {stats.total_holders.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Người dùng đang nắm giữ
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-accent/40 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Tổng giao dịch
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {(stats.total_transactions / 1_000_000).toFixed(2)}M
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Transactions trên network
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-primary/40 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Total Value Locked
              </CardTitle>
              <DollarSign className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">
                ${(stats.total_value_locked / 1_000_000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Giá trị bị khóa trong hệ thống
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-secondary/40 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Giai đoạn hiện tại
              </CardTitle>
              <Layers className="w-5 h-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">
                Phase {stats.current_phase}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Investment phase đang mở
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-accent/40 hover:scale-105 transition-transform">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Tỷ lệ lưu thông
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {(
                  (stats.circulating_supply / stats.total_can_supply) *
                  100
                ).toFixed(1)}
                %
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Circulating supply ratio
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
