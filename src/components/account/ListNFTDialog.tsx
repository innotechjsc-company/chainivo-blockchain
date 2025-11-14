"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NFTService } from "@/api/services/nft-service";
import { ToastService } from "@/services/ToastService";
import TransferService from "@/services/TransferService";
import { Spinner } from "@/components/ui/spinner";
import { useAppSelector } from "@/stores";
import { toast } from "sonner";
import type { NFTItem } from "@/types/NFT";

interface ListNFTDialogProps {
  nft: NFTItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ListNFTDialog({
  nft,
  open,
  onOpenChange,
  onSuccess,
}: ListNFTDialogProps) {
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [transferToAdminDialogOpen, setTransferToAdminDialogOpen] =
    useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [pendingPrice, setPendingPrice] = useState<number | null>(null);

  // Lấy walletAddress từ Redux store
  const walletAddress = useAppSelector(
    (state) => state.wallet.wallet?.address || ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nft) return;

    const priceValue = parseFloat(price);

    // Validation
    if (!price || isNaN(priceValue) || priceValue <= 0) {
      ToastService.error("Vui lòng nhập giá bán hợp lệ (lớn hơn 0)");
      return;
    }

    // Kiểm tra nếu NFT đã được mint và có tokenId
    const nftAny = nft as any;
    const tokenId = nftAny.tokenId || nftAny.token_id;

    if (nft.isMinted === true && tokenId) {
      // Kiểm tra ownership trước khi mở modal transfer
      if (!walletAddress) {
        ToastService.error("Vui lòng kết nối ví MetaMask.");
        return;
      }

      try {
        // Kiểm tra ownership
        const ownershipResponse = await NFTService.checkOwnership({
          nftId: String(tokenId),
          walletAddress: walletAddress,
        });

        if (
          ownershipResponse.success &&
          ownershipResponse.data?.isOwner === true
        ) {
          // Lưu giá bán để dùng sau khi transfer
          setPendingPrice(priceValue);
          // Lưu contract address
          setContractAddress(
            ownershipResponse.data?.contractAddress ||
              nftAny.contractAddress ||
              nftAny.collection?.contractAddress ||
              null
          );
          // Mở modal chuyển NFT sang ví admin
          setTransferToAdminDialogOpen(true);
        } else {
          // Nếu không phải owner, vẫn cho phép list (có thể NFT đã được transfer trước đó)
          await proceedWithListing(priceValue);
        }
      } catch (error: any) {
        console.error("Error checking ownership:", error);
        // Nếu lỗi khi check ownership, vẫn cho phép list
        await proceedWithListing(priceValue);
      }
    } else {
      // NFT chưa được mint, list trực tiếp
      await proceedWithListing(priceValue);
    }
  };

  // Hàm xử lý list NFT sau khi transfer hoặc nếu không cần transfer
  const proceedWithListing = async (priceValue: number) => {
    if (!nft) return;

    setLoading(true);

    try {
      const response = await NFTService.listNFTForSale({
        nftId: nft.id,
        salePrice: priceValue,
      });

      if (response.success) {
        ToastService.success("Đăng bán NFT thành công!", {
          description: `${nft.name} đã được thêm vào marketplace`,
        });
        setPrice("");
        onOpenChange(false);
        onSuccess(); // Trigger refetch danh sach NFT
      } else {
        ToastService.error(response.error || "Không thể đăng bán NFT");
      }
    } catch (error: any) {
      ToastService.error("Đã xảy ra lỗi khi đăng bán NFT");
      console.error("List NFT error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler cho chuyển NFT sang ví admin
  const handleTransferToAdmin = async () => {
    if (!nft) return;

    const nftAny = nft as any;
    const tokenId = nftAny.tokenId || nftAny.token_id;

    // Validate inputs
    if (!walletAddress) {
      toast.error("Vui lòng kết nối ví MetaMask.");
      return;
    }

    if (!tokenId) {
      toast.error("NFT này không có tokenId để chuyển.");
      return;
    }

    // Lấy contract address từ state hoặc từ nft
    const nftContractAddress =
      contractAddress ||
      nftAny.contractAddress ||
      nftAny.collection?.contractAddress;

    if (!nftContractAddress) {
      toast.error(
        "Không tìm thấy địa chỉ contract của NFT. Vui lòng kiểm tra thông tin NFT."
      );
      return;
    }

    setIsTransferring(true);

    try {
      // Gọi TransferService để chuyển NFT
      const result = await TransferService.transferNFT({
        fromAddress: walletAddress,
        contractAddress: nftContractAddress,
        tokenId: tokenId,
      });

      // Hiển thị thông báo thành công
      toast.success(
        `Chuyển NFT sang ví admin thành công! Transaction: ${result.transactionHash.slice(
          0,
          10
        )}... (Phí gas: ${Number(result.totalGasCost).toFixed(6)} POL)`
      );
      setTransferToAdminDialogOpen(false);

      // Sau khi transfer thành công, tiếp tục list NFT
      if (pendingPrice !== null) {
        await proceedWithListing(pendingPrice);
        setPendingPrice(null);
      }
    } catch (error: any) {
      console.error("❌ handleTransferToAdmin Error:", error);
      const errorMessage =
        error?.message || error?.toString() || "Unknown error";

      // Kiểm tra các lỗi cụ thể
      if (
        errorMessage.includes("user rejected") ||
        errorMessage.includes("user denied") ||
        errorMessage.includes("User denied")
      ) {
        toast.error("Bạn đã hủy giao dịch.");
      } else if (
        errorMessage.includes("insufficient funds") ||
        errorMessage.includes("insufficient balance")
      ) {
        toast.error("Số dư không đủ để thực hiện giao dịch.");
      } else {
        toast.error(`Lỗi chuyển NFT: ${errorMessage}`);
      }
    } finally {
      setIsTransferring(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setPrice("");
      onOpenChange(false);
    }
  };

  if (!nft) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Đăng bán NFT</DialogTitle>
            <DialogDescription>
              Nhập giá bán cho <span className="font-semibold">{nft.name}</span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
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
                    Giá gốc: {nft.price} {nft.currency.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Price Input */}
              <div className="grid gap-2">
                <Label htmlFor="price">
                  Giá bán <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Nhập giá bán"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={loading}
                  min="0"
                  step="0.01"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Đơn vị: {nft.currency.toUpperCase()}
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
                Hủy
              </Button>
              <Button type="submit" disabled={loading || !price}>
                {loading ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal chuyển NFT sang ví admin */}
      <Dialog
        open={transferToAdminDialogOpen}
        onOpenChange={(open) => {
          setTransferToAdminDialogOpen(open);
          if (!open) {
            // Reset pending price khi đóng modal
            setPendingPrice(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chuyển NFT sang ví admin</DialogTitle>
            <DialogDescription>
              NFT này là của bạn. Để đăng bán, vui lòng chuyển NFT sang ví của
              admin để tiếp tục.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTransferToAdminDialogOpen(false);
                setPendingPrice(null);
              }}
              disabled={isTransferring}
            >
              Thoát
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleTransferToAdmin}
              disabled={isTransferring}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
            >
              {isTransferring ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Đang chuyển...
                </>
              ) : (
                "Đồng ý"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
