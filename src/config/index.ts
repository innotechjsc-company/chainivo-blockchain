/**
 * Config Index
 * 
 * Export tất cả config từ một nơi để dễ import
 */

// Export colors
export {
  brandColors,
  semanticColors,
  cryptoColors,
  chartColors,
  gradients,
  shadows,
  opacity,
  colors,
  parseHSL,
  toHSL,
  lighten,
  darken,
  saturate,
  desaturate,
  withAlpha,
  getContrastColor,
  generateColorPalette,
} from './colors'

export type {
  BrandColor,
  SemanticColor,
  CryptoColor,
  ChartColor,
  GradientPreset,
  ShadowPreset,
  OpacityLevel,
} from './colors'

// Export types
export type {
  HSLValue,
  HSLAValue,
  HSLObject,
  ColorPalette,
  ColorWithForeground,
  SemanticColorVariants,
  BrandColors,
  SemanticColors,
  CryptoColors,
  ChartColors,
  Gradients,
  Shadows,
  OpacityLevels,
  Colors,
  ColorUtils,
  ThemeMode,
  CSSVariableName,
  TailwindColorClass,
  ColorConfig,
  ThemeConfig,
} from '@/types/colors'

// Export hooks
export { useTheme, useCSSVariable, useThemeColors, useIsDarkMode } from '@/hooks/useTheme'

// Default export
export { default } from './colors'

