import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonGroupProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  attached?: boolean
  className?: string
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  attached = false,
  className,
}) => {
  const isVertical = orientation === 'vertical'

  return (
    <div
      className={cn(
        'inline-flex',
        isVertical ? 'flex-col' : 'flex-row',
        attached && [
          '[&>button]:rounded-none',
          '[&>button:first-child]:rounded-l-md',
          '[&>button:last-child]:rounded-r-md',
          isVertical && [
            '[&>button:first-child]:rounded-t-md [&>button:first-child]:rounded-l-none',
            '[&>button:last-child]:rounded-b-md [&>button:last-child]:rounded-r-none',
          ],
          '[&>button:not(:last-child)]',
          isVertical ? 'border-b-0' : 'border-r-0',
        ],
        !attached && 'gap-2',
        className
      )}
      role="group"
    >
      {children}
    </div>
  )
}

ButtonGroup.displayName = 'ButtonGroup'

