# Claude Code: Skill Structure & Best Practices

## 1. YAML Frontmatter: The Critical Optimization
Frontmatter controls how Claude discovers and triggers skills. 

| Key | Purpose | Token Strategy |
|---|---|---|
| `name` | The slash command. | Use kebab-case. |
| `description` | The "trigger" text. | **High Token Impact.** If omitted, Claude reads the first paragraph of `SKILL.md`. Keep this to a single line. |
| `disable-model-invocation` | Block auto-triggering. | **Maximum Savings.** Setting this to `true` removes the skill's description from the agent's context entirely until the skill is explicitly called. Mandatory for all non-auto-triggered workflows (/deploy, /audit). |
| `user-invocable` | Visibility in `/` menu. | Set to `false` for internal playbooks called only by other skills. |
| `context: fork` | Isolation. | Runs in a fresh sub-agent to minimize context bloat from chat history. |

## 2. Directory Layout
Skills should be self-contained:
```text
.claude/skills/my-skill/
├── SKILL.md       # Core instructions
├── scripts/       # Deterministic helpers
├── references/    # Heavy documentation (Prog. Disclosure)
└── assets/        # Static templates
```

## 3. The Semantic Guardrail
**Do not script everything.** Claude Code is an LLM agent designed for semantic judgment. 

- **Scriptable (Low-Entropy):** File creation, versioning, formatting, regex parsing.
- **LLM-Native (High-Entropy):** Audit triage, code review, merging findings, semantic prioritization.

## 4. Shell Injection Efficiency
- Use `!command` to run scripts *before* the prompt. This allows the script to fetch only the relevant subset of files, preventing "Project Snapshot" token bloat.
- Prefer `grep` and `jq` filters over reading raw files.
