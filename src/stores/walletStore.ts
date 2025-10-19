import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Wallet, Transaction } from './types'

interface WalletState {
  // Trạng thái
  wallet: Wallet | null
  transactions: Transaction[]
  isLoading: boolean
  error: string | null

  // Hành động
  connectWallet: (address: string) => Promise<void>
  disconnectWallet: () => void
  updateBalance: (balance: number) => void
  addTransaction: (transaction: Transaction) => void
  fetchTransactions: () => Promise<void>
  sendCrypto: (to: string, amount: number, currency: string) => Promise<void>
  clearError: () => void
}

/**
 * Wallet Store - Quản lý ví tiền điện tử và các giao dịch
 * 
 * Tính năng:
 * - Được lưu trữ trong localStorage
 * - Tích hợp Redux DevTools
 * - Quản lý lịch sử giao dịch
 */
export const useWalletStore = create<WalletState>()(
  devtools(
    persist(
      (set, get) => ({
        // Trạng thái ban đầu
        wallet: null,
        transactions: [],
        isLoading: false,
        error: null,

        // Hành động kết nối ví
        connectWallet: async (address: string) => {
          set({ isLoading: true, error: null })
          
          try {
            // TODO: Thay thế bằng kết nối blockchain thực tế
            const response = await fetch(`/api/wallet/${address}`)
            
            if (!response.ok) {
              throw new Error('Failed to connect wallet')
            }

            const walletData = await response.json()
            
            set({ 
              wallet: walletData,
              isLoading: false,
              error: null 
            })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Connection failed',
              isLoading: false 
            })
          }
        },

        // Hành động ngắt kết nối ví
        disconnectWallet: () => {
          set({ 
            wallet: null,
            transactions: [],
            error: null 
          })
        },

        // Hành động cập nhật số dư
        updateBalance: (balance: number) => {
          const currentWallet = get().wallet
          if (currentWallet) {
            set({ 
              wallet: { ...currentWallet, balance } 
            })
          }
        },

        // Hành động thêm giao dịch
        addTransaction: (transaction: Transaction) => {
          set((state) => ({ 
            transactions: [transaction, ...state.transactions] 
          }))
        },

        // Hành động lấy các giao dịch
        fetchTransactions: async () => {
          const wallet = get().wallet
          if (!wallet) return

          set({ isLoading: true, error: null })
          
          try {
            // TODO: Thay thế bằng lệnh gọi API thực tế
            const response = await fetch(`/api/transactions/${wallet.address}`)
            
            if (!response.ok) {
              throw new Error('Failed to fetch transactions')
            }

            const transactions = await response.json()
            
            set({ 
              transactions,
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

        // Hành động gửi tiền điện tử
        sendCrypto: async (to: string, amount: number, currency: string) => {
          const wallet = get().wallet
          if (!wallet) {
            set({ error: 'No wallet connected' })
            return
          }

          set({ isLoading: true, error: null })
          
          try {
            // TODO: Thay thế bằng giao dịch blockchain thực tế
            const response = await fetch('/api/wallet/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                from: wallet.address, 
                to, 
                amount, 
                currency 
              }),
            })

            if (!response.ok) {
              throw new Error('Transaction failed')
            }

            const transaction = await response.json()
            
            // Thêm giao dịch vào lịch sử
            get().addTransaction(transaction)
            
            // Cập nhật số dư
            get().updateBalance(wallet.balance - amount)
            
            set({ 
              isLoading: false,
              error: null 
            })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Transaction failed',
              isLoading: false 
            })
          }
        },

        // Hành động xóa lỗi
        clearError: () => {
          set({ error: null })
        },
      }),
      {
        name: 'wallet-storage',
        partialize: (state) => ({ 
          wallet: state.wallet,
          transactions: state.transactions.slice(0, 50), // Chỉ lưu trữ 50 giao dịch gần nhất
        }),
      }
    ),
    {
      name: 'WalletStore',
    }
  )
)

// Selectors
export const useWallet = () => useWalletStore((state) => state.wallet)
export const useTransactions = () => useWalletStore((state) => state.transactions)
export const useWalletActions = () => useWalletStore((state) => ({
  connectWallet: state.connectWallet,
  disconnectWallet: state.disconnectWallet,
  sendCrypto: state.sendCrypto,
}))

