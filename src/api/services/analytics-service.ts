import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse } from "../api";

export interface AnalyticsOverview {
  totalInvestors: number;
  totalInvested: number;
  totalTokensSold: number;
  activePhases: number;
  totalNFTs: number;
  totalStaked: number;
  totalRewards: number;
}

export interface PhaseAnalytics {
  phaseId: number;
  phaseName: string;
  totalInvested: number;
  tokensSold: number;
  investorsCount: number;
  progress: number;
  status: string;
}

export interface InvestorAnalytics {
  totalInvestors: number;
  activeInvestors: number;
  topInvestors: Array<{
    address: string;
    totalInvested: number;
    tokensOwned: number;
  }>;
  investmentsByDate: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
}

export interface NFTAnalytics {
  totalNFTs: number;
  totalMinted: number;
  totalTransferred: number;
  topCollectors: Array<{
    address: string;
    nftCount: number;
  }>;
}

export interface StakingAnalytics {
  totalStaked: number;
  totalStakers: number;
  averageStakeAmount: number;
  totalRewardsPaid: number;
  stakingPools: Array<{
    poolId: string;
    poolName: string;
    totalStaked: number;
    stakersCount: number;
  }>;
}

export class AnalyticsService {
  // static async getOverview(): Promise<ApiResponse<AnalyticsOverview>> {
  //   return ApiService.get<AnalyticsOverview>(API_ENDPOINTS.ANALYTICS.OVERVIEW);
  // }
  // static async getPhaseAnalytics(): Promise<ApiResponse<PhaseAnalytics[]>> {
  //   return ApiService.get<PhaseAnalytics[]>(API_ENDPOINTS.ANALYTICS.PHASES);
  // }
  // static async getInvestorAnalytics(): Promise<ApiResponse<InvestorAnalytics>> {
  //   return ApiService.get<InvestorAnalytics>(API_ENDPOINTS.ANALYTICS.INVESTORS);
  // }
  // static async getNFTAnalytics(): Promise<ApiResponse<NFTAnalytics>> {
  //   return ApiService.get<NFTAnalytics>(API_ENDPOINTS.ANALYTICS.NFTS);
  // }
  // static async getStakingAnalytics(): Promise<ApiResponse<StakingAnalytics>> {
  //   return ApiService.get<StakingAnalytics>(API_ENDPOINTS.ANALYTICS.STAKING);
  // }
}

export default AnalyticsService;
