/**
 * Wallet Service
 * Wallet and transaction management API calls
 */

import { apiRequest } from '../axios'
import { API_ENDPOINTS } from '../config'
import type {
  WalletBalance,
  Transaction,
  SendTransactionRequest,
  ApiResponse,
  PaginatedResponse,
} from '../types'

export const walletService = {
  /**
   * Get wallet balance
   */
  getBalance: async (): Promise<ApiResponse<WalletBalance[]>> => {
    return apiRequest.get<WalletBalance[]>(API_ENDPOINTS.WALLET.GET_BALANCE)
  },
  
  /**
   * Get transaction history
   */
  getTransactions: async (params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
  }): Promise<PaginatedResponse<Transaction>> => {
    return apiRequest.get<Transaction[]>(
      API_ENDPOINTS.WALLET.GET_TRANSACTIONS,
      { params }
    ) as Promise<PaginatedResponse<Transaction>>
  },
  
  /**
   * Send transaction
   */
  sendTransaction: async (data: SendTransactionRequest): Promise<ApiResponse<Transaction>> => {
    return apiRequest.post<Transaction>(
      API_ENDPOINTS.WALLET.SEND_TRANSACTION,
      data
    )
  },
  
  /**
   * Get wallet addresses
   */
  getAddresses: async (): Promise<ApiResponse<Array<{
    address: string
    currency: string
    label?: string
  }>>> => {
    return apiRequest.get(API_ENDPOINTS.WALLET.GET_ADDRESSES)
  },
  
  /**
   * Generate new address
   */
  generateAddress: async (currency: string): Promise<ApiResponse<{
    address: string
    currency: string
  }>> => {
    return apiRequest.post(API_ENDPOINTS.WALLET.GENERATE_ADDRESS, { currency })
  },
  
  /**
   * Import wallet
   */
  importWallet: async (data: {
    privateKey?: string
    mnemonic?: string
    password: string
  }): Promise<ApiResponse<{ address: string }>> => {
    return apiRequest.post(API_ENDPOINTS.WALLET.IMPORT_WALLET, data)
  },
  
  /**
   * Export wallet
   */
  exportWallet: async (password: string): Promise<ApiResponse<{
    privateKey?: string
    mnemonic?: string
  }>> => {
    return apiRequest.post(API_ENDPOINTS.WALLET.EXPORT_WALLET, { password })
  },
}

