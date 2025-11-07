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

  // Neu chi co 1 trang hoac khong co data thi khong hien pagination
  if (totalPages <= 1 || totalDocs === 0) return null;

  // Tinh toan cac trang de hien thi (max 5 page buttons)
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Neu tong pages <= 5 thi hien tat ca
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Neu tong pages > 5 thi hien 5 pages xung quanh current page
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);

      // Dieu chinh startPage neu endPage la totalPages
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
        Trang {page} / {totalPages} · Tong {totalDocs} giao dich
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
