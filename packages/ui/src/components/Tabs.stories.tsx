import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { paperBoard } from '../stories/paperBoard'
import { Tabs, type TabsItem, type TabsProps } from './Tabs'

// Design-only sample tabs (Paper: "Sample tab names for design review").
const modes: readonly TabsItem[] = [
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdraw', label: 'Withdraw' },
]

// Stateful wrapper: Tabs is controlled, so stories keep the value here.
const ModeTabs = ({ value: initialValue = 'deposit', onValueChange, ...props }: Partial<TabsProps>) => {
  const [value, setValue] = useState(initialValue)
  return (
    <Tabs
      items={modes}
      label="Mode"
      {...props}
      value={value}
      onValueChange={(next) => {
        setValue(next)
        onValueChange?.(next)
      }}
    />
  )
}

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    paper: paperBoard({
      board: 'Components › Tabs',
      width: 560,
      layout: 'column',
      caption: 'Deposit / Withdraw switch on the Deposit page. Sample tab names for design review.',
    }),
  },
  args: { label: 'Mode', value: 'deposit', items: modes, onValueChange: fn() },
  render: (args) => <ModeTabs {...args} />,
}
export default meta
type Story = StoryObj<typeof Tabs>

// Paper sample: List · Deposit selected.
export const List: Story = {
  tags: ['paper'],
  parameters: { paper: { frame: 'Tabs/List' } },
}

// Paper sample: Tab · idle · hover · selected · disabled (one list, one tab per state).
export const States: Story = {
  tags: ['paper'],
  parameters: { pseudo: { hover: ['[role="tab"]:nth-child(2)'] } },
  args: {
    items: [
      { value: 'idle', label: 'Withdraw' },
      { value: 'hover', label: 'Withdraw' },
      { value: 'deposit', label: 'Deposit' },
      { value: 'borrow', label: 'Borrow', disabled: true },
    ],
  },
}

export const KeyboardAndPointer: Story = {
  args: { items: [...modes, { value: 'borrow', label: 'Borrow', disabled: true }] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const deposit = canvas.getByRole('tab', { name: 'Deposit' })
    const withdraw = canvas.getByRole('tab', { name: 'Withdraw' })
    const borrow = canvas.getByRole('tab', { name: 'Borrow' })
    await expect(canvas.getByRole('tablist', { name: 'Mode' })).toBeInTheDocument()
    await expect(deposit).toHaveAttribute('aria-selected', 'true')

    // Arrow keys move focus only (activateOnFocus is off); Enter/Space select.
    await userEvent.click(deposit)
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(withdraw).toHaveFocus())
    await expect(deposit).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(withdraw).toHaveAttribute('aria-selected', 'true'))
    await expect(args.onValueChange).toHaveBeenCalledWith('withdraw')

    // Disabled tab: not selectable by pointer.
    await userEvent.click(borrow)
    await expect(borrow).toHaveAttribute('aria-disabled', 'true')
    await expect(borrow).toHaveAttribute('aria-selected', 'false')
    await expect(args.onValueChange).toHaveBeenCalledTimes(1)

    await userEvent.click(deposit)
    await waitFor(() => expect(deposit).toHaveAttribute('aria-selected', 'true'))
    await expect(args.onValueChange).toHaveBeenLastCalledWith('deposit')
  },
}
