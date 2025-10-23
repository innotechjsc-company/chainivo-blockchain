/**
 * Color Configuration
 * 
 * File này chứa các config màu bổ sung cho dự án Chainivo Blockchain
 * Sử dụng cùng với CSS variables trong globals.css
 */

/**
 * Brand Colors - Màu thương hiệu Chainivo
 */
export const brandColors = {
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
  },
} as const

/**
 * Semantic Colors - Màu theo ngữ nghĩa
 */
export const semanticColors = {
  success: {
    light: 'hsl(142, 76%, 36%)',
    DEFAULT: 'hsl(142, 71%, 45%)',
    dark: 'hsl(142, 76%, 36%)',
    foreground: 'hsl(0, 0%, 100%)',
  },
  warning: {
    light: 'hsl(38, 92%, 50%)',
    DEFAULT: 'hsl(38, 92%, 50%)',
    dark: 'hsl(32, 95%, 44%)',
    foreground: 'hsl(0, 0%, 100%)',
  },
  error: {
    light: 'hsl(0, 84%, 60%)',
    DEFAULT: 'hsl(0, 72%, 51%)',
    dark: 'hsl(0, 65%, 48%)',
    foreground: 'hsl(0, 0%, 100%)',
  },
  info: {
    light: 'hsl(199, 89%, 48%)',
    DEFAULT: 'hsl(199, 89%, 48%)',
    dark: 'hsl(199, 89%, 40%)',
    foreground: 'hsl(0, 0%, 100%)',
  },
} as const

/**
 * Blockchain/Crypto Specific Colors
 */
export const cryptoColors = {
  // Transaction status colors
  pending: 'hsl(38, 92%, 50%)',      // Vàng - Đang chờ
  confirmed: 'hsl(142, 76%, 36%)',   // Xanh lá - Đã xác nhận
  failed: 'hsl(0, 84%, 60%)',        // Đỏ - Thất bại
  
  // Price movement colors
  priceUp: 'hsl(142, 76%, 36%)',     // Xanh lá - Tăng giá
  priceDown: 'hsl(0, 84%, 60%)',     // Đỏ - Giảm giá
  priceNeutral: 'hsl(240, 5%, 64%)', // Xám - Không đổi
  
  // Network colors
  mainnet: 'hsl(142, 76%, 36%)',     // Xanh lá - Mainnet
  testnet: 'hsl(38, 92%, 50%)',      // Vàng - Testnet
  devnet: 'hsl(280, 80%, 55%)',      // Tím - Devnet
} as const

/**
 * Chart Colors - Màu cho biểu đồ
 */
export const chartColors = {
  chart1: 'hsl(var(--chart-1))',
  chart2: 'hsl(var(--chart-2))',
  chart3: 'hsl(var(--chart-3))',
  chart4: 'hsl(var(--chart-4))',
  chart5: 'hsl(var(--chart-5))',
} as const

/**
 * Gradient Presets - Các gradient có sẵn
 */
export const gradients = {
  primary: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
  success: 'linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(142, 71%, 45%) 100%)',
  warning: 'linear-gradient(135deg, hsl(38, 92%, 50%) 0%, hsl(32, 95%, 44%) 100%)',
  error: 'linear-gradient(135deg, hsl(0, 84%, 60%) 0%, hsl(0, 72%, 51%) 100%)',
  crypto: 'linear-gradient(135deg, hsl(280, 80%, 55%) 0%, hsl(217, 91%, 60%) 100%)',
  gold: 'linear-gradient(135deg, hsl(45, 93%, 58%) 0%, hsl(38, 92%, 50%) 100%)',
} as const

/**
 * Shadow Presets - Các shadow có sẵn
 */
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
  
  // Colored shadows
  primaryGlow: '0 0 20px hsl(var(--primary) / 0.3)',
  accentGlow: '0 0 20px hsl(var(--accent) / 0.3)',
  successGlow: '0 0 20px hsl(142, 76%, 36% / 0.3)',
  errorGlow: '0 0 20px hsl(0, 84%, 60% / 0.3)',
} as const

/**
 * Opacity Levels - Các mức độ trong suốt
 */
export const opacity = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  25: '0.25',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  75: '0.75',
  80: '0.8',
  90: '0.9',
  95: '0.95',
  100: '1',
} as const

/**
 * Helper Functions
 */

/**
 * Chuyển đổi HSL string thành object
 * @example parseHSL('240 5.9% 10%') => { h: 240, s: 5.9, l: 10 }
 */
export function parseHSL(hsl: string): { h: number; s: number; l: number } {
  const [h, s, l] = hsl.split(' ').map(v => parseFloat(v))
  return { h, s, l }
}

/**
 * Tạo HSL string từ object
 * @example toHSL({ h: 240, s: 5.9, l: 10 }) => '240 5.9% 10%'
 */
export function toHSL(hsl: { h: number; s: number; l: number }): string {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`
}

/**
 * Làm sáng màu HSL
 * @param hsl - HSL string (e.g., '240 5.9% 10%')
 * @param amount - Số % tăng lightness (0-100)
 */
export function lighten(hsl: string, amount: number): string {
  const parsed = parseHSL(hsl)
  const newL = Math.min(100, parsed.l + amount)
  return toHSL({ ...parsed, l: newL })
}

/**
 * Làm tối màu HSL
 * @param hsl - HSL string (e.g., '240 5.9% 10%')
 * @param amount - Số % giảm lightness (0-100)
 */
export function darken(hsl: string, amount: number): string {
  const parsed = parseHSL(hsl)
  const newL = Math.max(0, parsed.l - amount)
  return toHSL({ ...parsed, l: newL })
}

/**
 * Tăng độ bão hòa màu HSL
 * @param hsl - HSL string (e.g., '240 5.9% 10%')
 * @param amount - Số % tăng saturation (0-100)
 */
export function saturate(hsl: string, amount: number): string {
  const parsed = parseHSL(hsl)
  const newS = Math.min(100, parsed.s + amount)
  return toHSL({ ...parsed, s: newS })
}

/**
 * Giảm độ bão hòa màu HSL
 * @param hsl - HSL string (e.g., '240 5.9% 10%')
 * @param amount - Số % giảm saturation (0-100)
 */
export function desaturate(hsl: string, amount: number): string {
  const parsed = parseHSL(hsl)
  const newS = Math.max(0, parsed.s - amount)
  return toHSL({ ...parsed, s: newS })
}

/**
 * Thêm alpha (opacity) vào màu HSL
 * @param hsl - HSL string (e.g., '240 5.9% 10%')
 * @param alpha - Giá trị alpha (0-1)
 */
export function withAlpha(hsl: string, alpha: number): string {
  return `hsl(${hsl} / ${alpha})`
}

/**
 * Lấy màu tương phản (đen hoặc trắng) dựa trên độ sáng
 * @param hsl - HSL string (e.g., '240 5.9% 10%')
 * @returns 'hsl(0 0% 0%)' hoặc 'hsl(0 0% 100%)'
 */
export function getContrastColor(hsl: string): string {
  const parsed = parseHSL(hsl)
  // Nếu lightness > 50% thì dùng màu đen, ngược lại dùng màu trắng
  return parsed.l > 50 ? 'hsl(0 0% 0%)' : 'hsl(0 0% 100%)'
}

/**
 * Color Palette Generator
 * Tạo một bộ màu từ màu cơ bản
 */
export function generateColorPalette(baseHsl: string) {
  const parsed = parseHSL(baseHsl)
  
  return {
    50: toHSL({ ...parsed, l: 95 }),
    100: toHSL({ ...parsed, l: 90 }),
    200: toHSL({ ...parsed, l: 80 }),
    300: toHSL({ ...parsed, l: 70 }),
    400: toHSL({ ...parsed, l: 60 }),
    500: toHSL({ ...parsed, l: 50 }),  // Base
    600: toHSL({ ...parsed, l: 40 }),
    700: toHSL({ ...parsed, l: 30 }),
    800: toHSL({ ...parsed, l: 20 }),
    900: toHSL({ ...parsed, l: 10 }),
    950: toHSL({ ...parsed, l: 5 }),
  }
}

/**
 * Type Definitions
 */
export type BrandColor = keyof typeof brandColors
export type SemanticColor = keyof typeof semanticColors
export type CryptoColor = keyof typeof cryptoColors
export type ChartColor = keyof typeof chartColors
export type GradientPreset = keyof typeof gradients
export type ShadowPreset = keyof typeof shadows
export type OpacityLevel = keyof typeof opacity

/**
 * Export all colors
 */
export const colors = {
  brand: brandColors,
  semantic: semanticColors,
  crypto: cryptoColors,
  chart: chartColors,
} as const

export default colors

