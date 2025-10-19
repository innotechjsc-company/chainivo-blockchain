/**
 * Authentication Service
 * All authentication-related API calls
 */

import { apiRequest, tokenManager } from '../axios'
import { API_ENDPOINTS } from '../config'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ApiResponse,
} from '../types'

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiRequest.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    
    // Save tokens to localStorage
    if (response.success && response.data) {
      tokenManager.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      )
    }
    
    return response
  },
  
  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiRequest.post<LoginResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    )
    
    // Save tokens to localStorage after successful registration
    if (response.success && response.data) {
      tokenManager.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      )
    }
    
    return response
  },
  
  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const response = await apiRequest.post<void>(API_ENDPOINTS.AUTH.LOGOUT)
      return response
    } finally {
      // Always clear tokens, even if API call fails
      tokenManager.clearTokens()
    }
  },
  
  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> => {
    const response = await apiRequest.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken }
    )
    
    // Update tokens
    if (response.success && response.data) {
      tokenManager.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      )
    }
    
    return response
  },
  
  /**
   * Verify email
   */
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    return apiRequest.post<void>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
  },
  
  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return apiRequest.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
  },
  
  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<void>> => {
    return apiRequest.post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    })
  },
  
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<LoginResponse['user']>> => {
    return apiRequest.get<LoginResponse['user']>(API_ENDPOINTS.AUTH.PROFILE)
  },
}

