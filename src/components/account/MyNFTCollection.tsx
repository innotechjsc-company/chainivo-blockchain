"use client";

import { useEffect, useRef, useState } from "react";
import { useMyNFTCollection } from "@/hooks/useMyNFTCollection";
import type { NFTFilterType } from "@/hooks/useMyNFTCollection";
import { NFTStatsCards } from "./NFTStatsCards";
import { NFTCard, MysteryBoxAnimationWrapper } from "@/components/nft";
import { ListNFTDialog } from "./ListNFTDialog";
import { CancelSaleDialog } from "./CancelSaleDialog";
import { NFTFilters } from "./NFTFilters";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import type { NFTItem } from "@/types/NFT";
import { useRouter } from "next/navigation";
import { NFTService } from "@/api/services/nft-service";
import { ToastService } from "@/services/ToastService";
import type { OpenBoxResponse } from "@/api/services/mystery-box-service";
import { LoadingSpinner } from "@/lib/loadingSpinner";

interface MyNFTCollectionProps {
  type?: string;
}

export function MyNFTCollection({ type }: MyNFTCollectionProps) {
  // Su dung hook fetch NFT collection
  const {
    nfts,
    stats,
    loading,
    loadingMore,
    error,
    filter,
    setFilter,
    advancedFilters,
    setAdvancedFilters,
    resetAdvancedFilters,
    refetch,
    loadMore,
    hasMore,
  } = useMyNFTCollection();

  // State cho List NFT Dialog
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // State cho Open Box Animation
  const [selectedBoxNFT, setSelectedBoxNFT] = useState<NFTItem | null>(null);
  const [isOpeningBox, setIsOpeningBox] = useState(false);

  // State cho Cancel Sale Dialog
  const [nftToCancel, setNftToCancel] = useState<NFTItem | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const router = useRouter();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore, loading, loadingMore]);

  // Handler mở dialog đăng bán NFT
  const handleListForSale = (nft: NFTItem) => {
    setSelectedNFT(nft);
    setDialogOpen(true);
  };

  // Handler bắt đầu mở hộp (trigger animation)
  const handleOpenBox = (nft: NFTItem) => {
    setSelectedBoxNFT(nft);
    setIsOpeningBox(true);
  };

  // Handler gọi API mở hộp (được gọi bởi MysteryBoxAnimationWrapper)
  const handleOpenBoxAPI = async (): Promise<OpenBoxResponse> => {
    if (!selectedBoxNFT) {
      throw new Error("Không có hộp nào được chọn");
    }

    // Goi API mo hop
    const response = await NFTService.openBox(selectedBoxNFT.id);

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(
        response.error || response.message || "Có lỗi xảy ra khi mở hộp"
      );
    }
  };

  // Handler khi hoàn tất tất cả (animation + reward display)
  const handleOpenBoxComplete = () => {
    setIsOpeningBox(false);
    setSelectedBoxNFT(null);

    // Refetch NFT collection để cập nhật danh sách
    refetch();

    ToastService.success("Phần thưởng đã được chuyển vào tài khoản của bạn!");
  };

  // Handler khi có lỗi
  const handleOpenBoxError = (error: string) => {
    setIsOpeningBox(false);
    ToastService.error(error);
  };

  // Handler hủy đăng bán NFT
  const handleCancelSale = (nft: NFTItem) => {
    setNftToCancel(nft);
    setCancelDialogOpen(true);
  };

  // Handler chung cho action clicks từ NFTCard
  const handleActionClick = (
    nft: NFTItem,
    action: "sell" | "buy" | "open" | "cancel"
  ) => {
    if (action === "sell") {
      handleListForSale(nft);
    } else if (action === "open") {
      handleOpenBox(nft);
    } else if (action === "cancel") {
      handleCancelSale(nft);
    }
  };

  const onClickMyNFT = (id: string) => {
    router.push(`/nft/${id}?type=tier`);
  };

  // Error state
  if (error && !loading) {
    return (
      <Card className="glass p-6">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Không thể tải danh sách NFT</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <LoadingSpinner />
        </div>
      )}

      {/* Layout 2 cột: Sidebar trái (sticky) và Content phải */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar trái - Menu dọc cố định */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as NFTFilterType)}
            className="w-full"
          >
            <div className="sticky top-24">
              <Card className="glass">
                <CardContent className="p-4">
                  <TabsList className="flex flex-col w-full h-auto gap-2">
                    <TabsTrigger
                      value="all"
                      className="w-full justify-start text-left"
                    >
                      Tất cả ({stats.totalNFTs})
                    </TabsTrigger>
                    <TabsTrigger
                      value="sale"
                      className="w-full justify-start text-left"
                    >
                      Đang bán ({stats.onSale})
                    </TabsTrigger>
                    <TabsTrigger
                      value="not-listed"
                      className="w-full justify-start text-left"
                    >
                      NFT của bạn ({stats.notListed})
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </aside>

        {/* Content phải - Tất cả các phần còn lại */}
        <div className="flex-1 space-y-6">
          {/* Stats Cards */}
          <NFTStatsCards {...stats} />

          {/* Advanced Filters - Loc NFT theo type, level, price */}
          <NFTFilters
            filters={advancedFilters}
            onFiltersChange={setAdvancedFilters}
            onReset={resetAdvancedFilters}
          />

          {nfts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không có NFT nào</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {nfts.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                    type={type}
                    onActionClick={handleActionClick as any}
                    onListForSale={handleListForSale}
                    onClick={() => onClickMyNFT(nft.id)}
                    onRefreshNFTs={refetch}
                  />
                ))}
              </div>
              <div
                ref={sentinelRef}
                className="flex items-center justify-center py-4"
              >
                {loadingMore && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LoadingSpinner />
                    <span>Đang tải thêm...</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* List NFT Dialog */}
      <ListNFTDialog
        nft={selectedNFT}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={refetch}
      />

      {/* Cancel Sale Dialog */}
      <CancelSaleDialog
        nft={nftToCancel}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onSuccess={refetch}
      />

      {/* Mystery Box Animation Wrapper */}
      <MysteryBoxAnimationWrapper
        isOpen={isOpeningBox}
        boxName={selectedBoxNFT?.name}
        boxImage={
          selectedBoxNFT?.image && typeof selectedBoxNFT.image === "object"
            ? (selectedBoxNFT.image as any).url
            : typeof selectedBoxNFT?.image === "string"
            ? selectedBoxNFT.image
            : undefined
        }
        onOpenBox={handleOpenBoxAPI}
        onComplete={handleOpenBoxComplete}
        onError={handleOpenBoxError}
        initialTitle="Đang chuẩn bị..."
        shakeTitle="Đang mở hộp..."
        openingTitle="Đang mở hộp quà của bạn!"
        revealTitle="Chúc mừng!"
      />
    </div>
  );
}
