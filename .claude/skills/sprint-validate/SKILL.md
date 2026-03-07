---
name: sprint-validate
description: Archive pre-sprint audit snapshots, run fresh audits, compare before/after findings, and report any regressions in the sprint document.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
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

3. Announce:
   > "Running Sprint N validation audits: [list]. I'll archive the current
   > audit files first so we can compare before and after."

## Phase 1 — Archive pre-sprint snapshots

For each audit to run, if the audit file already exists:
- Read `docs/audits/audit-[name].md` and Write its contents to
  `docs/audits/archive/audit-[name]-YYYY-MM-DD.md` using today's date
  (Write creates parent directories automatically)
- Report: "Archived pre-sprint snapshots to docs/audits/archive/"

If an audit file doesn't exist yet, note "no pre-sprint baseline for [name]".

## Phase 2 — Run fresh audits

Follow the instructions from each relevant skill file:
- `.claude/skills/audit-colour/SKILL.md`
- `.claude/skills/audit-typography/SKILL.md`
- `.claude/skills/audit-interaction/SKILL.md`
- `.claude/skills/audit-microcopy/SKILL.md`

Run them sequentially (not in parallel — this is validation, not discovery;
sequential output is easier to review).

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
