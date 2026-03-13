---
name: sprint-pipeline
description: Orchestrates the full sprint workflow — shows the tier-appropriate pipeline, marks current position, and offers to advance to the next phase with human approval at each checkpoint. Supports skipping optional phases and resuming mid-pipeline.
disable-model-invocation: true
allowed-tools: Read, Glob, Edit
---

# Sprint Pipeline

Determine where the current sprint is in the pipeline, show the full ordered
sequence for the sprint's tier with the current position marked, and offer to
advance to the next phase.

## Step 1 — Read project state

Perform all three reads in parallel:

1. `docs/sprints/pre-flight-report.md` — read **Tier recommendation** line and the
   **Generated** timestamp. If missing, pipeline cannot proceed (see "No pre-flight" below).
2. Latest brief `docs/sprints/sprint-[0-9][0-9]-brief.md` — read **Status** field and
   sprint number from the filename.
3. Latest sprint doc `docs/sprints/sprint-[0-9][0-9].md` — read **Status** field if it
   exists (may be absent if planning isn't complete yet).

## Step 2 — Derive pipeline state

### No pre-flight report

```
No sprint in progress.

Run /sprint-pre-flight first — it surfaces blockers, determines the tier, and
outputs the exact skill sequence to follow.
```

Stop here.

### Derive current position

Use this lookup (in priority order):

| Pre-flight exists | Brief status | Doc status  | Current position        |
|-------------------|--------------|-------------|-------------------------|
| yes               | missing      | —           | Brief not started       |
| yes               | draft        | —           | Brief in progress       |
| yes               | ux-reviewed  | —           | Arch review pending     |
| yes               | arch-reviewed| —           | Plan pending (UX skipped)|
| yes               | reviewed     | —           | Plan pending            |
| yes               | finalized    | missing/—   | Execute not started     |
| yes               | finalized    | active      | Execute in progress     |
| yes               | finalized    | completed   | Sprint complete         |

## Step 3 — Display the pipeline

Print the tier-appropriate pipeline. Use the tier from the pre-flight report.
Mark phases:
- `[done]` — completed (confirmed from status fields)
- `[active]` — current position (mark with `▶`)
- `[ ]` — not yet started
- `[skip]` — explicitly skipped this sprint (show only when user has skipped it)

### Tier 1 — Full pipeline

For sprints with new features, data model changes, new routes, or new Calma patterns.

```
Sprint N pipeline  (Tier 1 — Full)
──────────────────────────────────────────────────────
  1. Pre-flight       [done]    /sprint-pre-flight
  2. Brief            [done]    /sprint-brief
  3. UX review        [done]    /sprint-ux          (optional)
  4. Arch review      [done]    /sprint-arch
  5. Plan             [done]    /sprint-plan
▶ 6. Execute          [active]  /sprint-kickoff     (each session)
  7. Post-code        [ ]       /sprint-post-code
  8. Manual check     [ ]       (developer — validate in browser)
  9. Calma sync       [ ]       /calma-sync
 10. Deploy           [ ]       /deploy
 11. Retrospective    [ ]       /sprint-retro
──────────────────────────────────────────────────────
```

### Tier 2 — Arch-only pipeline

For bug fixes, a11y corrections, audit-driven polish, and tooling changes.

```
Sprint N pipeline  (Tier 2 — Arch-only)
──────────────────────────────────────────────────────
  1. Pre-flight       [done]    /sprint-pre-flight
  2. Brief            [done]    (written directly)
  3. Arch review      [done]    /sprint-arch
  4. Plan             [done]    /sprint-plan
▶ 5. Execute          [active]  /sprint-kickoff     (each session)
  6. Post-code        [ ]       /sprint-post-code
  7. Manual check     [ ]       (developer — validate in browser)
  8. Calma sync       [ ]       /calma-sync
  9. Deploy           [ ]       /deploy
 10. Retrospective    [ ]       /sprint-retro
──────────────────────────────────────────────────────
```

### Tier 3 — No-review pipeline

For docs, copy, CHANGELOG, skills, or tooling with no app code impact.

```
Sprint N pipeline  (Tier 3 — No review)
──────────────────────────────────────────────────────
  1. Pre-flight       [done]    /sprint-pre-flight
  2. Plan             [done]    /sprint-plan        (or skip — commit directly)
▶ 3. Execute          [active]  (edit → lint + test + build)
  4. Deploy           [ ]       /deploy
  5. Retrospective    [ ]       /sprint-retro       (optional)
──────────────────────────────────────────────────────
```

## Step 4 — Checkpoint

After displaying the pipeline, print the checkpoint prompt for the current position.

### Execute phase (Tier 1 / 2)

```
Execute phase — work through the tasks in docs/sprints/sprint-NN.md in order.
Start each new coding session with /sprint-kickoff to orient.

Run this pipeline again when you're ready to move to Post-code.
```

Do not attempt to run tasks on the user's behalf — execution is always developer-driven.

### Execute phase (Tier 3)

```
Execute phase — edit the relevant files, then run:
  npm run lint && npm test && npm run build

Run this pipeline again when you're ready to Deploy.
```

### All other phases

Offer to run the next skill:

```
Next: /sprint-ux (UX review) — or type `skip` to skip for this sprint.
```

Wait for user input. Do not invoke the next skill without approval.

Accepted inputs:
- `yes` / `y` / `run` — invoke the next skill
- `skip` — skip the current optional phase (mark `[skip]`); advance to next
- `status` — re-display pipeline without advancing
- `done` — exit; user will resume manually

### Optional phases (skip without warning)

- **Tier 1:** UX review (phase 3), Arch review (phase 4)
- **Tier 3:** Plan (phase 2), Retrospective (phase 5)

### Required phases (warn on skip attempt)

- **All tiers:** Pre-flight (phase 1), Deploy
- **Tier 1 & 2:** Post-code (phase 7/6)
- **Tier 1 & 2:** Retrospective (final phase)

### Post-code phases (Tier 1 & 2)

After Execute, post-code runs as a unit. Mention the option to run sub-skills
individually if the user prefers:

```
Next: /sprint-post-code (runs arch-review → validate + QA in one command)
      — or run /sprint-arch-review, /sprint-validate, /sprint-qa individually.
```

### Sprint complete

When brief status is `finalized` and doc status is `completed`:

```
Sprint N is complete.
All phases done. Start the next sprint with /sprint-pre-flight.
```

## Resuming

State is read from the pre-flight report and the brief/doc Status fields on every
invocation — resuming mid-pipeline is automatic. Run `/sprint-pipeline` again and
it picks up where it left off.
