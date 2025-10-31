/**
 * Staking Model Types
 */

export type StakeStatus = "active" | "completed" | "cancelled";

export interface IStakingPool {
  // Basic Information
  name: string;
  description?: string;

  // Pool Configuration
  apy: number;
  lockPeriod: number; // days, 0 for flexible pools
  minStake: number;
  maxStake: number;

  // Pool Statistics
  totalStaked: number;
  totalStakers: number;
  isActive: boolean;

  // Contract Information
  contractAddress?: string;
  tokenAddress: string;

  // Tier Information
  tierLevel: number;
  tierName: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserStake {
  // User and Pool Information
  userId: string;
  poolId: string;

  // Stake Details
  amount: number;
  stakedAt: Date;
  lockUntil: Date;
  isLocked: boolean;

  // Rewards
  totalRewards: number;
  claimedRewards: number;
  pendingRewards: number;

  // Transaction Information
  transactionHash?: string;
  status: StakeStatus;
  lastRewardCalculation: Date;

  // Virtuals
  totalEarned?: number;
  remainingLockTime?: number;

  // Instance Methods
  calculatePendingRewards(): number;
  canUnlock(): boolean;
}

export interface IStakingModels {
  StakingPool: IStakingPool;
  UserStake: IUserStake;
}

export type StakingPoolDocument = IStakingPool;
export type UserStakeDocument = IUserStake;
