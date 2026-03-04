# Sprint Parallel Review — UX/UI + Architecture

Run the UX/UI and Architecture reviews simultaneously as background agents,
then facilitate a mediation session with the user as Product Owner.

## Setup

1. Find the current sprint brief:
   - List `docs/sprints/sprint-[0-9][0-9]-brief.md`, sort, take the latest
   - If none exists, stop: "No sprint brief found. Run `/sprint-brief` first."

2. Announce what is about to happen:
   > "I'm running the UX/UI and Architecture reviews in parallel for Sprint N.
   > This will take a moment — both reviewers will read the brief and the
   > codebase simultaneously. I'll present their findings together and we'll
   > work through any conflicts."

## Phase 1 — Parallel reviews

Read the skill files for both roles, then spawn two background agents simultaneously:

**UX/UI Agent** — use the full instructions from `.claude/skills/sprint-ux/SKILL.md`,
but instruct the agent to produce only the written analysis (the "Analysis" section),
not to engage in discussion or update the brief. It should return its findings as text.

**Architecture Agent** — use the full instructions from `.claude/skills/sprint-arch/SKILL.md`,
but instruct the agent to produce only the written analysis, not to engage in discussion
or update the brief. It should return its findings as text.

Wait for both agents to complete.

## Phase 2 — Present findings

Present both analyses to the user in a structured way:

```
## UX/UI Review findings
[UX agent output]

---

## Architecture Review findings
[Arch agent output]
```

Then identify any conflicts between the two reviews — places where the UX recommendation
and the architecture assessment pull in different directions. Present these explicitly:

> "There are N points where the UX and Architecture perspectives conflict.
> Let me walk through each one so we can decide together."

For each conflict:
- State what UX recommends and why
- State what Arch recommends and why
- Ask the user for their call

## Phase 3 — Mediated discussion

Facilitate the discussion as Product Owner. Your job is to help the user make
decisions, not to impose them. For each open point:
- Present the trade-off clearly
- Offer your PO view if it would help
- Record the decision

Continue until all conflicts and open questions are resolved.

## Phase 4 — Update the brief

Once all decisions are made, append both review sections to the brief
(using the same format as `/sprint-ux` and `/sprint-arch`), plus a
mediation summary:

```markdown
---

## Parallel Review Mediation

**Reviewed:** YYYY-MM-DD

### Conflicts resolved

| Topic | UX position | Arch position | Decision |
|---|---|---|---|
| [topic] | [ux view] | [arch view] | [decision] |

### Final scope after review
[Updated bulleted scope list reflecting all decisions]
```

Update the brief's **Status** field to `reviewed`.

Confirm the update and tell the user the next step:
> "Brief updated with both reviews and mediation decisions. Run `/sprint-plan`
> to produce the final sprint document."
