import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageHeader } from './PageHeader'

const meta: Meta<typeof PageHeader> = {
  title: 'Blocks/PageHeader',
  component: PageHeader,
  args: { title: 'Deposit', description: 'Earn variable yield on idle USDC. Withdraw anytime.' },
}
export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = { tags: ['paper'], parameters: { paper: 'Blocks › PageHeader' } }
export const LongText: Story = {
  tags: ['paper'],
  parameters: { paper: 'Blocks › PageHeader (long text)' },
  args: {
    title: 'Einzahlung in den Tresor',
    description: 'Erzielen Sie eine variable Rendite auf ungenutzte USDC. Auszahlung jederzeit möglich.',
  },
}
