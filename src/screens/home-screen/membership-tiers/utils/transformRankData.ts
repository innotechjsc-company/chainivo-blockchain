import { Crown, Star, Zap, Gem } from 'lucide-react';
import type { Rank, RankBenefit } from '@/types/Rank';

/**
 * UI Tier type cho MembershipTiers component
 */
export interface UITier {
  id: string;
  name: string;
  icon: any;
  color: string;
  points: string;
  benefits: string[];
  popular: boolean;
  price: number;
  level: string;
  imageUrl?: string;
}

/**
 * Format benefit từ API thành text hiển thị
 * Khớp với các options trong admin form
 */
export const formatBenefitText = (benefit: RankBenefit): string => {
  const { type, valueType, description, value } = benefit;

  // Nếu có description và không phải là số thuần túy, ưu tiên sử dụng description
  if (description && description.trim() && isNaN(Number(description))) {
    return description;
  }

  // Generate text dựa trên type và value
  let prefix = '';
  switch (type) {
    case 'bonus-phase':
      prefix = 'Bonus đầu tư phase';
      break;
    case 'bonus-airdrop':
      prefix = 'Bonus airdrop';
      break;
    case 'bonus-staking':
      prefix = 'Bonus staking';
      break;
    case 'reduce-transaction-fee':
      prefix = 'Giảm phí giao dịch NFT đầu tư';
      break;
    default:
      prefix = 'Quyền lợi đặc biệt';
  }

  // Format value theo valueType
  if (valueType === 'percentage') {
    return `${prefix} +${value}%`;
  } else if (valueType === 'fixed') {
    return `${prefix} ${value}`;
  } else {
    return `${prefix} ${value}`;
  }
};

/**
 * Lấy icon component theo level
 */
export const getRankIcon = (level: string) => {
  const levelNum = parseInt(level);

  switch (levelNum) {
    case 1:
      return Star; // Bronze
    case 2:
      return Zap; // Silver
    case 3:
      return Crown; // Gold
    case 4:
    case 5:
      return Gem; // Platinum/Diamond
    default:
      return Star;
  }
};

/**
 * Lấy gradient color theo level
 */
export const getRankColor = (level: string): string => {
  const levelNum = parseInt(level);

  switch (levelNum) {
    case 1:
      return 'from-amber-700 to-amber-900'; // Bronze
    case 2:
      return 'from-gray-400 to-gray-600'; // Silver
    case 3:
      return 'from-yellow-400 to-yellow-600'; // Gold
    case 4:
      return 'from-cyan-400 to-blue-600'; // Platinum
    case 5:
      return 'from-cyan-400 to-purple-600'; // Diamond
    default:
      return 'from-gray-400 to-gray-600';
  }
};

/**
 * Format price thành string với dấu phẩy
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN');
};

/**
 * Xác định xem rank có phải là popular không
 * Popular: Level 3 (Gold) hoặc có thể custom theo logic khác
 */
export const isPopularRank = (level: string): boolean => {
  return level === '3'; // Gold tier
};

/**
 * Map Rank API data sang UI Tier format
 */
export const mapRankToTier = (rank: Rank): UITier => {
  // Transform benefits array
  const benefits = rank.benefits.map((benefit) => formatBenefitText(benefit));

  return {
    id: rank.id,
    name: rank.name,
    icon: getRankIcon(rank.level),
    color: getRankColor(rank.level),
    points: formatPrice(rank.price),
    benefits,
    popular: isPopularRank(rank.level),
    price: rank.price,
    level: rank.level,
    imageUrl: rank.image?.url,
  };
};

/**
 * Transform array of Ranks sang array of UI Tiers
 */
export const transformRanksToTiers = (ranks: Rank[]): UITier[] => {
  // Sort theo level trước khi transform
  const sortedRanks = [...ranks].sort(
    (a, b) => parseInt(a.level) - parseInt(b.level)
  );

  return sortedRanks.map((rank) => mapRankToTier(rank));
};
