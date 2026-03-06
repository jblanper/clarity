# Claude Code Optimization Report: Clarity

**Date:** 2026-03-05 15:45
**Status:** 🔴 Critical Bloat
**Total Token Impact:** ~20,262 tokens (High)

## Executive Summary
The Clarity environment continues to suffer from high "Context Tax" (20k+ tokens/turn). While the architectural mapping is robust, the total absence of YAML metadata across all 21 skills and the reliance on verbose prose for deterministic tasks (like triage and validation) create significant token waste. Offloading these to scripts remains the primary optimization path.

## Skill Audit
| Skill Group | Count | Issue | Token Impact | Recommendation |
|---|---|---|---|---|
| **Audits** | 7 | 100% Missing YAML metadata | High | Add `name` and `description` to all `SKILL.md` files; script the triage logic. |
| **Sprints** | 10 | Verbose checklists & overlap | High | Consolidate validation logic; merge `sprint-arch-review` into `sprint-validate`. |
| **General** | 4 | Conversational filler | Low | Remove "please" and other fluff from `audit-microcopy` and `sprint-qa`. |

### Detailed Pruning Recommendations
| Skill / File | Token Count | Primary Issue | Recommendation |
|---|---|---|---|
| `audit-triage` | 1256 | Manual consolidation logic | Move logic to `scripts/triage_engine.cjs`. |
| `sprint-qa` | 1148 | Repetitive prose | Standardize checklist into a JSON-driven script. |
| `sprint-arch-review` | 1149 | Process redundancy | Merge into `sprint-validate` to reduce context depth. |

### Specific Findings:
- **YAML Frontmatter:** Zero out of 21 skills use YAML headers, forcing Claude to read full instructions during discovery.
- **Latency Bottleneck:** The `Stop` hook is the heaviest automation point (Weight: 17), primarily due to unconditional `tsc` checks.
- **Architectural Depth:** `sprint-validate` acts as a massive bottleneck, calling 11 other skills and creating a high-complexity node.

## Semantic & Architectural Audit

### Skill Dependencies & Flow
| Entry Point | Calls Skills | Depth | Architectural Role |
|---|---|---|---|
| `audit-all` | 6 | 2 | Full Audit Orchestrator |
| `sprint-validate` | 11 | 3 | High-Complexity Integration Validator |
| `sprint-kickoff` | 1 | 1 | Workflow Entry Point |

### Redundancy & Logic Leaks
| Pattern / Logic Chunk | Found In | Recommendation |
|---|---|---|
| Audit Consolidation | `audit-all`, `audit-triage` | Centralize in `scripts/triage_engine.cjs`. |
| Validation Loops | `sprint-qa`, `sprint-validate` | Standardize via `scripts/cli_utils.cjs`. |

### Dead Skills & Pruning Candidates
- **Potential Orphans:** None (100% reachability).
- **Candidates for Merging:** `audit-design-overall` + `sprint-ux` (semantic overlap).

## Scripting Recommendations
- **Priority 1: `scripts/triage_engine.cjs`**
  - Automates the consolidation of the 5 core audit reports. Replaces the 1,256-token `audit-triage` playbook.
- **Priority 2: `scripts/sprint_manager.cjs`**
  - Handles versioning, file creation, and status syncing for the 10 sprint-related skills.
- **Priority 3: `scripts/cli_utils.cjs`**
  - Shared library for Markdown parsing and standardizing "Phase 1" output across all skills.

## Hook Strategy
- **SessionStart:** Branch detection is effective. Recommend adding `npm-check-updates` or a lockfile hash check to detect drift.
- **Stop:** **High Latency Alert.** `npx tsc --noEmit` runs unconditionally. 
  - *Optimization:* Modify to: `if git diff --name-only | grep -qE '\.(ts|tsx)$'; then npx tsc --noEmit; fi`.

## Memory Refinement (`CLAUDE.md`)
- **Action:** Delete the "Audits & Reports" and "Sprint workflow" tables (~1,200 tokens). 
- **Reason:** Redundant "Context Tax." Claude discovers these via the skill system; providing them as prose in `CLAUDE.md` wastes core context window space.

## Efficiency Metrics
- **Current State:** ~20,262 tokens/turn.
- **Target State:** ~8,105 tokens/turn.
- **Projected Savings:** 60% reduction in context window usage.
