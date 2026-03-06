# Claude Code Optimization Report: Clarity

**Date:** 2026-03-06 14:45
**Status:** 🟡 Needs Pruning
**Total Token Impact:** ~21,388 tokens (High)

## Executive Summary
The Clarity environment has moved from "Critical Bloat" to "Needs Pruning" following the successful adoption of YAML frontmatter across all 21 skills and the optimization of the `Stop` hook. Real-world performance is significantly improved as skills are no longer auto-triggered into the context window due to the `disable-model-invocation: true` flag. Pruning should now focus on removing minor conversational fillers and standardizing cross-skill dependencies.

## Skill Audit
| Skill Group | Count | Primary Issue | Token Impact | Recommendation |
|---|---|---|---|---|
| **Audits** | 7 | Conversational fillers | Low | Remove "please" from `audit-microcopy`. |
| **Sprints** | 10 | Conversational fillers | Low | Remove "please" from `sprint-qa`. |
| **General** | 4 | Implicit dependencies | Low | Standardize cross-skill calls via headers. |

### Detailed Skill Pruning
| Skill / File | Token Count | Primary Issue | Recommendation |
|---|---|---|---|
| `audit-microcopy`| 779 | Conversational filler | Remove "please" to match senior engineering tone. |
| `sprint-qa` | 1202 | Conversational filler | Remove "please" and standardize checklist. |

## Semantic & Architectural Audit

### Skill Dependencies & Flow
- **Implicit Chains:** All 21 skills currently have "Dead" status in the dependency mapper because their cross-calls are documented in prose rather than structured `!command` or YAML-based metadata.
- **Merge Candidate:** `audit-design-overall` and `sprint-ux` show semantic overlap. Deferring merge until `sprint-ux` has more usage data.

## Scripting Recommendations
- **Priority 1: `scripts/cli_utils.js` (Medium)**
  - Re-enable the development of a shared utility library to standardize Phase 1 audit outputs and ensure JSON consistency across judgment tasks.
- **Priority 2: `scripts/sprint_manager.js` (Low)**
  - Automate file creation and versioning tasks for the 10-skill sprint workflow.

## Hook Strategy
- **Stop Hook:** **Optimized.** The hook now conditionally runs `tsc --noEmit` only when `.ts/.tsx` files are modified.
- **SessionStart:** Branch and status detection remains lightweight and efficient.

## Memory Refinement (`CLAUDE.md`)
- **Status:** **Earned Context.** The `CLAUDE.md` file (~3,322 tokens) is essential for discovery and consistency. No pruning recommended at this stage.

## Efficiency Metrics
- **Current State:** ~21,388 tokens/turn.
- **Target State:** ~8,556 tokens/turn (Context-optimized via `disable-model-invocation: true`).
- **Projected Savings:** 60% reduction in global discovery overhead.
