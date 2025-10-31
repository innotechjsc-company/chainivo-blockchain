/**
 * AirdropClaim Model Types
 */

export type ClaimStatus = "pending" | "processing" | "completed" | "failed";

export interface IClaimData {
  userTokenBalance?: number;
  userNFTCount?: number;
  userStakingDays?: number;
  eligibilityChecked?: boolean;
}

export interface IAirdropClaim {
  // Airdrop reference
  airdropId: string;

  // User information
  userAddress: string;
  userId?: string;

  // Claim details
  claimedAmount: number;
  tokenSymbol: string;

  // Blockchain transaction
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: number;

  // Status
  status: ClaimStatus;

  // Merkle proof (for merkle tree airdrops)
  merkleProof: string[];

  // Metadata
  claimData: IClaimData;

  // Error handling
  errorMessage?: string;
  retryCount: number;

  // Timestamps
  claimedAt: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Instance Methods
  markAsCompleted(
    transactionHash: string,
    blockNumber: number,
    gasUsed: number
  ): Promise<IAirdropClaim>;
  markAsFailed(errorMessage: string): Promise<IAirdropClaim>;
}

export interface IAirdropStats {
  totalClaims: number;
  totalAmount: number;
  uniqueClaimers: number;
}

export interface IAirdropClaimModel {
  getUserClaims(userAddress: string): Promise<IAirdropClaim[]>;
  getAirdropStats(airdropId: string): Promise<IAirdropStats[]>;
}

export type AirdropClaimDocument = IAirdropClaim;
