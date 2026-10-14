import type { Decorator } from '@storybook/react-vite'
import { cn } from '../cn'

// Where a story sits in the Paper file and how its board is presented. `code-to-paper` builds
// boards from it; `withPaperBoard` shows the same framing in Storybook, so both read alike.
// Declare the board once on `meta` (`parameters: { paper: paperBoard({...}) }`); a story adds only
// what's its own (`parameters: { paper: { frame: 'PageHeader/LongText' } }`, deep-merged).
// Only `paper`-tagged stories are board content; untagged ones just get the surface.
export type PaperBoard = {
  /** `Page › Board`, e.g. 'Blocks › PageHeader'. Its `paper` stories are its frames, in story order. */
  board: string
  /** Frame name when the story is one frame of the board (`PageHeader/LongText`). */
  frame?: string
  /** Uppercase title at the top of the board; defaults to the board name. */
  label?: string
  /** Note under the frames (which sample state is shown, why); `\n` breaks lines. */
  caption?: string
  /** Board background. */
  surface?: 'background' | 'muted'
  /** Board width in px; omitted: fits its content. */
  width?: number
  /** How the board's frames sit. */
  layout?: 'row' | 'wrap' | 'column'
  /** The story is the whole artboard (Pages): no label, caption or padding. */
  frameless?: boolean
}

export const paperBoard = (spec: PaperBoard) => spec

export const boardLabel = (spec: PaperBoard) => spec.label ?? spec.board.split(' › ').at(-1)

export const withPaperBoard: Decorator = (Story, { parameters, tags }) => {
  const spec = parameters.paper as PaperBoard | undefined
  if (!spec?.board || spec.frameless) return <Story />
  const content = tags.includes('paper')
  return (
    <div
      className={cn('flex flex-col gap-4 p-8', spec.surface === 'muted' ? 'bg-muted' : 'bg-background')}
      style={{ width: spec.width }}
    >
      {content && (
        <div className="text-xs/tight font-medium tracking-wide text-muted-foreground uppercase">
          {boardLabel(spec)}
          {spec.frame && ` · ${spec.frame.split('/').slice(1).join('/')}`}
        </div>
      )}
      <Story />
      {content && spec.caption && (
        <p className="text-xs/tight font-medium whitespace-pre-line text-muted-foreground">{spec.caption}</p>
      )}
    </div>
  )
}
