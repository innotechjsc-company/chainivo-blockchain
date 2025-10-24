"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Wallet, Award, TrendingUp, Clock } from "lucide-react";

interface UserMembership {
  username: string;
  can_balance: number;
  membership_tier: string;
}

interface TierInfo {
  name: string;
  color: string;
  next: string;
  required: number;
}

interface UserTierInfoCardProps {
  profile: UserMembership | null;
  currentTier: TierInfo | null;
  progressToNext: number;
  loading?: boolean;
  error?: string | null;
}

export const UserTierInfoCard = ({
  profile,
  currentTier,
  progressToNext,
  loading = false,
  error = null,
}: UserTierInfoCardProps) => {
  if (loading) {
    return (
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <div className="h-6 bg-muted animate-pulse rounded w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-20 bg-muted animate-pulse rounded-lg" />
          <div className="h-16 bg-muted animate-pulse rounded-lg" />
          <div className="h-12 bg-muted animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass border-destructive/30">
        <CardContent className="py-6 text-center">
          <p className="text-destructive">Lỗi: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="glass border-border/50">
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground">Đăng nhập để xem thông tin</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Tài khoản của bạn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CAN Balance */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-2">Số dư CAN</div>
          <div className="text-3xl font-bold gradient-text">
            {profile.can_balance.toLocaleString()}
          </div>
        </div>

        {/* Current Tier */}
        <div className="flex items-center justify-between bg-muted/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Hạng hiện tại</span>
          </div>
          <Badge
            className={`text-base font-bold ${
              currentTier?.color || "text-muted-foreground"
            }`}
          >
            {currentTier?.name || "Unknown"}
          </Badge>
        </div>

        {/* Progress to Next Tier */}
        {currentTier && currentTier.next !== "MAX" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>Lên {currentTier.next}</span>
              </div>
              <span className="text-sm font-semibold text-primary">
                {Math.min(Math.round(progressToNext), 100)}%
              </span>
            </div>

            <Progress value={Math.min(progressToNext, 100)} className="h-2" />

            <div className="text-sm text-muted-foreground text-center">
              {profile.can_balance.toLocaleString()} /{" "}
              {currentTier.required.toLocaleString()} CAN
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/30">
          <div className="bg-muted/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-primary">
              {Math.floor(profile.can_balance / 100)}
            </div>
            <div className="text-xs text-muted-foreground">Gói mua</div>
          </div>
          <div className="bg-muted/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-secondary">
              {Math.floor(Math.random() * 50) + 10}
            </div>
            <div className="text-xs text-muted-foreground">NFT</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
