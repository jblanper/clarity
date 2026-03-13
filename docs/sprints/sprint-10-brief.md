# Sprint 10 Brief

**Status:** finalized
**Created:** 2026-03-13

---

## Goals & Business Value

Clean up the e2e test baseline left over from Sprint 9's control redesign, then invest in the sprint workflow itself. A working pipeline orchestrator and leaner skill reads will reduce friction and token cost for every sprint that follows — making the development process feel as considered as the app itself.

## Proposed scope

- **e2e cleanup** — remove the 3 obsolete Sprint 8 touch-target assertions from `e2e/sprint-08-touch-targets.spec.ts` (they fail by design after the Sprint 9 HabitToggle and NumberStepper redesign); run `npx playwright test` against a live dev server to confirm the full suite passes end-to-end
- **`/sprint-pipeline` skill** — new skill that sequences sprint phases (brief → ux → arch → plan → execute → validate → retro) with human approval checkpoints between each; state derived from sections already present in the sprint doc (no separate state file); supports resuming mid-pipeline
- **Scoped reads** — refactor the execution-phase skills (sprint-ux, sprint-arch, sprint-plan, sprint-validate, sprint-qe/QA) to read only the section(s) each skill needs rather than the full sprint doc
- **Edge cases subsection** — add a "Gotchas / edge cases" field to the task spec template in the sprint plan skill, so data-model edge cases are caught at brief time rather than at arch review

## Out of scope

- App feature work of any kind
- Changes to the Calma design language or CLAUDE.md implementation tokens
- Generalising the workflow into a reusable plugin for other projects (retro idea — defer to a future tooling sprint)

## Open questions

- Which exact sections should each execution-phase skill scope to? (Arch review to answer during sprint planning — should be straightforward for most skills, but the validate skill reads broadly by design.)
- Should `/sprint-pipeline` support skipping optional phases (e.g. skipping UX for a pure tooling sprint), or always run the full sequence?

---

## Audits to run

None.
