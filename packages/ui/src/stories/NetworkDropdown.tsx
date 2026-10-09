// Design-only sample networks shared by Storybook fixtures; no service support is implied.
import { useState } from 'react'
import { DropdownMenu, type DropdownMenuOption, type DropdownMenuProps } from '../components/DropdownMenu'

export const networks: readonly DropdownMenuOption[] = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'base', label: 'Base' },
  { value: 'polygon', label: 'Polygon', disabled: true },
]

export const NetworkDropdown = ({
  options = networks,
  label = 'Network',
  value: initialValue = 'ethereum',
  open: initialOpen = false,
  onValueChange,
  onOpenChange,
  ...props
}: Partial<DropdownMenuProps>) => {
  const [value, setValue] = useState(initialValue)
  const [open, setOpen] = useState(initialOpen)
  return (
    <DropdownMenu
      {...props}
      options={options}
      label={label}
      value={value}
      open={open}
      onValueChange={(value) => {
        setValue(value)
        onValueChange?.(value)
      }}
      onOpenChange={(open) => {
        setOpen(open)
        onOpenChange?.(open)
      }}
    />
  )
}
