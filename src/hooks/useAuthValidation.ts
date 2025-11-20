import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ToastService, LocalStorageService } from '@/services';
import type { RootState } from '@/stores/store';
import type { AuthUser } from '@/stores/authSlice';

/**
 * Options for validateAuth function
 */
export interface ValidateAuthOptions {
  /**
   * Require wallet connection in addition to authentication
   * @default false
   */
  requireWallet?: boolean;
  
  /**
   * Custom error message when user is not authenticated
   * @default "Vui lòng đăng nhập để tiếp tục"
   */
  customAuthMessage?: string;
  
  /**
   * Custom error message when wallet is not connected
   * @default "Vui lòng kết nối ví để tiếp tục"
   */
  customWalletMessage?: string;
}

/**
 * Return type for useAuthValidation hook
 */
export interface UseAuthValidationReturn {
  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean;
  
  /**
   * Current authenticated user, or null if not authenticated
   */
  user: AuthUser | null;
  
  /**
   * Wallet address from either wallet slice or auth user
   * Priority: wallet.wallet.address > auth.user.walletAddress
   */
  walletAddress: string | null;
  
  /**
   * Whether a wallet is connected
   */
  isWalletConnected: boolean;
  
  /**
   * Validate authentication and optionally wallet connection
   * Shows appropriate error toasts and returns validation result
   * 
   * @param options - Validation options
   * @returns true if validation passes, false otherwise
   */
  validateAuth: (options?: ValidateAuthOptions) => boolean;
  
  /**
   * Check authentication and wallet status without showing errors
   * Useful for determining which modal to show
   * 
   * @returns "login_required" | "wallet_required" | "ok"
   */
  checkAuthAndWallet: () => "login_required" | "wallet_required" | "ok";
}

/**
 * Hook for centralized authentication and wallet validation
 * 
 * @example
 * ```typescript
 * const { validateAuth, walletAddress } = useAuthValidation();
 * 
 * const handleBuy = () => {
 *   if (!validateAuth({ requireWallet: true })) {
 *     return;
 *   }
 *   // Proceed with purchase...
 * };
 * ```
 */
export const useAuthValidation = (): UseAuthValidationReturn => {
  // Get auth state from Redux
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  // Get wallet address with fallback priority
  // 1. From wallet slice (when user connects via MetaMask)
  // 2. From auth.user (when user has wallet in database)
  const walletAddress = useSelector(
    (state: RootState) =>
      state.wallet?.wallet?.address || state.auth?.user?.walletAddress || null
  );

  /**
   * Check if wallet is actually connected via LocalStorage
   * This ensures the wallet is truly connected through MetaMask,
   * not just present in Redux state
   */
  const isWalletActuallyConnected = useCallback((): boolean => {
    if (!walletAddress) return false;
    
    // Verify with LocalStorage to ensure real MetaMask connection
    return LocalStorageService.isConnectedToWallet();
  }, [walletAddress]);

  /**
   * Validate authentication and wallet connection
   * Memoized to prevent unnecessary re-renders
   */
  const validateAuth = useCallback(
    (options?: ValidateAuthOptions): boolean => {
      const {
        requireWallet = false,
        customAuthMessage = 'Vui lòng đăng nhập để tiếp tục',
        customWalletMessage = 'Vui lòng kết nối ví để tiếp tục',
      } = options || {};

      // Check authentication first
      if (!isAuthenticated) {
        ToastService.error(customAuthMessage);
        return false;
      }

      // Check wallet connection if required
      // Use LocalStorage check to verify actual MetaMask connection
      if (requireWallet && !isWalletActuallyConnected()) {
        ToastService.error(customWalletMessage);
        return false;
      }

      return true;
    },
    [isAuthenticated, isWalletActuallyConnected]
  );

  /**
   * Check auth and wallet status without side effects
   * Returns status string for conditional rendering
   */
  const checkAuthAndWallet = useCallback((): "login_required" | "wallet_required" | "ok" => {
    if (!isAuthenticated) return "login_required";
    if (!isWalletActuallyConnected()) return "wallet_required";
    return "ok";
  }, [isAuthenticated, isWalletActuallyConnected]);

  return {
    isAuthenticated,
    user,
    walletAddress,
    isWalletConnected: isWalletActuallyConnected(),
    validateAuth,
    checkAuthAndWallet,
  };
};
