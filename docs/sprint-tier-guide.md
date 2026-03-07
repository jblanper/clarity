# Sprint Tier Guide

The Product Owner uses this guide before starting any sprint to decide how much
planning overhead the sprint needs. Answer the questions in order — the first
"Yes" wins and determines the tier.

An interactive CLI version of the decision tree is available at
`scripts/sprint-tier.sh` — run it to get the exact skills to run for your
sprint without reading the full guide.

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

**Q5 — No new features, but carries risk?**
(Accessibility corrections, touch targets, animation polish, compliance questions,
static export risk, tooling with app code side-effects)
> Yes → **Tier 2**

**Q6 — No new features, no risk?**
(Purely docs, copy, CHANGELOG, README, skill/tooling changes with zero app code impact)
> Yes → **Tier 3**

**Default → Tier 2**
(When in doubt, arch review is cheap insurance.)

---

## Tier definitions

### Tier 1 — Full pipeline

**When:** New features, data model changes, new navigation, new Calma patterns.

**Planning:**
```
/sprint-brief → /sprint-review → /sprint-plan
      or
/sprint-brief → /sprint-ux + /sprint-arch → /sprint-plan
```

`/sprint-brief` runs in full discussion mode — back-and-forth with the PO
to shape scope before anything is written down.

**Validation after coding:**
```
/sprint-arch-review → /sprint-validate → /sprint-qa → [manual]
```

Run all audits via `/sprint-validate`. If the sprint clearly touches only a
subset of domains you may skip unrelated audits (see **Audit scoping** below),
but when in doubt run all five.

---

### Tier 2 — Arch-only

**When:** Bug fixes, accessibility corrections, audit-driven polish, animation
tweaks, tooling changes. Scope is already clear from audit reports or a
backlog; no new UX decisions needed.

**Planning:**
```
[write brief directly] → /sprint-arch → /sprint-plan
```

**How to write the brief for Tier 2:**
Skip `/sprint-brief` — the scope is already known from the audit plan or backlog.
Write `docs/sprints/sprint-NN-brief.md` directly using the template at
`.claude/skills/sprint-brief/template.md`. Keep it short: Goals, Proposed scope
(the finding list), Out of scope, Open questions. No discovery discussion needed.

**Validation after coding:**
```
/sprint-arch-review → [targeted audits] → /sprint-qa
```

Do not run `/sprint-validate` in full. Run only the audits that match what the
sprint touched (see **Audit scoping** below). If the targeted audits show no new
violations, the `/sprint-qa` manual checklist can be limited to smoke paths for
the changed components — skip unrelated checklist items.

---

### Tier 3 — No review

**When:** Docs-only, copy changes, CHANGELOG updates, README edits, skill/tooling
changes with no app code impact.

**Planning:**
```
/sprint-plan (directly, or skip entirely and commit)
```

No brief, no review. If it's a single commit, just commit it.

**Validation after coding:**
```
npm run lint && npm test && npm run build
```

No audits. No QA skill. If the change is docs-only with zero app code impact,
skip even this.

---

## Audit scoping

For Tier 1, run all audits unless the sprint clearly touches only a subset.
For Tier 2, run only the audits that match what changed — do not run the rest.

| What the sprint touched | Audit to run |
|---|---|
| Colour, contrast, dark mode | `/audit-colour` |
| Typography, section labels, spacing | `/audit-typography` |
| Animation, motion, scroll behaviour | `/audit-interaction` |
| Copy, error messages, UI text | `/audit-microcopy` |
| Components, data model, routes, CLAUDE.md compliance | `/audit-arch` |
| Three or more of the above | add `/audit-design-overall` |
| All five domains | `/audit-all` (parallel — faster than running individually) |

If no audit applies (e.g. tooling-only Tier 2), skip audits and rely on
lint + tests + build alone.

---

## Quick reference

| Trigger | Tier | Planning | Validation |
|---|---|---|---|
| Data model change | 1 | Full pipeline | All audits |
| New route / page | 1 | Full pipeline | All audits |
| New user feature | 1 | Full pipeline | All audits |
| New Calma pattern | 1 | Full pipeline | All audits |
| Bug fix / a11y / polish | 2 | Arch-only | Targeted audits |
| Tooling / animation | 2 | Arch-only | Targeted audits |
| Docs / copy / chore | 3 | None | lint + test + build only |

---

## Notes for the PO

- When scope comes from the audit action list, check each finding's
  severity level: clearing all High findings in one sprint is a Tier 2 sprint
  (use Tier 2 even if there are many items — they're pre-classified by the
  audit, not novel decisions).
- A sprint that mixes Tier 1 and Tier 2 work is a Tier 1 sprint.
- The tier guide lives in `docs/` so it can be updated as the project evolves.
  If a question feels wrong after a sprint, update it — don't wait.
