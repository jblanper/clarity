# Claude Code Optimization Report: Clarity

**Date:** 2026-03-09 14:42
**Status:** 🟡 Needs Pruning (Prev: Healthy (Prev: baseline))
**Total Token Impact:** ~3,740 tokens (Low)
**Delta:** +364 (+10.8% since audit-claude-env-2026-03-08-1152.md)

## Executive Summary
The Clarity environment remains efficient, but the "Always-Loaded Context Tax" has increased by ~10% due to `CLAUDE.md` growth and the addition of a non-disabled skill. The primary driver of the tax is `CLAUDE.md` (~3.6k tokens). One skill, `ux-radical-evaluation`, is missing critical optimization flags, causing its full description to be loaded every session.

## Skill Audit
| Skill Group | Count | Primary Issue | Token Impact | Recommendation |
|---|---|---|---|---|
| **ux** | 1 | Missing `disable-model-invocation: true` | Low | Add the flag and `allowed-tools` constraint to `ux-radical-evaluation`. |
| **audit** | 8 | None | Low | Maintain as is. |
| **sprint** | 12 | None | Low | Maintain as is. |
| **General** | 6 | Minor fillers | Low | Remove "please" from `audit-microcopy` and `sprint-qa`. |

### Detailed Skill Pruning
| Skill / File | Token Count | Primary Issue | Recommendation |
|---|---|---|---|
| `ux-radical-evaluation` | ~1,000 (est) | Missing `disable-model-invocation: true` and `allowed-tools`. | Add `disable-model-invocation: true` and limit tools to `Read, Grep, Glob, Playwright`. |
| `audit-microcopy` | 39 | Conversational filler ("please"). | Remove fillers to improve instruction clarity. |
| `sprint-qa` | 37 | Conversational filler ("please"). | Remove fillers to improve instruction clarity. |

## Semantic & Architectural Audit

### Skill Dependencies & Flow
| Entry Point | Calls Skills | Depth | Architectural Role |
|---|---|---|---|
| `sprint-pre-flight` | 17 skills | 11 | Meta-orchestrator. |
| `sprint-post-code` | 7 skills | 10 | Sprint closure orchestrator. |
| `project-health` | `sprint-qa` | 3 | Housekeeping. |
| `ux-radical-evaluation` | None | 1 | Standalone evaluation tool. |

### Redundancy & Logic Leaks
| Pattern / Logic Chunk | Found In | Recommendation |
|---|---|---|
| Active sprint discovery | 6+ skills | Extract to `scripts/find_active_sprint.js` (Deterministic). |
| Audit archive pattern | 2 skills | Extract to `scripts/archive_audit.js` (Deterministic). |

### Dead Skills & Pruning Candidates
- **Potential Orphans:** `ux-radical-evaluation` (not called by any other skill, though intentionally a manual entry point).
- **Candidates for Merging:** None identified.

## Scripting Recommendations
| Priority | Workflow Step | Proposed Script | Rationale |
|---|---|---|---|
| High | Active sprint discovery | `scripts/find_active_sprint.js` | Eliminates logic variance across 6 orchestrators. |
| High | Audit archive | `scripts/archive_audit.js` | Purely mechanical file rename/move operation. |
| Medium | Sprint status update | `scripts/set_sprint_status.js` | Automates state transition in markdown files. |

## Hook Strategy
- **SessionStart:** Runs `git branch` and `git status` unconditionally (~20 tokens). While low cost, it could be wrapped in a check for project directory presence.
- **Stop:** Correctly uses a conditional guard for `npx tsc --noEmit`.
- **Latency Score:** 21 (Moderate). The `Stop` hook carries the most weight (17) but is appropriately guarded.

## Memory Refinement (`CLAUDE.md`)
`CLAUDE.md` is now at ~3,682 tokens (~170 lines). It is approaching the 200-line limit where performance degrades. 
- **Pruning Candidate:** The "Component-specific notes" section (~350 tokens) should be moved to a path-scoped rule in `.claude/rules/components.md` to ensure it only loads when working on components.

## Efficiency Metrics
- **Current State:** ~3,740 tokens/turn.
- **Target State:** ~3,350 tokens/turn.
- **Projected Savings:** ~10% reduction achieved by disabling `ux-radical-evaluation` and moving component notes to path-scoped rules.
