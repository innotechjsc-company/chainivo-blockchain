/**
 * Airdrop Model Types
 */

export type AirdropStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";
export type TokenSymbol = "CAN" | "ETH" | "USDC";

export interface IEligibilityCriteria {
  minTokenBalance: number;
  minStakingDays: number;
  mustHoldNFT: boolean;
  mustBeActiveUser: boolean;
  mustShareSocial: boolean;
  whitelistOnly: boolean;
  whitelistAddresses: string[];
}

export interface IAirdrop {
  // Thông tin airdrop
  name: string;
  description: string;

  // Token details
  tokenAmount: number;
  tokenSymbol: TokenSymbol;

  // Airdrop configuration
  totalSupply: number;
  claimedAmount: number;
  remainingAmount: number;

  // Timing
  startDate: Date;
  endDate: Date;

  // Status
  status: AirdropStatus;

  // Eligibility criteria
  eligibilityCriteria: IEligibilityCriteria;

  // Claim configuration
  maxClaimPerUser: number;
  claimCooldown: number; // hours

  // Smart contract details
  contractAddress?: string;
  merkleRoot?: string;

  // Statistics
  totalClaims: number;
  uniqueClaimers: number;

  // Admin info
  createdBy: string;

  // Metadata
  metadata?: Map<string, string>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  isActive?: boolean;
  percentClaimed?: number;
  isExpired?: boolean;

  // Instance Methods
  canUserClaim(
    userAddress: string,
    userTokenBalance: number,
    userNFTCount: number,
    userStakingDays: number
  ): {
    canClaim: boolean;
    reason: string;
  };
}

export interface IAirdropModel {
  getActiveAirdrops(): Promise<IAirdrop[]>;
}

export type AirdropDocument = IAirdrop;
