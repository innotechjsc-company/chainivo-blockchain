'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NFTService } from '@/api/services/nft-service';
import { ToastService } from '@/services/ToastService';
import type { NFTItem } from '@/types/NFT';
import { useState } from 'react';

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

  const handleConfirmCancel = async () => {
    if (!nft) return;

    setLoading(true);

    try {
      const response = await NFTService.cancelNFTSale(nft.id);

      if (response.success) {
        ToastService.success('Hủy đăng bán NFT thành công!', {
          description: `${nft.name} đã được xoá khỏi marketplace`,
        });
        onOpenChange(false);
        onSuccess(); // Trigger refetch danh sach NFT
      } else {
        ToastService.error(response.error || 'Không thể hủy đăng bán NFT');
      }
    } catch (error: any) {
      ToastService.error('Đã xảy ra lỗi khi hủy đăng bán NFT');
      console.error('Cancel sale error:', error);
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hủy đăng bán NFT</DialogTitle>
          <DialogDescription>
            Bạn chắc chắn muốn hủy đăng bán{' '}
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
                Giá đang bán:{' '}
                {nft.salePrice ? `${nft.salePrice} ${nft.currency?.toUpperCase()}` : 'N/A'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              Hành động này sẽ xoá NFT khỏi marketplace. Bạn sẽ vẫn sở hữu NFT này.
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
            onClick={handleConfirmCancel}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận hủy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
