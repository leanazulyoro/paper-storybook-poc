import type { Preview } from '@storybook/react-vite'
import '../src/styles/index.css'
import { withPaperSurface } from '../src/stories/paperBoard'

const preview: Preview = {
  // Muted Paper boards (Card, blocks) get the same background here (src/stories/paperBoard.tsx).
  decorators: [withPaperSurface],
  parameters: {
    layout: 'centered',
    // Same order as the Paper file's pages.
    options: { storySort: { order: ['Tokens', 'Icons', 'Components', 'Blocks', 'Pages'] } },
  },
}

export default preview
