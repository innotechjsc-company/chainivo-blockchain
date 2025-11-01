"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp, Boxes } from "lucide-react";
import { MysteryBoxStats } from "../hooks";

interface MysteryBoxHeaderCardProps {
  stats: MysteryBoxStats;
}

export const MysteryBoxHeaderCard = ({ stats }: MysteryBoxHeaderCardProps) => {
  return (
    <div className="mb-8">
      {/* Hero Section */}
      <div className="glass rounded-lg p-8 mb-6 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Boxes className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold">Cửa Hàng Hộp Bí Ẩn</h1>
              <p className="text-muted-foreground mt-1">
                Mở hộp để nhận phần thưởng NFT và token đặc biệt
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Boxes */}
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Loại Hộp</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBoxes}</div>
            <p className="text-xs text-muted-foreground">
              Các loại hộp khác nhau
            </p>
          </CardContent>
        </Card>

        {/* Sold Boxes */}
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã Bán</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.soldBoxes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.soldPercentage.toFixed(1)}% tổng số
            </p>
          </CardContent>
        </Card>

        {/* Remaining */}
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Còn Lại</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.remainingBoxes}</div>
            <p className="text-xs text-muted-foreground">Sẵn sàng để mua</p>
          </CardContent>
        </Card>

        {/* Total Value */}
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Giá Trị</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.soldValue.toLocaleString()} CAN
            </div>
            <p className="text-xs text-muted-foreground">Đã giao dịch</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
