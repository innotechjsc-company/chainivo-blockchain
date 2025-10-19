/**
 * API Module Index
 * Main entry point for API module
 */

// Export axios instance and utilities
export { default as axiosInstance, apiRequest, tokenManager, uploadFile } from './axios'

// Export configuration
export { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS } from './config'

// Export types
export * from './types'

// Export all services
export * from './services'

/**
 * Usage Example:
 * 
 * import { authService, walletService, tokenManager } from '@/api'
 * 
 * // Login
 * const response = await authService.login({ email: 'user@example.com', password: 'password' })
 * 
 * // Get wallet balance
 * const balance = await walletService.getBalance()
 * 
 * // Check if user is authenticated
 * const isAuthenticated = !!tokenManager.getAccessToken()
 */

