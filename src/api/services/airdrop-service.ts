import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse } from "../api";

export interface AirdropCampaign {
  _id: string;
  name: string;
  description: string;
  tokenAmount: number;
  tokenSymbol: string;
  maxClaimPerUser: number;
  status: string;
  startDate: string;
  endDate: string;
  remainingAmount: number;
  totalSupply: number;
  claimedAmount: number;
  isActive: boolean;
}

export interface ParticipateData {
  campaignId: string;
  walletAddress: string;
  email?: string;
}

export interface ClaimData {
  campaignId: string;
  walletAddress: string;
  transactionHash?: string;
}

export interface UserClaim {
  _id: string;
  airdropId: string;
  claimedAmount: number;
  status: string;
  claimedAt: string;
  transactionHash?: string;
}

export class AirdropService {
  static async getCampaigns(): Promise<ApiResponse<AirdropCampaign[]>> {
    return ApiService.get<AirdropCampaign[]>(API_ENDPOINTS.AIRDROP.CAMPAIGNS);
  }

  static async participate(data: ParticipateData): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.AIRDROP.PARTICIPATE, data);
  }

  static async claim(data: ClaimData): Promise<ApiResponse<UserClaim>> {
    return ApiService.post<UserClaim>(API_ENDPOINTS.AIRDROP.CLAIM, data);
  }
}

export default AirdropService;
