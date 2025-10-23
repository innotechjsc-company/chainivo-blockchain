/**
 * Type Definitions for Color System
 * 
 * Cung cấp type safety cho hệ thống màu
 */

/**
 * HSL Color Value
 * Format: "H S% L%" (e.g., "240 5.9% 10%")
 */
export type HSLValue = string

/**
 * HSL Color with Alpha
 * Format: "hsl(H S% L% / alpha)" (e.g., "hsl(240 5.9% 10% / 0.5)")
 */
export type HSLAValue = string

/**
 * HSL Object
 */
export interface HSLObject {
  h: number  // Hue: 0-360
  s: number  // Saturation: 0-100
  l: number  // Lightness: 0-100
}

/**
 * Color Shade Palette
 */
export interface ColorPalette {
  50: HSLValue
  100: HSLValue
  200: HSLValue
  300: HSLValue
  400: HSLValue
  500: HSLValue
  600: HSLValue
  700: HSLValue
  800: HSLValue
  900: HSLValue
  950: HSLValue
}

/**
 * Color with Foreground
 */
export interface ColorWithForeground {
  DEFAULT: string
  foreground: string
}

/**
 * Semantic Color Variants
 */
export interface SemanticColorVariants {
  light: string
  DEFAULT: string
  dark: string
  foreground: string
}

/**
 * Brand Colors
 */
export interface BrandColors {
  primary: ColorWithForeground
  secondary: ColorWithForeground
  accent: ColorWithForeground
}

/**
 * Semantic Colors
 */
export interface SemanticColors {
  success: SemanticColorVariants
  warning: SemanticColorVariants
  error: SemanticColorVariants
  info: SemanticColorVariants
}

/**
 * Crypto/Blockchain Specific Colors
 */
export interface CryptoColors {
  // Transaction status
  pending: string
  confirmed: string
  failed: string
  
  // Price movement
  priceUp: string
  priceDown: string
  priceNeutral: string
  
  // Network
  mainnet: string
  testnet: string
  devnet: string
}

/**
 * Chart Colors
 */
export interface ChartColors {
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
}

/**
 * Gradient Presets
 */
export interface Gradients {
  primary: string
  success: string
  warning: string
  error: string
  crypto: string
  gold: string
}

/**
 * Shadow Presets
 */
export interface Shadows {
  sm: string
  DEFAULT: string
  md: string
  lg: string
  xl: string
  '2xl': string
  inner: string
  none: string
  
  // Colored shadows
  primaryGlow: string
  accentGlow: string
  successGlow: string
  errorGlow: string
}

/**
 * Opacity Levels
 */
export interface OpacityLevels {
  0: string
  5: string
  10: string
  20: string
  25: string
  30: string
  40: string
  50: string
  60: string
  70: string
  75: string
  80: string
  90: string
  95: string
  100: string
}

/**
 * All Colors
 */
export interface Colors {
  brand: BrandColors
  semantic: SemanticColors
  crypto: CryptoColors
  chart: ChartColors
}

/**
 * Color Utility Functions
 */
export interface ColorUtils {
  parseHSL: (hsl: HSLValue) => HSLObject
  toHSL: (hsl: HSLObject) => HSLValue
  lighten: (hsl: HSLValue, amount: number) => HSLValue
  darken: (hsl: HSLValue, amount: number) => HSLValue
  saturate: (hsl: HSLValue, amount: number) => HSLValue
  desaturate: (hsl: HSLValue, amount: number) => HSLValue
  withAlpha: (hsl: HSLValue, alpha: number) => HSLAValue
  getContrastColor: (hsl: HSLValue) => HSLValue
  generateColorPalette: (baseHsl: HSLValue) => ColorPalette
}

/**
 * Theme Mode
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * CSS Variable Names
 */
export type CSSVariableName =
  | '--background'
  | '--foreground'
  | '--card'
  | '--card-foreground'
  | '--popover'
  | '--popover-foreground'
  | '--primary'
  | '--primary-foreground'
  | '--secondary'
  | '--secondary-foreground'
  | '--muted'
  | '--muted-foreground'
  | '--accent'
  | '--accent-foreground'
  | '--destructive'
  | '--destructive-foreground'
  | '--border'
  | '--input'
  | '--ring'
  | '--radius'
  | '--chart-1'
  | '--chart-2'
  | '--chart-3'
  | '--chart-4'
  | '--chart-5'

/**
 * Tailwind Color Classes
 */
export type TailwindColorClass =
  | 'bg-background'
  | 'bg-foreground'
  | 'bg-card'
  | 'bg-card-foreground'
  | 'bg-popover'
  | 'bg-popover-foreground'
  | 'bg-primary'
  | 'bg-primary-foreground'
  | 'bg-secondary'
  | 'bg-secondary-foreground'
  | 'bg-muted'
  | 'bg-muted-foreground'
  | 'bg-accent'
  | 'bg-accent-foreground'
  | 'bg-destructive'
  | 'bg-destructive-foreground'
  | 'bg-border'
  | 'bg-input'
  | 'bg-ring'
  | 'text-background'
  | 'text-foreground'
  | 'text-card'
  | 'text-card-foreground'
  | 'text-popover'
  | 'text-popover-foreground'
  | 'text-primary'
  | 'text-primary-foreground'
  | 'text-secondary'
  | 'text-secondary-foreground'
  | 'text-muted'
  | 'text-muted-foreground'
  | 'text-accent'
  | 'text-accent-foreground'
  | 'text-destructive'
  | 'text-destructive-foreground'
  | 'border-border'
  | 'border-input'
  | 'border-ring'

/**
 * Color Config
 */
export interface ColorConfig {
  colors: Colors
  gradients: Gradients
  shadows: Shadows
  opacity: OpacityLevels
  utils: ColorUtils
}

/**
 * Theme Config
 */
export interface ThemeConfig {
  mode: ThemeMode
  colors: Record<CSSVariableName, HSLValue>
}

/**
 * Extend global Window interface for theme
 */
declare global {
  interface Window {
    __theme?: ThemeMode
    __setTheme?: (theme: ThemeMode) => void
  }
}

export {}

