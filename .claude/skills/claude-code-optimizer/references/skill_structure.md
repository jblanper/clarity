# Claude Code: Skill Structure & Best Practices

## 1. YAML Frontmatter Keys

All fields are optional. `description` is strongly recommended so Claude knows when to use the skill.

| Key | Purpose | Guidance |
|---|---|---|
| `name` | The `/name` slash command. | Optional — defaults to directory name. Lowercase letters, numbers, hyphens, max 64 chars. |
| `description` | Trigger text and menu label. | One sentence. If omitted, Claude reads the first paragraph — less predictable. |
| `argument-hint` | Hint shown in autocomplete. | Format: `[issue-number]` or `[filename] [format]`. |
| `disable-model-invocation` | Prevents Claude from auto-loading the skill. | Set to `true` for workflows you want to trigger manually with `/name`. **Removes the description from every-session context entirely.** |
| `user-invocable` | Controls `/` menu visibility. | Set to `false` to hide from the menu. Claude can still auto-trigger the skill. Description IS in context. |
| `allowed-tools` | Limits which tools Claude may use when the skill is active. | Best practice for security and determinism. Format: `Read, Edit, Bash(npm *)`. |
| `context` | Set to `fork` to run in an isolated subagent. | Recommended for long workflows. The skill content becomes the subagent's task prompt. |
| `agent` | Which subagent type to use when `context: fork` is set. | Options: `Explore`, `Plan`, `general-purpose`, or any custom agent. Defaults to `general-purpose`. |
| `model` | Model to use when the skill is active. | Overrides the session default. |
| `hooks` | Hooks scoped to this skill's lifecycle. | See the Hooks reference for format. |

## 2. Invocation & Context Loading

This table shows exactly who can invoke a skill and when its description enters context:

| Frontmatter | You can invoke | Claude can invoke | Description in context |
|---|---|---|---|
| (default) | Yes | Yes | Always — description injected every session |
| `disable-model-invocation: true` | Yes | No | Never — description excluded from context |
| `user-invocable: false` | No | Yes | Always — description injected every session |

**Key implication:** `user-invocable: false` is for background knowledge Claude should always have but users shouldn't invoke as a command. The description IS in context. To make a skill completely invisible to both users and Claude until needed, combine `disable-model-invocation: true` with no `user-invocable` setting (which keeps it in the `/` menu, letting you invoke it manually).

For a truly internal skill (hidden from menu AND not auto-triggered): `disable-model-invocation: true` removes it from Claude's context, and since it has no menu entry when not user-invocable, it can only be called from another skill's content.

## 3. Token Impact of `disable-model-invocation`

Skills WITHOUT `disable-model-invocation: true` have their descriptions injected into every Claude Code session. The total budget scales at 2% of the context window, with a fallback cap of 16,000 characters. When the budget is exceeded, some skill descriptions are excluded and Claude Code shows a warning in `/context`.

Setting `disable-model-invocation: true` removes a skill's description from the budget entirely.

## 4. Substitution Variables

Use these placeholders in `SKILL.md` content. They are replaced before the skill runs:

| Variable | Description |
|---|---|
| `$ARGUMENTS` | All arguments passed after the skill name. |
| `$ARGUMENTS[N]` | A specific argument by 0-based index. |
| `$N` | Shorthand for `$ARGUMENTS[N]`. |
| `${CLAUDE_SESSION_ID}` | The current session ID. |
| `${CLAUDE_SKILL_DIR}` | Absolute path to the skill's directory. Use this to reference bundled scripts regardless of working directory. |

## 5. Dynamic Context Injection (`!command`)

Prefix a line with `!` followed by a shell command in backticks to run it **before** the skill content is sent to Claude. The command output replaces the placeholder inline:

```markdown
## Current state
- Open PRs: !`gh pr list --json title,number`
- Changed files: !`git diff --name-only`
```

Claude receives the rendered output, not the command itself. This is preprocessing — Claude cannot re-run it. Use `${CLAUDE_SKILL_DIR}` to reference bundled scripts portably:

```markdown
!`node ${CLAUDE_SKILL_DIR}/scripts/gather-context.js`
```

## 6. Directory Layout

```
.claude/skills/my-skill/
├── SKILL.md          # Instructions + frontmatter (required, keep under 500 lines)
├── scripts/          # Deterministic Low-Entropy helpers
│   └── package.json  # { "type": "module" } for ESM
├── references/       # Heavy documentation loaded on demand
└── assets/           # Static templates
```

Keep `SKILL.md` under 500 lines. Move detailed reference material to separate files and link to them from `SKILL.md` so Claude knows they exist and when to load them.

## 7. Skill Locations

| Scope | Path |
|---|---|
| Personal (all projects) | `~/.claude/skills/<name>/SKILL.md` |
| Project | `.claude/skills/<name>/SKILL.md` |
| Legacy (still works) | `.claude/commands/<name>.md` |
| Plugin | `<plugin>/skills/<name>/SKILL.md` — namespace: `plugin-name:skill-name` |

When the same skill name exists at multiple levels, priority is: enterprise > personal > project.

## 8. The Semantic Guardrail

**Do not script everything.** Claude Code is an LLM agent designed for semantic judgment.

| Category | Examples | Approach |
|---|---|---|
| **Low-Entropy (scriptable)** | File creation, token counting, linting for presence of keys, dependency graph from text patterns | Write a script or use `!command` injection |
| **High-Entropy (LLM-native)** | Audit triage, code review, semantic redundancy detection, deciding what context is "earned" | Keep as skill instruction |
