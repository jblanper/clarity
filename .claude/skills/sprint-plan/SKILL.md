---
name: sprint-plan
description: Synthesise the reviewed sprint brief into an executable sprint document with ordered tasks and definitions of done. Outputs docs/sprints/sprint-NN.md.
disable-model-invocation: true
allowed-tools: Read, Glob, Write, Edit
---

# Sprint Plan — Produce Final Sprint Document

You are the Product Owner. The brief has been reviewed. Your job is to
synthesise everything into a clear, executable sprint document.

## Setup

1. Find the current sprint brief:
   - List `docs/sprints/sprint-[0-9][0-9]-brief.md`, sort, take the latest
   - Read it in full
   - Check its **Status** field. If it is still `draft`, `ux-reviewed`, or
     `arch-reviewed` (not `reviewed`), print:
     > "⚠ Brief status is [X] — not all reviews are complete. Proceeding will
     > skip the missing review and may produce an incomplete sprint doc. Type
     > `proceed` to continue anyway, or run the missing review first."
     > Wait for user input. Only continue if the user types `proceed`.

2. Also read:
   - `CLAUDE.md`
   - `docs/calma-design-language.md`
   - The most recent completed sprint doc — header block and first task only (for format
     reference; read lines 1–60 or stop after the first task's "Definition of done" line)

## Writing the sprint document

Produce `docs/sprints/sprint-NN.md` using the structure in `template.md`
in this skill's directory.

### Before writing implementation notes — verify "already correct" claims

If the brief or any review states that a file, component, or line is
"already correct", "does not need changing", or "can be used as a reference",
**read the relevant lines before writing that into the sprint doc.**

Do not carry an unverified claim into implementation notes. A wrong
"already correct" claim produces a deferred finding that survives into the
next sprint. Take 30 seconds to read the file and confirm.

## Task ordering

Order tasks by risk and dependency:
1. Data model changes first (highest risk, everything else depends on them)
2. Shared component changes next
3. Page-specific changes
4. Copy / microcopy last (independent, safe to batch)

If any task depends on another, state this explicitly at the top of the dependent task.

## Task spec enrichment

Apply these two enrichments automatically when the conditions are met. Do not
wait for QA to surface these issues.

### Interaction contract (when a task introduces a new interactive state)

If a task introduces any new interactive state — an inline edit form, a reveal
card, a tray, a chip toggle, a disclosure section, or any `AnimatePresence`-
governed slot — add an **Interaction contract** block immediately after
`Implementation notes`:

```
**Interaction contract**
- Open state: [what is visible, what is hidden, layout impact]
- Closed state: [what is visible, what is hidden]
- Mutual exclusion: [which other open states this closes, and how — via `closeAllEditors()` or equivalent]
- Animation: [enter/exit strategy; if height reveal, note shell/padding split]
```

This makes all state transitions explicit before implementation begins. It is
the primary guard against post-QA rework on underspecified interactions
(Sprint 12, Sprint 13 pattern).

### Animation checklist (when a task involves height reveals)

If a task involves a `height: 0 → auto` animation — any reveal, collapse,
or animated height change — add the following to the task's `Validation steps`:

```
- [ ] Animated wrapper (`m.div`) carries border/bg only — no `px-*`/`py-*` padding (INLINE_FORM_SHELL pattern)
- [ ] All padding lives on a plain inner `div` that Framer Motion never measures
- [ ] Exit animation includes `paddingTop: 0, paddingBottom: 0, marginBottom: 0` alongside `height: 0`
- [ ] If two states share a single UI slot, `AnimatePresence` uses `mode="wait"` with distinct `key` props
```

Also add to `Implementation notes`: "Height reveal — use the `INLINE_FORM_SHELL`
pattern (see `CLAUDE.md` → Animations → 'Height animation jump (enter)')."

## After writing

Update the brief file's **Status** to `finalized`.

Tell the user:
> "Sprint N document written at docs/sprints/sprint-NN.md. The brief is
> archived at docs/sprints/sprint-NN-brief.md for reference.
>
> When you're ready to start: work through the tasks in order, validate each
> one, then run `/deploy` when the sprint definition of done is met."
