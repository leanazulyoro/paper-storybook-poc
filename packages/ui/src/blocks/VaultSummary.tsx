// Source: Paper "Jazzy nest" › Pages › Deposit › VaultSummary.
// Presentational: all text and values arrive pre-translated / pre-formatted.
import type { ReactNode } from 'react'
import { Card, CardBody, CardHeader } from '../components/Card'
import { vaultSummaryStyles as s } from './VaultSummary.styles'

export type VaultSummaryProps = {
  title: ReactNode
  /** Header slot, e.g. <Badge tone="success">. */
  status?: ReactNode
  apyLabel: ReactNode
  apy: ReactNode
  stats: { label: ReactNode; value: ReactNode }[]
}

export const VaultSummary = ({ title, status, apyLabel, apy, stats }: VaultSummaryProps) => (
  <Card>
    <CardHeader title={title} action={status} />
    <CardBody>
      <span className={s.apyLabel}>{apyLabel}</span>
      <span className={s.apy}>{apy}</span>
      <dl className={s.stats}>
        {stats.map((stat, i) => (
          <div key={i} className={s.stat}>
            <dt className={s.statLabel}>{stat.label}</dt>
            <dd className={s.statValue}>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </CardBody>
  </Card>
)
