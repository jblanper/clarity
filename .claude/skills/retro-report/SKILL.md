---
name: retro-report
description: Analyse all past sprint retrospectives and produce a process recommendations report. Outputs docs/retro-report.md.
disable-model-invocation: true
allowed-tools: Read, Glob, Write
---

# Retrospective Report

Analyse all sprint retrospectives and produce a recommendations report.
This can be run at any time, but is most useful before starting a new sprint
brief or when the planning process feels like it needs a reset.

## Setup

Read every file in `docs/sprints/sprint-[0-9][0-9].md` that contains a
`## Retrospective` section. Also read `docs/sprints/sprint-[0-9][0-9]-brief.md`
files to understand what was planned vs what shipped.

Announce:
> "Reading retrospectives from Sprint 1 through Sprint N."

## Analysis

Extract all retrospective content across all sprints and analyse for patterns.

### 1. Recurring problems
What issues appear in two or more sprint retrospectives under "what was harder
than expected" or "what could have been better"? These are systemic — they
won't fix themselves without a deliberate change.

### 2. Recurring wins
What consistently appears under "what went well"? These are reliable strengths
to build on and protect.

### 3. Planning accuracy over time
Looking at the brief files alongside the sprint docs: is scope estimation
improving? Are task breakdowns getting more accurate? Are review decisions
(UX, Arch) proving correct in hindsight?

### 4. Process improvements promised but not acted on
Look at every "process improvements for next sprint" section. Which ones were
actually reflected in subsequent sprints? Which ones were noted and forgotten?

### 5. Codebase health trend
Across arch review sections: is technical debt growing, stable, or shrinking?
Are the same CLAUDE.md violations appearing repeatedly?

## Output

Write `docs/retro-report.md` (overwrite if it exists) using the structure
in `template.md` in this skill's directory.

Tell the user:
> "Report written to docs/retro-report.md.
>
> The 'Recommended actions' section is a good starting point for the next
> `/sprint-brief` discussion — share it with the Product Owner to shape
> Sprint N+1 priorities."
