"use client";

import { useState, useEffect } from "react";
import { BoxOpeningAnimation } from "./BoxOpeningAnimation";
import { RewardDisplay } from "./RewardDisplay";
import type { OpenBoxResponse } from "@/api/services/mystery-box-service";

interface MysteryBoxAnimationWrapperProps {
  // Control khi nào bắt đầu animation
  isOpen: boolean;

  // Thông tin hiển thị
  boxName?: string;
  boxImage?: string;

  // Callback gọi API để mở hộp
  onOpenBox: () => Promise<OpenBoxResponse>;

  // Callback khi hoàn tất tất cả (animation + reward display)
  onComplete: () => void;

  // Callback khi có lỗi
  onError?: (error: string) => void;

  // Custom titles cho animation phases
  initialTitle?: string;
  shakeTitle?: string;
  openingTitle?: string;
  revealTitle?: string;
}

export const MysteryBoxAnimationWrapper = ({
  isOpen,
  boxName,
  boxImage,
  onOpenBox,
  onComplete,
  onError,
  initialTitle,
  shakeTitle,
  openingTitle,
  revealTitle,
}: MysteryBoxAnimationWrapperProps) => {
  // State quản lý animation và API
  const [isApiComplete, setIsApiComplete] = useState(false);
  const [reward, setReward] = useState<OpenBoxResponse | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showReward, setShowReward] = useState(false);

  // Reset state khi đóng
  useEffect(() => {
    if (!isOpen) {
      setIsApiComplete(false);
      setReward(null);
      setShowAnimation(false);
      setShowReward(false);
    }
  }, [isOpen]);

  // Tự động gọi API khi isOpen = true
  useEffect(() => {
    if (isOpen && !showAnimation) {
      setShowAnimation(true);
      setIsApiComplete(false);

      // Gọi API mở hộp
      onOpenBox()
        .then((response) => {
          setReward(response);
          setIsApiComplete(true);
        })
        .catch((error) => {
          console.error("Error opening mystery box:", error);
          onError?.(error.message || "Không thể mở hộp quà");
          // Đóng animation khi có lỗi
          setShowAnimation(false);
          setIsApiComplete(false);
        });
    }
  }, [isOpen, showAnimation, onOpenBox, onError]);

  return (
    <>
      {/* Animation mở hộp */}
      <BoxOpeningAnimation
        isOpen={showAnimation}
        boxName={boxName}
        boxImage={boxImage}
        isApiComplete={isApiComplete}
        initialTitle={initialTitle}
        shakeTitle={shakeTitle}
        openingTitle={openingTitle}
        revealTitle={revealTitle}
        onAnimationComplete={() => {
          // Animation xong → hiển reward display
          setShowAnimation(false);
          setShowReward(true);
        }}
      />

      {/* Hiển thị phần thưởng */}
      <RewardDisplay
        isOpen={showReward}
        reward={reward}
        onClose={() => {
          // Đóng reward display và trigger completion callback
          setShowReward(false);
          setReward(null);
          onComplete();
        }}
      />
    </>
  );
};