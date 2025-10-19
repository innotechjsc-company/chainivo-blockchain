/**
 * API Configuration
 * Central configuration for all API endpoints and settings
 */

export const API_CONFIG = {
  // Base URL for API requests - Change this to your actual API endpoint
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.chainivo.com',
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 30000,
  
  // API Version
  API_VERSION: 'v1',
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

/**
 * API Endpoints
 * All API endpoints organized by feature
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/auth/profile',
  },
  
  // User Management
  USER: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
    GET_PREFERENCES: '/users/preferences',
    UPDATE_PREFERENCES: '/users/preferences',
  },
  
  // Wallet
  WALLET: {
    GET_BALANCE: '/wallet/balance',
    GET_TRANSACTIONS: '/wallet/transactions',
    SEND_TRANSACTION: '/wallet/send',
    GET_ADDRESSES: '/wallet/addresses',
    GENERATE_ADDRESS: '/wallet/addresses/generate',
    IMPORT_WALLET: '/wallet/import',
    EXPORT_WALLET: '/wallet/export',
  },
  
  // Investment
  INVESTMENT: {
    GET_PORTFOLIO: '/investments/portfolio',
    GET_INVESTMENTS: '/investments',
    CREATE_INVESTMENT: '/investments',
    GET_INVESTMENT_DETAIL: (id: string) => `/investments/${id}`,
    UPDATE_INVESTMENT: (id: string) => `/investments/${id}`,
    DELETE_INVESTMENT: (id: string) => `/investments/${id}`,
    GET_PERFORMANCE: '/investments/performance',
  },
  
  // NFT Marketplace
  NFT: {
    GET_ALL: '/nft/marketplace',
    GET_USER_NFTS: '/nft/my-collection',
    GET_NFT_DETAIL: (id: string) => `/nft/${id}`,
    BUY_NFT: (id: string) => `/nft/${id}/buy`,
    SELL_NFT: (id: string) => `/nft/${id}/sell`,
    TRANSFER_NFT: (id: string) => `/nft/${id}/transfer`,
    GET_NFT_HISTORY: (id: string) => `/nft/${id}/history`,
  },
  
  // Missions
  MISSION: {
    GET_ALL: '/missions',
    GET_ACTIVE: '/missions/active',
    GET_MISSION_DETAIL: (id: string) => `/missions/${id}`,
    START_MISSION: (id: string) => `/missions/${id}/start`,
    COMPLETE_MISSION: (id: string) => `/missions/${id}/complete`,
    CLAIM_REWARD: (id: string) => `/missions/${id}/claim`,
    GET_DAILY_STREAK: '/missions/daily-streak',
  },
  
  // Notifications
  NOTIFICATION: {
    GET_ALL: '/notifications',
    MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_AS_READ: '/notifications/read-all',
    DELETE_NOTIFICATION: (id: string) => `/notifications/${id}`,
    GET_UNREAD_COUNT: '/notifications/unread-count',
  },
  
  // Blockchain
  BLOCKCHAIN: {
    GET_BLOCK: (blockId: string) => `/blockchain/blocks/${blockId}`,
    GET_LATEST_BLOCKS: '/blockchain/blocks/latest',
    GET_TRANSACTION: (txHash: string) => `/blockchain/transactions/${txHash}`,
    GET_NETWORK_STATS: '/blockchain/stats',
    GET_GAS_PRICE: '/blockchain/gas-price',
  },
} as const

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'chainivo_access_token',
  REFRESH_TOKEN: 'chainivo_refresh_token',
  USER_DATA: 'chainivo_user_data',
} as const

