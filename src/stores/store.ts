import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import reducers
import authReducer from './authSlice';
import userReducer from './userSlice';
import walletReducer from './walletSlice';
import investmentReducer from './investmentSlice';
import nftReducer from './nftSlice';
import missionReducer from './missionSlice';
import notificationReducer from './notificationSlice';

// Persist configurations for different slices
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'],
};

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['user', 'isAuthenticated'],
};

const walletPersistConfig = {
  key: 'wallet',
  storage,
  whitelist: ['wallet'],
  blacklist: ['transactions'], // Don't persist all transactions, only wallet info
};

const investmentPersistConfig = {
  key: 'investment',
  storage,
};

const missionPersistConfig = {
  key: 'mission',
  storage,
  whitelist: ['completedMissions', 'dailyStreak', 'totalRewardsEarned'],
};

// Root reducer with persisted slices
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: persistReducer(userPersistConfig, userReducer),
  wallet: persistReducer(walletPersistConfig, walletReducer),
  investment: persistReducer(investmentPersistConfig, investmentReducer),
  nft: nftReducer, // NFT not persisted
  mission: persistReducer(missionPersistConfig, missionReducer),
  notification: notificationReducer, // Notifications not persisted
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
