# Claude Code: Hooks Guide

## 1. Event Lifecycle
Hooks allow for deterministic behavior at specific lifecycle points in a Claude session.

| Event | Trigger | Use Case |
|---|---|---|
| `SessionStart` | On session entry. | Context injection (e.g., current git branch, Jira tickets). |
| `PreToolUse` | Before an agent uses a tool. | Guardrails (e.g., blocking `rm`, enforcing linting before commit). |
| `PostToolUse` | After an agent uses a tool. | Cleanup or formatting (e.g., auto-run Prettier after a file change). |
| `Stop` | On session exit. | Notifications or final verification (e.g., run `tsc --noEmit`). |

## 2. Handler Types
- **Command**: Run a standard shell script. 
    - **Exit 0**: Success, proceed.
    - **Exit 2**: Failure, block (especially for `PreToolUse`).
- **Prompt**: Uses a fast model (Haiku) for semantic analysis.
- **Agent**: Spawns a sub-agent with full tool access for deep verification.

## 3. Best Practices
- **Minimize Latency**: Avoid long-running tasks in `SessionStart` or `Stop` unless necessary.
- **Guardrails**: Use `PreToolUse` to prevent common destructive commands or to enforce workspace-specific rules.
- **Automation**: Use `PostToolUse` for non-invasive tasks like auto-formatting or updating logs.
- **Configuration**: Managed via `.claude/settings.json`.
