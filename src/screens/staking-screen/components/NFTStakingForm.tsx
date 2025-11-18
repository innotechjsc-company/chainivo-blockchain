"use client";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Zap } from "lucide-react";
import { CreateStakingNFTRequest, AvailableNFT } from "@/types/Staking";
import { API_ENDPOINTS, ApiService } from "@/api/api";
import { NFTService } from "@/api/services/nft-service";
import { StakingService } from "@/api/services";
import { TransferService } from "@/services";
import { useAppSelector } from "@/stores";
import { toast } from "sonner";
import { LoadingSkeleton } from "@/screens/staking-screen/components/LoadingSkeleton";
import { formatNumber } from "@/utils/formatters";
import { config } from "@/api/config";
import { LoadingSpinner } from "@/lib/loadingSpinner";

interface NFTStakingFormProps {
  availableNFTs: AvailableNFT[];
  onStake: (request: CreateStakingNFTRequest) => Promise<void>;
  loading?: boolean;
  apy?: number;
  fetchStakingData?: () => Promise<void>;
  getStakingPoolsOnSuccess?: () => Promise<void>;
  setIsLoading?: (isLoading: boolean) => void;
  stakingMyPools?: any[];
  addPendingStake?: (stakeData: any) => string;
  updateStakeStatus?: (id: string, updates: any) => void;
  removeStake?: (id: string) => void;
  setSelectedValue: (value: string) => void;
}

export const NFTStakingForm = ({
  availableNFTs,
  onStake,
  loading = false,
  apy = 15,
  fetchStakingData,
  getStakingPoolsOnSuccess,
  setIsLoading: setParentIsLoading,
  stakingMyPools = [],
  addPendingStake,
  updateStakeStatus,
  removeStake,
  setSelectedValue,
}: NFTStakingFormProps) => {
  const [selectedNFTId, setSelectedNFTId] = useState("");
  const [selectedPoolId, setSelectedPoolId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  const selectedNFT = availableNFTs.find((nft) => nft.id === selectedNFTId);
  const [takePools, setTakePools] = useState<any[]>([]);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [pendingStakeAmount, setPendingStakeAmount] = useState(0);
  const selectedUserNFT = userNFTs.find(
    (nft: any) => String(nft?._id ?? nft?.id) === selectedNFTId
  );
  const userInfo = useAppSelector((state) => state.auth.user);

  // Lấy thông tin pool đã chọn
  const selectedPoolData = takePools.find(
    (pool: any) => String(pool?._id ?? pool?.id) === selectedPoolId
  );
  const currentApy = selectedPoolData?.apy || apy;

  // Validation cho giá trị NFT
  const nftPrice = Number(selectedUserNFT?.price ?? 0);
  const isBelowMinStake =
    selectedPoolData &&
    selectedUserNFT &&
    nftPrice > 0 &&
    nftPrice < (selectedPoolData.minStake || 0);
  const isAboveMaxStake =
    selectedPoolData &&
    selectedUserNFT &&
    nftPrice > (selectedPoolData.maxStake || Infinity);
  const isInvalidNFTPrice = isBelowMinStake || isAboveMaxStake;

  useEffect(() => {
    if (!userInfo || !userInfo.walletAddress) {
      return;
    }
    setSelectedValue(selectedPoolId);
    if (
      selectedPoolId !== "" &&
      selectedPoolId !== null &&
      selectedPoolId !== undefined
    ) {
      fetchUserNFTs();
    }
  }, [selectedPoolId]);

  // Kiểm tra NFT hợp lệ: có giá trong khoảng minStake <= price <= maxStake
  const isValidNFTPrice =
    selectedPoolData &&
    selectedUserNFT &&
    nftPrice > 0 &&
    nftPrice >= (selectedPoolData.minStake || 0) &&
    nftPrice <= (selectedPoolData.maxStake || Infinity);

  const fetchUserNFTs = useCallback(async () => {
    if (!userInfo || !userInfo.walletAddress) {
      setUserNFTs([]);
      return;
    }
    try {
      const response = await NFTService.getNFTsByOwner({
        ownerAddress: userInfo?.walletAddress || "",
      });
      if (response.success) {
        const nfts = (response.data as any).nfts || [];
        setUserNFTs(
          nfts.filter(
            (nft: any) => nft.price >= (selectedPoolData?.minStake || 0)
          )
        );
      } else {
        toast.error(response.message);
        setUserNFTs([]);
      }
    } catch (error) {
      setUserNFTs([]);
    }
  }, [userInfo, selectedPoolData?.minStake]);

  const getStakingPools = async () => {
    const response = await ApiService.get(API_ENDPOINTS.STAKING.POOLS);

    if (response?.success) {
      setTakePools(
        (response?.data as any)?.pools.filter(
          (pool: any) => pool.type === "nft"
        )
      );
    }
  };

  useEffect(() => {
    getStakingPools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPoolData) {
      toast.error("Vui lòng chọn pool staking");
      return;
    }

    if (!selectedUserNFT) {
      toast.error("Vui lòng chọn NFT để stake");
      return;
    }

    // Kiểm tra NFT đã được stake chưa
    if (selectedUserNFT?.isStaking === true) {
      toast.error("Bạn đã stake NFT này và không thể stake tiếp");
      return;
    }

    const nftPriceValue = Number(selectedUserNFT?.price ?? 0);
    if (!nftPriceValue || nftPriceValue <= 0) {
      toast.error("NFT không có giá trị hợp lệ");
      return;
    }

    // Kiểm tra min/max stake
    if (selectedPoolData) {
      if (nftPriceValue < selectedPoolData.minStake) {
        toast.error(
          `Giá trị NFT (${nftPriceValue.toLocaleString()} CAN) thấp hơn mức tối thiểu (${
            selectedPoolData.minStake
          } CAN) của gói stake`
        );
        return;
      }
      if (nftPriceValue > selectedPoolData.maxStake) {
        toast.error(
          `Giá trị NFT (${nftPriceValue.toLocaleString()} CAN) vượt quá mức tối đa (${
            selectedPoolData.maxStake
          } CAN) của gói stake`
        );
        return;
      }
    }
    setPendingStakeAmount(nftPriceValue);
    // Mở dialog xác nhận trước khi stake
    setConfirmDialogOpen(true);
  };

  const createTransaction = async (
    fromAddress: string,
    amount: number,
    nftId: string
  ) => {
    let tempStakeId: string | null = null;

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
      // Kiểm tra đã stake gói này chưa
      if (
        stakingMyPools?.length > 0 &&
        stakingMyPools?.some(
          (item: any) =>
            item?.stake?.id === (selectedPoolData?._id as string) &&
            item?.status === "active"
        )
      ) {
        toast.error("Bạn đã stake gói này");
        return;
      }

      // BƯỚC 1: Thêm stake ngay vào danh sách với status "pending"
      const pendingStakeData = {
        amount: amount, // Use amount parameter instead of stakeAmount from closure
        walletAddress: userInfo?.walletAddress,
        stake: selectedPoolData,
        poolInfo: selectedPoolData,
        nftId: nftId, // Thêm nftId vào pendingStakeData
        status: "pending",
        canUnstake: true,
      };

      tempStakeId = addPendingStake?.(pendingStakeData) ?? null;
      toast.info("Đang chờ xác nhận giao dịch...");

      // BƯỚC 2: Xử lý blockchain transaction
      setIsLoading(true);
      if (setParentIsLoading) {
        setParentIsLoading(true);
      }

      let createStake = await StakingService.stakeNFT(
        selectedPoolData?.id as string,
        nftId as string
      );
      if (createStake.success) {
        if (tempStakeId) {
          removeStake?.(tempStakeId);
        }
        await fetchUserNFTs();
        toast.success("Giao dịch stake thành công");

        setTimeout(async () => {
          try {
            await getStakingPoolsOnSuccess?.();
            if (fetchStakingData) {
              await fetchStakingData();
            }
            setSelectedNFTId("");
            setSelectedPoolId("");
            setIsLoading(false);
            if (setParentIsLoading) {
              setParentIsLoading(false);
            }
          } catch (refreshError) {
            setIsLoading(false);
            if (setParentIsLoading) {
              setParentIsLoading(false);
            }
          }
        }, 500);
      } else {
        if (tempStakeId) {
          removeStake?.(tempStakeId);
        }
        setIsLoading(false);
        if (setParentIsLoading) {
          setParentIsLoading(false);
        }
        toast.error("Giao dịch stake thất bại");
      }
    } catch (error) {
      try {
        console.error("Error JSON:", JSON.stringify(error, null, 2));
      } catch (e) {}

      // Xóa temp stake nếu có lỗi
      if (tempStakeId) {
        removeStake?.(tempStakeId);
      }

      if ((error as any).code === 4001) {
        setIsLoading(false);
        if (setParentIsLoading) {
          setParentIsLoading(false);
        }
        toast.error("Người dùng đã từ chối giao dịch");
      } else if ((error as any).code === -32603) {
        setIsLoading(false);
        if (setParentIsLoading) {
          setParentIsLoading(false);
        }
        toast.error("Lỗi nội bộ. Vui lòng thử lại.");
      } else if ((error as any).code === 205) {
        // AbiError - thường do sai network
        setIsLoading(false);
        if (setParentIsLoading) {
          setParentIsLoading(false);
        }
        toast.error(
          "Lỗi blockchain. Vui lòng kiểm tra wallet đã kết nối đúng network chưa (Polygon Amoy Testnet)"
        );
      } else if ((error as any).message?.includes("Sai network")) {
        setIsLoading(false);
        if (setParentIsLoading) {
          setParentIsLoading(false);
        }
        toast.error((error as any).message);
      } else if ((error as any).message?.includes("insufficient funds")) {
        setIsLoading(false);
        if (setParentIsLoading) {
          setParentIsLoading(false);
        }
        toast.error("Số dư không đủ để thực hiện giao dịch");
      } else if ((error as any).message?.includes("gas")) {
        setIsLoading(false);
        if (setParentIsLoading) {
          setParentIsLoading(false);
        }
        toast.error("Lỗi gas. Vui lòng thử lại.");
      } else if ((error as any).message?.includes("Invalid")) {
        setIsLoading(false);
        if (setParentIsLoading) {
          setParentIsLoading(false);
        }
        toast.error((error as any).message);
      } else {
        setIsLoading(false);
        if (setParentIsLoading) {
          setParentIsLoading(false);
        }
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }

      console.error("=== [STAKE ERROR] End of error handling ===");
    }
  };

  const cretaeMintNftTransaction = async (
    fromAddress?: string,
    nftId?: string,
    tokenId?: string
  ) => {
    try {
      if (!fromAddress || !tokenId) {
        toast.error("Thiếu thông tin địa chỉ ví hoặc token ID");
        setIsLoading(false);
        if (setParentIsLoading) {
          setParentIsLoading(false);
        }
        return;
      }

      // Lấy contract address của NFT
      const contractAddress = config.WALLET_ADDRESSES.NFT_CONTRACT_ADDRESS;

      if (!contractAddress) {
        toast.error("Không tìm thấy địa chỉ contract NFT");
        setIsLoading(false);
        if (setParentIsLoading) {
          setParentIsLoading(false);
        }
        return;
      }

      console.log("🔍 Transferring NFT to Admin:", {
        fromAddress,
        contractAddress,
        tokenId,
        nftId,
      });

      // Bật spinner loading
      setIsTransferring(true);
      toast.info("Đang chuyển NFT sang ví Admin...");

      // BƯỚC 1: Chuyển NFT sang ví admin
      const transferResult = await TransferService.transferNFT({
        fromAddress: fromAddress,
        contractAddress: contractAddress,
        tokenId: tokenId,
      });

      if (!transferResult.transactionHash) {
        toast.error("Không thể chuyển NFT sang ví Admin. Vui lòng thử lại.");
        setIsTransferring(false);
        setIsLoading(false);
        if (setParentIsLoading) {
          setParentIsLoading(false);
        }
        return;
      }

      console.log(
        "✅ NFT transferred successfully:",
        transferResult.transactionHash
      );
      toast.success("Chuyển NFT thành công!");

      // BƯỚC 2: Gọi API stake NFT với transactionHash
      toast.info("Đang xử lý stake NFT...");

      let createStake = await StakingService.stakeNFTMint(
        selectedPoolData?.id as string,
        nftId as string,
        transferResult.transactionHash
      );

      if (createStake.success) {
        await fetchUserNFTs();
        toast.success("Giao dịch stake thành công");

        setTimeout(async () => {
          try {
            await getStakingPoolsOnSuccess?.();
            if (fetchStakingData) {
              await fetchStakingData();
            }
            setSelectedNFTId("");
            setSelectedPoolId("");
            setIsTransferring(false);
            setIsLoading(false);
            if (setParentIsLoading) {
              setParentIsLoading(false);
            }
          } catch (refreshError) {
            setIsTransferring(false);
            setIsLoading(false);
            if (setParentIsLoading) {
              setParentIsLoading(false);
            }
          }
        }, 500);
      } else {
        setIsTransferring(false);
        setIsLoading(false);
        if (setParentIsLoading) {
          setParentIsLoading(false);
        }
        toast.error("Giao dịch stake thất bại");
      }
    } catch (error: any) {
      console.error("Error in cretaeMintNftTransaction:", error);

      // Error handling cho transfer NFT
      if (error?.message?.includes("User denied") || error?.code === 4001) {
        toast.error("Bạn đã từ chối giao dịch chuyển NFT");
      } else if (error?.message?.includes("insufficient funds")) {
        toast.error("Số dư không đủ để thực hiện giao dịch");
      } else if (error?.message?.includes("reverted")) {
        toast.error(
          "Giao dịch bị từ chối bởi smart contract. Vui lòng kiểm tra quyền sở hữu NFT."
        );
      } else {
        toast.error(
          "Lỗi khi chuyển NFT: " + (error?.message || "Vui lòng thử lại")
        );
      }

      setIsTransferring(false);
      setIsLoading(false);
      if (setParentIsLoading) {
        setParentIsLoading(false);
      }
    }
  };

  const handleConfirmStake = async () => {
    setConfirmDialogOpen(false);
    try {
      const nftId =
        selectedUserNFT?._id ?? selectedUserNFT?.id ?? selectedNFTId;
      const tokenId = selectedUserNFT?.tokenId ?? selectedUserNFT?.token_id;
      if (selectedUserNFT?.isMinted === false) {
        await createTransaction(
          userInfo?.walletAddress as string,
          pendingStakeAmount,
          String(nftId)
        );
      } else {
        await cretaeMintNftTransaction(
          userInfo?.walletAddress as string,
          String(nftId),
          String(tokenId)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Show LoadingSkeleton when staking NFT
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <Card className="staking-card overflow-hidden border-primary/30 shadow-lg">
        <div
          className="relative h-48 overflow-hidden"
          style={{
            backgroundImage: `url('/staking-nft-hero.jpg')`,
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
              Stake NFT
            </h3>
            <p className="text-white/90 drop-shadow-lg">
              APY {currentApy}% - Phần thưởng cao hơn
            </p>
          </div>
        </div>

        <CardContent className="staking-card-content pt-6 space-y-4">
          <form onSubmit={handleSubmit} className="staking-form space-y-4">
            {selectedUserNFT && (
              <>
                {selectedNFT && !isInvalidNFTPrice && (
                  <div className="p-4 bg-green-500/10 rounded-lg space-y-2 border border-green-500/20 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">
                        Dự kiến phần thưởng
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Giá trị NFT:</span>
                      <span className="font-bold">
                        {nftPrice.toLocaleString()} CAN
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">7 ngày</p>
                        <p className="text-sm font-bold text-green-500">
                          {((nftPrice * currentApy * 7) / (365 * 100)).toFixed(
                            2
                          )}{" "}
                          CAN
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">30 ngày</p>
                        <p className="text-sm font-bold text-green-500">
                          {((nftPrice * currentApy * 30) / (365 * 100)).toFixed(
                            2
                          )}{" "}
                          CAN
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          365 ngày
                        </p>
                        <p className="text-sm font-bold text-green-500">
                          {((nftPrice * currentApy) / 100).toFixed(2)} CAN
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div>
              <Label
                htmlFor="nft-select"
                className="text-sm font-medium mb-2 block"
              >
                Chọn gói stake NFT
              </Label>
              <Select value={selectedPoolId} onValueChange={setSelectedPoolId}>
                <SelectTrigger className="w-full h-12 text-lg">
                  <SelectValue placeholder="-- Chọn NFT --" />
                </SelectTrigger>
                <SelectContent>
                  {takePools.map((pool, idx) => {
                    const optionId = String(pool?._id ?? pool?.id ?? idx);
                    return (
                      <SelectItem key={optionId} value={optionId}>
                        <div className="flex flex-col">
                          <span className="font-medium">{pool.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
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
                        : `${selectedPoolData.lockPeriod || "-"} ngày`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Stakers
                    </p>
                    <p className="text-sm font-bold text-green-500">
                      {selectedPoolData.totalStakers || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Staked
                    </p>
                    <p className="text-sm font-bold text-green-500">
                      {selectedPoolData.totalStaked || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Min Stake</p>
                    <p className="text-sm font-bold text-green-500">
                      {formatNumber(selectedPoolData.minStake.toString())}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Max Stake</p>
                    <p className="text-sm font-bold text-green-500">
                      {formatNumber(selectedPoolData.maxStake.toString())}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">APY</p>
                    <p className="text-sm font-bold text-green-500">
                      {selectedPoolData.apy || apy}%
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <Label
                htmlFor="nft-select"
                className="text-sm font-medium mb-2 block"
              >
                Chọn NFT để stake
              </Label>
              {userNFTs.length == 0 && selectedPoolId ? (
                <div className="p-4 bg-red-500/10 rounded-lg space-y-2 border border-red-500/20 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-red-500">
                      Không có NFT nào để stake
                    </span>
                  </div>
                </div>
              ) : (
                <Select value={selectedNFTId} onValueChange={setSelectedNFTId}>
                  <SelectTrigger className="w-full h-10 text-sm border-primary focus:border-primary">
                    <SelectValue placeholder="-- Chọn NFT --" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {userNFTs.map((nft, idx) => {
                      const optionId = String(nft?._id ?? nft?.id ?? idx);
                      const isStaking = nft?.isStaking ?? false;
                      return (
                        <SelectItem
                          key={optionId}
                          value={optionId}
                          className="text-sm"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {nft?.name}{" "}
                              <span className="ml-2 text-xs text-muted-foreground">
                                {nft.isStaking ? (
                                  <span className="!text-green-500 font-semibold">
                                    Đã staking
                                  </span>
                                ) : null}
                              </span>
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}

              {selectedUserNFT && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Số tiền trong gói NFT:{" "}
                  {Number(selectedUserNFT?.price ?? 0).toLocaleString()} CAN
                </div>
              )}
            </div>
            {selectedUserNFT?.isStaking === true && (
              <div className="p-4 bg-red-500/10 rounded-lg space-y-2 border border-red-500/20 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-red-500">
                    ⚠️ NFT này đã được staking vui lòng chọn NFT khác
                  </span>
                </div>
              </div>
            )}
            {isInvalidNFTPrice && selectedPoolData && (
              <div className="p-4 bg-red-500/10 rounded-lg space-y-2 border border-red-500/20 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-red-500">
                    ⚠️ Số tiền của NFT không phù hợp
                  </span>
                </div>
                {isBelowMinStake && (
                  <p className="text-sm text-red-500">
                    Giá trị NFT ({nftPrice.toLocaleString()} CAN) thấp hơn mức
                    tối thiểu ({selectedPoolData.minStake} CAN) của gói stake.
                  </p>
                )}
                {isAboveMaxStake && (
                  <p className="text-sm text-red-500">
                    Giá trị NFT ({nftPrice.toLocaleString()} CAN) vượt quá mức
                    tối đa ({selectedPoolData.maxStake} CAN) của gói stake.
                  </p>
                )}
              </div>
            )}

            <div className="staking-form-actions">
              <Button
                type="submit"
                variant="default"
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold gap-2 cursor-pointer"
                disabled={
                  !selectedUserNFT ||
                  !selectedPoolData ||
                  loading ||
                  !isValidNFTPrice ||
                  selectedUserNFT?.isStaking === true
                }
              >
                <Zap className="h-5 w-5 mr-2" />
                {loading ? "Đang xử lý..." : "Stake NFT Ngay"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận stake NFT</DialogTitle>
            <DialogDescription>
              {selectedUserNFT?.isMinted === false
                ? "Bạn có chắc chắn muốn stake NFT này vào gói"
                : `Gói NFT ${selectedPoolData?.name} bạn muốn stake đã được Mint để tiếp tục stake vui lòng thực hiện chuyển gói Nft đó cho ví Admin`}
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Không
            </Button>
            <Button
              variant="default"
              onClick={handleConfirmStake}
              disabled={isLoading || loading}
            >
              Đồng ý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Spinner khi đang chuyển NFT */}
      {isTransferring && <LoadingSpinner />}
    </>
  );
};
