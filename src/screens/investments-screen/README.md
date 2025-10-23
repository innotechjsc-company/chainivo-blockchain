# Investments Screen - Restructured

## Cấu trúc mới theo AGENT.md

```
investments-screen/
├── index.tsx              # File giao diện chính (composition pattern)
├── components/            # Components đặc thù cho screen này
│   ├── index.ts
│   ├── BlockchainStatsCard.tsx
│   ├── CompanyInfoCard.tsx
│   ├── InvestmentPhasesCard.tsx
│   ├── TransactionHistoryCard.tsx
│   └── UserDashboardCard.tsx
├── hooks/                 # Custom hooks đặc thù cho screen này
│   ├── index.ts
│   ├── useBlockchainStats.ts
│   ├── useInvestmentPhases.ts
│   ├── useTransactionHistory.ts
│   └── useUserProfile.ts
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

### BlockchainStatsCard

- Hiển thị thống kê blockchain CAN
- Loading state với skeleton UI
- Responsive grid layout

### CompanyInfoCard

- Thông tin về CAN Token và công ty
- Static content với icons và styling

### InvestmentPhasesCard

- Hiển thị các giai đoạn đầu tư
- Interactive buttons và progress bars
- Status badges và animations

### TransactionHistoryCard

- Lịch sử giao dịch của user
- Loading và error states
- Formatted timestamps và transaction types

### UserDashboardCard

- Hiển thị thông tin cá nhân và thống kê user
- CAN balance, total investment, membership tier
- Loading states với skeleton UI
- Error handling và empty states
- Responsive grid layout với hover effects

## Hooks

### useBlockchainStats

- Fetch blockchain statistics
- Returns: `{ stats, loading, error }`
- Mock data với simulated loading

### useInvestmentPhases

- Get investment phases data
- Returns: `{ phases }`
- Static data (có thể extend để fetch từ API)

### useTransactionHistory

- Fetch user transaction history
- Returns: `{ transactions, loading, error }`
- Mock data với simulated loading

### useUserProfile

- Fetch user profile information
- Returns: `{ profile, loading, error }`
- Mock data với simulated loading

## TODO Items

1. **API Integration**: Thay thế mock data bằng real API calls
2. **InvestmentHero Component**: Tạo component hero section
3. **UserDashboard Component**: ✅ Đã hoàn thành
4. **Error Boundaries**: Thêm error boundaries cho better error handling
5. **Loading States**: Cải thiện loading states và skeleton UI
6. **Testing**: Thêm unit tests cho hooks và components

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
