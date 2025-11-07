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

  // Props để tương thích ngược với NFTCard cũ
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

  // Nếu có props cũ (type, onListForSale, onClick), tự động enable showActions
  const shouldShowActions = showActions || (type !== undefined);

  // Safety: Convert image to string nếu là object
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
    // Ngăn chặn event bubble lên card parent (tránh trigger onClick của card)
    e.stopPropagation();

    // Xử lý callback mới
    if (onActionClick) {
      onActionClick(nft, action);
    }

    // Xử lý callback cũ (tương thích ngược)
    if (action === 'sell' && onListForSale) {
      onListForSale(nft);
    }
  };

  // Handler cho onClick cũ
  const handleCardClick = () => {
    if (onClick) {
      onClick(nft.id);
    }
  };

  // Render action button dựa vào type
  const renderActionButton = () => {
    if (!shouldShowActions) return null;

    switch (nft.type) {
      case 'mysteryBox':
        return (
          <Button
            onClick={(e) => handleAction(e, 'open')}
            disabled={!isMysteryBoxOpenable}
            className={`
              inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
              transition-all disabled:pointer-events-none disabled:opacity-50
              [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
              outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
              aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
              h-9 px-4 py-2 has-[>svg]:px-3 w-full gap-2 cursor-pointer
              ${isMysteryBoxOpenable
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:bg-primary/90 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}
          >
            {isMysteryBoxOpenable ? (
              <>
                <span className="text-lg">🎁</span>
                <span>Mở hộp quà</span>
                <span className="text-lg">✨</span>
              </>
            ) : (
              <>
                <span>🔒</span>
                <span>Chưa thể mở</span>
              </>
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
            <Button
              disabled
              className="
                inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                transition-all disabled:pointer-events-none disabled:opacity-50
                outline-none h-9 px-4 py-2 w-full gap-2
                bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400
              "
            >
              Đã hết hạn
            </Button>
          );
        }

        return (
          <Button
            onClick={(e) => handleAction(e, 'buy')}
            disabled={!isAvailable}
            className={`
              inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
              transition-all disabled:pointer-events-none disabled:opacity-50
              [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
              outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
              aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
              h-9 px-4 py-2 has-[>svg]:px-3 w-full gap-2 cursor-pointer
              ${isAvailable
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:bg-primary/90 text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}
          >
            {isAvailable ? '💰 Đầu tư' : 'Đã hết cổ phần'}
          </Button>
        );

      case 'normal':
      case 'rank':
      default:
        if (nft.isSale) {
          // NFT đã đăng bán -> hiển thị button "Xem chi tiết"
          return (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                // Dùng onClick callback để xem chi tiết NFT
                if (onClick) {
                  onClick(nft.id);
                }
              }}
              className="
                inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                transition-all disabled:pointer-events-none disabled:opacity-50
                [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
                outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
                aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
                hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full gap-2
                bg-gradient-to-r from-cyan-500 to-purple-500 text-white cursor-pointer
              "
            >
              Xem chi tiết
            </Button>
          );
        }
        // NFT đang sở hữu -> hiển thị button đăng bán
        return (
          <Button
            onClick={(e) => handleAction(e, 'sell')}
            className="
              inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
              transition-all disabled:pointer-events-none disabled:opacity-50
              [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
              outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
              aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
              h-9 px-4 py-2 has-[>svg]:px-3 w-full gap-2 cursor-pointer
              bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white
            "
          >
            Đăng bán
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
      {/* Badges overlay trên ảnh */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={nft.name}
          className="w-full h-56 object-cover"
        />

        {/* Badges trên góc trái */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <LevelBadge level={nft.level} />
          <NFTTypeBadge type={nft.type} />
        </div>

        {/* Status badges trên góc phải */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          {nft.isFeatured && (
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              ⭐ Nổi bật
            </div>
          )}

          {/* Mystery Box: Hiển thị trạng thái mở hộp */}
          {nft.type === 'mysteryBox' && isMysteryBoxOpenable && (
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
              ✨ Sẵn sàng mở
            </div>
          )}

          {/* Các loại NFT khác: Hiển thị trạng thái bán */}
          {nft.type !== 'mysteryBox' && nft.isSale && (
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500 text-white">
              Đang bán
            </div>
          )}

          {nft.isActive && (
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
              Hoạt động
            </div>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="p-4 space-y-3">
        {/* Tên NFT */}
        <h3 className="text-lg font-bold line-clamp-1 text-gray-900 dark:text-gray-100">
          {nft.name}
        </h3>

        {/* Mô tả */}
        {nft.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {nft.description}
          </p>
        )}

        {/* Mystery Box layout - riêng biệt */}
        {nft.type === 'mysteryBox' ? (
          <div className="space-y-3">
            {/* Giá hộp */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Giá hộp:
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
                Mở hộp để nhận phần thưởng bất ngờ!
              </div>
            )}

            {/* Action button */}
            {renderActionButton()}
          </div>
        ) : (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-3">
            {/* Giá cho các loại NFT khác */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {nft.type === 'investment' ? 'Giá/cổ phần:' : 'Giá:'}
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
