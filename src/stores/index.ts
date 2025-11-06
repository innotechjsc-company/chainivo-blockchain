/**
 * Redux Store Configuration
 *
 * File này xuất Redux store, typed hooks và selectors
 * để sử dụng trong toàn bộ ứng dụng.
 *
 * Cách dùng:
 * import { useAppDispatch, useAppSelector } from '@/stores'
 * import { login } from '@/stores/authSlice'
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Export store và persistor
export { store, persistor } from "./store";
export type { RootState, AppDispatch } from "./store";

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export slices with namespaces to avoid conflicts
import * as authSlice from "./authSlice";
import * as userSlice from "./userSlice";
import * as walletSlice from "./walletSlice";
import * as investmentSlice from "./investmentSlice";
import * as nftSlice from "./nftSlice";
import * as missionSlice from "./missionSlice";
import * as notificationSlice from "./notificationSlice";

export {
  authSlice,
  userSlice,
  walletSlice,
  investmentSlice,
  nftSlice,
  missionSlice,
  notificationSlice,
};

// Export specific commonly used actions
export {
  setLoginSuccess,
  setLoading,
  setError,
  logout as logoutAction,
  clearError,
  setUser as setAuthUser,
  updateProfile as updateAuthProfile,
  initializeAuth,
  refreshUserProfile, // Async thunk de refresh avatar va user profile
} from "./authSlice";
export type { AuthUser } from "./authSlice";
export {
  loginUser,
  registerUser,
  logoutUser,
  updateProfile,
  setUser,
} from "./userSlice";
export {
  connectWallet,
  disconnectWallet,
  fetchTransactions,
  sendCrypto,
} from "./walletSlice";
export {
  fetchInvestments,
  addInvestment,
  removeInvestment,
  updateInvestment,
} from "./investmentSlice";
export {
  fetchNFTs,
  fetchUserNFTs,
  buyNFT,
  sellNFT,
  selectNFT,
  setFilters,
  clearFilters,
} from "./nftSlice";
export {
  fetchMissions,
  completeMission,
  claimReward,
  updateProgress,
  resetDailyMissions,
  incrementStreak,
} from "./missionSlice";
export {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAll,
} from "./notificationSlice";

// Export types
export type * from "./types";
