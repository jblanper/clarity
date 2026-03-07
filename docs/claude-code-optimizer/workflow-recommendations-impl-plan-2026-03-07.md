# Workflow Recommendations — Implementation Plan

**Date:** 2026-03-07
**Source:** Workflow Recommendations report (evaluated 2026-03-07)
**Status:** Ready to implement

---

## Overview

Four changes to make, ordered by size (smallest first):

| # | Change | Files touched |
|---|---|---|
| A | ~~Reframe Q5/Q6 in tier guide + shell script~~ ✓ DONE | 2 |
| B | ~~Create `/sprint-pre-flight` skill~~ ✓ DONE | 1 new SKILL.md + template.md + workflow.md update |
| C | Create `/sprint-post-code` orchestrator skill | 1 new SKILL.md + fragment.md + workflow.md update |
| D | Update `workflow.md` execution order block | 1 |

Do them in order — A is standalone, B and C each require a workflow.md edit,
D is the final cleanup pass that touches workflow.md once for both.

---

## Task A — Reframe Q5/Q6 in the tier guide

### Why

The current Q5 ("carries architectural risk?") and Q6 ("purely docs/copy/tooling?")
both activate after answering No to Q1–Q4, but frame the decision as two unrelated
questions rather than a single risk fork. The reframe makes the logic explicit:
risk → Tier 2, no risk → Tier 3.

### Files to edit

**`docs/sprint-tier-guide.md`** — replace the Q5/Q6 block:

```
Current:
  Q5 — Does it carry architectural risk or CLAUDE.md compliance questions?
       (Accessibility corrections, touch targets, animation polish, tooling, static export risk)
       > Yes → Tier 2

  Q6 — Is it purely docs, copy, or tooling with no app code changes?
       > Yes → Tier 3

Replace with:
  Q5 — No new features, but carries risk?
       (Accessibility corrections, touch targets, animation polish, compliance questions,
        static export risk, tooling with app code side-effects)
       > Yes → Tier 2

  Q6 — No new features, no risk?
       (Purely docs, copy, CHANGELOG, README, skill/tooling changes with zero app code impact)
       > Yes → Tier 3
```

The Quick reference table and Notes sections do not need changes.

**`scripts/sprint-tier.sh`** — find the Q5 and Q6 prompt strings and update them
to match the new wording. The branching logic (Tier 2 / Tier 3) stays the same;
only the displayed question text changes.

### Verification

Read both files after editing to confirm the wording is consistent between them.

---

## Task B — Create `/sprint-pre-flight` skill

### Why

Surfaces unresolved retro items and open audit findings before planning begins,
so blockers are a conscious decision rather than a mid-sprint discovery.
Also determines the sprint tier automatically from project state, replacing
the manual `bash scripts/sprint-tier.sh` step for most cases.

### File to create

**`.claude/skills/sprint-pre-flight/SKILL.md`**

Frontmatter:
```yaml
---
name: sprint-pre-flight
description: Read project state, surface blockers, and determine sprint tier before any planning begins.
disable-model-invocation: true
allowed-tools: Read, Glob, Bash(git *)
---
```

#### Skill structure

**Phase 1 — Read project state (reads in parallel)**

1. **Last sprint retro** — find the highest-numbered `docs/sprints/sprint-NN.md`,
   read the `## Retrospective` section. Extract any item marked as unresolved,
   carried forward, or flagged for next sprint.

2. **Retro reports** — glob `docs/retros/retro-report*.md` (matches both
   `retro-report.md` and `retro-report-YYYY-MM-DD.md`), read all matches.
   Extract any process-level recommendations that are still open or flagged for action.

3. **Audit action list** — read `docs/audits/audit-action-list.md` if it exists.
   Extract all critical and high findings that are not marked resolved.
   If the file doesn't exist, note "No audit action list found — run `/audit-all`
   before planning if this is a Tier 1 sprint."

**Phase 2 — Surface blockers**

Print a blockers section:

```
## Blockers

### From last sprint retro
[List unresolved items, or "None"]

### From audit findings (critical + high)
[List open critical/high items with severity and audit source, or "None"]
```

If there are critical findings or unresolved must-fix retro items, print:
> "These should be resolved or explicitly deferred before planning. Confirm
> you want to proceed."
> Then stop and wait for a response before continuing to Phase 3.

If there are no blockers, continue immediately.

**Phase 3 — Determine sprint tier**

Answer Q1–Q4 automatically from the blockers context:
- If the next sprint is clearly fixing audit findings or retro items (no new
  features), Q1–Q4 are all No — proceed to Q5/Q6 automatically.
- If scope is unclear, ask the four questions explicitly.

Then ask Q5 and Q6 as per the (updated) tier guide.

Print:
```
## Sprint tier: [1 / 2 / 3]

### Recommended skill sequence

Planning:
  [exact skills to run]

Validation after coding:
  [exact skills to run — reference the new /sprint-post-code if Tier 1 or 2]
```

**Phase 4 — Output**

No file is written. Pre-flight is conversational — its output lives in the
chat transcript. The user reads the blockers + tier recommendation and decides
how to proceed.

### workflow.md update (do this in Task D)

Add `/sprint-pre-flight` to the "Anytime" table and update the "Full execution
order" block's planning entry point. See Task D.

---

## Task C — Create `/sprint-post-code` orchestrator skill

### Why

Replaces three manual post-code steps with one command. Enforces the
arch-review gate before spending time on audits and QA.

### Key implementation decision: Agent tool, not Skill tool

`sprint-arch-review`, `sprint-validate`, and `sprint-qa` all have
`disable-model-invocation: true`, meaning calling them via the `Skill` tool
injects their prompts sequentially into the main conversation — not true
parallelism. To parallelize `sprint-validate` and `sprint-qa`, the orchestrator
must use the `Agent` tool with the full skill prompt embedded in each agent's
task description. This is the same pattern used by `audit-all`.

### Gate signalling

Use a temp file to signal gate result between phases:
- Write `tmp/arch-review-result.md` after arch-review completes
- Content: `PASS` or `FAIL: [reason]`
- Parallel agents in Phase 2 do not need to read it — the main session checks
  it before spawning them

Create `tmp/` if it doesn't exist. Add `tmp/` to `.gitignore` if not already there.

### Files to create

**`.claude/skills/sprint-post-code/SKILL.md`**

Frontmatter:
```yaml
---
name: sprint-post-code
description: Post-code orchestrator — runs arch-review as a quality gate, then validate and QA in parallel. Writes a consolidated report to tmp/post-code-report.md.
disable-model-invocation: true
allowed-tools: Read, Glob, Write, Edit, Bash, Agent
---
```

#### Skill structure

**Setup**

Find the current sprint doc (same pattern as all other sprint skills:
list `docs/sprints/sprint-[0-9][0-9].md`, take latest with status `active`).
Read it to know which audits to run (from the "Audits to run" list if present).

**Phase 1 — Architecture gate (blocking)**

Read `.claude/skills/sprint-arch-review/SKILL.md` in full.
Run its instructions directly in the main session (do not spawn an agent —
arch-review needs to interact with the user during Phase 3 discussion).

After the discussion is complete and the section is appended to the sprint doc:
- If arch-review found must-fix issues: write `FAIL` to `tmp/arch-review-result.md`,
  print the gate failure message (see below), and stop.
- If no must-fix issues: write `PASS` to `tmp/arch-review-result.md` and continue.

Gate failure message:
> "Architecture gate failed — must-fix issues found. Resolve them and re-run
> `/sprint-post-code`, or run `/sprint-validate` and `/sprint-qa` manually once
> the issues are fixed."

**Phase 2 — Parallel validation (non-blocking agents)**

Read `.claude/skills/sprint-validate/SKILL.md` and `.claude/skills/sprint-qa/SKILL.md`.

Spawn two agents simultaneously using the `Agent` tool:
- Agent A: sprint-validate instructions as prompt
- Agent B: sprint-qa instructions as prompt

Wait for both to complete before proceeding.

Note: `sprint-qa` starts a dev server on port 3000. `sprint-validate` does not
use the dev server. No port conflict.

**Phase 3 — Consolidated report**

Write `tmp/post-code-report.md` using the template at
`.claude/skills/sprint-post-code/template.md`. Fill in all placeholders
from the arch-review, validate, and QA outputs.

Print:
> "Post-code complete. Report written to tmp/post-code-report.md.
> [Recommended next action]"

**`.claude/skills/sprint-post-code/template.md`**

Create this file alongside SKILL.md with the report structure:

```markdown
# Post-Code Report — Sprint [N]

**Date:** YYYY-MM-DD
**Sprint:** [sprint doc path]

## Architecture gate
[PASS / FAIL + summary of must-fix items]

## Validation
[Summary table from sprint-validate output]
[Regressions: N / None]

## QA
[Regression suite: N tests · Smoke: N/N]
[Failures: N / None]

## Recommended next action
[One of:]
- Proceed to `/calma-sync` → `/deploy`
- Fix [N] blockers first: [list]
```

**`.claude/skills/sprint-post-code/fragment.md`**

This skill does not append to the sprint doc directly — `sprint-arch-review`,
`sprint-validate`, and `sprint-qa` each append their own sections as they run.
No fragment.md needed.

### workflow.md update (do this in Task D)

Replace `sprint-arch-review → sprint-validate → sprint-qa` in the execution
order with `/sprint-post-code`. Add a row to the Execution table. See Task D.

---

## Task D — Update `workflow.md`

Make all workflow.md changes in one pass after B and C are done.

### Execution table — add `/sprint-post-code`

Add a row:
```
| `/sprint-post-code` | After coding (Tier 1 or 2) — arch-review gate + validate + QA in one command |
```

### Anytime table — add `/sprint-pre-flight`

Add a row:
```
| `/sprint-pre-flight` | Before any sprint — surfaces blockers, determines tier, recommends exact skills |
```

### Full execution order block

Replace:
```
EXECUTION:  /sprint-kickoff → [code] → /sprint-arch-review → /sprint-validate → /sprint-qa → [you validate]
```

With:
```
EXECUTION:  /sprint-kickoff → [code] → /sprint-post-code → [you validate]
            (or run /sprint-arch-review, /sprint-validate, /sprint-qa individually)
```

And update the planning entry point:
```
PLANNING:   /sprint-pre-flight          ← blockers + tier + exact skills to run
                 ↓
            [planning skills as recommended by pre-flight]
```

---

## Implementation order

```
Task A  →  Task B  →  Task C  →  Task D
```

Each task is independently committable. Suggested commits:

1. `docs: reframe Q5/Q6 in sprint tier guide` (A)
2. `skill: add sprint-pre-flight` (B, including its workflow.md line)
3. `skill: add sprint-post-code orchestrator` (C, including its workflow.md line)
4. `docs: update workflow.md execution order for new skills` (D)

Or collapse B+C+D into one commit if doing them in a single session.

---

## What is NOT changing

- The individual skills (`/sprint-arch-review`, `/sprint-validate`, `/sprint-qa`)
  remain usable standalone — no changes to them.
- `scripts/sprint-tier.sh` is not deleted — it stays as a lightweight fallback.
  Pre-flight is the preferred path but the script is harmless to keep.
- No changes to the data model, components, or app code.
- No changes to any audit skills.
