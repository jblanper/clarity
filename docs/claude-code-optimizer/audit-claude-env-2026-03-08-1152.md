# Claude Code Optimization Report: Clarity

**Date:** 2026-03-08 11:52
**Status:** Healthy (Prev: baseline)

---

## Executive Summary

The Clarity Claude environment is well-architected: all 26 skills use `disable-model-invocation: true`, keeping the always-loaded context tax at 3,376 tokens (CLAUDE.md + MEMORY.md only). The primary findings are: (1) MEMORY.md contains meaningful duplication with CLAUDE.md that adds noise without value, (2) the CLAUDE.md component-notes section has grown dense and could benefit from progressive disclosure, and (3) the `SessionStart` hook injects unconditional git context on every session regardless of whether sprint work is in progress.

---

## Always-Loaded Context Audit

These files are injected into every session regardless of what the user is working on. This is the true per-session context tax.

**Always-Loaded Context Tax:** ~3,376 tokens/session

| File | Tokens | Notes |
|---|---|---|
| `CLAUDE.md` | 3,078 | Earned context is high-quality; component-notes section is dense but justified. At 150 lines, approaching the 200-line guidance threshold. |
| `MEMORY.md` | 298 | Contains duplication with CLAUDE.md (see below). 35 lines — well within budget. |
| Non-disabled skill descriptions | 0 | All 26 skills correctly set `disable-model-invocation: true`. No skill descriptions in always-loaded context. |
| `SessionStart` hook output | ~20 (estimate) | Branch name + short git status. Minimal and structured. Unconditional — see Hook Strategy. |

**Deferred context (not loaded unless invoked):** ~968 tokens across 26 skills with `disable-model-invocation: true`.

### CLAUDE.md Refinement

CLAUDE.md is at 150 lines — within the 200-line limit but approaching density where adherence degrades. Sections are all earned; no general programming advice or resolved workarounds identified. Two observations:

1. **Component-specific notes section** (lines 131–142, 12 bullet points) is the densest section. These are all valid gotchas (scroll lock, exit animation snap, FrequencyList scroll position restore). They are earned. However, they would be better candidates for a `.claude/rules/components.md` path-scoped rule file loaded on demand when Claude works in `components/`. This would save ~350 tokens per session that does not touch components (e.g., docs-only sprints, skill updates).

2. **"Never do these things" section** — all six rules are critical constraints and must stay. No change recommended.

3. **Tailwind implementation tokens** — the six-class section label definition with the `font-medium` warning is a recurrent failure mode; its presence is earned.

4. **Navigation Architecture** — the table and three bullet points are earned. No change.

No sections flagged for pruning. One candidate for migration to a path-scoped rule file.

### MEMORY.md Refinement

MEMORY.md has three sections: Project Overview, Structure, Workflow, Coding Standards, and Color Palette. All are present in CLAUDE.md in more authoritative form:

| MEMORY.md Entry | CLAUDE.md Counterpart | Action |
|---|---|---|
| Project Overview (framework, styling, font) | CLAUDE.md "What is Clarity?" + "Project Stack" | Redundant — prune from MEMORY.md |
| Structure (app/, components/, lib/, types/) | CLAUDE.md "Project Structure" (with richer detail) | Redundant — prune from MEMORY.md |
| Workflow (`npm run lint && npm test && npm run build 2>&1`) | CLAUDE.md "Git & Development" (same rule, same command) | Redundant — prune from MEMORY.md |
| Coding Standards | CLAUDE.md "Coding Standards" (matches exactly) | Redundant — prune from MEMORY.md |
| Color Palette (CSS vars) | Not in CLAUDE.md (this is supplementary) | Keep — this is a genuine learning, not in CLAUDE.md |

MEMORY.md is almost entirely a lower-fidelity copy of CLAUDE.md. Pruning the four redundant sections would reduce MEMORY.md to the Color Palette entry (~5 lines), saving ~260 tokens per session with no information loss. The project overview, structure map, workflow command, and coding standards are all more completely specified in CLAUDE.md and should not be duplicated in MEMORY.md.

---

## Skill Audit

**Total skills:** 26 (26 project, 0 global)

| Prefix Group | Count | Primary Issue | Recommendation |
|---|---|---|---|
| audit | 8 | None — all clean | No action |
| sprint | 12 | None — all clean | No action |
| calma | 1 | None | No action |
| claude-code-optimizer | 1 | None | No action |
| deploy | 1 | None | No action |
| project-health | 1 | None | No action |
| retro-report | 1 | None | No action |
| update-claude-md | 1 | None | No action |

### Detailed Findings

| Skill | Issue | Severity | Recommendation |
|---|---|---|---|
| `audit-microcopy` | Contains conversational filler: "please" | info | Minor — remove "please" from instruction prose for consistency with direct imperative style |
| `sprint-qa` | Contains conversational filler: "please" | info | Minor — same as above |
| `sprint-post-code` | Reads sprint-arch-review SKILL.md in Phase 1, not in Setup parallel batch | info | Add sprint-arch-review to Setup parallel reads (see workflow-skill-evaluation-2026-03-08-1130 §4.4) |
| `sprint-validate` | Audits run sequentially by explicit instruction | info | Consider parallel audit execution for ~4x speed improvement (see workflow-skill-evaluation §4.3) |
| `sprint-retro` | No `context: fork` despite 4-question interactive workflow | info | Low isolation risk because the interactive nature requires main-session context; acceptable |
| `sprint-plan` | Warns on unreviewed brief but does not hard-stop | info | Consider changing to a hard stop requiring explicit "y" to proceed (see workflow-skill-evaluation §3.7) |

No errors. No warnings. 6 infos — none blocking.

---

## Semantic & Architectural Audit

### Skill Dependencies

| Entry Point | Direct Calls | Max Depth | Role |
|---|---|---|---|
| `sprint-pre-flight` | 17 skills referenced | 11 | Meta-orchestrator — reads whole workflow |
| `sprint-post-code` | calma-sync, deploy, sprint-arch, sprint-arch-review, sprint-plan, sprint-qa, sprint-validate | 10 | Sprint closure orchestrator |
| `sprint-kickoff` | sprint-plan | 3 | Session-start standup |
| `project-health` | sprint-qa | 3 | Periodic housekeeping |
| `claude-code-optimizer` | (self-contained) | 1 | Meta-audit |
| `update-claude-md` | (self-contained) | 1 | CLAUDE.md maintenance |
| `audit-all` | 7 audit skills | 4 | Audit orchestrator |

### Redundancy & Logic Leaks

| Duplicated Logic | Found In | Recommendation |
|---|---|---|
| Sprint doc discovery pattern (`glob docs/sprints/sprint-[0-9][0-9].md, sort, take latest with status active`) | sprint-kickoff, sprint-post-code, sprint-validate, sprint-arch-review, sprint-retro, sprint-pre-flight | Extract to a shared script `scripts/find_active_sprint.js` — Low-Entropy, fully deterministic |
| `npm run lint && npm test` invocation | sprint-arch-review Phase 1, deploy, project-health Phase 3 | Consider a git pre-commit hook (see workflow-skill-evaluation §5.5); already partly addressed by Stop hook |
| Archive pattern (`read docs/audits/audit-X.md → write to docs/audits/archive/audit-X-YYYY-MM-DD.md`) | sprint-validate Phase 1, sprint-arch-review | Extract to a script `scripts/archive_audit.js` — Low-Entropy |
| Base-commit detection (`git log` to find the pre-sprint commit) | sprint-arch-review, calma-sync (undocumented in calma-sync) | Shared script or explicit cross-reference in calma-sync (see workflow-skill-evaluation §3.6) |

### Isolation Gaps

Skills that run long workflows but lack `context: fork`:

1. **`sprint-post-code`** — Depth 10, spawns two background agents (sprint-validate, sprint-qa) plus runs sprint-arch-review inline. The interactive arch-review phase (Phase 1) intentionally runs in-session for user interaction. This is a valid design choice — `context: fork` would break the interactive gate. No change recommended; the design is deliberate.

2. **`sprint-pre-flight`** — Depth 11 (highest in the graph), but its instructions are read-only (no writes) and conversational output only. Low isolation risk despite high depth. No change recommended.

3. **`sprint-review`** — Spawns sprint-ux and sprint-arch as background agents in "analysis-only" mode, but those SKILL.md files contain discussion phases that background agents cannot complete. This is an existing known issue (workflow-skill-evaluation §3.5). The isolation gap here is semantic, not context-fork related.

4. **`retro-report`** — Reads every sprint doc ever written; unbounded growth. No `context: fork`. Consider adding `context: fork` as this skill's context grows over time with the project.

---

## Scripting Recommendations

For each item: verified against the Semantic Guardrail (Low-Entropy only).

| Priority | Workflow Step Currently in LLM Instructions | Proposed Script | Rationale |
|---|---|---|---|
| High | Active sprint discovery: `glob docs/sprints/sprint-[0-9][0-9].md`, sort, read each to find `status: active`, return path | `scripts/find_active_sprint.js` | Pure filesystem + text pattern matching. No judgment required. Appears in 6+ skills. Eliminates variance in sprint-finding logic. |
| High | Audit archive: read `docs/audits/audit-X.md`, write to `docs/audits/archive/audit-X-YYYY-MM-DD.md` | `scripts/archive_audit.js` | Deterministic rename + copy operation. No judgment. Appears in sprint-validate and sprint-arch-review. |
| Medium | Sprint status update: set `Status: completed` in sprint doc after retro/deploy | `scripts/set_sprint_status.js` | Mechanical text replacement in a known field. Fully specifiable. Eliminates the "sprint-retro can't find completed sprint" bug (workflow-skill-evaluation §3.2). |
| Medium | Base commit detection: `git log --oneline` to find the commit just before sprint started | `scripts/find_sprint_base_commit.js` | Git log + pattern match against sprint start date. Low-Entropy. Would give calma-sync and sprint-arch-review a consistent algorithm. |
| Low | Token count comparison between audit reports (already scripted as delta_tracker.js) | Already implemented | No action needed. |

**Not recommended for scripting:**
- Tier inference in sprint-pre-flight (Q1–Q6) — requires reading intent from natural language sprint descriptions.
- Audit triage merge logic — "confirmed finding" assessment requires semantic judgment.
- CLAUDE.md update decisions in update-claude-md — entirely High-Entropy.

---

## Hook Strategy

**Covered events:** SessionStart, Stop
**Missing events:** PreToolUse, PostToolUse

| Hook | Event | Conditional? | Issue | Recommendation |
|---|---|---|---|---|
| `git branch --show-current && git status --short` | SessionStart | No | Unconditional — runs even when sprint work is not active (e.g., docs-only sessions, optimizer runs). Output is ~20 tokens/session regardless. | Acceptable cost; output is minimal and structured. No action required unless token budget tightens. |
| `npx tsc --noEmit` | Stop | Yes (only if `.ts`/`.tsx` files changed) | Conditional guard is correct. `head -20` prevents runaway output. | Well-designed. No action required. |
| PreToolUse | — | — | Not covered. No guardrails against destructive Bash commands (e.g., `rm -rf`, `git reset --hard`). | Consider adding a PreToolUse guard for known-dangerous patterns. Low priority given project scope. |
| PostToolUse | — | — | Not covered. No auto-lint on file write. | The Stop hook covers TS checking. Lint-on-save would be redundant given `npm run lint` in the CLAUDE.md commit workflow. No action needed. |

---

## Efficiency Metrics

- **Always-Loaded Context Tax (current):** ~3,376 tokens/session
- **Always-Loaded Context Tax (target):** ~3,116 tokens/session
- **Projected savings:** ~260 tokens (~8%) — achieved by pruning redundant MEMORY.md sections (Project Overview, Structure, Workflow, Coding Standards). Color Palette entry retained.
- **Delta from previous report:** 0 tokens (baseline — first audit)

---

## Follow-up

- **MEMORY.md pruned** (2026-03-08) — Removed redundant Project Overview, Structure, Workflow, and Coding Standards sections. Color Palette dropped entirely (not warranted in always-loaded context). Actual savings: ~260 tokens.
- **Implementation plan for high-priority scripts** → [`scripts-impl-plan-2026-03-08-1211.md`](scripts-impl-plan-2026-03-08-1211.md)
