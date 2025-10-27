/**
 * MysteryBoxType Model Types
 */

export type TierName = "Thường" | "Đồng" | "Bạc" | "Vàng" | "Kim Cương";
export type TierLevel = 1 | 2 | 3 | 4 | 5;
export type Currency = "CAN" | "ETH" | "USDC";
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface IPrice {
  amount: number;
  currency: Currency;
}

export interface IDropRates {
  common: number;
  uncommon: number;
  rare: number;
  epic: number;
  legendary: number;
}

export interface ITierAttributes {
  color?: string;
  borderColor?: string;
  glowColor?: string;
  specialEffects?: string[];
  bonusMultiplier: number;
}

export interface ICollection {
  name: string;
  contractAddress: string;
}

export interface IMysteryBoxType {
  // Basic Information
  name: string;
  description: string;

  // Vietnamese tier names
  tierName: TierName;
  tierLevel: TierLevel;

  // Pricing
  price: IPrice;
  rarity: Rarity;

  // Drop rates for 5 tiers
  dropRates: IDropRates;

  // Tier-specific attributes
  tierAttributes: ITierAttributes;

  // Supply
  maxSupply: number; // -1 means unlimited
  currentSupply: number;
  isActive: boolean;

  // Media
  image: string;

  // Collection
  collection: ICollection;

  // Admin
  createdBy: string;
  updatedBy?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  remainingSupply?: string | number;

  // Instance Methods
  canOpen(): boolean;
  incrementSupply(): Promise<IMysteryBoxType>;
  getRandomRarity(): Rarity;
}

export type MysteryBoxTypeDocument = IMysteryBoxType;
