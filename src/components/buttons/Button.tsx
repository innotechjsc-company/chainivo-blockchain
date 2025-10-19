import React from 'react'
import { Button as UIButton, buttonVariants } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VariantProps } from 'class-variance-authority'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode
  iconPosition?: 'start' | 'end'
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
  gradient?: boolean
  shadow?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      icon,
      iconPosition = 'start',
      loading = false,
      loadingText,
      fullWidth = false,
      gradient = false,
      shadow = false,
      rounded = 'md',
      disabled,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    const content = loading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText || children}
      </>
    ) : (
      <>
        {icon && iconPosition === 'start' && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === 'end' && <span className="ml-2">{icon}</span>}
      </>
    )

    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    }

    return (
      <UIButton
        ref={ref}
        className={cn(
          fullWidth && 'w-full',
          gradient &&
            'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
          shadow && 'shadow-lg hover:shadow-xl transition-shadow',
          roundedClasses[rounded],
          className
        )}
        disabled={disabled || loading}
        variant={variant}
        size={size}
        {...props}
      >
        {content}
      </UIButton>
    )
  }
)

Button.displayName = 'Button'

