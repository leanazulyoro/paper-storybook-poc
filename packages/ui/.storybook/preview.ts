import type { Preview } from '@storybook/react-vite'
import '../src/styles/index.css'
import { withPaperBoard } from '../src/stories/paperBoard'

const preview: Preview = {
  // `paper` stories get their Paper board's label, caption and surface (src/stories/paperBoard.tsx).
  decorators: [withPaperBoard],
  parameters: {
    layout: 'centered',
    // Same order as the Paper file's pages.
    options: { storySort: { order: ['Tokens', 'Icons', 'Components', 'Blocks', 'Pages'] } },
  },
}

export default preview
