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

Paper desktop open. Run `node scripts/paper-config.mjs`: it prints the app's Paper files and
`source`, the file to push to (unless the user names another entry). `open_file` it by its `id`,
never by name. Then `get_guide("paper-mcp-instructions")` once.

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

## New component (not just a fix)

Bringing a whole component into Paper (e.g. one built in code, or from another Paper copy) works
the same way, with three additions:

- **Blueprint:** build the board from the component's styles file, or from an existing snapshot of
  it (`paper-snapshots/…`), one frame per variant/state, named after the styles keys and their
  `// Frame/Name` comments (`DropdownMenu/Trigger/Hover`, `DropdownMenu/Content/End`).
- **Copies:** in Blocks and Pages, reuse the new frames with `<x-paper-clone node-id="…" />` instead
  of redrawing them, so every copy starts identical.
- **Check:** the round trip (step 6) must map the new board to the code's current classes with no
  diff; add its snapshot to the `paper-to-code` step 0 table, and a `paper`-tagged story if the code
  has none.

## New design file (built from code)

When the target entry in `paper.config.json` has `"id": null`, the file doesn't exist yet:

1. `create_file` with the entry's resolved name (from `node scripts/paper-config.mjs`, e.g.
   "Paper POC - Design system"), then **immediately** write the returned id into that entry and
   commit it alone (`chore(paper): create <name>`), before drawing anything. Never create a file
   when the entry has an id: open it instead, so reruns never produce duplicates.
2. `open_file` it and build in order, checking each layer before the next: tokens
   (`create_tokens` from `theme.css`) → Icons → Components (per "New component" above) → Blocks →
   Pages, with the page names and boards listed in `paper-to-code` step 0 (`arrange_pages` sets
   their order).
   - **Code is the only source:** classes from `*.styles.ts`, structure from the `.tsx`, variants,
     sample copy and board contents from the `paper`-tagged stories. `paper-snapshots/` describe
     another file: don't read them.
   - **Boards come from `parameters.paper`** (type and fields: `src/stories/paperBoard.tsx`;
     Storybook shows only the surface, so label, caption, width and layout come from the spec
     alone). One board per `board` (`Page › Board`), built from its `paper` stories in story order:
     - a story with `frame` is that one frame;
     - a multi-variant story (`AllVariants`) contributes its base frames, named from the styles
       files' `// Frame/Name` comments;
     - a `States` story becomes a **States grid**: `Column/<state>` headers, one `Row/<name>` per
       row with a `Section/<name>` row label, `Cell` slots holding only the state frames (a cell
       equal to a base frame, e.g. Default, stays empty);
     - every `// Frame/Name` in the styles files gets a frame even when no story renders it
       (`Button/Primary/Active`: Storybook can't force `:active`): add its column to the grid;
     - a story that repeats a frame already drawn (DropdownMenu `Open` = "Open · align start") is
       drawn once;
     - name a clone after the state it shows (the empty form's submit is `Button/Disabled`).

     Draw what the story renders, its section headers and column labels included (layers
     `Section/<text>`, `Column/<text>`).

   - **Board look:** a vertical stack, padding 32px, gap 16px, height fit-content:
     1. `label` (default: the board name) as a text layer `Label`: uppercase, 12/20 medium,
        `tracking-wide`, muted-foreground;
     2. a `Frames` layer holding the frames per `layout`: `row` = side by side, top aligned, gap
        32px; `wrap` = wrapping row, gap 24px; `column` (default) = stacked, gap 24px;
     3. `caption` as a text layer `Caption`: 12/20 medium, muted-foreground, sentence case (no
        uppercase, no tracking), line breaks kept.

     Background `surface` (default background); `width` px or fit content. A `frameless` story is
     the artboard itself (Pages): no label, caption or padding.

   - **Placement:** a page's boards left to right in Storybook sidebar order, top aligned, 160px
     apart.
   - **Names:** frames `Component/Variant[/State]`; repeated rows `Row/<Label>` (`Stat/TVL`); a
     text with an inline link (terms) is a `Terms` row of `Text` and `Link` layers.
   - **Focus frames:** draw a `…/Focus` reference frame only where a `States` story has a Focus
     column.
   - **Text layers use `var(--font-sans)`** so the file looks like the app (Paper defaults to
     system-ui); mapping ignores the family (`paper-to-code`: font family is inherited).
   - **Typography:** Paper's MCP can't create text styles. Build the Typography board as one
     `Type/<style>` text layer per `typography.css` style with its exact values; text elsewhere
     carries raw values and maps back by exact match.
   - Skip the Paper guide's design brief: the code is the brief. `create_artboard` ignores
     `left`/`top`: position boards with `update_styles` afterwards.
   - **Paper quirks that leak into the export:** give every text layer an explicit colour (a text
     with none exports no colour class, and a colour set on the frame isn't exported for its
     texts); a text once set to `white-space: nowrap` keeps exporting `w-max` after it is reset, so
     rewrite the layer instead; draw sample widths in off-scale px (360px, not 400px, which
     exports as the token class `w-sm` and looks like a real class).
3. Switch `source` to the new entry only after its round trip passes: `paper-to-code` against it
   produces no code diff.

Focus rings are code-owned: never push focus classes; at most update `--color-focus` or the
reference `…/Focus` frames.
