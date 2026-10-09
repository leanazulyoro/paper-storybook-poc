// Mirrors Paper "Jazzy nest" › Screens › Deposit, composed only from ui blocks.
// The shipped page lives in apps/web (wired to real state + messages); this is its design mirror
// with sample data, so Storybook and Paper can be compared screen to screen.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { NetworkDropdown } from '../stories/NetworkDropdown'
import { Badge } from '../components/Badge'
import { TextLink } from '../components/TextLink'
import { DepositForm } from '../blocks/DepositForm'
import { Page } from '../blocks/Page'
import { PageHeader } from '../blocks/PageHeader'
import { VaultSummary } from '../blocks/VaultSummary'

type Args = { value: string; error?: string; deposit: string; submitting: boolean }

const DepositPage = ({ value: initialValue, error, deposit, submitting }: Args) => {
  const [value, setValue] = useState(initialValue)
  return (
    <Page>
      <PageHeader title="Deposit" description="Earn variable yield on idle USDC. Withdraw anytime." />
      <div className="flex flex-col items-start gap-6 md:flex-row">
        <VaultSummary
          title="USDC Vault"
          status={<Badge tone="success">Active</Badge>}
          apyLabel="Current APY"
          apy="5.42%"
          stats={[
            { label: 'Total deposits', value: '$48.2M' },
            { label: 'Your deposit', value: deposit },
          ]}
        />
        <DepositForm
          title="Deposit USDC"
          network={<NetworkDropdown align="end" />}
          amountLabel="Amount"
          amountPlaceholder="0.00"
          balanceHint="Balance: 1,240.50 USDC"
          error={error}
          value={value}
          onValueChange={setValue}
          terms={
            <>
              By depositing you accept the{' '}
              <TextLink>
                <a href="#terms">vault terms</a>
              </TextLink>
            </>
          }
          submitLabel={submitting ? 'Depositing…' : 'Deposit'}
          submitting={submitting}
          onSubmit={() => {}}
        />
      </div>
    </Page>
  )
}

const meta: Meta<typeof DepositPage> = {
  title: 'Pages/Deposit',
  component: DepositPage,
  parameters: { layout: 'fullscreen' },
  args: { value: '', deposit: '0.00 USDC', submitting: false },
}
export default meta
type Story = StoryObj<typeof DepositPage>

export const Default: Story = {}
export const ExceedsBalance: Story = { args: { value: '2,000.00', error: 'Exceeds balance' } }
export const Submitting: Story = { args: { value: '250.00', submitting: true } }
export const Deposited: Story = { args: { deposit: '250.00 USDC' } }
