# Claude Code Agents — Design Rationale

**Last updated:** 2026-03-07

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

---

## Implementation decision — 2026-03-07

**Additive model adopted. Existing skills are not modified.**

The original design proposed replacing role definitions inside skills with agent
delegation. After review, that approach carries meaningful risk: the skills
workflow is proven, and refactoring 7+ skills to delegate is a large change with
no automated test coverage on the result.

Instead, agents are deployed as standalone entities alongside the existing
skills. No skill files are touched.

**What this means:**
- `.claude/agents/ux-designer.md` and `.claude/agents/architect.md` are created
  from the drafts in this directory
- All existing `/sprint-*` and `/audit-*` skills continue to work unchanged
- Agents are available for direct use in conversation and as subagents
- De-duplication of skill role definitions is deferred — evaluate after real
  sprint usage confirms agents are worth the refactor cost

**If agents prove useful:** plan skill refactoring as a dedicated tooling sprint
(not during a feature sprint). The designs in this directory remain the reference.

---

## How to use the agents

Claude Code agents in `.claude/agents/` are available in two ways:

### 1. Ask Claude to use a specific agent

Explicitly request the agent by name. Claude will invoke it as a subagent with
the full context defined in its file.

```
Use the architect agent to review CheckInForm.tsx for CLAUDE.md compliance.
```

```
Use the ux-designer agent to evaluate the sprint brief before I start coding.
```

```
Run the architect agent over the FrequencyList changes — specifically check
the exit animation and scroll-position handling.
```

### 2. Describe the task — Claude picks the agent automatically

The `description` field in each agent's frontmatter tells Claude when to invoke
it. If your request clearly matches, Claude will route to the agent without
being asked explicitly.

Tasks that will typically trigger `architect`:
- "Review this diff for CLAUDE.md compliance"
- "Check if this data model change is safe"
- "Is this static-export safe?"

Tasks that will typically trigger `ux-designer`:
- "Does this component follow the Calma design language?"
- "Audit the colour usage in SettingsView"
- "Review this sprint brief for UX issues before I start"

### Practical examples by sprint phase

| Phase | Command |
|---|---|
| Before coding | `Use the ux-designer agent to review the Sprint 8 brief` |
| Before coding | `Use the architect agent to check the Sprint 8 brief for implementation risks` |
| After coding | `Use the architect agent to audit the changes I just made against CLAUDE.md` |
| Spot check | `Use the ux-designer agent — does HabitToggle's touch target size pass WCAG?` |
| Audit | `Use the architect agent to scan lib/ for TypeScript compliance issues` |

### What agents are NOT for

- Running the full sprint pipeline — use the existing `/sprint-*` skills for that
- Replacing `/audit-colour`, `/audit-typography` etc. — those skills have
  structured output format; agents produce free-form analysis
- Committing or writing code — agents are reviewers, not implementers
