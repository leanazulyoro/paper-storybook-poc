'use client'

// A controlled single choice between views on Base UI Tabs (Root + List + Tab): roving focus,
// arrow/Home/End keys, disabled tabs, tablist/tab ARIA and `data-active` come from Base UI.
// Copy comes from props; visuals from Tabs.styles.ts. Panels are the consumer's (Base UI
// `Tabs.Panel` needs the same Root); this renders the list only, as drawn in Paper.
import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import { cn } from '../cn'
import { focusRing } from '../focusRing'
import { tabsStyles as s } from './Tabs.styles'

export type TabsItem = { value: string; label: string; disabled?: boolean }
export type TabsProps = {
  items: readonly TabsItem[]
  value: string
  onValueChange: (value: string) => void
  /** Translated accessible name of the tab list, e.g. t('depositMode'). */
  label: string
}

export const Tabs = ({ items, value, onValueChange, label }: TabsProps) => (
  <BaseTabs.Root
    value={value}
    // Only report real, user-initiated changes; a controlled root never falls back on its own.
    onValueChange={(next) => {
      if (typeof next === 'string' && next !== value) onValueChange(next)
    }}
  >
    <BaseTabs.List aria-label={label} className={s.list}>
      {items.map((item) => (
        <BaseTabs.Tab
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={cn(s.tab, focusRing, 'cursor-pointer data-disabled:cursor-not-allowed')}
        >
          {item.label}
        </BaseTabs.Tab>
      ))}
    </BaseTabs.List>
  </BaseTabs.Root>
)
