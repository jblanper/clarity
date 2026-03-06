---
name: audit-triage
description: Consolidate all five audit reports into a prioritised, chunked implementation plan. Requires all five audit docs/ files to exist first. Outputs docs/audit-implementation-plan.md.
disable-model-invocation: true
allowed-tools: Read, Write
---

# Audit Triage & Implementation Plan

Consolidate all five audit reports into a single prioritised implementation
plan with chunked, independently executable tasks.

## Prerequisites

All five audit reports must exist before running this skill:
- `docs/audit-colour.md`
- `docs/audit-typography.md`
- `docs/audit-interaction.md`
- `docs/audit-microcopy.md`
- `docs/audit-design-overall.md`

If any are missing, stop and report which ones need to be run first.

## Before starting

Read `CLAUDE.md` and `docs/calma-design-language.md` in full.
Then read all five audit reports in full.

This is a planning task only. Do not change any code.
Produce a single output file: `docs/audit-implementation-plan.md`.

---

## Step 1 — Deduplicate and consolidate

Before prioritising, consolidate findings across all five reports.

The first four reports (colour, typography, interaction, microcopy)
contain specific, measurable violations with component names and line
numbers. The fifth report (overall design) contains holistic observations
that may not map to a specific line of code.

Consolidate as follows:

- If the same component is flagged in multiple reports for different
  reasons, group those findings under that component
- If the same issue appears in multiple reports, merge into one entry
  and note which audits flagged it — findings confirmed by more than one
  audit should be treated as higher confidence
- For findings from `audit-design-overall.md`: if the observation maps to
  a specific component or pattern already flagged in another audit,
  merge it there and note the design-level context it adds. If it is
  a standalone observation with no matching specific finding, treat it
  as its own entry
- Discard any low-severity finding that touches a file already covered
  by a high-severity fix in the same pass — it will be caught there

---

## Step 2 — Prioritise into three tiers

**Tier 1 — Must fix (high urgency)**
Violations clear enough to undermine trust in the design system, or that
would create inconsistency with any feature being built next.
This includes: all WCAG AA contrast failures, all missing dark mode
variants on text, all touch target violations on primary interactions,
any section label that deviates from the exact established pattern, any
microcopy that is accusatory, clinical, or uses an exclamation mark, and
any finding from `audit-design-overall.md` flagged as the single most
important observation in the "Most important observation" paragraph.

**Tier 2 — Fix if effort is trivial or small**
Real findings but not urgent. Include if the fix is one to three lines.
Defer if it requires restructuring a component or touching more than
three files. Holistic observations from `audit-design-overall.md` that
do not map to a specific code change belong here at most — note them
as "design intent to carry forward" rather than as code fixes.

**Tier 3 — Defer to a polish pass**
Low-severity findings, subjective improvements, anything requiring
significant refactoring, and any overall design observation that cannot
be addressed with a targeted code change. List them so they are not lost,
but do not include them in the implementation chunks.

---

## Step 3 — Write the chunked implementation plan

For every Tier 1 finding and every qualifying Tier 2 finding that has
a concrete code change, write one numbered chunk using the format in
`template.md` in this skill's directory.

For Tier 2 findings from `audit-design-overall.md` that are design
intent rather than code fixes, do not write a chunk. Instead, collect
them in a "Design intent to carry forward" section as defined in
`template.md`.

---

**Chunk ordering:**
1. `globals.css` changes first — stylesheet fixes benefit all later chunks
2. Shared component fixes next — components used across many pages
3. Page-specific fixes grouped by page
4. Microcopy fixes last — fully independent of structure, easy to batch

Each chunk must be independently executable. If a chunk depends on a
previous one, state this explicitly at the top of that chunk. No chunk
should mix categories — keep colour, typography, interaction, and
microcopy concerns separate within each chunk.

---

## Step 4 — Close with a summary table

Use the summary table format in `template.md` in this skill's directory.
