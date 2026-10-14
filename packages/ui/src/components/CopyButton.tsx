'use client'

// Behaviour lives here and must survive every Paper sync: clipboard write, copied state,
// auto-reset timer, live-region announcement. Visuals come from CopyButton.styles.ts; the copied
// state reaches them as `data-copied`.
import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '../cn'
import { focusRing } from '../focusRing'
import { Icon } from './Icon'
import { copyButtonStyles as s } from './CopyButton.styles'

export type CopyButtonProps = {
  /** Text written to the clipboard (e.g. the full address). */
  value: string
  /** What the button shows while idle (e.g. a truncated address). */
  label: ReactNode
  /** Shown after copying, e.g. t('copied'). */
  copiedLabel: string
  /** Accessible name while idle, e.g. t('copyAddress'). */
  copyLabel: string
  /** How long the copied state lasts. */
  resetAfterMs?: number
  onCopy?: (value: string) => void
}

export const CopyButton = ({
  value,
  label,
  copiedLabel,
  copyLabel,
  resetAfterMs = 2000,
  onCopy,
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), resetAfterMs)
    return () => clearTimeout(timer)
  }, [copied, resetAfterMs])

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      onCopy?.(value)
    } catch {
      // Clipboard unavailable (permissions, insecure context): stay idle.
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? copiedLabel : copyLabel}
      data-copied={copied || undefined}
      className={cn(s.base, 'cursor-pointer', focusRing)}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
      <Icon name={copied ? 'check' : 'copy'} className={s.icon} />
    </button>
  )
}
