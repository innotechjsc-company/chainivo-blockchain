# NFT Card Redesign - Implementation Summary

## Tổng quan

Đã hoàn thành thiết kế lại giao diện card NFT trong tab "My NFT" với hỗ trợ 4 loại NFT khác nhau: Normal, Rank, Investment, Mystery Box.

## Files mới được tạo

### 1. Components (/src/components/nft/)

#### LevelBadge.tsx
- Badge hiển thị độ hiếm/level của NFT
- 5 cấp độ: Thường (1), Bạc (2), Vàng (3), Bạch kim (4), Kim cương (5)
- Mỗi level có màu sắc và icon riêng
- Tooltip hiển thị chi tiết khi hover

#### NFTTypeBadge.tsx
- Badge hiển thị loại NFT (Normal, Rank, Mystery Box, Investment)
- Icon đại diện cho từng loại
- Màu sắc khác nhau theo type

#### InvestmentProgressBar.tsx
- Progress bar cho Investment NFT
- Hiển thị: tỷ lệ cổ phần đã bán/tổng cổ phần
- Số nhà đầu tư
- Giá mỗi cổ phần

#### CountdownTimer.tsx
- Countdown timer real-time
- Hiển thị thời gian còn lại đến investmentEndDate
- Auto-update mỗi giây
- Hiển thị "Đã hết hạn" khi time's up

#### MysteryRewardsPreview.tsx
- Preview các phần thưởng tiềm năng của Mystery Box
- Hiển thị token rewards và NFT rewards
- Badge độ hiếm cho NFT reward

#### NFTCard.tsx
- Component chính hiển thị NFT card
- Hỗ trợ 4 loại layout khác nhau:
  - **Normal/Rank**: Card đơn giản với level badge, price, actions
  - **Investment**: Thêm progress bar, countdown, investor count
  - **Mystery Box**: Preview rewards, button "Mở hộp" (disabled)
- Border glow effect theo level
- Badges: isFeatured, isSale, isActive
- Responsive design

#### index.ts
- Export tất cả components

### 2. UI Components

#### tooltip.tsx (/src/components/ui/)
- Tooltip component sử dụng Radix UI
- Hỗ trợ LevelBadge và các component khác

### 3. Type Definitions

#### NFT.d.ts (updated)
- Thêm interface NFTReward cho mystery box rewards
- Mở rộng NFTItem với các field:
  - Investment: isFractional, totalShares, soldShares, availableShares, totalInvestors, investmentStartDate, investmentEndDate, pricePerShare
  - Mystery Box: isOpenable, rewards
  - General: isFeatured

### 4. Services

#### nft-service.ts (updated)
- Update mapping trong getNFTOwnerships() và getMyNFTOwnerships()
- Map tất cả field mới từ API response

### 5. Styles

#### globals.css (updated)
- Thêm shadow effects cho từng level:
  - shadow-gray-500/50 (Level 1)
  - shadow-gray-400/50 (Level 2)
  - shadow-yellow-500/50 (Level 3)
  - shadow-purple-500/50 (Level 4)
  - shadow-cyan-500/50 (Level 5)
- NFT card hover enhancement

## Files đã update

### MyNFTCollection.tsx
- Import NFTCard mới từ @/components/nft/NFTCard
- Update props: showActions thay vì type="tier"
- Hỗ trợ tất cả 4 loại NFT

## Dependencies mới

- @radix-ui/react-tooltip: ^1.1.6

## Responsive Design

- **Desktop**: Grid 3 cột
- **Tablet**: Grid 2 cột
- **Mobile**: Grid 1 cột

## Level Border & Glow Effects

Mỗi level NFT có border và glow effect riêng:
- Level 1 (Thường): Gray glow
- Level 2 (Bạc): Silver glow
- Level 3 (Vàng): Gold glow
- Level 4 (Bạch kim): Purple glow
- Level 5 (Kim cương): Cyan glow

## NFT Type Layouts

### Normal/Rank
```
┌─────────────────────────────┐
│ [Level Badge] [Type Badge]  │
│ [Featured] [Sale Status]    │
│                             │
│       [Ảnh NFT]             │
│                             │
│ Tên NFT                     │
│ ─────────────────           │
│ Giá: X CAN                  │
│ [Button: Đăng bán ]│
└─────────────────────────────┘
```

### Investment
```
┌─────────────────────────────┐
│ [Badges]                    │
│       [Ảnh NFT]             │
│                             │
│ Tên NFT                     │
│ ─────────────────           │
│ Giá/cổ phần: X CAN          │
│ [Progress bar] 60/100       │
│ 👥 15 nhà đầu tư            │
│ ⏱️ Còn 5 ngày 3h            │
│ [Button: Mua]               │
└─────────────────────────────┘
```

### Mystery Box
```
┌─────────────────────────────┐
│ [Level Badge] [🎁 Badge]    │
│ [✨ Sẵn sàng mở] (nếu có)   │
│       [Ảnh hộp]             │
│                             │
│ Tên hộp                     │
│ Giá hộp: 50 CAN             │
│ ─────────────────           │
│ 🎁 Phần thưởng tiềm năng:   │
│ • 💰 10-100 CAN Token 🎯5%  │
│ • 🖼️ NFT Vàng (Badge) 🎯2% │
│ [X loại phần thưởng]        │
│ [🎁 Mở hộp quà ✨]          │
└─────────────────────────────┘
```

**Mystery Box Features:**
- Badge "✨ Sẵn sàng mở" khi `isOpenable = true` (với animate-pulse)
- Rewards preview với gradient background (amber cho tokens, purple-pink cho NFTs)
- Probability display (🎯 X%)
- Button gradient purple-pink với animation khi hover
- Special hover effect (shadow-2xl) khi isOpenable
- Max height cho rewards list với custom scrollbar
