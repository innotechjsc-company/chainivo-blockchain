"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NFTCard } from "./NFTCard";
import { NFT } from "../hooks";
import { useRouter } from "next/navigation";
import { NFTType } from "@/types";

interface NFTGridCardProps {
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

export const NFTGridCard = ({
  nfts,
  title,
  initialCount = 6,
  totalPages: propTotalPages,
  currentPage: propCurrentPage,
  onPageChange,
}: NFTGridCardProps) => {
  const router = useRouter();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  // Sử dụng props nếu có, nếu không thì dùng local state
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
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

  // Tính toán phân trang (chỉ dùng khi không có props)
  const itemsPerPage = initialCount;

  // Lấy NFT cho trang hiện tại
  const displayedNFTs = useMemo(() => {
    if (nfts.length === 0) return [];
    // Nếu có onPageChange (controlled), hiển thị tất cả nfts (đã được filter từ API)
    if (isControlled) {
      return nfts;
    }
    // Nếu không (uncontrolled), slice local
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return nfts.slice(startIndex, endIndex);
  }, [nfts, currentPage, itemsPerPage, isControlled]);

  // Reset về trang 1 khi nfts thay đổi (chỉ cho uncontrolled mode)
  useEffect(() => {
    if (!isControlled) {
      setLocalCurrentPage(1);
    }
  }, [nfts.length, isControlled]);

  // Xử lý chuyển trang
  const handlePrevious = () => {
    handlePageClick(localCurrentPage - 1);
  };

  const handleNext = () => {
    handlePageClick(localCurrentPage + 1);
  };

  const handlePageClick = (page: number) => {
    if (page === currentPage) {
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

  // Tính toán các số trang hiển thị - hiển thị tất cả số trang
  const getPageNumbers = () => {
    const pages: number[] = [];
    // Hiển thị tất cả các trang từ 1 đến totalPages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (nfts.length === 0) {
    return null;
  }

  const onClickNFT = (id: string) => {
    router.push(`/nft-template/${id}?type=tier`);
  };

  return (
    <div className="mb-12">
      <h2 ref={titleRef} className="text-2xl font-bold mb-6 gradient-text">
        {title}
      </h2>

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

      {/* Phân trang */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Trước
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
    </div>
  );
};
