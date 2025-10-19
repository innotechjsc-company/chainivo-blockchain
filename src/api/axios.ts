/**
 * Axios Instance Configuration
 * Main axios instance with interceptors and error handling
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG, STORAGE_KEYS } from './config'
import type { ApiError, ApiResponse } from './types'

/**
 * Create axios instance with default configuration
 */
export const axiosInstance = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

/**
 * Token management utilities
 */
export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  },
  
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  },
  
  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  },
  
  clearTokens: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
  },
}

/**
 * Request Interceptor
 * Adds authentication token to requests
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add access token to request headers
    const token = tokenManager.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data,
      })
    }
    
    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handles response transformation and error handling
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }
    
    return response
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      })
    }
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Try to refresh the token
        const refreshToken = tokenManager.getRefreshToken()
        
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }
        
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.data
        
        // Save new tokens
        tokenManager.setTokens(accessToken, newRefreshToken)
        
        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }
        
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Refresh token failed - logout user
        console.error('Failed to refresh token:', refreshError)
        tokenManager.clearTokens()
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        
        return Promise.reject(refreshError)
      }
    }
    
    // Handle specific error codes
    const errorData = error.response?.data
    
    // Format error message
    const errorMessage = errorData?.error?.message || error.message || 'An unexpected error occurred'
    
    // Create standardized error object
    const standardError: ApiError = {
      success: false,
      error: {
        code: errorData?.error?.code || `HTTP_${error.response?.status || 'UNKNOWN'}`,
        message: errorMessage,
        details: errorData?.error?.details || error.response?.data,
      },
      timestamp: new Date().toISOString(),
    }
    
    return Promise.reject(standardError)
  }
)

/**
 * Helper function for making API requests with better typing
 */
export const apiRequest = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return axiosInstance.get(url, config).then(res => res.data)
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return axiosInstance.post(url, data, config).then(res => res.data)
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return axiosInstance.put(url, data, config).then(res => res.data)
  },
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return axiosInstance.patch(url, data, config).then(res => res.data)
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return axiosInstance.delete(url, config).then(res => res.data)
  },
}

/**
 * Upload file helper
 */
export const uploadFile = async (
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<{ url: string }>> => {
  const formData = new FormData()
  formData.append('file', file)
  
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percentCompleted)
      }
    },
  }
  
  return apiRequest.post(url, formData, config)
}

export default axiosInstance

