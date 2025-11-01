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
import { ShoppingCart, AlertCircle } from "lucide-react";
import type { MysteryBoxData } from "@/screens/mystery-box-screen/hooks/useMysteryBoxData";

interface ConfirmPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  box: MysteryBoxData;
  isLoading?: boolean;
}

export const ConfirmPurchaseModal = ({
  isOpen,
  onClose,
  onConfirm,
  box,
  isLoading = false,
}: ConfirmPurchaseModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Xác nhận mua hộp
          </DialogTitle>
          <DialogDescription>
            Vui lòng xác nhận thông tin mua hộp bí ẩn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Box Info */}
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div
              className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
              style={{
                backgroundImage: `url('${box.image}')`,
                border: `2px solid ${box.tierAttributes.borderColor}`,
              }}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{box.name}</h3>
              <p
                className="text-sm font-medium"
                style={{ color: box.tierAttributes.color }}
              >
                {box.tierName}
              </p>
            </div>
          </div>

          {/* Price Info */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Số lượng</span>
              <span className="font-semibold">1 hộp</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tổng tiền</span>
              <span className="text-2xl font-bold text-primary">
                {box.price.amount.toLocaleString()} {box.price.currency}
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="flex gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Lưu ý:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Giao dịch không thể hoàn tác</li>
                <li>Hộp sẽ được mở luôn sau khi mua</li>
                <li>Phần thưởng sẽ được thêm vào tài khoản</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Xác nhận mua
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
