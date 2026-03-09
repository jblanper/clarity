---
name: sprint-pre-flight
description: Read project state, surface blockers, and determine sprint tier before any planning begins. Writes docs/sprints/pre-flight-report.md.
disable-model-invocation: true
allowed-tools: Read, Glob, Write, Bash(git *), Bash(date *)
---

# Sprint Pre-Flight

Read project state, surface any blockers, and determine the sprint tier before
planning begins. Output is conversational — no file is written.

The output structure follows `.claude/skills/sprint-pre-flight/template.md`.

---

## Phase 1 — Read project state

Perform all three reads in parallel.

### 1. Last sprint retro

- Glob `docs/sprints/sprint-[0-9][0-9].md`, sort, take the highest-numbered file.
- Read it in full.
- From the `## Retrospective` section, extract every item that is:
  - Marked unresolved, carried forward, or flagged for the next sprint
  - Labelled "must fix", "blocker", or similar
- If the file has no `## Retrospective` section, note: "Last sprint has no retrospective."

### 2. Retro reports

- Glob `docs/retros/retro-report*.md` (matches both `retro-report.md` and
  `retro-report-YYYY-MM-DD.md`).
- Read all matches.
- Extract any process-level recommendations that are still open or flagged for action.
- If no files match, note: "No retro reports found."

### 3. Audit action list

- Read `docs/audits/audit-action-list.md` if it exists.
- Extract all findings with severity **critical** or **high** that are not marked
  resolved.
- If the file does not exist, note:
  > "No audit action list found — run `/audit-all` before planning if this is a
  > Tier 1 sprint."

---

## Phase 2 — Surface blockers

Print the Blockers section from the template, filled in from Phase 1.

**If there are critical audit findings or unresolved must-fix retro items:**

Print:
> "These should be resolved or explicitly deferred before planning. Confirm you
> want to proceed."

Then **stop and wait for a response** before continuing to Phase 3.

**If there are no blockers:** continue immediately to Phase 3.

---

## Phase 3 — Determine sprint tier

### Q1–Q4: automatic vs. explicit

If the project context makes it obvious that Q1–Q4 are all No — for example,
the intended sprint is clearly fixing audit findings or retro action items with
no new features — state this briefly and skip to Q5/Q6:

> "Q1–Q4 are all No: this sprint fixes existing issues, no new features or
> patterns."

If the scope is unclear, ask Q1–Q4 explicitly, in order. First "Yes" wins.

**Q1** — Does it change the data model?
(`HabitEntry`, `HabitState`, `AppConfigs`, localStorage keys, export format)
→ Yes → Tier 1

**Q2** — Does it add new routes, navigation patterns, or new pages?
→ Yes → Tier 1

**Q3** — Does it introduce a new user-facing feature?
(Something that didn't exist before — not improving or fixing existing behaviour)
→ Yes → Tier 1

**Q4** — Does it introduce a pattern not currently in the Calma spec?
(New visual pattern, new component type, new colour role, new motion behaviour)
→ Yes → Tier 1

### Q5–Q6

Always ask these if Q1–Q4 are all No.

**Q5** — No new features, but carries risk?
(Accessibility corrections, touch targets, animation polish, compliance questions,
static export risk, tooling with app code side-effects)
→ Yes → Tier 2

**Q6** — No new features, no risk?
(Purely docs, copy, CHANGELOG, README, skill/tooling changes with zero app code impact)
→ Yes → Tier 3

**Default → Tier 2** (arch review is cheap insurance when in doubt)

### Print the tier result

Fill in the "Sprint tier" and "Recommended skill sequence" sections of the
template using the sequences below.

**Tier 1:**
```
Planning:
  /sprint-brief → /sprint-review → /sprint-plan
        or
  /sprint-brief → /sprint-ux + /sprint-arch → /sprint-plan

Validation after coding:
  /sprint-post-code   (arch-review gate + validate + QA in one command)
        or run individually:
  /sprint-arch-review → /sprint-validate → /sprint-qa
```

**Tier 2:**

Before printing the Tier 2 sequence, infer which audits apply from the
information already gathered in Phase 1. Do not ask the user unless the
scope is genuinely ambiguous after reading the available context.

Use this mapping:

| What the context suggests was/will be touched | Audit to include |
|---|---|
| Colour, contrast, dark mode, stone palette | `/audit-colour` |
| Typography, section labels, spacing rhythm | `/audit-typography` |
| Animation, motion, scroll, reduced motion | `/audit-interaction` |
| Copy, error messages, UI text, tone | `/audit-microcopy` |
| Components, data model, routes, CLAUDE.md compliance | `/audit-arch` |
| Three or more of the above | also include `/audit-design-overall` |

Sources to read in order of specificity:
1. Open critical/high findings in `audit-action-list.md` — their domain
   labels indicate which audits apply directly.
2. The last sprint doc's Goals and Scope — infer domain from what is described.
3. Unresolved retro items — if they name a domain (e.g. "animation feels
   sluggish"), count that.

If after reading all three sources the scope covers three or more domains,
also add `/audit-design-overall`.

If scope is still unclear after reading all available context, ask one
targeted question:
> "I can't determine which audits to run from the available context.
> What does this sprint primarily touch — colour, typography, animation,
> copy, or components/architecture?"

Then print the resolved sequence:

```
Planning:
  [write sprint-NN-brief.md directly] → /sprint-arch → /sprint-plan

Validation after coding:
  /sprint-post-code   (arch-review gate + [inferred audits] + QA in one command)
        or run individually:
  /sprint-arch-review → [inferred audits] → /sprint-qa
```

Replace `[inferred audits]` with the actual audit skills determined above,
e.g. `/audit-colour` + `/audit-interaction`.

**Tier 3:**
```
Planning:
  /sprint-plan (or skip entirely and commit directly)

Validation after coding:
  npm run lint && npm test && npm run build
  (skip entirely if docs-only with no app code impact)
```

---

## Phase 4 — Write pre-flight report

Run `date '+%Y-%m-%d %H:%M'` to get the current timestamp.

Write `docs/sprints/pre-flight-report.md`, always overwriting any previous report,
using this structure:

```markdown
# Pre-flight Report
**Generated:** YYYY-MM-DD HH:MM
**Sprint:** N+1 (next)

## Blockers
### From last sprint retro
[Unresolved items as bullets, or "None"]

### From audit findings (critical + high)
[Open findings with severity and source, or "None"]

## Tier recommendation
Tier [1 / 2 / 3] — [one-line rationale]

## Audits to run
[Comma-separated list, e.g. "colour, typography" — inferred from Phase 1 context.
 Tier 1: all four design audits unless scope is clearly narrower.
 Tier 2: only audits relevant to the changes planned.
 Tier 3: none.]

## Recommended skill sequence
Planning:   [exact skills, in order]
Execution:  [exact skills, in order]
Closure:    [exact skills, in order]
```

Tell the user:
> "Pre-flight complete. Report written to docs/sprints/pre-flight-report.md.
>
> Run `/sprint-brief` to start planning Sprint N+1."
