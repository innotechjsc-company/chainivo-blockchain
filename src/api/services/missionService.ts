/**
 * Mission Service
 * Daily missions and rewards management API calls
 */

import { apiRequest } from '../axios'
import { API_ENDPOINTS } from '../config'
import type {
  Mission,
  DailyStreak,
  ApiResponse,
} from '../types'

export const missionService = {
  /**
   * Get all missions
   */
  getAllMissions: async (params?: {
    type?: 'daily' | 'weekly' | 'special'
    status?: 'available' | 'in_progress' | 'completed'
  }): Promise<ApiResponse<Mission[]>> => {
    return apiRequest.get<Mission[]>(
      API_ENDPOINTS.MISSION.GET_ALL,
      { params }
    )
  },
  
  /**
   * Get active missions
   */
  getActiveMissions: async (): Promise<ApiResponse<Mission[]>> => {
    return apiRequest.get<Mission[]>(API_ENDPOINTS.MISSION.GET_ACTIVE)
  },
  
  /**
   * Get mission details
   */
  getMissionDetail: async (id: string): Promise<ApiResponse<Mission>> => {
    return apiRequest.get<Mission>(
      API_ENDPOINTS.MISSION.GET_MISSION_DETAIL(id)
    )
  },
  
  /**
   * Start a mission
   */
  startMission: async (id: string): Promise<ApiResponse<Mission>> => {
    return apiRequest.post<Mission>(
      API_ENDPOINTS.MISSION.START_MISSION(id)
    )
  },
  
  /**
   * Complete a mission
   */
  completeMission: async (id: string, data?: {
    proof?: string
  }): Promise<ApiResponse<Mission>> => {
    return apiRequest.post<Mission>(
      API_ENDPOINTS.MISSION.COMPLETE_MISSION(id),
      data
    )
  },
  
  /**
   * Claim mission reward
   */
  claimReward: async (id: string): Promise<ApiResponse<{
    mission: Mission
    reward: any
  }>> => {
    return apiRequest.post(API_ENDPOINTS.MISSION.CLAIM_REWARD(id))
  },
  
  /**
   * Get daily streak info
   */
  getDailyStreak: async (): Promise<ApiResponse<DailyStreak>> => {
    return apiRequest.get<DailyStreak>(API_ENDPOINTS.MISSION.GET_DAILY_STREAK)
  },
}

