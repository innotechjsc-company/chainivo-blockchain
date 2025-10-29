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
import { buildFrontendUrl, config } from "@/api/config";

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

  // Hàm format số với dấu phẩy
  const formatNumberWithCommas = (value: string): string => {
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = value.replace(/[^0-9]/g, "");

    // Chuyển đổi thành số và format với dấu phẩy
    if (numericValue === "") return "";

    const number = parseInt(numericValue, 10);
    return number.toLocaleString("vi-VN");
  };

  // Hàm parse số từ string đã format
  const parseFormattedNumber = (value: string): number => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue === "" ? 0 : parseInt(numericValue, 10);
  };

  // Hàm xử lý thay đổi input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatNumberWithCommas(inputValue);
    setAmount(formattedValue);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const stakeAmount = parseFormattedNumber(amount);
    if (!stakeAmount || stakeAmount <= 0) {
      return;
    }

    if (stakeAmount > userCanBalance) {
      return;
    }

    try {
      await createTransaction(user?.walletAddress as string, stakeAmount);
    } catch (error) {
      console.error(error);
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
  const encodeERC20Transfer = (toAddress: string, amount: number): string => {
    // Validate inputs
    if (!toAddress || !toAddress.startsWith("0x") || toAddress.length !== 42) {
      throw new Error("Invalid destination address");
    }

    if (amount <= 0 || !isFinite(amount)) {
      throw new Error("Invalid amount");
    }

    // Helper function to encode address (remove 0x and pad to 64 chars)
    const encodeAddress = (address: string): string => {
      return address.slice(2).toLowerCase().padStart(64, "0");
    };

    // Helper function to encode uint256 (convert to hex and pad to 64 chars)
    const encodeUint256 = (value: bigint): string => {
      return value.toString(16).padStart(64, "0");
    };

    // Convert amount to wei (18 decimals) with proper rounding
    const amountWei = BigInt(Math.floor(amount * Math.pow(10, 18)));

    // ERC-20 transfer function selector (transfer(address,uint256))
    const functionSelector = "a9059cbb";

    // Encode parameters
    const encodedTo = encodeAddress(toAddress);
    const encodedAmount = encodeUint256(amountWei);

    // Combine function selector with encoded parameters
    return "0x" + functionSelector + encodedTo + encodedAmount;
  };
  const createTransaction = async (fromAddress: string, amount: number) => {
    try {
      if (!window.ethereum) {
        throw new Error(
          "MetaMask không được cài đặt. Vui lòng cài đặt MetaMask extension."
        );
      }

      // Validate from address
      if (!fromAddress) {
        throw new Error("Invalid sender address");
      }
      const CAN_TOKEN_CONTRACT = config.BLOCKCHAIN.CAN_TOKEN_ADDRESS;
      // Destination wallet address (where tokens will be sent)
      const DESTINATION_WALLET = "0x7c4767673cc6024365e08f2af4369b04701a5fed";
      // Encode ERC-20 transfer data
      const data = encodeERC20Transfer(DESTINATION_WALLET, amount);

      // Request transaction chuyển can cho admin
      let result = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: fromAddress,
            to: CAN_TOKEN_CONTRACT, // Token contract address
            value: "0x0", // No ETH value for ERC-20 transfer
            data: data,
            gas: "0xC350", // 50000 gas limit for ERC-20 transfer
          },
        ],
      });

      // Nếu có result (transaction hash), chờ 1.5 giây rồi cập nhật balance
      if (result) {
        console.log("Transaction successful:", result);
        setTimeout(async () => {
          await getAllCanBalance();
        }, 1000); // Delay 1.5 giây để blockchain xử lý transaction
      }
    } catch (error) {
      if ((error as any).code === 4001) {
        alert("Người dùng đã từ chối giao dịch");
      } else if ((error as any).code === -32603) {
        alert("Lỗi nội bộ. Vui lòng thử lại.");
      } else if ((error as any).message?.includes("insufficient funds")) {
        alert("Số dư không đủ để thực hiện giao dịch");
      } else if ((error as any).message?.includes("gas")) {
        alert("Lỗi gas. Vui lòng thử lại.");
      } else if ((error as any).message?.includes("Invalid")) {
        alert((error as any).message);
      } else {
        alert((error as any).message || "Có lỗi xảy ra khi tạo giao dịch");
      }
    }
  };

  useEffect(() => {
    getAllCanBalance();
  }, []);

  const stakeAmount = parseFormattedNumber(amount as unknown as string);
  const isValidAmount = stakeAmount > 0 && stakeAmount <= userCanBalance;
  const isExceedBalance = stakeAmount > userCanBalance && stakeAmount > 0;

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
              type="text"
              placeholder="Nhập số lượng CAN"
              value={amount}
              onChange={handleAmountChange}
              className={`text-lg h-12 ${
                isExceedBalance ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {isExceedBalance && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <span className="text-red-500">⚠️</span>
                Số CAN trong tài khoản không đủ. Số dư khả dụng:{" "}
                {userCanBalance.toLocaleString()} CAN
              </p>
            )}
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
                    {((stakeAmount * apy * 7) / (365 * 100)).toFixed(2)} CAN
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">30 ngày</p>
                  <p className="text-sm font-bold text-green-500">
                    {((stakeAmount * apy * 30) / (365 * 100)).toFixed(2)} CAN
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">365 ngày</p>
                  <p className="text-sm font-bold text-green-500">
                    {((stakeAmount * apy) / 100).toFixed(2)} CAN
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
