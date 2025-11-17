'use client';

import React, { useState, useRef, useEffect, cloneElement } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MysteryRewardsPreview from "./MysteryRewardsPreview";
import type { TokenReward, NFTReward } from "@/types/NFT";

interface MysteryRewardsPopoverProps {
  rewards?: {
    tokens?: TokenReward[];
    nfts?: NFTReward[];
  };
  className?: string;
  trigger?: React.ReactElement;
}

export default function MysteryRewardsPopover({
  rewards,
  className = '',
  trigger,
}: MysteryRewardsPopoverProps) {
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hàm xử lý khi hover vào
  const handleMouseEnter = () => {
    // Clear timeout nếu đang chờ đóng
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpen(true);
  };

  // Hàm xử lý khi rời chuột với delay 1s
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 1000); // Delay 1 giây
  };

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const rewardsCount = (rewards?.tokens?.length || 0) + (rewards?.nfts?.length || 0);

  if (rewardsCount === 0) {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400 italic">
        Mở hộp để nhận phần thưởng bất ngờ!
      </div>
    );
  }

  const defaultTrigger = (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
              inline-flex items-center gap-1 text-xs
              text-purple-600 dark:text-purple-400
              hover:text-purple-700 dark:hover:text-purple-300
              cursor-pointer transition-colors
              ${className}
            `}
    >
      <span>🎁</span>
      <span>{rewardsCount} thưởng</span>
    </span>
  );

  const triggerElement = trigger
    ? cloneElement(trigger, {
        onMouseEnter: (event: React.MouseEvent) => {
          trigger.props.onMouseEnter?.(event);
          handleMouseEnter();
        },
        onMouseLeave: (event: React.MouseEvent) => {
          trigger.props.onMouseLeave?.(event);
          handleMouseLeave();
        },
      })
    : defaultTrigger;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{triggerElement}</PopoverTrigger>

        <PopoverContent
          side="right"
          sideOffset={8}
          align="start"
          className="
            w-80 p-4 bg-white dark:bg-gray-800 shadow-xl
            border-2 border-purple-200 dark:border-purple-800
            z-50
            md:relative
            max-md:fixed
            max-md:left-1/2 max-md:-translate-x-1/2
            max-md:top-1/2 max-md:-translate-y-1/2
            max-md:w-[90vw] max-md:max-w-sm
          "
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <MysteryRewardsPreview rewards={rewards} />
        </PopoverContent>
      </Popover>
    </>
  );
}