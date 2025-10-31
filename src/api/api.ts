import axios, { AxiosInstance, AxiosResponse } from "axios";

import { config } from "./config";

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
  },

  PHASES: {
    LIST: "/api/digitalize/phases",
    DETAIL: (id: string) => `/api/digitalize/phases/${id}`,
    INVEST: "/api/digitalize/invest",
  },

  INVESTOR: {
    STATS: (address: string) => `/api/digitalize/investor/${address}`,
    HISTORY: (address: string) => `/api/digitalize/investor/${address}/history`,
    PHASES: (address: string) => `/api/digitalize/investor/${address}/phases`,
  },

  ANALYTICS: {
    OVERVIEW: "/api/digitalize/analytics/overview",
    PHASES: "/api/digitalize/analytics/phases",
    INVESTORS: "/api/digitalize/analytics/investors",
    NFTS: "/api/digitalize/analytics/nfts",
    STAKING: "/api/digitalize/analytics/staking",
  },

  NFT: {
    ALL: "/api/nft/marketplace/for-sale",
    LIST: "/api/nft/marketplace/for-sale",
    DETAIL: (id: string) => `/api/nft/${id}`,
    TRANSFER: "/api/nft/marketplace/buy",
    OWNER: (address: string) => `/api/nft/owner/${address}`,
    COMMENTS: (id: string) => `api/nft/${id}/comment`,
  },

  MYSTERY_BOX: {
    LIST: "/api/digitalize/mystery-boxes",
    OPEN: "/api/digitalize/mystery-boxes/open",
    PURCHASE: "/api/digitalize/mystery-boxes/purchase",
  },

  RANK: {
    LIST: "/api/ranks",
    MY_RANK: "/api/ranks/user/:userId",
    BUY: "/api/ranks/buy",
  },

  STAKING: {
    POOLS: "/api/staking/pools",
    POOL_DETAIL: "/api/staking/pools/:id",
    STAKE: "/api/staking/stake",
    UNSTAKE: "/api/staking/unstake",
    REWARDS: "/api/staking/claim",
    GETBYOWNER: (userId: string) => `/api/staking/user-stakes/${userId}`,
  },

  AIRDROP: {
    CAMPAIGNS: "/api/digitalize/airdrop/campaigns",
    PARTICIPATE: "/api/digitalize/airdrop/participate",
    CLAIM: "/api/digitalize/airdrop/claim",
  },
  USER: {
    UPDATE_WALLET_ADDRESS: "/api/connect-wallet",
    UPDATE_USER_PROFILE: "/api/users/profile",
  },
  GET_WALLET_USDT_BALANCE: "/api/digitalize/token/usdt-balance",
  GET_WALLET_POL_BALANCE: "/api/digitalize/token/pol-balance",
  GET_WALLET_CAN_BALANCE: "/api/digitalize/token/can-balance",
  TEST_TOKEN: "/api/digitalize/test/token",
  UPDATE_TRANSACTION_STATUS: "/api/digitalize/update-transaction-status",
  UPDATE_PHASE_STATISTICS: "/api/digitalize/update-phase-statistics",
  GET_WALLET_BALANCES: "/api/digitalize/wallet-balances",
  EXECUTE_TOKEN_PURCHASE: "/api/digitalize/execute-purchase",
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

  static async getTestToken(): Promise<ApiResponse<{ token: string }>> {
    return this.get(API_ENDPOINTS.TEST_TOKEN);
  }

  static async getPhases(): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.PHASES.LIST);
  }

  static async createInvestment(data: {
    phaseId: number;
    amount: number;
    walletAddress: string;
  }): Promise<ApiResponse<any>> {
    const backendData = {
      phaseId: data.phaseId,
      investmentAmount: data.amount,
      investorAddress: data.walletAddress,
      paymentMethod: "USDT",
      paymentAmount: data.amount,
      paymentCurrency: "USD",
      investorEmail: "",
      status: "pending",
    };
    return this.post(API_ENDPOINTS.PHASES.INVEST, backendData);
  }

  static async getInvestorStats(address: string): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.INVESTOR.STATS(address));
  }

  static async getAnalyticsOverview(): Promise<ApiResponse<any>> {
    return this.get(API_ENDPOINTS.ANALYTICS.OVERVIEW);
  }

  static async updateTransactionStatus(data: {
    transactionHash: string;
    status: string;
    blockchainTxHash?: string;
  }): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.UPDATE_TRANSACTION_STATUS, data);
  }

  static async updatePhaseStatistics(data: {
    phaseId: number;
    tokensSold: number;
    amountRaised: number;
    transactionHash: string;
  }): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.UPDATE_PHASE_STATISTICS, data);
  }

  static async getWalletBalances(
    address: string,
    network: string
  ): Promise<ApiResponse<any>> {
    return this.get(
      `${API_ENDPOINTS.GET_WALLET_BALANCES}?address=${address}&network=${network}`
    );
  }

  static async executeTokenPurchase(data: {
    phaseId: number;
    amount: number;
    walletAddress: string;
    network: string;
    usdtTransactionHash?: string;
  }): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.EXECUTE_TOKEN_PURCHASE, data);
  }
}

export default api;
