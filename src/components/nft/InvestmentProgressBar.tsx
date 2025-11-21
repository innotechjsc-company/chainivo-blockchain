"use client";

import React, { useState, useEffect } from "react";
import type { NFTCurrency } from "@/types/NFT";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import NFTService from "@/api/services/nft-service";

interface InvestmentProgressBarProps {
  soldShares: number;
  totalShares: number;
  totalInvestors: number;
  pricePerShare: number;
  currency: NFTCurrency;
  nftId?: string;
  className?: string;
}

const formatAmount = (value: unknown) => {
  const num = Number(value || 0);
  if (Number.isNaN(num)) return String(value ?? "-");
  return num.toLocaleString("en-US");
};

export default function InvestmentProgressBar({
  soldShares,
  totalShares,
  totalInvestors,
  pricePerShare,
  currency,
  nftId,
  className = "",
}: InvestmentProgressBarProps) {
  // Tính tỷ lệ phần trăm đã bán
  const percentage = totalShares > 0 ? (soldShares / totalShares) * 100 : 0;
  const availableShares = totalShares - soldShares;

  // State cho modal và share detail
  const [modalOpen, setModalOpen] = useState(false);
  const [shareDetail, setShareDetail] = useState<any[]>([]);
  const [shareDetailLoading, setShareDetailLoading] = useState(false);
  const [showAllShareDetail, setShowAllShareDetail] = useState(false);

  // Fetch share detail khi modal mở
  const fetchShareDetail = async () => {
    if (!nftId) return;

    try {
      setShareDetailLoading(true);
      const response = await NFTService.getShareDetail({ nftId });
      if (response.success && response.data) {
        setShareDetail(response.data?.dataDetail || []);
      } else {
        setShareDetail([]);
      }
    } catch (error) {
      console.error("Error fetching share detail:", error);
      setShareDetail([]);
    } finally {
      setShareDetailLoading(false);
    }
  };

  useEffect(() => {
    if (modalOpen && nftId) {
      fetchShareDetail();
    } else {
      // Reset khi đóng modal
      setShareDetail([]);
      setShowAllShareDetail(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, nftId]);

  const handleOpenModal = () => {
    if (nftId) {
      setModalOpen(true);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>cổ phần sở hữu</span>
          <span className="font-medium">
            {soldShares}/{totalShares} cổ phần
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          className={
            nftId ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
          }
          onClick={nftId ? handleOpenModal : undefined}
          role={nftId ? "button" : undefined}
          tabIndex={nftId ? 0 : undefined}
          onKeyDown={(e) => {
            if (nftId && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              handleOpenModal();
            }
          }}
        >
          <span className="text-gray-600 dark:text-gray-400">Nhà đầu tư</span>
          <div className="flex items-center gap-1 font-medium">
            <span>👥</span>
            <span>{totalInvestors}</span>
          </div>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Giá/cổ phần</span>
          <div className="font-medium">
            {pricePerShare} <span className="uppercase">{currency}</span>
          </div>
        </div>
      </div>

      {availableShares === 0 && (
        <div className="text-xs text-red-600 dark:text-red-400 font-medium">
          Đã bán hết
        </div>
      )}

      {/* Modal hiển thị danh sách nhà đầu tư */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="glass border-cyan-500/20 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Danh sách người mua cổ phần{" "}
              <span className="text-cyan-400">
                ({shareDetail?.length || 0})
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {shareDetailLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <Spinner className="w-6 h-6 mx-auto mb-2" />
                <p>Đang tải lịch sử mua cổ phần...</p>
              </div>
            ) : shareDetail &&
              Array.isArray(shareDetail) &&
              shareDetail.length > 0 ? (
              <div className="space-y-4 flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="mt-4 flex-1 overflow-hidden flex flex-col min-h-0">
                  <div
                    className="space-y-2 overflow-y-auto pr-2 flex-1"
                    style={{
                      maxHeight: showAllShareDetail ? "500px" : "400px",
                      minHeight: "200px",
                    }}
                  >
                    {(showAllShareDetail
                      ? shareDetail
                      : shareDetail.slice(0, 10)
                    ).map((purchase: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-md border border-border/50 bg-background/30 p-3 hover:bg-background/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground mt-1">
                              Người mua:{" "}
                              {purchase.buyer?.walletAddress
                                ? `${purchase.buyer.walletAddress.slice(
                                    0,
                                    4
                                  )}...${purchase.buyer.walletAddress.slice(
                                    -4
                                  )}`
                                : "—"}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-cyan-400">
                              {formatAmount(purchase.totalShares || 0)} CP
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {shareDetail.length > 10 && (
                    <div className="mt-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setShowAllShareDetail(!showAllShareDetail)
                        }
                        className="text-primary hover:text-primary/80"
                      >
                        {showAllShareDetail ? "Thu gọn" : "Xem thêm"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Không có dữ liệu lịch sử mua cổ phần</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
