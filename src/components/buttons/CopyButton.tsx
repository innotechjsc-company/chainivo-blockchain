import React, { useState } from 'react'
import { Button, ButtonProps } from './Button'
import { Check, Copy } from 'lucide-react'

export interface CopyButtonProps extends Omit<ButtonProps, 'icon' | 'onClick'> {
  textToCopy: string
  onCopy?: () => void
  successDuration?: number
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      textToCopy,
      onCopy,
      successDuration = 2000,
      children = 'Copy',
      variant = 'outline',
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        onCopy?.()
        setTimeout(() => setCopied(false), successDuration)
      } catch (err) {
        console.error('Failed to copy text:', err)
      }
    }

    return (
      <Button
        ref={ref}
        onClick={handleCopy}
        icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        variant={variant}
        {...props}
      >
        {copied ? 'Copied!' : children}
      </Button>
    )
  }
)

CopyButton.displayName = 'CopyButton'

