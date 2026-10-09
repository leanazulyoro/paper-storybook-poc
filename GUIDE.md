# Run it and experiment with your own agent

Everything needed to reproduce the POC and try the Paper ↔ code flow yourself. What the POC
found and why: [`WRITEUP.md`](WRITEUP.md) (short) and [`FINDINGS.md`](FINDINGS.md) (every decision).

## What you need

- **Paper desktop**, signed in, with the POC file shared with you:
  [**"Jazzy nest"**](https://app.paper.design/file/01M4DYBJFTV1WSY00VDCFZBF66).
  **Paper Pro**: the free plan's MCP limit runs out within one sync session.
- **Node 22** (`.nvmrc`; with nvm: `nvm install && nvm use`) and **git**. pnpm comes through
  corepack (bundled with Node): `corepack enable` once, and the repo's pinned pnpm (11.9.0) is used.
- **An agent with MCP**: Claude Code, Cursor or Codex (Paper ships plugins for all three).

## 1. Code

```bash
git clone https://github.com/leanazulyoro/paper-storybook-poc.git
cd paper-storybook-poc
corepack enable
pnpm install
pnpm --filter @poc/ui exec playwright install chromium   # browser for the story tests
```

| Command                        | What                                                                 |
| ------------------------------ | -------------------------------------------------------------------- |
| `pnpm storybook`               | Storybook on http://localhost:6006 (sections mirror the Paper pages) |
| `pnpm dev`                     | the Next app on http://localhost:3100 (Deposit page, `/terms`)       |
| `pnpm lint` / `pnpm typecheck` | the rules (see `CLAUDE.md`)                                          |
| `pnpm test`                    | every story rendered in headless Chromium, behaviour tests included  |

Work on a branch (`git switch -c dean/<experiment>`). To push, fork the repo or ask Leandro for
collaborator access; CI runs lint, types, tests and the sync check on every PR.

## 2. Paper file

Open ["Jazzy nest"](https://app.paper.design/file/01M4DYBJFTV1WSY00VDCFZBF66) in Paper desktop. Its pages map 1:1 to Storybook:

| Paper page | What's there                                                | Storybook  |
| ---------- | ----------------------------------------------------------- | ---------- |
| Tokens     | colours, type scale, **Typography** board (text styles)     | Tokens     |
| Icons      | **Mono** and **Color** boards, SVG layers named by icon key | Icons      |
| Components | one board per component, frames `Component/Variant[/State]` | Components |
| Blocks     | composed blocks (DepositForm, VaultSummary, PageHeader)     | Blocks     |
| Pages      | the Deposit page, built from copies                         | Pages      |

**Experiment on your own copy** of the file (duplicate it in Paper, or ask Leandro for a copy) so
your changes and Leandro's syncs don't collide. Keep page, board and layer names: the sync maps code by them. The agent works on
whichever file is open in Paper.

## 3. Connect your agent to Paper

Paper desktop must be running (it serves MCP at `http://127.0.0.1:29979/mcp`).

- **Claude Code**: `/plugin marketplace add paper-design/agent-plugins`, then
  `/plugin install paper-desktop@paper`. The repo's skills (`/paper-to-code`, `/code-to-paper`)
  load automatically.
- **Cursor**: `/add-plugin paper-desktop`.
- **Codex**: `codex plugin marketplace add paper-design/agent-plugins`, then
  `codex plugin install paper-desktop@paper`.
- **Anything else**: add an HTTP MCP server pointing at the URL above.

Check: ask your agent "list the pages of my open Paper file". Cursor and Codex don't load Claude
skills: `AGENTS.md` points them at the same instructions (`.claude/skills/*/SKILL.md` are plain
markdown).

For new visual designs created through MCP, follow
[paper-design-review](.claude/skills/paper-design-review/SKILL.md): create and quality-check the
designs in Paper, show screenshots and a file/page link, and wait for the user's review of the
completed appearance before local implementation or sync. Agent screenshot checks are separate
from this human checkpoint; meaningful revisions need another review. Keep review images outside
product code and `paper-snapshots/` until approval. Workflow documentation can be prepared earlier
and belongs in a separate non-sync commit.

## 4. Experiments

Do each on a fresh branch. The first sync on a branch has no snapshots yet: it compares every
board once and writes `paper-snapshots/` (slower); later syncs only look at what changed.

### A. Design change → code

1. In Paper, change something: a token, a component's style, a new state frame
   (duplicate `Button/Secondary`, rename it `Button/Secondary/Active`, change its background), a
   new icon on the Mono board.
2. Ask your agent: _"I changed the Paper file, sync it into the code"_ (Claude Code: `/paper-to-code`).
   If the agent created a new visual design through MCP, first complete the user review above;
   a sync request alone does not establish approval of its completed appearance.
3. Check:
   - the diff touches only style files, tokens, icons and `paper-snapshots/`;
   - `pnpm lint && pnpm typecheck && pnpm test` pass;
   - `node scripts/check-sync-commits.mjs main HEAD` passes;
   - Storybook (the `States` stories for components) looks like your Paper frames.

### B. Code fix → Paper → no overwrite

1. In code, change a component's look (e.g. a padding in `Card.styles.ts`).
2. Ask: _"push this visual change to Paper"_ (`/code-to-paper`). It should update the component
   board **and** every copy on Blocks/Pages (Paper has no instances).
3. Run A's sync again: it should produce **no** code change. If it reverts your fix, the
   round trip failed.

### C. Blind test (what convinced us the rules transfer)

1. Write down the code changes you expect, then make Paper changes **without telling the agent
   what they are**. Include traps:
   - a raw colour that isn't a token (expected: code keeps its token, agent reports it);
   - an edit only on a copy (Blocks/Pages) (expected: ignored as a source, reported as out-of-date);
   - a change on a `…/Focus` frame (expected: skipped, the focus ring is code-owned).
2. Start a **fresh** agent session (no history) and only say _"I made some changes in Paper,
   please sync them into the code"_.
3. Compare its diff and report with your list.

### D. Try to break the guardrails

- Put a visual class in a `.tsx` (e.g. `bg-primary` on a component): lint fails.
- Restyle CopyButton heavily in Paper and sync: its behaviour tests must still pass.
- Commit `sync(paper): …` that also touches a `.tsx`: `node scripts/check-sync-commits.mjs main HEAD`
  fails (so does CI).

## What to send back

Which agent you used, where it got stuck or guessed, rules that were missing or wrong (the
skills are meant to improve), and anything Paper made hard. Notes in `FINDINGS.md` or in the PR.

## Known gotchas

- No component instances in Paper: copies drift; the sync reports them.
- Token changes can change how Paper exports unrelated boards: a snapshot diff without a visual
  change is normal.
- The Active state can't be previewed in the `States` stories.
- The token file header names the original Paper file id; on your copy it's cosmetic.
