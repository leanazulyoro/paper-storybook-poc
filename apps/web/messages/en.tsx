// Stand-in for an i18n library: every user-facing string lives here, never in app/.
import type { ReactNode } from 'react'

export const en = {
  deposit: {
    pageTitle: 'Deposit',
    pageDescription: 'Earn variable yield on idle USDC. Withdraw anytime.',
    vaultTitle: 'USDC Vault',
    statusActive: 'Active',
    apyLabel: 'Current APY',
    totalDeposits: 'Total deposits',
    yourDeposit: 'Your deposit',
    formTitle: 'Deposit USDC',
    networkLabel: 'Demo network',
    networks: [
      { value: 'ethereum', label: 'Ethereum' },
      { value: 'arbitrum', label: 'Arbitrum' },
      { value: 'base', label: 'Base' },
      { value: 'polygon', label: 'Polygon', disabled: true },
    ],
    amountLabel: 'Amount',
    amountPlaceholder: '0.00',
    balanceHint: (balance: string) => `Balance: ${balance} USDC`,
    exceedsBalance: 'Exceeds balance',
    invalidAmount: 'Enter a valid amount',
    // Rich text: the link sits mid-sentence, so the whole sentence is one message.
    terms: (link: (text: string) => ReactNode) => <>By depositing you accept the {link('vault terms')}</>,
    submit: 'Deposit',
    submitting: 'Depositing…',
  },
  terms: {
    title: 'Vault terms',
    body: 'Deposits earn a variable rate. Past yield does not guarantee future returns.',
    back: 'Back to deposit',
  },
}
