import React, { useEffect, useRef, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface TextareaInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  showCharacterCount?: boolean
  autoResize?: boolean
  minRows?: number
  maxRows?: number
  containerClassName?: string
}

export const TextareaInput = React.forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  (
    {
      label,
      error,
      helperText,
      showCharacterCount = false,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      containerClassName,
      className,
      id,
      required,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [charCount, setCharCount] = useState(0)
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current
        textarea.style.height = 'auto'
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight)
        const minHeight = lineHeight * minRows
        const maxHeight = lineHeight * maxRows
        const scrollHeight = textarea.scrollHeight
        textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`
      }
    }, [value, autoResize, minRows, maxRows])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      onChange?.(e)
    }

    useEffect(() => {
      if (value) {
        setCharCount(String(value).length)
      }
    }, [value])

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <div className="flex items-center justify-between">
            <Label
              htmlFor={inputId}
              className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}
            >
              {label}
            </Label>
            {showCharacterCount && (
              <span className="text-xs text-muted-foreground">
                {charCount}
                {maxLength && `/${maxLength}`}
              </span>
            )}
          </div>
        )}
        <Textarea
          ref={(node) => {
            textareaRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          id={inputId}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          rows={autoResize ? minRows : props.rows}
          className={cn(
            error && 'border-red-500 focus-visible:ring-red-500',
            autoResize && 'resize-none overflow-hidden',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-500">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

TextareaInput.displayName = 'TextareaInput'

