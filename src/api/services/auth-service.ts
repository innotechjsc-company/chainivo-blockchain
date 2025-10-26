import { ApiService, API_ENDPOINTS } from "../api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  walletAddress: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      username: string;
      walletAddress: string;
      role: string;
      permissions: string[];
    };
  };
  message?: string;
}

export class AuthService {
  static getToken(): string | null {
    return localStorage.getItem("jwt_token");
  }

  static setToken(token: string): void {
    localStorage.setItem("jwt_token", token);
  }

  static removeToken(): void {
    localStorage.removeItem("jwt_token");
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        this.removeToken();
        return false;
      }
      
      return true;
    } catch (error) {
      this.removeToken();
      return false;
    }
  }

  static getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.userId,
        email: payload.email,
        username: payload.username,
        walletAddress: payload.walletAddress,
        role: payload.role,
        permissions: payload.permissions || [],
      };
    } catch (error) {
      return null;
    }
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse["data"]>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      
      if (response.success && response.data) {
        this.setToken(response.data.token);
      }
      
      return response as AuthResponse;
    } catch (error: any) {
      return {
        success: false,
        data: {
          token: "",
          user: {
            id: "",
            email: "",
            username: "",
            walletAddress: "",
            role: "",
            permissions: [],
          },
        },
        message: error.message,
      };
    }
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse["data"]>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );
      
      if (response.success && response.data) {
        this.setToken(response.data.token);
      }
      
      return response as AuthResponse;
    } catch (error: any) {
      return {
        success: false,
        data: {
          token: "",
          user: {
            id: "",
            email: "",
            username: "",
            walletAddress: "",
            role: "",
            permissions: [],
          },
        },
        message: error.message,
      };
    }
  }

  static async logout(): Promise<void> {
    try {
      await ApiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.removeToken();
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

  static async getTestToken(): Promise<string | null> {
    try {
      const response = await ApiService.getTestToken();
      if (response.success && response.data) {
        this.setToken(response.data.token);
        return response.data.token;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  static hasPermission(permission: string): boolean {
    const userInfo = this.getUserInfo();
    if (!userInfo) return false;
    
    return userInfo.permissions.includes(permission);
  }

  static hasRole(role: string): boolean {
    const userInfo = this.getUserInfo();
    if (!userInfo) return false;
    
    return userInfo.role === role;
  }
}

export default AuthService;
