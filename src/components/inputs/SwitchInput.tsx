import React from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface SwitchInputProps {
  label?: string
  helperText?: string
  error?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  required?: boolean
  disabled?: boolean
  switchPosition?: 'left' | 'right'
  onLabel?: string
  offLabel?: string
  containerClassName?: string
  id?: string
}

export const SwitchInput = React.forwardRef<
  React.ElementRef<typeof Switch>,
  SwitchInputProps
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
      switchPosition = 'left',
      onLabel,
      offLabel,
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
            switchPosition === 'right' && 'flex-row-reverse justify-between'
          )}
        >
          <div className="flex items-center gap-2">
            <Switch
              ref={ref}
              id={inputId}
              checked={checked}
              onCheckedChange={onCheckedChange}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={
                error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
              }
            />
            {(onLabel || offLabel) && (
              <span className="text-sm text-muted-foreground">
                {checked ? onLabel : offLabel}
              </span>
            )}
          </div>
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

SwitchInput.displayName = 'SwitchInput'

