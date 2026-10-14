import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../components/Badge'
import { VaultSummary } from './VaultSummary'

const meta: Meta<typeof VaultSummary> = {
  title: 'Blocks/VaultSummary',
  component: VaultSummary,
  decorators: [
    (Story) => (
      <div className="bg-muted p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'USDC Vault',
    status: <Badge tone="success">Active</Badge>,
    apyLabel: 'Current APY',
    apy: '5.42%',
    stats: [
      { label: 'Total deposits', value: '$48.2M' },
      { label: 'Your deposit', value: '0.00 USDC' },
    ],
  },
}
export default meta
type Story = StoryObj<typeof VaultSummary>

export const Default: Story = { tags: ['paper'], parameters: { paper: 'Blocks › VaultSummary/Default' } }

export const Paused: Story = {
  tags: ['paper'],
  parameters: { paper: 'Blocks › VaultSummary/Paused' },
  args: { status: <Badge tone="neutral">Paused</Badge> },
}

// i18n stress test: long German strings.
export const LongText: Story = {
  tags: ['paper'],
  parameters: { paper: 'Blocks › VaultSummary/LongText' },
  args: {
    title: 'USDC-Tresor mit variabler Rendite',
    status: <Badge tone="warning">Geringe Liquidität</Badge>,
    apyLabel: 'Aktueller effektiver Jahreszins',
    stats: [
      { label: 'Gesamteinlagen aller Teilnehmer', value: '48,2 Mio. $' },
      { label: 'Ihre bisherige Einzahlung', value: '0,00 USDC' },
    ],
  },
}
