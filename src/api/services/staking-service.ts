import { ApiService, API_ENDPOINTS } from "../api";
import type { ApiResponse } from "../api";

export interface StakingPool {
  id: string;
  name: string;
  tokenSymbol: string;
  apy: number;
  totalStaked: number;
  minStakeAmount: number;
  maxStakeAmount: number;
  lockPeriod: number;
  isActive: boolean;
  rewards: number;
}

export interface StakeData {
  poolId: string;
  amount: number;
  walletAddress: string;
  transactionHash?: string;
  blockNumber?: string;
}

export interface UnstakeData {
  stakeId: string;
  amount: number;
  walletAddress: string;
  transactionHash?: string;
}

export interface UserStake {
  id: string;
  poolId: string;
  amount: number;
  startDate: string;
  endDate: string;
  rewards: number;
  status: string;
}

export class StakingService {
  static async getPools(): Promise<ApiResponse<StakingPool[]>> {
    return ApiService.get<StakingPool[]>(API_ENDPOINTS.STAKING.POOLS);
  }

  static async stake(data: StakeData): Promise<ApiResponse<UserStake>> {
    return ApiService.post<UserStake>(API_ENDPOINTS.STAKING.STAKE, data);
  }

  static async unstake(data: UnstakeData): Promise<ApiResponse<any>> {
    return ApiService.post(API_ENDPOINTS.STAKING.UNSTAKE, data);
  }

  static async getRewards(walletAddress: string): Promise<ApiResponse<any>> {
    return ApiService.get(
      `${API_ENDPOINTS.STAKING.REWARDS}?address=${walletAddress}`
    );
  }
  static async getStakesByOwner(usedId: string): Promise<ApiResponse<any>> {
    return ApiService.get(`${API_ENDPOINTS.STAKING.GETBYOWNER(usedId)}`);
  }
}

export default StakingService;
