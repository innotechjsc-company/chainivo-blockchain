/**
 * Staking Types
 * TypeScript types for staking functionality
 */

// ============= Staking Coin Types =============

export interface StakingCoin {
  id: string;
  userId: string;
  amountStaked: number;
  rewards: number;
  apy: number;
  stakedAt: string;
  lockedUntil: string;
  status: "active" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateStakingCoinRequest {
  amountStaked: number;
  apy?: number;
  lockPeriod?: number; // in days
}

export interface StakingCoinResponse {
  success: boolean;
  data: StakingCoin;
  message?: string;
}

// ============= Staking NFT Types =============

export interface StakingNFT {
  id: string;
  userId: string;
  nftId: string;
  nftName: string;
  nftValue: number;
  nftImage?: string;
  rewards: number;
  apy: number;
  stakedAt: string;
  lockedUntil: string;
  status: "active" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateStakingNFTRequest {
  nftId: string;
  nftName: string;
  nftValue: number;
  nftImage?: string;
  apy?: number;
  lockPeriod?: number; // in days
}

export interface StakingNFTResponse {
  success: boolean;
  data: StakingNFT;
  message?: string;
}

// ============= Staking Stats Types =============

export interface StakingStats {
  totalCoinStaked: number;
  totalCoinRewards: number;
  totalNFTValue: number;
  totalNFTRewards: number;
  totalActiveStakes: number;
  averageAPY: number;
}

export interface StakingStatsResponse {
  success: boolean;
  data: StakingStats;
}

// ============= Staking Actions Types =============

export interface ClaimRewardsRequest {
  stakeId: string;
  type: "coin" | "nft";
}

export interface ClaimRewardsResponse {
  success: boolean;
  data: {
    rewardsClaimed: number;
    newBalance: number;
  };
  message?: string;
}

export interface CancelStakeRequest {
  stakeId: string;
  type: "coin" | "nft";
}

export interface CancelStakeResponse {
  success: boolean;
  data: {
    amountReturned: number;
    rewardsClaimed: number;
    newBalance: number;
  };
  message?: string;
}

// ============= Available NFT Types =============

export interface AvailableNFT {
  id: string;
  name: string;
  value: number;
  image?: string;
  description?: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
  collection?: string;
}

// ============= Staking Configuration Types =============

export interface StakingConfig {
  coinAPY: number;
  nftAPY: number;
  minStakeAmount: number;
  maxStakeAmount: number;
  lockPeriod: number; // in days
  claimCooldown: number; // in hours
}

// ============= Staking History Types =============

export interface StakingHistory {
  id: string;
  type: "coin" | "nft";
  action: "stake" | "claim" | "cancel";
  amount: number;
  rewards?: number;
  timestamp: string;
  status: "success" | "failed" | "pending";
  txHash?: string;
}

export interface StakingHistoryResponse {
  success: boolean;
  data: StakingHistory[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============= Reward Calculation Types =============

export interface RewardCalculation {
  stakeAmount: number;
  apy: number;
  daysPassed: number;
  currentRewards: number;
  projectedRewards: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

// ============= Staking Pool Types =============

export interface StakingPool {
  id: string;
  name: string;
  type: "coin" | "nft";
  apy: number;
  totalStaked: number;
  totalRewards: number;
  participants: number;
  status: "active" | "paused" | "closed";
  minStakeAmount: number;
  maxStakeAmount?: number;
  lockPeriod: number;
  description?: string;
}

export interface StakingPoolResponse {
  success: boolean;
  data: StakingPool[];
}
