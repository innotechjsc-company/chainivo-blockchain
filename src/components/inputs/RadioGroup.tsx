import React from 'react'
import {
  RadioGroup as UIRadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  label?: string
  helperText?: string
  error?: string
  options: RadioOption[]
  value?: string
  onValueChange?: (value: string) => void
  name?: string
  required?: boolean
  disabled?: boolean
  layout?: 'vertical' | 'horizontal'
  containerClassName?: string
  id?: string
}

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof UIRadioGroup>,
  RadioGroupProps
>(
  (
    {
      label,
      helperText,
      error,
      options,
      value,
      onValueChange,
      name,
      required = false,
      disabled = false,
      layout = 'vertical',
      containerClassName,
      id,
    },
    ref
  ) => {
    const groupId = id || name || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={cn('space-y-3', containerClassName)}>
        {label && (
          <Label
            className={cn(
              'text-base',
              required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
            )}
          >
            {label}
          </Label>
        )}
        <UIRadioGroup
          ref={ref}
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          name={name}
          className={cn(
            layout === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-3'
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${groupId}-error` : helperText ? `${groupId}-helper` : undefined
          }
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                'flex items-start gap-3',
                layout === 'horizontal' && 'items-center'
              )}
            >
              <RadioGroupItem
                value={option.value}
                id={`${groupId}-${option.value}`}
                disabled={option.disabled || disabled}
                className={cn(error && 'border-red-500')}
              />
              <div className="flex-1 space-y-1">
                <Label
                  htmlFor={`${groupId}-${option.value}`}
                  className="cursor-pointer font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </Label>
                {option.description && (
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </UIRadioGroup>
        {error && (
          <p id={`${groupId}-error`} className="text-sm text-red-500">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${groupId}-helper`} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

