# Chainivo API Module

Complete API integration using Axios with TypeScript support, interceptors, and service modules.

## 📦 Installation

Axios has been installed with the latest version:

```bash
npm install axios@latest
```

## 🏗️ Structure

```
src/api/
├── index.ts                    # Main entry point
├── config.ts                   # API configuration and endpoints
├── types.ts                    # TypeScript types
├── axios.ts                    # Axios instance with interceptors
├── services/                   # Service modules
│   ├── authService.ts         # Authentication
│   ├── userService.ts         # User management
│   ├── walletService.ts       # Wallet & transactions
│   ├── investmentService.ts   # Investment portfolio
│   ├── nftService.ts          # NFT marketplace
│   ├── missionService.ts      # Daily missions
│   ├── notificationService.ts # Notifications
│   ├── blockchainService.ts   # Blockchain data
│   └── index.ts               # Services export
└── README.md                   # This file
```

## 🚀 Quick Start

### Import Services

```typescript
import { 
  authService, 
  walletService, 
  investmentService,
  nftService 
} from '@/api'
```

### Basic Usage

```typescript
// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
})

// Get wallet balance
const balance = await walletService.getBalance()

// Get NFT collection
const nfts = await nftService.getUserNFTs()

// Send transaction
const tx = await walletService.sendTransaction({
  to: '0x...',
  amount: '1.5',
  currency: 'CHAIN'
})
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.chainivo.com
```

### API Configuration

Edit `src/api/config.ts` to customize:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.chainivo.com',
  TIMEOUT: 30000,
  API_VERSION: 'v1',
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}
```

## 🔐 Authentication

The API module automatically handles authentication:

### Automatic Token Management

```typescript
import { tokenManager } from '@/api'

// Check if authenticated
const isAuthenticated = !!tokenManager.getAccessToken()

// Manually clear tokens (logout)
tokenManager.clearTokens()
```

### Auto Refresh Tokens

The axios instance automatically:
- Adds Bearer token to all requests
- Refreshes expired tokens
- Redirects to login on auth failure

## 📝 TypeScript Support

All API calls are fully typed:

```typescript
import { LoginRequest, LoginResponse, ApiResponse } from '@/api'

const loginData: LoginRequest = {
  email: 'user@example.com',
  password: 'password123'
}

const response: ApiResponse<LoginResponse> = await authService.login(loginData)

if (response.success) {
  console.log(response.data.user.username)
  console.log(response.data.tokens.accessToken)
}
```

## 🛠️ Services

### Auth Service

```typescript
import { authService } from '@/api'

// Login
await authService.login({ email, password })

// Register
await authService.register({ email, username, password })

// Logout
await authService.logout()

// Forgot password
await authService.forgotPassword(email)

// Reset password
await authService.resetPassword(token, newPassword)
```

### Wallet Service

```typescript
import { walletService } from '@/api'

// Get balance
const balance = await walletService.getBalance()

// Get transactions
const transactions = await walletService.getTransactions({
  page: 1,
  limit: 20,
  type: 'send'
})

// Send transaction
const tx = await walletService.sendTransaction({
  to: '0x...',
  amount: '1.5',
  currency: 'CHAIN'
})

// Generate new address
const address = await walletService.generateAddress('CHAIN')
```

### Investment Service

```typescript
import { investmentService } from '@/api'

// Get portfolio
const portfolio = await investmentService.getPortfolio()

// Get all investments
const investments = await investmentService.getInvestments()

// Create investment
const investment = await investmentService.createInvestment({
  name: 'Bitcoin',
  type: 'crypto',
  amount: '1000',
  currency: 'USD'
})

// Delete investment
await investmentService.deleteInvestment(id)
```

### NFT Service

```typescript
import { nftService } from '@/api'

// Browse marketplace
const nfts = await nftService.getAllNFTs({
  page: 1,
  limit: 20,
  rarity: 'legendary',
  sortBy: 'price'
})

// Get user collection
const myNFTs = await nftService.getUserNFTs()

// Buy NFT
await nftService.buyNFT(id, { paymentMethod: 'wallet' })

// Sell NFT
await nftService.sellNFT(id, { price: '100', currency: 'CHAIN' })

// Transfer NFT
await nftService.transferNFT(id, { toAddress: '0x...' })
```

### Mission Service

```typescript
import { missionService } from '@/api'

// Get all missions
const missions = await missionService.getAllMissions()

// Get active missions
const active = await missionService.getActiveMissions()

// Start mission
await missionService.startMission(id)

// Complete mission
await missionService.completeMission(id)

// Claim reward
await missionService.claimReward(id)

// Get daily streak
const streak = await missionService.getDailyStreak()
```

### Notification Service

```typescript
import { notificationService } from '@/api'

// Get all notifications
const notifications = await notificationService.getAllNotifications({
  page: 1,
  limit: 20,
  read: false
})

// Mark as read
await notificationService.markAsRead(id)

// Mark all as read
await notificationService.markAllAsRead()

// Get unread count
const { count } = await notificationService.getUnreadCount()
```

### Blockchain Service

```typescript
import { blockchainService } from '@/api'

// Get block
const block = await blockchainService.getBlock('12345')

// Get latest blocks
const blocks = await blockchainService.getLatestBlocks(10)

// Get transaction
const tx = await blockchainService.getTransaction('0x...')

// Get network stats
const stats = await blockchainService.getNetworkStats()

// Get gas price
const gasPrice = await blockchainService.getGasPrice()
```

## 🔄 Integration with Zustand Stores

### Example: User Store

```typescript
import { create } from 'zustand'
import { authService, userService } from '@/api'
import type { LoginRequest } from '@/api'

interface UserState {
  user: any | null
  isLoading: boolean
  error: string | null
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: any) => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.login(credentials)
      if (response.success) {
        set({ user: response.data.user, isLoading: false })
      }
    } catch (error: any) {
      set({ error: error.error?.message || 'Login failed', isLoading: false })
    }
  },
  
  logout: async () => {
    set({ isLoading: true })
    try {
      await authService.logout()
      set({ user: null, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
    }
  },
  
  updateProfile: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await userService.updateProfile(data)
      if (response.success) {
        set({ user: response.data, isLoading: false })
      }
    } catch (error: any) {
      set({ error: error.error?.message || 'Update failed', isLoading: false })
    }
  },
}))
```

## 🎯 Error Handling

All API errors are standardized:

```typescript
import type { ApiError } from '@/api'

try {
  await authService.login({ email, password })
} catch (error) {
  const apiError = error as ApiError
  console.error(apiError.error.code)    // 'HTTP_401'
  console.error(apiError.error.message) // 'Invalid credentials'
  console.error(apiError.error.details) // Additional error details
}
```

## 📤 File Upload

```typescript
import { uploadFile } from '@/api'

// Upload with progress tracking
const response = await uploadFile(
  '/users/avatar',
  file,
  (progress) => {
    console.log(`Upload progress: ${progress}%`)
  }
)

console.log(response.data.url) // Uploaded file URL
```

## 🔍 Direct Axios Calls

For custom endpoints not covered by services:

```typescript
import { apiRequest, axiosInstance } from '@/api'

// Using helper (recommended)
const response = await apiRequest.get('/custom/endpoint')

// Using axios instance directly
const response = await axiosInstance.get('/custom/endpoint')
```

## 🐛 Debugging

### Development Mode

API requests and responses are automatically logged in development:

```
🚀 API Request: { method: 'POST', url: '/auth/login', data: {...} }
✅ API Response: { status: 200, data: {...} }
❌ API Error: { status: 401, message: 'Invalid credentials' }
```

### Redux DevTools

If you need to debug API state, integrate with Redux DevTools via Zustand.

## 📚 Best Practices

1. **Always use services** instead of direct axios calls
2. **Handle errors** in your components/stores
3. **Use TypeScript types** for type safety
4. **Check loading states** in UI
5. **Test with mock API** during development
6. **Set environment variables** for different environments

## 🔗 Path Aliases

Import using path aliases:

```typescript
// All equivalent ways to import
import { authService } from '@/api'
import { authService } from '@api'
import { authService } from '@api/services'
```

## 📋 TODO

- [ ] Add retry logic for failed requests
- [ ] Implement request caching
- [ ] Add request cancellation
- [ ] Create mock API for testing
- [ ] Add rate limiting handling
- [ ] Implement WebSocket support

## 🤝 Contributing

When adding new endpoints:

1. Add endpoint to `config.ts`
2. Add types to `types.ts`
3. Create/update service in `services/`
4. Update this README

## 📄 License

Part of Chainivo Blockchain project.

