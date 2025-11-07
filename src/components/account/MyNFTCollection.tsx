"use client";

import { useState } from "react";
import { useMyNFTCollection } from "@/hooks/useMyNFTCollection";
import type { NFTFilterType } from "@/hooks/useMyNFTCollection";
import { NFTStatsCards } from "./NFTStatsCards";
import { NFTCard, MysteryBoxAnimationWrapper } from "@/components/nft";
import { ListNFTDialog } from "./ListNFTDialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import type { NFTItem } from "@/types/NFT";
import { useRouter } from "next/navigation";
import { NFTService } from "@/api/services/nft-service";
import { ToastService } from "@/services/ToastService";
import type { OpenBoxResponse } from "@/api/services/mystery-box-service";

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="glass p-4">
            <div className="h-16 bg-muted animate-pulse rounded" />
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="h-10 w-full max-w-md bg-muted animate-pulse rounded" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="glass overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse" />
            <CardContent className="p-4 space-y-2">
              <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function MyNFTCollection() {
  // Su dung hook fetch NFT collection
  const { nfts, stats, loading, error, filter, setFilter, refetch } =
    useMyNFTCollection();

  // State cho List NFT Dialog
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // State cho Open Box Animation
  const [selectedBoxNFT, setSelectedBoxNFT] = useState<NFTItem | null>(null);
  const [isOpeningBox, setIsOpeningBox] = useState(false);

  const router = useRouter();

  // Handler mo dialog dang ban NFT
  const handleListForSale = (nft: NFTItem) => {
    setSelectedNFT(nft);
    setDialogOpen(true);
  };

  // Handler bat dau mo hop (trigger animation)
  const handleOpenBox = (nft: NFTItem) => {
    setSelectedBoxNFT(nft);
    setIsOpeningBox(true);
  };

  // Handler goi API mo hop (duoc goi boi MysteryBoxAnimationWrapper)
  const handleOpenBoxAPI = async (): Promise<OpenBoxResponse> => {
    if (!selectedBoxNFT) {
      throw new Error('Khong co hop nao duoc chon');
    }

    // Goi API mo hop
    const response = await NFTService.openBox(selectedBoxNFT.id);

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.error || response.message || 'Co loi xay ra khi mo hop');
    }
  };

  // Handler khi hoan tat tat ca (animation + reward display)
  const handleOpenBoxComplete = () => {
    setIsOpeningBox(false);
    setSelectedBoxNFT(null);

    // Refetch NFT collection de cap nhat danh sach
    refetch();

    ToastService.success('Phan thuong da duoc chuyen vao tai khoan cua ban!');
  };

  // Handler khi co loi
  const handleOpenBoxError = (error: string) => {
    setIsOpeningBox(false);
    ToastService.error(error);
  };

  // Handler chung cho action clicks tu NFTCard
  const handleActionClick = (nft: NFTItem, action: 'sell' | 'buy' | 'open') => {
    if (action === 'sell') {
      handleListForSale(nft);
    } else if (action === 'open') {
      handleOpenBox(nft);
    }
  };

  const onClickMyNFT = (id: string) => {
    router.push(`/nft/${id}?type=tier`);
  };
  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <Card className="glass p-6">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Khong the tai danh sach NFT</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className=" space-y-6 ">
      {/* Stats Cards */}
      <NFTStatsCards {...stats} />

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as NFTFilterType)}
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="all">Tất cả ({stats.totalNFTs})</TabsTrigger>
          <TabsTrigger value="sale">Đang bán ({stats.onSale})</TabsTrigger>
          <TabsTrigger value="not-listed">
            NFT của bạn ({stats.notListed})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {nfts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không có NFT nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              type="tier"
              onActionClick={handleActionClick}
              onListForSale={handleListForSale}
              onClick={() => onClickMyNFT(nft.id)}
            />
          ))}
        </div>
      )}

      {/* List NFT Dialog */}
      <ListNFTDialog
        nft={selectedNFT}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
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
        initialTitle="Dang chuan bi..."
        shakeTitle="Dang mo hop..."
        openingTitle="Dang mo hop qua cua ban!"
        revealTitle="Chuc mung!"
      />
    </div>
  );
}
