# Agent instructions

Read [`CLAUDE.md`](CLAUDE.md) first: who owns what (Paper vs code), the lint-enforced rules, and
the commands. It applies to every agent, not only Claude.

Procedures (plain markdown, follow them step by step):

- Create new visual designs through MCP, or prepare their implementation handoff: [`.claude/skills/paper-design-review/SKILL.md`](.claude/skills/paper-design-review/SKILL.md). The user must visually review the finished designs before they enter local product code or design-export snapshots.
- Sync a Paper design change into code: [`.claude/skills/paper-to-code/SKILL.md`](.claude/skills/paper-to-code/SKILL.md)
- Push a code-side visual change back to Paper: [`.claude/skills/code-to-paper/SKILL.md`](.claude/skills/code-to-paper/SKILL.md)

Setup and experiments: [`GUIDE.md`](GUIDE.md).
