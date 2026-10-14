import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../components/Icon'
import { iconNames, isColorIcon, type IconName } from './iconNames'

// Mirrors the Paper "Icons" page: one board per kind. Mono icons follow the text colour
// (try the color control); color icons keep their own.
const names = Object.keys(iconNames) as IconName[]
const groups = [
  { title: 'Mono', names: names.filter((n) => !isColorIcon(n)) },
  { title: 'Color', names: names.filter(isColorIcon) },
]

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

export const All: StoryObj<Args> = {
  tags: ['paper'],
  parameters: { paper: 'Icons › Mono, Color' },
  render: ({ size, color }) => (
    <div className="flex flex-col gap-8 font-sans" style={{ color }}>
      {groups.map((group) => (
        <section key={group.title} className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground">{group.title}</h2>
          <div className="flex flex-wrap gap-3">
            {group.names.map((name) => (
              <figure
                key={name}
                className="flex w-24 flex-col items-center gap-2 rounded-md border border-border p-3"
              >
                <Icon name={name} width={size} height={size} />
                <figcaption className="text-xs text-muted-foreground">{name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
}
