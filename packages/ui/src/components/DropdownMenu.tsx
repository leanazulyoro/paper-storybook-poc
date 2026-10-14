'use client'

// A controlled single choice on Base UI Select: keyboard, typeahead, dismissal, focus, ARIA and
// positioning come from Base UI. Copy comes from props; visuals from DropdownMenu.styles.ts.
import { Select } from '@base-ui/react/select'
import { useMemo } from 'react'
import { cn } from '../cn'
import { focusRing } from '../focusRing'
import { Icon } from './Icon'
import { dropdownMenuStyles as s } from './DropdownMenu.styles'

export type DropdownMenuOption = { value: string; label: string; disabled?: boolean }
export type DropdownMenuProps = {
  options: readonly DropdownMenuOption[]
  value: string
  onValueChange: (value: string) => void
  /** Translated accessible name, e.g. the field's network label. */
  label: string
  disabled?: boolean
  /** Aligns the popup to the start or end of its trigger. */
  align?: 'start' | 'end'
  /** Optional controlled popup state; selection is always controlled. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const DropdownMenu = ({
  options,
  value,
  onValueChange,
  label,
  disabled = false,
  align = 'start',
  open,
  onOpenChange,
}: DropdownMenuProps) => {
  // Value → label map, so the trigger shows the label before the popup ever mounts.
  const items = useMemo(() => options.map(({ value, label }) => ({ value, label })), [options])
  const isDisabled = disabled || options.every((option) => option.disabled)

  return (
    <Select.Root
      items={items}
      value={value}
      // Our API has no "clear": ignore null, and only report real changes.
      onValueChange={(next) => {
        if (next != null && next !== value) onValueChange(next)
      }}
      disabled={isDisabled}
      open={open}
      onOpenChange={onOpenChange && ((next) => onOpenChange(next))}
    >
      <Select.Trigger
        aria-label={label}
        className={cn(s.trigger, focusRing, 'cursor-pointer data-disabled:cursor-not-allowed')}
      >
        <Select.Value />
        {/* One chevron; the open state rotates it (Paper: Trigger/Open). Motion is code-owned. */}
        <Icon name="chevron-down" className={cn(s.chevron, 'transition-transform')} />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner side="bottom" align={align} alignItemWithTrigger={false}>
          <Select.Popup aria-label={label} className={s.content}>
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={cn(s.option, 'cursor-pointer data-disabled:cursor-not-allowed')}
              >
                <Select.ItemText className={s.label}>{option.label}</Select.ItemText>
                <span className={s.indicator} aria-hidden>
                  <Select.ItemIndicator>
                    <Icon name="check" className={s.check} />
                  </Select.ItemIndicator>
                </span>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
