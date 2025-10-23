"use client"

import { useEffect, useState } from 'react'
import type { ThemeMode } from '@/types/colors'

/**
 * Hook để quản lý theme (dark/light mode)
 * 
 * @example
 * const { theme, setTheme, toggleTheme } = useTheme()
 */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Lấy theme từ localStorage hoặc system preference
    const stored = localStorage.getItem('theme') as ThemeMode | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (stored) {
      setThemeState(stored)
      applyTheme(stored, prefersDark)
    } else {
      setThemeState('system')
      applyTheme('system', prefersDark)
    }

    // Lắng nghe thay đổi system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        applyTheme('system', e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const applyTheme = (newTheme: ThemeMode, prefersDark: boolean) => {
    const isDark = newTheme === 'dark' || (newTheme === 'system' && prefersDark)
    
    if (isDark) {
      document.documentElement.classList.add('dark')
      setResolvedTheme('dark')
    } else {
      document.documentElement.classList.remove('dark')
      setResolvedTheme('light')
    }
  }

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(newTheme, prefersDark)
  }

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  }
}

/**
 * Hook để lấy giá trị CSS variable
 * 
 * @example
 * const primaryColor = useCSSVariable('--primary')
 */
export function useCSSVariable(variableName: string): string {
  const [value, setValue] = useState('')

  useEffect(() => {
    const updateValue = () => {
      const rootStyles = getComputedStyle(document.documentElement)
      const variableValue = rootStyles.getPropertyValue(variableName).trim()
      setValue(variableValue)
    }

    updateValue()

    // Lắng nghe thay đổi theme
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateValue()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [variableName])

  return value
}

/**
 * Hook để lấy tất cả CSS variables của theme
 * 
 * @example
 * const colors = useThemeColors()
 * console.log(colors.primary) // "240 5.9% 10%"
 */
export function useThemeColors() {
  const [colors, setColors] = useState<Record<string, string>>({})

  useEffect(() => {
    const updateColors = () => {
      const rootStyles = getComputedStyle(document.documentElement)
      const colorVariables = [
        'background',
        'foreground',
        'card',
        'card-foreground',
        'popover',
        'popover-foreground',
        'primary',
        'primary-foreground',
        'secondary',
        'secondary-foreground',
        'muted',
        'muted-foreground',
        'accent',
        'accent-foreground',
        'destructive',
        'destructive-foreground',
        'border',
        'input',
        'ring',
      ]

      const newColors: Record<string, string> = {}
      colorVariables.forEach((variable) => {
        const value = rootStyles.getPropertyValue(`--${variable}`).trim()
        if (value) {
          newColors[variable] = value
        }
      })

      setColors(newColors)
    }

    updateColors()

    // Lắng nghe thay đổi theme
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateColors()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return colors
}

/**
 * Hook để kiểm tra dark mode
 * 
 * @example
 * const isDark = useIsDarkMode()
 */
export function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }

    checkDarkMode()

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return isDark
}

export default useTheme

