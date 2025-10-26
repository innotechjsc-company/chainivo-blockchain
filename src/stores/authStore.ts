import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthService, type LoginCredentials, type RegisterData } from "@/api/services/auth-service";

interface AuthUser {
  id: string;
  email: string;
  username: string;
  walletAddress: string;
  role: string;
  permissions: string[];
}

interface AuthState {
  // State
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  setUser: (user: AuthUser | null) => void;
  clearError: () => void;
  initializeAuth: () => void;
}

/**
 * Auth Store - Quản lý authentication và authorization
 * 
 * Features:
 * - Persist token và user info trong localStorage
 * - Tích hợp với AuthService
 * - Redux DevTools support
 * - Auto initialize từ stored token
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Initialize auth from stored token
        initializeAuth: () => {
          const token = AuthService.getToken();
          if (token && AuthService.isAuthenticated()) {
            const userInfo = AuthService.getUserInfo();
            if (userInfo) {
              set({
                user: userInfo,
                token,
                isAuthenticated: true,
              });
            }
          }
        },

        // Login action
        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null });

          try {
            const response = await AuthService.login(credentials);

            if (response.success && response.data?.user && response.data?.token) {
              set({
                user: response.data.user,
                token: response.data.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              return true;
            }
            
            set({
              error: response.message || "Đăng nhập thất bại",
              isLoading: false,
            });
            return false;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Đăng nhập thất bại";
            set({
              error: errorMessage,
              isLoading: false,
            });
            return false;
          }
        },

        // Register action
        register: async (data: RegisterData) => {
          set({ isLoading: true, error: null });

          try {
            const response = await AuthService.register(data);

            if (response.success && response.data?.user && response.data?.token) {
              set({
                user: response.data.user,
                token: response.data.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              return true;
            }
            
            set({
              error: response.message || "Đăng ký thất bại",
              isLoading: false,
            });
            return false;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Đăng ký thất bại";
            set({
              error: errorMessage,
              isLoading: false,
            });
            return false;
          }
        },

        // Logout action
        logout: async () => {
          try {
            await AuthService.logout();
          } catch (error) {
            console.error("Logout error:", error);
          } finally {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              error: null,
            });
          }
        },

        // Refresh token action
        refreshToken: async () => {
          try {
            const success = await AuthService.refreshToken();
            if (success) {
              const token = AuthService.getToken();
              const userInfo = AuthService.getUserInfo();
              if (token && userInfo) {
                set({
                  user: userInfo,
                  token,
                  isAuthenticated: true,
                });
                return true;
              }
            }
            return false;
          } catch (error) {
            console.error("Refresh token error:", error);
            return false;
          }
        },

        // Set user action
        setUser: (user: AuthUser | null) => {
          set({
            user,
            isAuthenticated: !!user,
          });
        },

        // Clear error action
        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        skipHydration: true,
      }
    ),
    {
      name: "AuthStore",
    }
  )
);

// Selectors for optimized re-renders
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

// Individual action hooks to avoid infinite loop in Next.js
export const useLogin = () => useAuthStore((state) => state.login);
export const useRegister = () => useAuthStore((state) => state.register);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useRefreshToken = () => useAuthStore((state) => state.refreshToken);
export const useClearError = () => useAuthStore((state) => state.clearError);
