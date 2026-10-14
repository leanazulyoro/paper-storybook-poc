// Source: Paper "Jazzy nest" › Pages › Deposit › "Page header".
import type { ReactNode } from 'react'
import { pageHeaderStyles as s } from './PageHeader.styles'

export type PageHeaderProps = { title: ReactNode; description?: ReactNode }

export const PageHeader = ({ title, description }: PageHeaderProps) => (
  <header className={s.root}>
    <h1 className={s.title}>{title}</h1>
    {description && <p className={s.description}>{description}</p>}
  </header>
)
