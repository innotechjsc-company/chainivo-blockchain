import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse } from "../api";

export interface Phase {
  id: number;
  name: string;
  tokenPrice: number;
  totalTokens: number;
  soldTokens: number;
  startDate: string;
  endDate: string;
  status: string;
  minInvestment: number;
  maxInvestment: number;
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

export class PhaseService {
  static async getPhases(): Promise<ApiResponse<Phase[]>> {
    return ApiService.get<Phase[]>(API_ENDPOINTS.PHASES.LIST);
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
