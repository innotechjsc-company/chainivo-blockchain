import { Transaction } from "@/stores/types";
import { API_ENDPOINTS, ApiService } from "../api";
import type { ApiResponse } from "../api";

export interface Phase {
  createdAt: string;
  updatedAt: string;
  phaseId: number;
  name: string;
  description: string;
  pricePerToken: number;
  totalTokens: number;
  soldTokens: number;
  availableTokens: number;
  percentSold: number;
  percentRemaining: number;
  startDate: string;
  endDate: string;
  status: string;
  minBuyAmount: number;
  maxBuyAmount: number;
  totalInvestors: number;
  totalRaised: number;
  isWhitelistRequired: boolean;
  whitelistAddresses: string[];
  id: string;
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
  static async getPhases(): Promise<ApiResponse<Phase[]>> {
    // Delegates to ApiService endpoint mapping for investment phases
    return ApiService.getPhases();
  }
  static async getPhaseById(id: string): Promise<ApiResponse<Phase>> {
    return ApiService.getPhaseDetail(id);
  }

  static async getTransactionHistoryByPhaseId(
    id: string
  ): Promise<ApiResponse<Transaction[]>> {
    return ApiService.get(API_ENDPOINTS.TRANSACTION.GET_BY_PHASE_ID(id));
  }

  static async getNewTransactions(params: {
    phaseId: string;
    lastTransactionId?: string;
  }): Promise<ApiResponse<Transaction[]>> {
    return ApiService.get(
      API_ENDPOINTS.TRANSACTION.GET_NEW_TRANSACTIONS,
      params
    );
  }

  static async createInvestment(data: {
    phaseId: string;
    transactionHash: string;
  }): Promise<ApiResponse<any>> {
    // Use unified buy-token endpoint from ApiService
    const payload = {
      phaseId: data.phaseId,
      transactionHash: data.transactionHash,
    };
    return ApiService.buyToken(payload);
  }
  static async getALLInfoOfPhase(): Promise<ApiResponse<any[]>> {
    return ApiService.get(API_ENDPOINTS.INVESTMENT.GET_ALL_INFO_OF_PHASE);
  }
}

export default PhaseService;
