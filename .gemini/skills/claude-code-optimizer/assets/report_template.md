# Claude Code Optimization Report: {{Project Name}}

**Date:** {{YYYY-MM-DD HH:mm}}
**Status:** {{[🟢 Healthy | 🟡 Needs Pruning | 🔴 Critical Bloat]}} (Prev: {{Previous Status}})
**Total Token Impact:** ~{{Token Count}} tokens ({{Impact Level}})
**Delta:** {{Token Delta}} ({{Percent Change}}% since {{Previous Report}})

## Executive Summary
{{2-3 sentences on health, latency, and context efficiency. Distinguish between semantic and deterministic opportunities.}}

## Skill Audit
| Skill Group | Count | Primary Issue | Token Impact | Recommendation |
|---|---|---|---|---|
| **Audits** | {{N}} | {{Header/Flag Issue}} | {{High|Med|Low}} | Add `disable-model-invocation: true`. |
| **Sprints** | {{N}} | {{Header/Flag Issue}} | {{High|Med|Low}} | Add `disable-model-invocation: true`. |
| **General** | {{N}} | {{Fluff/Logic Issue}} | {{High|Med|Low}} | {{Recommendation}} |

### Detailed Skill Pruning
| Skill / File | Token Count | Primary Issue | Recommendation |
|---|---|---|---|
| {{Skill Name}} | {{N}} | {{Specific Issue}} | {{Actionable Recommendation}} |

## Semantic & Architectural Audit

### Skill Dependencies & Flow
| Entry Point | Calls Skills | Depth | Architectural Role |
|---|---|---|---|
| {{Skill Name}} | {{Skill A, Skill B}} | {{1|2|3}} | {{Orchestrator|Single Task}} |

### Redundancy & Logic Leaks
| Pattern / Logic Chunk | Found In | Recommendation |
|---|---|---|
| {{Common Logic}} | {{Skill X, Skill Y}} | {{Extract to script|Merge skills}} |

### Dead Skills & Pruning Candidates
- **Potential Orphans:** {{List skills not called by others and not calling others}}
- **Candidates for Merging:** {{List skills with high overlap}}

## Scripting Recommendations
{{Proposed automation scripts to replace verbose LLM instructions in .claude/scripts/, categorized by Priority.}}

## Hook Strategy
{{Analysis of .claude/settings.json lifecycle events and proposed optimizations.}}

## Memory Refinement (`CLAUDE.md`)
{{Refine CLAUDE.md for 'Earned Context'. Prune verbose prose; keep essential discovery tables.}}

## Efficiency Metrics
- **Current State:** ~{{Current Tokens}} tokens/turn.
- **Target State:** ~{{Target Tokens}} tokens/turn.
- **Projected Savings:** {{Savings}}% reduction in discovery overhead.
