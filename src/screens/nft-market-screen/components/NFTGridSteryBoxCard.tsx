"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NFTCard } from "./NFTCard";
import { NFT } from "../hooks";
import { useRouter } from "next/navigation";

interface NFTGridSteryBoxCardProps {
  nfts: NFT[];
  title: string;
  initialCount?: number;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const resolveNFTId = (item: NFT): string => {
  const meta = item as unknown as Record<string, unknown>;
  return String(meta?.id ?? meta?._id ?? meta?.tokenId ?? "");
};

const resolveLikeStatus = (item: NFT): boolean => {
  const meta = item as unknown as Record<string, unknown>;
  return Boolean(meta?.isLike ?? meta?.isLiked);
};

export const NFTGridSteryBoxCard = ({
  nfts,
  title,
  initialCount = 3,
  totalPages: propTotalPages,
  currentPage: propCurrentPage,
  onPageChange,
}: NFTGridSteryBoxCardProps) => {
  const router = useRouter();
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const next: Record<string, boolean> = {};
    nfts.forEach((item) => {
      const id = resolveNFTId(item);
      if (!id) return;
      next[id] = resolveLikeStatus(item);
    });
    setLikedMap(next);
  }, [nfts]);

  const handleLikeChange = (id: string, isLiked: boolean) => {
    if (!id) return;
    setLikedMap((prev) => ({ ...prev, [id]: isLiked }));
  };

  // Hiển thị 3 items ban đầu (1 dòng), hoặc tất cả nếu đã mở rộng
  const displayedNFTs = useMemo(() => {
    if (nfts.length === 0) return [];
    if (isExpanded) {
      return nfts;
    }
    return nfts.slice(0, initialCount);
  }, [nfts, isExpanded, initialCount]);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  if (nfts.length === 0) {
    return null;
  }

  const onClickNFT = (id: string) => {
    router.push(`/nft-template/${id}?type=tier`);
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 gradient-text">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {displayedNFTs.map((nft, index) => {
          const id = resolveNFTId(nft);
          const isLiked = likedMap[id] ?? resolveLikeStatus(nft);
          return (
            <div
              key={nft.id}
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

      {/* Button Xem thêm / Thu gọn */}
      {nfts.length > initialCount && (
        <div className="flex items-center justify-center mt-6">
          <Button
            variant="outline"
            onClick={handleToggleExpand}
            className="gap-2"
          >
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </Button>
        </div>
      )}
    </div>
  );
};
