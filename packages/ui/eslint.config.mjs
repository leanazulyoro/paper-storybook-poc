import tseslint from 'typescript-eslint'

// Classes the .tsx may own: behaviour/a11y, never Paper visuals. Focus ring comes only from
// src/focusRing.ts, so no literal focus-visible: here.
const CODE_OWNED = '/^((disabled:cursor-|cursor-|sr-only)\\S*\\s*)+$/'
const FOCUS = '/focus(-visible|-within)?:/'

// ui policy (stories and story-only helpers in src/stories exempt: they supply sample copy and
// plain <a> links).
const policy = [
  'error',
  // i18n: no user-facing text inside ui. All copy arrives via props/children.
  {
    selector: 'JSXText[value=/\\S/]',
    message: 'No hardcoded text in ui: take it as a prop so the app can translate it.',
  },
  {
    selector: 'JSXExpressionContainer > Literal[value=/\\S/]',
    message: 'No hardcoded text in ui: take it as a prop so the app can translate it.',
  },
  {
    selector:
      'JSXAttribute[name.name=/^(label|placeholder|title|hint|error|alt|aria-label|aria-description)$/] > Literal',
    message: 'No hardcoded text in ui: take it as a prop so the app can translate it.',
  },
  // Round-trip: visual classes live only in *.styles.ts (synced from Paper). Class strings in
  // .tsx may only hold code-owned concerns (cursor, screen-reader utilities).
  {
    selector: `:matches(JSXAttribute[name.name="className"], CallExpression[callee.name="cn"]) Literal[value!=${CODE_OWNED}]:not([value=${FOCUS}])`,
    message: 'Visual classes belong in the component .styles.ts (synced from Paper), not in the .tsx.',
  },
  {
    selector: `:matches(JSXAttribute[name.name="className"], CallExpression[callee.name="cn"]) Literal[value=${FOCUS}]`,
    message: 'Use focusRing (src/focusRing.ts): one ring for every component, look set by Paper tokens.',
  },
  // Links: ui never renders <a>; the app passes its own link via a slot or asChild.
  {
    selector: 'JSXOpeningElement[name.name="a"]',
    message: 'No <a> in ui: accept a link via a ReactNode slot, <TextLink>, or <Button asChild>.',
  },
]

// Icons: SVGs live only in src/icons, as one file per icon (mono/ or color/).
const noSvgOutsideIcons = {
  selector: 'JSXOpeningElement[name.name="svg"]',
  message: 'No inline <svg> in ui: add an icon to src/icons and render it with <Icon name>.',
}
const PAINT = 'JSXAttribute[name.name=/^(fill|stroke|stopColor|floodColor|lightingColor|color)$/]'
const DEFS =
  'JSXOpeningElement[name.name=/^(defs|linearGradient|radialGradient|clipPath|mask|filter|pattern)$/]'
const iconCommon = [
  {
    selector: 'JSXOpeningElement[name.name="svg"] > JSXAttribute[name.name=/^(width|height)$/]',
    message: 'No size on the icon <svg>: size comes from iconDefaults / the caller.',
  },
  { selector: 'JSXAttribute[name.name="style"]', message: 'No inline style in icons.' },
]
// Mono: colour comes only from the text (currentColor); no defs, so no ids to collide.
const monoIconPolicy = [
  ...iconCommon,
  {
    selector: `${PAINT} Literal[value!=/^(currentColor|none)$/]`,
    message: 'Mono icons paint only with currentColor (or none): colour comes from the text.',
  },
  { selector: `${PAINT} TemplateLiteral`, message: 'Mono icons paint only with currentColor (or none).' },
  { selector: DEFS, message: 'Mono icons have no defs (gradients, masks, filters): make it a color icon.' },
]
// Color: fixed colours, each a theme token or a brand hex; defs ids come from useId.
const colorIconPolicy = [
  ...iconCommon,
  {
    selector: `${PAINT} Literal[value!=/^(currentColor|none|#[0-9a-fA-F]{3,8}|var\\(--color-[\\w-]+\\))$/]`,
    message:
      'Color icons paint with a var(--color-*) token, a brand #hex, currentColor or none (url() via useId).',
  },
  {
    selector: 'JSXAttribute[name.name="id"] > Literal',
    message: 'No hardcoded id in icons: derive it from useId() so instances never collide.',
  },
]

const policyWith = (...extra) => [...policy, ...extra]

const config = tseslint.config(
  { ignores: ['storybook-static/**'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.stories.tsx', 'src/stories/**'],
    languageOptions: { parser: tseslint.parser },
    rules: {
      'no-restricted-syntax': policyWith(noSvgOutsideIcons),
      // ui stays framework-agnostic: no Next.js (or other app framework) imports.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['next', 'next/*'], message: 'ui must not depend on Next.js.' },
            {
              group: ['@radix-ui/*', 'radix-ui'],
              message: 'Base UI is the headless foundation (as in the webapp): use @base-ui/react.',
            },
          ],
        },
      ],
    },
  },
  { files: ['src/icons/mono/**/*.tsx'], rules: { 'no-restricted-syntax': policyWith(...monoIconPolicy) } },
  { files: ['src/icons/color/**/*.tsx'], rules: { 'no-restricted-syntax': policyWith(...colorIconPolicy) } },
  // Focus ring is code-owned (src/focusRing.ts); a Paper sync must never emit focus styles.
  {
    files: ['src/**/*.styles.ts'],
    languageOptions: { parser: tseslint.parser },
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/focus-visible:|focus:|focus-within:/]',
          message:
            'Focus styles are code-owned: use focusRing (src/focusRing.ts), Paper owns only the focus tokens.',
        },
      ],
    },
  },
)

export default config
