'use client';

import React from 'react';
import type { NFTLevel } from '@/types/NFT';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LevelConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
}

const LEVEL_CONFIGS: Record<NFTLevel, LevelConfig> = {
  '1': {
    label: 'Thuong',
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-600',
    icon: '⚪',
    description: 'Cap do Thuong - NFT co ban',
  },
  '2': {
    label: 'Bac',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-200 dark:bg-gray-700',
    borderColor: 'border-gray-400 dark:border-gray-500',
    icon: '⚫',
    description: 'Cap do Bac - NFT kha hiem',
  },
  '3': {
    label: 'Vang',
    color: 'text-yellow-700 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-400 dark:border-yellow-600',
    icon: '🟡',
    description: 'Cap do Vang - NFT hiem',
  },
  '4': {
    label: 'Bach kim',
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    borderColor: 'border-purple-400 dark:border-purple-600',
    icon: '🟣',
    description: 'Cap do Bach kim - NFT rat hiem',
  },
  '5': {
    label: 'Kim cuong',
    color: 'text-cyan-700 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    borderColor: 'border-cyan-400 dark:border-cyan-600',
    icon: '💎',
    description: 'Cap do Kim cuong - NFT cuc hiem',
  },
};

interface LevelBadgeProps {
  level: NFTLevel;
  showTooltip?: boolean;
  className?: string;
}

export default function LevelBadge({
  level,
  showTooltip = true,
  className = '',
}: LevelBadgeProps) {
  const config = LEVEL_CONFIGS[level];

  const badge = (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
        ${config.color} ${config.bgColor} ${config.borderColor}
        ${className}
      `}
    >
      <span className="text-sm">{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
