/**
 * API Types
 * TypeScript types for API requests and responses
 */

// ============= Generic Types =============

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  timestamp?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
}

// ============= Authentication Types =============

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: {
    id: string
    email: string
    username: string
    firstName?: string
    lastName?: string
    avatar?: string
  }
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

// ============= User Types =============

export interface UpdateProfileRequest {
  username?: string
  firstName?: string
  lastName?: string
  bio?: string
  avatar?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UserPreferences {
  language: string
  currency: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    showProfile: boolean
    showPortfolio: boolean
  }
}

// ============= Wallet Types =============

export interface WalletBalance {
  currency: string
  balance: string
  balanceUSD: number
  availableBalance: string
  lockedBalance: string
}

export interface Transaction {
  id: string
  type: 'send' | 'receive' | 'buy' | 'sell' | 'stake' | 'unstake'
  amount: string
  currency: string
  from: string
  to: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: string
  txHash?: string
  fee?: string
  confirmations?: number
}

export interface SendTransactionRequest {
  to: string
  amount: string
  currency: string
  memo?: string
}

// ============= Investment Types =============

export interface Investment {
  id: string
  name: string
  type: 'crypto' | 'token' | 'pool' | 'stake'
  amount: string
  currentValue: string
  profitLoss: string
  profitLossPercentage: number
  currency: string
  purchaseDate: string
  status: 'active' | 'closed'
}

export interface CreateInvestmentRequest {
  name: string
  type: 'crypto' | 'token' | 'pool' | 'stake'
  amount: string
  currency: string
}

export interface PortfolioSummary {
  totalValue: string
  totalInvested: string
  totalProfit: string
  profitPercentage: number
  investments: Investment[]
}

// ============= NFT Types =============

export interface NFT {
  id: string
  name: string
  description: string
  imageUrl: string
  collection: string
  owner: string
  creator: string
  price?: string
  currency?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  attributes: NFTAttribute[]
  tokenId: string
  contractAddress: string
  blockchain: string
  listed: boolean
}

export interface NFTAttribute {
  traitType: string
  value: string | number
  rarity?: number
}

export interface BuyNFTRequest {
  paymentMethod: 'wallet' | 'card'
}

export interface SellNFTRequest {
  price: string
  currency: string
}

export interface TransferNFTRequest {
  toAddress: string
}

// ============= Mission Types =============

export interface Mission {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'special'
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'claimed'
  reward: {
    type: 'token' | 'nft' | 'badge'
    amount?: string
    currency?: string
    item?: string
  }
  progress: {
    current: number
    target: number
  }
  startDate?: string
  endDate?: string
  requirements?: string[]
}

export interface DailyStreak {
  currentStreak: number
  longestStreak: number
  lastCompletedDate: string
  bonusMultiplier: number
}

// ============= Notification Types =============

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'transaction' | 'mission'
  title: string
  message: string
  read: boolean
  timestamp: string
  actionUrl?: string
  metadata?: Record<string, any>
}

// ============= Blockchain Types =============

export interface Block {
  blockNumber: number
  hash: string
  parentHash: string
  timestamp: string
  transactions: string[]
  miner: string
  difficulty: string
  totalDifficulty: string
  size: number
  gasUsed: string
  gasLimit: string
}

export interface BlockchainStats {
  totalBlocks: number
  totalTransactions: number
  averageBlockTime: number
  hashRate: string
  difficulty: string
  networkStatus: 'online' | 'degraded' | 'offline'
}

export interface GasPrice {
  slow: string
  average: string
  fast: string
  instant: string
  unit: string
}

