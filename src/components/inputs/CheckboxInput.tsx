import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface CheckboxInputProps {
  label?: string
  helperText?: string
  error?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  required?: boolean
  disabled?: boolean
  checkboxPosition?: 'left' | 'right'
  containerClassName?: string
  id?: string
}

export const CheckboxInput = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  CheckboxInputProps
>(
  (
    {
      label,
      helperText,
      error,
      checked,
      onCheckedChange,
      required = false,
      disabled = false,
      checkboxPosition = 'left',
      containerClassName,
      id,
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={cn('space-y-2', containerClassName)}>
        <div
          className={cn(
            'flex items-start gap-3',
            checkboxPosition === 'right' && 'flex-row-reverse justify-between'
          )}
        >
          <Checkbox
            ref={ref}
            id={inputId}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(error && 'border-red-500')}
          />
          {label && (
            <div className="flex-1 space-y-1">
              <Label
                htmlFor={inputId}
                className={cn(
                  'cursor-pointer font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                  required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
                )}
              >
                {label}
              </Label>
              {helperText && !error && (
                <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
                  {helperText}
                </p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    )
  }
)

CheckboxInput.displayName = 'CheckboxInput'

