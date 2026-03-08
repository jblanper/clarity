# Claude Code: Skill Structure & Best Practices

## 1. YAML Frontmatter Keys

| Key | Purpose | Guidance |
|---|---|---|
| `name` | The `/name` slash command. | Required. Use kebab-case. |
| `description` | Trigger text and menu label. | One sentence max. If omitted, Claude reads the first paragraph — less predictable. |
| `disable-model-invocation: true` | Removes the description from every-session context. | **Use for all skills that should NOT auto-trigger.** Skills invoked as `/name` commands should set this. Without it, the description is injected into every session even when irrelevant — a direct token tax. |
| `allowed-tools` | Constrain which Claude tools the skill may use. | Best practice for security and determinism. Format: `Read, Edit, Bash(npm *)`. Omitting it means the skill can use all tools. |
| `context: fork` | Run the skill in a fresh sub-agent. | Recommended for long workflows that accumulate context (sprint phases, full audits). Prevents conversation history from polluting the skill's reasoning. |
| `user-invocable: false` | Hide from the `/` menu. | For internal playbooks called only by other skills. |

## 2. Token Impact of `disable-model-invocation`

Skills WITHOUT `disable-model-invocation: true` have their descriptions injected into every Claude Code session — even sessions unrelated to those skills. For a project with 25 skills and only 3 that should auto-trigger, the other 22 descriptions are pure waste.

Setting `disable-model-invocation: true` reduces per-session context to only what is always needed.

## 3. Directory Layout (self-contained)

```
.claude/skills/my-skill/
├── SKILL.md          # Instructions + frontmatter
├── scripts/          # Deterministic Low-Entropy helpers
│   └── package.json  # { "type": "module" } for ESM
├── references/       # Heavy documentation (progressive disclosure)
└── assets/           # Static templates
```

## 4. The Semantic Guardrail

**Do not script everything.** Claude Code is an LLM agent designed for semantic judgment.

| Category | Examples | Approach |
|---|---|---|
| **Low-Entropy (scriptable)** | File creation, token counting, linting for presence of keys, dependency graph from text patterns | Write a script |
| **High-Entropy (LLM-native)** | Audit triage, code review, semantic redundancy detection, deciding what context is "earned" | Keep as skill instruction |

## 5. Skill Invocation Patterns

- **Auto-triggered:** No `disable-model-invocation`. Claude injects the description and may invoke the skill when the user's message matches. Suitable for: skills that need to fire without a slash command (e.g., a linter on every edit).
- **Manual (`/name`):** `disable-model-invocation: true`. User explicitly runs `/skill-name`. Suitable for: all deliberate workflows (deploy, sprint, audit).
- **Internal (called by other skills):** `user-invocable: false` + `disable-model-invocation: true`. Not in the menu, not auto-triggered. Suitable for: sub-tasks in a pipeline.
