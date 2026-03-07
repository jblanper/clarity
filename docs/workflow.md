# Clarity — Workflow Reference

## Audits & Reports

Use the dedicated audit skills rather than writing audits from scratch.
Severity levels across all audit files: **critical** · **high** · **medium** · **low**

| Skill | What it audits | Output |
|---|---|---|
| `/audit-colour` | WCAG contrast, stone palette, dark mode completeness | `docs/audits/audit-colour.md` |
| `/audit-typography` | Type scale, section label pattern, spacing rhythm | `docs/audits/audit-typography.md` |
| `/audit-interaction` | Motion library usage, transitions, reduced motion | `docs/audits/audit-interaction.md` |
| `/audit-microcopy` | Tone, technical language, error messages, copy | `docs/audits/audit-microcopy.md` |
| `/audit-design-overall` | Holistic coherence review across all pages | `docs/audits/audit-design-overall.md` |
| `/audit-triage` | Consolidates all five reports into a severity-ordered action list | `docs/audits/audit-action-list.md` |
| `/audit-arch` | CLAUDE.md compliance, TypeScript strictness, test coverage, component structure, static export constraints | `docs/audits/audit-arch.md` |
| `/audit-all` | Runs all five audits in parallel, then design-overall, then triage | All of the above |

## Sprint Workflow

Sprint documents live in `docs/sprints/`. Each sprint produces two files:
a brief (`sprint-NN-brief.md`) that evolves through planning, and a final
doc (`sprint-NN.md`) that drives execution.

**Rules:** Sprint brief and documents are owned by the Product Owner role.
One release per sprint if possible.

**Before starting any sprint:** check `docs/sprint-tier-guide.md` to decide which planning skills to run. Not every sprint needs the full pipeline. For a guided walkthrough, run `bash scripts/sprint-tier.sh` — it asks the same questions and prints the exact skills to run.

### Planning

| Skill | Role | When to use |
|---|---|---|
| `/sprint-brief` | Product Owner | Start here — back-and-forth discussion, produces the brief |
| `/sprint-ux` | UX/UI Designer | Reviews brief with you; flags which audits to run at validation |
| `/sprint-arch` | Senior Architect | Reviews brief with you, technical feasibility and risks |
| `/sprint-review` | PO mediator | Runs UX + Arch in parallel, you mediate conflicts |
| `/sprint-plan` | Product Owner | Produces the final executable sprint doc |

### Execution

| Skill | When to use |
|---|---|
| `/sprint-kickoff` | Start of any coding session mid-sprint — git status, tasks done/pending, what to work on next |
| `/sprint-post-code` | After coding (Tier 1 or 2) — arch-review gate + validate + QA in one command |
| `/sprint-arch-review` | After coding — lint + tests + code review against CLAUDE.md |
| `/sprint-validate` | After coding — archives pre-sprint audits, runs fresh audits, reports regressions. Runs: colour, typography, interaction, microcopy (sequentially). Never runs design-overall or triage. Override via "Audits to run" list in the sprint doc (added by `/sprint-ux`). |
| `/sprint-qa` | After coding — runs Playwright regression suite, writes new tests, manual checklist |

### Closure

| Skill | When to use |
|---|---|
| `/calma-sync` | After validation — review whether Calma spec needs updating |
| `/deploy` | After you manually validate — full release pipeline: lint → tests → build → version bump (patch / minor / major) → changelog → commit + tag → GitHub release |
| `/sprint-retro` | After release — retrospective appended to sprint doc |

### Anytime

| Skill | When to use |
|---|---|
| `/sprint-pre-flight` | Before any sprint — surfaces blockers, determines tier, recommends exact skills |
| `/retro-report` | Analyse all past retrospectives, produce process recommendations |
| `/project-health` | Between sprints — security audit, outdated deps, test suite health, docs integrity |

### Full execution order

```
PLANNING:   /sprint-pre-flight          ← blockers + tier + exact skills to run
                 ↓
            [planning skills as recommended by pre-flight]

EXECUTION:  /sprint-kickoff → [code] → /sprint-post-code → [you validate]
            (or run /sprint-arch-review, /sprint-validate, /sprint-qa individually)

CLOSURE:    /calma-sync → /deploy → /sprint-retro
```
