---
name: audit-all
description: Run all audits (four design + one architecture) in parallel then produce the design-overall review and the triage implementation plan. Outputs seven docs/ files.
disable-model-invocation: true
allowed-tools: Read, Glob, Write, Agent, Task
---

# Audit — Full Suite

Run all five audit skills and then produce the triage implementation plan.

This is a planning task only. Do not change any code.

## Execution order

### Phase 1 — Parallel (run all four simultaneously as background agents)

Read each skill file listed below, then spawn four background agents
simultaneously — one per audit — using those instructions as each agent's prompt.

| Agent | Skill instructions | Output file |
|---|---|---|
| Colour & contrast | `.claude/skills/audit-colour/SKILL.md` | `docs/audits/audit-colour.md` |
| Typography & spacing | `.claude/skills/audit-typography/SKILL.md` | `docs/audits/audit-typography.md` |
| Interaction & motion | `.claude/skills/audit-interaction/SKILL.md` | `docs/audits/audit-interaction.md` |
| Microcopy & tone | `.claude/skills/audit-microcopy/SKILL.md` | `docs/audits/audit-microcopy.md` |
| Architecture & code health | `.claude/skills/audit-arch/SKILL.md` | `docs/audits/audit-arch.md` |

Wait for all five agents to complete and confirm all four output files exist
before proceeding.

### Phase 2 — Sequential (main session)

Follow the instructions in `.claude/skills/audit-design-overall/SKILL.md`
directly in the main session — do not spawn a sub-agent. Running in-session
means you can reason across the four reports already produced in Phase 1.

Output: `docs/audits/audit-design-overall.md`

### Phase 3 — Sequential (main session)

Follow the instructions in `.claude/skills/audit-triage/SKILL.md` directly
in the main session.

Output: `docs/audits/audit-implementation-plan.md`

## Completion report

When all phases are done, print a summary table:

| File | Findings |
|---|---|
| audit-colour.md | N critical · N high · N medium · N low |
| audit-typography.md | N critical · N high · N medium · N low |
| audit-interaction.md | N high · N medium · N low |
| audit-microcopy.md | N high · N medium · N low |
| audit-arch.md | N critical · N high · N medium · N low |
| audit-design-overall.md | N high · N medium · N low |
| audit-implementation-plan.md | Tier 1: N chunks · Tier 2: N chunks · Tier 3 deferred: N |
