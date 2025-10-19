/**
 * Investment Service
 * Investment portfolio management API calls
 */

import { apiRequest } from '../axios'
import { API_ENDPOINTS } from '../config'
import type {
  Investment,
  PortfolioSummary,
  CreateInvestmentRequest,
  ApiResponse,
} from '../types'

export const investmentService = {
  /**
   * Get portfolio summary
   */
  getPortfolio: async (): Promise<ApiResponse<PortfolioSummary>> => {
    return apiRequest.get<PortfolioSummary>(API_ENDPOINTS.INVESTMENT.GET_PORTFOLIO)
  },
  
  /**
   * Get all investments
   */
  getInvestments: async (params?: {
    type?: string
    status?: string
  }): Promise<ApiResponse<Investment[]>> => {
    return apiRequest.get<Investment[]>(
      API_ENDPOINTS.INVESTMENT.GET_INVESTMENTS,
      { params }
    )
  },
  
  /**
   * Get investment details
   */
  getInvestmentDetail: async (id: string): Promise<ApiResponse<Investment>> => {
    return apiRequest.get<Investment>(
      API_ENDPOINTS.INVESTMENT.GET_INVESTMENT_DETAIL(id)
    )
  },
  
  /**
   * Create new investment
   */
  createInvestment: async (data: CreateInvestmentRequest): Promise<ApiResponse<Investment>> => {
    return apiRequest.post<Investment>(
      API_ENDPOINTS.INVESTMENT.CREATE_INVESTMENT,
      data
    )
  },
  
  /**
   * Update investment
   */
  updateInvestment: async (
    id: string,
    data: Partial<CreateInvestmentRequest>
  ): Promise<ApiResponse<Investment>> => {
    return apiRequest.put<Investment>(
      API_ENDPOINTS.INVESTMENT.UPDATE_INVESTMENT(id),
      data
    )
  },
  
  /**
   * Delete investment
   */
  deleteInvestment: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest.delete<void>(
      API_ENDPOINTS.INVESTMENT.DELETE_INVESTMENT(id)
    )
  },
  
  /**
   * Get investment performance
   */
  getPerformance: async (params?: {
    period?: 'day' | 'week' | 'month' | 'year' | 'all'
  }): Promise<ApiResponse<{
    labels: string[]
    values: number[]
  }>> => {
    return apiRequest.get(
      API_ENDPOINTS.INVESTMENT.GET_PERFORMANCE,
      { params }
    )
  },
}

