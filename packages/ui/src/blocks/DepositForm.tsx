// Source: Paper "Jazzy nest" › Screens › Deposit › DepositForm.
// Presentational + controlled: the app owns value, validation and submission.
import type { FormEvent, ReactNode } from 'react'
import { Button } from '../components/Button'
import { Card, CardBody, CardFooter, CardHeader } from '../components/Card'
import { Input } from '../components/Input'
import { depositFormStyles as s } from './DepositForm.styles'

export type DepositFormProps = {
  title: ReactNode
  /** Header slot, e.g. a controlled DropdownMenu network selector. */
  network?: ReactNode
  amountLabel: string
  amountPlaceholder?: string
  /** Pre-formatted, e.g. "Balance: 1,240.50 USDC". */
  balanceHint?: string
  error?: string
  value: string
  onValueChange: (value: string) => void
  /** Rich text slot; the app passes translated text with its own link (e.g. next/link inside <TextLink>). */
  terms?: ReactNode
  submitLabel: ReactNode
  submitting?: boolean
  onSubmit: () => void
}

export const DepositForm = ({
  title,
  network,
  amountLabel,
  amountPlaceholder,
  balanceHint,
  error,
  value,
  onValueChange,
  terms,
  submitLabel,
  submitting,
  onSubmit,
}: DepositFormProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate>
        <CardHeader title={title} action={network} />
        <CardBody className={s.body}>
          <Input
            label={amountLabel}
            placeholder={amountPlaceholder}
            hint={balanceHint}
            error={error}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            inputMode="decimal"
            autoComplete="off"
          />
          {terms && <p className={s.terms}>{terms}</p>}
        </CardBody>
        <CardFooter>
          <Button type="submit" className={s.submit} disabled={submitting || !!error || !value}>
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
