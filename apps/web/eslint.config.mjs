import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

const VISUAL =
  '(text|bg|font|border|rounded|shadow|leading|tracking|opacity|underline|outline|ring|fill|stroke)'

// Policy: pages ship only with @poc/ui components.
const uiOnly = [
  'error',
  // Layout only: <div>/<main> are allowed for layout; everything else comes from @poc/ui.
  {
    selector: 'JSXOpeningElement[name.name=/^(?!html$|body$|div$|main$)[a-z]/]',
    message: 'Use @poc/ui components instead of raw HTML elements (div/main allowed for layout).',
  },
  {
    selector: `JSXAttribute[name.name="className"] > Literal[value=/(^|\\s)([a-z0-9]+:)*${VISUAL}(-|\\s|$)/]`,
    message: 'Layout classes only in app code; visual styling belongs in an @poc/ui component.',
  },
  {
    selector: 'JSXAttribute[name.name="style"]',
    message: 'No inline styles in app code; add a variant to @poc/ui instead.',
  },
  // i18n: no hardcoded copy in app/; strings come from messages/.
  {
    selector: 'JSXText[value=/\\S/]',
    message: 'No hardcoded text: add it to messages/ and read it from there.',
  },
  {
    selector: 'JSXExpressionContainer > Literal[value=/\\S/]',
    message: 'No hardcoded text: add it to messages/ and read it from there.',
  },
  // Links: next/link must be styled by a ui component, passed as its `render` prop.
  {
    selector:
      'JSXElement[openingElement.name.name="Link"]:not(JSXOpeningElement[name.name=/^(TextLink|Button)$/] > JSXAttribute[name.name="render"] > JSXExpressionContainer > JSXElement)',
    message: 'Pass <Link> as the render prop of <TextLink> or <Button> so it gets design-system styling.',
  },
]

const config = [
  { ignores: ['.next/**', 'next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  { files: ['app/**/*.tsx'], rules: { 'no-restricted-syntax': uiOnly } },
]

export default config
