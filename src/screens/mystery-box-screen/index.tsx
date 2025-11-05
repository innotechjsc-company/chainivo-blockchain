"use client";

import { useState, useEffect } from "react";
import { MysteryBoxFiltersCard, MysteryBoxGridCard } from "./components";
import { useMysteryBoxData, useMysteryBoxFilters } from "./hooks";
import { toast } from "sonner";
import {
  ConfirmPurchaseModal,
  BoxOpeningAnimation,
  RewardDisplay,
} from "../mystery-box-detail-screen/components";
import {
  MysteryBoxService,
  type OpenBoxResponse,
} from "@/api/services/mystery-box-service";
import TransferService from "@/services/TransferService";
import { useAppSelector } from "@/stores";
import type { MysteryBoxData } from "./hooks/useMysteryBoxData";

export default function MysteryBoxScreen() {
  // 1. Fetch dữ liệu qua hooks
  const { boxes, isLoading, error } = useMysteryBoxData();
  const { filters, setFilters, filteredBoxes, resetFilters, hasActiveFilters } =
    useMysteryBoxFilters(boxes);
  const user = useAppSelector((state) => state.auth.user);

  // Purchase states
  const [selectedBox, setSelectedBox] = useState<MysteryBoxData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [openedReward, setOpenedReward] = useState<OpenBoxResponse | null>(
    null
  );

  // Helper to get image URL from box object
  const getBoxImageUrl = (box: MysteryBoxData): string => {
    if (!box) return "/nft-box.jpg";

    // Nếu image là string (đã được convert)
    if (typeof box.image === "string") {
      return box.image || "/nft-box.jpg";
    }

    // Nếu image là object (chưa được convert)
    if (box.image && typeof box.image === "object" && "url" in box.image) {
      const imageObj = box.image as any;
      return imageObj.url || "/nft-box.jpg";
    }

    return "/nft-box.jpg";
  };

  // Handler to open modal
  const handleOpenModal = (box: MysteryBoxData) => {
    setSelectedBox(box);
    setIsModalOpen(true);
  };

  // Handler to close modal
  const handleCloseModal = () => {
    if (!isPurchasing) {
      setIsModalOpen(false);
      setSelectedBox(null);
    }
  };

  // Handler for confirmed purchase
  const handleConfirmPurchase = async () => {
    if (!selectedBox || !user?.walletAddress) {
      toast.error("Vui lòng kết nối ví trước khi mua hộp");
      return;
    }
    try {
      setIsPurchasing(true);
      setIsModalOpen(false);
      // Step 1: Transfer CAN tokens to admin wallet
      toast.info("Đang chuẩn bị...");
      setIsOpening(true);
      setIsApiLoading(true);
      const transferResult = await TransferService.sendCanTransfer({
        fromAddress: user.walletAddress,
        amountCan: Number(selectedBox.price.amount),
      });
      toast.success("Chuyển token thành công!");

      // Step 2: Call MYSTERY_BOX.BUY API with transaction hash (in parallel)
      toast.info("Đang mở hộp...");
      MysteryBoxService.openBox({
        mysteryBoxId: selectedBox.id,
        transactionHash: transferResult.transactionHash,
      })
        .then((response) => {
          if (response.success && response.data) {
            setOpenedReward(response.data);
          } else {
            throw new Error(response.message || "Không thể mở hộp");
          }
        })
        .catch((err: any) => {
          const errorMessage = err?.message || "Có lỗi xảy ra khi mở hộp";
          toast.error(errorMessage);
          console.error("Box opening error:", err);
          setIsOpening(false);
          setIsPurchasing(false);
        })
        .finally(() => {
          setIsApiLoading(false);
        });
    } catch (err: any) {
      const errorMessage = err?.message || "Có lỗi xảy ra khi mua hộp";
      toast.error(errorMessage);
      console.error("Box purchase error:", err);
      setIsOpening(false);
      setIsPurchasing(false);
    }
  };

  // Handler when animation completes
  const handleAnimationComplete = () => {
    // Nếu API vẫn đang load, giữ animation mở
    if (isApiLoading) {
      return;
    }

    setIsOpening(false);
    setIsPurchasing(false);

    if (openedReward) {
      // Show reward display modal
      setShowReward(true);
    }
  };

  // Effect: Đóng animation khi API xong và animation đã hoàn tất
  useEffect(() => {
    if (!isApiLoading && isOpening && openedReward) {
      // API vừa xong, animation vẫn mở, có reward data → close animation
      const timer = setTimeout(() => {
        setIsOpening(false);
        setIsPurchasing(false);
        setShowReward(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isApiLoading, isOpening, openedReward]);

  // Handler to close reward display
  const handleCloseReward = () => {
    setShowReward(false);
    setOpenedReward(null);
  };

  // 2. Event handlers
  const handlePurchase = (boxId: string) => {
    const box = boxes.find((b) => b.id === boxId);
    if (!box) return;

    if (!box.isUnlimited && box.remainingSupply === 0) {
      toast.error("Hộp này đã hết hàng!");
      return;
    }

    handleOpenModal(box);
  };

  // 3. Loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Đang tải hộp bí ẩn...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="text-center py-20">
            <p className="text-xl text-red-400">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  // 4. Compose UI
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Filters */}
        <MysteryBoxFiltersCard
          filters={filters}
          onFiltersChange={setFilters}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
        />

        {/* Mystery Boxes Grid */}
        {filteredBoxes.length > 0 ? (
          <MysteryBoxGridCard
            boxes={filteredBoxes}
            title="Hộp Bí Ẩn"
            onPurchase={handlePurchase}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              Không tìm thấy hộp bí ẩn phù hợp với bộ lọc
            </p>
          </div>
        )}

        {/* Confirm Purchase Modal */}
        {selectedBox && (
          <ConfirmPurchaseModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmPurchase}
            box={selectedBox}
            isLoading={isPurchasing}
          />
        )}

        {/* Box Opening Animation */}
        {selectedBox && (
          <BoxOpeningAnimation
            isOpen={isOpening}
            boxName={selectedBox.name}
            boxImage={getBoxImageUrl(selectedBox)}
            onAnimationComplete={handleAnimationComplete}
            isApiComplete={!isApiLoading}
            initialTitle="Đang chuẩn bị..."
            shakeTitle="Đang chuyển token..."
            openingTitle="Đang mở hộp quà!"
            revealTitle="Chúc mừng!"
          />
        )}

        {/* Reward Display */}
        <RewardDisplay
          isOpen={showReward}
          onClose={handleCloseReward}
          reward={openedReward}
        />
      </main>
    </div>
  );
}
