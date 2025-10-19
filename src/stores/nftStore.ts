import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { NFT } from './types'

interface NFTState {
  // Trạng thái
  nfts: NFT[]
  userNFTs: NFT[]
  selectedNFT: NFT | null
  filters: {
    collection?: string
    rarity?: string
    minPrice?: number
    maxPrice?: number
  }
  isLoading: boolean
  error: string | null

  // Hành động
  fetchNFTs: (filters?: NFTState['filters']) => Promise<void>
  fetchUserNFTs: (userId: string) => Promise<void>
  selectNFT: (nft: NFT) => void
  buyNFT: (nftId: string) => Promise<void>
  sellNFT: (nftId: string, price: number) => Promise<void>
  setFilters: (filters: NFTState['filters']) => void
  clearFilters: () => void
  clearError: () => void
}

/**
 * NFT Store - Quản lý thị trường NFT và bộ sưu tập của người dùng
 * 
 * Tính năng:
 * - Tích hợp Redux DevTools
 * - Lọc thị trường NFT
 * - Quản lý bộ sưu tập của người dùng
 */
export const useNFTStore = create<NFTState>()(
  devtools(
    (set, get) => ({
      // Trạng thái ban đầu
      nfts: [],
      userNFTs: [],
      selectedNFT: null,
      filters: {},
      isLoading: false,
      error: null,

      // Hành động lấy NFT
      fetchNFTs: async (filters?: NFTState['filters']) => {
        set({ isLoading: true, error: null })
        
        try {
          const queryParams = new URLSearchParams(
            filters as Record<string, string>
          ).toString()

          // TODO: Thay thế bằng lệnh gọi API thực tế
          const response = await fetch(`/api/nfts?${queryParams}`)
          
          if (!response.ok) {
            throw new Error('Failed to fetch NFTs')
          }

          const nfts = await response.json()
          
          set({ 
            nfts,
            isLoading: false,
            error: null 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Fetch failed',
            isLoading: false 
          })
        }
      },

      // Hành động lấy NFT của người dùng
      fetchUserNFTs: async (userId: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // TODO: Thay thế bằng lệnh gọi API thực tế
          const response = await fetch(`/api/nfts/user/${userId}`)
          
          if (!response.ok) {
            throw new Error('Failed to fetch user NFTs')
          }

          const userNFTs = await response.json()
          
          set({ 
            userNFTs,
            isLoading: false,
            error: null 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Fetch failed',
            isLoading: false 
          })
        }
      },

      // Hành động chọn NFT
      selectNFT: (nft: NFT) => {
        set({ selectedNFT: nft })
      },

      // Hành động mua NFT
      buyNFT: async (nftId: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // TODO: Thay thế bằng lệnh gọi API thực tế
          const response = await fetch(`/api/nfts/${nftId}/buy`, {
            method: 'POST',
          })

          if (!response.ok) {
            throw new Error('Failed to buy NFT')
          }

          const boughtNFT = await response.json()
          
          // Cập nhật NFT của người dùng
          set((state) => ({ 
            userNFTs: [...state.userNFTs, boughtNFT],
            isLoading: false,
            error: null 
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Purchase failed',
            isLoading: false 
          })
        }
      },

      // Hành động bán NFT
      sellNFT: async (nftId: string, price: number) => {
        set({ isLoading: true, error: null })
        
        try {
          // TODO: Thay thế bằng lệnh gọi API thực tế
          const response = await fetch(`/api/nfts/${nftId}/sell`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price }),
          })

          if (!response.ok) {
            throw new Error('Failed to sell NFT')
          }
          
          // Xóa khỏi NFT của người dùng
          set((state) => ({ 
            userNFTs: state.userNFTs.filter(nft => nft.id !== nftId),
            isLoading: false,
            error: null 
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Sale failed',
            isLoading: false 
          })
        }
      },

      // Hành động thiết lập bộ lọc
      setFilters: (filters: NFTState['filters']) => {
        set({ filters })
        get().fetchNFTs(filters)
      },

      // Hành động xóa bộ lọc
      clearFilters: () => {
        set({ filters: {} })
        get().fetchNFTs()
      },

      // Hành động xóa lỗi
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'NFTStore',
    }
  )
)

// Selectors
export const useNFTs = () => useNFTStore((state) => state.nfts)
export const useUserNFTs = () => useNFTStore((state) => state.userNFTs)
export const useSelectedNFT = () => useNFTStore((state) => state.selectedNFT)
export const useNFTActions = () => useNFTStore((state) => ({
  fetchNFTs: state.fetchNFTs,
  buyNFT: state.buyNFT,
  sellNFT: state.sellNFT,
  setFilters: state.setFilters,
}))

