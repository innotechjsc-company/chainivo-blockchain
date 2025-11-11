'use client';

import React from 'react';
import type { TokenReward, NFTReward } from '@/types/NFT';
import LevelBadge from './LevelBadge';

interface MysteryRewardsPreviewProps {
  rewards?: {
    tokens?: TokenReward[];
    nfts?: NFTReward[];
  };
  className?: string;
}

export default function MysteryRewardsPreview({
  rewards,
  className = '',
}: MysteryRewardsPreviewProps) {
  if (!rewards || (!rewards.tokens?.length && !rewards.nfts?.length)) {
    return (
      <div className={`text-xs text-gray-500 dark:text-gray-400 ${className}`}>
        Không có thông tin phần thưởng 
      </div>
    );
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
        <span>🎁</span>
        <span>Phần thưởng tiềm năng:</span>
      </div>

      <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
        {/* Token rewards */}
        {rewards.tokens?.map((token, index) => (
          <div
            key={`token-${index}`}
            className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">💰</span>
              <div className="flex flex-col">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {token.minAmount}-{token.maxAmount}{' '}
                  <span className="uppercase">{token.currency}</span>
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Token rewards
                </span>
              </div>
            </div>
            {token.probability && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-[10px] font-semibold">
                <span>🎯</span>
                <span>{token.probability}%</span>
              </div>
            )}
          </div>
        ))}

        {/* NFT rewards */}
        {rewards.nfts?.map((nft, index) => (
          <div
            key={`nft-${index}`}
            className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🖼️</span>
              <div className="flex flex-col">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {nft.name}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  NFT rewards
                </span>
              </div>
            </div>
            {nft.probability && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-[10px] font-semibold">
                <span>🎯</span>
                <span>{nft.probability}%</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Total rewards count */}
      <div className="text-[10px] text-center text-gray-500 dark:text-gray-400">
        {(rewards.tokens?.length || 0) + (rewards.nfts?.length || 0)} loại phần thưởng
      </div>
    </div>
  );
}
