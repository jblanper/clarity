---
name: sprint-pre-flight
description: Read project state, surface blockers, and determine sprint tier before any planning begins.
disable-model-invocation: true
allowed-tools: Read, Glob, Bash(git *)
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
```
Planning:
  [write sprint-NN-brief.md directly] → /sprint-arch → /sprint-plan

Validation after coding:
  /sprint-post-code   (arch-review gate + targeted audits + QA in one command)
        or run individually:
  /sprint-arch-review → [targeted audits] → /sprint-qa
```

**Tier 3:**
```
Planning:
  /sprint-plan (or skip entirely and commit directly)

Validation after coding:
  npm run lint && npm test && npm run build
  (skip entirely if docs-only with no app code impact)
```

---

## Phase 4 — Output

No file is written. Pre-flight output lives in the chat transcript.
The user reads the blockers and tier recommendation and decides how to proceed.
