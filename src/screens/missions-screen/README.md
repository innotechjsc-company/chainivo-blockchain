# Missions Screen - Restructured

## Cấu trúc mới theo AGENT.md

```
missions-screen/
├── index.tsx              # File giao diện chính (composition pattern)
├── components/            # Components đặc thù cho screen này
│   ├── index.ts
│   ├── MissionCard.tsx
│   ├── RewardsSummaryCard.tsx
│   ├── MissionsTabsCard.tsx
│   └── SpecialEventCard.tsx
├── hooks/                 # Custom hooks đặc thù cho screen này
│   ├── index.ts
│   ├── useMissionsData.ts
│   ├── useMissionsStats.ts
│   └── useSpecialEvent.ts
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

### MissionCard

- Hiển thị thông tin từng nhiệm vụ
- Progress bar cho tiến độ hoàn thành
- Action button để nhận thưởng
- Status indicators (completed/in-progress)
- Hover effects và animations

### RewardsSummaryCard

- Thống kê tổng quan về phần thưởng
- Cards hiển thị coins hôm nay, nhiệm vụ tuần, streak
- Icons và color coding cho từng loại thống kê
- Responsive grid layout

### MissionsTabsCard

- Tab system cho các loại nhiệm vụ (Daily, Weekly, Monthly)
- TabsList với glass morphism styling
- TabsContent với animation transitions
- MissionCard integration

### SpecialEventCard

- Hiển thị sự kiện đặc biệt
- Countdown timer với real-time updates
- Special styling với border glow effect
- Trophy icon với floating animation

## Hooks

### useMissionsData

- Fetch missions data cho các loại khác nhau
- Returns: `{ dailyMissions, weeklyMissions, monthlyMissions }`
- Mock data với sample missions

### useMissionsStats

- Fetch thống kê về phần thưởng
- Returns: `{ stats }`
- Mock data với stats information

### useSpecialEvent

- Quản lý thông tin sự kiện đặc biệt
- Returns: `{ event, timeLeft }`
- Real-time countdown timer
- Auto-updating time left

## Mission Types

### Daily Missions

- Nhiệm vụ hàng ngày với rewards nhỏ
- Reset mỗi ngày
- Examples: Đăng nhập, giao dịch NFT, staking

### Weekly Missions

- Nhiệm vụ hàng tuần với rewards trung bình
- Reset mỗi tuần
- Examples: Giao dịch 5 lần, mua Mystery Box

### Monthly Missions

- Nhiệm vụ hàng tháng với rewards lớn
- Reset mỗi tháng
- Examples: Đạt hạng Silver, giao dịch $1000

## Features Implemented

### 🎨 Modern UI

- Clean shadcn/ui design với glass morphism effects
- Responsive grid layouts
- Hover effects và smooth transitions
- Color-coded status system

### 📱 Responsive Design

- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

### ⚡ Performance

- Optimized với proper state management
- Efficient re-rendering
- Real-time countdown updates
- Smooth animations

### 🛡️ Type Safety

- Full TypeScript support
- Proper error handling
- Type-safe props và state
- Comprehensive interfaces

### 🎯 User Experience

- Intuitive tab navigation
- Clear progress indicators
- Interactive reward claiming
- Real-time countdown

### ⏰ Real-time Features

- Live countdown timer cho special events
- Auto-updating time displays
- Smooth time transitions

## Mission System Features

### Progress Tracking

- Visual progress bars
- Percentage completion
- Status indicators (completed/in-progress)

### Reward System

- Different reward types (Coins, NFTs, Bonuses)
- Claimable rewards với button states
- Reward preview trong mission cards

### Streak System

- Daily login tracking
- Streak counter display
- Motivation for consistent participation

### Special Events

- Time-limited events
- Mega rewards cho completion
- Countdown timers
- Special visual effects

## TODO Items

1. **API Integration**: Thay thế mock data bằng real API calls
2. **Authentication**: Integrate với user authentication system
3. **Reward Processing**: Implement actual reward claiming
4. **Progress Tracking**: Add real progress tracking logic
5. **Notification System**: Add notifications cho mission completion
6. **Achievement System**: Add achievement badges và milestones
7. **Social Features**: Add leaderboards và social sharing
8. **Error Boundaries**: Thêm error boundaries cho better error handling
9. **Testing**: Thêm unit tests cho hooks và components
10. **Analytics**: Add tracking cho user engagement

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
