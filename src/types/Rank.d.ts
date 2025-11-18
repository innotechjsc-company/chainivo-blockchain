/**
 * Rank Types
 * Type definitions cho Rank/Membership tier system
 */

// Image object từ PayloadCMS
export interface RankImage {
  id: string;
  url: string;
  filename: string;
  alt?: string;
  type: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX?: number;
  focalY?: number;
  thumbnailURL?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Điều kiện để đạt rank
export interface RankCondition {
  id: string;
  minPoints: number;
  minChildrenCount: number;
  minNFTCount: number;
  totalInvestmentAmount: number;
}

// Quyền lợi của rank
export interface RankBenefit {
  id: string;
  type: 'bonus-phase' | 'bonus-airdrop' | 'bonus-staking' | 'reduce-transaction-fee' | 'other';
  valueType: 'percentage' | 'fixed';
  description: string;
  value: number;
}

// Rank object đầy đủ từ API
export interface Rank {
  id: string;
  name: string;
  level: string;
  description: string;
  price: number;
  image: RankImage;
  conditions: RankCondition[];
  benefits: RankBenefit[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Pagination object
export interface RankPagination {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Response từ API GET /api/rank/list
export interface RankListResponse {
  data: Rank[];
  pagination: RankPagination;
}

// Request body cho API POST /api/rank/buy
export interface BuyRankData {
  rankId: string;
  transactionHash: string;
}

// Response từ API POST /api/rank/buy
export interface BuyRankResponse {
  rank: Rank;
  user: {
    id: string;
    email: string;
    rank: {
      id: string;
      name: string;
      level: string;
    };
  };
  transactionHash: string | null;
}

// Query params cho getRanks
export interface GetRanksParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  level?: string;
  search?: string;
  sortBy?: 'name' | 'level' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
