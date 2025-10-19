import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from './types'

interface UserState {
  // Trạng thái
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Hành động
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, username: string) => Promise<void>
  updateProfile: (data: Partial<User>) => void
  setUser: (user: User | null) => void
  clearError: () => void
}

/**
 * User Store - Quản lý xác thực và hồ sơ người dùng
 * 
 * Tính năng:
 * - Được lưu trữ trong localStorage
 * - Tích hợp Redux DevTools
 * - Quản lý trạng thái xác thực
 */
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // Trạng thái ban đầu
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Hành động đăng nhập
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null })
          
          try {
            // TODO: Thay thế bằng lệnh gọi API thực tế
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
              throw new Error('Login failed')
            }

            const user = await response.json()
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Login failed',
              isLoading: false 
            })
          }
        },

        // Hành động đăng xuất
        logout: () => {
          set({ 
            user: null, 
            isAuthenticated: false,
            error: null 
          })
        },

        // Hành động đăng ký
        register: async (email: string, password: string, username: string) => {
          set({ isLoading: true, error: null })
          
          try {
            // TODO: Thay thế bằng lệnh gọi API thực tế
            const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password, username }),
            })

            if (!response.ok) {
              throw new Error('Registration failed')
            }

            const user = await response.json()
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            })
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Registration failed',
              isLoading: false 
            })
          }
        },

        // Hành động cập nhật hồ sơ
        updateProfile: (data: Partial<User>) => {
          const currentUser = get().user
          if (currentUser) {
            set({ 
              user: { ...currentUser, ...data } 
            })
          }
        },

        // Hành động thiết lập người dùng
        setUser: (user: User | null) => {
          set({ 
            user, 
            isAuthenticated: !!user 
          })
        },

        // Hành động xóa lỗi
        clearError: () => {
          set({ error: null })
        },
      }),
      {
        name: 'user-storage', // Khóa localStorage
        partialize: (state) => ({ 
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'UserStore', // Tên DevTools
    }
  )
)

// Selectors để tối ưu hóa việc re-render
export const useUser = () => useUserStore((state) => state.user)
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated)
export const useUserActions = () => useUserStore((state) => ({
  login: state.login,
  logout: state.logout,
  register: state.register,
  updateProfile: state.updateProfile,
}))

