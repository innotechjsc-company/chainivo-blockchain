# Zustand Stores - Tham Khảo Nhanh

## 📦 Cài Đặt
```bash
npm install zustand
```
**Phiên bản**: 5.0.8 (Mới nhất)

## 🎯 Các Store Hiện Có

### 1. User Store
```typescript
import { useUserStore, useUser, useIsAuthenticated } from '@/stores'

// Store đầy đủ
const { login, logout, register, updateProfile } = useUserStore()

// Selectors tối ưu
const user = useUser()
const isAuthenticated = useIsAuthenticated()
```

### 2. Wallet Store
```typescript
import { useWalletStore, useWallet, useTransactions } from '@/stores'

const { connectWallet, disconnectWallet, sendCrypto } = useWalletStore()
const wallet = useWallet()
const transactions = useTransactions()
```

### 3. Investment Store
```typescript
import { useInvestmentStore, usePortfolioSummary } from '@/stores'

const { addInvestment, removeInvestment, fetchInvestments } = useInvestmentStore()
const { totalValue, totalProfitLoss, investmentCount } = usePortfolioSummary()
```

### 4. NFT Store
```typescript
import { useNFTStore, useUserNFTs } from '@/stores'

const { fetchNFTs, buyNFT, sellNFT } = useNFTStore()
const userNFTs = useUserNFTs()
```

### 5. Mission Store
```typescript
import { useMissionStore, useActiveMissions, useDailyStreak } from '@/stores'

const { completeMission, claimReward } = useMissionStore()
const activeMissions = useActiveMissions()
const streak = useDailyStreak()
```

### 6. Notification Store
```typescript
import { useNotificationStore, useUnreadCount } from '@/stores'

const { addNotification, markAsRead } = useNotificationStore()
const unreadCount = useUnreadCount()
```

## 🚀 Bắt Đầu Nhanh

### Sử Dụng Cơ Bản trong Component
```typescript
'use client'

import { useUser } from '@/stores'

export default function Profile() {
  const user = useUser()
  
  if (!user) return <div>Chưa đăng nhập</div>
  
  return <div>Chào mừng, {user.username}!</div>
}
```

### Với Hành Động
```typescript
'use client'

import { useWalletStore } from '@/stores'

export default function WalletConnect() {
  const { connectWallet, isLoading, error } = useWalletStore()
  
  const handleConnect = async () => {
    await connectWallet('0x...')
  }
  
  return (
    <button onClick={handleConnect} disabled={isLoading}>
      {isLoading ? 'Đang kết nối...' : 'Kết nối ví'}
    </button>
  )
}
```

## 📚 Tài Liệu Đầy Đủ
Xem [ZUSTAND_GUIDE.md](../../../ZUSTAND_GUIDE.md) để biết tài liệu đầy đủ.

## 🎨 Demo
Truy cập `/examples/zustand-demo` để xem tất cả các store hoạt động.

