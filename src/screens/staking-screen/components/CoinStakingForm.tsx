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
import { CreateStakingCoinRequest } from "@/types/Staking";
import { API_ENDPOINTS, ApiService } from "@/api/api";
import { useAppSelector } from "@/stores";
import { buildFrontendUrl, config } from "@/api/config";
import { toast } from "sonner";
import { StakingService } from "@/api/services";
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
      `${API_ENDPOINTS.GET_WALLET_CAN_BALANCE}/${user?.walletAddress as string}`
    );
    if (response?.success) {
      setUserCanBalance(
        Number((response?.data as any)?.balance as number) ?? 0
      );
    }
  };

  const getStakingPools = async () => {
    const response = await ApiService.get(API_ENDPOINTS.STAKING.POOLS);
    if (response?.success) {
      setTakePools((response?.data as any)?.pools);
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
      const web3Module = await import("web3");
      const web3 = new web3Module.default(window.ethereum);

      const canTokenABI = [
        {
          name: "balanceOf",
          type: "function" as const,
          inputs: [
            { internalType: "address", name: "account", type: "address" },
          ],
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view" as const,
        },
        {
          name: "transfer",
          type: "function" as const,
          inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable" as const,
        },
      ];

      // Get CAN token address from config
      const canTokenAddress = config.BLOCKCHAIN.CAN_TOKEN_ADDRESS;
      const adminWalletAddress = config.WALLET_ADDRESSES.ADMIN;

      const canTokenContract = new web3.eth.Contract(
        canTokenABI,
        canTokenAddress
      );
      const canBalance = await canTokenContract.methods
        .balanceOf(user?.walletAddress)
        .call();
      const requiredAmount = web3.utils.toWei(stakeAmount.toString(), "ether");

      console.log(
        `💰 CAN Balance: ${web3.utils.fromWei(canBalance as any, "ether")} CAN`
      );

      if (BigInt(canBalance as any) < BigInt(requiredAmount)) {
        throw new Error(
          `Insufficient CAN balance. Required: ${stakeAmount} CAN, Available: ${web3.utils.fromWei(
            canBalance as any,
            "ether"
          )} CAN`
        );
      }

      // Get current gas price and increase ~50% for faster confirmation
      const currentGasPrice = await web3.eth.getGasPrice(); // wei (string | bigint depending on web3 version)
      const currentGasPriceBigInt =
        typeof currentGasPrice === "bigint"
          ? currentGasPrice
          : BigInt(currentGasPrice);
      const optimizedGasPriceBigInt =
        (currentGasPriceBigInt * BigInt(150)) / BigInt(100); // +50%
      const gasPrice = optimizedGasPriceBigInt.toString(); // wei (decimal string)
      const gasLimit = 150000; // reasonable limit for ERC-20 transfer
      debugger;
      const transferResult = await canTokenContract.methods
        .transfer(adminWalletAddress, requiredAmount)
        .send({
          from: user?.walletAddress,
          gas: gasLimit.toString(),
          gasPrice: gasPrice,
        });

      console.log(
        `🔗 Transfer Transaction Hash: ${transferResult.transactionHash}`
      );
      if (transferResult) {
        console.log(selectedPoolData);
        console.log(user?.walletAddress);
        console.log(stakeAmount);
        console.log(userCanBalance);

        // Normalize potential BigInt fields from web3 result
        const normalizedBlockNumber =
          typeof (transferResult as any).blockNumber === "bigint"
            ? (transferResult as any).blockNumber.toString()
            : String((transferResult as any).blockNumber ?? "");

        const createStake = await StakingService.stake({
          poolId: selectedPoolData?._id,
          amount: stakeAmount,
          walletAddress: adminWalletAddress,
          transactionHash: transferResult.transactionHash as string,
          blockNumber: normalizedBlockNumber,
        });
        console.log(createStake);
        debugger;
        toast.success("Giao dịch thành công");
        setTimeout(async () => {
          await getAllCanBalance();
        }, 1000);
      }
    } catch (error) {
      if ((error as any).code === 4001) {
        toast.error("Người dùng đã từ chối giao dịch");
      } else if ((error as any).code === -32603) {
        toast.error("Lỗi nội bộ. Vui lòng thử lại.");
      } else if ((error as any).message?.includes("insufficient funds")) {
        toast.error("Số dư không đủ để thực hiện giao dịch");
      } else if ((error as any).message?.includes("gas")) {
        toast.error("Lỗi gas. Vui lòng thử lại.");
      } else if ((error as any).message?.includes("Invalid")) {
        toast.error((error as any).message);
      } else {
        toast.error(
          (error as any).message || "Có lỗi xảy ra khi tạo giao dịch"
        );
      }
    }
  };

  useEffect(() => {
    getAllCanBalance();
    getStakingPools();
  }, []);

  const stakeAmount = parseFormattedNumber(amount as unknown as string);

  // Lấy thông tin pool đã chọn
  const selectedPoolData = takePools.find((pool) => pool._id === selectedPool);
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
                {takePools.map((pool) => (
                  <SelectItem key={pool?._id} value={pool?._id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{pool.name}</span>
                      {/* <span className="text-sm text-muted-foreground">
                        APY: {pool.apy}% | Min: {pool.minStakeAmount} CAN
                      </span> */}
                    </div>
                  </SelectItem>
                ))}
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
