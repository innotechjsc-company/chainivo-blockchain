/**
 * LocalStorage Service - Centralized localStorage management
 *
 * This service provides a type-safe API for managing localStorage
 * with predefined keys to avoid typos and ensure consistency.
 *
 * @example
 * import { LocalStorageService } from '@/services'
 *
 * // Set token
 * LocalStorageService.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
 *
 * // Get token
 * const token = LocalStorageService.getToken()
 *
 * // Clear all auth data
 * LocalStorageService.clearAuthData()
 */

// Định nghĩa tất cả các keys được sử dụng trong app
export const STORAGE_KEYS = {
  // Authentication
  JWT_TOKEN: 'jwt_token',
  JWT_EXP: 'jwt_exp',
  USER_INFO: 'user_info',
  
  // Wallet
  WALLET_ADDRESS: 'walletAddress',
  IS_CONNECTED_TO_WALLET: 'isConnectedToWallet',
  CURRENT_USER_ID: 'currentUserId',
  
  // Theme
  THEME: 'theme',
  
  // Legacy (để tương thích ngược)
  USER: 'user',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserInfo {
  email: string;
  id: string;
  collection: string;
  [key: string]: any;
}

export class LocalStorageService {
  /**
   * Kiểm tra xem localStorage có available không (SSR-safe)
   */
  private static isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  /**
   * Get item từ localStorage
   */
  private static getItem(key: StorageKey): string | null {
    if (!this.isAvailable()) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  }

  /**
   * Set item vào localStorage
   */
  private static setItem(key: StorageKey, value: string): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting ${key} to localStorage:`, error);
    }
  }

  /**
   * Remove item khỏi localStorage
   */
  private static removeItem(key: StorageKey): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  // ============================================
  // Authentication Methods
  // ============================================

  /**
   * Lấy JWT token
   */
  static getToken(): string | null {
    return this.getItem(STORAGE_KEYS.JWT_TOKEN);
  }

  /**
   * Lưu JWT token và expiration
   */
  static setToken(token: string, exp?: number): void {
    this.setItem(STORAGE_KEYS.JWT_TOKEN, token);
    if (exp) {
      this.setItem(STORAGE_KEYS.JWT_EXP, exp.toString());
    }
  }

  /**
   * Xóa JWT token
   */
  static removeToken(): void {
    this.removeItem(STORAGE_KEYS.JWT_TOKEN);
    this.removeItem(STORAGE_KEYS.JWT_EXP);
  }

  /**
   * Lấy token expiration timestamp
   */
  static getTokenExpiration(): number | null {
    const exp = this.getItem(STORAGE_KEYS.JWT_EXP);
    return exp ? parseInt(exp, 10) : null;
  }

  /**
   * Kiểm tra xem token có hết hạn chưa
   */
  static isTokenExpired(): boolean {
    const exp = this.getTokenExpiration();
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  }

  // ============================================
  // User Info Methods
  // ============================================

  /**
   * Lấy user info
   */
  static getUserInfo(): UserInfo | null {
    const userStr = this.getItem(STORAGE_KEYS.USER_INFO);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as UserInfo;
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  }

  /**
   * Lưu user info
   */
  static setUserInfo(user: UserInfo | any): void {
    try {
      this.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user info:', error);
    }
  }

  /**
   * Xóa user info
   */
  static removeUserInfo(): void {
    this.removeItem(STORAGE_KEYS.USER_INFO);
  }

  // ============================================
  // Wallet Methods
  // ============================================

  /**
   * Lấy wallet address
   */
  static getWalletAddress(): string | null {
    return this.getItem(STORAGE_KEYS.WALLET_ADDRESS);
  }

  /**
   * Lưu wallet address
   */
  static setWalletAddress(address: string): void {
    this.setItem(STORAGE_KEYS.WALLET_ADDRESS, address);
  }

  /**
   * Xóa wallet address
   */
  static removeWalletAddress(): void {
    this.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
  }

  /**
   * Kiểm tra xem có đang kết nối wallet không
   */
  static isConnectedToWallet(): boolean {
    return this.getItem(STORAGE_KEYS.IS_CONNECTED_TO_WALLET) === 'true';
  }

  /**
   * Set wallet connection status
   */
  static setWalletConnectionStatus(isConnected: boolean): void {
    this.setItem(STORAGE_KEYS.IS_CONNECTED_TO_WALLET, isConnected.toString());
  }

  /**
   * Xóa wallet connection status
   */
  static removeWalletConnectionStatus(): void {
    this.removeItem(STORAGE_KEYS.IS_CONNECTED_TO_WALLET);
  }

  /**
   * Lấy current user ID
   */
  static getCurrentUserId(): string | null {
    return this.getItem(STORAGE_KEYS.CURRENT_USER_ID);
  }

  /**
   * Lưu current user ID
   */
  static setCurrentUserId(userId: string): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  /**
   * Xóa current user ID
   */
  static removeCurrentUserId(): void {
    this.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  }

  /**
   * Clear tất cả wallet data
   */
  static clearWalletData(): void {
    this.removeWalletAddress();
    this.removeWalletConnectionStatus();
  }

  // ============================================
  // Theme Methods
  // ============================================

  /**
   * Lấy theme preference
   */
  static getTheme(): ThemeMode | null {
    const theme = this.getItem(STORAGE_KEYS.THEME);
    if (theme === 'light' || theme === 'dark' || theme === 'system') {
      return theme as ThemeMode;
    }
    return null;
  }

  /**
   * Lưu theme preference
   */
  static setTheme(theme: ThemeMode): void {
    this.setItem(STORAGE_KEYS.THEME, theme);
  }

  /**
   * Xóa theme preference
   */
  static removeTheme(): void {
    this.removeItem(STORAGE_KEYS.THEME);
  }

  // ============================================
  // Legacy Methods (để tương thích ngược)
  // ============================================

  /**
   * Lấy user data (legacy)
   */
  static getUser(): any | null {
    const userStr = this.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Lưu user data (legacy)
   */
  static setUser(user: any): void {
    try {
      this.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  }

  /**
   * Xóa user data (legacy)
   */
  static removeUser(): void {
    this.removeItem(STORAGE_KEYS.USER);
  }

  // ============================================
  // Bulk Operations
  // ============================================

  /**
   * Clear tất cả auth data (token, user info, wallet)
   */
  static clearAuthData(): void {
    this.removeToken();
    this.removeUserInfo();
    this.clearWalletData();
    this.removeCurrentUserId();
  }

  /**
   * Clear tất cả data trong localStorage
   */
  static clearAll(): void {
    if (!this.isAvailable()) return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Lấy tất cả keys hiện có trong localStorage
   */
  static getAllKeys(): string[] {
    if (!this.isAvailable()) return [];
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Kiểm tra xem một key có tồn tại không
   */
  static hasKey(key: StorageKey): boolean {
    return this.getItem(key) !== null;
  }

  /**
   * Lấy kích thước của localStorage (bytes)
   */
  static getStorageSize(): number {
    if (!this.isAvailable()) return 0;
    try {
      let size = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length + key.length;
        }
      }
      return size;
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  /**
   * Export tất cả data dưới dạng object (để debug)
   */
  static exportAll(): Record<string, string> {
    if (!this.isAvailable()) return {};
    try {
      const data: Record<string, string> = {};
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          data[key] = localStorage[key];
        }
      }
      return data;
    } catch (error) {
      console.error('Error exporting localStorage:', error);
      return {};
    }
  }
}

// Export default instance
export default LocalStorageService;

// Export shorthand cho các methods thường dùng
export const storage = {
  // Auth
  getToken: () => LocalStorageService.getToken(),
  setToken: (token: string, exp?: number) => LocalStorageService.setToken(token, exp),
  removeToken: () => LocalStorageService.removeToken(),
  
  // User
  getUserInfo: () => LocalStorageService.getUserInfo(),
  setUserInfo: (user: UserInfo | any) => LocalStorageService.setUserInfo(user),
  removeUserInfo: () => LocalStorageService.removeUserInfo(),
  
  // Wallet
  getWalletAddress: () => LocalStorageService.getWalletAddress(),
  setWalletAddress: (address: string) => LocalStorageService.setWalletAddress(address),
  isConnectedToWallet: () => LocalStorageService.isConnectedToWallet(),
  setWalletConnectionStatus: (isConnected: boolean) => 
    LocalStorageService.setWalletConnectionStatus(isConnected),
  
  // Theme
  getTheme: () => LocalStorageService.getTheme(),
  setTheme: (theme: ThemeMode) => LocalStorageService.setTheme(theme),
  
  // Bulk
  clearAuthData: () => LocalStorageService.clearAuthData(),
  clearAll: () => LocalStorageService.clearAll(),
};

