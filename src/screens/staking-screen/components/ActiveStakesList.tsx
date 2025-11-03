"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Clock,
  Gift,
  XCircle,
  Sparkles,
  Package,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { StakingCoin, StakingNFT, StakingPool } from "@/types";

function CountdownTimer({
  startAt,
  lockDays,
}: {
  startAt: string;
  lockDays: number;
}) {
  const [remaining, setRemaining] = useState<string>("");

  useEffect(() => {
    if (!startAt || !lockDays || lockDays <= 0) {
      setRemaining("-");
      return;
    }
    const startMs = new Date(startAt).getTime();
    const endMs = startMs + lockDays * 24 * 60 * 60 * 1000;

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, endMs - now);
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor(
        (diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const secs = Math.floor((diff % (60 * 1000)) / 1000);
      setRemaining(`${days}d ${hours}h ${mins}m ${secs}s`);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startAt, lockDays]);

  return (
    <div className="p-3 bg-background/50 rounded-lg">
      <span className="text-muted-foreground text-sm">Thời gian còn lại</span>
      <p className="font-medium mt-1">{remaining}</p>
    </div>
  );
}

interface ActiveStakesListProps {
  coinStakes: StakingCoin[];
  nftStakes: StakingNFT[];
  onClaim: (stakeId: string, type: "coin" | "nft") => Promise<void>;
  onCancel: (stakeId: string, type: "coin" | "nft") => Promise<void>;
  calculateRewards: (amount: number, apy: number, daysPassed: number) => number;
  calculateDaysPassed: (stakedAt: string) => number;
  stakingMyPools: StakingPool[];
  getClaimRewardsData: (stakeId: string) => Promise<any>;
  unStakeData: (stakeId: string) => Promise<any>;
}

export const ActiveStakesList = ({
  coinStakes,
  nftStakes,
  onClaim,
  onCancel,
  calculateRewards,
  calculateDaysPassed,
  stakingMyPools,
  getClaimRewardsData,
  unStakeData,
}: ActiveStakesListProps) => {
  const activeCoinStakes = coinStakes.filter((s) => s.status === "active");
  const activeNFTStakes = nftStakes.filter((s) => s.status === "active");

  return (
    <div className="stakes-list space-y-6">
      {/* Coin Stakes */}
      <Card className="stakes-list-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Lệnh Stake Đang Hoạt Động
          </CardTitle>
          <CardDescription>
            Phần thưởng đang tích lũy theo thời gian thực
          </CardDescription>
        </CardHeader>
        <CardContent className="stakes-list-content space-y-4">
          {stakingMyPools.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">Chưa có lệnh stake nào</p>
              <p className="text-sm text-muted-foreground mt-2">
                Bắt đầu stake để nhận phần thưởng!
              </p>
            </div>
          ) : (
            stakingMyPools.map((pool) => {
              const key = (pool as any).id;
              const name = (pool as any).stake?.name ?? "Gói stake";
              const apy = (pool as any).poolInfo?.apy ?? 0;
              const totalStaked = (pool as any).amount ?? 0;
              const lockPeriod = (pool as any).poolInfo?.lockPeriod ?? 0;
              const stakedAt = (pool as any).stakedAt as string;
              const id = (pool as any).id;
              const rewards = (pool as any).earned ?? 0;
              const canUnstake = (pool as any).canUnstake ?? true;
              const daysRemaining = (pool as any).daysRemaining ?? 0;
              const daysSinceStaked = (pool as any).daysSinceStaked ?? 0;
              const status = (pool as any).status ?? "active";
              const startDate = stakedAt
                ? new Date(stakedAt).toLocaleDateString("vi-VN")
                : "-";
              return (
                <Card
                  key={key}
                  className="border-primary/30 bg-gradient-to-br from-background to-primary/5 relative overflow-hidden"
                >
                  <div className="mx-4 text-lg font-bold flex items-center `">
                    Gói Stake:
                    <div className="text-primary mx-2">
                      {name.toUpperCase()}
                    </div>
                  </div>
                  <CardContent className="pt-4 space-y-4">
                    {/* Top header row */}
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="text-2xl font-bold ">
                          {Number(totalStaked).toLocaleString()} CAN
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3" /> APY: {apy}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold text-xl">
                          +{Number(rewards).toLocaleString()} CAN
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Phần thưởng hiện tại
                        </p>
                      </div>
                    </div>

                    {/* Center glow icon */}
                    {/* <div className="absolute left-1/2 -translate-x-1/2 -top-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 blur-xl"></div>
                      <Sparkles className="w-4 h-4 text-primary mx-auto -mt-6" />
                    </div> */}

                    {/* Dark info strip */}
                    <div className="bg-black/30 rounded-xl px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Đã stake</span>
                      </div>
                      <div className="text-sm font-medium whitespace-nowrap">
                        {daysSinceStaked} ngày
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Bắt đầu: {startDate}
                    </p>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <Button
                        variant="default"
                        onClick={() => getClaimRewardsData(id)}
                        disabled={status !== "active"}
                        className="flex items-center justify-center gap-2 cursor-pointer bg-sky-500 hover:bg-sky-600 text-white"
                      >
                        <Gift className="h-4 w-4" />
                        Nhận thưởng
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => unStakeData(id)}
                        disabled={!canUnstake && status === "active"}
                        className="flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <XCircle className="h-4 w-4" />
                        Hủy Staking
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* My Staking Pools */}
    </div>
  );
};
