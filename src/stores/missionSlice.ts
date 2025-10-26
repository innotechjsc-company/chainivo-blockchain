import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Mission } from './types';

interface MissionState {
  missions: Mission[];
  completedMissions: string[];
  dailyStreak: number;
  totalRewardsEarned: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: MissionState = {
  missions: [],
  completedMissions: [],
  dailyStreak: 0,
  totalRewardsEarned: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchMissions = createAsyncThunk(
  'mission/fetchMissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/missions');

      if (!response.ok) {
        throw new Error('Failed to fetch missions');
      }

      const missions = await response.json();
      return missions;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Fetch failed');
    }
  }
);

export const completeMission = createAsyncThunk(
  'mission/completeMission',
  async (missionId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/missions/${missionId}/complete`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to complete mission');
      }

      return missionId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Completion failed'
      );
    }
  }
);

export const claimReward = createAsyncThunk(
  'mission/claimReward',
  async (missionId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { mission: MissionState };
      const mission = state.mission.missions.find((m) => m.id === missionId);

      if (!mission || !mission.completed) {
        throw new Error('Mission not completed');
      }

      const response = await fetch(`/api/missions/${missionId}/claim`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to claim reward');
      }

      return { missionId, reward: mission.reward };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Claim failed');
    }
  }
);

// Slice
const missionSlice = createSlice({
  name: 'mission',
  initialState,
  reducers: {
    updateProgress: (
      state,
      action: PayloadAction<{ missionId: string; progress: number }>
    ) => {
      const { missionId, progress } = action.payload;
      state.missions = state.missions.map((mission) => {
        if (mission.id === missionId) {
          return {
            ...mission,
            progress,
            completed: progress >= mission.target,
          };
        }
        return mission;
      });
    },
    resetDailyMissions: (state) => {
      state.missions = state.missions.map((mission) => ({
        ...mission,
        progress: 0,
        completed: false,
      }));
      state.completedMissions = [];
    },
    incrementStreak: (state) => {
      state.dailyStreak += 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch missions
    builder
      .addCase(fetchMissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMissions.fulfilled, (state, action) => {
        state.missions = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchMissions.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });

    // Complete mission
    builder
      .addCase(completeMission.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeMission.fulfilled, (state, action) => {
        const missionId = action.payload;
        state.missions = state.missions.map((mission) =>
          mission.id === missionId
            ? { ...mission, completed: true, progress: mission.target }
            : mission
        );
        state.completedMissions = [...state.completedMissions, missionId];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(completeMission.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });

    // Claim reward
    builder
      .addCase(claimReward.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(claimReward.fulfilled, (state, action) => {
        state.totalRewardsEarned += action.payload.reward;
        state.dailyStreak += 1;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(claimReward.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

export const { updateProgress, resetDailyMissions, incrementStreak, clearError } =
  missionSlice.actions;
export default missionSlice.reducer;
