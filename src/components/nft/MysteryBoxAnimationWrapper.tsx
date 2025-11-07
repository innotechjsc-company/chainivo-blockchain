"use client";

import { useState, useEffect } from "react";
import { BoxOpeningAnimation } from "./BoxOpeningAnimation";
import { RewardDisplay } from "./RewardDisplay";
import type { OpenBoxResponse } from "@/api/services/mystery-box-service";

interface MysteryBoxAnimationWrapperProps {
  // Control khi nao bat dau animation
  isOpen: boolean;

  // Thong tin hien thi
  boxName?: string;
  boxImage?: string;

  // Callback goi API de mo hop
  onOpenBox: () => Promise<OpenBoxResponse>;

  // Callback khi hoan tat tat ca (animation + reward display)
  onComplete: () => void;

  // Callback khi co loi
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
  // State quan ly animation va API
  const [isApiComplete, setIsApiComplete] = useState(false);
  const [reward, setReward] = useState<OpenBoxResponse | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showReward, setShowReward] = useState(false);

  // Reset state khi dong
  useEffect(() => {
    if (!isOpen) {
      setIsApiComplete(false);
      setReward(null);
      setShowAnimation(false);
      setShowReward(false);
    }
  }, [isOpen]);

  // Tu dong goi API khi isOpen = true
  useEffect(() => {
    if (isOpen && !showAnimation) {
      setShowAnimation(true);
      setIsApiComplete(false);

      // Goi API mo hop
      onOpenBox()
        .then((response) => {
          setReward(response);
          setIsApiComplete(true);
        })
        .catch((error) => {
          console.error("Error opening mystery box:", error);
          onError?.(error.message || "Không thể mở hộp quà");
          // Dong animation khi co loi
          setShowAnimation(false);
          setIsApiComplete(false);
        });
    }
  }, [isOpen, showAnimation, onOpenBox, onError]);

  return (
    <>
      {/* Animation mo hop */}
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
          // Animation xong → hien reward display
          setShowAnimation(false);
          setShowReward(true);
        }}
      />

      {/* Hien thi phan thuong */}
      <RewardDisplay
        isOpen={showReward}
        reward={reward}
        onClose={() => {
          // Dong reward display va trigger completion callback
          setShowReward(false);
          setReward(null);
          onComplete();
        }}
      />
    </>
  );
};