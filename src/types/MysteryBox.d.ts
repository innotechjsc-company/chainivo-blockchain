/**
 * MysteryBox Model Types
 */

export type BoxType =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type Currency = "CAN" | "USDT" | "USDC" | "ETH";
export type RewardType = "NFT" | "Token" | "Special" | "Bonus";
export type BoxStatus =
  | "available"
  | "purchased"
  | "opened"
  | "expired"
  | "sold_out";
export type Network = "ethereum" | "polygon" | "bsc" | "arbitrum";

export interface IPrice {
  amount: number;
  currency: Currency;
}

export interface IRewardTypeConfig {
  type: RewardType;
  probability: number;
  value: any;
}

export interface IRewardPool {
  totalRewards: number;
  distributedRewards: number;
  rewardTypes: IRewardTypeConfig[];
}

export interface IDropRates {
  common: number;
  uncommon: number;
  rare: number;
  epic: number;
  legendary: number;
}

export interface IFeatures {
  guaranteedRarity: "none" | Rarity;
  bonusRewards: boolean;
  specialEffects: boolean;
  limitedEdition: boolean;
}

export interface IOwner {
  address?: string;
  username?: string;
  purchaseDate?: Date;
  purchasePrice?: IPrice;
}

export interface IReward {
  type: RewardType;
  name?: string;
  description?: string;
  value: any;
  rarity?: Rarity;
  metadata?: any;
  timestamp: Date;
}

export interface IStats {
  views: number;
  purchases: number;
  opens: number;
  averageRewardValue: number;
  totalRewardValue: number;
}

export interface IBlockchain {
  contractAddress?: string;
  tokenId?: number;
  transactionHash?: string;
  blockNumber?: number;
  network: Network;
}

export interface IAttribute {
  trait_type: string;
  value: any;
  rarity?: Rarity;
}

export interface IMysteryBox {
  // Basic Box Information
  boxId: number;
  boxTypeId: number;
  name: string;
  description?: string;

  // Box Configuration
  boxType: BoxType;
  rarity: Rarity;
  tier: number;

  // Pricing and Cost
  price: IPrice;
  originalPrice: IPrice;

  // Supply and Availability
  totalSupply: number;
  availableSupply: number;
  soldSupply: number;

  // Time-based Availability
  saleStartDate: Date;
  saleEndDate: Date;
  isActive: boolean;

  // Reward Pool Configuration
  rewardPool: IRewardPool;

  // Drop Rates
  dropRates: IDropRates;

  // Visual and Media
  image: string;
  animation?: string;
  glowColor?: string;

  // Special Features
  features: IFeatures;

  // Ownership and Purchase
  owner: IOwner;

  // Box Status
  status: BoxStatus;
  isOpened: boolean;
  openDate?: Date;

  // Rewards Received
  rewards: IReward[];

  // Statistics
  stats: IStats;

  // Blockchain Information
  blockchain: IBlockchain;

  // Metadata and Attributes
  metadata?: Map<string, any>;
  attributes: IAttribute[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  remainingSupply?: number;
  soldPercentage?: string;
  isOnSale?: boolean;
  isSoldOut?: boolean;
  discountPercentage?: string;

  // Instance Methods
  addView(): Promise<IMysteryBox>;
  purchase(
    ownerAddress: string,
    username: string,
    purchasePrice: IPrice
  ): Promise<IMysteryBox>;
  open(): Promise<IMysteryBox>;
  addReward(reward: IReward): Promise<IMysteryBox>;
}

export interface IMysteryBoxModel {
  findAvailable(): Promise<IMysteryBox[]>;
  findByOwner(address: string): Promise<IMysteryBox[]>;
  findByType(boxType: BoxType): Promise<IMysteryBox[]>;
  findByRarity(rarity: Rarity): Promise<IMysteryBox[]>;
  findOnSale(): Promise<IMysteryBox[]>;
  findByPriceRange(
    minPrice: number,
    maxPrice: number,
    currency?: Currency
  ): Promise<IMysteryBox[]>;
}

export type MysteryBoxDocument = IMysteryBox;
