"use client";

import { useState, useEffect } from "react";
import { BoxOpeningAnimation } from "./BoxOpeningAnimation";
import { RewardDisplay } from "./RewardDisplay";
import type { OpenBoxResponse } from "@/api/services/mystery-box-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

  // Callback khi user hủy mở hộp (nhấn "Hủy" trong popup xác nhận)
  onCancel?: () => void;

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
  onCancel,
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
  const [hasStarted, setHasStarted] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // Reset state khi đóng
  useEffect(() => {
    if (!isOpen) {
      setIsApiComplete(false);
      setReward(null);
      setShowAnimation(false);
      setShowReward(false);
      setHasStarted(false);
      setShowConfirmPopup(false);
    }
  }, [isOpen]);

  // Hiển thị popup xác nhận khi isOpen = true
  useEffect(() => {
    if (isOpen && !hasStarted) {
      setShowConfirmPopup(true);
    }
  }, [isOpen, hasStarted]);

  // Hàm xử lý khi user xác nhận mở hộp
  const handleConfirmOpen = () => {
    setShowConfirmPopup(false);
    setHasStarted(true);
    setShowAnimation(true);
    setIsApiComplete(false);

    // Gọi API mở hộp
    onOpenBox()
      .then((response) => {
        setReward(response);
        setIsApiComplete(true);
      })
      .catch((error) => {
        onError?.(error.message || "Không thể mở hộp quà");
        // Đóng animation khi có lỗi
        setShowAnimation(false);
        setIsApiComplete(false);
      });
  };

  // Hàm xử lý khi user hủy
  const handleCancelOpen = () => {
    setShowConfirmPopup(false);
    // Gọi onCancel nếu có, nếu không có thì không làm gì (chỉ đóng popup)
    onCancel?.();
  };

  return (
    <>
      {/* Popup xác nhận trước khi mở hộp */}
      <Dialog open={showConfirmPopup} onOpenChange={setShowConfirmPopup}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Xác nhận mở hộp quà</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn mở hộp quà {boxName ? `"${boxName}"` : "này"}?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelOpen}>
              Hủy
            </Button>
            <Button onClick={handleConfirmOpen}>
              Xác nhận mở hộp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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