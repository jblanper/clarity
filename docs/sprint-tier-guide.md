# Sprint Tier Guide

The Product Owner uses this guide before starting any sprint to decide how much
planning overhead the sprint needs. Answer the questions in order — the first
"Yes" wins and determines the tier.

---

## Decision tree

**Q1 — Does it change the data model?**
(`HabitEntry`, `HabitState`, `AppConfigs`, localStorage keys, export format)
> Yes → **Tier 1**

**Q2 — Does it add new routes, navigation patterns, or new pages?**
> Yes → **Tier 1**

**Q3 — Does it introduce a new user-facing feature?**
(Something that didn't exist before — not improving or fixing existing behaviour)
> Yes → **Tier 1**

**Q4 — Does it introduce a pattern not currently in the Calma spec?**
(New visual pattern, new component type, new colour role, new motion behaviour)
> Yes → **Tier 1**

**Q5 — Does it carry architectural risk or CLAUDE.md compliance questions?**
(Accessibility corrections, touch targets, animation polish, tooling, static export risk)
> Yes → **Tier 2**

**Q6 — Is it purely docs, copy, or tooling with no app code changes?**
> Yes → **Tier 3**

**Default → Tier 2**
(When in doubt, arch review is cheap insurance.)

---

## Tier definitions

### Tier 1 — Full pipeline

**When:** New features, data model changes, new navigation, new Calma patterns.

**Skills to run:**
```
/sprint-brief → /sprint-review → /sprint-plan
      or
/sprint-brief → /sprint-ux + /sprint-arch → /sprint-plan
```

`/sprint-brief` runs in full discussion mode — back-and-forth with the PO
to shape scope before anything is written down.

---

### Tier 2 — Arch-only

**When:** Bug fixes, accessibility corrections, audit-driven polish, animation
tweaks, tooling changes. Scope is already clear from audit reports or a
backlog; no new UX decisions needed.

**Skills to run:**
```
[write brief directly] → /sprint-arch → /sprint-plan
```

**How to write the brief for Tier 2:**
Skip `/sprint-brief` — the scope is already known from the audit plan or backlog.
Write `docs/sprints/sprint-NN-brief.md` directly using the template at
`.claude/skills/sprint-brief/template.md`. Keep it short: Goals, Proposed scope
(the finding list), Out of scope, Open questions. No discovery discussion needed.

---

### Tier 3 — No review

**When:** Docs-only, copy changes, CHANGELOG updates, README edits, skill/tooling
changes with no app code impact.

**Skills to run:**
```
/sprint-plan (directly, or skip entirely and commit)
```

No brief, no review. If it's a single commit, just commit it.

---

## Quick reference

| Trigger | Tier | Pipeline |
|---|---|---|
| Data model change | 1 | Full |
| New route / page | 1 | Full |
| New user feature | 1 | Full |
| New Calma pattern | 1 | Full |
| Bug fix / a11y / polish | 2 | Arch-only |
| Tooling / animation | 2 | Arch-only |
| Docs / copy / chore | 3 | None |

---

## Notes for the PO

- When scope comes from the audit implementation plan, check each finding's
  severity tier: clearing all HIGH findings in one sprint is a Tier 2 sprint
  (use Tier 2 even if there are many items — they're pre-classified by the
  audit, not novel decisions).
- A sprint that mixes Tier 1 and Tier 2 work is a Tier 1 sprint.
- The tier guide lives in `docs/` so it can be updated as the project evolves.
  If a question feels wrong after a sprint, update it — don't wait.
