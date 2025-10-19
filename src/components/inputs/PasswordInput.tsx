import React, { useState } from 'react'
import { TextInput, TextInputProps } from './TextInput'
import { Eye, EyeOff } from 'lucide-react'

export interface PasswordInputProps extends Omit<TextInputProps, 'type' | 'rightIcon'> {
  showStrengthMeter?: boolean
}

const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' }
  if (strength <= 3) return { strength, label: 'Medium', color: 'bg-yellow-500' }
  if (strength <= 4) return { strength, label: 'Strong', color: 'bg-green-500' }
  return { strength, label: 'Very Strong', color: 'bg-green-600' }
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrengthMeter = false, containerClassName, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')

    const currentPassword = (value as string) || password
    const strength = showStrengthMeter ? getPasswordStrength(currentPassword) : null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      onChange?.(e)
    }

    return (
      <div className={containerClassName}>
        <TextInput
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...props}
        />
        {showStrengthMeter && currentPassword && strength && (
          <div className="mt-2 space-y-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    level <= strength.strength ? strength.color : 'bg-muted'
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Password strength: <span className="font-medium">{strength.label}</span>
            </p>
          </div>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

