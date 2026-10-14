// Behaviour + semantics only; visuals come from Input.styles.ts (synced from Paper).
// Base UI Field wires label, description/error and aria-invalid; the error state is styled
// through `data-invalid`, so this file never picks classes by state.
import { Field } from '@base-ui/react/field'
import type { InputHTMLAttributes } from 'react'
import { cn } from '../cn'
import { focusRing } from '../focusRing'
import { inputStyles as s } from './Input.styles'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  /** Replaces the hint and switches to the error style. */
  error?: string
}

export const Input = ({ label, hint, error, className, ...props }: InputProps) => (
  <Field.Root invalid={!!error} className={cn(s.root, className)}>
    <Field.Label className={s.label}>{label}</Field.Label>
    <Field.Control className={cn(s.field, s.placeholder, focusRing)} {...props} />
    {error ? (
      <Field.Error match className={s.message}>
        {error}
      </Field.Error>
    ) : (
      hint && <Field.Description className={s.message}>{hint}</Field.Description>
    )}
  </Field.Root>
)
