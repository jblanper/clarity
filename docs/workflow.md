# Clarity — Workflow Reference

## Audits & Reports

Use the dedicated audit skills rather than writing audits from scratch.
Severity levels across all audit files: **critical** · **high** · **medium** · **low**

Each audit skill archives its previous output to `docs/audits/archive/` before writing, and stamps a `Generated: YYYY-MM-DD HH:MM` timestamp in every report.

| Skill | What it audits | Output |
|---|---|---|
| `/audit-colour` | WCAG contrast, stone palette, dark mode completeness | `docs/audits/audit-colour.md` |
| `/audit-typography` | Type scale, section label pattern, spacing rhythm | `docs/audits/audit-typography.md` |
| `/audit-interaction` | Motion library usage, transitions, reduced motion | `docs/audits/audit-interaction.md` |
| `/audit-microcopy` | Tone, technical language, error messages, copy | `docs/audits/audit-microcopy.md` |
| `/audit-design-overall` | Holistic coherence review across all pages | `docs/audits/audit-design-overall.md` |
| `/audit-triage` | Consolidates all five reports into a severity-ordered action list | `docs/audits/audit-action-list.md` |
| `/audit-arch` | CLAUDE.md compliance, TypeScript strictness, test coverage, component structure, static export constraints | `docs/audits/audit-arch.md` |
| `/audit-all` | Runs five audits (four design + arch) in parallel, then design-overall, then triage. Archives all previous reports before starting; injects a timestamp into every output. | All of the above |

## Sprint Workflow

Sprint documents live in `docs/sprints/`. Each sprint produces two files:
a brief (`sprint-NN-brief.md`) that evolves through planning, and a final
doc (`sprint-NN.md`) that drives execution.

**Rules:** Sprint brief and documents are owned by the Product Owner role.
One release per sprint if possible.

**Before starting any sprint:** run `/sprint-brief` — it reads the last retro,
retro reports, and audit action list; surfaces any blockers; then opens the PO
discussion. To decide tier manually, consult `docs/sprint-tier-guide.md` or run
`bash scripts/sprint-tier.sh`.

### Planning

| Skill | Role | When to use |
|---|---|---|
| `/sprint-brief` | Product Owner | Start here — reads last retro, retro reports, and audit action list; surfaces blockers (soft raise — you decide to address or defer); back-and-forth discussion, produces the brief |
| `/sprint-ux` | UX/UI Designer | Reviews brief with you; flags which audits to run at validation |
| `/sprint-arch` | Senior Architect | Reviews brief with you, technical feasibility and risks |
| `/sprint-review` | PO mediator | Runs UX + Arch in parallel, you mediate conflicts |
| `/sprint-plan` | Product Owner | Produces the final executable sprint doc |

### Execution

| Skill | When to use |
|---|---|
| `/sprint-kickoff` | Start of any coding session mid-sprint — git status, tasks done/pending, what to work on next |
| `/sprint-post-code` | After coding (Tier 1 or 2) — arch-review gate + validate + QA in one command |
| `/sprint-arch-review` | After coding — lint + tests + code review against CLAUDE.md; archives pre-sprint arch audit, runs a fresh one, reports before/after comparison; proposes CLAUDE.md updates if new patterns were established |
| `/sprint-validate` | After coding — archives pre-sprint audits, runs fresh audits in parallel (one agent per audit), reports regressions. Runs: colour, typography, interaction, microcopy. Never runs audit-arch (that's `/sprint-arch-review`), design-overall, or triage. Override via "Audits to run" list in the sprint doc (added by `/sprint-ux`). |
| `/sprint-qa` | After coding — runs Playwright regression suite, writes new tests, manual checklist |

### Closure

| Skill | When to use |
|---|---|
| `/calma-sync` | After validation — review whether Calma spec needs updating |
| `/deploy` | After you manually validate — full release pipeline: lint → tests → build → version bump (patch / minor / major) → changelog → commit + tag → GitHub release |
| `/sprint-retro` | After release — retrospective appended to sprint doc; sets sprint status to `completed`; prompts `/update-claude-md` |

### Anytime

| Skill | When to use |
|---|---|
| `/ux-radical-evaluation` | Conversational UX/UI evaluation by a senior designer persona. Uses Playwright to capture live screenshots of the deployed app, then produces a structured sprint-ready report with HTML mockups. Each report is saved as a datetime-stamped file in `docs/ux-radical-evaluation/` — never overwrites previous evaluations. Use before a UX-heavy sprint, after new features land, or whenever you want an honest outside-eye design critique. |
| `/clarity-feature-explorer` | Strategic design partner for exploring, proposing, and refining new features. Grounds every proposal in the Calma design language and the calm/solarpunk/analog research corpus. Runs as a structured conversation (brainstorm or refine mode), produces a timestamped feature report in `docs/clarity-feature-explorer/`, and optionally generates standalone HTML mockups. Use before a feature-heavy sprint or when ideating new directions for the app. |
| `/retro-report` | Analyse all past retrospectives, produce process recommendations. Archives previous report to `docs/retros/archive/`, writes fixed filename `docs/retros/retro-report.md`. |
| `/project-health` | Between sprints — security audit, outdated deps, test suite health, docs integrity |
| `/update-claude-md` | End of session — review conversation and codebase, update CLAUDE.md with corrections, new patterns, gotchas, and stale rules |

### Full execution order

#### Tier 1 — Full pipeline
New features, data model changes, new routes, new Calma patterns.

```
PLANNING:   /sprint-brief → /sprint-review → /sprint-plan
                                or
            /sprint-brief → /sprint-ux + /sprint-arch → /sprint-plan

EXECUTION:  /sprint-kickoff → [code] → /sprint-post-code → [you validate]
            (or run /sprint-arch-review → /sprint-validate → /sprint-qa individually)

CLOSURE:    /calma-sync → /deploy → /sprint-retro
```

#### Tier 2 — Arch-only
Bug fixes, a11y corrections, audit-driven polish, tooling changes.

```
PLANNING:   [write sprint-NN-brief.md directly] → /sprint-arch → /sprint-plan

EXECUTION:  /sprint-kickoff → [code] → /sprint-post-code → [you validate]
            (or run /sprint-arch-review → [targeted audits] → /sprint-qa individually)

CLOSURE:    /calma-sync → /deploy → /sprint-retro
```

#### Tier 3 — No review
Docs, copy, CHANGELOG, README, skill/tooling with no app code impact.

```
PLANNING:   /sprint-plan   (or skip entirely and commit directly)

EXECUTION:  [edit] → npm run lint && npm test && npm run build

CLOSURE:    /deploy → /sprint-retro   (retro optional for very small changes)
```
