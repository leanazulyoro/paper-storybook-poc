// SYNCED FROM PAPER: visuals from Jazzy nest › Components › DropdownMenu.
// Behaviour, listbox semantics, positioning and focus-ring structure live in DropdownMenu.tsx
// (Base UI Select). Paper state frames map to Base UI data attributes, not conditional classes.
export const dropdownMenuStyles = {
  trigger:
    'inline-flex h-10 w-max shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border bg-muted px-4 font-sans text-sm/tight font-semibold text-foreground not-data-disabled:hover:bg-border data-disabled:opacity-disabled', // DropdownMenu/Trigger(/Hover, /Disabled)
  content:
    'flex w-58 flex-col rounded-md border border-border bg-background p-1 data-[side=bottom]:mt-2 data-[side=top]:mb-2', // DropdownMenu/Content: 8px from the trigger (Content/End = align="end", a prop)
  option:
    'flex h-10 shrink-0 items-center justify-between gap-3 rounded-sm px-3 font-sans text-body text-foreground not-data-selected:data-highlighted:bg-muted data-selected:bg-primary/tint data-disabled:opacity-disabled', // DropdownMenu/Option(/Hover, /Selected, /Disabled)
  label: 'whitespace-nowrap', // Every option text layer: w-max
  indicator: 'inline-flex size-4 shrink-0', // Fixed trailing slot in every option
  check: 'text-primary', // Selected option SVG stroke
  chevron: 'shrink-0', // Trigger SVG
}
