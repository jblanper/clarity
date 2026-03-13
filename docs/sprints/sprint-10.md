# Sprint 10 — Tooling: e2e Baseline & Sprint Pipeline

**Dates:** 2026-03-13 – (TBD)
**Status:** completed
**Release:** v2.3.1 (patch)

---

## Goal

Restore a clean e2e baseline after Sprint 9's control redesign, then improve the sprint workflow: scoped reads reduce token cost on every subsequent sprint, a structured edge-case field in task specs catches data-model gotchas earlier, and a pipeline orchestrator makes the workflow self-describing and resumable.

## Business value

A green e2e suite means regressions are visible immediately — not buried in expected noise. The workflow investments compound: every sprint that follows benefits from leaner reads, earlier edge-case capture, and a guided pipeline that removes the need to remember which skill to run next.

---

## Tasks

### Task 1 — e2e: verify and clean the Sprint 8 touch-target suite

**What:** Run the full Playwright suite against a live dev server and confirm all tests pass. The Sprint 9 QA predicted three `sprint-08-touch-targets.spec.ts` assertions would fail by design (old control shapes). Inspecting the current file shows those tests appear to have been updated to Sprint 9 patterns (amber dot, spinbutton pill, clicking pill before checking decrement) — but this was never verified live. Confirm they actually pass; fix or remove any that still fail.

**Files:** `e2e/sprint-08-touch-targets.spec.ts`

**Implementation notes:**

Read the current `e2e/sprint-08-touch-targets.spec.ts` in full before making any changes (already done in sprint planning — the three Sprint 9-era tests are at lines 42, 57, and 70).

Start the dev server and run the full suite:
```bash
npm run dev &
# wait for localhost:3000 to respond
npx playwright test
```

For each failing test, determine:
- **Stale test** (asserts old behaviour that was intentionally replaced): remove it. Document what was removed and why in the commit message.
- **True regression** (the feature broke): this is unexpected for a tooling sprint — investigate before fixing.

The three tests most likely to fail (based on Sprint 9 QA predictions):
1. `HabitToggle — amber dot indicator is smaller than the button (10px)` (line 42) — checks that the first `<span>` inside the switch button is `~10px`. If the amber dot is rendered correctly this should pass.
2. `NumberStepper — decrement button is at least 44px tall and 44px wide` (line 57) — clicks the spinbutton pill first, then looks for `aria-label=/decrease/i`. Should pass if the decrement button has the correct aria-label.
3. `NumberStepper — pill (spinbutton) is at least 44px tall and 44px wide` (line 70) — uses `getByRole("spinbutton")`. Should pass.

After any changes, run the full suite once more and confirm all tests pass before closing out the task.

**Gotchas / edge cases:**
- The dev server must be running before `npx playwright test` — Playwright won't start it automatically with the current config.
- After killing the dev server at the end, confirm no orphan processes remain: `lsof -i :3000`.
- The test at line 80 uses a class-name selector (`.flex.items-center.justify-between.py-3\\.5`) which is fragile. Do not fix it in this sprint — it is pre-existing and out of scope.

**Validation steps:**
- [ ] `npx playwright test` runs against a live dev server (no "server not running" errors)
- [ ] All tests in `sprint-08-touch-targets.spec.ts` pass or are explicitly removed with documented rationale
- [ ] Full suite passes: zero unexpected failures across all `e2e/` spec files
- [ ] `npm run lint && npm test` still passes after any file changes

**Definition of done:** Full e2e suite passes clean against a live dev server; any removed tests are documented.

---

### Task 2 — Template: add "Gotchas / edge cases" subsection to task spec

**What:** Add a `**Gotchas / edge cases:**` field to the task spec structure in `sprint-plan/template.md`. This catches data-model edge cases (like the `startAt: 0` no-op from Sprint 9) at brief time rather than at arch review.

**Files:** `.claude/skills/sprint-plan/template.md`

**Implementation notes:**

In `template.md`, the per-task spec currently reads:

```
**What:** …
**Files:** …
**Implementation notes:**
…
**Validation steps:**
- [ ] …
**Definition of done:** …
```

Insert the new field between `**Files:**` and `**Implementation notes:**`:

```
**What:** [Clear description of what needs to be built or changed.]

**Files:** [List of files expected to be touched. Max 4–5 per task.]

**Gotchas / edge cases:**
[Optional — data-model edge cases, backwards-compatibility constraints, or known
failure modes that implementation notes must address. Leave blank if none. Examples:
"guard `v <= 0 ? undefined : v` when parsing numeric input", "archived UUIDs must
remain resolvable — never delete config entries", "first tap vs subsequent taps
behave differently when `startAt` is set".]

**Implementation notes:**
[Specific guidance that a fresh session with only CLAUDE.md and the listed files
could follow correctly. Reference existing patterns to reuse. Flag any CLAUDE.md
rules that are especially relevant.]
```

The field is optional by design — tasks with no edge cases leave it blank or omit the body. Sprint-plan should populate it when writing tasks; sprint-arch can add to it during review.

**Gotchas / edge cases:**
- None for this task — it's a template-only change with no runtime impact.

**Validation steps:**
- [ ] `template.md` has `**Gotchas / edge cases:**` field between `**Files:**` and `**Implementation notes:**`
- [ ] The field description includes examples that make its purpose clear
- [ ] The field is marked optional (so tasks with no edge cases don't need to include a body)
- [ ] Existing task format remains intact — no other sections moved or removed

**Definition of done:** `template.md` updated; Gotchas field present and correctly placed.

---

### Task 3 — Scoped reads for execution-phase skills

**What:** Refactor `sprint-validate`, `sprint-qa`, and `sprint-plan` SKILL.md files to read only the sections each skill actually needs from the sprint document, rather than reading the full doc. After a sprint is fully executed, the sprint doc grows to 600+ lines (tasks + arch review + QA + validation + retro). The validate and QA skills only need the Tasks section and the audits list — they don't need the appended review sections they themselves wrote.

**Files:** `.claude/skills/sprint-validate/SKILL.md`, `.claude/skills/sprint-qa/SKILL.md`, `.claude/skills/sprint-plan/SKILL.md`

**Gotchas / edge cases:**
- The `sprint-validate` skill reads the doc "in full" and also uses the "Audits to run" list. This list is in the **brief** (set by `sprint-ux`), not in the sprint doc itself. The skill's setup must be updated to also read the brief for the audits list.
- The `sprint-plan` skill reads the previous sprint doc "for format reference." The full doc is not needed — only the header block and one example task are needed to establish the format. Do not accidentally scope this to read the CURRENT brief (which it already reads in full and correctly).
- `sprint-ux` and `sprint-arch` read the brief, which is small (< 50 lines). Their main context overhead is CLAUDE.md and calma-design-language.md. These are out of scope for this task — they need those files for their analysis. Leave ux and arch unchanged.

**Implementation notes:**

**`sprint-validate/SKILL.md` — Setup step 1:**

Current text:
```
- Read it in full to understand what was built and which audits the UX reviewer flagged
```

Replace with:
```
- Read the sprint doc from `## Goal` through `## Definition of done — Sprint` only
  (stop before any appended review sections — Architecture Review, QA, Validation, etc.)
- Also read the current sprint brief (`docs/sprints/sprint-NN-brief.md`) for the
  "Audits to run" field — this is set by sprint-ux in the brief, not copied to the sprint doc
```

**`sprint-qa/SKILL.md` — Setup step 1:**

Current text:
```
- Read it in full — the task list and validation steps are the test specification
```

Replace with:
```
- Read the sprint doc from `## Goal` through `## Definition of done — Sprint` only
  (stop before any appended review sections — the task list and validation steps are
  the test specification; Architecture Review, QA, and Validation sections are not needed)
```

**`sprint-plan/SKILL.md` — Setup step 2:**

Current text:
```
- The most recent completed sprint doc for format reference
```

Replace with:
```
- The most recent completed sprint doc — header block and first task only (for format
  reference; read lines 1–60 or stop after the first task's "Definition of done" line)
```

After each edit, verify the surrounding context is unchanged. Do not touch the analysis or output sections of any skill.

**Validation steps:**
- [x] `sprint-validate/SKILL.md` Setup step 1: reads Goal → Definition of done only; also reads brief for audits list
- [x] `sprint-qa/SKILL.md` Setup step 1: reads Goal → Definition of done only
- [x] `sprint-plan/SKILL.md` Setup step 2: reads header + first task of previous doc only (not full doc)
- [x] No other sections of any SKILL.md are changed
- [x] `npm run lint && npm test` passes (skill files are not compiled, but confirms no accidental app file changes)

**Definition of done:** Three SKILL.md files updated with scoped read instructions; surrounding skill logic unchanged.

---

### Task 4 — `/sprint-pipeline` orchestrator skill

**Depends on Task 3** (scoped reads should be in place before the pipeline invokes the updated skills).

**What:** A new skill that sequences the sprint phases in order, presents the current pipeline state, and waits for human approval at each checkpoint before invoking the next skill. Supports skipping optional phases (e.g. UX review for tooling sprints) and resuming mid-pipeline. Pipeline state is derived from the Status field already present in the brief and sprint doc — no separate state file.

**Files:** `.claude/skills/sprint-pipeline/SKILL.md` (new file)

**Gotchas / edge cases:**
- The pipeline must handle the case where no brief exists yet (sprint hasn't started).
- The pipeline must handle the case where no sprint doc exists yet (brief exists but plan hasn't run).
- The Status field in the brief goes: `draft → ux-reviewed → arch-reviewed → reviewed → finalized`.
- The Status field in the sprint doc goes: `active → completed`.
- Both files may exist simultaneously — check both: brief for pre-code state, doc for post-code state.
- The UX review is optional — the pipeline must support proceeding from `draft` to `arch-reviewed` without a UX review step, without treating this as an error.

**Implementation notes:**

Create `.claude/skills/sprint-pipeline/SKILL.md` with the following structure:

---

```markdown
---
name: sprint-pipeline
description: Orchestrates the full sprint workflow — phases in order, human approval at each checkpoint, supports skipping optional phases and resuming mid-pipeline.
disable-model-invocation: true
allowed-tools: Read, Glob, Edit
---

# Sprint Pipeline

Determine where the current sprint is in the pipeline, show the full ordered
sequence with the current position marked, and offer to advance to the next phase.

## Detecting current state

1. Find the latest brief: `docs/sprints/sprint-[0-9][0-9]-brief.md` — read its Status field.
2. Find the latest sprint doc: `docs/sprints/sprint-[0-9][0-9].md` — read its Status field if it exists.

Derive pipeline state from these statuses:

| Brief status   | Doc status | Pipeline position                          |
|----------------|------------|--------------------------------------------|
| draft          | —          | Pre-code: needs reviews + plan             |
| ux-reviewed    | —          | Pre-code: arch review pending              |
| arch-reviewed  | —          | Pre-code: plan pending (UX was skipped)    |
| reviewed       | —          | Pre-code: ready to plan                    |
| finalized      | active     | In-code: tasks being executed              |
| finalized      | completed  | Done — retrospective complete              |

If no brief and no doc exist: "No sprint in progress. Run `/sprint-brief` to start one."

## Display

Print the full pipeline with current position marked (▶):

```
Sprint N pipeline
─────────────────────────────────────────────
  1. Brief          [done]    /sprint-brief
  2. UX review      [done]    /sprint-ux       (optional)
  3. Arch review    [done]    /sprint-arch
  4. Plan           [done]    /sprint-plan
▶ 5. Execute        [active]  (developer — work through tasks in sprint doc)
  6. Validate       [ ]       /sprint-validate
  7. QA             [ ]       /sprint-qa
  8. Code review    [ ]       /sprint-arch-review
  9. Retrospective  [ ]       /sprint-retro
 10. Deploy         [ ]       /deploy
─────────────────────────────────────────────
```

Mark phases:
- `[done]` — completed (status field confirms)
- `[active]` — current position
- `[ ]` — not yet started
- `[skip]` — explicitly skipped (show only if user skipped it)

## Checkpoints

For pre-code phases (1–4), offer to run the next skill:

```
Next: /sprint-ux (UX review) — or type `skip` to skip UX review for this sprint.
```

For post-code phases (6–10), offer to run them in order. Phases 6–8 may run in parallel
if the user approves; present this option explicitly.

Wait for user input at each checkpoint. Do not invoke the next skill without approval.

Accepted inputs:
- `yes` / `y` / `run` — invoke the next skill
- `skip` — skip the current optional phase (mark as `[skip]`); advance to the next
- `status` — re-display the pipeline without advancing
- `done` — exit the pipeline (user will resume manually)

Optional phases (may be skipped without warning):
- UX review (phase 2) — omit for pure tooling or data-model-only sprints
- Arch review (phase 3) — omit for copy-only or documentation sprints

Required phases (warn if user tries to skip):
- Brief (phase 1), Plan (phase 4), Retrospective (phase 9), Deploy (phase 10)

## Execute phase

When the pipeline is in the Execute phase, print:

```
Execute phase — work through the tasks in docs/sprints/sprint-NN.md in order.
Run this pipeline again when you're ready to move to post-code phases.
```

Do not attempt to run tasks on the user's behalf — execution is always developer-driven.

## Resuming

Because state is read from the brief/doc Status fields on every invocation, resuming
mid-pipeline is automatic — just run `/sprint-pipeline` again and it will pick up
where it left off.
```

---

After writing the file, verify it renders correctly by reading it back and checking:
- The frontmatter is valid YAML (name, description, disable-model-invocation, allowed-tools)
- The state table covers all Status combinations
- The display example shows all 10 phases
- The checkpoint logic handles both `yes` and `skip` inputs

**Validation steps:**
- [x] `.claude/skills/sprint-pipeline/SKILL.md` exists and has valid YAML frontmatter
- [x] State detection table covers: draft, ux-reviewed, arch-reviewed, reviewed, finalized+active, finalized+completed
- [x] Display block shows all phases with `▶` marking current position (tier-aware: 5 phases Tier 3, 10 phases Tier 2, 11 phases Tier 1 — redesigned per user feedback to include /sprint-pre-flight, /sprint-post-code, /calma-sync)
- [x] Optional phases (UX, Arch) are marked and can be skipped
- [x] Required phases (Brief, Plan, Retro, Deploy) warn on skip attempt
- [x] "Execute phase" message correctly directs developer to the sprint doc
- [x] Resume behavior is described (stateless — reads Status on every invocation)
- [x] `npm run lint && npm test` passes

**Definition of done:** `/sprint-pipeline` skill written; state machine covers all Status combinations; checkpoints with `yes`/`skip` inputs; execute phase message; resume by re-invocation.

---

## Definition of done — Sprint

- [ ] All four tasks above are complete and validated
- [ ] `npx playwright test` passes with zero unexpected failures (Task 1 gate)
- [ ] `npm run lint && npm test && npm run build` passes clean
- [ ] No regressions on existing features (check Today, History, Settings, Manage, Edit)
- [ ] Ready for `/deploy`

---

## Retrospective

**Date:** 2026-03-13

### What went well
- Planning was frictionless — precise task specs meant each task could be executed without back-and-forth
- `sprint-pipeline` implementation was easier than expected given its complexity
- Scoped-reads task (Task 3) was unusually clean — three targeted edits, all validated in one pass
- Task ordering was correct: scoped reads landed before the pipeline skill was written, so the pipeline invokes the already-improved skills

### What was harder than expected
- `/skill-creator` run was slow, generated a lot of boilerplate, and the eval results didn't provide useful signal for prose-format skills — not worth the cost
- Token burn in the workflow still feels high despite the scoped-reads work; more skills likely still read more than they need

### Process improvements for next sprint
- Continue reducing token consumption — next targets are likely arch and UX skills (still pull in CLAUDE.md + calma in full even for tooling sprints)
- After finishing each task during the development phase, explicitly update its validation checklist (`[x]`) before moving to the next task — keeps the doc as a live record and reduces QA guesswork
- Avoid running `/skill-creator` for prose-format skills; its eval harness is designed for measurable output, not workflow skills

### Planning accuracy
Scope, estimates, and task ordering were all accurate. The sprint-pipeline grew slightly beyond spec during implementation (tier-aware phases and extra skill references appeared in validation checks without being in the original task spec) — worth monitoring in future sprints.
