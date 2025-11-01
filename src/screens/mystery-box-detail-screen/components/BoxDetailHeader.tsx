"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Package, TrendingUp } from "lucide-react";
import type { MysteryBoxData } from "@/screens/mystery-box-screen/hooks/useMysteryBoxData";

interface BoxDetailHeaderProps {
  box: MysteryBoxData;
}

const rarityLabels: Record<string, string> = {
  common: "Thường",
  uncommon: "Không phổ biến",
  rare: "Hiếm",
  epic: "Sử thi",
  legendary: "Huyền thoại",
};

export const BoxDetailHeader = ({ box }: BoxDetailHeaderProps) => {
  const soldPercentage =
    box.isUnlimited || box.maxSupply === 0
      ? 0
      : (box.currentSupply / box.maxSupply) * 100;

  return (
    <Card className="glass">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold">{box.name}</h1>
            </div>
            <p className="text-muted-foreground text-lg">{box.description}</p>
          </div>

          <Badge
            className="text-lg px-4 py-2"
            style={{
              backgroundColor: `${box.tierAttributes.color}33`,
              color: box.tierAttributes.color,
              borderColor: box.tierAttributes.borderColor,
            }}
          >
            {box.tierName}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">
              Tổng số lượng
            </div>
            <div className="text-2xl font-bold">
              {box.isUnlimited
                ? "Không giới hạn"
                : box.maxSupply.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Đã bán</div>
            <div className="text-2xl font-bold text-orange-500">
              {box.currentSupply.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Còn lại</div>
            <div className="text-2xl font-bold text-green-500">
              {box.isUnlimited
                ? "Không giới hạn"
                : box.remainingSupply.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Progress */}
        {!box.isUnlimited && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Tiến độ bán hàng</span>
              <span>{soldPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${soldPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
