---
name: paper-design-review
description: Create new visual designs through MCP and obtain the user's visual review before implementing or syncing those designs into local product code. Use when creating such designs or preparing their handoff.
---

# Review MCP designs before code

Keep a new MCP-created visual design in the design tool until the user has reviewed and
approved its completed appearance. Permission to create a design is not approval to implement
the result. Apply this checkpoint to meaningful revisions of that design too.

This skill covers new visual designs created through MCP. It does not add an approval gate to
unrelated coding, read-only inspection, or mirroring an existing code design back to Paper.
Honor any explicit user checkpoint on other visual edits within that request.

## Make the design reviewable

- Follow the design tool's guidance, existing tokens, and layer/state naming conventions.
- Take screenshots after meaningful edits. Check spacing, typography, contrast, alignment,
  clipping, and state clarity; fix issues before presenting the result.
- Finish the tool's editing session and present the completed design with clear screenshots
  and a usable file/page link. Include the relevant variants and states, and identify what
  changed. Save review images outside product code and `paper-snapshots/`.

These agent quality checks do not replace human visual review.

## Human checkpoint

Ask the user to review the specific completed designs and approve them for implementation,
or describe changes. Wait for an explicit response referring to that reviewable result.
Silence, elapsed time, the initial design request, and an agent's verdict are not approval.
If the user requests meaningful visual revisions, show the revised result for another check.
Approval covers only the reviewed designs and states, not unrelated changes.

Until approval, do not implement or sync the affected designs into local product code,
including component markup, styles, tokens, icons, stories, or design-export snapshots.
Read-only repository inspection and requested workflow/skill documentation can continue.
When stopping at this stage, report that visual review is pending and name the affected designs.

## Approved handoff

Carry the user's approval and its scope into the implementation handoff. Follow
[Paper → code](../paper-to-code/SKILL.md) for visual syncs; new markup or behaviour belongs in
a separate code change under [the ownership rules](../../../CLAUDE.md).
Use direct design exports and computed styles for exact implementation values. Screenshots
are for review and verification. Keep workflow documentation in a separate non-sync commit.
