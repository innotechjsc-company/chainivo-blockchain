'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TransactionPagination as PaginationType } from '@/types/TransactionHistory';

interface TransactionPaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export function TransactionPagination({
  pagination,
  onPageChange,
}: TransactionPaginationProps) {
  const { page, totalPages, hasNextPage, hasPrevPage, totalDocs } = pagination;

  // Nếu chỉ có 1 trang hoặc không có data thì không hiện pagination
  if (totalPages <= 1 || totalDocs === 0) return null;

  // Tính toán các trang để hiển thị (max 5 page buttons)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Nếu tổng pages <= 5 thì hiện tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Nếu tổng pages > 5 thì hiện 5 pages xung quanh current page
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);

      // Điều chỉnh startPage nếu endPage là totalPages
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between pt-4">
      {/* Page Info */}
      <div className="text-sm text-muted-foreground">
        Trang {page} / {totalPages} · Tổng {totalDocs} giao dịch
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={pageNum === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            className="min-w-[40px]"
          >
            {pageNum}
          </Button>
        ))}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
