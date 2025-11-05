"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Award, Activity, Clock } from "lucide-react";

interface UserProfile {
  username: string;
  name: string;
  can_balance: number;
  total_invested: number;
  membership_tier: string;
}

interface UserDashboardCardProps {
  profile: UserProfile | null;
  loading?: boolean;
  error?: string | null;
}

export const UserDashboardCard = ({
  profile,
  loading = false,
  error = null,
}: UserDashboardCardProps) => {
  const tierColors = {
    bronze: "text-orange-400",
    silver: "text-gray-300",
    gold: "text-yellow-400",
    platinum: "text-cyan-400",
  };

  const tierBadgeColors = {
    bronze: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    silver: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    gold: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    platinum: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  };

  if (loading) {
    return (
      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <div className="h-8 bg-muted animate-pulse rounded w-64 mx-auto mb-4" />
            <div className="h-4 bg-muted animate-pulse rounded w-32 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="glass">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-20" />
                  <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted animate-pulse rounded w-24 mb-2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-16" />
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
      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <Card className="glass border-destructive/30">
              <CardContent className="py-8">
                <p className="text-destructive">Lỗi: {error}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/5 to-muted/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <Card className="glass">
              <CardContent className="py-8">
                <p className="text-muted-foreground">
                  Không tìm thấy thông tin người dùng
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Xin chào, {profile.name}!
          </h2>
          <p className="text-foreground/60">Dashboard của bạn</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 max-w-5xl mx-auto justify-center">
          {/* CAN Balance Card */}
          <Card className="glass border-primary/30 hover:border-primary/60 transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Số dư CAN
              </CardTitle>
              <Wallet className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">
                {profile.can_balance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">CAN tokens</p>
            </CardContent>
          </Card>

          {/* Total Investment Card */}
          <Card className="glass border-secondary/30 hover:border-secondary/60 transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Tổng đầu tư
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                ${profile.total_invested?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">USD</p>
            </CardContent>
          </Card>

          {/* Membership Tier Card */}
          {/* <Card className="glass border-accent/30 hover:border-accent/60 transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Hạng thành viên
              </CardTitle>
              <Award className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge
                  className={`text-sm font-bold capitalize ${
                    tierBadgeColors[
                      profile.membership_tier as keyof typeof tierBadgeColors
                    ]
                  }`}
                >
                  {profile.membership_tier}
                </Badge>
                <p className="text-xs text-muted-foreground">Tier level</p>
              </div>
            </CardContent>
          </Card> */}

          {/* Status Card */}
          <Card className="glass border-primary/30 hover:border-primary/60 transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Trạng thái
              </CardTitle>
              <Activity className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Active
                </Badge>
                <p className="text-xs text-muted-foreground">Đang hoạt động</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
