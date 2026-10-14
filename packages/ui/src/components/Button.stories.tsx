import type { Meta, StoryObj } from '@storybook/react-vite'
import { pseudo, StatesBoard } from '../stories/StatesBoard'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { variant: 'primary', children: 'Deposit' },
}
export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary', children: 'Withdraw' } }
export const Disabled: Story = { args: { disabled: true } }

// render: the app's link (next/link in apps/web) styled as a button.
export const AsLink: Story = {
  args: { render: <a href="#vaults" />, variant: 'secondary', children: 'View vaults' },
}

// Mirrors the Paper board.
export const AllVariants: Story = {
  tags: ['paper'],
  parameters: { paper: 'Components › Button' },
  render: () => (
    <div className="flex items-center gap-4">
      <Button>Deposit</Button>
      <Button variant="secondary">Withdraw</Button>
      <Button disabled>Deposit</Button>
    </div>
  ),
}

// Interaction states forced via pseudo-states; compare 1:1 with the Paper Button board
// (Button/Primary/Hover, Button/Secondary/Hover, Button/Primary/Focus, Button/Disabled).
// "Disabled + hover" checks that hover never applies to a disabled button.
export const States: Story = {
  tags: ['paper'],
  parameters: { paper: 'Components › Button (state frames)', pseudo },
  render: () => (
    <StatesBoard
      columns={['Default', 'Hover', 'Focus', 'Disabled', 'Disabled + hover']}
      rows={(['primary', 'secondary'] as const).map((variant) => ({
        name: variant,
        cells: [
          { state: 'default', node: <Button variant={variant}>Deposit</Button> },
          { state: 'hover', node: <Button variant={variant}>Deposit</Button> },
          { state: 'focus', node: <Button variant={variant}>Deposit</Button> },
          {
            state: 'disabled',
            node: (
              <Button variant={variant} disabled>
                Deposit
              </Button>
            ),
          },
          {
            state: 'disabled-hover',
            node: (
              <Button variant={variant} disabled>
                Deposit
              </Button>
            ),
          },
        ],
      }))}
    />
  ),
}
