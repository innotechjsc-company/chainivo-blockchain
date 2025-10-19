/**
 * Blockchain Service
 * Blockchain data and statistics API calls
 */

import { apiRequest } from '../axios'
import { API_ENDPOINTS } from '../config'
import type {
  Block,
  BlockchainStats,
  GasPrice,
  Transaction,
  ApiResponse,
} from '../types'

export const blockchainService = {
  /**
   * Get block by ID
   */
  getBlock: async (blockId: string): Promise<ApiResponse<Block>> => {
    return apiRequest.get<Block>(
      API_ENDPOINTS.BLOCKCHAIN.GET_BLOCK(blockId)
    )
  },
  
  /**
   * Get latest blocks
   */
  getLatestBlocks: async (limit: number = 10): Promise<ApiResponse<Block[]>> => {
    return apiRequest.get<Block[]>(
      API_ENDPOINTS.BLOCKCHAIN.GET_LATEST_BLOCKS,
      { params: { limit } }
    )
  },
  
  /**
   * Get transaction details
   */
  getTransaction: async (txHash: string): Promise<ApiResponse<Transaction>> => {
    return apiRequest.get<Transaction>(
      API_ENDPOINTS.BLOCKCHAIN.GET_TRANSACTION(txHash)
    )
  },
  
  /**
   * Get network statistics
   */
  getNetworkStats: async (): Promise<ApiResponse<BlockchainStats>> => {
    return apiRequest.get<BlockchainStats>(
      API_ENDPOINTS.BLOCKCHAIN.GET_NETWORK_STATS
    )
  },
  
  /**
   * Get current gas prices
   */
  getGasPrice: async (): Promise<ApiResponse<GasPrice>> => {
    return apiRequest.get<GasPrice>(
      API_ENDPOINTS.BLOCKCHAIN.GET_GAS_PRICE
    )
  },
}

