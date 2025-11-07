"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Layers, DollarSign } from "lucide-react";
import { formatAmount } from "@/lib/utils";
import { PhaseService } from "@/api/services/phase-service";

export const BlockchainStats = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const normalizeNumber = (value: unknown): number => {
      if (typeof value === "number" && Number.isFinite(value)) {
        return value;
      }

      if (typeof value === "string") {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }

      return 0;
    };

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await PhaseService.getALLInfoOfPhase();
        if (response.success && response.data) {
          setStats(response.data as any);
        } else {
          setStats(null);
          setError("Không có dữ liệu thống kê");
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setStats(null);
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải thống kê blockchain"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="h-8 bg-muted animate-pulse rounded w-64 mx-auto mb-4" />
            <div className="h-4 bg-muted animate-pulse rounded w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glass">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted animate-pulse rounded w-24 mb-2" />
                  <div className="h-8 bg-muted animate-pulse rounded w-16 mb-2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!stats) {
    return null;
  }

  const formatTransactions = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    }

    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }

    return value.toLocaleString();
  };

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
                {formatAmount(stats.totalSupply)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.circulatingSupply.toLocaleString()} đang lưu thông
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
                {stats.totalHolders.toLocaleString()}
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
                {formatTransactions(stats.totalTransactions)}
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
                ${(stats.totalValueLocked / 1_000_000).toFixed(1)}M
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
                {stats.investmentPhase.name || "Không có"}
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
                {stats.circulatingSupply}%
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
