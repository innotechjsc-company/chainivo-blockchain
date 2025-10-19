import React from 'react'
import { Button as UIButton, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { VariantProps } from 'class-variance-authority'

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon: React.ReactNode
  loading?: boolean
  rounded?: boolean
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      icon,
      loading = false,
      rounded = false,
      disabled,
      variant = 'outline',
      size = 'icon',
      ...props
    },
    ref
  ) => {
    return (
      <UIButton
        ref={ref}
        className={cn(rounded && 'rounded-full', className)}
        disabled={disabled || loading}
        variant={variant}
        size={size}
        {...props}
      >
        {icon}
      </UIButton>
    )
  }
)

IconButton.displayName = 'IconButton'

