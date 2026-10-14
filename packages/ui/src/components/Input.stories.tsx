import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { pseudo, StatesBoard } from '../stories/StatesBoard'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: { label: 'Amount', placeholder: '0.00', hint: 'Balance: 1,240.50 USDC', className: 'w-[232px]' },
}
export default meta
type Story = StoryObj<typeof Input>

// Base UI Field wires the label, the hint/error description and aria-invalid.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Amount' })
    await expect(input).toHaveAccessibleDescription('Balance: 1,240.50 USDC')
    await expect(input).not.toHaveAttribute('aria-invalid')
  },
}
export const Error: Story = {
  args: { defaultValue: '2,000.00', error: 'Exceeds balance' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Amount' })
    await expect(input).toHaveAccessibleDescription('Exceeds balance')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAttribute('data-invalid')
  },
}

// Mirrors the Paper board.
export const AllVariants: Story = {
  tags: ['paper'],
  parameters: { paper: 'Components › Input' },
  render: () => (
    <div className="flex gap-6">
      <Input className="w-[232px]" label="Amount" placeholder="0.00" hint="Balance: 1,240.50 USDC" />
      <Input className="w-[232px]" label="Amount" defaultValue="2,000.00" error="Exceeds balance" />
    </div>
  ),
}

// Interaction states forced via pseudo-states; compare with the Paper Input board
// (Input/Default, Input/Focus, Input/Error).
export const States: Story = {
  tags: ['paper'],
  parameters: { paper: 'Components › Input (state frames)', pseudo },
  render: () => (
    <StatesBoard
      columns={['Default', 'Focus', 'Error']}
      rows={[
        {
          name: 'input',
          cells: [
            {
              state: 'default',
              node: (
                <Input
                  className="w-[232px]"
                  label="Amount"
                  placeholder="0.00"
                  hint="Balance: 1,240.50 USDC"
                />
              ),
            },
            {
              state: 'focus',
              node: (
                <Input
                  className="w-[232px]"
                  label="Amount"
                  placeholder="0.00"
                  hint="Balance: 1,240.50 USDC"
                />
              ),
            },
            {
              state: 'error',
              node: (
                <Input className="w-[232px]" label="Amount" defaultValue="2,000.00" error="Exceeds balance" />
              ),
            },
          ],
        },
      ]}
    />
  ),
}
