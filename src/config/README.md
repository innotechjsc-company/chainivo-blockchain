# Config Directory

Thư mục này chứa các file cấu hình cho dự án Chainivo Blockchain.

## 📁 Files

### `colors.ts`
File chính chứa:
- Brand colors (primary, secondary, accent)
- Semantic colors (success, warning, error, info)
- Crypto-specific colors
- Chart colors
- Gradients & shadows
- Color utility functions

**Import:**
```typescript
import { semanticColors, lighten, darken } from '@/config/colors'
```

### `theme-presets.css`
Chứa 6 theme presets có sẵn:
1. Default (Zinc)
2. Blockchain Blue
3. Crypto Purple
4. Gold Luxury
5. Green Matrix
6. Dark Cyberpunk

**Usage:**
Copy theme từ file này và paste vào `src/app/globals.css`

### `index.ts`
Export tổng hợp tất cả config.

**Import:**
```typescript
import { semanticColors, useTheme } from '@/config'
```

## 🚀 Quick Examples

### Use Colors
```typescript
import { semanticColors, cryptoColors } from '@/config/colors'

// Semantic
<div style={{ color: semanticColors.success.DEFAULT }}>Success</div>

// Crypto
<span style={{ color: cryptoColors.confirmed }}>Confirmed</span>
```

### Use Utilities
```typescript
import { lighten, darken, withAlpha } from '@/config/colors'

const lighter = lighten('240 5.9% 50%', 20)
const darker = darken('240 5.9% 50%', 20)
const transparent = withAlpha('240 5.9% 50%', 0.5)
```

### Use Gradients
```typescript
import { gradients } from '@/config/colors'

<div style={{ background: gradients.crypto }}>
  Gradient Background
</div>
```

## 📚 Documentation

Xem thêm:
- [COLOR_CONFIG_GUIDE.md](../../COLOR_CONFIG_GUIDE.md) - Hướng dẫn chi tiết
- [QUICK_COLOR_SETUP.md](../../QUICK_COLOR_SETUP.md) - Hướng dẫn nhanh
- [COLOR_SYSTEM_SUMMARY.md](../../COLOR_SYSTEM_SUMMARY.md) - Tổng quan hệ thống

