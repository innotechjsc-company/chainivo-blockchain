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
import { formatNumber } from "@/utils/formatters";

interface NFTCardProps {
  nft: any;
  type: "tier" | "other";
  onListForSale?: (nft: any) => void;
}

export const NFTCard = ({ nft, type, onListForSale }: NFTCardProps) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState<boolean>(
    Boolean(nft?.isLike || nft?.isLiked)
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
      const resp = await NFTService.getNFTByTemplateId(id);
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to default image if the image fails to load
    const target = e.target as HTMLImageElement;
    target.src = "/nft-box.jpg";
  };

  return (
    <Card className="glass overflow-hidden hover:scale-105 transition-all group cursor-pointer h-full flex flex-col">
      {/* Image */}
      <div
        className="relative h-64 overflow-hidden"
        onClick={() => router.push(`/nft-template/${nft.id}`)}
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
        <Badge
          variant="secondary"
          className={`absolute top-4 right-4 z-10 transition-opacity duration-200 ${
            nft.isSale ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          Đang bán
        </Badge>

        {/* Like/Purchase Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background cursor-pointer"
          onClick={isLiked ? handleUnlike : handleLike}
        >
          <Heart
            className={`w-4 h-4`}
            fill={isLiked ? "currentColor" : "none"}
            color={isLiked ? "#ec4899" : undefined}
            stroke={isLiked ? "#ec4899" : "white"}
          />
        </Button>
      </div>

      {/* Info */}
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold mb-2 truncate">{nft.name}</h3>

        {nft?.owner?.address && (
          <div className="text-xs text-muted-foreground mb-3">
            Người bán:{" "}
            <span className="font-mono text-foreground">
              {formatAddress(nft?.owner?.address)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            {/* Label dong theo trang thai */}
            <div className="text-xs text-muted-foreground">
              {nft.isSale && nft.salePrice
                ? "Giá đang bán"
                : "Gia gốc hiện tại "}
            </div>

            {/* Container co dinh chieu cao - chua 2 gia tri */}
            <div className="relative h-8">
              {/* Gia ban - absolute position */}
              <div
                className={`absolute top-0 left-0 text-xl font-bold text-primary transition-opacity duration-200 ${
                  nft.isSale && nft.salePrice
                    ? "opacity-100 visible"
                    : "opacity-0 invisible pointer-events-none"
                }`}
              >
                {formatNumber(nft.salePrice)}{" "}
                {nft.currency?.toUpperCase() || "CAN"}
              </div>

              {/* Gia goc - absolute position (cung vi tri) */}
              <div
                className={`absolute top-0 left-0 text-xl font-bold text-primary transition-opacity duration-200 ${
                  nft.isSale && nft.salePrice
                    ? "opacity-0 invisible pointer-events-none"
                    : "opacity-100 visible"
                }`}
              >
                {formatNumber(nft.price)} {nft.currency?.toUpperCase() || "CAN"}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Button chinh: Mua ngay / Dang ban / Da so huu */}
          {type === "tier" && !nft.isSale && onListForSale ? (
            // NFT cua toi va chua ban -> hien nut "Dang ban"
            <Button
              variant="default"
              className="flex-1 gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onListForSale(nft);
              }}
            >
              <Send className="w-4 h-4" />
              Đăng bán
            </Button>
          ) : (
            // NFT dang ban hoac NFT cua nguoi khac
            <Button
              variant="default"
              className="flex-1 gap-2"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/nft/${nft.id}?type=${type}`);
              }}
            >
              {type === "other" ? <ShoppingCart className="w-4 h-4" /> : ""}
              {type === "other" ? "Mua ngay" : "Đã sở hữu"}
            </Button>
          )}

          {/* Button xem chi tiet */}
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/nft-template/${nft.id}`);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
