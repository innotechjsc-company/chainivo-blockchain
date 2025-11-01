# Mystery Box Screen

Screen hiển thị cửa hàng hộp bí ẩn với các tính năng mua và mở hộp.

## Cấu trúc

```
mystery-box-screen/
├── components/
│   ├── MysteryBoxCard.tsx          # Card hiển thị thông tin hộp bí ẩn
│   ├── MysteryBoxHeaderCard.tsx    # Header với thống kê tổng quan
│   ├── MysteryBoxFiltersCard.tsx   # Bộ lọc và sắp xếp
│   ├── MysteryBoxGridCard.tsx      # Grid layout cho danh sách hộp
│   └── index.ts                    # Export components
├── hooks/
│   ├── useMysteryBoxData.ts        # Hook lấy dữ liệu hộp bí ẩn
│   ├── useMysteryBoxFilters.ts     # Hook xử lý bộ lọc
│   ├── useMysteryBoxStats.ts       # Hook tính toán thống kê
│   └── index.ts                    # Export hooks
├── index.tsx                       # Main screen component
└── README.md                       # Documentation
```

## Features

### 1. Hiển thị Hộp Bí Ẩn

- **Grid Layout**: Hiển thị các hộp bí ẩn theo dạng lưới responsive
- **Tier System**: 5 hạng hộp (Thường, Đồng, Bạc, Vàng, Kim Cương)
- **Rarity System**: Độ hiếm của hộp (Common, Uncommon, Rare, Epic, Legendary)
- **Visual Effects**: Hiệu ứng glow và màu sắc đặc trưng cho từng hạng

### 2. Thông Tin Hộp

- **Giá cả**: Hiển thị giá theo CAN token
- **Supply**: Số lượng đã bán và còn lại
- **Drop Rates**: Tỷ lệ rơi phần thưởng
- **Bonus Multiplier**: Hệ số nhân thưởng theo hạng
- **Sold Out Status**: Hiển thị trạng thái hết hàng

### 3. Bộ Lọc

- **Tier Levels**: Lọc theo hạng hộp (1-5)
- **Rarities**: Lọc theo độ hiếm
- **Availability**: Lọc theo trạng thái còn hàng/hết hàng
- **Sort Options**: Sắp xếp theo giá, số lượng, hạng

### 4. Thống Kê

- **Total Boxes**: Tổng số loại hộp
- **Sold Boxes**: Số hộp đã bán
- **Remaining**: Số hộp còn lại
- **Total Value**: Tổng giá trị giao dịch

## Components

### MysteryBoxCard

Component hiển thị chi tiết một hộp bí ẩn.

**Props:**

- `box: MysteryBoxData` - Dữ liệu hộp bí ẩn
- `onPurchase?: (boxId: string) => void` - Callback khi mua hộp

**Features:**

- Hiển thị hình ảnh với overlay gradient
- Badge rarity với màu sắc phù hợp
- Progress bar cho supply
- Drop rates preview
- Bonus multiplier
- Action buttons (Mua ngay, Xem chi tiết)

### MysteryBoxHeaderCard

Component hiển thị header và thống kê tổng quan.

**Props:**

- `stats: MysteryBoxStats` - Thống kê tổng quan

**Features:**

- Hero section với background effect
- 4 stats cards (Total, Sold, Remaining, Value)
- Icons và colors phù hợp

### MysteryBoxFiltersCard

Component bộ lọc và sắp xếp.

**Props:**

- `filters: MysteryBoxFilters` - Bộ lọc hiện tại
- `onFiltersChange: (filters) => void` - Callback khi thay đổi filter
- `hasActiveFilters: boolean` - Có filter đang active không
- `onResetFilters: () => void` - Callback reset filters

**Features:**

- Badge selection cho tier và rarity
- Select dropdown cho availability và sort
- Reset button khi có active filters

### MysteryBoxGridCard

Component wrapper cho grid layout.

**Props:**

- `boxes: MysteryBoxData[]` - Danh sách hộp
- `title?: string` - Tiêu đề
- `onPurchase?: (boxId) => void` - Callback mua hộp

## Hooks

### useMysteryBoxData

Hook để fetch và quản lý dữ liệu hộp bí ẩn.

**Returns:**

```typescript
{
  boxes: MysteryBoxData[];      // Danh sách hộp
  isLoading: boolean;           // Loading state
  error: string | null;         // Error message
  refetch: () => Promise<void>; // Refetch function
}
```

### useMysteryBoxFilters

Hook xử lý logic bộ lọc và sắp xếp.

**Parameters:**

- `boxes: MysteryBoxData[]` - Danh sách hộp gốc

**Returns:**

```typescript
{
  filters: MysteryBoxFilters;           // Bộ lọc hiện tại
  setFilters: (filters) => void;        // Set filters
  filteredBoxes: MysteryBoxData[];      // Danh sách đã lọc
  resetFilters: () => void;             // Reset filters
  hasActiveFilters: boolean;            // Check active filters
}
```

### useMysteryBoxStats

Hook tính toán thống kê từ danh sách hộp.

**Parameters:**

- `boxes: MysteryBoxData[]` - Danh sách hộp

**Returns:**

```typescript
{
  stats: MysteryBoxStats;  // Thống kê tổng quan
  chartData: any[];        // Data cho charts
}
```

## API Integration

Sử dụng `MysteryBoxService` từ `@/api/services`:

```typescript
import { MysteryBoxService } from "@/api/services";

// Get mystery boxes
const response = await MysteryBoxService.getMysteryBoxes();

// Purchase box
const result = await MysteryBoxService.purchaseBox({
  boxId: "1",
  quantity: 1,
  walletAddress: "0x...",
  paymentMethod: "CAN",
  transactionHash: "0x...",
});

// Open box
const reward = await MysteryBoxService.openBox({
  boxId: "1",
  walletAddress: "0x...",
  transactionHash: "0x...",
});
```

## Styling

- Sử dụng Tailwind CSS với custom classes
- Glass morphism effect cho cards
- Gradient overlays
- Glow effects cho các tier cao
- Responsive design (mobile-first)
- Dark mode support

## Color Scheme

### Tier Colors

- **Thường**: Gray (#94a3b8)
- **Đồng**: Bronze (#cd7f32)
- **Bạc**: Silver (#c0c0c0)
- **Vàng**: Gold (#ffd700)
- **Kim Cương**: Diamond (#b9f2ff)

### Rarity Colors

- **Common**: Gray
- **Uncommon**: Green
- **Rare**: Blue
- **Epic**: Purple
- **Legendary**: Yellow

## Usage Example

```typescript
import MysteryBoxScreen from "@/screens/mystery-box-screen";

export default function MysteryBoxPage() {
  return <MysteryBoxScreen />;
}
```

## Future Enhancements

1. **Animation**: Thêm animation khi mở hộp
2. **Sound Effects**: Âm thanh khi mở hộp
3. **History**: Lịch sử mua và mở hộp
4. **Inventory**: Quản lý hộp đã mua
5. **Rewards Display**: Hiển thị phần thưởng nhận được
6. **Share Feature**: Chia sẻ phần thưởng lên social
7. **Statistics**: Thống kê chi tiết cho user
8. **Preview**: Xem trước phần thưởng có thể nhận

## Notes

- Mock data được sử dụng khi API chưa sẵn sàng
- Tất cả components đều responsive
- Hỗ trợ dark mode
- Tuân theo coding rules trong AGENT.md
- Sử dụng TypeScript strict mode
