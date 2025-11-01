"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Zap } from "lucide-react";
import { API_ENDPOINTS, ApiService } from "@/api/api";
import { useAppSelector } from "@/stores";
import { buildFrontendUrl, config } from "@/api/config";
import { toast } from "sonner";
import { StakingService } from "@/api/services";
import { TransferService } from "@/services";
interface CoinStakingFormProps {
  userBalance: number;
  onStake: (request: any) => Promise<void>;
  loading?: boolean;
  apy?: number;
  fetchStakingData: () => Promise<void>;
  getStakingPoolsOnSuccess: () => Promise<void>;
  setIsLoading: (isLoading: boolean) => void;
  stakingMyPools?: any[];
}

export const CoinStakingForm = ({
  userBalance,
  onStake,
  loading = false,
  apy = 10,
  fetchStakingData,
  getStakingPoolsOnSuccess,
  setIsLoading,
  stakingMyPools = [],
}: CoinStakingFormProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const [amount, setAmount] = useState("");
  const [userCanBalance, setUserCanBalance] = useState<number>(0);
  const [takePools, setTakePools] = useState<any[]>([]);
  const [selectedPool, setSelectedPool] = useState<string>("");

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

    if (!selectedPool) {
      toast.error("Vui lòng chọn pool staking");
      return;
    }

    const stakeAmount = parseFormattedNumber(amount);
    if (!stakeAmount || stakeAmount <= 0) {
      toast.error("Vui lòng nhập số lượng CAN hợp lệ");
      return;
    }

    if (stakeAmount > userCanBalance) {
      toast.error("Số CAN trong tài khoản không đủ");
      return;
    }

    // Kiểm tra min/max stake
    if (selectedPoolData) {
      if (stakeAmount < selectedPoolData.minStake) {
        toast.error(
          `Số lượng stake tối thiểu là ${selectedPoolData.minStake} CAN`
        );
        return;
      }
      if (stakeAmount > selectedPoolData.maxStake) {
        toast.error(
          `Số lượng stake tối đa là ${selectedPoolData.maxStake} CAN`
        );
        return;
      }
    }

    try {
      await createTransaction(user?.walletAddress as string, stakeAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllCanBalance = async () => {
    const response = await ApiService.get(
      API_ENDPOINTS.BALANCE.GET_BALANCE(user?.walletAddress as string) +
        "?token=CAN"
    );
    if (response?.success) {
      setUserCanBalance(Number((response?.data as any)?.can as number) ?? 0);
    }
  };

  const getStakingPools = async () => {
    const response = await ApiService.get(API_ENDPOINTS.STAKING.POOLS);

    if (response?.success) {
      setTakePools((response?.data as any)?.pools);
    }
  };

  const createTransaction = async (fromAddress: string, amount: number) => {
    try {
      setIsLoading(true);
      if (!window.ethereum) {
        setIsLoading(false);
        throw new Error(
          "MetaMask không được cài đặt. Vui lòng cài đặt MetaMask extension."
        );
      }

      // Validate from address
      if (!fromAddress) {
        setIsLoading(false);
        throw new Error("Invalid sender address");
      }
      debugger;
      // Kiểm tra đã stake gói này chưa
      if (
        stakingMyPools?.length > 0 &&
        stakingMyPools?.some(
          (item: any) => item?.poolId?._id === (selectedPoolData?._id as string)
        )
      ) {
        toast.error("Bạn đã stake gói này");
        setIsLoading(false);
        return;
      }
      let res = await TransferService.sendCanTransfer({
        fromAddress,
        amountCan: amount,
      });
      if (res.transactionHash) {
        let createStake = await StakingService.stake(
          selectedPoolData?.id as string,
          res.rawReceipt.transactionHash
        );
        debugger;
        if (createStake.success) {
          toast.success("Giao dịch stake thành công");
          setTimeout(async () => {
            await fetchStakingData();
            await getStakingPoolsOnSuccess();
            await getAllCanBalance();
            setAmount("");
            setSelectedPool("");
            setIsLoading(false);
          }, 1500);
        } else {
          setIsLoading(false);
          toast.error("Giao dịch stake thất bại");
        }
      }
    } catch (error) {
      if ((error as any).code === 4001) {
        setIsLoading(false);
        toast.error("Người dùng đã từ chối giao dịch");
      } else if ((error as any).code === -32603) {
        setIsLoading(false);
        toast.error("Lỗi nội bộ. Vui lòng thử lại.");
      } else if ((error as any).message?.includes("insufficient funds")) {
        setIsLoading(false);
        toast.error("Số dư không đủ để thực hiện giao dịch");
      } else if ((error as any).message?.includes("gas")) {
        setIsLoading(false);
        toast.error("Lỗi gas. Vui lòng thử lại.");
      } else if ((error as any).message?.includes("Invalid")) {
        setIsLoading(false);
        toast.error((error as any).message);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCanBalance();
    getStakingPools();
  }, []);

  const stakeAmount = parseFormattedNumber(amount as unknown as string);

  // Lấy thông tin pool đã chọn
  const selectedPoolData = takePools.find(
    (pool) => String(pool?._id ?? pool?.id) === selectedPool
  );
  const currentApy = selectedPoolData?.apy || apy;

  // Validation cho min/max stake
  const isBelowMinStake =
    selectedPoolData &&
    stakeAmount > 0 &&
    stakeAmount < selectedPoolData.minStake;
  const isAboveMaxStake =
    selectedPoolData && stakeAmount > selectedPoolData.maxStake;
  const isInvalidStakeAmount = isBelowMinStake || isAboveMaxStake;

  const isValidAmount =
    stakeAmount > 0 &&
    stakeAmount <= userCanBalance &&
    selectedPool &&
    selectedPoolData &&
    !isInvalidStakeAmount;
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
            APY {currentApy}% - Nhận thưởng liên tục
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
            <Label htmlFor="pool" className="text-sm font-medium mb-2 block">
              Chọn gói Stake
            </Label>
            <Select value={selectedPool} onValueChange={setSelectedPool}>
              <SelectTrigger className="w-full h-12 text-lg">
                <SelectValue placeholder="Chọn pool staking" />
              </SelectTrigger>
              <SelectContent>
                {takePools.map((pool, idx) => {
                  const optionId = String(pool?._id ?? pool?.id ?? idx);
                  return (
                    <SelectItem key={optionId} value={optionId}>
                      <div className="flex flex-col">
                        <span className="font-medium">{pool.name}</span>
                        {/* <span className="text-sm text-muted-foreground">
                        APY: {pool.apy}% | Min: {pool.minStakeAmount} CAN
                      </span> */}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
              Số lượng CAN stake
            </Label>
            <Input
              id="amount"
              type="text"
              placeholder="Nhập số lượng CAN"
              value={amount}
              onChange={handleAmountChange}
              className={`text-lg h-12 ${
                isExceedBalance || isInvalidStakeAmount
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
            />

            {isExceedBalance && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <span className="text-red-500">⚠️</span>
                Số CAN trong tài khoản không đủ. Số dư khả dụng:{" "}
                {userCanBalance.toLocaleString()} CAN
              </p>
            )}
            {isBelowMinStake && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <span className="text-red-500">⚠️</span>
                Số lượng stake tối thiểu là {selectedPoolData?.minStake} CAN
              </p>
            )}
            {isAboveMaxStake && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <span className="text-red-500">⚠️</span>
                Số lượng stake tối đa là {selectedPoolData?.maxStake} CAN
              </p>
            )}
            {isValidAmount && selectedPoolData && (
              <p className="text-green-600 text-sm mt-2">
                Tổng thưởng dự kiến:{" "}
                {((stakeAmount * selectedPoolData.apy) / 100).toFixed(2)} CAN
              </p>
            )}
          </div>

          {selectedPoolData && (
            <div className="p-4 bg-green-500/10 rounded-lg space-y-2 border border-green-500/20 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">
                  Thông tin gói stake ({selectedPoolData.name})
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Thời gian stake
                  </p>
                  <p className="text-sm font-bold text-green-500">
                    {selectedPoolData.name === "Flexible Staking Pool"
                      ? "Không giới hạn"
                      : `${selectedPoolData.lockPeriod} ngày`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Stakers</p>
                  <p className="text-sm font-bold text-green-500">
                    {selectedPoolData.totalStakers}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Staked</p>
                  <p className="text-sm font-bold text-green-500">
                    {selectedPoolData.totalStaked}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Min Stake</p>
                  <p className="text-sm font-bold text-green-500">
                    {selectedPoolData.minStake} CAN
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Max Stake</p>
                  <p className="text-sm font-bold text-green-500">
                    {selectedPoolData.maxStake} CAN
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">APY</p>
                  <p className="text-sm font-bold text-green-500">
                    {selectedPoolData.apy}%
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="staking-form-actions">
            <Button
              type="submit"
              className="w-full h-12 text-lg cursor-pointer"
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
