import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextLink } from './components/TextLink'
import { paperBoard } from './stories/paperBoard'
import { textStyles } from './styles/typography'

// Mirrors the "Colors & Type" board in Paper (Tokens page).
const colors = [
  'background',
  'foreground',
  'muted',
  'muted-foreground',
  'border',
  'primary',
  'primary-foreground',
  'success',
  'warning',
  'danger',
  'focus',
]

const Section = ({ children }: { children: string }) => (
  <h2 className="text-xs/tight font-medium tracking-wide text-muted-foreground uppercase">{children}</h2>
)

const Tokens = () => (
  <div className="flex flex-col gap-8 p-8">
    <Section>Color</Section>
    <div className="flex flex-wrap gap-4">
      {colors.map((name) => (
        <div key={name} className="flex w-40 flex-col gap-2">
          <div
            className="h-16 rounded-md border border-border"
            style={{ background: `var(--color-${name})` }}
          />
          <span className="text-sm leading-tight font-medium">{name}</span>
        </div>
      ))}
    </div>
    <div className="flex flex-col gap-3">
      <Section>Type · Inter</Section>
      <span className="text-xl leading-display font-semibold tracking-tight">
        xl 28 · Earn on idle assets
      </span>
      <span className="text-lg leading-normal font-semibold">lg 20 · Deposit USDC</span>
      <span className="text-base leading-normal">base 16 · Your position updates every block.</span>
      <span className="text-sm leading-tight text-muted-foreground">sm 14 · Balance: 1,240.50 USDC</span>
      <span className="text-xs leading-tight text-muted-foreground">xs 12 · Rates are variable</span>
    </div>
  </div>
)

const meta: Meta<typeof Tokens> = {
  title: 'Tokens',
  component: Tokens,
  parameters: { layout: 'fullscreen' },
}
export default meta

export const ColorsAndType: StoryObj<typeof Tokens> = {
  tags: ['paper'],
  parameters: {
    paper: paperBoard({
      board: 'Tokens › Colors & Type',
      label: 'Design tokens · source of truth for @poc/ui',
      width: 960,
    }),
  },
}

// Mirrors the "Typography" board in Paper (Tokens page). Class names are literal so Tailwind
// generates them; the Record type fails typecheck if Paper adds a style this map lacks.
const typography: Record<(typeof textStyles)[number], { className: string; spec: string; sample: string }> = {
  h1: { className: 'text-h1', spec: 'h1 · 28/34', sample: 'Deposit' },
  h2: { className: 'text-h2', spec: 'h2 · 20/24', sample: 'Your positions' },
  h3: { className: 'text-h3', spec: 'h3 · 16/24', sample: 'USDC Vault' },
  body: {
    className: 'text-body',
    spec: 'body · 14/20',
    sample: 'Earn variable yield on idle USDC. Withdraw anytime.',
  },
  label: { className: 'text-label', spec: 'label · 14/20', sample: 'Amount' },
  small: { className: 'text-small', spec: 'small · 12/20', sample: 'Balance: 1,240.50 USDC' },
}

export const Typography: StoryObj<typeof Tokens> = {
  tags: ['paper'],
  parameters: { paper: paperBoard({ board: 'Tokens › Typography', label: 'Typography · text styles' }) },
  render: () => (
    <div className="flex flex-col gap-5 p-8 font-sans text-foreground">
      {textStyles.map((name) => (
        <div key={name} className="flex items-baseline gap-6">
          <span className="w-32 shrink-0 text-small text-muted-foreground">{typography[name].spec}</span>
          <span className={typography[name].className}>{typography[name].sample}</span>
        </div>
      ))}
      <div className="flex items-baseline gap-6">
        <span className="w-32 shrink-0 text-small text-muted-foreground">link · inherits size</span>
        <span className="text-body">
          By depositing you accept the <TextLink render={<a href="#terms" />}>vault terms</TextLink>
        </span>
      </div>
    </div>
  ),
}
