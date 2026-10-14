// Behaviour + semantics only; visuals come from Button.styles.ts (synced from Paper).
// Code-only: <button> semantics, focus ring, disabled cursor, composition via `render`
// (Base UI's model, as in the webapp): <Button render={<Link href="/" />}>Label</Button>.
// useRender, not Base UI's Button: rendering a link must not add role="button".
import { useRender } from '@base-ui/react/use-render'
import { cn } from '../cn'
import { focusRing } from '../focusRing'
import { buttonStyles as s } from './Button.styles'

export type ButtonProps = useRender.ComponentProps<'button'> & {
  variant?: keyof typeof s.variant
}

export const Button = ({
  variant = 'primary',
  render,
  className,
  type = 'button',
  ref,
  ...props
}: ButtonProps) =>
  useRender({
    render,
    ref,
    defaultTagName: 'button',
    props: {
      // A rendered element (e.g. a link) keeps its own semantics: no button type on it.
      ...(render ? {} : { type }),
      className: cn(
        s.base,
        s.variant[variant],
        s.disabled,
        focusRing,
        'disabled:cursor-not-allowed',
        className,
      ),
      ...props,
    },
  })
