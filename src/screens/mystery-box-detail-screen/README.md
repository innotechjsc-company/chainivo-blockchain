# Mystery Box Detail Screen

Screen hiển thị chi tiết một hộp bí ẩn với đầy đủ thông tin và chức năng mua hộp.

## Cấu trúc

```
mystery-box-detail-screen/
├── components/
│   ├── BoxDetailHeader.tsx       # Header với thông tin tổng quan
│   ├── BoxImageGallery.tsx       # Hiển thị hình ảnh hộp với effects
│   ├── RewardsDetail.tsx         # Chi tiết phần thưởng
│   ├── PurchaseCard.tsx          # Card mua hộp với quantity selector
│   └── index.ts                  # Export components
├── hooks/
│   ├── useBoxDetail.ts           # Hook lấy chi tiết hộp bí ẩn
│   └── index.ts                  # Export hooks
├── index.tsx                     # Main screen component
└── README.md                     # Documentation
```

## Features

### 1. Chi Tiết Hộp Bí Ẩn

- **Header Section**: Tên, mô tả, tier, và badges
- **Statistics**: Tổng số, đã bán, còn lại với progress bar
- **Image Gallery**: Hình ảnh với glow effects theo tier
- **Rewards List**: Danh sách phần thưởng chi tiết
- **Purchase Card**: Chọn số lượng và mua hộp

### 2. Box Detail Header

**BoxDetailHeader Component**

Hiển thị thông tin tổng quan:

- Tên và mô tả hộp
- Badge tier với màu sắc đặc trưng
- 3 stat cards: Tổng số, Đã bán, Còn lại
- Progress bar tiến độ bán hàng

### 3. Image Gallery

**BoxImageGallery Component**

Visual effects cao cấp:

- Aspect ratio square với background cover
- Gradient overlays
- Glow effect theo màu tier
- Sparkles animation
- Tier badge overlay
- Sold out overlay khi hết hàng

### 4. Rewards Detail

**RewardsDetail Component**

Hiển thị chi tiết phần thưởng:

- Icon phân biệt (Coins cho token, Image cho NFT)
- Probability percentage
- Description từ API hoặc fallback format
- Hover effects
- Empty state khi không có rewards

### 5. Purchase Card

**PurchaseCard Component**

Chức năng mua hộp:

- Hiển thị giá mỗi hộp
- Quantity selector (+/- buttons)
- Tổng tiền tự động tính
- Button mua ngay
- Status indicator
- Sticky position on scroll

## Hooks

### useBoxDetail

Hook để fetch và quản lý chi tiết hộp bí ẩn.

**Usage:**

```typescript
const { box, isLoading, error, refetch } = useBoxDetail(boxId);
```

**Returns:**

```typescript
{
  box: MysteryBoxData | null; // Chi tiết hộp
  isLoading: boolean; // Loading state
  error: string | null; // Error message
  refetch: () => Promise<void>; // Refetch function
}
```

**Features:**

- Fetch data từ API endpoint `/api/mystery-boxes/${id}`
- Map data từ API sang format component
- Auto tier detection dựa vào giá
- Handle loading và error states

## API Integration

### Service Method

```typescript
import { MysteryBoxService } from "@/api/services";

// Get box detail
const response = await MysteryBoxService.getBoxDetail(boxId);
```

### API Endpoint

```
GET /api/mystery-boxes/${id}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "xxx",
    "name": "Hộp đặc biệt",
    "description": "...",
    "image": { "url": "/api/media/..." },
    "price": 5000,
    "totalStock": 100,
    "soldCount": 0,
    "remainingStock": 100,
    "isActive": true,
    "rewards": [...]
  }
}
```

## Components Details

### BoxDetailHeader Props

```typescript
interface BoxDetailHeaderProps {
  box: MysteryBoxData;
}
```

### BoxImageGallery Props

```typescript
interface BoxImageGalleryProps {
  box: MysteryBoxData;
}
```

### RewardsDetail Props

```typescript
interface RewardsDetailProps {
  box: MysteryBoxData;
}
```

### PurchaseCard Props

```typescript
interface PurchaseCardProps {
  box: MysteryBoxData;
  onPurchase?: (quantity: number) => void;
}
```

## Screen Props

```typescript
interface MysteryBoxDetailScreenProps {
  boxId: string; // ID của hộp bí ẩn
}
```

## Routing

### Dynamic Route

```
/mysterybox/[id]
```

**Example:**

```
/mysterybox/69057e5fb4db8335a0002ddc
```

### Navigation

From list page:

```typescript
router.push(`/mysterybox/${box.id}`);
```

## Styling

### Tier Colors

Mỗi tier có bộ màu riêng:

- **Thường**: Gray (#94a3b8)
- **Đồng**: Bronze (#cd7f32)
- **Bạc**: Silver (#c0c0c0)
- **Vàng**: Gold (#ffd700)
- **Kim Cương**: Diamond (#b9f2ff)

### Responsive Design

- **Mobile**: Stacked layout (1 column)
- **Desktop**: 2-column grid (content + sidebar)
- Purchase card sticky on desktop

### Glass Morphism

All cards use glass effect:

```css
.glass {
  backdrop-blur-xl;
  border: 1px solid border/50;
}
```

## User Interactions

### Purchase Flow

1. User adjusts quantity (1-10 or remaining stock)
2. Total price updates automatically
3. Click "Mua ngay" button
4. `onPurchase` handler called with quantity
5. Toast notification shown

### Navigation

- Back button returns to list (`/mysterybox`)
- Error state has back button
- Box image clickable (future: open lightbox)

## Error Handling

### Loading State

- Centered spinner with message
- Full screen overlay

### Error State

- Error message displayed
- Back button to return to list
- Handles both network errors and 404

### Empty State

- Rewards section shows gift icon
- "Phần thưởng sẽ được tiết lộ khi mở hộp"

## Future Enhancements

1. **Purchase Integration**

   - Connect to blockchain
   - Wallet integration
   - Transaction confirmation

2. **Image Gallery**

   - Multiple images support
   - Lightbox viewer
   - 360° view

3. **Social Features**

   - Share button
   - Like/favorite
   - Comments section

4. **Related Boxes**

   - "You may also like" section
   - Similar tier boxes

5. **Purchase History**
   - Show user's previous purchases
   - Track opening history

## Performance

- Lazy load images
- Memoized components
- Optimized re-renders
- Suspense boundaries

## Accessibility

- Semantic HTML structure
- ARIA labels on buttons
- Keyboard navigation support
- Screen reader friendly
- Focus management

## Testing

Test scenarios:

- Box loads correctly
- Stats display accurate numbers
- Purchase quantity limits work
- Sold out state displays correctly
- Error states handled gracefully
- Back navigation works

## Notes

- Price range determines tier automatically
- Rewards probability shown but not in purchase card
- Sticky purchase card on desktop only
- Mobile-first responsive design
- Follows AGENT.md screen patterns
