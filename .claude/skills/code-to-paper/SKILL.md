---
name: code-to-paper
description: Push a visual change made in code (a bug fix in *.styles.ts or theme.css, a new state) back into the Paper file, so the next Paper → code sync doesn't revert it. Use after a developer changes how something looks in code.
---

# Code → Paper push

Paper is the source the next `paper-to-code` sync reads. A visual fix made only in code gets
overwritten by that sync, so every code-side visual change must land in Paper too.

Paper has **no component instances**: every copy of a component (Components, Blocks, Pages)
is a separate node and must be updated.

## Before starting

Paper desktop open on the POC file ("Jazzy nest", or your copy of it); `get_guide("paper-mcp-instructions")` once.

If this push also creates a new visual design, follow
[paper-design-review](../paper-design-review/SKILL.md) before subsequent local implementation,
Paper → code sync, or snapshot refresh. Mirroring an existing code design alone does not add
this checkpoint; honor any explicit user review requirement on the current edits.

## Steps

1. **List the change** as CSS: e.g. `h-10` → `h-11` on Input's `Field` = `height: 44px`.
   Tokens: use the token (`var(--color-x)`, `var(--radius-md)`), never the raw value.
2. **Token change** → `set_tokens` (or `create_tokens`). Every node using the token updates; done.
3. **Style change on a layer** → find every copy with `find_nodes`, filtering on a style
   signature specific enough to exclude other components (e.g. `height: 40px` **and**
   `background-color: --color-background` matches Input fields but not Buttons). Check the
   result's layer names, then one `update_styles` call on all ids.
4. **New state** (e.g. hover) → on the Components board, `duplicate_nodes` the base frame,
   `rename_nodes` to `Component/Variant/State` (`Button/Primary/Hover`), `update_styles` with only
   the difference. Tailwind opacity modifiers map to `color-mix(var(--color-x) 90%, transparent)`.
   Placeholder visuals (no design yet): say so to the user.
5. **Review**: `get_screenshot` each touched board/page. Extra frames can squeeze a row: give the
   board's row `flexWrap: "wrap"` rather than letting labels wrap. Then `finish_working_on_nodes`.
6. **Round-trip check**: `get_jsx` the changed component and confirm it maps back to exactly the
   code's classes (per the `paper-to-code` rules). If it wouldn't, the next sync reverts the fix.
7. **Refresh snapshots** of every source board you touched (`paper-snapshots/`, see
   `paper-to-code` step 0): overwrite with the new `get_jsx` output, so the next sync's diff shows
   only the designer's changes, not yours. Commit them with a non-sync message (`chore(paper): …`).

Focus rings are code-owned: never push focus classes; at most update `--color-focus` or the
reference `…/Focus` frames.
