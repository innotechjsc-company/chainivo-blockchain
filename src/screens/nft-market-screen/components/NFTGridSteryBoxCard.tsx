"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { NFTCard } from "./NFTCard";
import { NFT } from "../hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";

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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const isSteryBoxView = searchParams?.get("type") === "sterybox";
  const isControlled =
    propTotalPages !== undefined &&
    propCurrentPage !== undefined &&
    onPageChange !== undefined;

  const currentPage = isControlled ? propCurrentPage! : localCurrentPage;
  const totalPages = isControlled
    ? propTotalPages!
    : Math.max(1, Math.ceil(nfts.length / initialCount));

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

  // Hiển thị theo phân trang (hoặc dữ liệu đã được phân trang từ API)
  const itemsPerPage = initialCount;

  const displayedNFTs = useMemo(() => {
    if (nfts.length === 0) return [];
    if (isControlled) {
      return nfts;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return nfts.slice(startIndex, endIndex);
  }, [nfts, currentPage, itemsPerPage, isControlled]);

  useEffect(() => {
    if (!isControlled) {
      setLocalCurrentPage(1);
    }
  }, [nfts.length, isControlled]);

  const handlePrevious = () => {
    handlePageClick(localCurrentPage - 1);
  };

  const handleNext = () => {
    handlePageClick(localCurrentPage + 1);
  };

  const handlePageClick = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) {
      return;
    }
    onPageChange?.(page);
    setLocalCurrentPage(page);
    titleRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleViewAll = () => {
    router.push("/nft-market?type=sterybox");
  };

  if (nfts.length === 0) {
    return null;
  }

  const onClickNFT = (id: string) => {
    router.push(`/nft-template/${id}?type=tier`);
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 ref={titleRef} className="text-2xl font-bold  gradient-text">
          {title}
        </h2>
        {!isSteryBoxView && (
          <Button
            variant="outline"
            onClick={handleViewAll}
            className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold gap-2 cursor-pointer"
          >
            Xem tất cả
            <TrendingUp className="w-4 h-4" />
          </Button>
        )}
      </div>

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

      {/* Phan trang */}
      {isSteryBoxView && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Truoc
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum) => {
              const isActive = pageNum === currentPage;

              return (
                <Button
                  key={pageNum}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageClick(pageNum)}
                  className={`h-9 w-9 p-0 ${
                    isActive ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="gap-2"
          >
            Sau
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
