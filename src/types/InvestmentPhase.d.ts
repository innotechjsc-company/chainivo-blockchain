/**
 * InvestmentPhase Model Types
 */

export type PhaseStatus =
  | "draft"
  | "upcoming"
  | "active"
  | "inactive"
  | "completed"
  | "paused";

export interface IInvestmentPhase {
  // Thông tin cơ bản của phase
  phaseId: number;
  name: string;
  description?: string;

  // Cấu hình giá và token
  pricePerToken: number;
  totalTokens: number;
  soldTokens: number;

  // Thời gian
  startDate: Date;
  endDate: Date;

  // Trạng thái
  status: PhaseStatus;

  // Cấu hình mua
  minBuyAmount: number;
  maxBuyAmount: number;

  // Thống kê
  totalInvestors: number;
  totalRaised: number;

  // Cấu hình bổ sung
  isWhitelistRequired: boolean;
  whitelistAddresses: string[];

  // Metadata
  metadata?: Map<string, string>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  availableTokens?: number;
  percentSold?: number;
  percentRemaining?: number;
  isActive?: boolean;
  isCompleted?: boolean;

  // Instance Methods
  canInvest(
    amount: number,
    walletAddress: string
  ): {
    canInvest: boolean;
    reason: string;
  };
  calculateTokensForAmount(usdAmount: number): number;
  updateStats(
    investmentAmount: number,
    tokensBought: number
  ): Promise<IInvestmentPhase>;
}

export interface IInvestmentPhaseModel {
  getActivePhase(): Promise<IInvestmentPhase | null>;
  getUpcomingPhases(): Promise<IInvestmentPhase[]>;
  getCompletedPhases(): Promise<IInvestmentPhase[]>;
}

export type InvestmentPhaseDocument = IInvestmentPhase;
