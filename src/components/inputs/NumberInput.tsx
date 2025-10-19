import React from 'react'
import { TextInput, TextInputProps } from './TextInput'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NumberInputProps extends Omit<TextInputProps, 'type'> {
  min?: number
  max?: number
  step?: number
  showStepper?: boolean
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      min,
      max,
      step = 1,
      showStepper = true,
      value,
      onChange,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : (value as number) || 0

    const handleIncrement = () => {
      const newValue = numValue + step
      if (max === undefined || newValue <= max) {
        triggerChange(newValue)
      }
    }

    const handleDecrement = () => {
      const newValue = numValue - step
      if (min === undefined || newValue >= min) {
        triggerChange(newValue)
      }
    }

    const triggerChange = (newValue: number) => {
      const event = {
        target: { value: String(newValue) },
      } as React.ChangeEvent<HTMLInputElement>
      onChange?.(event)
    }

    return (
      <TextInput
        ref={ref}
        type="number"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        containerClassName={containerClassName}
        {...props}
      />
    )
  }
)

NumberInput.displayName = 'NumberInput'

