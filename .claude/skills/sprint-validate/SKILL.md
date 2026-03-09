---
name: sprint-validate
description: Archive pre-sprint audit snapshots, run fresh audits, compare before/after findings, and report any regressions in the sprint document.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash(node *), Agent
---

# Sprint Validate — Audit-Based Validation

Run the audits relevant to this sprint, compare against pre-sprint snapshots,
and report progress in the sprint document.

## Setup

1. Find the current sprint doc:
   - List `docs/sprints/sprint-[0-9][0-9].md`, sort, take the latest with status `active`
   - Read it in full to understand what was built and which audits the UX reviewer flagged

2. Identify which audits to run:
   - Look for an "Audits to run" list in the sprint doc (added by `/sprint-ux`)
   - If none is listed, run all four specific audits (colour, typography, interaction, microcopy)
   - Never run `/audit-design-overall` or `/audit-triage` here — those are planning tools

   **Guard:** `audit-arch` must never appear in the "Audits to run" list — it is always
   handled by `sprint-arch-review`. If the list contains `audit-arch`, remove it and note:
   "audit-arch is excluded from sprint-validate; it runs via sprint-arch-review."

3. Announce:
   > "Running Sprint N validation audits: [list]. I'll archive the current
   > audit files first so we can compare before and after."

## Phase 1 — Archive pre-sprint snapshots

For each audit to run, run the following in parallel (one Bash call per audit):

```
node .claude/skills/scripts/archive_audit.js docs/audits/audit-[name].md YYYY-MM-DD
```

- If `archived: true`, report: "Archived pre-sprint snapshot → [destination]"
- If `archived: false`, note: "No pre-sprint baseline for [name]"

Report: "Pre-sprint snapshots archived to docs/audits/archive/"

## Phase 2 — Run fresh audits

Spawn one background agent per audit simultaneously, each following the
instructions from its SKILL.md. Wait for all agents to complete before Phase 3.

| Agent | Skill instructions | Output file |
|---|---|---|
| Colour & contrast | `.claude/skills/audit-colour/SKILL.md` | `docs/audits/audit-colour.md` |
| Typography & spacing | `.claude/skills/audit-typography/SKILL.md` | `docs/audits/audit-typography.md` |
| Interaction & motion | `.claude/skills/audit-interaction/SKILL.md` | `docs/audits/audit-interaction.md` |
| Microcopy & tone | `.claude/skills/audit-microcopy/SKILL.md` | `docs/audits/audit-microcopy.md` |

Each audit overwrites its `docs/audits/audit-[name].md` file with fresh findings.

## Phase 3 — Compare and report

For each audit that had a pre-sprint baseline:
- Count findings by severity in the archived file (before)
- Count findings by severity in the new file (after)
- List any findings that were present before and are now gone (fixed)
- List any new findings that weren't in the baseline (regressions)

Produce a summary table:

```
| Audit | Before | After | Fixed | Regressions |
|---|---|---|---|---|
| colour | 8 findings | 3 findings | 5 | 0 |
```

## Phase 4 — Update the sprint doc

Append the section defined in `fragment.md` in this skill's directory
to the sprint doc.

## Close

Tell the user:
> "Validation complete. [N regressions / no regressions] found.
>
> Next steps:
> - Fix any regressions before proceeding
> - Run `/sprint-qa` for functional testing
> - Run `/sprint-arch-review` for code quality review
> - Then validate manually and run `/deploy`"
