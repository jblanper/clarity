<!--
Sprint doc status lifecycle (reference — not part of the output doc):

| Status        | Set by                         |
|---|---|
| draft         | sprint-brief                   |
| ux-reviewed   | sprint-ux                      |
| arch-reviewed | sprint-arch                    |
| reviewed      | sprint-review                  |
| finalized     | sprint-plan (brief file)       |
| active        | sprint-plan (this sprint doc)  |
| completed     | sprint-retro                   |

Transition path: draft → ux-reviewed / arch-reviewed → reviewed → finalized → active → completed
sprint-kickoff finds sprints with status `active`. After sprint-retro sets `completed`,
old sprints are no longer matched.
-->

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
