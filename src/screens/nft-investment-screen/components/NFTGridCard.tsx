"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NFTInvestmentCard } from "./NFTCard";

interface NFTGridCardProps {
  nfts: any[];
  title: string;
  initialCount?: number;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export const NFTGridCard = ({
  nfts,
  title,
  initialCount = 6,
  totalPages: propTotalPages,
  currentPage: propCurrentPage,
  onPageChange,
}: NFTGridCardProps) => {
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
    handlePageClick(currentPage - 1);
  };

  const handleNext = () => {
    handlePageClick(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    if (page === currentPage) {
      return;
    }

    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 400, behavior: "smooth" });

    // Cập nhật state hoặc gọi callback
    if (isControlled) {
      onPageChange?.(page);
    } else {
      setLocalCurrentPage(page);
    }
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

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 gradient-text">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {displayedNFTs.map((nft, index) => (
          <div
            key={nft.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <NFTInvestmentCard
              nft={nft}
              type={title === "NFT của tôi" ? "tier" : "other"}
            />
          </div>
        ))}
      </div>

      {/* Pagination - chỉ hiển thị khi có nhiều hơn 1 trang */}
      <div className="flex items-center justify-center gap-2 mt-12">
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
