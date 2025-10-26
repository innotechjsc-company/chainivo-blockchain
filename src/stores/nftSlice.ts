import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NFT } from './types';

interface NFTFilters {
  collection?: string;
  rarity?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface NFTState {
  nfts: NFT[];
  userNFTs: NFT[];
  selectedNFT: NFT | null;
  filters: NFTFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: NFTState = {
  nfts: [],
  userNFTs: [],
  selectedNFT: null,
  filters: {},
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchNFTs = createAsyncThunk(
  'nft/fetchNFTs',
  async (filters: NFTFilters | undefined, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
      const response = await fetch(`/api/nfts?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch NFTs');
      }

      const nfts = await response.json();
      return nfts;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Fetch failed');
    }
  }
);

export const fetchUserNFTs = createAsyncThunk(
  'nft/fetchUserNFTs',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/nfts/user/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user NFTs');
      }

      const userNFTs = await response.json();
      return userNFTs;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Fetch failed');
    }
  }
);

export const buyNFT = createAsyncThunk(
  'nft/buyNFT',
  async (nftId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/nfts/${nftId}/buy`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to buy NFT');
      }

      const boughtNFT = await response.json();
      return boughtNFT;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Purchase failed'
      );
    }
  }
);

export const sellNFT = createAsyncThunk(
  'nft/sellNFT',
  async ({ nftId, price }: { nftId: string; price: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/nfts/${nftId}/sell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price }),
      });

      if (!response.ok) {
        throw new Error('Failed to sell NFT');
      }

      return nftId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Sale failed');
    }
  }
);

// Slice
const nftSlice = createSlice({
  name: 'nft',
  initialState,
  reducers: {
    selectNFT: (state, action: PayloadAction<NFT>) => {
      state.selectedNFT = action.payload;
    },
    setFilters: (state, action: PayloadAction<NFTFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch NFTs
    builder
      .addCase(fetchNFTs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNFTs.fulfilled, (state, action) => {
        state.nfts = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchNFTs.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });

    // Fetch user NFTs
    builder
      .addCase(fetchUserNFTs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserNFTs.fulfilled, (state, action) => {
        state.userNFTs = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUserNFTs.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });

    // Buy NFT
    builder
      .addCase(buyNFT.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(buyNFT.fulfilled, (state, action) => {
        state.userNFTs = [...state.userNFTs, action.payload];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(buyNFT.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });

    // Sell NFT
    builder
      .addCase(sellNFT.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sellNFT.fulfilled, (state, action) => {
        state.userNFTs = state.userNFTs.filter((nft) => nft.id !== action.payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sellNFT.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

export const { selectNFT, setFilters, clearFilters, clearError } = nftSlice.actions;
export default nftSlice.reducer;
