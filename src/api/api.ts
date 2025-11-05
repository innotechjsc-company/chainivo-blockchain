import axios, { AxiosInstance, AxiosResponse } from "axios";

import { config } from "./config";
import { Phase } from "./services/phase-service";
import { LocalStorageService } from "@/services";

const api: AxiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = LocalStorageService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Biến để track việc refresh token đang diễn ra
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, đưa request vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token
        const response = await api.post(API_ENDPOINTS.AUTH.REFRESH);
        const { refreshedToken, exp, user } = response.data;

        // Lưu token mới vào LocalStorageService
        LocalStorageService.setToken(refreshedToken, exp);
        if (user) {
          LocalStorageService.setUserInfo(user);
        }

        // Update token cho các requests trong queue
        processQueue(null, refreshedToken);

        // Retry request gốc với token mới
        originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại -> clear storage và redirect
        processQueue(refreshError, null);
        LocalStorageService.clearAuthData();

        // Chỉ redirect nếu đang ở browser (không phải SSR)
        if (typeof window !== "undefined") {
          // window.location.href = "/auth?tab=login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/users/login",
    REGISTER: "/api/users",
    REFRESH: "/api/users/refresh-token",
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
    DETAIL_TEMPLATE: (id: string) => `/api/nft-template/${id}`,
    BUY: "/api/nft/marketplace/buy",
    MY_NFT: "/api/nft/my-nft",
    LIKE: "/api/nft/like",
    UNLIKE: "/api/nft/unlike",
    COMMENT: "/api/nft/comment",
    POST_FOR_SALE: "/api/nft-market/post-for-sale",
    P2P_LIST: "/api/nft-market/for-sale",
    LIST_INVESTMENT: "/api/investment-nft/list",
    BUY_INVESTMENT_NFT: "/api/investment-nft/buy-shares",
    DETAIL_INVESTMENT_NFT: (id: string) => `/api/investment-nft/${id}`,
    BUY_P2P: "/api/nft-market/buy",
    BUY_P2P_HISTORY_TRANSACTION: (id: string) =>
      `/api/nft/transaction-history/list?nftId=${id}`,
    INVESTMENT_NFT_HISTORY_TRANSACTION: (
      nftId: string
    ) => `/api/nft-investment-history?where[nft][equals]=${nftId}
`,
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
    DETAIL: (id: string) => `/api/mystery-boxes/${id}`,
    PURCHASE: "/api/mystery-box/purchase",
    BUY: "/api/mystery-box/buy",
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
    CHANGE_PASSWORD: "/api/user/change-password",
    UPDATE_PROFILE: "/api/user/update-profile",
  },
  ABOUT: {
    LEADERS: "/api/leadership-team",
    PARTNERS: "/api/about/partners",
    // ECOSYSTEM: "/api/about/ecosystem",
  },
} as const;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AvatarObject {
  id: string;
  url: string;
  filename: string;
  alt?: string;
  caption?: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  type: string;
}

export interface UpdateProfileResponse {
  userId: string;
  name?: string;
  avatar?: AvatarObject;
  avatarUrl?: string;  // Backend trả về cả avatarUrl string để dễ sử dụng
  updatedAt: string;
}
export interface ApiTransactionHistoryResponse<T = any> {
  docs?: T;
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

  static async postFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

  static async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.patch(endpoint, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
      };
    }
  }

  static async patchFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await api.patch(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        message: error.response?.data?.message || error.message,
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
