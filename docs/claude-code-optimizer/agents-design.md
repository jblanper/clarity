# Claude Code Agents — Design Rationale

## Problem

Role definitions are duplicated across skills. The UX role appears in `sprint-ux`,
`sprint-review`, and four audit skills. The Architect role appears in `sprint-arch`,
`sprint-arch-review`, and `audit-arch`. Each skill re-embeds the same persona,
the same domain knowledge, and the same voice — making updates inconsistent and
maintenance error-prone.

## Solution: `.claude/agents/`

Extract stable role knowledge into agent files. Skills become thin task
orchestrators that invoke the relevant agent rather than redefining the role.

```
# Before: skill embeds everything
sprint-ux/SKILL.md → 85 lines (40 role + 30 task + 15 setup)

# After: skill delegates
sprint-ux/SKILL.md → ~30 lines (task-specific only)
.claude/agents/ux-designer.md → role, reasoning framework, @references
```

## Agents to create

### Priority 1 — High ROI

| Agent | Backs | Rationale |
|---|---|---|
| `ux-designer` | sprint-ux, sprint-review, audit-colour, audit-typography, audit-interaction, audit-microcopy, audit-design-overall | Calma + WCAG expertise needed 6+ times |
| `architect` | sprint-arch, sprint-arch-review, audit-arch | CLAUDE.md compliance + code review needed 3 times |

### Priority 2 — Lower ROI

| Agent | Backs | Rationale |
|---|---|---|
| `product-owner` | sprint-brief, sprint-plan, sprint-retro, sprint-kickoff | PO role is mostly process logic, not domain knowledge |

## Standalone vs sub-agent model

**Decision: standalone agents.**

Agents replace the role-definition section of each skill. Skills remain as the
user-facing entry point (preserving `/sprint-ux` syntax) but their system prompt
becomes task-specific instructions only, written in the agent's voice.

## What agents contain — and what they don't

**The single-source-of-truth principle:**
`CLAUDE.md` and `docs/calma-design-language.md` are the authoritative sources.
Agents must NOT duplicate content from these files — that creates two places to
update when rules change.

### Agents contain
- Role persona and voice (the *who*)
- Reasoning framework — what lens to apply, what questions to ask (the *how*)
- `@file` references to authoritative sources
- Interpretation layer: things that aren't in any doc but define how the role
  thinks (e.g. what "Calma-breaking" looks like to a reviewer in practice)

### Agents do NOT contain
- Tailwind tokens (they're in CLAUDE.md)
- WCAG rules and color values (they're in calma-design-language.md)
- Component inventory (it's in CLAUDE.md)
- Navigation architecture (it's in CLAUDE.md)

### @file references

Claude Code agents support `@filename` syntax in the system prompt to include
file contents at invocation time. Use this to pull in authoritative sources
without duplicating them:

```markdown
@CLAUDE.md
@docs/calma-design-language.md
```

## Update discipline

When a new pattern is established in a sprint:
1. Update `CLAUDE.md` — the rule itself lives here
2. Update the agent only if the *reasoning framework* needs to change
   (e.g. a new class of violation the agent should learn to spot)

Never update the agent to reflect content already captured in `CLAUDE.md`.
