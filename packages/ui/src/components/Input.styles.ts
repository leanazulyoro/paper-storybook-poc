// SYNCED FROM PAPER: only visual classes, keyed by Paper layer/variant names.
// A Paper sync may rewrite this file; behaviour lives in the .tsx and is never touched.
// Source: Paper "Jazzy nest" › Components › Input (Input/Default; Input/Error → data-invalid:).
export const inputStyles = {
  root: 'flex flex-col gap-2',
  label: 'text-label text-foreground', // Label
  field:
    'h-11 rounded-md border border-border bg-background px-3 text-body text-foreground data-invalid:border-danger', // Field
  placeholder: 'placeholder:text-muted-foreground', // Placeholder
  message: 'text-small text-muted-foreground data-invalid:text-danger', // Hint
}
