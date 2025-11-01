"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import type { MysteryBoxData } from "@/screens/mystery-box-screen/hooks/useMysteryBoxData";

interface PurchaseCardProps {
  box: MysteryBoxData;
  onPurchase?: () => void;
}

export const PurchaseCard = ({ box, onPurchase }: PurchaseCardProps) => {
  const isSoldOut = !box.isUnlimited && box.remainingSupply === 0;

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase();
    }
  };

  return (
    <Card className="glass sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Mua Hộp Bí Ẩn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price */}
        <div>
          <div className="text-sm text-muted-foreground mb-2">Giá</div>
          <div className="text-3xl font-bold text-primary">
            {box.price.amount.toLocaleString()} {box.price.currency}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="default"
            className="w-full gap-2"
            size="lg"
            disabled={isSoldOut}
            onClick={handlePurchase}
          >
            <ShoppingCart className="w-5 h-5" />
            {isSoldOut ? "Đã hết hàng" : "Mua ngay"}
          </Button>

          {box.isActive && !isSoldOut && (
            <div className="text-xs text-center text-muted-foreground">
              Bạn cần kết nối ví để mua hộp bí ẩn
            </div>
          )}
        </div>

        {/* Status */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Trạng thái</span>
            <span
              className={`font-medium ${
                isSoldOut
                  ? "text-red-500"
                  : box.isActive
                  ? "text-green-500"
                  : "text-orange-500"
              }`}
            >
              {isSoldOut ? "Hết hàng" : box.isActive ? "Đang bán" : "Tạm ngưng"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
