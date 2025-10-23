# Membership Shop Screen - Restructured

## Cấu trúc mới theo AGENT.md

```
membership-shop-screen/
├── index.tsx              # File giao diện chính (composition pattern)
├── components/            # Components đặc thù cho screen này
│   ├── index.ts
│   ├── TierPackagesCard.tsx
│   ├── UserTierInfoCard.tsx
│   ├── P2PMarketplaceCard.tsx
│   ├── RealtimeHistoryCard.tsx
│   └── TransactionTrendsCard.tsx
├── hooks/                 # Custom hooks đặc thù cho screen này
│   ├── index.ts
│   ├── useMembershipTiers.ts
│   ├── useP2PListings.ts
│   ├── useUserMembership.ts
│   ├── useRealtimeHistory.ts
│   └── useTransactionTrends.ts
└── README.md
```

## Nguyên tắc được áp dụng

### 1. Composition Pattern (index.tsx)

- **Fetch dữ liệu** thông qua custom hooks
- **Quản lý state** cục bộ của screen
- **Xử lý events** và logic điều khiển
- **Compose UI** từ các components nhỏ hơn

### 2. Separation of Concerns

- **Components**: Chỉ chứa UI logic và presentation
- **Hooks**: Chứa data fetching và business logic
- **Main Screen**: Tập trung vào composition và orchestration

### 3. Data Fetching

- Sử dụng custom hooks để fetch data
- Handle loading, error, và success states
- Mock data hiện tại, sẵn sàng thay thế bằng API calls

### 4. TypeScript

- Định nghĩa types rõ ràng cho props và state
- Type-safe data flow từ hooks đến components
- Proper error handling với typed errors

## Components

### TierPackagesCard

- Hiển thị các gói hạng thành viên (Bronze, Silver, Gold, Platinum)
- Featured tier với highlight đặc biệt
- NFT drop rates và benefits cho mỗi tier
- Interactive purchase buttons
- Responsive grid layout

### UserTierInfoCard

- Thông tin tài khoản người dùng hiện tại
- CAN balance và membership tier
- Progress bar để lên tier tiếp theo
- Stats về số gói mua và NFT sở hữu
- Loading states với skeleton UI

### P2PMarketplaceCard

- Danh sách NFT đang được bán trên thị trường P2P
- Rarity badges và pricing information
- Seller information và listing time
- Buy buttons cho mỗi NFT
- Responsive card layout

### RealtimeHistoryCard

- Lịch sử giao dịch realtime
- Transaction types (purchase/sale)
- Tier information và pricing
- Timestamps và participant addresses
- Loading states và error handling

### TransactionTrendsCard

- Thống kê xu hướng giao dịch theo thời gian
- Volume, transaction count, average price
- Period selector (24h, 7d, 30d)
- Trend indicators và comparisons
- Interactive period switching

## Hooks

### useMembershipTiers

- Fetch membership tier packages data
- Returns: `{ tiers }`
- Static data với tier information, pricing, benefits

### useP2PListings

- Fetch P2P marketplace listings
- Returns: `{ listings }`
- Mock data với NFT listings và pricing

### useUserMembership

- Fetch user membership information
- Returns: `{ profile, currentTier, progressToNext, loading, error }`
- Mock data với user profile và tier progress

### useRealtimeHistory

- Fetch realtime transaction history
- Returns: `{ transactions, loading, error }`
- Mock data với transaction history

### useTransactionTrends

- Fetch transaction trends data
- Returns: `{ trends, currentPeriod, setCurrentPeriod }`
- Mock data với trend statistics

## Features Implemented

### 🎨 Modern UI

- Clean shadcn/ui design với glass morphism effects
- Responsive grid layout (8/12 + 4/12 columns)
- Hover effects và smooth transitions
- Color-coded tier system

### 📱 Responsive Design

- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

### ⚡ Performance

- Optimized với proper loading states
- Skeleton UI cho better UX
- Efficient data flow
- Minimal re-renders

### 🛡️ Type Safety

- Full TypeScript support
- Proper error handling
- Type-safe props và state
- Comprehensive interfaces

### 🎯 User Experience

- Intuitive navigation
- Clear visual hierarchy
- Interactive elements
- Real-time updates simulation

## TODO Items

1. **API Integration**: Thay thế mock data bằng real API calls
2. **Authentication**: Integrate với user authentication system
3. **Payment Processing**: Implement actual purchase flows
4. **Real-time Updates**: Add WebSocket connections cho live data
5. **Error Boundaries**: Thêm error boundaries cho better error handling
6. **Testing**: Thêm unit tests cho hooks và components
7. **Analytics**: Add tracking cho user interactions

## Best Practices Applied

✅ **NÊN**:

- Giữ screen đơn giản và tập trung vào composition
- Tách logic phức tạp ra custom hooks
- Tái sử dụng components từ `/components`
- Handle authentication/authorization ở cấp screen
- Implement skeleton screens cho loading states
- Viết TypeScript type-safe
- Document các props và behaviors phức tạp

❌ **KHÔNG NÊN**:

- Gọi API trực tiếp trong screen component
- Viết inline styles (dùng TailwindCSS)
- Copy-paste code - hãy tạo reusable components/hooks
- Để business logic trong component - chuyển sang services
- Import components từ screens khác (tạo shared component)
- Làm screens quá phức tạp (>300 lines)
