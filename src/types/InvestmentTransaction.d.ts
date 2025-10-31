/**
 * InvestmentTransaction Model Types
 */

export type PaymentMethod = "USDT" | "ETH" | "BTC" | "BUSD" | "USDC";
export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "approved"
  | "rejected";

export interface IInvestmentTransaction {
  // Thông tin giao dịch
  transactionHash?: string;
  transactionId: string;

  // Thông tin phase
  phaseId: number;

  // Thông tin nhà đầu tư
  investorAddress: string;
  investorEmail?: string;

  // Chi tiết đầu tư
  investmentAmount: number;
  tokensBought: number;
  pricePerToken: number;

  // Thông tin thanh toán
  paymentMethod: PaymentMethod;
  paymentAmount: number;
  paymentCurrency: string;

  // Trạng thái giao dịch
  status: TransactionStatus;

  // Blockchain info
  blockNumber?: number;
  gasUsed?: number;
  gasPrice?: number;
  blockchainTransactionHash?: string;
  usdtTransactionHash?: string;

  // Metadata
  metadata?: Map<string, string>;

  // Timestamps
  transactionDate: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Approval fields
  approvedAt?: Date;
  approvedBy?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
  notes?: string;

  // Virtuals
  totalValue?: number;
  isSuccessful?: boolean;
  isPending?: boolean;

  // Instance Methods
  markAsCompleted(
    blockNumber: number,
    gasUsed: number,
    gasPrice: number
  ): Promise<IInvestmentTransaction>;
  markAsFailed(): Promise<IInvestmentTransaction>;
  cancel(): Promise<IInvestmentTransaction>;
}

export interface ITopInvestor {
  _id: string;
  totalAmount: number;
  totalTokens: number;
  transactionCount: number;
}

export interface IInvestorStats {
  totalInvested: number;
  totalTokens: number;
  totalTransactions: number;
  uniquePhases: number;
}

export interface IDailyStats {
  _id: string;
  transactions: number;
  amount: number;
  tokens: number;
}

export interface IPaymentMethodStats {
  _id: PaymentMethod;
  count: number;
  totalAmount: number;
  percentage: number;
}

export interface IInvestmentTransactionModel {
  getInvestorTransactions(
    investorAddress: string,
    limit?: number
  ): Promise<IInvestmentTransaction[]>;
  getPhaseTransactions(
    phaseId: number,
    limit?: number
  ): Promise<IInvestmentTransaction[]>;
  getTotalInvestmentsByPhase(phaseId: number): Promise<any[]>;
  getInvestorStats(investorAddress: string): Promise<any[]>;
  getDailyStatsByPhase(phaseId: number, days?: number): Promise<IDailyStats[]>;
  getTopInvestorsByPhase(
    phaseId: number,
    limit?: number
  ): Promise<ITopInvestor[]>;
  getPaymentMethodStatsByPhase(phaseId: number): Promise<IPaymentMethodStats[]>;
}

export type InvestmentTransactionDocument = IInvestmentTransaction;
