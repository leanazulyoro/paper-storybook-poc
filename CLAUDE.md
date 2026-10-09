# paper-storybook-poc

Design-to-code trial: Paper (design tool, via MCP) → React components + Storybook → Next app.
See `README.md` (phases, success bar) and `FINDINGS.md` (every decision and why).

## Layout

- `packages/ui`: components, blocks, icons, tokens, Storybook (:6006). `apps/web`: Next app (:3100).
- Node 22 (`.nvmrc`), pnpm. `pnpm lint`, `pnpm typecheck`, `pnpm test` (stories + play tests,
  headless Chromium), `pnpm storybook`, `pnpm dev`.

## Who owns what

- **Paper owns looks**: `styles/theme.css` (tokens) and `styles/typography.{css,ts}` (text styles
  `text-h1`…`text-small`), both generated, never hand-edited; `*.styles.ts`
  (visual classes keyed by Paper layer names), icon geometry. Changed only by a Paper sync
  (`/paper-to-code`), in `sync(paper):` commits that touch nothing else (CI enforces).
- **Code owns behaviour**: `.tsx` files (markup, hooks, a11y, states), the focus ring
  (`focusRing.ts`; Paper owns only `--color-focus`).
- A visual fix made in code must be pushed to Paper (`/code-to-paper`) or the next sync reverts it.
- New visual designs created through MCP require the user's review of the completed appearance
  before local implementation, sync, or design-export snapshots. Follow
  [paper-design-review](.claude/skills/paper-design-review/SKILL.md); agent screenshot checks
  do not count as user approval.

## Rules (lint-enforced; read the message when it fires)

- `apps/web` pages use only `@poc/ui` components; layout-only classes; no text literals.
- `ui`: no hardcoded text (i18n: copy arrives via props), no `<a>` (links via slots/`asChild`),
  no Next imports, no visual classes in `.tsx`, no inline `<svg>` outside `src/icons`.
- Icons: one `<Icon name>`; mono icons paint only `currentColor`, color icons use tokens or
  brand hex and `useId()` for defs ids; no colour props.

## Storybook

Sections mirror the Paper pages: Tokens, Icons, Components, Blocks, Pages. `States` stories show
interaction states side by side (pseudo-states addon) for 1:1 comparison with Paper's state frames.
