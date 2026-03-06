# Claude Code Optimization Report: Clarity

**Date:** 2026-03-05 14:56
**Status:** 🔴 Critical Bloat
**Total Token Impact:** ~20,262 tokens (High)

## Executive Summary
The Clarity workspace is suffering from severe "Context Tax" due to 21 verbose skill definitions and a redundant implementation mapping in `CLAUDE.md`. While the architectural relationships are sound, the lack of YAML metadata and the use of prose for deterministic logic create significant token waste and increase the risk of hallucination.

## Skill Audit
| Skill Group | Count | Issue | Token Impact | Recommendation |
|---|---|---|---|---|
| **Audits** | 7 | Missing Frontmatter | High | Add metadata; extract triage logic to a script. |
| **Sprints** | 10 | Verbose Checklists | High | Standardize validation logic into a shared utility. |
| **General** | 4 | Conversational Filler | Medium | Prune "please" and filler phrases from instructions. |

### Detailed Pruning Recommendations
| Skill / File | Token Count | Primary Issue | Recommendation |
|---|---|---|---|
| `audit-triage` | 1256 | Deterministic Table Logic | Move consolidation logic to a Node.js script. |
| `sprint-arch-review` | 1149 | Process Overlap | Merge with `sprint-validate` to reduce redundant reads. |
| `sprint-qa` | 1148 | Manual Checklist Prose | Replace with a scripted template generator. |

### Specific Findings:
- 100% of skills are missing YAML frontmatter, leading to inconsistent parsing.
- `audit-microcopy` and `sprint-qa` contain token-wasting conversational fillers.
- `sprint-validate` has an architectural depth of 3, referencing 11 other skills, creating a context bottleneck.

## Semantic & Architectural Audit

### Skill Dependencies & Flow
| Entry Point | Calls Skills | Depth | Architectural Role |
|---|---|---|---|
| `audit-all` | 6 (audits) | 2 | Orchestrator for Full Audit Suite |
| `sprint-brief` | 3 (reviewers) | 2 | Workflow Initiator for Planning |
| `sprint-validate` | 11 (mixed) | 3 | High-complexity Integration Validator |

### Redundancy & Logic Leaks
| Pattern / Logic Chunk | Found In | Recommendation |
|---|---|---|
| Dependency Detection | `sprint-plan`, `sprint-kickoff` | Centralize in `scripts/get_task_deps.cjs`. |
| Audit Consolidation | `audit-all`, `audit-triage` | Move to a single processing script. |

### Dead Skills & Pruning Candidates
- **Potential Orphans:** None (all are reachable).
- **Candidates for Merging:** `audit-design-overall` + `sprint-ux` (High semantic overlap).

## Scripting Recommendations
- **Priority High:** `scripts/audit_processor.cjs` to handle background agent results and triage.
- **Priority Medium:** `scripts/sprint_manager.cjs` to automate status updates and task dependencies.
- **Priority Low:** `scripts/lint_reporter.cjs` to standardize the "Phase 1" output across all validation skills.

## Hook Strategy
- **SessionStart:** Branch detection is good. Suggest adding a `package-lock.json` sync check to alert on dependency drift.
- **Stop:** `tsc` check is highly effective for catching late-session regressions.

## Memory Refinement (`CLAUDE.md`)
- **Action:** Delete the entire "Audits & Reports" and "Sprint workflow" tables (≈1,200 tokens). Claude discovers these via the skill system; providing them as prose in `CLAUDE.md` is redundant "Context Tax."

## Efficiency Metrics
- **Current State:** ~20,262 tokens/turn.
- **Target State:** ~8,105 tokens/turn.
- **Projected Savings:** 60% reduction in context window usage.
