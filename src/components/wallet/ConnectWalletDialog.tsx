"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LocalStorageService, ToastService } from "@/services";

export interface ConnectWalletDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;

  /**
   * Callback to control dialog open state
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Callback fired after successful wallet connection
   */
  onSuccess?: () => void;

  /**
   * Custom title for the dialog
   * @default "Kết nối ví"
   */
  title?: string;

  /**
   * Custom description text
   * @default "Vui lòng kết nối ví để tiếp tục giao dịch."
   */
  description?: string;
}

/**
 * Shared dialog component for connecting MetaMask wallet
 *
 * @example
 * ```tsx
 * const [showConnect, setShowConnect] = useState(false);
 *
 * <ConnectWalletDialog
 *   open={showConnect}
 *   onOpenChange={setShowConnect}
 *   onSuccess={() => {
 *     // Proceed with transaction
 *     handleBuy();
 *   }}
 * />
 * ```
 */
export const ConnectWalletDialog = ({
  open,
  onOpenChange,
  onSuccess,
  title = "Kết nối ví",
  description = "Vui lòng kết nối ví để tiếp tục giao dịch.",
}: ConnectWalletDialogProps) => {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setConnecting(true);

      // Check if MetaMask is installed
      const eth = (window as any)?.ethereum;
      if (!eth?.isMetaMask) {
        ToastService.error("Vui lòng cài đặt MetaMask extension");
        onOpenChange(false);
        return;
      }

      // Request account access
      await eth.request({ method: "eth_requestAccounts" });

      // Update LocalStorage to mark wallet as connected
      LocalStorageService.setWalletConnectionStatus(true);

      // Dispatch event to notify other components about wallet connection
      try {
        window.dispatchEvent(new Event("wallet:connection-changed"));
      } catch (error) {
        console.warn("Failed to dispatch wallet connection event:", error);
      }

      ToastService.success("Kết nối ví thành công!");

      // Close dialog
      onOpenChange(false);

      // Trigger success callback
      onSuccess?.();
    } catch (error: any) {
      console.error("Connect wallet error:", error);

      // Handle user rejection
      if (error.code === 4001) {
        ToastService.error("Bạn đã từ chối kết nối ví");
      } else {
        ToastService.error("Không thể kết nối ví. Vui lòng thử lại.");
      }

      onOpenChange(false);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex-shrink-0">
              <img
                src="/metamask-fox.svg"
                alt="MetaMask"
                className="w-10 h-10"
                onError={(e) => {
                  // Fallback if image not found
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold">MetaMask</div>
              <div className="text-sm text-muted-foreground">
                Kết nối với ví MetaMask của bạn
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={connecting}
          >
            Huỷ
          </Button>
          <Button onClick={handleConnect} disabled={connecting}>
            {connecting ? "Đang kết nối..." : "Kết nối"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
