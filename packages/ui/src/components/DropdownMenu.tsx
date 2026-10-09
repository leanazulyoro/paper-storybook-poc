'use client'

// A controlled value with select-only combobox/listbox semantics. Copy comes from props.
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
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
  open: controlledOpen,
  onOpenChange,
}: DropdownMenuProps) => {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const search = useRef({ text: '', at: 0 })
  const [localOpen, setLocalOpen] = useState(false)
  const [activeValue, setActiveValue] = useState(value)
  const enabled = options.filter((option) => !option.disabled)
  const selected = options.find((option) => option.value === value)
  const active =
    enabled.find((option) => option.value === activeValue) ??
    enabled.find((option) => option.value === value) ??
    enabled[0]
  const isDisabled = disabled || enabled.length === 0
  const isOpen = !isDisabled && (controlledOpen ?? localOpen)
  const isEndAligned = align === 'end'
  const listId = `${id}-list`
  const optionId = (option: DropdownMenuOption) => `${id}-option-${options.indexOf(option)}`

  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setLocalOpen(next)
    onOpenChange?.(next)
  }
  const commit = (option = active) => {
    if (option && !option.disabled && option.value !== value) onValueChange(option.value)
    setOpen(false)
  }
  const show = (option = enabled.find((item) => item.value === value) ?? enabled[0]) => {
    if (isDisabled) return
    search.current = { text: '', at: 0 }
    if (option) setActiveValue(option.value)
    setOpen(true)
  }

  // Clicking outside only closes, like a native <select>: a hovered (active) option is a
  // highlight, not a choice. Selecting takes a click, Enter/Space, or Tab from the keyboard.
  useEffect(() => {
    if (!isOpen) return
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) {
        if (controlledOpen === undefined) setLocalOpen(false)
        onOpenChange?.(false)
      }
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [isOpen, controlledOpen, onOpenChange])

  useEffect(() => {
    if (isOpen && active) {
      document.getElementById(`${id}-option-${options.indexOf(active)}`)?.scrollIntoView({ block: 'nearest' })
    }
  }, [isOpen, active, id, options])

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = active ? enabled.indexOf(active) : 0
    const move = (next: number) => {
      const option = enabled[Math.max(0, Math.min(enabled.length - 1, next))]
      if (option) setActiveValue(option.value)
    }
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        if (event.altKey && event.key === 'ArrowUp' && isOpen) commit()
        else if (!isOpen) show()
        else move(index + (event.key === 'ArrowDown' ? 1 : -1))
        return
      case 'Home':
      case 'End':
      case 'PageUp':
      case 'PageDown':
        event.preventDefault()
        if (!isOpen) show()
        move(
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? enabled.length - 1
              : index + (event.key === 'PageDown' ? 10 : -10),
        )
        return
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (isOpen) commit()
        else show()
        return
      case 'Escape':
        if (isOpen) {
          event.preventDefault()
          setOpen(false)
        }
        return
      case 'Tab':
        if (isOpen) commit()
        return
    }
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return
    event.preventDefault()
    const now = Date.now()
    const text = (now - search.current.at < 500 ? search.current.text : '') + event.key.toLocaleLowerCase()
    search.current = { text, at: now }
    const query = [...text].every((letter) => letter === text[0]) ? text[0] : text
    const ordered = [...enabled.slice(index + 1), ...enabled.slice(0, index + 1)]
    const match = ordered.find((option) => option.label.toLocaleLowerCase().startsWith(query))
    if (!isOpen) setOpen(true)
    if (match) setActiveValue(match.value)
  }

  return (
    <div
      ref={root}
      className={s.root}
      onBlur={(event) => {
        // Focus leaving closes without selecting; Tab commits in handleKeyDown before blur.
        if (isOpen && !event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-activedescendant={isOpen && active ? optionId(active) : undefined}
        disabled={isDisabled}
        className={cn(s.trigger, focusRing, 'disabled:cursor-not-allowed')}
        onKeyDown={handleKeyDown}
        onClick={() => (isOpen ? setOpen(false) : show())}
      >
        {selected?.label ?? label}
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} className={s.chevron} />
      </button>
      {isOpen && (
        <div
          id={listId}
          role="listbox"
          aria-label={label}
          className={cn(s.content, isEndAligned && s.end)}
        >
          {options.map((option) => (
            <div
              key={option.value}
              id={optionId(option)}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              className={cn(
                s.option,
                !option.disabled && option.value === active?.value && s.active,
                option.value === value && s.selected,
                option.disabled && s.disabled,
                option.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              )}
              onPointerMove={() => {
                if (!option.disabled) setActiveValue(option.value)
              }}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => {
                if (!option.disabled) {
                  commit(option)
                  trigger.current?.focus()
                }
              }}
            >
              <span className={s.label}>{option.label}</span>
              <span className={s.indicator} aria-hidden>
                {option.value === value && <Icon name="check" className={s.check} />}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
