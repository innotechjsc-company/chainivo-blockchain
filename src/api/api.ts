import axios, { AxiosInstance, AxiosResponse } from "axios";

import { config } from "./config";
import { Phase } from "./services/phase-service";

const API_BASE_URL = config.API_BASE_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("jwt_exp");
      localStorage.removeItem("user_info");
      window.location.href = "/auth?tab=login";
    }
    return Promise.reject(error);
  }
);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/users/login",
    REGISTER: "/api/users",
    REFRESH: "/api/users/refresh",
    LOGOUT: "/api/users/logout",
    WITH_AUTH: "/api/with-auth",
  },

  INVESTMENT: {
    PHASES: "/api/investment/phases",
    PHASE_DETAIL: (id: string) => `/api/investment/phases/${id}`,
    BUY_TOKEN: "/api/investment/buy-token",
  },

  NFT: {
    LIST: "/api/nft/marketplace/for-sale",
    DETAIL: (id: string) => `/api/nft/${id}`,
    BUY: "/api/nft/marketplace/buy",
    MY_NFT: "/api/nft/my-nft",
    LIKE: "/api/nft/like",
    UNLIKE: "/api/nft/unlike",
    COMMENT: "/api/nft/comment",
  },

  STAKING: {
    POOLS: "/api/staking/pools",
    POOL_DETAIL: (id: string) => `/api/staking/${id}`,
    STAKE: "/api/staking/stake",
    UNSTAKE: (stakeId: string) => `/api/staking/unstake/${stakeId}`,
    CLAIM: (stakeId: string) => `/api/staking/claim/${stakeId}`,
    USER_STAKES: (userId: string) => `/api/staking/user-stakes/${userId}`,
  },

  AIRDROP: {
    LIST: "/api/airdrop/list",
    CLAIM: (id: string) => `/api/airdrop/claim/${id}`,
  },

  MYSTERY_BOX: {
    LIST: "/api/mystery-box/list",
    OPEN: "/api/mystery-box/open",
  },

  LEADERSHIP_TEAM: {
    GET: "/api/leadership-team",
  },

  BALANCE: {
    GET_BALANCE: (walletAddress: string) =>
      `/api/balance/get-balance/${walletAddress}`,
  },

  MEDIA: {
    UPLOAD: "/api/media",
  },

  USER: {
    CONNECT_WALLET: "/api/connect-wallet",
    UPDATE_USER_PROFILE: "/api/users/profile",
  },
} as const;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiService {
  static async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.get(endpoint, { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  static async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.post(endpoint, data);

      // Handle Payload CMS direct response format (for auth endpoints)
      if (response.data && !("success" in response.data)) {
        return {
          success: true,
          data: response.data,
        };
      }

      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  static async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  static async getPhases(): Promise<ApiResponse<Phase[]>> {
    return this.get(API_ENDPOINTS.INVESTMENT.PHASES);
  }

  static async getPhaseDetail(id: string): Promise<ApiResponse<Phase>> {
    return this.get(API_ENDPOINTS.INVESTMENT.PHASE_DETAIL(id));
  }

  static async buyToken(data: {
    phaseId: string;
    transactionHash: string;
  }): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.INVESTMENT.BUY_TOKEN, data);
  }

  static async getWalletBalance(
    walletAddress: string
  ): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.BALANCE.GET_BALANCE(walletAddress));
  }

  static async getNFTList(): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.NFT.LIST);
  }

  static async getNFTDetail(id: string): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.NFT.DETAIL(id));
  }

  static async buyNFT(data: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.NFT.BUY, data);
  }

  static async getMyNFTs(): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.NFT.MY_NFT);
  }

  static async likeNFT(data: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.NFT.LIKE, data);
  }

  static async unlikeNFT(data: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.NFT.UNLIKE, data);
  }

  static async commentNFT(data: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.NFT.COMMENT, data);
  }

  static async getStakingPools(): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.STAKING.POOLS);
  }

  static async getStakingPoolDetail(id: string): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.STAKING.POOL_DETAIL(id));
  }

  static async stake(data: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.STAKING.STAKE, data);
  }

  static async unstake(stakeId: string, data?: any): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.STAKING.UNSTAKE(stakeId), data);
  }

  static async claimStakingRewards(stakeId: string): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.STAKING.CLAIM(stakeId));
  }

  static async getUserStakes(userId: string): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.STAKING.USER_STAKES(userId));
  }

  static async getAirdropList(): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.AIRDROP.LIST);
  }

  static async claimAirdrop(id: string): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.AIRDROP.CLAIM(id));
  }
}

export default api;
