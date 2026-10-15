import type { Decorator } from '@storybook/react-vite'

// Where a story sits in the Paper file and how its board is presented. `code-to-paper` builds
// boards from it; Storybook only applies the surface (`withPaperSurface`).
// Declare the board once on `meta` (`parameters: { paper: paperBoard({...}) }`); a story adds only
// what's its own (`parameters: { paper: { frame: 'PageHeader/LongText' } }`, deep-merged).
// Only `paper`-tagged stories are board content.
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

// Storybook shows only the board's surface (label, caption, width and layout are Paper-only).
export const withPaperSurface: Decorator = (Story, { parameters }) => {
  const spec = parameters.paper as PaperBoard | undefined
  if (spec?.surface !== 'muted' || spec.frameless) return <Story />
  return (
    <div className="bg-muted p-8">
      <Story />
    </div>
  )
}
