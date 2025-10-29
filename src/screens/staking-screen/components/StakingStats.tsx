"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { StakingStats as StakingStatsType } from "@/types/Staking";
import { Coins, Gift, Package, TrendingUp, ArrowUp, Zap } from "lucide-react";

interface StakingStatsProps {
  stats: StakingStatsType;
}

export const StakingStats = ({ stats }: StakingStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="border-primary/20 hover:scale-105 transition-transform animate-fade-in">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Tổng CAN đã stake
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {stats.totalCoinStaked.toLocaleString()}
            </span>
            <ArrowUp className="h-5 w-5 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card
        className="border-green-500/20 hover:scale-105 transition-transform animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-green-500" />
            Phần thưởng CAN
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-green-500">
              {stats.totalCoinRewards.toFixed(2)}
            </span>
            <Zap className="h-5 w-5 text-green-500 animate-pulse" />
          </div>
        </CardContent>
      </Card>

      <Card
        className="border-primary/20 hover:scale-105 transition-transform animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Giá trị NFT stake
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {stats.totalNFTValue.toLocaleString()}
            </span>
            <ArrowUp className="h-5 w-5 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card
        className="border-green-500/20 hover:scale-105 transition-transform animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-green-500" />
            Phần thưởng NFT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-green-500">
              {stats.totalNFTRewards.toFixed(2)}
            </span>
            <Zap className="h-5 w-5 text-green-500 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
