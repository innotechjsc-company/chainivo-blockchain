import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Mission } from './types'

interface MissionState {
  // Trạng thái
  missions: Mission[]
  completedMissions: string[] // Mảng ID các nhiệm vụ đã hoàn thành
  dailyStreak: number
  totalRewardsEarned: number
  isLoading: boolean
  error: string | null

  // Hành động
  fetchMissions: () => Promise<void>
  completeMission: (missionId: string) => Promise<void>
  claimReward: (missionId: string) => Promise<void>
  updateProgress: (missionId: string, progress: number) => void
  resetDailyMissions: () => void
  incrementStreak: () => void
  clearError: () => void
}

/**
 * Mission Store - Quản lý các nhiệm vụ hàng ngày và phần thưởng
 * 
 * Tính năng:
 * - Được lưu trữ trong localStorage
 * - Tích hợp Redux DevTools
 * - Theo dõi nhiệm vụ hàng ngày
 * - Hệ thống chuỗi ngày liên tiếp
 */
export const useMissionStore = create<MissionState>()(
  devtools(
    persist(
      (set, get) => ({
        // Trạng thái ban đầu
        missions: [],
        completedMissions: [],
        dailyStreak: 0,
        totalRewardsEarned: 0,
        isLoading: false,
        error: null,

        // Hành động lấy nhiệm vụ
        fetchMissions: async () => {
          set({ isLoading: true, error: null })
          
          try {
            // TODO: Thay thế bằng lệnh gọi API thực tế
            const response = await fetch('/api/missions')
            
            if (!response.ok) {
              throw new Error('Failed to fetch missions')
            }

            const missions = await response.json()
            
            set({ 
              missions,
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

        // Hành động hoàn thành nhiệm vụ
        completeMission: async (missionId: string) => {
          set({ isLoading: true, error: null })
          
          try {
            // TODO: Thay thế bằng lệnh gọi API thực tế
            const response = await fetch(`/api/missions/${missionId}/complete`, {
              method: 'POST',
            })

            if (!response.ok) {
              throw new Error('Failed to complete mission')
            }

            set((state) => ({
              missions: state.missions.map(mission =>
                mission.id === missionId
                  ? { ...mission, completed: true, progress: mission.target }
                  : mission
              ),
              completedMissions: [...state.completedMissions, missionId],
              isLoading: false,
              error: null,
            }))
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Completion failed',
              isLoading: false 
            })
          }
        },

        // Hành động nhận thưởng
        claimReward: async (missionId: string) => {
          const mission = get().missions.find(m => m.id === missionId)
          if (!mission || !mission.completed) {
            set({ error: 'Mission not completed' })
            return
          }

          set({ isLoading: true, error: null })
          
          try {
            // TODO: Thay thế bằng lệnh gọi API thực tế
            const response = await fetch(`/api/missions/${missionId}/claim`, {
              method: 'POST',
            })

            if (!response.ok) {
              throw new Error('Failed to claim reward')
            }

            set((state) => ({
              totalRewardsEarned: state.totalRewardsEarned + mission.reward,
              isLoading: false,
              error: null,
            }))

            // Tăng chuỗi ngày liên tiếp nếu là nhiệm vụ hàng ngày
            get().incrementStreak()
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Claim failed',
              isLoading: false 
            })
          }
        },

        // Hành động cập nhật tiến độ
        updateProgress: (missionId: string, progress: number) => {
          set((state) => ({
            missions: state.missions.map(mission =>
              mission.id === missionId
                ? {
                    ...mission,
                    progress,
                    completed: progress >= mission.target,
                  }
                : mission
            ),
          }))

          // Tự động hoàn thành nếu đạt mục tiêu
          const mission = get().missions.find(m => m.id === missionId)
          if (mission && progress >= mission.target && !mission.completed) {
            get().completeMission(missionId)
          }
        },

        // Hành động reset nhiệm vụ hàng ngày
        resetDailyMissions: () => {
          set((state) => ({
            missions: state.missions.map(mission => ({
              ...mission,
              progress: 0,
              completed: false,
            })),
            completedMissions: [],
          }))
        },

        // Hành động tăng chuỗi ngày liên tiếp
        incrementStreak: () => {
          set((state) => ({ 
            dailyStreak: state.dailyStreak + 1 
          }))
        },

        // Hành động xóa lỗi
        clearError: () => {
          set({ error: null })
        },
      }),
      {
        name: 'mission-storage',
      }
    ),
    {
      name: 'MissionStore',
    }
  )
)

// Selectors
export const useMissions = () => useMissionStore((state) => state.missions)
export const useActiveMissions = () => useMissionStore((state) => 
  state.missions.filter(m => !m.completed)
)
export const useCompletedMissions = () => useMissionStore((state) => 
  state.missions.filter(m => m.completed)
)
export const useDailyStreak = () => useMissionStore((state) => state.dailyStreak)
export const useMissionActions = () => useMissionStore((state) => ({
  fetchMissions: state.fetchMissions,
  completeMission: state.completeMission,
  claimReward: state.claimReward,
  updateProgress: state.updateProgress,
}))

