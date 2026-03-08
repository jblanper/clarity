# Claude Code: Hooks Reference

Hooks are user-defined shell commands, HTTP endpoints, or LLM prompts that execute automatically at specific points in Claude Code's lifecycle. Configured in `.claude/settings.json` (project), `~/.claude/settings.json` (global), or skill/agent frontmatter.

## 1. Hook Events

| Event | When it fires | Matcher filters |
|---|---|---|
| `SessionStart` | Session begins or resumes | How it started: `startup`, `resume`, `clear`, `compact` |
| `UserPromptSubmit` | Before Claude processes a submitted prompt | No matcher support |
| `PreToolUse` | Before a tool call executes — can block it | Tool name: `Bash`, `Edit\|Write`, `mcp__.*` |
| `PermissionRequest` | When a permission dialog appears | Tool name |
| `PostToolUse` | After a tool call succeeds | Tool name |
| `PostToolUseFailure` | After a tool call fails | Tool name |
| `Notification` | When Claude Code sends a notification | Type: `permission_prompt`, `idle_prompt`, `auth_success` |
| `SubagentStart` | When a subagent is spawned | Agent type: `Explore`, `Plan`, or custom name |
| `SubagentStop` | When a subagent finishes | Agent type |
| `Stop` | When Claude finishes responding | No matcher support |
| `TeammateIdle` | When an agent team member is about to go idle | No matcher support |
| `TaskCompleted` | When a task is marked completed | No matcher support |
| `InstructionsLoaded` | When a CLAUDE.md or `.claude/rules/*.md` loads | No matcher support |
| `ConfigChange` | When a config file changes during a session | Source: `user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills` |
| `WorktreeCreate` | When a worktree is being created | No matcher support |
| `WorktreeRemove` | When a worktree is being removed | No matcher support |
| `PreCompact` | Before context compaction | What triggered it: `manual`, `auto` |
| `SessionEnd` | When a session terminates | Why: `clear`, `logout`, `prompt_input_exit`, `other` |

## 2. Configuration Format

Hooks are defined as an event → array of matcher groups → array of handlers:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/block-rm.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/lint-check.sh"
          }
        ]
      }
    ]
  }
}
```

The `matcher` is a regex. Omit it (or use `"*"` / `""`) to match all occurrences of the event. Events marked "No matcher support" in the table above always fire on every occurrence.

## 3. Handler Types

| Type | Description | Use When |
|---|---|---|
| `command` | Runs a shell command. Receives JSON on stdin; returns decisions via stdout. | Deterministic Low-Entropy tasks: guardrails, formatting, logging |
| `http` | POSTs the event JSON to a URL. Response uses same JSON format as command output. | Centralised webhook servers, audit logging |
| `prompt` | Sends a prompt to a Claude model for single-turn yes/no evaluation. | Simple semantic checks too complex for a shell script |
| `agent` | Spawns a subagent with full tool access (Read, Grep, Glob, etc.) before returning a decision. | Deep verification requiring file access or multi-step reasoning |

### Common handler fields

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"command"`, `"http"`, `"prompt"`, or `"agent"` |
| `timeout` | no | Seconds before cancelling. Defaults: 600 (command), 30 (prompt), 60 (agent) |
| `statusMessage` | no | Custom spinner text while the hook runs |
| `once` | no | If `true`, runs only once per session then is removed. Skills only. |

`command` hooks also accept `async: true` to run in the background without blocking the session.

## 4. Blocking with `PreToolUse`

**"Exit 2 = block" is incorrect.** Blocking is done via JSON output, not exit codes. A hook blocks a tool call by printing a JSON decision to stdout:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Destructive command blocked"
  }
}
```

Exit 0 with no JSON output = allow. Non-zero exit = hook error (non-blocking by default). To deny, always output the JSON decision.

## 5. Scope

| Location | Scope |
|---|---|
| `~/.claude/settings.json` | All your projects |
| `.claude/settings.json` | Single project (shareable via git) |
| `.claude/settings.local.json` | Single project (gitignored, not shared) |
| Managed policy settings | Organisation-wide |
| Plugin `hooks/hooks.json` | When plugin is enabled |
| Skill or agent frontmatter | While that component is active |

## 6. Conditional Execution (Latency Optimisation)

Unconditional hooks run on every event. Guard expensive operations:

```bash
# Only type-check if TypeScript files changed
if git diff --name-only | grep -qE '\.(ts|tsx)$'; then npx tsc --noEmit; fi

# Only install if package-lock.json changed
if git diff --name-only | grep -q 'package-lock.json'; then npm ci; fi
```

Unconditional `tsc` on `Stop` adds 3–10s to every session exit, even for sessions that only touched markdown.

## 7. Context Injection

`SessionStart` hook stdout is injected into the session context. Keep it structured and minimal — every byte is a recurring per-session token cost.
