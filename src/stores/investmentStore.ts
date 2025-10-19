import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Investment } from './types'

interface InvestmentState {
  // Trạng thái
  investments: Investment[]
  totalValue: number
  totalProfitLoss: number
  isLoading: boolean
  error: string | null

  // Hành động
  fetchInvestments: () => Promise<void>
  addInvestment: (investment: Omit<Investment, 'id'>) => Promise<void>
  removeInvestment: (id: string) => void
  updateInvestment: (id: string, data: Partial<Investment>) => void
  calculateTotals: () => void
  clearError: () => void
}

/**
 * Investment Store - Quản lý các khoản đầu tư và danh mục đầu tư của người dùng
 * 
 * Tính năng:
 * - Được lưu trữ trong localStorage
 * - Tích hợp Redux DevTools
 * - Tính toán danh mục đầu tư theo thời gian thực
 */
export const useInvestmentStore = create<InvestmentState>()(
  devtools(
    persist(
      (set, get) => ({
        // Trạng thái ban đầu
        investments: [],
        totalValue: 0,
        totalProfitLoss: 0,
        isLoading: false,
        error: null,

        // Hành động lấy các khoản đầu tư
        fetchInvestments: async () => {
          set({ isLoading: true, error: null })
          
          try {
            // TODO: Thay thế bằng lệnh gọi API thực tế
            const response = await fetch('/api/investments')
            
            if (!response.ok) {
              throw new Error('Failed to fetch investments')
            }

            const investments = await response.json()
            
            set({ 
              investments,
              isLoading: false,
              error: null 
            })

            get().calculateTotals()
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Fetch failed',
              isLoading: false 
            })
          }
        },

        // Hành động thêm khoản đầu tư
        addInvestment: async (investment: Omit<Investment, 'id'>) => {
          set({ isLoading: true, error: null })
          
          try {
            // TODO: Thay thế bằng lệnh gọi API thực tế
            const response = await fetch('/api/investments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(investment),
            })

            if (!response.ok) {
              throw new Error('Failed to add investment')
            }

            const newInvestment = await response.json()
            
            set((state) => ({ 
              investments: [...state.investments, newInvestment],
              isLoading: false,
              error: null 
            }))

            get().calculateTotals()
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Add failed',
              isLoading: false 
            })
          }
        },

        // Hành động xóa khoản đầu tư
        removeInvestment: (id: string) => {
          set((state) => ({ 
            investments: state.investments.filter(inv => inv.id !== id)
          }))
          get().calculateTotals()
        },

        // Hành động cập nhật khoản đầu tư
        updateInvestment: (id: string, data: Partial<Investment>) => {
          set((state) => ({
            investments: state.investments.map(inv =>
              inv.id === id ? { ...inv, ...data } : inv
            )
          }))
          get().calculateTotals()
        },

        // Hành động tính toán tổng
        calculateTotals: () => {
          const investments = get().investments
          
          const totalValue = investments.reduce(
            (sum, inv) => sum + inv.currentValue, 
            0
          )
          
          const totalProfitLoss = investments.reduce(
            (sum, inv) => sum + inv.profitLoss, 
            0
          )
          
          set({ totalValue, totalProfitLoss })
        },

        // Hành động xóa lỗi
        clearError: () => {
          set({ error: null })
        },
      }),
      {
        name: 'investment-storage',
      }
    ),
    {
      name: 'InvestmentStore',
    }
  )
)

// Selectors
export const useInvestments = () => useInvestmentStore((state) => state.investments)
export const usePortfolioSummary = () => useInvestmentStore((state) => ({
  totalValue: state.totalValue,
  totalProfitLoss: state.totalProfitLoss,
  investmentCount: state.investments.length,
}))
export const useInvestmentActions = () => useInvestmentStore((state) => ({
  fetchInvestments: state.fetchInvestments,
  addInvestment: state.addInvestment,
  removeInvestment: state.removeInvestment,
}))

