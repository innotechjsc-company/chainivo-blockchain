/**
 * Notification Service
 * Notification management API calls
 */

import { apiRequest } from '../axios'
import { API_ENDPOINTS } from '../config'
import type {
  Notification,
  ApiResponse,
  PaginatedResponse,
} from '../types'

export const notificationService = {
  /**
   * Get all notifications
   */
  getAllNotifications: async (params?: {
    page?: number
    limit?: number
    read?: boolean
    type?: string
  }): Promise<PaginatedResponse<Notification>> => {
    return apiRequest.get<Notification[]>(
      API_ENDPOINTS.NOTIFICATION.GET_ALL,
      { params }
    ) as Promise<PaginatedResponse<Notification>>
  },
  
  /**
   * Mark notification as read
   */
  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    return apiRequest.patch<Notification>(
      API_ENDPOINTS.NOTIFICATION.MARK_AS_READ(id)
    )
  },
  
  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    return apiRequest.patch<void>(
      API_ENDPOINTS.NOTIFICATION.MARK_ALL_AS_READ
    )
  },
  
  /**
   * Delete notification
   */
  deleteNotification: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest.delete<void>(
      API_ENDPOINTS.NOTIFICATION.DELETE_NOTIFICATION(id)
    )
  },
  
  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    return apiRequest.get<{ count: number }>(
      API_ENDPOINTS.NOTIFICATION.GET_UNREAD_COUNT
    )
  },
}

