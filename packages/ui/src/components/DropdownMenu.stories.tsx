import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { NetworkDropdown, networks } from '../stories/NetworkDropdown'
import { pseudo } from '../stories/StatesBoard'
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

export const End: Story = {
  args: { align: 'end' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox')
    await userEvent.click(trigger)
    const popup = canvas.getByRole('listbox')
    const triggerBox = trigger.getBoundingClientRect()
    const popupBox = popup.getBoundingClientRect()
    await expect(popupBox.right).toBeCloseTo(triggerBox.right, 1)
    await expect(popupBox.top - triggerBox.bottom).toBeCloseTo(8, 1)
    await userEvent.click(canvas.getByRole('option', { name: 'Base' }))
    await expect(trigger).toHaveTextContent('Base')
    await expect(trigger).toHaveFocus()
  },
}

// The reviewed open view: Ethereum selected, Arbitrum hovered, Polygon disabled.
export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
    await userEvent.hover(canvas.getByRole('option', { name: 'Arbitrum' }))
  },
}

export const PointerSelection: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox')
    await userEvent.click(trigger)
    await expect(canvas.getByRole('option', { name: 'Ethereum' })).toHaveAttribute('aria-selected', 'true')
    const disabled = canvas.getByRole('option', { name: 'Polygon' })
    await expect(disabled).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(disabled)
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await expect(trigger).toHaveTextContent('Ethereum')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(canvas.getByRole('option', { name: 'Base' }))
    await expect(args.onValueChange).toHaveBeenCalledWith('base')
    await expect(trigger).toHaveTextContent('Base')
    await expect(trigger).toHaveFocus()
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
  },
}

export const KeyboardSelection: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox')
    trigger.focus()
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}')
    await expect(trigger).toHaveAttribute(
      'aria-activedescendant',
      canvas.getByRole('option', { name: 'Base' }).id,
    )
    await expect(trigger).toHaveTextContent('Ethereum')
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await userEvent.keyboard('{Escape}')
    await expect(trigger).toHaveFocus()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await userEvent.keyboard('{Enter}{End}{Enter}')
    await expect(args.onValueChange).toHaveBeenCalledWith('base')
    await expect(trigger).toHaveTextContent('Base')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.keyboard('{Enter}{Home} ')
    await expect(trigger).toHaveTextContent('Ethereum')
    await userEvent.keyboard('b{Enter}')
    await expect(trigger).toHaveTextContent('Base')
  },
}

export const TabAndOutsideDismissal: Story = {
  render: (args) => (
    <>
      <NetworkDropdown {...args} />
      <button type="button">Next control</button>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox')
    const next = canvas.getByRole('button', { name: 'Next control' })
    trigger.focus()
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await userEvent.tab()
    await expect(next).toHaveFocus()
    await expect(trigger).toHaveTextContent('Arbitrum')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await userEvent.click(next)
    await expect(next).toHaveFocus()
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
  },
}

// Hovering only highlights: clicking outside closes the menu and keeps the selected value,
// like a native <select>. (Tab still commits the keyboard-active option, see above.)
export const HoverThenOutsideClickKeepsValue: Story = {
  render: (args) => (
    <>
      <NetworkDropdown {...args} />
      <button type="button">Next control</button>
    </>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('combobox')
    await userEvent.click(trigger)
    await userEvent.hover(canvas.getByRole('option', { name: 'Base' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Next control' }))
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument()
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
  parameters: { pseudo: { ...pseudo, hover: ['[data-state="hover"] [role="combobox"]'] } },
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
    for (const option of canvas.getAllByRole('option', { name: 'Arbitrum' })) {
      await userEvent.hover(option)
    }
  },
}
