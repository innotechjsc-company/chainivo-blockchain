/**
 * TokenConfiguration Model Types
 */

export interface IPriceHistory {
  price: number;
  timestamp: Date;
  change: number;
  volume: number;
}

export interface IPhasePrice {
  price: number;
  startDate: Date;
  endDate: Date;
}

export interface IPhasePricing {
  phase1: IPhasePrice;
  phase2: IPhasePrice;
  phase3: IPhasePrice;
}

export interface ISocialLinks {
  telegram?: string;
  twitter?: string;
  discord?: string;
  github?: string;
}

export interface ITokenConfiguration {
  // Thông tin token cơ bản
  tokenSymbol: string;
  tokenName: string;

  // Cấu hình giá
  currentPrice: number;
  priceHistory: IPriceHistory[];

  // Cấu hình phase pricing
  phasePricing: IPhasePricing;

  // Cấu hình mua bán
  minBuyAmount: number;
  maxBuyAmount: number;
  maxBuyPerTransaction: number;

  // Cấu hình tokenomics
  totalSupply: number;
  circulatingSupply: number;
  reservedForSale: number;
  teamTokens: number;
  marketingTokens: number;
  liquidityTokens: number;

  // Cấu hình bổ sung
  isTradingEnabled: boolean;
  isStakingEnabled: boolean;
  stakingAPY: number;

  // Metadata
  description?: string;
  website?: string;
  whitepaper?: string;
  socialLinks: ISocialLinks;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  availableForSale?: number;
  percentSold?: number;
  percentRemaining?: number;
  marketCap?: number;
  getCurrentPhasePrice?: number;

  // Instance Methods
  calculateTokensForAmount(usdAmount: number): number;
  updateCirculatingSupply(tokensToAdd: number): Promise<ITokenConfiguration>;
  getTokenomicsBreakdown(): {
    totalSupply: number;
    circulatingSupply: number;
    reservedForSale: number;
    teamTokens: number;
    marketingTokens: number;
    liquidityTokens: number;
    availableForSale: number;
    percentSold: number;
    percentRemaining: number;
  };
}

export interface ITokenConfigurationModel {
  getCurrentPrice(): Promise<number | null>;
  updatePrice(
    newPrice: number,
    volume?: number
  ): Promise<ITokenConfiguration | null>;
  getPriceHistory(days?: number): Promise<IPriceHistory[]>;
}

export type TokenConfigurationDocument = ITokenConfiguration;
