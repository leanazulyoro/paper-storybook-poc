// SYNCED FROM PAPER: visuals from Jazzy nest › Components › Tabs.
// Behaviour, tablist semantics and focus-ring structure live in Tabs.tsx (Base UI Tabs).
// Paper state frames map to Base UI data attributes (Tab: data-active, data-disabled).
export const tabsStyles = {
  list: 'inline-flex items-center gap-1 rounded-md border border-border bg-muted p-1', // Tabs/List (hugs its tabs: Paper has no inline layout)
  tab: 'flex h-8 items-center justify-center whitespace-nowrap rounded-sm border border-muted px-3 text-label text-muted-foreground not-data-disabled:hover:text-foreground data-active:border-border data-active:bg-background data-active:text-foreground data-disabled:opacity-disabled', // Tab(/Hover, /Selected, /Disabled)
}
