// Source: Paper "Jazzy nest" › Pages › Deposit (artboard: muted ground, 64px vertical padding, 824px column).
import type { ReactNode } from 'react'
import { pageStyles as s } from './Page.styles'

export type PageProps = { children: ReactNode }

export const Page = ({ children }: PageProps) => (
  <main className={s.root}>
    <div className={s.column}>{children}</div>
  </main>
)
