import axios, { AxiosInstance, AxiosResponse } from "axios";

import { config } from "./config";
import { Phase } from "./services/phase-service";
import { LocalStorageService, ToastService } from "@/services";
import router from "next/router";
import { AuthService } from "./services/auth-service";

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

    // Neu loi 401 -> thu refresh token truoc khi logout
    if (error.response?.status === 401) {
      // Kiem tra xem co phai la refresh token request khong (tranh vong lap)
      const isRefreshTokenRequest = originalRequest.url?.includes(
        "/api/users/refresh-token"
      );

      // Neu la refresh token request ma van bi 401 -> token khong hop le, logout
      if (isRefreshTokenRequest) {
        try {
          LocalStorageService.clearAuthData();
        } catch {}
        if (typeof window !== "undefined") {
          ToastService.error(
            "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại để tiếp tục"
          );
          router.push("/auth?tab=login");
        }
        return Promise.reject(error);
      }

      // Neu request da duoc retry roi -> logout
      if (originalRequest._retry) {
        try {
          LocalStorageService.clearAuthData();
        } catch {}
        if (typeof window !== "undefined") {
          ToastService.error(
            "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại để tiếp tục"
          );
          router.push("/auth?tab=login");
        }
        return Promise.reject(error);
      }

      // Neu dang refresh token -> them request vao queue
      if (isRefreshing) {
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

      // Bat dau refresh token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Goi API refresh token
        const refreshSuccess = await AuthService.refreshToken();

        if (refreshSuccess) {
          // Refresh thanh cong -> lay token moi va retry request ban dau
          const newToken = LocalStorageService.getToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            // Process queue voi token moi
            processQueue(null, newToken);
            isRefreshing = false;
            // Retry request ban dau
            return api(originalRequest);
          }
        }

        // Refresh that bai -> logout
        processQueue(error, null);
        isRefreshing = false;
        try {
          LocalStorageService.clearAuthData();
        } catch {}
        if (typeof window !== "undefined") {
          ToastService.error(
            "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại để tiếp tục"
          );
          router.push("/auth?tab=login");
        }
        return Promise.reject(error);
      } catch (refreshError) {
        // Refresh that bai -> logout
        processQueue(refreshError, null);
        isRefreshing = false;
        try {
          LocalStorageService.clearAuthData();
        } catch {}
        if (typeof window !== "undefined") {
          ToastService.error(
            "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại để tiếp tục"
          );
          router.push("/auth?tab=login");
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const API_ENDPOINTS = {
  NOTIFICATION: {
    GET_MY_NOTIFICATIONS: "/api/notification/my-notifications",
    READ_ALL_NOTIFICATIONS: "/api/notification/read-all",
    READ_NOTIFICATION: (id: string) => `/api/notification/read/${id}`,
  },
  AUTH: {
    LOGIN: "/api/users/login",
    REGISTER: "/api/users",
    REFRESH: "/api/users/refresh-token",
    LOGOUT: "/api/users/logout",
    WITH_AUTH: "/api/with-auth",
  },

  DIGITAL_REQUEST: {
    LIST: "/api/digitization-request/send-request",
    DETAIL: "/api/digitization-request/my-request",
    CONFIRM: "/api/digitization-request/user-confirm",
  },

  INVESTMENT: {
    PHASES: "/api/investment/phases",
    PHASE_DETAIL: (id: string) => `/api/investment/phases/${id}`,
    BUY_TOKEN: "/api/investment/buy-token",
    GET_ALL_INFO_OF_PHASE: "/api/home/statistic-can",
  },

  NFT: {
    LIST: "/api/nft/marketplace/for-sale",
    DETAIL: (id: string) => `/api/nft/${id}`,
    INFO: `/api/nft/analytic`,
    DETAIL_TEMPLATE: (id: string) => `/api/nft-template/${id}`,
    BUY: "/api/nft/marketplace/buy",
    MY_NFT: "/api/nft/my-nft",
    // So huu NFT
    OWNERSHIP_LIST: "/api/nft-ownership",
    MY_OWNERSHIP: "/api/nft-ownership/my",
    OWNERSHIP_DETAIL: (id: string) => `/api/nft-ownership/${id}`,
    LIKE: "/api/nft/like",
    UNLIKE: "/api/nft/unlike",
    COMMENT: "/api/nft/comment",
    POST_FOR_SALE: "/api/nft-market/post-for-sale",
    CAN_FOR_SALE: "/api/nft-market/cancel-sale",
    P2P_LIST: "/api/nft-market/for-sale",
    LIST_INVESTMENT: "/api/investment-nft/list",
    BUY_INVESTMENT_NFT: "/api/investment-nft/buy-shares",
    DETAIL_INVESTMENT_NFT: (id: string) => `/api/investment-nft/${id}`,
    BUY_P2P: "/api/nft-market/buy",
    BUY_P2P_HISTORY_TRANSACTION: (id: string) =>
      `/api/nft/transaction-history/list?nftId=${id}`,
    INVESTMENT_NFT_HISTORY_TRANSACTION: (nftId: string) =>
      `/api/nft-investment-history?where[nft][equals]=${nftId}`,
    OPEN_BOX: "/api/nft/open-box",
    Mint_NFT_BLOCKCHAIN: "/api/nft/mint-to-blockchain",
    SHARE_DETAIL: (nftId: string) =>
      `/api/investment-nft/share-details?nftId=${nftId}`,
    CHECK_OWNERSHIP: (nftId: string, walletAddress: string) =>
      `/api/nft-market/check-owner-nft?tokenId=${nftId}&walletAddress=${walletAddress}`,
  },

  STAKING: {
    POOLS: "/api/staking/pools",
    POOL_DETAIL: (id: string) => `/api/staking/${id}`,
    STAKE: "/api/staking/stake",
    UNSTAKE: (stakeId: string) => `/api/staking/unstake/${stakeId}`,
    CLAIM: (stakeId: string) => `/api/staking/claim/${stakeId}`,
    USER_STAKES: (userId: string) => `/api/staking/user-stakes/${userId}`,
  },

  FEE: {
    GET_FEE: "/api/globals/system-fees",
  },

  BENEFITS: {
    LIST: "/api/benefits-digi",
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
    GET_PROFILE: "/api/users/me",
    GET_ME: "/api/users/me",
  },
  ABOUT: {
    LEADERS: "/api/leadership-team",
    PARTNERS: "/api/about/partners",
    // ECOSYSTEM: "/api/about/ecosystem",
  },

  TRANSACTION: {
    LIST: "/api/list-transaction",
    TRANSACTION_HISTORY: "/api/investment/get-transactions",
    GET_BY_PHASE_ID: (phaseId: string) =>
      `/api/investment/get-transactions/${phaseId}`,
    GET_NEW_TRANSACTIONS: "/api/investment/get-transactions/new-transaction",
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

// Rank object khi populate tu relationship
export interface RankObject {
  id: string;
  name: string;
  requiredPoints: number;
  benefits?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Day du response tu /api/users/me (PayloadCMS)
export interface UserMeResponse {
  user: {
    id: string;
    email: string;
    collection: string;
    _strategy: string;
    _verified?: boolean;

    // Thong tin co ban
    name?: string;
    avatar?: string | AvatarObject; // Co the la ID hoac object neu depth > 0
    bio?: string;

    // Thong tin vi
    walletAddress?: string;

    // Vai tro & Quyen han
    role: string; // 'user' | 'investor' | 'creator' | 'moderator' | 'admin'

    // Trang thai xac minh
    isEmailVerified?: boolean;
    isKYCVerified?: boolean;
    isWalletVerified?: boolean;

    // Trang thai tai khoan
    isActive?: boolean;
    isSuspended?: boolean;
    suspensionReason?: string;

    // Theo doi dang nhap
    lastLogin?: string;

    // Ma gioi thieu
    refCode?: string;

    // Rank & Points
    rank?: string | RankObject; // Co the la ID hoac object neu depth > 0
    points?: number;

    // Timestamps
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
  exp?: number;
}

// Simplified user profile cho app su dung
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string; // Da parse tu avatar.url
  bio?: string;
  walletAddress?: string;
  role: string;
  isEmailVerified?: boolean;
  isKYCVerified?: boolean;
  isWalletVerified?: boolean;
  isActive?: boolean;
  isSuspended?: boolean;
  suspensionReason?: string;
  lastLogin?: string;
  refCode?: string;
  rank?: RankObject; // Da parse neu co
  rankId?: string; // ID cua rank neu chua populate
  points?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileResponse {
  userId: string;
  name?: string;
  avatar?: AvatarObject;
  avatarUrl?: string; // Backend trả về cả avatarUrl string để dễ sử dụng
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

  static async postFormData<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    try {
      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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

  static async patchFormData<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    try {
      const response = await api.patch(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
