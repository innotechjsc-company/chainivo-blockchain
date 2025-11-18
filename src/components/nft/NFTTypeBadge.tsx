"use client";

import React from "react";
import type { NFTType } from "@/types/NFT";

interface TypeConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

const TYPE_CONFIGS: Record<NFTType, TypeConfig> = {
  normal: {
    label: "NFT thường",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    icon: "🖼️",
  },
  rank: {
    label: "NFT hạng",
    color: "text-emerald-700 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    icon: "🏆",
  },
  mysteryBox: {
    label: "NFT hộp bí ẩn",
    color: "text-pink-700 dark:text-pink-400",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    icon: "🎁",
  },
  investment: {
    label: "NFT đầu tư",
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    icon: "💰",
  },
};

interface NFTTypeBadgeProps {
  type: NFTType;
  className?: string;
}

export default function NFTTypeBadge({
  type,
  className = "",
}: NFTTypeBadgeProps) {
  // Fallback to "normal" if config not found
  const config = TYPE_CONFIGS[type] || TYPE_CONFIGS["normal"];

  // Log warning if type is not valid
  if (!TYPE_CONFIGS[type]) {
    console.warn(
      `[NFTTypeBadge] Invalid type: "${type}" (type: ${typeof type}). Falling back to "normal".`
    );
  }

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${config.color} ${config.bgColor}
        ${className}
      `}
    >
      <span>{config.label}</span>
    </div>
  );
}
