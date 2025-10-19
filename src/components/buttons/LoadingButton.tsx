import React from 'react'
import { Button, ButtonProps } from './Button'

export interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading = false, children, ...props }, ref) => {
    return (
      <Button ref={ref} loading={isLoading} {...props}>
        {children}
      </Button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'

