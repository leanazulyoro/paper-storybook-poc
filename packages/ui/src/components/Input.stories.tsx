import type { Meta, StoryObj } from '@storybook/react-vite'
import { pseudo, StatesBoard } from '../stories/StatesBoard'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: { label: 'Amount', placeholder: '0.00', hint: 'Balance: 1,240.50 USDC', className: 'w-[232px]' },
}
export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}
export const Error: Story = { args: { defaultValue: '2,000.00', error: 'Exceeds balance' } }

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
