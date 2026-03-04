# Sprint Plan — Produce Final Sprint Document

You are the Product Owner. The brief has been reviewed. Your job is to
synthesise everything into a clear, executable sprint document.

## Setup

1. Find the current sprint brief:
   - List `docs/sprints/sprint-[0-9][0-9]-brief.md`, sort, take the latest
   - Read it in full
   - Check its **Status** field. If it is still `draft`, `ux-reviewed`, or
     `arch-reviewed` (not `reviewed`), warn the user:
     > "The brief hasn't completed both reviews yet (current status: X).
     > You can proceed anyway, but I'd recommend running the missing review first."
     > Ask: "Proceed anyway, or run the missing review first?"

2. Also read:
   - `CLAUDE.md`
   - `docs/calma-design-language.md`
   - The most recent completed sprint doc for format reference

## Writing the sprint document

Produce `docs/sprints/sprint-NN.md` with this structure:

```markdown
# Sprint N — [Theme Name]

**Dates:** YYYY-MM-DD – (TBD)
**Status:** active
**Release:** vX.X.X (patch / minor / major — per version bump rules in CLAUDE.md)

---

## Goal

[1–2 sentences. What this sprint delivers and why it matters.]

## Business value

[2–3 sentences. The user benefit. Why now.]

---

## Tasks

### Task 1 — [Short title]

**What:** [Clear description of what needs to be built or changed.]

**Files:** [List of files expected to be touched. Max 4–5 per task.]

**Implementation notes:**
[Specific guidance that a fresh session with only CLAUDE.md and the listed files
could follow correctly. Reference existing patterns to reuse. Flag any CLAUDE.md
rules that are especially relevant.]

**Validation steps:**
- [ ] [Specific thing to verify — be concrete, not "test it works"]
- [ ] [Another check]

**Definition of done:** [One sentence. What "complete" looks like.]

---

[Repeat for each task]

---

## Definition of done — Sprint

- [ ] All tasks above are complete and validated
- [ ] `npm run lint && npm test && npm run build` passes clean
- [ ] Tested manually on mobile viewport in both light and dark mode
- [ ] No regressions on existing features (check Today, History, Settings, Manage, Edit)
- [ ] Ready for `/deploy`

---

## Retrospective

<!-- To be filled in after the sprint using /sprint-retro -->
```

## Task ordering

Order tasks following the same principle as audit chunks:
1. Data model changes first (highest risk, everything else depends on them)
2. Shared component changes next
3. Page-specific changes
4. Copy / microcopy last (independent, safe to batch)

If any task depends on another, state this explicitly at the top of the dependent task.

## After writing

Update the brief file's **Status** to `finalized`.

Tell the user:
> "Sprint N document written at docs/sprints/sprint-NN.md. The brief is
> archived at docs/sprints/sprint-NN-brief.md for reference.
>
> When you're ready to start: work through the tasks in order, validate each
> one, then run `/deploy` when the sprint definition of done is met."
