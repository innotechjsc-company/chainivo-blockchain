# NFT Market Screen - Restructured

## Cấu trúc mới theo AGENT.md

```
nft-market-screen/
├── index.tsx              # File giao diện chính (composition pattern)
├── components/            # Components đặc thù cho screen này
│   ├── index.ts
│   ├── NFTMarketHeaderCard.tsx
│   ├── NFTFiltersCard.tsx
│   ├── NFTGridCard.tsx
│   └── NFTCard.tsx
├── hooks/                 # Custom hooks đặc thù cho screen này
│   ├── index.ts
│   ├── useNFTData.ts
│   ├── useNFTFilters.ts
│   └── useNFTStats.ts
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

### NFTMarketHeaderCard

- Hiển thị thống kê tổng quan về NFT marketplace
- Charts cho volume và price trends
- Stats cards với icons và trend indicators
- Responsive grid layout

### NFTFiltersCard

- Bộ lọc NFT theo type, rarity, và price range
- Toggle group cho type selection
- Badge system cho rarity filtering
- Slider cho price range selection
- Collapsible filter panel

### NFTGridCard

- Grid layout cho hiển thị danh sách NFT
- Pagination với "Xem thêm" button
- Responsive grid (1/2/3 columns)
- Animation delays cho smooth loading

### NFTCard

- Card component cho từng NFT
- Hỗ trợ cả Tier NFTs và Other NFTs
- Progress bars cho fractional NFTs
- Action buttons (Buy, View)
- Rarity badges với color coding
- Hover effects và animations

## Hooks

### useNFTData

- Fetch NFT data từ API
- Returns: `{ nfts }`
- Mock data với sample NFTs (tier và other types)

### useNFTFilters

- Quản lý filter state và logic
- Returns: `{ filters, setFilters, filteredNFTs, tierNFTs, otherNFTs, resetFilters, hasActiveFilters }`
- Filter logic cho type, rarity, và price range

### useNFTStats

- Fetch marketplace statistics
- Returns: `{ stats, volumeData, priceData }`
- Mock data với stats và chart data

## NFT Types

### Tier NFTs

- NFTs liên quan đến membership tiers
- Simple pricing structure
- Seller information
- Basic buy functionality

### Other NFTs

- Fractional NFTs với share system
- Total value và price per share
- Progress tracking cho shares sold
- Purchase count statistics

## Features Implemented

### 🎨 Modern UI

- Clean shadcn/ui design với glass morphism effects
- Responsive grid layouts
- Hover effects và smooth transitions
- Color-coded rarity system

### 📱 Responsive Design

- Mobile-first approach
- Adaptive grid layouts (1/2/3 columns)
- Touch-friendly interactions
- Optimized for all screen sizes

### ⚡ Performance

- Optimized với proper loading states
- Efficient filtering logic
- Minimal re-renders
- Smooth animations

### 🛡️ Type Safety

- Full TypeScript support
- Proper error handling
- Type-safe props và state
- Comprehensive interfaces

### 🎯 User Experience

- Intuitive filtering system
- Clear visual hierarchy
- Interactive elements
- Smooth animations và transitions

### 🔍 Advanced Filtering

- Type filtering (All, Tier, Other)
- Rarity filtering với multi-select
- Price range filtering với slider
- Active filter indicators
- Reset functionality

## TODO Items

1. **API Integration**: Thay thế mock data bằng real API calls
2. **Authentication**: Integrate với user authentication system
3. **Payment Processing**: Implement actual purchase flows
4. **Real-time Updates**: Add WebSocket connections cho live data
5. **Search Functionality**: Add search bar cho NFT names
6. **Sorting Options**: Add sorting by price, rarity, date
7. **Favorites System**: Add ability to favorite NFTs
8. **Error Boundaries**: Thêm error boundaries cho better error handling
9. **Testing**: Thêm unit tests cho hooks và components
10. **Analytics**: Add tracking cho user interactions

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
