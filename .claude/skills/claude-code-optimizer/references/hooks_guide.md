# Claude Code: Hooks Guide

## 1. Event Lifecycle

Hooks fire at specific lifecycle points in a Claude Code session. Configured in `.claude/settings.json` (project) or `~/.claude/settings.json` (global).

| Event | Trigger | Best Use |
|---|---|---|
| `SessionStart` | Session opens | Inject dynamic context: current branch, open PRs, ticket status. Keep lightweight — this adds to every session's startup time. |
| `PreToolUse` | Before any tool call | Guardrails: block destructive commands (`rm -rf`, force-push), enforce workspace rules. Exit 2 to block. |
| `PostToolUse` | After any tool call | Non-invasive cleanup: auto-formatting, logging, updating a progress file. |
| `Stop` | Session ends | Final verification: type-check, run failing tests, send a notification. |

## 2. Hook Types

| Type | Execution | Use When |
|---|---|---|
| `command` | Shell script. Exit 0 = success. Exit 2 = block (PreToolUse only). | Low-Entropy deterministic tasks |
| `prompt` | Sends output to a fast model (Haiku) for semantic analysis. | When the judgment call is simple enough for a small model |
| `agent` | Spawns a sub-agent with full tool access. | Deep verification that needs file access or multi-step reasoning |

## 3. Conditional Execution (Latency Optimization)

Unconditional hooks run on every session event, even when irrelevant. Use conditional guards to skip work:

```bash
# Only type-check if TypeScript files changed since last commit
if git diff --name-only | grep -qE '\.(ts|tsx)$'; then npx tsc --noEmit; fi

# Only install if package-lock.json changed
if git diff --name-only | grep -q 'package-lock.json'; then npm ci; fi
```

Unconditional `tsc` on `Stop` adds 3–10s to every session exit, even for sessions that only touched markdown.

## 4. Scope: Project vs. Global

- **Project** (`.claude/settings.json`) — repo-specific rules, CI-style gates.
- **Global** (`~/.claude/settings.json`) — universal preferences across all repos (e.g., always inject git branch on `SessionStart`).

Both are active simultaneously. Avoid duplicating the same hook in both scopes.

## 5. Hook Output and Context Injection

`SessionStart` hook stdout is injected into the session context. Keep it structured and minimal — every byte here is a recurring token cost on every session start.
