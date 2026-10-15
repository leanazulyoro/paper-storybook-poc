import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'
import { paperBoard } from '../stories/paperBoard'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { paper: paperBoard({ board: 'Components › Badge', width: 560, layout: 'wrap' }) },
}
export default meta
type Story = StoryObj<typeof Badge>

export const Success: Story = { args: { tone: 'success', children: 'Active' } }
export const Warning: Story = { args: { tone: 'warning', children: 'Low liquidity' } }
export const Neutral: Story = { args: { tone: 'neutral', children: 'Paused' } }

// Mirrors the Paper board.
export const AllVariants: Story = {
  tags: ['paper'],
  render: () => (
    <div className="flex items-center gap-3">
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">Low liquidity</Badge>
      <Badge tone="neutral">Paused</Badge>
    </div>
  ),
}
