/**
 * Các kiểu dữ liệu chung cho Zustand stores
 */

// Kiểu dữ liệu User
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar_url: string | null;
  walletAddress?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  _verified: boolean;
  role?: string;
  permissions?: string[];
}

export interface WalletBalance {
  token?: string;
  can: number;
  usdt: number;
  pol: number;
}

// Kiểu dữ liệu Wallet
export interface Wallet {
  address: string;
  balance?: WalletBalance;
  currency?: string;
}

export interface Transaction {
  id: string;
  type: "send" | "receive" | "swap";
  amount: number;
  currency: string;
  to?: string;
  from?: string;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
}

// Kiểu dữ liệu Investment
export interface Investment {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  investedAt: Date;
}

// Kiểu dữ liệu NFT
export interface NFT {
  _id: string;
  name?: string;
  description?: string;
  image?: string;
  price?: number;
  currency?: string;
  owner?: string;
  creator?: string;
  collection?: {
    name?: string;
  };
  rarity?: "common" | "rare" | "epic" | "legendary";
}

// Kiểu dữ liệu Mission
export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardType: "token" | "nft" | "point";
  progress: number;
  target: number;
  completed: boolean;
  expiresAt?: Date;
}

// Kiểu dữ liệu Notification
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}
