"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Eye, Heart, ShoppingBag, Plus } from "lucide-react";
import { NFT } from "../hooks";
import { useEffect } from "react";

interface NFTCardProps {
  nft: any;
  type: "tier" | "other";
}

const rarityColors = {
  Common: "bg-gray-500/20 text-gray-300",
  Rare: "bg-blue-500/20 text-blue-300",
  Epic: "bg-purple-500/20 text-purple-300",
  Legendary: "bg-yellow-500/20 text-yellow-300",
  Mythic: "bg-pink-500/20 text-pink-300",
  Divine: "bg-red-500/20 text-red-300",
};

export const NFTCard = ({ nft, type }: NFTCardProps) => {
  const router = useRouter();
  const isOtherNFT = nft.type === "other";

  const progressPercentage =
    isOtherNFT && nft.sharesSold && nft.totalShares
      ? (nft.sharesSold / nft.totalShares) * 100
      : 0;

  // Function to get NFT image from public folder
  const getNFTImage = (nft: NFT) => {
    // If it's a tier NFT, use tier images
    if (nft.type === "tier") {
      const tierName = nft.name.toLowerCase();
      if (tierName.includes("bronze")) return "/tier-bronze.jpg";
      if (tierName.includes("silver")) return "/tier-silver.jpg";
      if (tierName.includes("gold")) return "/tier-gold.jpg";
      if (tierName.includes("platinum")) return "/tier-platinum.jpg";
    }

    // For other NFTs, use nft-box.jpg as default
    return "/nft-box.jpg";
  };

  const nftImage = getNFTImage(nft);

  const formatAddress = (address?: string) => {
    if (!address) return "";
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}***${end}`;
  };

  return (
    <Card className="glass overflow-hidden hover:scale-105 transition-all group cursor-pointer">
      {/* Image */}
      <div
        className="relative h-64 overflow-hidden"
        onClick={() => router.push(`/nft/${nft.id}?type=${type}`)}
        style={{
          backgroundImage: `url('${nftImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for better content visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
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

        {nft?.owner?.address && (
          <div className="text-xs text-muted-foreground mb-3">
            Người bán:{" "}
            <span className="font-mono text-foreground">
              {formatAddress(nft?.owner?.address)}
            </span>
          </div>
        )}

        <div className="text-xs text-muted-foreground mb-3">
          <span className="font-mono ">{nft?.description}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Giá</div>
            <div className="text-xl font-bold text-primary">
              {nft?.price ?? "Thương lượng"}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="default"
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation();

              router.push(`/nft/${nft.id}?type=${type}`);
            }}
          >
            {type === "other" ? <ShoppingCart className="w-4 h-4" /> : ""}
            {type === "other" ? "Mua ngay" : "Mint on Blockchain"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/nft/${nft.id}?type=${type}`);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
