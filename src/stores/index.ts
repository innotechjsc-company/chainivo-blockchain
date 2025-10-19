/**
 * Xuất các Zustand Store
 * 
 * File này xuất tất cả các store và các hook của chúng để dễ dàng import
 * vào toàn bộ ứng dụng.
 * 
 * Cách dùng:
 * import { useUserStore, useWalletStore } from '@/stores'
 */

// Xuất các store
export { useUserStore, useUser, useIsAuthenticated, useUserActions } from './userStore'
export { useWalletStore, useWallet, useTransactions, useWalletActions } from './walletStore'
export { useInvestmentStore, useInvestments, usePortfolioSummary, useInvestmentActions } from './investmentStore'
export { useNFTStore, useNFTs, useUserNFTs, useSelectedNFT, useNFTActions } from './nftStore'
export { useMissionStore, useMissions, useActiveMissions, useCompletedMissions, useDailyStreak, useMissionActions } from './missionStore'
export { useNotificationStore, useNotifications, useUnreadCount, useUnreadNotifications, useNotificationActions } from './notificationStore'

// Xuất các kiểu dữ liệu
export type * from './types'

