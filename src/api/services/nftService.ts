/**
 * NFT Service
 * NFT marketplace and collection management API calls
 */

import { apiRequest } from '../axios'
import { API_ENDPOINTS } from '../config'
import type {
  NFT,
  BuyNFTRequest,
  SellNFTRequest,
  TransferNFTRequest,
  ApiResponse,
  PaginatedResponse,
} from '../types'

export const nftService = {
  /**
   * Get all NFTs in marketplace
   */
  getAllNFTs: async (params?: {
    page?: number
    limit?: number
    collection?: string
    rarity?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: 'price' | 'rarity' | 'recent'
  }): Promise<PaginatedResponse<NFT>> => {
    return apiRequest.get<NFT[]>(
      API_ENDPOINTS.NFT.GET_ALL,
      { params }
    ) as Promise<PaginatedResponse<NFT>>
  },
  
  /**
   * Get user's NFT collection
   */
  getUserNFTs: async (): Promise<ApiResponse<NFT[]>> => {
    return apiRequest.get<NFT[]>(API_ENDPOINTS.NFT.GET_USER_NFTS)
  },
  
  /**
   * Get NFT details
   */
  getNFTDetail: async (id: string): Promise<ApiResponse<NFT>> => {
    return apiRequest.get<NFT>(API_ENDPOINTS.NFT.GET_NFT_DETAIL(id))
  },
  
  /**
   * Buy NFT
   */
  buyNFT: async (id: string, data: BuyNFTRequest): Promise<ApiResponse<{
    transaction: any
    nft: NFT
  }>> => {
    return apiRequest.post(API_ENDPOINTS.NFT.BUY_NFT(id), data)
  },
  
  /**
   * Sell NFT (list on marketplace)
   */
  sellNFT: async (id: string, data: SellNFTRequest): Promise<ApiResponse<NFT>> => {
    return apiRequest.post<NFT>(API_ENDPOINTS.NFT.SELL_NFT(id), data)
  },
  
  /**
   * Transfer NFT to another address
   */
  transferNFT: async (id: string, data: TransferNFTRequest): Promise<ApiResponse<{
    transaction: any
  }>> => {
    return apiRequest.post(API_ENDPOINTS.NFT.TRANSFER_NFT(id), data)
  },
  
  /**
   * Get NFT transaction history
   */
  getNFTHistory: async (id: string): Promise<ApiResponse<Array<{
    type: 'mint' | 'transfer' | 'sale' | 'list'
    from: string
    to: string
    price?: string
    timestamp: string
    txHash: string
  }>>> => {
    return apiRequest.get(API_ENDPOINTS.NFT.GET_NFT_HISTORY(id))
  },
}

