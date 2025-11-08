"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Eye, Heart, ShoppingBag, Send } from "lucide-react";
import { NFT } from "../hooks";
import NFTService from "@/api/services/nft-service";
import { useEffect, useState } from "react";
import { config } from "@/api/config";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { getLevelBadge } from "@/lib/utils";

interface NFTCardProps {
  nft: any;
  type: "normal" | "rank" | "mysteryBox" | "investment";
  onListForSale?: (nft: any) => void;
  onClick?: (id: string) => void;
  onLikeChange?: (id: string, isLiked: boolean) => void;
  isLiked?: boolean;
}

export const NFTCard = ({
  nft,
  type,
  onListForSale,
  onClick,
  onLikeChange,
  isLiked: controlledIsLiked,
}: NFTCardProps) => {
  const router = useRouter();
  const nftId = String(nft?.id ?? nft?._id ?? nft?.tokenId ?? "");
  const [isLiked, setIsLiked] = useState<boolean>(
    controlledIsLiked ?? Boolean(nft?.isLike || nft?.isLiked)
  );
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (controlledIsLiked !== undefined) {
      setIsLiked(controlledIsLiked);
    } else {
      setIsLiked(Boolean(nft?.isLike || nft?.isLiked));
    }
  }, [controlledIsLiked, nft]);

  const handleCardClick = () => {
    if (onClick) {
      onClick(nftId);
    } else if (nftId) {
      router.push(`/nft-template/${nftId}`);
    }
  };

  const toggleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!nftId || isLiking) return;

    try {
      setIsLiking(true);
      const nextState = !isLiked;
      const apiMethod = nextState ? NFTService.likeNft : NFTService.unlikeNft;
      const response = await apiMethod(nftId);
      if (response?.success) {
        setIsLiked(nextState);
        onLikeChange?.(nftId, nextState);
      }
    } catch (error) {
      console.error("Failed to toggle like", error);
    } finally {
      setIsLiking(false);
    }
  };

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

  const formatAddress = (address?: string) => {
    if (!address) return "";
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}***${end}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to default image if the image fails to load
    const target = e.target as HTMLImageElement;
    target.src = "/nft-box.jpg";
  };

  // Function to get NFT type label
  const getNFTTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      normal: 'NFT Thường',
      rank: 'NFT Hạng',
      mysteryBox: 'NFT Hộp bí ẩn',
      investment: 'NFT Đầu tư',
    };
    return typeMap[type] || 'NFT';
  };

  return (
    <Card
      className="glass overflow-hidden hover:scale-105 transition-all group cursor-pointer h-full flex flex-col p-0"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden w-full">
        <img
          src={nftImage}
          alt={nft.name || "NFT"}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        {/* Overlay for better content visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

        {/* Level Badge - góc phải trên */}
        {nft?.level && (
          <Badge
            variant="secondary"
            className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm border"
          >
            {getLevelBadge(nft.level as string)}
          </Badge>
        )}

        {/* Badge "Đang bán" */}
        <Badge
          variant="secondary"
          className={`absolute ${
            nft?.level ? "top-14" : "top-4"
          } right-4 z-10 transition-opacity duration-200 ${
            nft.isSale ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          Đang bán
        </Badge>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background cursor-pointer transition-colors ${
            isLiked ? "text-red-500" : "text-foreground"
          }`}
          aria-label={isLiked ? "Bỏ thích NFT" : "Thích NFT"}
          onClick={toggleLike}
          disabled={isLiking}
        >
          <Heart
            className="w-4 h-4"
            fill={isLiked ? "currentColor" : "transparent"}
          />
        </Button>
      </div>

      {/* Info */}
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold truncate flex-1">{nft.name}</h3>
          <Badge
            variant="outline"
            className="shrink-0 bg-background/80 backdrop-blur-sm border-primary/20 text-xs"
          >
            {getNFTTypeLabel(type)}
          </Badge>
        </div>

        {nft?.owner?.address && (
          <div className="text-xs text-muted-foreground mb-3">
            Người bán: {""}
            <span className="font-mono text-foreground">
              {formatAddress(nft?.owner?.address)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            {/* Container co dinh chieu cao - chua 2 gia tri */}
            <div className="relative h-8">
              <div
                className={`absolute top-0 left-0 text-xl font-bold text-primary transition-opacity duration-200 ${
                  nft.isSale && nft.salePrice
                    ? "opacity-100 visible"
                    : "opacity-0 invisible pointer-events-none"
                }`}
              >
                {formatCurrency(Number(nft.salePrice || nft.price))}
              </div>

              <div
                className={`absolute top-0 left-0 text-xl font-bold text-primary transition-opacity duration-200 ${
                  nft.isSale && nft.salePrice
                    ? "opacity-0 invisible pointer-events-none"
                    : "opacity-100 visible"
                }`}
              >
                {formatCurrency(Number(nft.price))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
            <Button
              variant="default"
              className="flex-1 gap-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) {
                  onClick(nftId);
                } else if (nftId) {
                  router.push(`/nft-template/${nftId}?type=${type}`);
                }
              }}
            >
              Xem chi tiết
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};
