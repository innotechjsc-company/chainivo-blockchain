/**
 * Services Index
 * Central export point for all API services
 */

// Export all services
export { AuthService } from "./auth-service";
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "./auth-service";

export { PhaseService } from "./phase-service";
export type {
  Phase,
  InvestmentData,
  InvestmentResponse,
} from "./phase-service";

export { NFTService } from "./nft-service";
export type { NFT, MintNFTData, TransferNFTData } from "./nft-service";

export { StakingService } from "./staking-service";
export type {
  StakingPool,
  StakeData,
  UnstakeData,
  UserStake,
} from "./staking-service";

export { AirdropService } from "./airdrop-service";
export type {
  AirdropCampaign,
  ParticipateData,
  ClaimData,
  UserClaim,
} from "./airdrop-service";

export { MysteryBoxService } from "./mystery-box-service";
export type {
  MysteryBox,
  PurchaseBoxData,
  OpenBoxData,
  BoxReward,
} from "./mystery-box-service";

export { InvestorService } from "./investor-service";
export type {
  InvestorStats,
  InvestmentHistory,
  InvestorPhase,
} from "./investor-service";

export { AnalyticsService } from "./analytics-service";
export type {
  AnalyticsOverview,
  PhaseAnalytics,
  InvestorAnalytics,
  NFTAnalytics,
  StakingAnalytics,
} from "./analytics-service";

export { WalletService } from "./wallet-service";
export type {
  WalletBalances,
  TransactionStatus,
  TokenPurchaseData,
} from "./wallet-service";

export { UserService } from "./user-service";

export { TransactionService } from "./transaction-service";
export type { GetTransactionHistoryParams } from "./transaction-service";

export { BenefitsDigiService } from "./benefits-digi";
export type { DigitizingBenefit, GetBenefitsParams } from "./benefits-digi";

export { SendRequestService } from "./send-request";
export type {
  SendDigitizationRequestData,
  DigitizationRequestResponse,
  DigitizationRequest,
} from "./send-request";

export { MediaService } from "./media-service";
export type { MediaUploadResponse } from "./media-service";

export { FeeService } from "./fee-service";
export type { SystemFeeConfig, GetSystemFeeResponse } from "./fee-service";
