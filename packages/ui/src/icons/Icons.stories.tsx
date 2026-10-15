import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../components/Icon'
import { paperBoard } from '../stories/paperBoard'
import { iconNames, isColorIcon, type IconName } from './iconNames'

// Mirrors the Paper "Icons" page: one board per kind. Mono icons follow the text colour
// (try the color control); color icons keep their own.
const names = Object.keys(iconNames) as IconName[]

type Args = { size: number; color: string }

const meta: Meta<Args> = {
  title: 'Icons',
  args: { size: 24, color: 'var(--color-foreground)' },
  argTypes: {
    size: { control: { type: 'range', min: 16, max: 64, step: 4 } },
    color: { control: 'color', description: 'Text colour of the context (mono icons only)' },
  },
}
export default meta

const Tiles = ({ names, size, color }: Args & { names: IconName[] }) => (
  <div className="flex flex-wrap gap-3 font-sans" style={{ color }}>
    {names.map((name) => (
      <figure
        key={name}
        className="flex w-24 flex-col items-center gap-2 rounded-md border border-border p-3"
      >
        <Icon name={name} width={size} height={size} />
        <figcaption className="text-xs text-muted-foreground">{name}</figcaption>
      </figure>
    ))}
  </div>
)

export const Mono: StoryObj<Args> = {
  tags: ['paper'],
  parameters: {
    paper: paperBoard({ board: 'Icons › Mono', label: 'Mono icons · follow the text colour', width: 560 }),
  },
  render: (args) => <Tiles {...args} names={names.filter((n) => !isColorIcon(n))} />,
}

export const Color: StoryObj<Args> = {
  tags: ['paper'],
  parameters: {
    paper: paperBoard({ board: 'Icons › Color', label: 'Color icons · fixed colours', width: 560 }),
  },
  render: (args) => <Tiles {...args} names={names.filter(isColorIcon)} />,
}
