'use client';

import React from 'react';
import type { NFTType } from '@/types/NFT';

interface TypeConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

const TYPE_CONFIGS: Record<NFTType, TypeConfig> = {
  normal: {
    label: 'Normal',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: '🖼️',
  },
  rank: {
    label: 'Rank',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    icon: '🏆',
  },
  mysteryBox: {
    label: 'Mystery Box',
    color: 'text-pink-700 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    icon: '🎁',
  },
  investment: {
    label: 'Investment',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    icon: '💰',
  },
};

interface NFTTypeBadgeProps {
  type: NFTType;
  className?: string;
}

export default function NFTTypeBadge({ type, className = '' }: NFTTypeBadgeProps) {
  const config = TYPE_CONFIGS[type];

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${config.color} ${config.bgColor}
        ${className}
      `}
    >
      <span className="text-sm">{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
}
