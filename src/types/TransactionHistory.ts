/**
 * Transaction History Types
 * Phu hop voi API endpoint: /api/list-transaction
 */

// 6 loai giao dich (loai bo open-mystery-box)
export type TransactionType =
  | 'investment'
  | 'staking'
  | 'buy-nft'
  | 'sell-nft'
  | 'airdrop'
  | 'other';

// 3 loai tien te
export type Currency = 'usdc' | 'polygon' | 'can';

// Transaction item tu API response
export interface TransactionHistoryItem {
  id: string;
  transactionHash: string;
  from: string; // Dia chi vi nguoi gui (lowercase)
  to: string; // Dia chi vi nguoi nhan (lowercase)
  transactionType: TransactionType;
  email: string;
  amount: number;
  currency: Currency;
  notes: string | null;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Pagination info tu API
export interface TransactionPagination {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// API Response structure
export interface TransactionHistoryResponse {
  transactions: TransactionHistoryItem[];
  pagination: TransactionPagination;
}

// Filters cho UI (query params)
export interface TransactionHistoryFilters {
  page: number;
  limit: number;
  transactionType: TransactionType | 'all';
  currency: Currency | 'all';
  walletAddress?: string; // Tu dong lay tu user.walletAddress
  searchQuery: string; // Client-side search (hash, notes)
}

// Stats computed tu client-side data
export interface TransactionHistoryStats {
  totalTransactions: number;
  completedCount: number; // Giao dich co transactionHash
  pendingCount: number; // Giao dich khong co transactionHash
  failedCount: number; // Reserved cho tuong lai
}

// Direction logic helper
export type TransactionDirection = 'sent' | 'received';

// Label mapping cho UI
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  investment: 'Dau tu',
  staking: 'Staking',
  'buy-nft': 'Mua NFT',
  'sell-nft': 'Ban NFT',
  airdrop: 'Airdrop',
  other: 'Khac',
};

export const CURRENCY_LABELS: Record<Currency, string> = {
  usdc: 'USDC',
  polygon: 'POLYGON',
  can: 'CAN',
};
