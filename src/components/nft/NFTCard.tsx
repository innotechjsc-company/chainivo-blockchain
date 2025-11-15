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
import { config } from "@/api/config";
import { NFTService } from "@/api/services/nft-service";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useAppSelector } from "@/stores";
import TransferService from "@/services/TransferService";

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
  };

  // Handler cho onClick cũ
  const handleCardClick = () => {
    if (onClick) {
      onClick(nft.id);
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
    if (type === "investment") return null;
    return (
      <div className="flex gap-2 w-full flex-col">
        {nft?.isMinted === false ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setWithdrawDialogOpen(true);
            }}
            className="
          inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
          transition-all disabled:pointer-events-none disabled:opacity-50
          [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
          outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
          aria-invalid:ring-destructive/40 aria-invalid:border-destructive
          h-9 px-4 py-2 has-[>svg]:px-3 w-full gap-2 cursor-pointer
          bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white
        "
          >
            Rút về ví
          </Button>
        ) : null}
        <Button
          onClick={(e) => handleAction(e, "sell")}
          className="
          inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
          transition-all disabled:pointer-events-none disabled:opacity-50
          [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
          outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
          aria-invalid:ring-destructive/40 aria-invalid:border-destructive
          h-9 px-4 py-2 has-[>svg]:px-3 w-full gap-2 cursor-pointer
          bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white
        "
        >
          Đăng bán
        </Button>
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
        {/* Tên NFT */}
        <h3 className="text-lg font-bold line-clamp-1 text-gray-100">
          {nft.name}
        </h3>

        {/* Mô tả */}
        {nft.description && (
          <p className="text-sm text-gray-400 line-clamp-2">
            {nft.description}
          </p>
        )}

        {/* Mystery Box layout - riêng biệt */}
        {nft.type === "mysteryBox" ? (
          <div className="flex flex-col flex-1 gap-3">
            {/* Divider */}
            <div className="border-t border-gray-700" />
            {/* Giá hộp */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Giá hộp:</span>
              <span className="text-lg font-bold text-gray-100">
                {formatNumber(nft.price)}{" "}
                <span className="text-sm uppercase">{nft.currency}</span>
              </span>
            </div>

            {/* Rewards popover */}
            <MysteryRewardsPopover rewards={nft.rewards} />

            {actionSection && <div className="mt-auto">{actionSection}</div>}
          </div>
        ) : (
          <div className="flex flex-col flex-1 border-t border-gray-700 pt-3 space-y-3">
            {/* Giá cho các loại NFT khác */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {nft.type === "investment" ? "Giá/cổ phần:" : "Giá:"}
              </span>
              <span className="text-lg font-bold text-gray-100">
                {formatNumber(
                  (nft as any)?.nft?.salePrice ??
                    (nft as any)?.nft?.salePrice ??
                    (nft as any)?.nft?.price ??
                    nft.salePrice ??
                    nft.price
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
            {nft.shares && nft.shares > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Cổ phần nắm giữ:</span>
                <span className="text-lg font-bold text-gray-100">
                  {formatNumber(nft.shares)}
                  <span className="text-sm uppercase">{nft.currency}</span>
                </span>
              </div>
            )}

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

            {/* Stats cho Normal/Rank NFT */}
            {(nft.type === "normal" || nft.type === "rank") && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <span></span>
                  <span></span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            {/* My NFT specific content */}
            {type === "my-nft" && (
              <div className="space-y-2">
                {/* Staking status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Staking:</span>
                  <span className="text-sm font-medium text-gray-100">
                    {(nft as any).isStaking === true ? "Có" : "Chưa"}
                  </span>
                </div>
              </div>
            )}

            {/* Action button */}
            {actionSection && <div className="mt-auto">{actionSection}</div>}
          </div>
        )}
      </div>

      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận rút NFT về ví</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn rút NFT này về ví?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setWithdrawDialogOpen(false)}
              disabled={isWithdrawing}
            >
              Thoát
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleWithdrawConfirm}
              disabled={isWithdrawing}
            >
              {isWithdrawing ? "Đang xử lý..." : "Đồng ý"}
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
