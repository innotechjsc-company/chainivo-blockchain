import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Investment } from './types';

interface InvestmentState {
  investments: Investment[];
  totalValue: number;
  totalProfitLoss: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: InvestmentState = {
  investments: [],
  totalValue: 0,
  totalProfitLoss: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchInvestments = createAsyncThunk(
  'investment/fetchInvestments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/investments');

      if (!response.ok) {
        throw new Error('Failed to fetch investments');
      }

      const investments = await response.json();
      return investments;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Fetch failed');
    }
  }
);

export const addInvestment = createAsyncThunk(
  'investment/addInvestment',
  async (investment: Omit<Investment, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investment),
      });

      if (!response.ok) {
        throw new Error('Failed to add investment');
      }

      const newInvestment = await response.json();
      return newInvestment;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Add failed');
    }
  }
);

// Slice
const investmentSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {
    removeInvestment: (state, action: PayloadAction<string>) => {
      state.investments = state.investments.filter((inv) => inv.id !== action.payload);
      calculateTotals(state);
    },
    updateInvestment: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Investment> }>
    ) => {
      state.investments = state.investments.map((inv) =>
        inv.id === action.payload.id ? { ...inv, ...action.payload.data } : inv
      );
      calculateTotals(state);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch investments
    builder
      .addCase(fetchInvestments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.investments = action.payload;
        calculateTotals(state);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });

    // Add investment
    builder
      .addCase(addInvestment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addInvestment.fulfilled, (state, action) => {
        state.investments = [...state.investments, action.payload];
        calculateTotals(state);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addInvestment.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

// Helper function
function calculateTotals(state: InvestmentState) {
  state.totalValue = state.investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  state.totalProfitLoss = state.investments.reduce((sum, inv) => sum + inv.profitLoss, 0);
}

export const { removeInvestment, updateInvestment, clearError } = investmentSlice.actions;
export default investmentSlice.reducer;
