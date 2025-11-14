import { ApiService, API_ENDPOINTS } from "../api";
import { LocalStorageService } from "@/services";
import { UserService } from "./user-service";

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
    _verified: boolean;
    createdAt: string;
    updatedAt: string;
    name?: string;
    walletAddress?: string;
    role?: string;
    avatarUrl?: string;
    bio?: string;

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

    // Ma gioi thieu & Rank
    refCode?: string;
    rank?: any; // RankObject hoac string ID
    rankId?: string;
    points?: number;
  };
  token: string;
  exp: number;
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

          // Goi API getCurrentUserProfile de lay day du thong tin user tu backend
          // Bao gom avatar, refCode, points, rank, va cac trang thai xac minh
          let fullUserProfile = null;

          try {
            const profileResponse = await UserService.getCurrentUserProfile();

            if (profileResponse.success && profileResponse.data) {
              fullUserProfile = profileResponse.data;
            }
          } catch (error) {
            console.warn("Khong the lay profile day du:", error);
            // Van tiep tuc login, chi thieu mot so thong tin bo sung
          }

          // Store user info with all fields including avatar URL, refCode, points, rank
          const userInfo = fullUserProfile || {
            id: authData.user.id,
            email: authData.user.email,
            name: authData.user.name || "",
            walletAddress: authData.user.walletAddress || "",
            role: authData.user.role || "user",
            avatarUrl: authData.user.avatarUrl || "",
            createdAt: authData.user.createdAt,
            updatedAt: authData.user.updatedAt,
          };

          this.setUserInfo(userInfo);

          // Return authData voi day du thong tin user de frontend nhan duoc
          return {
            ...authData,
            user: {
              ...authData.user,
              ...userInfo,
            },
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
