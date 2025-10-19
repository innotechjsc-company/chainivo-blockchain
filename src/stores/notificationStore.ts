import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Notification } from './types'

interface NotificationState {
  // Trạng thái
  notifications: Notification[]
  unreadCount: number

  // Hành động
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

/**
 * Notification Store - Quản lý thông báo trong ứng dụng
 * 
 * Tính năng:
 * - Tích hợp Redux DevTools
 * - Theo dõi số lượng chưa đọc
 * - ID và timestamp tự động tạo
 */
export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      // Trạng thái ban đầu
      notifications: [],
      unreadCount: 0,

      // Hành động thêm thông báo
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          read: false,
        }

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
      },

      // Hành động đánh dấu đã đọc
      markAsRead: (id: string) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id)
          if (!notification || notification.read) {
            return state
          }

          return {
            notifications: state.notifications.map(n =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }
        })
      },

      // Hành động đánh dấu tất cả đã đọc
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0,
        }))
      },

      // Hành động xóa thông báo
      removeNotification: (id: string) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id)
          const unreadDecrement = notification && !notification.read ? 1 : 0

          return {
            notifications: state.notifications.filter(n => n.id !== id),
            unreadCount: Math.max(0, state.unreadCount - unreadDecrement),
          }
        })
      },

      // Hành động xóa tất cả
      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
        })
      },
    }),
    {
      name: 'NotificationStore',
    }
  )
)

// Selectors
export const useNotifications = () => useNotificationStore((state) => state.notifications)
export const useUnreadCount = () => useNotificationStore((state) => state.unreadCount)
export const useUnreadNotifications = () => useNotificationStore((state) => 
  state.notifications.filter(n => !n.read)
)
export const useNotificationActions = () => useNotificationStore((state) => ({
  addNotification: state.addNotification,
  markAsRead: state.markAsRead,
  markAllAsRead: state.markAllAsRead,
  removeNotification: state.removeNotification,
}))

