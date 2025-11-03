"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useBoxDetail } from "./hooks";
import {
  BoxDetailHeader,
  BoxImageGallery,
  RewardsDetail,
  PurchaseCard,
  ConfirmPurchaseModal,
  BoxOpeningAnimation,
  RewardDisplay,
} from "./components";
import {
  MysteryBoxService,
  type OpenBoxResponse,
} from "@/api/services/mystery-box-service";
import TransferService from "@/services/TransferService";
import { useAppSelector } from "@/stores";

interface MysteryBoxDetailScreenProps {
  boxId: string;
}

export default function MysteryBoxDetailScreen({
  boxId,
}: MysteryBoxDetailScreenProps) {
  const router = useRouter();
  const { box, isLoading, error } = useBoxDetail(boxId);
  const user = useAppSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [openedReward, setOpenedReward] = useState<OpenBoxResponse | null>(
    null
  );

  // Helper to get image URL from box object
  const getBoxImageUrl = (): string => {
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
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Handler to close modal
  const handleCloseModal = () => {
    if (!isPurchasing) {
      setIsModalOpen(false);
    }
  };

  // Handler for confirmed purchase
  const handleConfirmPurchase = async () => {
    if (!box || !user?.walletAddress) {
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
        amountCan: Number(box.price.amount),
      });
      toast.success("Chuyển token thành công!");

      // Step 2: Call MYSTERY_BOX.BUY API with transaction hash (in parallel)
      toast.info("Đang mở hộp...");
      MysteryBoxService.openBox({
        mysteryBoxId: box.id,
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
    // Optionally refetch box details or navigate
    // router.push("/mysterybox");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Đang tải thông tin hộp bí ẩn...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !box) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="text-center py-20">
            <p className="text-xl text-red-400 mb-4">
              {error || "Không tìm thấy hộp bí ẩn"}
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/mysterybox")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => router.push("/mysterybox")}
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>

        {/* Header */}
        <div className="mb-6">
          <BoxDetailHeader box={box} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image and Rewards */}
          <div className="lg:col-span-2 space-y-6">
            <BoxImageGallery box={box} />
            <RewardsDetail box={box} />
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <PurchaseCard box={box} onPurchase={handleOpenModal} />
          </div>
        </div>

        {/* Confirm Purchase Modal */}
        <ConfirmPurchaseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmPurchase}
          box={box}
          isLoading={isPurchasing}
        />

        {/* Box Opening Animation */}
        <BoxOpeningAnimation
          isOpen={isOpening}
          boxName={box.name}
          boxImage={getBoxImageUrl()}
          onAnimationComplete={handleAnimationComplete}
          isApiComplete={!isApiLoading}
          initialTitle="Đang chuẩn bị..."
          shakeTitle="Đang chuyển token..."
          openingTitle="Đang mở hộp quà!"
          revealTitle="Chúc mừng!"
        />

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
