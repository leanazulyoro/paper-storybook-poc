'use client'

import { Badge, DepositForm, DropdownMenu, Page, PageHeader, TextLink, VaultSummary } from '@poc/ui'
import Link from 'next/link'
import { useState } from 'react'
import { en } from '../messages/en'

const m = en.deposit
const BALANCE = 1240.5
const usdc = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const parseAmount = (value: string) => Number(value.replace(/,/g, ''))

const validate = (value: string) => {
  if (!value) return undefined
  const amount = parseAmount(value)
  if (!Number.isFinite(amount) || amount <= 0) return m.invalidAmount
  if (amount > BALANCE) return m.exceedsBalance
  return undefined
}

export const DepositScreen = () => {
  const [value, setValue] = useState('')
  const [deposited, setDeposited] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [network, setNetwork] = useState(m.networks[0].value)
  const error = validate(value)

  const handleSubmit = () => {
    if (error || !value) return
    setSubmitting(true)
    // Stand-in for the on-chain transaction.
    setTimeout(() => {
      setDeposited((d) => d + parseAmount(value))
      setValue('')
      setSubmitting(false)
    }, 1500)
  }

  return (
    <Page>
      <PageHeader title={m.pageTitle} description={m.pageDescription} />
      <div className="flex flex-col items-start gap-6 md:flex-row">
        <VaultSummary
          title={m.vaultTitle}
          status={<Badge tone="success">{m.statusActive}</Badge>}
          apyLabel={m.apyLabel}
          apy="5.42%"
          stats={[
            { label: m.totalDeposits, value: '$48.2M' },
            { label: m.yourDeposit, value: `${usdc.format(deposited)} USDC` },
          ]}
        />
        <DepositForm
          title={m.formTitle}
          network={
            <DropdownMenu
              label={m.networkLabel}
              options={m.networks}
              value={network}
              onValueChange={setNetwork}
              disabled={submitting}
              align="end"
            />
          }
          amountLabel={m.amountLabel}
          amountPlaceholder={m.amountPlaceholder}
          balanceHint={m.balanceHint(usdc.format(BALANCE - deposited))}
          error={error}
          value={value}
          onValueChange={setValue}
          terms={m.terms((text) => (
            <TextLink>
              <Link href="/terms">{text}</Link>
            </TextLink>
          ))}
          submitLabel={submitting ? m.submitting : m.submit}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      </div>
    </Page>
  )
}
