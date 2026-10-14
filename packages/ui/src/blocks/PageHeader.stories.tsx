import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageHeader } from './PageHeader'
import { paperBoard } from '../stories/paperBoard'

const meta: Meta<typeof PageHeader> = {
  title: 'Blocks/PageHeader',
  component: PageHeader,
  parameters: { paper: paperBoard({ board: 'Blocks › PageHeader', surface: 'muted', layout: 'row' }) },
  args: { title: 'Deposit', description: 'Earn variable yield on idle USDC. Withdraw anytime.' },
}
export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = { tags: ['paper'], parameters: { paper: { frame: 'PageHeader/Default' } } }
export const LongText: Story = {
  tags: ['paper'],
  parameters: { paper: { frame: 'PageHeader/LongText' } },
  args: {
    title: 'Einzahlung in den Tresor',
    description: 'Erzielen Sie eine variable Rendite auf ungenutzte USDC. Auszahlung jederzeit möglich.',
  },
}
