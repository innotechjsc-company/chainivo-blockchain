"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Eye, Heart, ShoppingBag, Plus } from "lucide-react";
import NFTService from "@/api/services/nft-service";
import { useEffect, useState } from "react";
import { config } from "@/api/config";
import { getLevelBadge } from "@/lib/utils";

interface NFTInvestmentCardProps {
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

export const NFTInvestmentCard = ({ nft, type }: NFTInvestmentCardProps) => {
  const router = useRouter();
  const isOtherNFT = nft.type === "other";
  const [isLiked, setIsLiked] = useState<boolean>(
    Boolean(nft?.isLike || nft?.isLiked)
  );
  const soldShares: number = Number(nft?.soldShares ?? 0);
  const totalShares: number = Number(nft?.availableShares ?? 0);
  const progressPercentage =
    totalShares > 0 ? (soldShares / totalShares) * 100 : 0;

  const totalValue: number | string | undefined =
    nft?.totalValue ?? nft?.total_price ?? nft?.totalETH ?? nft?.priceTotal;
  const pricePerShare: number | string | undefined =
    nft?.pricePerShare ?? nft?.sharePrice ?? nft?.price;

  const purchaseCount: number = Number(
    nft?.purchaseCount ?? nft?.buyerCount ?? nft?.purchases ?? nft?.views ?? 0
  );

  // Function to get NFT image from API backend or fallback to default
  const getNFTImage = (nft: any): string => {
    // Helper to construct full image URL from API
    const getImageUrl = (imageData: any): string | null => {
      if (!imageData) return null;

      let imageUrl: string;

      // Handle different image data structures
      if (typeof imageData === "string") {
        imageUrl = imageData;
      } else if (imageData?.url) {
        imageUrl = imageData.url;
      } else if (imageData?.image) {
        imageUrl =
          typeof imageData.image === "string"
            ? imageData.image
            : imageData.image?.url;
      } else {
        return null;
      }

      if (!imageUrl || imageUrl.trim() === "") return null;

      // If URL is already a full URL (starts with http), use it directly
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return imageUrl;
      }

      // If it's a relative path, combine with API_BASE_URL
      // Handle slashes properly to avoid double slashes
      const apiBase = config.API_BASE_URL.endsWith("/")
        ? config.API_BASE_URL.slice(0, -1)
        : config.API_BASE_URL;
      const imagePath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
      return `${apiBase}${imagePath}`;
    };

    // Try to get image from API backend first
    const apiImageUrl = getImageUrl(
      nft?.image || nft?.imageUrl || nft?.image_url
    );
    if (apiImageUrl) {
      return apiImageUrl;
    }

    // Fallback to default images based on type
    if (nft.type === "tier") {
      const tierName = (nft.name || "").toLowerCase();
      if (tierName.includes("bronze")) return "/tier-bronze.jpg";
      if (tierName.includes("silver")) return "/tier-silver.jpg";
      if (tierName.includes("gold")) return "/tier-gold.jpg";
      if (tierName.includes("platinum")) return "/tier-platinum.jpg";
    }

    // Default fallback for other NFTs
    return "/nft-box.jpg";
  };

  const nftImage = getNFTImage(nft);

  const refreshLikeState = async () => {
    try {
      const id = String(nft.id ?? nft._id ?? nft.tokenId);
      const resp = await NFTService.getNFTById(id);
      if (resp?.success && resp?.data) {
        setIsLiked(
          Boolean((resp.data as any)?.isLike || (resp.data as any)?.isLiked)
        );
      }
    } catch {}
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      let status = nft.isLike;
      let response: any;
      if (status) {
        response = await NFTService.unlikeNft(
          String(nft.id ?? nft._id ?? nft.tokenId)
        );
      } else {
        response = await NFTService.likeNft(
          String(nft.id ?? nft._id ?? nft.tokenId)
        );
      }

      if (response.success) {
        await refreshLikeState();
      }
      // Optionally, you could trigger a re-fetch or optimistic UI update here
    } catch (err) {
      console.error("Failed to like NFT", err);
    }
  };
  const handleUnlike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      let response = await NFTService.unlikeNft(
        String(nft.id ?? nft._id ?? nft.tokenId)
      );
      if (response.success) {
        await refreshLikeState();
      }
      // Optionally, you could trigger a re-fetch or optimistic UI update here
    } catch (err) {
      console.error("Failed to like NFT", err);
    }
  };

  useEffect(() => {
    setIsLiked(Boolean(nft?.isLike || nft?.isLiked));
  }, [nft]);

  const formatAddress = (address?: string) => {
    if (!address) return "";
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}***${end}`;
  };

  const formatNumber = (value: unknown) => {
    if (value === undefined || value === null) return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    // Format with thousand separators: 1,000,000
    const formatted = num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);
    return Number(formatted).toLocaleString("en-US");
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to default image if the image fails to load
    const target = e.target as HTMLImageElement;
    target.src = "/nft-box.jpg";
  };

  return (
    <Card className="glass overflow-hidden hover:scale-105 transition-all group cursor-pointer">
      {/* Image */}
      <div
        className="relative h-64 overflow-hidden"
        onClick={() => router.push(`/investment-nft/${nft.id}`)}
      >
        <img
          src={nftImage}
          alt={nft.name || "NFT"}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        {/* Overlay for better content visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

        {/* Rarity Badge */}
        <Badge
          className={`absolute top-4 right-4 z-10 ${
            rarityColors[nft.rarity as keyof typeof rarityColors]
          }`}
        >
          {getLevelBadge(nft.level as string)}
        </Badge>
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

        {/* Pricing summary */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <div className="text-xs text-muted-foreground">Giá trị tổng</div>
            <div className="text-lg font-bold">
              {totalValue !== undefined
                ? `${formatNumber(totalValue)} ${(
                    nft?.currency || "ETH"
                  ).toUpperCase()}`
                : nft?.price
                ? `${formatNumber(nft?.price)} ${(
                    nft?.currency || "ETH"
                  ).toUpperCase()}`
                : "Thương lượng"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Giá/cổ phần</div>
            <div className="text-lg font-bold">
              {pricePerShare !== undefined
                ? `${formatNumber(pricePerShare)} ${(
                    nft?.currency || "ETH"
                  ).toUpperCase()}`
                : "-"}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Tiến trình bán</span>
          {totalShares > 0 && (
            <span>
              {nft?.soldShares}/{nft?.availableShares + nft?.soldShares} cổ phần
            </span>
          )}
        </div>
        <Progress value={progressPercentage} className="h-2 mb-1" />
        <div className="text-xs text-cyan-400 mb-3">
          {progressPercentage.toFixed(1)}% đã bán
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="default"
            className="flex-1 gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/investment-nft/${nft.id}`);
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Mua cổ phần
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/investment-nft/${nft.id}`);
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
