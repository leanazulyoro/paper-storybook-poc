import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { pseudo, StatesBoard } from '../stories/StatesBoard'
import { CopyButton } from './CopyButton'

const meta: Meta<typeof CopyButton> = {
  title: 'Components/CopyButton',
  component: CopyButton,
  args: {
    value: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    label: '0x71C7…976F',
    copiedLabel: 'Copied',
    copyLabel: 'Copy address',
    onCopy: fn(),
  },
  // Storybook's iframe may deny clipboard access; stub it so the behaviour is testable.
  beforeEach: () => {
    const original = navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: fn().mockResolvedValue(undefined) },
    })
    return () => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: original })
  },
}
export default meta
type Story = StoryObj<typeof CopyButton>

export const Idle: Story = {}

// Clicks the button; mirrors Paper's CopyButton/Copied.
export const Copied: Story = {
  args: { resetAfterMs: 60_000 },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Copy address' }))
    await expect(navigator.clipboard.writeText).toHaveBeenCalledWith(args.value)
    await expect(args.onCopy).toHaveBeenCalledWith(args.value)
    await expect(within(canvasElement).getByRole('button', { name: 'Copied' })).toBeInTheDocument()
  },
}

// Behaviour check: the copied state resets on its own.
export const ResetsAfterTimeout: Story = {
  args: { resetAfterMs: 300 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Copy address' }))
    await expect(canvas.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    await expect(
      await canvas.findByRole('button', { name: 'Copy address' }, { timeout: 2000 }),
    ).toBeInTheDocument()
  },
}

// Mirrors the Paper board.
export const AllVariants: Story = {
  tags: ['paper'],
  parameters: { paper: 'Components › CopyButton' },
  render: (args) => (
    <div className="flex items-center gap-4">
      <CopyButton {...args} />
      <CopyButton {...args} resetAfterMs={60_000} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getAllByRole('button')[1])
  },
}

// Interaction states forced via pseudo-states; compare with the Paper CopyButton board
// (CopyButton/Idle, CopyButton/Idle/Focus, CopyButton/Copied). Copied is a data state: clicked.
export const States: Story = {
  tags: ['paper'],
  parameters: { paper: 'Components › CopyButton (state frames)', pseudo },
  render: (args) => (
    <StatesBoard
      columns={['Idle', 'Focus', 'Copied']}
      rows={[
        {
          name: 'copy button',
          cells: [
            { state: 'default', node: <CopyButton {...args} /> },
            { state: 'focus', node: <CopyButton {...args} /> },
            { state: 'copied', node: <CopyButton {...args} resetAfterMs={60_000} /> },
          ],
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const copied = canvasElement.querySelector('[data-state="copied"] button')
    if (copied instanceof HTMLElement) await userEvent.click(copied)
  },
}
