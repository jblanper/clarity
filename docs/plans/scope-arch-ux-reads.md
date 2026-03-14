# Plan: Scope sprint-arch and sprint-ux reads for non-UI sprints

## Context

Both `sprint-arch` and `sprint-ux` unconditionally read `CLAUDE.md` and
`docs/calma-design-language.md` in their Setup phase. On Tier 2/3 sprints
whose scope touches only `lib/`, `docs/`, `.claude/`, tests, or config — no
UI files at all — pulling in the full Calma spec (~large) and the full
CLAUDE.md is wasted tokens. The retro report (Recommended Action 4) asks for
a conditional read: skip both files when the brief's scope confirms no UI
changes.

## Approach

Add a single conditional gate in the Setup section of each skill. The model
reads the brief first, scans the scope for UI-touching paths
(`components/`, `app/`, `globals.css`), then decides whether to load Calma
and CLAUDE.md.

### Heuristic for "no UI changes"

The brief's scope tasks list file paths. If **none** of them touch:
- `components/`
- `app/`
- `globals.css`
- `docs/calma-design-language.md` (design-language edits are themselves UI work)

…then the sprint is non-UI and the heavy reads can be skipped.

## Changes

### 1. `.claude/skills/sprint-arch/SKILL.md` — Setup step 2

Replace the unconditional read list with a conditioned version:

```
2. Read in full (do not summarise aloud):
   - The brief file (including any UX review already appended)
   - `CLAUDE.md` — always read; contains data model, nav architecture, and
     coding standards relevant to all sprints
   - `docs/calma-design-language.md` — **only if** the brief's scope includes
     any files under `components/`, `app/`, or `globals.css`, or any
     UI-facing behaviour changes. Skip entirely for sprints whose scope is
     limited to `lib/`, `docs/`, `.claude/`, tests, or configuration files.
   - All files in `components/`, `lib/`, `types/`, and `app/` relevant to
     the proposed scope
   - `docs/audit-arch.md` if it exists
```

Rationale: CLAUDE.md stays unconditional for arch — it contains data model
rules, nav constraints, and coding standards that are arch-relevant even in
non-UI sprints. Calma is UI-only, so it gets the conditional.

### 2. `.claude/skills/sprint-ux/SKILL.md` — Setup step 2

Replace the unconditional read list with a conditioned version:

```
2. Read in full (do not summarise aloud):
   - The brief file
   - `CLAUDE.md` — **only if** the brief's scope includes any files under
     `components/`, `app/`, or `globals.css`. Skip for sprints limited to
     `lib/`, `docs/`, `.claude/`, tests, or configuration.
   - `docs/calma-design-language.md` — same condition as CLAUDE.md above
   - Any components in `components/` relevant to the proposed scope
   - Any existing audit files in `docs/`

   If neither CLAUDE.md nor calma-design-language.md are loaded (non-UI
   sprint), note this in your role announcement: "This sprint has no UI scope
   — skipping Calma and CLAUDE.md reads. UX analysis will focus on flow and
   structural concerns only."
```

Rationale: For UX, both CLAUDE.md and Calma are UI-centric. On a non-UI
sprint there is little for the UX role to analyse — the conditional read
signals this explicitly.

## Files to modify

- `.claude/skills/sprint-arch/SKILL.md` (Setup step 2, lines ~20–28)
- `.claude/skills/sprint-ux/SKILL.md` (Setup step 2, lines ~20–28)

## Verification

1. Create a minimal non-UI sprint brief (e.g. a `lib/` test coverage task).
2. Run `/sprint-arch` — confirm Calma is not mentioned in the read list;
   confirm CLAUDE.md is still read.
3. Run `/sprint-ux` — confirm both CLAUDE.md and Calma are skipped; confirm
   the role announcement notes the non-UI scope.
4. Create a UI sprint brief (e.g. a component change). Run both skills —
   confirm both files are read as before.

No tests to run (skill files are markdown instructions, not code).
No lint/build step required.
