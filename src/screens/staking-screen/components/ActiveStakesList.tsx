"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StakingCoin, StakingNFT } from "@/types/Staking";
import {
  TrendingUp,
  Clock,
  Gift,
  XCircle,
  Sparkles,
  Package,
} from "lucide-react";

interface ActiveStakesListProps {
  coinStakes: StakingCoin[];
  nftStakes: StakingNFT[];
  onClaim: (stakeId: string, type: "coin" | "nft") => Promise<void>;
  onCancel: (stakeId: string, type: "coin" | "nft") => Promise<void>;
  calculateRewards: (amount: number, apy: number, daysPassed: number) => number;
  calculateDaysPassed: (stakedAt: string) => number;
}

export const ActiveStakesList = ({
  coinStakes,
  nftStakes,
  onClaim,
  onCancel,
  calculateRewards,
  calculateDaysPassed,
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
          {activeCoinStakes.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">Chưa có lệnh stake nào</p>
              <p className="text-sm text-muted-foreground mt-2">
                Bắt đầu stake để nhận phần thưởng!
              </p>
            </div>
          ) : (
            activeCoinStakes.map((stake) => {
              const daysPassed = calculateDaysPassed(stake.stakedAt);
              const currentRewards = calculateRewards(
                stake.amountStaked,
                stake.apy,
                daysPassed
              );

              return (
                <Card
                  key={stake.id}
                  className="border-primary/20 bg-gradient-to-br h-full from-background to-primary/5 hover:scale-105 transition-transform"
                >
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                          {stake.amountStaked.toLocaleString()} CAN
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3" />
                          APY: {stake.apy}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-500 flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />+
                          {currentRewards.toFixed(2)} CAN
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Phần thưởng hiện tại
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Đã stake
                        </span>
                        <span className="font-medium">{daysPassed} ngày</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Bắt đầu:{" "}
                        {new Date(stake.stakedAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="default"
                        onClick={() => onClaim(stake.id, "coin")}
                        className="flex items-center gap-2"
                      >
                        <Gift className="h-4 w-4" />
                        Nhận thưởng
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => onCancel(stake.id, "coin")}
                        className="flex items-center gap-2"
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

      {/* NFT Stakes */}
      {/* <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            NFT Đang Stake
          </CardTitle>
          <CardDescription>
            Phần thưởng đang tích lũy theo thời gian thực
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeNFTStakes.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">Chưa có NFT stake nào</p>
              <p className="text-sm text-muted-foreground mt-2">
                Stake NFT để nhận phần thưởng cao hơn!
              </p>
            </div>
          ) : (
            activeNFTStakes.map((stake) => {
              const daysPassed = calculateDaysPassed(stake.stakedAt);
              const currentRewards = calculateRewards(
                stake.nftValue,
                stake.apy,
                daysPassed
              );

              return (
                <Card
                  key={stake.id}
                  className="border-primary/20 bg-gradient-to-br from-background to-primary/5 hover:scale-105 transition-transform"
                >
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg">{stake.nftName}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Giá trị: {stake.nftValue.toLocaleString()} CAN
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3" />
                          APY: {stake.apy}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-500 flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />+
                          {currentRewards.toFixed(2)} CAN
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Phần thưởng hiện tại
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Đã stake
                        </span>
                        <span className="font-medium">{daysPassed} ngày</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Bắt đầu:{" "}
                        {new Date(stake.stakedAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="default"
                        onClick={() => onClaim(stake.id, "nft")}
                        className="flex items-center gap-2"
                      >
                        <Gift className="h-4 w-4" />
                        Nhận thưởng
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => onCancel(stake.id, "nft")}
                        className="flex items-center gap-2"
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
      </Card> */}
    </div>
  );
};
