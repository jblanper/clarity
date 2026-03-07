---
name: audit-triage
description: Consolidate all five audit reports into a severity-ordered action list. Requires all five audit docs/ files to exist first. Outputs docs/audits/audit-action-list.md.
disable-model-invocation: true
allowed-tools: Read, Write
---

# Audit Triage & Action List

Consolidate all five audit reports into a single list of individually
actionable issues, ordered by severity — Critical first, then High,
then Medium, then Deferred.

## Prerequisites

All five audit reports must exist before running this skill:
- `docs/audits/audit-colour.md`
- `docs/audits/audit-typography.md`
- `docs/audits/audit-interaction.md`
- `docs/audits/audit-microcopy.md`
- `docs/audits/audit-design-overall.md`

If any are missing, stop and report which ones need to be run first.

## Before starting

Read `CLAUDE.md` and `docs/calma-design-language.md` in full.
Then read all five audit reports in full.

This is a planning task only. Do not change any code.
Produce a single output file: `docs/audits/audit-action-list.md`.

---

## Step 1 — Deduplicate and consolidate

Before ordering, consolidate findings across all five reports.

The first four reports (colour, typography, interaction, microcopy)
contain specific, measurable violations with component names and line
numbers. The fifth report (overall design) contains holistic observations
that may not map to a specific line of code.

Consolidate as follows:

- If the same component is flagged in multiple reports for different
  reasons, keep them as separate issues (different problems, different fixes)
- If the same issue appears in multiple reports, merge into one entry
  and note which audits flagged it — findings confirmed by more than one
  audit carry higher confidence and should be promoted one severity level
  if they straddle a boundary
- For findings from `audit-design-overall.md`: if the observation maps to
  a specific component or pattern already flagged in another audit,
  merge it there and note the design-level context it adds. If it is
  a standalone observation with no matching specific finding, treat it
  as its own entry
- Discard any Low finding that duplicates the root cause of a Critical
  or High finding in the same component — it will be caught in the same fix

---

## Step 2 — Filter by actionability

Decide what to include and what to defer.

**Include (Critical and High):**
All Critical and High findings from the audit reports. These are
non-negotiable. Critical = WCAG AA failure or data safety risk.
High = spec contradiction, missing dark mode on text, touch target
violation on a primary interaction, section label deviating from the
exact pattern, microcopy that is accusatory, clinical, or contains an
exclamation mark, and any finding flagged as the single most important
observation in `audit-design-overall.md`.

**Include if the fix is trivial (Medium):**
Include a Medium finding only if the fix is one to three lines and
touches at most one file. Defer any Medium that requires restructuring
a component or touching more than one file.

**Defer (Low and non-trivial Medium):**
List them in the Deferred section so they are not lost. Do not write
action items for them.

**Design intent (holistic observations without a code fix):**
Observations from `audit-design-overall.md` that cannot be addressed
with a targeted code change go in the "Design intent to carry forward"
section — not as action items.

---

## Step 3 — Write the action list ordered by severity

For every included finding, write one issue entry using the format in
`template.md` in this skill's directory.

Order strictly by severity:
1. Critical issues first
2. High issues next
3. Medium (qualifying) issues last

Within each severity level, order by confidence: issues confirmed by
multiple audits before those flagged by a single audit.

Each issue must be independently actionable. A developer should be able
to pick any issue from the list, fix it, and move on to the next —
there are no batches, no required ordering between issues, and no
cross-dependencies unless explicitly stated on the issue itself.

No issue should mix concerns — if a component has both a colour violation
and a typography violation, these are two separate issues.

---

## Step 4 — Close with a summary table

Use the summary table format in `template.md` in this skill's directory.
