'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Sparkles, Gift } from 'lucide-react';
import type { NFTItem } from '@/types/NFT';

interface OpenBoxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nft: NFTItem | null;
  onConfirm: () => Promise<void>;
}

export default function OpenBoxDialog({
  open,
  onOpenChange,
  nft,
  onConfirm,
}: OpenBoxDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!nft) return null;

  // Safety: Convert image to string nếu là object
  const imageUrl = typeof nft.image === 'string'
    ? nft.image
    : (nft.image as any)?.url || '';

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      // Dialog sẽ được đóng từ MyNFTCollection sau khi success
    } catch (error) {
      // Error đã được xử lý trong MyNFTCollection
      console.error('Error opening box:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gift className="w-6 h-6 text-purple-500" />
            <span className="gradient-text">Xác nhận mở hộp bí ẩn</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn mở hộp này không?
          </DialogDescription>
        </DialogHeader>

        {/* Nội dung dialog */}
        <div className="space-y-4 py-4">
          {/* Ảnh hộp và tên */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={imageUrl}
                alt={nft.name}
                className="w-32 h-32 object-cover rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/50"
              />
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg">{nft.name}</h3>
              {nft.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {nft.description}
                </p>
              )}
            </div>
          </div>

          {/* Cảnh báo */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-semibold mb-1">Lưu ý:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Hộp sẽ biến mất sau khi mở</li>
                  <li>Hành động này không thể hoàn tác</li>
                  <li>Phần thưởng sẽ được chuyển vào tài khoản của bạn</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rewards preview (nếu có) */}
          {nft.rewards && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
                Có thể nhận được:
              </p>
              <div className="space-y-1 text-xs text-purple-700 dark:text-purple-300">
                {nft.rewards?.tokens && nft.rewards.tokens.length > 0 && (
                  <div>
                    • Token: {nft.rewards.tokens.map((t: any) => `${t.minAmount}-${t.maxAmount} ${t.symbol}`).join(', ')}
                  </div>
                )}
                {nft.rewards?.nfts && nft.rewards.nfts.length > 0 && (
                  <div>
                    • NFT: {nft.rewards.nfts.length} loại khác nhau
                  </div>
                )}
                {(!nft.rewards?.tokens || nft.rewards.tokens.length === 0) &&
                  (!nft.rewards?.nfts || nft.rewards.nfts.length === 0) && (
                    <div>• Phần thưởng bất ngờ!</div>
                  )}
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Huỷ
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang mở...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Xác nhận mở hộp
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
