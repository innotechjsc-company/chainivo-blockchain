import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse } from "../api";

export interface Phase {
  phaseId: number;
  name: string;
  description?: string;
  price: number;
  totalTokens: number;
  soldTokens: number;
  availableTokens: number;
  percentSold: number;
  percentRemaining: number;
  status: string;
  startDate: string;
  endDate: string;
  minBuyAmount: number;
  maxBuyAmount: number;
  totalInvestors: number;
  totalRaised: number;
  isWhitelistRequired: boolean;
  bonusPercentage?: number;
}

export interface InvestmentData {
  phaseId: number;
  amount: number;
  walletAddress: string;
  paymentMethod?: string;
  investorEmail?: string;
}

export interface InvestmentResponse {
  transactionHash: string;
  tokensAllocated: number;
  status: string;
  investmentId: string;
}

export interface PhasesResponse {
  phases: Phase[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPhases: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class PhaseService {
  static async getPhases(): Promise<ApiResponse<PhasesResponse>> {
    return ApiService.get<PhasesResponse>(API_ENDPOINTS.PHASES.LIST);
  }

  static async getPhaseById(id: string): Promise<ApiResponse<Phase>> {
    return ApiService.get<Phase>(API_ENDPOINTS.PHASES.DETAIL(id));
  }

  static async createInvestment(data: InvestmentData): Promise<ApiResponse<InvestmentResponse>> {
    const backendData = {
      phaseId: data.phaseId,
      investmentAmount: data.amount,
      investorAddress: data.walletAddress,
      paymentMethod: data.paymentMethod || "USDT",
      paymentAmount: data.amount,
      paymentCurrency: "USD",
      investorEmail: data.investorEmail || "",
      status: "pending",
    };
    return ApiService.post<InvestmentResponse>(API_ENDPOINTS.PHASES.INVEST, backendData);
  }

  static async updatePhaseStatistics(data: {
    phaseId: number;
    tokensSold: number;
    amountRaised: number;
    transactionHash: string;
  }): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.UPDATE_PHASE_STATISTICS, data);
  }
}

export default PhaseService;
