"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ShoppingCart,
  Eye,
  Package,
  Sparkles,
  Coins,
  Image,
} from "lucide-react";
import type { MysteryBoxData, Reward } from "../hooks/useMysteryBoxData";

interface MysteryBoxCardProps {
  box: MysteryBoxData;
  onPurchase?: (boxId: string) => void;
}

const rarityColors: Record<string, string> = {
  common: "bg-gray-500/20 text-gray-300 border-gray-500",
  uncommon: "bg-green-500/20 text-green-300 border-green-500",
  rare: "bg-blue-500/20 text-blue-300 border-blue-500",
  epic: "bg-purple-500/20 text-purple-300 border-purple-500",
  legendary: "bg-yellow-500/20 text-yellow-300 border-yellow-500",
};

const rarityLabels: Record<string, string> = {
  common: "Thường",
  uncommon: "Không phổ biến",
  rare: "Hiếm",
  epic: "Sử thi",
  legendary: "Huyền thoại",
};

export const MysteryBoxCard = ({ box, onPurchase }: MysteryBoxCardProps) => {
  const router = useRouter();
  const isSoldOut = !box.isUnlimited && box.remainingSupply === 0;
  const soldPercentage =
    box.isUnlimited || box.maxSupply === 0
      ? 0
      : (box.currentSupply / box.maxSupply) * 100;

  return (
    <Card
      className="glass overflow-hidden hover:scale-105 transition-all group cursor-pointer"
      style={{
        borderColor: box.tierAttributes.borderColor,
        boxShadow: `0 0 20px ${box.tierAttributes.glowColor}33`,
      }}
    >
      {/* Image */}
      <div
        className="relative h-64 overflow-hidden"
        onClick={() => router.push(`/mysterybox/${box.id}`)}
        style={{
          backgroundImage: `url('${box.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

        {/* Glow Effect */}
        <div
          className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${box.tierAttributes.glowColor}, transparent)`,
          }}
        ></div>

        {/* Rarity Badge */}
        <Badge
          className={`absolute top-4 right-4 border ${
            rarityColors[box.rarity] || rarityColors.common
          }`}
        >
          {rarityLabels[box.rarity] || box.rarity}
        </Badge>

        {/* Tier Level */}
        <div
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold"
          style={{ color: box.tierAttributes.color }}
        >
          {box.tierName}
        </div>

        {/* Sparkles Icon */}
        <div className="absolute bottom-4 right-4">
          <Sparkles
            className="w-8 h-8 text-yellow-400 animate-pulse"
            style={{ filter: "drop-shadow(0 0 8px rgba(250, 204, 21, 0.5))" }}
          />
        </div>

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-2xl font-bold text-red-400">ĐÃ HẾT HÀNG</div>
          </div>
        )}
      </div>

      {/* Info */}
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-2 truncate">{box.name}</h3>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {box.description}
        </p>

        {/* Rewards List */}
        <div className="mb-3 space-y-2">
          <div className="text-xs text-muted-foreground font-semibold">
            Phần thưởng có thể nhận:
          </div>
          {box.rewards && box.rewards.length > 0 ? (
            <div className="space-y-1.5">
              {box.rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-xs"
                >
                  {reward.rewardType === "token" ? (
                    <Coins className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  ) : (
                    <Image className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    {reward.description ? (
                      <div className="text-foreground text-xs">
                        {reward.description}
                      </div>
                    ) : reward.rewardType === "token" ? (
                      <div className="text-foreground">
                        <span className="font-medium">Token: </span>
                        {reward.tokenMinQuantity?.toLocaleString()} -{" "}
                        {reward.tokenMaxQuantity?.toLocaleString()} CAN
                      </div>
                    ) : (
                      <div className="text-foreground">
                        <span className="font-medium">NFT: </span>
                        {reward.nftPriceMin?.toLocaleString()} -{" "}
                        {reward.nftPriceMax?.toLocaleString()} CAN
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 bg-muted/50 rounded-lg text-xs text-muted-foreground text-center">
              Phần thưởng bất ngờ
            </div>
          )}
        </div>

        {/* Supply Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Đã bán: {box.currentSupply}</span>
            <span>
              Còn lại:{" "}
              {box.isUnlimited
                ? "Không giới hạn"
                : box.remainingSupply.toLocaleString()}
            </span>
          </div>
          {!box.isUnlimited && (
            <Progress value={soldPercentage} className="h-2" />
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-xs text-muted-foreground">Giá</div>
          <div className="text-xl font-bold text-primary">
            {box.price.amount} {box.price.currency}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="default"
            className="flex-1 gap-2"
            disabled={isSoldOut}
            onClick={(e) => {
              e.stopPropagation();
              if (onPurchase) {
                onPurchase(box.id);
              } else {
                router.push(`/mysterybox/${box.id}`);
              }
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            {isSoldOut ? "Hết hàng" : "Mua ngay"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/mysterybox/${box.id}`);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
