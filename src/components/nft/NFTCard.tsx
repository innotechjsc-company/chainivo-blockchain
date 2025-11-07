'use client';

import React from 'react';
import type { NFTItem } from '@/types/NFT';
import LevelBadge from './LevelBadge';
import NFTTypeBadge from './NFTTypeBadge';
import InvestmentProgressBar from './InvestmentProgressBar';
import CountdownTimer from './CountdownTimer';
import MysteryRewardsPreview from './MysteryRewardsPreview';
import { Button } from '@/components/ui/button';

interface NFTCardProps {
  nft: NFTItem;
  showActions?: boolean;
  onActionClick?: (nft: NFTItem, action: 'sell' | 'buy' | 'open') => void;
  className?: string;

  // Props de tuong thich nguoc voi NFTCard cu
  type?: 'tier' | 'other';
  onListForSale?: (nft: NFTItem) => void;
  onClick?: (id: string) => void;
}

// Map level sang border shadow color classes
const LEVEL_BORDER_CLASSES: Record<string, string> = {
  '1': 'border-gray-300 dark:border-gray-600 shadow-lg shadow-gray-500/50',
  '2': 'border-gray-400 dark:border-gray-500 shadow-lg shadow-gray-400/50',
  '3': 'border-yellow-400 dark:border-yellow-600 shadow-lg shadow-yellow-500/50',
  '4': 'border-purple-400 dark:border-purple-600 shadow-lg shadow-purple-500/50',
  '5': 'border-cyan-400 dark:border-cyan-600 shadow-lg shadow-cyan-500/50',
};

export default function NFTCard({
  nft,
  showActions = false,
  onActionClick,
  className = '',
  // Props tuong thich nguoc
  type,
  onListForSale,
  onClick,
}: NFTCardProps) {
  const borderClass = LEVEL_BORDER_CLASSES[nft.level] || LEVEL_BORDER_CLASSES['1'];

  // Neu co props cu (type, onListForSale, onClick), tu dong enable showActions
  const shouldShowActions = showActions || (type !== undefined);

  // Safety: Convert image to string neu la object
  const imageUrl = typeof nft.image === 'string'
    ? nft.image
    : (nft.image as any)?.url || '';

  // Fallback check for mystery box openable status
  const isMysteryBoxOpenable = nft.type === 'mysteryBox'
    ? (nft.isOpenable !== undefined
        ? nft.isOpenable  // Ưu tiên từ API transform
        : // Fallback: Check rewards structure
          Array.isArray(nft.rewards)
          ? // Raw array format từ API (chưa transform)
            nft.rewards.some((r: any) => r.isOpenable === true)
          : // Transformed object format
            (nft.rewards?.tokens?.length || nft.rewards?.nfts?.length)
            ? true
            : false)
    : false;

  // Debug mystery box
  if (nft.type === 'mysteryBox') {
    console.log('🎁 NFTCard Mystery Box:', {
      name: nft.name,
      'nft.isOpenable': nft.isOpenable,
      'calculated isOpenable': isMysteryBoxOpenable,
      rewards: nft.rewards,
      shouldShowActions: shouldShowActions,
    });
  }

  const handleAction = (e: React.MouseEvent, action: 'sell' | 'buy' | 'open') => {
    // Ngan chan event bubble len card parent (tranh trigger onClick cua card)
    e.stopPropagation();

    // Xu ly callback moi
    if (onActionClick) {
      onActionClick(nft, action);
    }

    // Xu ly callback cu (tuong thich nguoc)
    if (action === 'sell' && onListForSale) {
      onListForSale(nft);
    }
  };

  // Handler cho onClick cu
  const handleCardClick = () => {
    if (onClick) {
      onClick(nft.id);
    }
  };

  // Render action button dua vao type
  const renderActionButton = () => {
    if (!shouldShowActions) return null;

    switch (nft.type) {
      case 'mysteryBox':
        return (
          <Button
            onClick={(e) => handleAction(e, 'open')}
            disabled={!isMysteryBoxOpenable}
            className={`w-full ${
              isMysteryBoxOpenable
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:bg-gradient-to-r from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300'
                : ''
            }`}
            variant={isMysteryBoxOpenable ? 'default' : 'secondary'}
          >
            {isMysteryBoxOpenable ? (
              <span className="flex items-center gap-2">
                <span className="text-lg">🎁</span>
                <span>Mo hop qua</span>
                <span className="text-lg">✨</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>🔒</span>
                <span>Chua the mo</span>
              </span>
            )}
          </Button>
        );

      case 'investment':
        const isAvailable = (nft.availableShares ?? 0) > 0;
        const isExpired =
          nft.investmentEndDate &&
          new Date(nft.investmentEndDate).getTime() < Date.now();

        if (isExpired) {
          return (
            <Button className="w-full" disabled variant="secondary">
              Da het han
            </Button>
          );
        }

        return (
          <Button
            onClick={(e) => handleAction(e, 'buy')}
            disabled={!isAvailable}
            className="w-full"
          >
            {isAvailable ? '💰 Dau tu' : 'Da het co phan'}
          </Button>
        );

      case 'normal':
      case 'rank':
      default:
        if (nft.isSale) {
          return (
            <Button
              onClick={(e) => handleAction(e, 'buy')}
              className="w-full"
              variant="default"
            >
              Mua ngay
            </Button>
          );
        }
        return (
          <Button
            onClick={(e) => handleAction(e, 'sell')}
            className="w-full"
            variant="outline"
          >
            Dang ban
          </Button>
        );
    }
  };

  return (
    <div
      className={`
        rounded-xl border-2 overflow-hidden bg-white dark:bg-gray-900
        transition-all duration-300 hover:scale-[1.02]
        ${borderClass}
        ${nft.type === 'mysteryBox' && nft.isOpenable ? 'hover:shadow-2xl' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick ? handleCardClick : undefined}
    >
      {/* Badges overlay tren anh */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={nft.name}
          className="w-full h-56 object-cover"
        />

        {/* Badges tren goc trai */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <LevelBadge level={nft.level} />
          <NFTTypeBadge type={nft.type} />
        </div>

        {/* Status badges tren goc phai */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          {nft.isFeatured && (
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              ⭐ Noi bat
            </div>
          )}

          {/* Mystery Box: Hien thi trang thai mo hop */}
          {nft.type === 'mysteryBox' && isMysteryBoxOpenable && (
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
              ✨ San sang mo
            </div>
          )}

          {/* Cac loai NFT khac: Hien thi trang thai ban */}
          {nft.type !== 'mysteryBox' && nft.isSale && (
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500 text-white">
              Dang ban
            </div>
          )}

          {nft.isActive && (
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
              Hoat dong
            </div>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="p-4 space-y-3">
        {/* Ten NFT */}
        <h3 className="text-lg font-bold line-clamp-1 text-gray-900 dark:text-gray-100">
          {nft.name}
        </h3>

        {/* Mo ta */}
        {nft.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {nft.description}
          </p>
        )}

        {/* Mystery Box layout - rieng biet */}
        {nft.type === 'mysteryBox' ? (
          <div className="space-y-3">
            {/* Gia hop */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Gia hop:
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {nft.price}{' '}
                <span className="text-sm uppercase">{nft.currency}</span>
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Rewards preview */}
            {nft.rewards ? (
              <MysteryRewardsPreview rewards={nft.rewards} />
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                Mo hop de nhan phan thuong bat ngo!
              </div>
            )}

            {/* Action button */}
            {renderActionButton()}
          </div>
        ) : (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-3">
            {/* Gia cho cac loai NFT khac */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {nft.type === 'investment' ? 'Gia/co phan:' : 'Gia:'}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {nft.salePrice ?? nft.price}{' '}
                <span className="text-sm uppercase">{nft.currency}</span>
              </span>
            </div>

            {/* Investment-specific content */}
            {nft.type === 'investment' &&
              nft.totalShares &&
              nft.soldShares !== undefined &&
              nft.totalInvestors !== undefined &&
              nft.pricePerShare !== undefined && (
                <>
                  <InvestmentProgressBar
                    soldShares={nft.soldShares}
                    totalShares={nft.totalShares}
                    totalInvestors={nft.totalInvestors}
                    pricePerShare={nft.pricePerShare}
                    currency={nft.currency}
                  />
                  {nft.investmentEndDate && (
                    <CountdownTimer endDate={nft.investmentEndDate} />
                  )}
                </>
              )}

            {/* Stats cho Normal/Rank NFT */}
            {(nft.type === 'normal' || nft.type === 'rank') && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <span>👁️</span>
                  <span>{nft.viewsCount}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <span>{nft.isLike ? '❤️' : '🤍'}</span>
                  <span>{nft.likesCount}</span>
                </div>
              </div>
            )}

            {/* Action button */}
            {renderActionButton()}
          </div>
        )}
      </div>
    </div>
  );
}
