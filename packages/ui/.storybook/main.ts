import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'

// pnpm doesn't hoist: Storybook resolves presets from its own store dir, so hand it absolute
// paths (Storybook's documented pnpm setup). Without this the vitest runner can't find them.
const require = createRequire(import.meta.url)
const getAbsolutePath = (pkg: string) => dirname(require.resolve(join(pkg, 'package.json')))

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: { name: getAbsolutePath('@storybook/react-vite'), options: {} },
  // Forces :hover / :focus-visible via parameters.pseudo, for the States comparison stories.
  addons: [getAbsolutePath('storybook-addon-pseudo-states'), getAbsolutePath('@storybook/addon-vitest')],
  // Resolves derived prop types (e.g. `keyof typeof s.variant`) to literal unions, so controls
  // get their options. Default react-docgen can't follow the styles import.
  typescript: { reactDocgen: 'react-docgen-typescript' },
  viteFinal: (config) => {
    config.plugins = [...(config.plugins ?? []), tailwindcss()]
    // Pre-bundle every Base UI part up front. Otherwise the first story run after a component
    // starts using a new part (e.g. tabs) re-optimizes mid-run and fails its stories once.
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [...(config.optimizeDeps?.include ?? []), '@base-ui/react/*'],
    }
    return config
  },
}

export default config
