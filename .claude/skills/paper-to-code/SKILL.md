---
name: paper-to-code
description: Sync design changes from the Paper file into code (tokens, component styles, icons). Use when the designer changed Paper and the code must follow. Writes only Paper-owned files; behaviour is never touched.
---

# Paper → code sync

Paper owns how things look; code owns how they behave. A sync may write only:

- `packages/ui/src/styles/theme.css` (tokens), `styles/typography.css` + `styles/typography.ts` (text styles)
- `packages/ui/src/**/*.styles.ts` (visual classes, keyed by Paper layer/variant names)
- `packages/ui/src/icons/{mono,color}/Icon*.tsx`, `icons/index.ts`, `icons/iconNames.ts` (icon geometry + registry)
- `paper-snapshots/**/*.txt` (raw Paper exports, for change detection)

CI fails any `sync(paper):` commit that touches anything else (`scripts/check-sync-commits.mjs`).
If the design needs something outside these files (a new prop, a new element, behaviour), stop
and report it: that's a code change for a human-reviewed commit, not a sync.

## Before starting

- Paper desktop open. Run `node scripts/paper-config.mjs`: it prints the app's Paper files and
  `source`, the file to read. `open_file` that file by its `id` (never by name: names repeat and
  change). Then `get_guide("paper-mcp-instructions")` once.
- Clean working tree. Read `FINDINGS.md` if a rule below is unclear: it explains why.
- For new visual designs created through MCP, follow
  [paper-design-review](../paper-design-review/SKILL.md) and verify the user's approval of the
  completed appearance before step 0 or any implementation. If review is pending, present the
  designs and stop before writing product code or snapshots. Approval covers the reviewed scope.

## 0. What changed in Paper (snapshots)

Paper has no change feed and its export has no layer names, so changes are found by diffing.
Source boards and their snapshot files:

| Page › board                                                      | Snapshot                                   |
| ----------------------------------------------------------------- | ------------------------------------------ |
| Tokens › Colors & Type                                            | `paper-snapshots/Tokens/ColorsAndType.txt` |
| Tokens › Typography                                               | `paper-snapshots/Tokens/Typography.txt`    |
| Components › Button, Input, Badge, Card, CopyButton, DropdownMenu | `paper-snapshots/Components/<Board>.txt`   |
| Blocks › DepositForm, VaultSummary, PageHeader                    | `paper-snapshots/Blocks/<Board>.txt`       |
| Icons › Mono, Color                                               | `paper-snapshots/Icons/<Board>.txt`        |
| Pages › Deposit (artboard → `Page.styles.ts`)                     | `paper-snapshots/Pages/Deposit.txt`        |

1. `get_basic_info` per page for board ids (pages can gain boards: add them to the table).
2. `get_jsx` every source board and overwrite its snapshot with the output **verbatim** (the JSX
   between the parentheses, nothing else).
3. `git diff paper-snapshots`: only the boards that changed need mapping. For a changed board,
   `get_tree_summary` gives the layer names (`Component/Variant`, `Stat/TVL`…) the export lacks.
4. A missing snapshot (first sync, new board): compare the whole board against its styles file
   once, then the snapshot is the baseline.

Caveat: a token change can change how Paper exports unrelated boards (e.g. after `--color-focus`
aliased `--color-primary`, `bg-primary` started exporting as `[background-color:var(--color-primary)]`).
A snapshot diff with no visual change maps to no code change: that's fine, commit the snapshot.

## 0b. Hardcoded values (every sync, whole file)

Tokens are the only way a look reaches code: a raw value never enters code. The snapshot diff
only covers source boards, so scan the whole file every sync, changed or not:

- `find_nodes({ filters: [{ styleName: "*olor*", styleValue: "#*" }] })` (no page/node: every
  page). Every hit is a colour not bound to a token: `#000000` on text included (a layer with
  no colour renders black in Paper, so the design is wrong there too, not just the export).
- Tokens › Colors & Type: every `--color-*` token (from `get_tokens`) has a `Swatch/<name>`
  frame, and the `Rectangle` inside it fills with `var(--color-<name>)`. A raw fill means the
  designer edited the swatch, not the token, so nothing will sync; a missing swatch means a token
  nobody can see. Report both.
- In the boards you map, arbitrary **colours** (`bg-[#…]`, `text-[#…]`) are the same problem.
  Sizes are different: Paper often exports pixels (`h-[44px]`), so map them to the 4px spacing
  scale (`h-11`) and report only values off the scale (e.g. `gap-[18px]`). Board-only styles
  (step 2) are exempt.
- Only exception: brand hex inside Icons › Color SVGs (lint allows it; `find_nodes` doesn't
  look inside SVG paint anyway).

The file is clean as of the snapshot baseline: any hit is a real problem, not noise.

Never emit a raw value. For a changed frame, keep the existing token class and leave that part of
the change unsynced; sync the rest as usual. List every hit in the final report as a designer
to-do, grouped by page › board › layer, with the fix: bind the layer to an existing token, or
add/change the token in Paper's token panel (then re-sync). Lead the report with them.

## 1. Tokens

Save `get_tokens({ format: "tailwind" })` output to a scratch file, then
`node scripts/write-tokens.mjs <file> <contentHash.tokens> [<config key>]`. It writes `theme.css`
(header naming the file read, hash, lowercase hex); pass the `paper.config.json` key when the file
read isn't `source` (e.g. a round-trip check of a new file). Never hand-edit tokens in code.

## 1b. Typography (text styles)

**Tokens** page, **Typography** board: one text layer per style, named `Type/<Style>`
(`Type/H1`, `Type/Body`…). `get_jsx` the board, then for each `Type/*` except `Type/Link`:

- In `typography.css`, a Tailwind composite font-size token referencing the atomic tokens:
  `--text-<style>: var(--text-xl)`, `--text-<style>--line-height`, `--text-<style>--font-weight`,
  and `--text-<style>--letter-spacing` only when the layer has tracking. Lowercase style name.
- In `typography.ts`, the same names in `textStyles` (`cn()` needs them to merge correctly).
- Colour is never part of a text style; ignore the sample's colour.
- `Type/Link` has no size (it inherits): its weight/colour/underline go to `TextLink.styles.ts`.

## 2. Components and blocks

Source of truth: the **Components** page (blocks: the **Blocks** page). Copies on other pages are
never a source. `get_jsx` each board, then per frame `Component/Variant[/State]` update the matching
keys in `<Component>.styles.ts` (the `// Frame/Name` comments say which frame feeds which key).

Mapping rules:

- Base frame = default variant. A **state frame** contributes only its difference from its base
  frame, emitted with the variant for that state. Which variant depends on what renders it:

  | Paper frame        | Native element (Button) | Base UI part (DropdownMenu, Input, …)                                                                                          |
  | ------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
  | `…/Hover`          | `not-disabled:hover:`   | `not-data-disabled:hover:` (trigger); `not-data-selected:data-highlighted:` (item: hover and keyboard highlight are one state) |
  | `…/Active`         | `not-disabled:active:`  | `not-data-disabled:active:`                                                                                                    |
  | `…/Disabled`       | `disabled:`             | `data-disabled:`                                                                                                               |
  | `…/Selected`       | n/a                     | `data-selected:`                                                                                                               |
  | `…/Open` (trigger) | n/a                     | `data-popup-open:`                                                                                                             |
  | `…/Error`          | n/a                     | `data-invalid:` (every Field part: control, description, error)                                                                |

  A disabled control never reacts (hence the `not-…disabled` guards). Never emit conditional
  classes for states: the `.tsx` doesn't pick classes by state, Base UI's attributes do.
  A **code-owned state** with no Base UI attribute (e.g. `CopyButton/Copied`) maps to
  `data-<state>:` (`data-copied:`); the `.tsx` sets the attribute. A new one needs that one-line
  `.tsx` change first (code commit before the sync). Lint rejects classes picked by state in `.tsx`.

- **Child state:** if a state frame's difference is on a _child_ layer (e.g. `Trigger/Open` rotates
  the chevron), put `group` on the component root key and the variant on the child key:
  `group-data-popup-open:rotate-180` (`group-hover:` for native elements).
- **Popup positioning is drawn, not styled.** A `…/Anchor` frame and an absolutely positioned
  `…/Content` only show where the popup sits; code positions it (Base UI `Positioner`). Map
  `left-0`/`right-0` to the `align` prop (`…/Content/End` = `align="end"`, not a class) and the
  distance from the trigger to `data-[side=bottom]:mt-*` (plus the mirrored `data-[side=top]:mb-*`)
  on the popup. Never emit `absolute`, `top-*`, `left-*` or `right-*` for a popup.
- Paper exports rotation as an inline CSS property (`rotate: '180deg'`): map it to `rotate-180`
  (Tailwind v4 sets the same property).
- **`…/Focus` frames are reference only: skip them.** The focus ring is code-owned (`focusRing.ts`);
  Paper owns only `--color-focus`. Lint rejects focus classes in `*.styles.ts`.
- Text layer of a single-label component (Button, Badge): its text classes go on the root
  (the label is `children`). Text layer `w-max` (Paper's "no wrap") → `whitespace-nowrap`.
- SVG `stroke`/`fill="var(--color-x)"` inside a component → icon `text-x` (icons paint `currentColor`).
- Ignore board-only styles: artboard padding/background/`overflow-clip`/fixed width, board
  `flex-wrap`, `wrap-anywhere`, `antialiased`, sample frame sizes (`w-[232px]`, a board column's
  `shrink-0`), sample copy (all text comes from props in code), and the board's `Label`,
  `Caption`, `Section/*` and `Column/*` layers. Those texts live in the stories
  (`parameters.paper`, `src/stories/paperBoard.tsx`): if the designer changed one, report it as a
  story to-do, never sync it.
- `border-solid` is the default border style: drop it, including per side
  (`border-b border-b-solid border-b-border` → `border-b border-border`).
- `rounded-[calc(infinity*1px)]` is Paper's `9999px` radius: → `rounded-full`.
- **Font family is inherited:** never emit `font-sans`, `font-[system-ui,…]` or
  `[font-family:var(--font-sans)]`. The body sets `font-sans` (`styles/index.css`) and Tailwind's
  preflight makes controls inherit it. Emit a family only when it isn't `--font-sans` (e.g. a mono
  token).
- **Equivalent is not different.** Paper can't express some CSS, so a few exports differ from code
  without differing in look. Keep the code's form:
  - `flex` stays `inline-flex` on any key where the code has it (Button, Badge, CopyButton,
    DropdownMenu trigger and indicator: Paper has no inline layout);
  - `grow` → `flex-1`;
  - Input: Paper wraps the placeholder in a flex box (`flex items-center shrink-0` on `Field`);
    a native `<input>` centres its own text, so drop those. The `Placeholder` layer's colour →
    the `placeholder:` key; a `Value` layer's colour is the field's text colour;
  - a text colour equal to its parent's is inherited: keep whatever the key has, don't add or drop
    it;
  - a text style on every text child (VaultSummary's `Stat` row: label and value both `text-body`)
    is the parent's when the code puts it on the parent key: keep it there;
  - a `Terms` row (text + link layers): the row's own layout (`flex flex-wrap gap-x-1`) is a
    drawing artefact; map only its text layers;
  - the page artboard's fixed height (`h-[900px]`) → `min-h-screen`.
- A colour not bound to a token (`text-black`, raw hex) has no code equivalent (`reset.css` drops
  Tailwind's defaults): keep the existing token class and report it (step 0b).
- A text layer whose size, line-height, weight and tracking **all** match a text style →
  `text-<style>` (plus its colour class); anything else keeps atomic classes (`text-sm/tight
font-semibold`). Exact match only: never round to the nearest style.
- Prefer tokens over arbitrary values (`h-[44px]` → `h-11`, `opacity-[40%]` → `opacity-disabled`).
  Same for Paper's explicit forms: `[background-color:var(--color-x)]` → `bg-x`,
  `bg-(--color-x)/90` → `bg-x/90`, `[color:var(--color-x)]` → `text-x`,
  `[text-decoration:underline_1px]` → `underline`.
- Right-aligned text exports as `text-right flex justify-end flex-wrap`: keep `text-right` only
  (the rest is how Paper lays out text).

**Drift: the styles file has a class Paper doesn't.** A `*.styles.ts` mirrors Paper exactly, so an
extra class (e.g. once `gap-4` on VaultSummary's stat rows) is drift: don't delete it and don't
silently keep it. Report it; the fix is either `/code-to-paper` (the code is right, the class is
shipped) or removal with the designer's OK.

**Out-of-date copies.** Copies of a changed component on Blocks/Pages are never a source, but report
any that still show the old look (find them with `find_nodes` on the old style signature): the
designer fixes them, or `/code-to-paper` does.

## 3. Icons

**Icons** page, boards `Mono` and `Color`; each SVG layer is named by its registry key
(`copy`, `poc-mark`). `get_jsx` on the SVG layer, then:

- Strip `width`/`height`/`style` from the root; keep `viewBox`; spread `{...iconDefaults} {...props}`.
- Mono: every `stroke`/`fill` colour → `currentColor` (`none` stays). No defs allowed.
- Paper's export repeats a root `fill`/`stroke` on every child: where the code icon has it on the
  `<svg>` root (`fill="none"`), keep it there and leave it off the children (same render).
- Color: keep token (`var(--color-*)`) and brand hex colours. Replace Paper's ids (`_8Z-0__…`)
  with ids from `useId()`, and `url(#…)` with the same. Convert raw defs markup to JSX
  (`stop-color` → `stopColor`).
- New icon: add `Icon<Name>.tsx` in the right folder, export it from `icons/index.ts`, add it to
  `monoIcons` or `colorIcons` in `iconNames.ts`.

## 4. Verify

```bash
pnpm lint && pnpm typecheck && pnpm test
```

`pnpm test` runs every story in headless Chromium, including play tests (e.g. CopyButton's
copy → copied → reset): a sync must never break them. Then compare the **`paper`-tagged** stories
with the Paper frames named in their `parameters.paper` (screenshots), and only those: untagged
stories are code-only (behaviour tests, stress cases) and have no Paper counterpart. In Storybook,
the sidebar's tag filter → `paper` shows just these.

- A new or renamed source frame needs a `paper`-tagged story (`tags: ['paper']`,
  `parameters: { paper: 'Page › Board › Frame' }`): a story change is code, so report it for a
  separate non-sync commit.

- Storybook from a worktree: port 6006 belongs to the main checkout, so run
  `pnpm --filter @poc/ui exec storybook dev -p 6011 --no-open` and stop it when done.
- `States` stories force Hover and Focus only. Active can't be forced (the pseudo-states addon
  skips Tailwind's `color-mix` rules for `:active`), so check an Active change by grepping the
  class in the styles file and the rendered CSS instead.

## 5. Commit

`sync(paper): <what changed>` (subject ≤ 72 chars) with only the allowed files, then run
`node scripts/check-sync-commits.mjs HEAD~1 HEAD`. Docs/findings go in a separate commit.
Report anything you skipped (hardcoded values from step 0b first, structural changes, drift, out-of-date copies)
to the user.

**Commit order when code depends on what the sync removes or renames.** A sync can't touch `.tsx`,
so if it removes or renames something code still uses (an icon key, a style key), the sync commit
alone won't build. Do the code commit first (switch the usage, e.g. `network-check` → `check`,
`inForm` → `end`), then the sync that removes the old one. Every commit then builds on its own,
and the sync/code split stays readable in history.
