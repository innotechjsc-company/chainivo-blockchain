"use client";

import { useState } from "react";
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

interface MysteryBoxDetailScreenProps {
  boxId: string;
}

export default function MysteryBoxDetailScreen({
  boxId,
}: MysteryBoxDetailScreenProps) {
  const router = useRouter();
  const { box, isLoading, error } = useBoxDetail(boxId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [openedReward, setOpenedReward] = useState<OpenBoxResponse | null>(null);

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
    if (!box) return;

    try {
      setIsPurchasing(true);
      setIsModalOpen(false);

      // Call MYSTERY_BOX.BUY API to open the box
      const response = await MysteryBoxService.openBox({
        mysteryBoxId: box.id,
      });

      if (response.success && response.data) {
        // Show opening animation
        setIsOpening(true);
        setOpenedReward(response.data);
      } else {
        throw new Error(response.message || "Không thể mở hộp");
      }
    } catch (err: any) {
      toast.error(err?.message || "Có lỗi xảy ra khi mở hộp");
      console.error("Box opening error:", err);
      setIsPurchasing(false);
    }
  };

  // Handler when animation completes
  const handleAnimationComplete = () => {
    setIsOpening(false);
    setIsPurchasing(false);

    if (openedReward) {
      // Show reward display modal
      setShowReward(true);
    }
  };

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
          boxImage={box.image}
          onAnimationComplete={handleAnimationComplete}
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
