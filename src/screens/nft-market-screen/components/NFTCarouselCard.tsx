"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { NFTCard } from "./NFTCard";
import { NFT } from "../hooks";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";

interface NFTCarouselCardProps {
  nfts: NFT[];
  title: string;
  displayCount?: number;
  rotationInterval?: number; // in milliseconds
  viewAllLink?: string;
}

const resolveNFTId = (item: NFT): string => {
  const meta = item as unknown as Record<string, unknown>;
  return String(meta?.id ?? meta?._id ?? meta?.tokenId ?? "");
};

const resolveLikeStatus = (item: NFT): boolean => {
  const meta = item as unknown as Record<string, unknown>;
  return Boolean(meta?.isLike ?? meta?.isLiked);
};

export const NFTCarouselCard = ({
  nfts,
  title,
  displayCount = 3,
  rotationInterval = 5000,
  viewAllLink = "/nft-market",
}: NFTCarouselCardProps) => {
  const router = useRouter();
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [displayedNFTs, setDisplayedNFTs] = useState<NFT[]>([]);
  const [rotationIndex, setRotationIndex] = useState(0);

  // Initialize liked status
  useEffect(() => {
    const next: Record<string, boolean> = {};
    nfts.forEach((item) => {
      const id = resolveNFTId(item);
      if (!id) return;
      next[id] = resolveLikeStatus(item);
    });
    setLikedMap(next);
  }, [nfts]);

  // Get random NFTs for initial display
  useEffect(() => {
    if (nfts.length === 0) return;

    const shuffled = [...nfts].sort(() => Math.random() - 0.5);
    setDisplayedNFTs(shuffled.slice(0, displayCount));
    setRotationIndex(displayCount);
  }, [nfts, displayCount]);

  // Auto-rotate NFTs every interval
  useEffect(() => {
    if (nfts.length <= displayCount) return;

    const interval = setInterval(() => {
      setDisplayedNFTs((prev) => {
        const newNFTs = [...prev];
        // Replace one random card with a new one from remaining NFTs
        const randomIndex = Math.floor(Math.random() * displayCount);
        const availableNFTs = nfts.filter(
          (nft) => !newNFTs.some((n) => resolveNFTId(n) === resolveNFTId(nft))
        );

        if (availableNFTs.length > 0) {
          const randomNFT =
            availableNFTs[Math.floor(Math.random() * availableNFTs.length)];
          newNFTs[randomIndex] = randomNFT;
        }

        return newNFTs;
      });
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [nfts, displayCount, rotationInterval]);

  const handleLikeChange = (id: string, isLiked: boolean) => {
    if (!id) return;
    setLikedMap((prev) => ({ ...prev, [id]: isLiked }));
  };

  if (nfts.length === 0) {
    return null;
  }

  const onClickNFT = (id: string) => {
    router.push(`/nft-template/${id}?type=tier`);
  };

  const handleViewAll = () => {
    router.push(viewAllLink);
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold gradient-text">{title}</h2>
        <Button
          variant="outline"
          onClick={handleViewAll}
          className="gap-2"
        >
          Xem tất cả
          <TrendingUp className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedNFTs.map((nft, index) => {
          const id = resolveNFTId(nft);
          const isLiked = likedMap[id] ?? resolveLikeStatus(nft);
          return (
            <div
              key={id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <NFTCard
                nft={nft}
                type={nft.type}
                onClick={onClickNFT}
                onLikeChange={handleLikeChange}
                isLiked={isLiked}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};