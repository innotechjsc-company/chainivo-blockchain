import { ApiService, API_ENDPOINTS } from "../api";
import { LocalStorageService } from "@/services";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface RegisterResponse {
  message: string;
  doc: {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    role?: string;
    isEmailVerified?: boolean;
    isKYCVerified?: boolean;
    isWalletVerified?: boolean;
    isActive?: boolean;
    username?: string;
    walletAddress?: string;
  };
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    _verified?: boolean;
    createdAt: string;
    updatedAt: string;
    name?: string;
    walletAddress?: string;
    role?: string;
    bio?: string;

    // Avatar co the la Object hoac String
    avatar?: {
      id: string;
      url: string;
      alt?: string;
      filename?: string;
      mimeType?: string;
      width?: number;
      height?: number;
      thumbnailURL?: string | null;
    };
    avatarUrl?: string;

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
    sessions?: any[]; // Khong luu vao localStorage

    // Ma gioi thieu & Rank
    refCode?: string;
    rank?: any; // RankObject hoac string ID
    rankId?: string;
    points?: number;

    // User stats
    childrenCount?: number;
    totalInvestmentAmount?: number;
    totalNFTCount?: number;
  };
  token: string;
  exp: number;
}

/**
 * Helper function de transform raw user data tu backend ve format AuthUser cua frontend
 * Xu ly cac truong hop:
 * - avatar object -> avatarUrl string
 * - rank object -> giu nguyen
 * - loai bo sessions (bao mat + tiet kiem dung luong)
 */
function transformUserData(rawUser: any): any {
  return {
    id: rawUser.id,
    email: rawUser.email,
    name: rawUser.name || '',
    walletAddress: rawUser.walletAddress || '',
    role: rawUser.role || 'user',

    // Transform avatar tu Object -> String URL
    avatarUrl: rawUser.avatar?.url || rawUser.avatarUrl || '',

    // Rank (giu nguyen object)
    rank: rawUser.rank,
    rankId: rawUser.rank?.id || rawUser.rankId,

    // User stats
    points: rawUser.points || 0,
    refCode: rawUser.refCode || '',
    childrenCount: rawUser.childrenCount || 0,
    totalInvestmentAmount: rawUser.totalInvestmentAmount || 0,
    totalNFTCount: rawUser.totalNFTCount || 0,

    // Verification status
    isEmailVerified: rawUser.isEmailVerified || false,
    isKYCVerified: rawUser.isKYCVerified || false,
    isWalletVerified: rawUser.isWalletVerified || false,

    // Account status
    isActive: rawUser.isActive !== false, // Default true
    isSuspended: rawUser.isSuspended || false,
    suspensionReason: rawUser.suspensionReason,

    // Timestamps
    lastLogin: rawUser.lastLogin,
    createdAt: rawUser.createdAt,
    updatedAt: rawUser.updatedAt,

    // Bio (neu co)
    bio: rawUser.bio,

    // KHONG luu sessions (rui ro bao mat + ton dung luong)
  };
}

export class AuthService {
  static getToken(): string | null {
    return LocalStorageService.getToken();
  }

  static setToken(token: string, exp?: number): void {
    LocalStorageService.setToken(token, exp);
  }

  static removeToken(): void {
    LocalStorageService.removeToken();
  }

  static getTokenExpiration(): number | null {
    return LocalStorageService.getTokenExpiration();
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Check stored expiration first
      const storedExp = this.getTokenExpiration();
      const currentTime = Date.now() / 1000;

      if (storedExp && storedExp < currentTime) {
        this.removeToken();
        return false;
      }

      // Fallback to JWT payload if no stored exp
      if (!storedExp) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp && payload.exp < currentTime) {
          this.removeToken();
          return false;
        }
      }

      return true;
    } catch (error) {
      this.removeToken();
      return false;
    }
  }

  static getUserInfo(): {
    id: string;
    email: string;
    name: string;
    walletAddress: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
  } | null {
    // Get user info from LocalStorageService (stored during login)
    const userInfo = LocalStorageService.getUserInfo();
    if (userInfo) {
      return userInfo as any;
    }

    // Fallback to token parsing
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.userId || payload.id,
        email: payload.email || "",
        name: payload.name || "",
        walletAddress: payload.walletAddress || "",
        role: payload.role || "user",
        createdAt: payload.createdAt,
        updatedAt: payload.updatedAt,
      };
    } catch (error) {
      console.error("Failed to parse user info from token:", error);
      return null;
    }
  }

  static setUserInfo(user: any): void {
    LocalStorageService.setUserInfo(user);
  }

  static removeUserInfo(): void {
    LocalStorageService.removeUserInfo();
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // Handle new Payload CMS response format
      if (response.data) {
        const authData = response.data as AuthResponse;
        if (authData.token && authData.user) {
          // Store token with expiration
          this.setToken(authData.token, authData.exp);

          // Transform raw user data tu backend ve format frontend
          // Xu ly avatar object -> avatarUrl string, loai bo sessions, v.v.
          const transformedUser = transformUserData(authData.user);

          // Store transformed user info vao LocalStorage
          this.setUserInfo(transformedUser);

          // Return authData voi transformed user data
          return {
            ...authData,
            user: transformedUser,
          };
        }
      }

      throw new Error("Đăng nhập thất bại");
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await ApiService.post<RegisterResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );

      // Handle Payload CMS response format for register
      if (response.data) {
        const registerData = response.data as RegisterResponse;

        if (registerData.doc && registerData.doc.email) {
          // Registration successful - user needs to login separately
          console.log("User registered successfully:", registerData.doc.email);
          return registerData;
        }
      }

      throw new Error("Đăng ký thất bại");
    } catch (error: any) {
      console.error("Register error:", error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await ApiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all auth data including wallet
      LocalStorageService.clearAuthData();
    }
  }

  static async refreshToken(): Promise<boolean> {
    try {
      const response = await ApiService.post<{ token: string }>(
        API_ENDPOINTS.AUTH.REFRESH
      );

      if (response.success && response.data) {
        this.setToken(response.data.token);
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  static hasRole(role: string): boolean {
    const userInfo = this.getUserInfo();
    if (!userInfo) return false;

    return userInfo.role === role;
  }
}

export default AuthService;
