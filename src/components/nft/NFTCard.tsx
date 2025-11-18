"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { NFTItem } from "@/types/NFT";
import LevelBadge from "./LevelBadge";
import NFTTypeBadge from "./NFTTypeBadge";
import InvestmentProgressBar from "./InvestmentProgressBar";
import CountdownTimer from "./CountdownTimer";
import MysteryRewardsPopover from "./MysteryRewardsPopover";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatNumber } from "@/utils/formatters";
import { Send } from "lucide-react";
import { config, TOKEN_DEAULT_CURRENCY } from "@/api/config";
import { NFTService } from "@/api/services/nft-service";
import { FeeService } from "@/api/services";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useAppSelector } from "@/stores";
import TransferService from "@/services/TransferService";
import { LoadingSpinner } from "@/lib/loadingSpinner";

interface NFTCardProps {
  nft: NFTItem;
  showActions?: boolean;
  onActionClick?: (
    nft: NFTItem,
    action: "sell" | "buy" | "open" | "cancel" | "withdraw"
  ) => void;
  className?: string;

  // Props để tương thích ngược với NFTCard cũ
  type?: string;
  onListForSale?: (nft: NFTItem) => void;
  onClick?: (id: string) => void;
  onRefreshNFTs?: () => void | Promise<void>;
}

// Map level sang border shadow color classes
const LEVEL_BORDER_CLASSES: Record<string, string> = {
  "1": "border-gray-700 shadow-lg shadow-gray-900/60",
  "2": "border-gray-600 shadow-lg shadow-gray-800/60",
  "3": "border-yellow-500 shadow-lg shadow-yellow-900/40",
  "4": "border-purple-500 shadow-lg shadow-purple-900/40",
  "5": "border-cyan-500 shadow-lg shadow-cyan-900/40",
};

export default function NFTCard({
  nft,
  showActions = false,
  onActionClick,
  className = "",
  // Props tuong thich nguoc
  type,
  onListForSale,
  onClick,
  onRefreshNFTs,
}: NFTCardProps) {
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawSuccessDialogOpen, setWithdrawSuccessDialogOpen] =
    useState(false);
  const [withdrawResult, setWithdrawResult] = useState<{
    contractAddress?: string;
    transactionHash?: string;
    tokenId?: string | number;
    explorerUrl?: string;
  } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [transferToAdminDialogOpen, setTransferToAdminDialogOpen] =
    useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [mintingFeeAmount, setMintingFeeAmount] = useState<number | null>(null);
  const [mintingFeeDetails, setMintingFeeDetails] = useState<{
    type: "fixed" | "percentage";
    value: number;
  } | null>(null);
  const [mintingFeeLoading, setMintingFeeLoading] = useState(false);
  const [payingMintingFee, setPayingMintingFee] = useState(false);
  const [mintingFeeError, setMintingFeeError] = useState<string | null>(null);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const borderClass =
    LEVEL_BORDER_CLASSES[nft.level] || LEVEL_BORDER_CLASSES["1"];

  // Lấy walletAddress từ Redux store
  const walletAddress = useAppSelector(
    (state) => state.wallet.wallet?.address || ""
  );

  // Kiểm tra component đã mount (để tránh lỗi SSR với portal)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Đóng modal khi isLoading là true
  useEffect(() => {
    if (isLoading && withdrawDialogOpen) {
      setWithdrawDialogOpen(false);
    }
  }, [isLoading, withdrawDialogOpen]);

  // Nếu có props cũ (type, onListForSale, onClick), tự động enable showActions
  const shouldShowActions = showActions || type !== undefined;

  const getNftBasePrice = (): number => {
    const basePrice =
      (nft as any)?.nft?.salePrice ??
      (nft as any)?.nft?.price ??
      nft.salePrice ??
      nft.price ??
      0;

    const parsedPrice = Number(basePrice);
    return Number.isNaN(parsedPrice) ? 0 : parsedPrice;
  };

  const resetMintingFeeState = () => {
    setMintingFeeAmount(null);
    setMintingFeeDetails(null);
    setMintingFeeLoading(false);
    setMintingFeeError(null);
    setPayingMintingFee(false);
  };

  // Function to get NFT image from API backend or fallback to default
  const getNFTImage = (nft: NFTItem): string => {
    // Helper to construct full image URL from API
    const getImageUrl = (imageData: any): string | null => {
      if (!imageData) return null;

      let imageUrl: string;

      // Handle different image data structures
      if (typeof imageData === "string") {
        imageUrl = imageData;
      } else if (imageData?.url) {
        imageUrl = imageData.url;
      } else if (imageData?.image) {
        imageUrl =
          typeof imageData.image === "string"
            ? imageData.image
            : imageData.image?.url;
      } else {
        return null;
      }

      if (!imageUrl || imageUrl.trim() === "") return null;

      // If URL is already a full URL (starts with http), use it directly
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return imageUrl;
      }

      // If it's a relative path, combine with API_BASE_URL
      // Handle slashes properly to avoid double slashes
      const apiBase = config.API_BASE_URL.endsWith("/")
        ? config.API_BASE_URL.slice(0, -1)
        : config.API_BASE_URL;
      const imagePath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
      return `${apiBase}${imagePath}`;
    };

    // Try to get image from API backend first
    const apiImageUrl = getImageUrl(nft?.image);
    if (apiImageUrl) {
      return apiImageUrl;
    }

    // Default fallback for all NFTs
    return "/nft-box.jpg";
  };

  const nftImage = getNFTImage(nft);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to default image if the image fails to load
    const target = e.target as HTMLImageElement;
    target.src = "/nft-box.jpg";
  };

  // Fallback check for mystery box openable status
  const isMysteryBoxOpenable =
    nft.type === "mysteryBox"
      ? nft.isOpenable !== undefined
        ? nft.isOpenable // Ưu tiên từ API transform
        : // Fallback: Check rewards structure
        Array.isArray(nft.rewards)
        ? // Raw array format từ API (chưa transform)
          nft.rewards.some((r: any) => r.isOpenable === true)
        : // Transformed object format
        nft.rewards?.tokens?.length || nft.rewards?.nfts?.length
        ? true
        : false
      : false;

  const handleAction = async (
    e: React.MouseEvent,
    action: "sell" | "buy" | "open" | "cancel" | "withdraw"
  ) => {
    // Ngăn chặn event bubble lên card parent (tránh trigger onClick của card)
    e.stopPropagation();

    // Lấy tokenId từ NFT
    const nftAny = nft as any;
    const tokenId = nftAny.tokenId || nftAny.token_id;

    // Kiểm tra tokenId và walletAddress để gọi API checkOwnership
    if (action === "sell" && nft.isMinted === true) {
      if (!tokenId) {
        toast.error("NFT này không có tokenId để kiểm tra quyền sở hữu.");
        return;
      }
      if (!walletAddress) {
        toast.error("Vui lòng kết nối ví để kiểm tra quyền sở hữu NFT.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await NFTService.checkOwnership({
          nftId: String(tokenId),
          walletAddress: walletAddress,
        });
        if (response.success && response.data?.isOwner === true) {
          // Xử lý callback mới
          if (onActionClick) {
            onActionClick(nft, action);
          }

          // Xử lý callback cũ (tương thích ngược)
          if (action === "sell" && onListForSale) {
            onListForSale(nft);
          }
        } else {
          toast.warning(
            response.error ||
              response.message ||
              "Bạn không sở hữu NFT này trên blockchain hoặc bạn đã đăng bán NFT này."
          );
        }
      } catch (error: any) {
        console.error("Error checking NFT ownership:", error);
        toast.error(
          error?.message || "Có lỗi xảy ra khi kiểm tra quyền sở hữu NFT."
        );
      } finally {
        setIsLoading(false);
      }
    }
    if (onActionClick) {
      onActionClick(nft, action);
    }
  };

  // Handler cho onClick cũ
  const handleCardClick = () => {
    if (onClick) {
      onClick(nft.id);
    }
  };

  const handleOpenMintingFeeModal = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!walletAddress) {
      toast.error("Vui lòng kết nối ví trước khi thực hiện rút NFT.");
      return;
    }

    resetMintingFeeState();
    setWithdrawDialogOpen(true);
    setMintingFeeLoading(true);

    try {
      const feeResponse = await FeeService.getSystemFees();
      const feeData = feeResponse?.data as any;

      let mintingFeeConfig: any =
        feeData?.mintingFee ||
        feeData?.fees?.mintingFee ||
        (Array.isArray(feeData)
          ? feeData.find(
              (fee: any) =>
                fee?.code === "mintingFee" ||
                fee?.name === "mintingFee" ||
                fee?.key === "mintingFee"
            )
          : undefined);

      if (!mintingFeeConfig && feeData?.data) {
        mintingFeeConfig = feeData.data?.mintingFee;
      }

      const feeType = (mintingFeeConfig?.type || "percentage") as
        | "fixed"
        | "percentage";
      const feeValue = Number(mintingFeeConfig?.value || 0);
      const nftPrice = getNftBasePrice();

      let calculatedAmount = 0;
      if (feeValue > 0 && feeType === "percentage") {
        calculatedAmount = (nftPrice * feeValue) / 100;
        debugger;
      } else if (feeValue > 0 && feeType === "fixed") {
        calculatedAmount = feeValue;
        debugger;
      }
      setMintingFeeDetails({
        type: feeType,
        value: feeValue,
      });
      setMintingFeeAmount(calculatedAmount);
      debugger;
      if (!mintingFeeConfig || feeValue === 0) {
        toast.info(
          "Hệ thống không yêu cầu phí minting cho NFT này. Bạn có thể rút trực tiếp."
        );
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy phí minting:", error);
      setMintingFeeError(
        error?.message ||
          "Không thể lấy thông tin phí minting. Vui lòng thử lại."
      );
    } finally {
      setMintingFeeLoading(false);
    }
  };

  const handlePayMintingFee = async (e?: React.MouseEvent) => {
    // Ngăn chặn event bubble lên card onClick
    e?.preventDefault();
    e?.stopPropagation();

    if (mintingFeeLoading) return;

    const amount = mintingFeeAmount ?? 0;
    if (amount <= 0) {
      setWithdrawDialogOpen(false);
      setShowLoadingSpinner(true);
      try {
        await handleWithdrawConfirm();
      } finally {
        setShowLoadingSpinner(false);
      }
      return;
    }

    if (!walletAddress) {
      toast.error("Không tìm thấy địa chỉ ví. Vui lòng kết nối lại.");
      return;
    }

    setPayingMintingFee(true);
    setShowLoadingSpinner(true);
    try {
      await TransferService.sendCanTransfer({
        fromAddress: walletAddress,
        toAddressData: config.WALLET_ADDRESSES.ADMIN,
        amountCan: amount,
        gasLimit: 200000,
        gasBoostPercent: 80,
      });

      toast.success("Thanh toán phí minting thành công.");
      setWithdrawDialogOpen(false);
      await handleWithdrawConfirm();
    } catch (error: any) {
      console.error("Lỗi khi thanh toán phí minting:", error);
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        "Thanh toán phí thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setPayingMintingFee(false);
      setShowLoadingSpinner(false);
    }
  };

  // Handler cho rút NFT về ví
  const handleWithdrawConfirm = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsWithdrawing(true);
    setIsLoading(true);
    try {
      const response = await NFTService.mintNFTToBlockchain({
        nftId: nft.id,
      });

      if (response.success) {
        toast.success("Rút NFT về ví thành công");
        setIsLoading(false);

        setWithdrawDialogOpen(false);

        // Lấy thông tin từ response
        const responseData = (response.data || {}) as Record<string, any>;
        const contractAddress =
          responseData?.contractAddress ??
          responseData?.contract_address ??
          responseData?.contract ??
          responseData?.collection?.contractAddress ??
          (nft as any)?.contractAddress;
        const transactionHash =
          responseData?.transactionHash ??
          responseData?.transaction_hash ??
          responseData?.txHash ??
          responseData?.tx_hash ??
          responseData?.transaction?.hash;
        const tokenId =
          responseData?.tokenId ??
          responseData?.token_id ??
          responseData?.tokenID ??
          responseData?.token?.id ??
          (nft as any)?.tokenId ??
          (nft as any)?.token_id;
        debugger;
        // Tạo link tra cứu giao dịch
        const explorerUrl = contractAddress
          ? `https://amoy.polygonscan.com/token/${contractAddress}${
              tokenId !== undefined && tokenId !== null && tokenId !== ""
                ? `?a=${tokenId}`
                : ""
            }`
          : undefined;

        // Lưu thông tin vào state
        setWithdrawResult({
          contractAddress,
          transactionHash,
          tokenId,
          explorerUrl,
        });

        // Mở modal thông báo thành công
        setSuccessDialogOpen(true);
      } else {
        setIsLoading(false);
        toast.error(response.message || "Rút NFT về ví thất bại");
      }
    } catch (error) {
      console.error("Error withdrawing NFT:", error);
      setIsLoading(false);
      toast.error("Đã xảy ra lỗi khi rút NFT về ví");
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Hàm xử lý khi đóng modal thành công
  const handleSuccessDialogClose = async () => {
    setSuccessDialogOpen(false);
    setIsLoading(false);

    // Gọi API refresh
    if (onRefreshNFTs) {
      await onRefreshNFTs();
    }
  };

  useEffect(() => {
    setWithdrawSuccessDialogOpen(true);
  }, [withdrawResult]);

  // Render action button dựa vào type
  const renderActionButton = () => {
    if (!shouldShowActions) return null;
    return (
      <div className="flex gap-2 w-full flex-col">
        {nft?.type === "mysteryBox" && !nft.isStaking && !nft.isSale && (
          <MysteryRewardsPopover
            rewards={nft.rewards}
            trigger={
              <Button
                onClick={(e) => handleAction(e, "open")}
                disabled={!isMysteryBoxOpenable}
                className={`
                  inline-flex flex-1 min-w-0 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                  transition-all disabled:pointer-events-none disabled:opacity-50
                  [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
                  outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
                  aria-invalid:ring-destructive/40 aria-invalid:border-destructive
                  h-9 px-4 py-2 has-[>svg]:px-3 gap-2 cursor-pointer
                  ${
                    isMysteryBoxOpenable
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 hover:bg-primary/90 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-700 text-gray-400"
                  }
                `}
              >
                {isMysteryBoxOpenable ? (
                  <>
                    <span>🎁</span>
                    <span>Mở hộp quà</span>
                    <span>✨</span>
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    <span>Chưa thể mở</span>
                  </>
                )}
              </Button>
            }
          />
        )}
        {!nft.isStaking && !nft.isSale ? (
          <div className="flex w-full gap-2 items-center">
            {nft?.isMinted === false ? (
              <Button
                onClick={handleOpenMintingFeeModal}
                className="
         inline-flex flex-1 min-w-0 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
        transition-all disabled:pointer-events-none disabled:opacity-50
        [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
        outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
        aria-invalid:ring-destructive/40 aria-invalid:border-destructive
        h-9 px-4 py-2 has-[>svg]:px-3 gap-2 cursor-pointer
        bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white
      "
              >
                Rút về ví
              </Button>
            ) : null}
            {!nft.isSale && (
              <Button
                onClick={(e) => handleAction(e, "sell")}
                className="
        inline-flex flex-1 min-w-0 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
        transition-all disabled:pointer-events-none disabled:opacity-50
        [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
        outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
        aria-invalid:ring-destructive/40 aria-invalid:border-destructive
        h-9 px-4 py-2 has-[>svg]:px-3 gap-2 cursor-pointer
        bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white
      "
              >
                Đăng bán
              </Button>
            )}
          </div>
        ) : (
          <Button
            onClick={(e) => handleAction(e, "cancel")}
            className="
inline-flex flex-1 min-w-0 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
transition-all disabled:pointer-events-none disabled:opacity-50
[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
aria-invalid:ring-destructive/40 aria-invalid:border-destructive
h-9 px-4 py-2 has-[>svg]:px-3 gap-2 cursor-pointer
bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white
"
          >
            Huỷ{" "}
          </Button>
        )}
      </div>
    );
  };

  const actionSection = renderActionButton();

  return (
    <div
      className={`
        rounded-xl border-2 overflow-hidden bg-gray-900 flex flex-col h-full
        transition-all duration-300 hover:scale-[1.02]
        ${borderClass}
        ${nft.type === "mysteryBox" && nft.isOpenable ? "hover:shadow-2xl" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick ? handleCardClick : undefined}
    >
      {/* Badges overlay trên ảnh */}
      <div className="relative">
        <img
          src={nftImage}
          alt={nft.name}
          className="w-full h-56 object-cover"
          onError={handleImageError}
        />

        {/* Badges trên góc trái */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <LevelBadge level={nft.level} />
          <NFTTypeBadge type={nft.type} />
        </div>
        {/* Status badges trên góc phải */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          {nft.isFeatured && (
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              ⭐ Nổi bật
            </div>
          )}

          {/* Mystery Box: Hiển thị trạng thái mở hộp */}
          {nft.type === "mysteryBox" && isMysteryBoxOpenable && (
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
              ✨ Sẵn sàng mở
            </div>
          )}

          {/* Các loại NFT khác: Hiển thị trạng thái bán */}
          {nft.type !== "mysteryBox" && nft.isSale && (
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500 text-white">
              Đang bán
            </div>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* Tên NFT - Fixed height */}
        <h3 className="text-lg font-bold line-clamp-1 text-gray-100 min-h-[1.5rem]">
          {(nft as any)?.name || "—"}
        </h3>

        {/* Mô tả - Fixed height */}
        <p className="text-sm text-gray-400 line-clamp-2 min-h-[2.5rem]">
          {(nft as any)?.description || "—"}
        </p>

        {/* Mystery Box layout - riêng biệt */}
        {nft.type === "mysteryBox" ? (
          <div className="flex flex-col flex-1 gap-3">
            {/* Divider */}
            <div className="border-t border-gray-700" />
            {/* Giá hộp - Fixed height */}
            <div className="flex items-center justify-between min-h-[1.75rem]">
              <span className="text-sm text-gray-400">Giá hộp:</span>
              <span className="text-lg font-bold text-gray-100">
                {formatNumber(nft.price || 0)}{" "}
                <span className="text-sm uppercase">
                  {nft.currency ? nft.currency.toUpperCase() : "CAN"}
                </span>
              </span>
            </div>

            {/* Rewards popover */}
            {/* <MysteryRewardsPopover rewards={nft.rewards} /> */}

            {actionSection && <div className="mt-auto">{actionSection}</div>}
          </div>
        ) : (
          <div className="flex flex-col flex-1 border-t border-gray-700 pt-3 space-y-2">
            {/* Giá cho các loại NFT khác - Fixed height */}
            <div className="flex items-center justify-between min-h-[1.75rem]">
              <span className="text-sm text-gray-400">
                {nft.type === "investment" ? "Giá/cổ phần:" : "Giá:"}
              </span>
              <span className="text-lg font-bold text-gray-100">
                {formatNumber(
                  (nft as any)?.nft?.salePrice ??
                    (nft as any)?.nft?.salePrice ??
                    (nft as any)?.nft?.price ??
                    nft.salePrice ??
                    nft.price ??
                    0
                )}{" "}
                <span className="text-sm uppercase">
                  {nft.currency
                    ? nft.currency.toUpperCase()
                    : (nft as any)?.nft?.currency
                    ? (nft as any)?.nft?.currency.toUpperCase()
                    : "CAN".toUpperCase()}
                </span>
              </span>
            </div>

            {/* Investment-specific content */}
            {nft.type === "investment" &&
              nft.totalShares &&
              nft.soldShares !== undefined &&
              nft.totalInvestors !== undefined &&
              nft.pricePerShare !== undefined && (
                <>
                  <InvestmentProgressBar
                    soldShares={nft.soldShares}
                    totalShares={nft.totalShares}
                    totalInvestors={nft.totalInvestors}
                    pricePerShare={nft.pricePerShare}
                    currency={nft.currency}
                  />
                  {nft.investmentEndDate && (
                    <CountdownTimer endDate={nft.investmentEndDate} />
                  )}
                </>
              )}

            {/* My NFT specific content - Fixed height */}
            {type === "my-nft" && (
              <div className="space-y-2">
                {/* Staking status - Fixed height */}
                <div className="flex items-center justify-between min-h-[1.5rem]">
                  <span className="text-sm text-gray-400">Staking:</span>
                  <span className="text-sm font-medium text-gray-100">
                    {(nft as any).isStaking === true ? "Có" : "Chưa"}
                  </span>
                </div>
                {/* Minted status - Fixed height */}
                <div className="flex items-center justify-between min-h-[1.5rem]">
                  <span className="text-sm text-gray-400">Minted:</span>
                  <span className="text-sm font-medium text-gray-100">
                    {(nft as any).isMinted === true ? "Đã Mint" : "Chưa Mint"}
                  </span>
                </div>
              </div>
            )}
            {/* Trạng thái bán - Fixed height */}
            {nft.isSale && (
              <div className="space-y-2">
                <div className="flex items-center justify-between min-h-[1.5rem]">
                  <span className="text-sm text-gray-400">Trạng thái:</span>
                  <span className="text-sm font-medium text-gray-100">
                    Đã bán
                  </span>
                </div>
              </div>
            )}

            {/* Action button */}
            {actionSection && <div className="mt-auto">{actionSection}</div>}
          </div>
        )}
      </div>

      <Dialog
        open={withdrawDialogOpen}
        onOpenChange={(open) => {
          if (!open && !payingMintingFee) {
            setWithdrawDialogOpen(false);
            resetMintingFeeState();
          }
        }}
      >
        <DialogContent
          onClick={(e) => {
            // Ngăn chặn event bubble lên card onClick
            e.stopPropagation();
          }}
        >
          <DialogHeader>
            <DialogTitle>Thanh toán phí rút NFT</DialogTitle>
            <DialogDescription>
              Để rút NFT về ví, vui lòng thanh toán cước phí minting cho hệ
              thống.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {mintingFeeLoading ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Spinner className="h-4 w-4" />
                <span>Đang tải thông tin phí...</span>
              </div>
            ) : mintingFeeError ? (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                {mintingFeeError}
              </div>
            ) : (
              <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Loại phí</span>
                  <span className="font-medium capitalize">
                    {mintingFeeDetails?.type === "fixed"
                      ? "Cố định"
                      : "Phần trăm"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-base font-semibold text-primary">
                  <span>Tổng phí cần thanh toán</span>
                  <span>
                    {formatNumber(mintingFeeAmount ?? 0)}{" "}
                    {TOKEN_DEAULT_CURRENCY}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (payingMintingFee) return;
                setWithdrawDialogOpen(false);
                resetMintingFeeState();
              }}
              disabled={payingMintingFee}
            >
              Thoát
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                handlePayMintingFee(e);
              }}
              disabled={
                mintingFeeLoading ||
                payingMintingFee ||
                Boolean(mintingFeeError)
              }
            >
              {payingMintingFee ? "Đang thanh toán..." : "Đồng ý"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading &&
        isMounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto">
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-900/95 rounded-lg border border-primary/30 shadow-2xl pointer-events-auto">
              <Spinner className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-gray-100">
                Đang xử lý giao dịch...
              </span>
            </div>
          </div>,
          document.body
        )}

      {/* Loading spinner cho thanh toán phí minting */}
      {showLoadingSpinner &&
        isMounted &&
        createPortal(<LoadingSpinner />, document.body)}

      {/* Modal thông báo thành công */}
      <Dialog
        open={successDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleSuccessDialogClose();
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-500">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Chúc mừng!
            </DialogTitle>
            <DialogDescription>
              Bạn đã số hóa thành công NFT này
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Thông tin NFT */}
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={nftImage}
                  alt={nft.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold">{nft.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Token ID: {withdrawResult?.tokenId || "N/A"}
                  </p>
                </div>
              </div>

              {withdrawResult?.contractAddress && (
                <div className="pt-3 border-t border-green-500/20">
                  <p className="text-xs text-muted-foreground mb-1">
                    Contract Address:
                  </p>
                  <p className="text-xs font-mono break-all">
                    {withdrawResult.contractAddress}
                  </p>
                </div>
              )}

              {withdrawResult?.transactionHash && (
                <div className="pt-3 border-t border-green-500/20">
                  <p className="text-xs text-muted-foreground mb-1">
                    Transaction Hash:
                  </p>
                  <p className="text-xs font-mono break-all">
                    {withdrawResult.transactionHash}
                  </p>
                </div>
              )}

              {withdrawResult?.explorerUrl && (
                <div className="pt-3 border-t border-green-500/20">
                  <a
                    href={withdrawResult.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Xem trên Polygon Scan
                  </a>
                </div>
              )}
            </div>

            {/* Thông báo */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 NFT của bạn đã được mint lên blockchain và có thể xem trên ví
                MetaMask
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={handleSuccessDialogClose}
              className="w-full"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
