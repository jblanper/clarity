# Claude Code: CLAUDE.md & Memory Guide

## 1. What Gets Loaded Every Session

| Source | Loaded | Notes |
|---|---|---|
| `CLAUDE.md` (project root) | Always | Primary project instructions |
| `CLAUDE.md` (parent dirs, up to `~`) | Always | Cascading — each parent's file adds to context |
| `~/.claude/CLAUDE.md` | Always | Global preferences |
| `~/.claude/projects/<id>/memory/MEMORY.md` | Always (first 200 lines) | Auto-memory system — truncated at 200 lines |
| Skill descriptions (no `disable-model-invocation`) | Always | Injected for auto-triggering |
| `SessionStart` hook stdout | Always | Dynamic context injection |

Everything in this list is a recurring per-session cost. Optimize all of it.

## 2. CLAUDE.md Best Practices

**Keep it under ~150 lines.** Long CLAUDE.md files accumulate context tax on every session and may be partially ignored.

**Earned Context:** A rule earns its space if removing it would cause Claude to behave incorrectly or inconsistently. Constraints on critical behavior (data model rules, nav patterns, WCAG requirements) are earned. Reminders of things Claude already knows (general TypeScript best practices, what Next.js is) are not.

**Structure for discovery, not completeness:**
- Tech stack (1–3 lines)
- Project map (brief directory overview)
- Critical constraints (the "never do" list)
- Verification commands (`npm test`, `npm run lint`)
- Pointers to skill slash commands for complex workflows

**Progressive Disclosure:** Move deep documentation into skill `references/` dirs. CLAUDE.md should say "see `/sprint-pre-flight`" not embed the entire sprint checklist.

## 3. MEMORY.md Best Practices (Auto-Memory)

The auto-memory system persists `MEMORY.md` files per-project at `~/.claude/projects/<id>/memory/MEMORY.md`. Lines after 200 are truncated.

**Write semantically, not chronologically.** Group by topic, not by session. Update entries when they become stale — don't append.

**What belongs here:**
- Confirmed patterns discovered over multiple sessions
- User preferences that override defaults
- Solutions to recurring bugs
- Architectural decisions not in CLAUDE.md

**What does NOT belong here:**
- Current task state (it will be stale next session)
- Anything that duplicates CLAUDE.md (one source of truth)
- Speculative conclusions from a single session

## 4. Pruning Checklist

When auditing CLAUDE.md or MEMORY.md, flag content that:
- Duplicates what's in the other file
- Describes a resolved bug or one-off workaround that no longer applies
- Is general programming advice Claude already knows
- Could be in a skill reference and accessed only when needed
