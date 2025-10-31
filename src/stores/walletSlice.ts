import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Wallet, Transaction, WalletBalance } from './types';

interface WalletState {
  wallet: Wallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  wallet: null,
  transactions: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const connectWallet = createAsyncThunk(
  'wallet/connect',
  async (address: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/wallet/${address}`);

      if (!response.ok) {
        throw new Error('Failed to connect wallet');
      }

      const walletData = await response.json();
      return walletData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Connection failed'
      );
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async (address: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/transactions/${address}`);

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const transactions = await response.json();
      return transactions;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Fetch failed');
    }
  }
);

export const sendCrypto = createAsyncThunk(
  'wallet/sendCrypto',
  async (
    { to, amount, currency }: { to: string; amount: number; currency: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { wallet: WalletState };
      const wallet = state.wallet.wallet;

      if (!wallet) {
        throw new Error('No wallet connected');
      }

      const response = await fetch('/api/wallet/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: wallet.address,
          to,
          amount,
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error('Transaction failed');
      }

      const transaction = await response.json();
      return { transaction, amount };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Transaction failed'
      );
    }
  }
);

// Slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletBalance: (state, action: PayloadAction<string>) => {
      state.wallet = {
        address: action.payload,
      };
    },
    disconnectWallet: (state) => {
      state.wallet = null;
      state.transactions = [];
      state.error = null;
    },
    updateBalance: (state, action: PayloadAction<WalletBalance>) => {
      if (state.wallet) {
        state.wallet.balance = {
          token: action.payload.token || "ALL",
          can: action.payload.can || 0,
          usdt: action.payload.usdt || 0,
          pol: action.payload.pol || 0,
        };
      }
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions = [action.payload, ...state.transactions];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Connect wallet
    builder
      .addCase(connectWallet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.wallet = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });

    // Fetch transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });

    // Send crypto
    builder
      .addCase(sendCrypto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendCrypto.fulfilled, (state, action) => {
        state.transactions = [action.payload.transaction, ...state.transactions];
        if (state.wallet) {
          if(state.wallet.balance){
            state.wallet.balance = {
            ...state.wallet.balance,
            can: state.wallet.balance.can - action.payload.amount,
          };
        }
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendCrypto.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

export const { disconnectWallet, updateBalance, addTransaction, clearError, setWalletBalance } =
  walletSlice.actions;
export default walletSlice.reducer;
