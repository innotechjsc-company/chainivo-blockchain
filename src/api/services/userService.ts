/**
 * User Service
 * User profile and settings management API calls
 */

import { apiRequest, uploadFile } from '../axios'
import { API_ENDPOINTS } from '../config'
import type {
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserPreferences,
  ApiResponse,
} from '../types'

export const userService = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<ApiResponse<any>> => {
    return apiRequest.get(API_ENDPOINTS.USER.GET_PROFILE)
  },
  
  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<any>> => {
    return apiRequest.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data)
  },
  
  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
    return apiRequest.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, data)
  },
  
  /**
   * Upload user avatar
   */
  uploadAvatar: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ url: string }>> => {
    return uploadFile(API_ENDPOINTS.USER.UPLOAD_AVATAR, file, onProgress)
  },
  
  /**
   * Get user preferences
   */
  getPreferences: async (): Promise<ApiResponse<UserPreferences>> => {
    return apiRequest.get<UserPreferences>(API_ENDPOINTS.USER.GET_PREFERENCES)
  },
  
  /**
   * Update user preferences
   */
  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> => {
    return apiRequest.put<UserPreferences>(
      API_ENDPOINTS.USER.UPDATE_PREFERENCES,
      preferences
    )
  },
}

