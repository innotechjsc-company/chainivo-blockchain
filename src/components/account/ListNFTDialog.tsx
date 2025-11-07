'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NFTService } from '@/api/services/nft-service';
import { ToastService } from '@/services/ToastService';
import type { NFTItem } from '@/types/NFT';

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
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nft) return;

    const priceValue = parseFloat(price);

    // Validation
    if (!price || isNaN(priceValue) || priceValue <= 0) {
      ToastService.error('Vui lòng nhập giá bán hợp lệ (lớn hơn 0)');
      return;
    }

    setLoading(true);

    try {
      const response = await NFTService.listNFTForSale({
        nftId: nft.id,
        salePrice: priceValue,
      });

      if (response.success) {
        ToastService.success('Đăng bán NFT thành công!', {
          description: `${nft.name} đã được thêm vào marketplace`,
        });
        setPrice('');
        onOpenChange(false);
        onSuccess(); // Trigger refetch danh sach NFT
      } else {
        ToastService.error(response.error || 'Không thể đăng bán NFT');
      }
    } catch (error: any) {
      ToastService.error('Đã xảy ra lỗi khi đăng bán NFT');
      console.error('List NFT error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setPrice('');
      onOpenChange(false);
    }
  };

  if (!nft) return null;

  return (
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
              {loading ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}