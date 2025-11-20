"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { NFTService } from "@/api/services/nft-service";
import { FeeService } from "@/api/services";
import { config } from "@/api/config";
import { ToastService } from "@/services/ToastService";
import TransferService from "@/services/TransferService";
import type { NFTItem } from "@/types/NFT";
import { useState } from "react";
import { useAppSelector } from "@/stores";

interface CancelSaleDialogProps {
  nft: NFTItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CancelSaleDialog({
  nft,
  open,
  onOpenChange,
  onSuccess,
}: CancelSaleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [withdrawalFeeInfo, setWithdrawalFeeInfo] = useState<{
    type: "fixed" | "percentage";
    value: number;
    amount: number;
  } | null>(null);
  const walletAddress = useAppSelector(
    (state) => state.wallet.wallet?.address || ""
  );

  const getNftBasePrice = (nftItem: NFTItem | null): number => {
    if (!nftItem) return 0;
    const basePrice =
      (nftItem as any)?.salePrice ??
      (nftItem as any)?.price ??
      (nftItem as any)?.nft?.salePrice ??
      (nftItem as any)?.nft?.price ??
      0;
    const parsed = Number(basePrice);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const fetchWithdrawalFee = async () => {
    const feeResponse = await FeeService.getSystemFees();
    const feeData = feeResponse?.data as any;

    let withdrawalFeeConfig: any =
      feeData?.withdrawalFee ||
      feeData?.fees?.withdrawalFee ||
      (Array.isArray(feeData)
        ? feeData.find(
            (fee: any) =>
              fee?.code === "withdrawalFee" ||
              fee?.name === "withdrawalFee" ||
              fee?.key === "withdrawalFee"
          )
        : undefined);

    if (!withdrawalFeeConfig && feeData?.data) {
      withdrawalFeeConfig = feeData.data?.withdrawalFee;
    }

    const feeType = (withdrawalFeeConfig?.type || "percentage") as
      | "fixed"
      | "percentage";
    const feeValue = Number(withdrawalFeeConfig?.value || 0);

    let amount = 0;
    if (feeValue > 0) {
      if (feeType === "percentage") {
        const nftPrice = getNftBasePrice(nft);
        amount = (nftPrice * feeValue) / 100;
      } else {
        amount = feeValue;
      }
    }

    return {
      type: feeType,
      value: feeValue,
      amount,
    };
  };

  const ensureWithdrawalFeeInfo = async () => {
    if (withdrawalFeeInfo) {
      return withdrawalFeeInfo;
    }
    const info = await fetchWithdrawalFee();
    setWithdrawalFeeInfo(info);
    return info;
  };

  const handleOpenConfirmModal = async () => {
    setConfirmModalOpen(true);
    setFeeError(null);
    setFeeLoading(true);
    try {
      const info = await fetchWithdrawalFee();
      setWithdrawalFeeInfo(info);
    } catch (error: any) {
      console.error("Error fetching withdrawal fee:", error);
      setWithdrawalFeeInfo(null);
      setFeeError(
        error?.message || "Không thể lấy thông tin phí hủy. Vui lòng thử lại."
      );
    } finally {
      setFeeLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!nft) return;
    if (!walletAddress) {
      ToastService.error("Vui lòng kết nối ví MetaMask trước khi hủy.");
      return;
    }

    setLoading(true);

    try {
      const feeInfo = await ensureWithdrawalFeeInfo();
      const amountToPay = feeInfo?.amount ?? 0;

      if (amountToPay > 0) {
        const transferResult = await TransferService.sendCanTransfer({
          fromAddress: walletAddress,
          toAddressData: config.WALLET_ADDRESSES.ADMIN,
          amountCan: amountToPay,
          gasLimit: 200000,
          gasBoostPercent: 80,
        });

        if (!transferResult?.transactionHash) {
          ToastService.error(
            "Không nhận được transaction hash. Vui lòng thử lại."
          );
          setLoading(false);
          return;
        }
      }

      const response = await NFTService.cancelNFTSale(nft.id);

      if (response.success) {
        ToastService.success("Hủy đăng bán NFT thành công!", {
          description: `${nft.name} đã được xoá khỏi marketplace`,
        });
        setConfirmModalOpen(false);
        onOpenChange(false);
        onSuccess(); // Trigger refetch danh sach NFT
      } else {
        ToastService.error(response.error || "Không thể hủy đăng bán NFT");
      }
    } catch (error: any) {
      ToastService.error("Đã xảy ra lỗi khi hủy đăng bán NFT");
      console.error("Cancel sale error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  if (!nft) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hủy đăng bán NFT</DialogTitle>
            <DialogDescription>
              Bạn chắc chắn muốn hủy đăng bán{" "}
              <span className="font-semibold">{nft.name}</span>?
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* NFT Preview */}
            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{nft.name}</p>
                <p className="text-sm text-muted-foreground">
                  Giá đang bán:{" "}
                  {nft.salePrice
                    ? `${nft.salePrice.toLocaleString(
                        "vi-VN"
                      )} ${nft.currency?.toUpperCase()}`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                Hành động này sẽ xoá NFT khỏi marketplace. Bạn sẽ vẫn sở hữu NFT
                này.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleOpenConfirmModal}
              disabled={loading}
            >
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmModalOpen}
        onOpenChange={(isOpen) => {
          if (!loading) {
            setConfirmModalOpen(isOpen);
          }
        }}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đăng bán</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đăng bán NFT này không?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {feeLoading ? (
              <div className="flex items-center gap-2 rounded-md border border-muted-foreground/20 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                <Spinner className="h-4 w-4" />
                <span>Đang tính phí hủy...</span>
              </div>
            ) : feeError ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {feeError}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nếu đồng ý, bạn sẽ mất phí{" "}
                <span className="font-semibold text-primary">
                  {withdrawalFeeInfo?.amount.toLocaleString("vi-VN") || 0} CAN
                </span>{" "}
                {withdrawalFeeInfo?.type === "percentage" &&
                withdrawalFeeInfo?.value
                  ? `(tương đương ${withdrawalFeeInfo.value}% giá NFT)`
                  : "(phí cố định)"}
                .
              </p>
            )}

            {loading && (
              <div className="flex items-center gap-2 rounded-md border border-muted-foreground/20 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                <Spinner className="h-4 w-4" />
                <span>Đang xử lý giao dịch...</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmModalOpen(false)}
              disabled={loading}
            >
              Thoát
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={loading || feeLoading || !!feeError}
            >
              {loading ? "Đang xử lý..." : "Đồng ý"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
