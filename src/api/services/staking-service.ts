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

  static async stakeShares(
    stakeId: string,
    nftSharesId?: string,
    nftId?: string,
    transactionHash?: string
  ): Promise<ApiResponse<UserStake>> {
    return ApiService.post<UserStake>(API_ENDPOINTS.STAKING.STAKE, {
      stakeId,
      nftSharesId,
      nftId,
      transactionHash,
    });
  }

  static async stakeCan(
    stakeId: string,
    transactionHash?: string
  ): Promise<ApiResponse<UserStake>> {
    return ApiService.post<UserStake>(API_ENDPOINTS.STAKING.STAKE, {
      stakeId,
      transactionHash,
    });
  }

  static async stakeNFT(
    stakeId: string,
    nftId?: string
  ): Promise<ApiResponse<UserStake>> {
    return ApiService.post<UserStake>(API_ENDPOINTS.STAKING.STAKE, {
      stakeId,
      nftId,
    });
  }

  static async unstake(id: string): Promise<ApiResponse<any>> {
    return ApiService.post(`${API_ENDPOINTS.STAKING.UNSTAKE(id)}`);
  }

  static async getRewards(id: string): Promise<ApiResponse<any>> {
    return ApiService.post(`${API_ENDPOINTS.STAKING.CLAIM(id)}`);
  }
  static async getStakesByOwner(usedId: string): Promise<ApiResponse<any>> {
    return ApiService.get(`${API_ENDPOINTS.STAKING.USER_STAKES(usedId)}`);
  }
}

export default StakingService;
