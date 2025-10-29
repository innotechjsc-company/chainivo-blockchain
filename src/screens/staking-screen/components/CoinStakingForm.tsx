"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Zap } from "lucide-react";
import { CreateStakingCoinRequest } from "@/types/Staking";
import { API_ENDPOINTS, ApiService } from "@/api/api";
import { useAppSelector } from "@/stores";

interface CoinStakingFormProps {
  userBalance: number;
  onStake: (request: CreateStakingCoinRequest) => Promise<void>;
  loading?: boolean;
  apy?: number;
}

export const CoinStakingForm = ({
  userBalance,
  onStake,
  loading = false,
  apy = 10,
}: CoinStakingFormProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const [amount, setAmount] = useState("");
  const [userCanBalance, setUserCanBalance] = useState<number>(0);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const stakeAmount = parseFloat(amount);
    if (!stakeAmount || stakeAmount <= 0) {
      return;
    }

    if (stakeAmount > userBalance) {
      return;
    }

    try {
      await onStake({
        amountStaked: stakeAmount,
        apy,
        lockPeriod: 3650, // 10 years
      });
      setAmount("");
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const getAllCanBalance = async () => {
    const response = await ApiService.get(
      `${API_ENDPOINTS.GET_WALLET_CAN_BALANCE}/${user?.walletAddress as string}`
    );
    if (response?.success) {
      setUserCanBalance(
        Number((response?.data as any)?.balance as number) ?? 0
      );
    }
  };

  useEffect(() => {
    getAllCanBalance();
  }, []);

  const isValidAmount =
    amount && parseFloat(amount) > 0 && parseFloat(amount) <= userBalance;

  return (
    <Card className="staking-card overflow-hidden border-primary/30 shadow-lg">
      <div
        className="relative h-48 overflow-hidden"
        style={{
          backgroundImage: `url('/staking-coin-hero.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold mb-1 text-white drop-shadow-lg">
            Stake CAN Token
          </h3>
          <p className="text-white/90 drop-shadow-lg">
            APY {apy}% - Nhận thưởng liên tục
          </p>
        </div>
      </div>

      <CardContent className="staking-card-content pt-6 space-y-4">
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Số dư khả dụng
            </span>
            <span className="text-xl font-bold">
              {userCanBalance.toLocaleString()} CAN
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="staking-form space-y-4">
          <div>
            <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
              Số lượng CAN muốn stake
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Nhập số lượng CAN"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg h-12"
              min="0"
              max={userBalance}
            />
          </div>

          {isValidAmount && (
            <div className="p-4 bg-green-500/10 rounded-lg space-y-2 border border-green-500/20 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">
                  Dự kiến phần thưởng
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">7 ngày</p>
                  <p className="text-sm font-bold text-green-500">
                    {((parseFloat(amount) * apy * 7) / (365 * 100)).toFixed(2)}{" "}
                    CAN
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">30 ngày</p>
                  <p className="text-sm font-bold text-green-500">
                    {((parseFloat(amount) * apy * 30) / (365 * 100)).toFixed(2)}{" "}
                    CAN
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">365 ngày</p>
                  <p className="text-sm font-bold text-green-500">
                    {((parseFloat(amount) * apy) / 100).toFixed(2)} CAN
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="staking-form-actions">
            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={!isValidAmount || loading}
            >
              <Zap className="h-5 w-5 mr-2" />
              {loading ? "Đang xử lý..." : "Stake Ngay"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
