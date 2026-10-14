// ui never renders <a> itself: the app passes its own link as `render` (e.g. next/link) and the
// translated label as children: <TextLink render={<Link href="/terms" />}>{label}</TextLink>.
// Visuals come from TextLink.styles.ts (synced from Paper); focus ring from ../focusRing.
import { useRender } from '@base-ui/react/use-render'
import { cn } from '../cn'
import { focusRing } from '../focusRing'
import { textLinkStyles as s } from './TextLink.styles'

export type TextLinkProps = Omit<useRender.ComponentProps<'a'>, 'render'> & {
  render: useRender.RenderProp
}

export const TextLink = ({ render, className, ref, ...props }: TextLinkProps) =>
  useRender({ render, ref, props: { className: cn(s.base, focusRing, className), ...props } })
