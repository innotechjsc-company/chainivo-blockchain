"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StakingCoin, StakingNFT, StakingPool } from "@/types/Staking";
import {
  TrendingUp,
  Clock,
  Gift,
  XCircle,
  Sparkles,
  Package,
} from "lucide-react";

import { useEffect, useState } from "react";

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
              const key = (pool as any)._id || (pool as any).id;
              const name = (pool as any).poolId?.name ?? "Gói stake";
              const apy = (pool as any).poolId?.apy ?? 0;
              const totalStaked = (pool as any).amount ?? 0;
              const lockPeriod = (pool as any).poolId?.lockPeriod ?? 0;
              const stakedAt = (pool as any).stakedAt as string;
              const id = (pool as any)._id || (pool as any).id;
              const rewards = (pool as any).earned ?? 0;
              return (
                <Card
                  key={key}
                  className="border-primary/20 bg-gradient-to-br from-background to-primary/5"
                >
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <p className="text-lg font-bold truncate max-w-[14rem]">
                          {name}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1 whitespace-nowrap">
                          <TrendingUp className="h-3 w-3" />
                          APY: {apy}%
                        </p>
                      </div>
                      <div className="text-right min-w-0">
                        <p className="text-sm text-muted-foreground whitespace-nowrap">
                          Số Can stake
                        </p>
                        <p className="text-xl font-bold truncate max-w-[10rem] ml-auto">
                          {Number(totalStaked).toLocaleString()} CAN
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="p-3 bg-background/50 rounded-lg min-w-0">
                        <span className="text-muted-foreground block truncate">
                          Thời gian stake
                        </span>
                        <p className="font-medium truncate">
                          {lockPeriod} ngày
                        </p>
                      </div>
                      <div className="p-3 bg-background/50 rounded-lg min-w-0">
                        <span className="text-muted-foreground block truncate">
                          Phần thưởng{" "}
                        </span>
                        <p className="font-medium truncate">{rewards} CAN</p>
                      </div>
                      <CountdownTimer
                        startAt={stakedAt}
                        lockDays={Number(lockPeriod) || 0}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        variant="default"
                        onClick={() => getClaimRewardsData(id)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Gift className="h-4 w-4" />
                        Nhận thưởng
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => unStakeData(id)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <XCircle className="h-4 w-4" />
                        Huỷ Staking
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
