"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Eye, Heart, ShoppingBag } from "lucide-react";
import { NFT } from "../hooks";

interface NFTCardProps {
  nft: NFT;
}

const rarityColors = {
  Common: "bg-gray-500/20 text-gray-300",
  Rare: "bg-blue-500/20 text-blue-300",
  Epic: "bg-purple-500/20 text-purple-300",
  Legendary: "bg-yellow-500/20 text-yellow-300",
  Mythic: "bg-pink-500/20 text-pink-300",
  Divine: "bg-red-500/20 text-red-300",
};

export const NFTCard = ({ nft }: NFTCardProps) => {
  const router = useRouter();
  const isOtherNFT = nft.type === "other";
  const progressPercentage =
    isOtherNFT && nft.sharesSold && nft.totalShares
      ? (nft.sharesSold / nft.totalShares) * 100
      : 0;

  return (
    <Card className="glass overflow-hidden hover:scale-105 transition-all group cursor-pointer">
      {/* Image */}
      <div
        className="relative h-64 overflow-hidden"
        onClick={() => router.push(`/nft/${nft.id}`)}
      >
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

        {/* Rarity Badge */}
        <Badge
          className={`absolute top-4 right-4 ${
            rarityColors[nft.rarity as keyof typeof rarityColors]
          }`}
        >
          {nft.rarity}
        </Badge>

        {/* Like/Purchase Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          {isOtherNFT ? (
            <ShoppingBag className="w-4 h-4" />
          ) : (
            <Heart className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Info */}
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-2 truncate">{nft.name}</h3>

        {nft.seller && (
          <div className="text-xs text-muted-foreground mb-3">
            Người bán:{" "}
            <span className="font-mono text-foreground">{nft.seller}</span>
          </div>
        )}

        {isOtherNFT ? (
          // Other NFT specific info
          <>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Giá trị tổng</span>
                <span className="font-bold text-primary">{nft.totalValue}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Giá/cổ phần</span>
                <span className="font-semibold">{nft.pricePerShare}</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tiến trình bán</span>
                  <span>
                    {nft.sharesSold}/{nft.totalShares} cổ phần
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="text-xs text-primary font-semibold">
                  {progressPercentage.toFixed(1)}% đã bán
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="text-xs text-muted-foreground">Lượt mua</div>
                <div className="text-sm font-semibold flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3" />
                  {nft.purchases}
                </div>
              </div>
            </div>
          </>
        ) : (
          // Tier NFT info
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-muted-foreground">Giá</div>
              <div className="text-xl font-bold text-primary">{nft.price}</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="default"
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation();
              // Handle buy action
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            {isOtherNFT ? "Mua cổ phần" : "Mua ngay"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/nft/${nft.id}`);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
