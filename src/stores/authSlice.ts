import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthService,
  type LoginCredentials,
  type RegisterData,
  type RegisterResponse,
} from "@/api/services/auth-service";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  walletAddress: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials);

      if (response.token && response.user) {
        // Map Payload CMS user to AuthUser
        const authUser: AuthUser = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name || "",
          walletAddress: response.user.walletAddress || "",
          role: response.user.role || "user",
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
        };

        return {
          user: authUser,
          token: response.token,
        };
      }

      return rejectWithValue("Đăng nhập thất bại");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đăng nhập thất bại";
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(data);

      // Registration successful - no token returned from register endpoint
      if (response.doc && response.doc.email) {
        console.log("Registration successful, user needs to login");
        return {
          success: true,
          message: response.message,
          email: response.doc.email,
        };
      }

      return rejectWithValue("Đăng ký thất bại");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đăng ký thất bại";
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await AuthService.logout();
  } catch (error) {
    console.error("Logout error:", error);
  }
});

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const success = await AuthService.refreshToken();
      if (success) {
        const token = AuthService.getToken();
        const userInfo = AuthService.getUserInfo();
        if (token && userInfo) {
          return {
            user: userInfo,
            token,
          };
        }
      }
      return rejectWithValue("Failed to refresh token");
    } catch (error) {
      console.error("Refresh token error:", error);
      return rejectWithValue("Failed to refresh token");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = AuthService.getToken();
      if (token && AuthService.isAuthenticated()) {
        const userInfo = AuthService.getUserInfo();
        if (userInfo) {
          state.user = userInfo;
          state.token = token;
          state.isAuthenticated = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    });

    // Refresh token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, updateProfile, clearError, initializeAuth } =
  authSlice.actions;
export default authSlice.reducer;
