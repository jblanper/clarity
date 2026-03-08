# Claude Code Optimization Report: {{Project Name}}

**Date:** {{YYYY-MM-DD HH:mm}}
**Status:** {{[🟢 Healthy | 🟡 Needs Pruning | 🔴 Critical Bloat]}} (Prev: {{Previous Status or "baseline"}})

---

## Executive Summary

{{2–3 sentences: overall health, primary token cost driver, most actionable finding. Distinguish semantic from deterministic opportunities.}}

---

## Always-Loaded Context Audit

These files are injected into every session regardless of what the user is working on. This is the true per-session context tax.

**Always-Loaded Context Tax:** ~{{N}} tokens/session

| File | Tokens | Notes |
|---|---|---|
| `CLAUDE.md` | {{N}} | {{Earned context assessment}} |
| `MEMORY.md` | {{N}} | {{Stale entries? Duplication with CLAUDE.md?}} |
| {{Non-disabled skill descriptions}} | {{N}} | {{List skills without disable-model-invocation}} |
| `SessionStart` hook output | {{N (estimate)}} | {{Is output minimal and structured?}} |

**Deferred context (not loaded unless invoked):** ~{{N}} tokens across {{M}} skills with `disable-model-invocation: true`.

### CLAUDE.md Refinement
{{Flag sections that are not "earned" — general advice, resolved workarounds, content that belongs in a skill reference. Preserve critical constraints and discovery tables.}}

### MEMORY.md Refinement
{{Flag stale entries, entries that duplicate CLAUDE.md, or resolved one-off notes. Preserve confirmed patterns and user preferences.}}

---

## Skill Audit

**Total skills:** {{N}} ({{M}} project, {{K}} global)

| Prefix Group | Count | Primary Issue | Recommendation |
|---|---|---|---|
| {{prefix or "standalone"}} | {{N}} | {{Most common issue}} | {{Action}} |

### Detailed Findings

| Skill | Issue | Severity | Recommendation |
|---|---|---|---|
| {{skill-name}} | {{Specific issue}} | {{error / warning / info}} | {{Actionable fix}} |

---

## Semantic & Architectural Audit

### Skill Dependencies

| Entry Point | Calls | Depth | Role |
|---|---|---|---|
| {{skill-name}} | {{skill-a, skill-b}} | {{N}} | {{Orchestrator / Single Task}} |

### Redundancy & Logic Leaks

| Duplicated Logic | Found In | Recommendation |
|---|---|---|
| {{Common pattern}} | {{Skill X, Skill Y}} | {{Extract to shared reference / Merge}} |

### Isolation Gaps

Skills that run long workflows but lack `context: fork` — their accumulated conversation history may leak into reasoning:

{{List candidates with justification, or "None identified."}}

---

## Scripting Recommendations

For each item: verify it passes the Semantic Guardrail (Low-Entropy only).

| Priority | Workflow Step Currently in LLM Instructions | Proposed Script | Rationale |
|---|---|---|---|
| {{High/Med/Low}} | {{Description}} | `scripts/{{name}}.js` | {{Why it's Low-Entropy}} |

---

## Hook Strategy

**Covered events:** {{SessionStart, Stop, etc.}}
**Missing events:** {{PreToolUse, PostToolUse, etc. — with rationale for whether they're needed}}

| Hook | Event | Conditional? | Issue | Recommendation |
|---|---|---|---|---|
| {{snippet}} | {{event}} | {{Yes/No}} | {{e.g., unconditional tsc}} | {{Add guard condition}} |

---

## Efficiency Metrics

- **Always-Loaded Context Tax (current):** ~{{currentTokens}} tokens/session
- **Always-Loaded Context Tax (target):** ~{{targetTokens}} tokens/session
- **Projected savings:** {{savingsTokens}} tokens ({{savingsPercent}}%) — achieved by {{primary action, e.g., "adding disable-model-invocation to N skills and pruning MEMORY.md"}}
- **Delta from previous report:** {{tokenDelta}} tokens ({{trend}})
