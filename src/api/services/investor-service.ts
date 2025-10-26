import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse } from "../api";

export interface InvestorStats {
  address: string;
  totalInvested: number;
  totalTokens: number;
  activeInvestments: number;
  completedInvestments: number;
  pendingInvestments: number;
  totalRewards: number;
  joinedDate: string;
}

export interface InvestmentHistory {
  id: string;
  phaseId: number;
  phaseName: string;
  amount: number;
  tokensReceived: number;
  status: string;
  transactionHash: string;
  createdAt: string;
  completedAt?: string;
}

export interface InvestorPhase {
  phaseId: number;
  phaseName: string;
  investedAmount: number;
  tokensAllocated: number;
  status: string;
}

export class InvestorService {
  static async getInvestorStats(address: string): Promise<ApiResponse<InvestorStats>> {
    return ApiService.get<InvestorStats>(API_ENDPOINTS.INVESTOR.STATS(address));
  }

  static async getInvestmentHistory(address: string): Promise<ApiResponse<InvestmentHistory[]>> {
    return ApiService.get<InvestmentHistory[]>(API_ENDPOINTS.INVESTOR.HISTORY(address));
  }

  static async getInvestorPhases(address: string): Promise<ApiResponse<InvestorPhase[]>> {
    return ApiService.get<InvestorPhase[]>(API_ENDPOINTS.INVESTOR.PHASES(address));
  }
}

export default InvestorService;
