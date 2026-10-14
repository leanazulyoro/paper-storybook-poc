import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within, waitFor } from 'storybook/test'
import { listKeyboard } from '../stories/listKeyboard'
import { NetworkDropdown, networks } from '../stories/NetworkDropdown'
import { pseudo } from '../stories/StatesBoard'
import { Button } from './Button'
import { DropdownMenu } from './DropdownMenu'

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  args: { label: 'Network', value: 'ethereum', options: networks, onValueChange: fn(), onOpenChange: fn() },
  decorators: [
    (Story) => (
      <div className="h-80 w-58">
        <Story />
      </div>
    ),
  ],
  render: (args) => <NetworkDropdown {...args} />,
}
export default meta
type Story = StoryObj<typeof DropdownMenu>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }

// Room to the left, so this checks end alignment, not collision avoidance (Base UI shifts a
// popup that would overflow the viewport).
export const End: Story = {
  args: { align: 'end' },
  render: (args) => (
    <div className="flex w-[480px] justify-end">
      <NetworkDropdown {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body) // the popup renders in a portal
    const trigger = canvas.getByRole('combobox')
    await userEvent.click(trigger)
    const popup = await page.findByRole('listbox')
    const triggerBox = trigger.getBoundingClientRect()
    const popupBox = popup.getBoundingClientRect()
    await expect(popupBox.right).toBeCloseTo(triggerBox.right, 1)
    await expect(popupBox.top - triggerBox.bottom).toBeCloseTo(8, 1)
    await userEvent.click(await page.findByRole('option', { name: 'Base' }))
    await expect(trigger).toHaveTextContent('Base')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

// The reviewed open view: Ethereum selected, Arbitrum hovered, Polygon disabled.
export const Open: Story = {
  tags: ['paper'],
  parameters: { paper: 'Components › DropdownMenu › Open · align start' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body) // the popup renders in a portal
    await userEvent.click(canvas.getByRole('combobox'))
    await userEvent.hover(await page.findByRole('option', { name: 'Arbitrum' }))
  },
}

export const PointerSelection: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body) // the popup renders in a portal
    const trigger = canvas.getByRole('combobox')
    await userEvent.click(trigger)
    await expect(await page.findByRole('option', { name: 'Ethereum' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    const disabled = await page.findByRole('option', { name: 'Polygon' })
    await expect(disabled).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(disabled)
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await expect(trigger).toHaveTextContent('Ethereum')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(await page.findByRole('option', { name: 'Base' }))
    await expect(args.onValueChange).toHaveBeenCalledWith('base')
    await expect(trigger).toHaveTextContent('Base')
    await waitFor(() => expect(trigger).toHaveFocus())
    await waitFor(() => expect(page.queryByRole('listbox')).not.toBeInTheDocument())
  },
}

export const KeyboardSelection: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox')
    const { current, step, open } = listKeyboard(canvasElement, trigger)
    trigger.focus()
    await open('{ArrowDown}')
    await waitFor(() => expect(current()).toBe('Ethereum')) // opens on the selected option
    await step('{ArrowDown}', 'Arbitrum')
    await step('{ArrowDown}', 'Base')
    await expect(trigger).toHaveTextContent('Ethereum')
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await open('{Enter}')
    // Disabled options stay reachable by keyboard but not selectable: End lands on Polygon.
    await step('{End}', 'Polygon')
    await userEvent.keyboard('{Enter}')
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await step('{ArrowUp}', 'Base')
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(args.onValueChange).toHaveBeenCalledWith('base'))
    await expect(trigger).toHaveTextContent('Base')
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    await open('{Enter}')
    await step('{Home}', 'Ethereum')
    await userEvent.keyboard(' ')
    await waitFor(() => expect(trigger).toHaveTextContent('Ethereum'))
    await open('{Enter}')
    await step('b', 'Base') // typeahead
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(trigger).toHaveTextContent('Base'))
  },
}

export const TabAndOutsideDismissal: Story = {
  render: (args) => (
    <div className="flex items-start gap-4">
      <NetworkDropdown {...args} />
      <Button variant="secondary">Next control</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body) // the popup renders in a portal
    const trigger = canvas.getByRole('combobox')
    const next = canvas.getByRole('button', { name: 'Next control' })
    trigger.focus()
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await userEvent.tab()
    await expect(next).toHaveFocus()
    // Base UI: Tab closes without selecting (the hand-written version committed the highlight).
    await expect(trigger).toHaveTextContent('Ethereum')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await userEvent.click(next)
    await expect(next).toHaveFocus()
    await waitFor(() => expect(page.queryByRole('listbox')).not.toBeInTheDocument())
  },
}

// Hovering only highlights: clicking outside closes the menu and keeps the selected value,
// like a native <select>. (Tab also closes without selecting: Base UI's behaviour.)
export const HoverThenOutsideClickKeepsValue: Story = {
  render: (args) => (
    <div className="flex items-start gap-4">
      <NetworkDropdown {...args} />
      <Button variant="secondary">Next control</Button>
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body) // the popup renders in a portal
    const trigger = canvas.getByRole('combobox')
    await userEvent.click(trigger)
    await userEvent.hover(await page.findByRole('option', { name: 'Base' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Next control' }))
    await waitFor(() => expect(page.queryByRole('listbox')).not.toBeInTheDocument())
    await expect(trigger).toHaveTextContent('Ethereum')
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const DisabledTrigger: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const trigger = within(canvasElement).getByRole('combobox')
    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger)
    await expect(args.onOpenChange).not.toHaveBeenCalled()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  },
}

export const States: Story = {
  tags: ['paper'],
  parameters: {
    paper: 'Components › DropdownMenu (trigger states)',
    pseudo: { ...pseudo, hover: ['[data-state="hover"] [role="combobox"]'] },
  },
  decorators: [
    (Story) => (
      <div className="h-80 w-[824px] p-8">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <div className="flex items-start gap-8">
      <div className="flex w-58 flex-col gap-6">
        <div>
          <p className="mb-2 text-small text-muted-foreground">Closed</p>
          <NetworkDropdown {...args} />
        </div>
        <div data-state="hover">
          <p className="mb-2 text-small text-muted-foreground">Trigger · hover</p>
          <NetworkDropdown {...args} />
        </div>
        <div>
          <p className="mb-2 text-small text-muted-foreground">Trigger · disabled</p>
          <NetworkDropdown {...args} disabled />
        </div>
      </div>
      <div className="w-58">
        <p className="mb-2 text-small text-muted-foreground">Open · align start</p>
        <NetworkDropdown {...args} open />
      </div>
      <div className="flex w-58 flex-col items-end">
        <p className="mb-2 text-small text-muted-foreground">Open · align end</p>
        <NetworkDropdown {...args} align="end" open />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(canvasElement.ownerDocument.body) // the popup renders in a portal
    for (const option of await page.findAllByRole('option', { name: 'Arbitrum' })) {
      await userEvent.hover(option)
    }
  },
}
