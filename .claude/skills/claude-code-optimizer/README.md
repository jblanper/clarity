# claude-code-optimizer

A Claude Code skill that audits your `.claude/` environment for token efficiency, skill health, hook latency, and architectural drift. Generates a timestamped Markdown report in `docs/claude-code-optimizer/`.

## Usage

```
/claude-code-optimizer
```

Or ask naturally: **"Audit the Claude environment"** / **"Optimize my .claude/ setup"**

The skill runs analysis scripts, applies LLM judgment for semantic findings, and writes a report. It outputs only the report file path — nothing else to the console.

## What it audits

| Area | What it checks |
|---|---|
| **Always-loaded context** | CLAUDE.md, MEMORY.md, and skill descriptions that inject into every session |
| **Skills** | Missing `disable-model-invocation`, `allowed-tools`, or frontmatter; conversational filler; prefix group summary |
| **Dependencies** | Skill call graph, entry points, shared utilities, unreachable internal skills |
| **Hooks** | Event coverage, unconditional hooks that add latency on every session |
| **Semantic drift** | Duplicated logic, missing `context: fork`, CLAUDE.md / MEMORY.md pruning candidates |
| **Delta** | Token trend compared to the previous report |

## Understanding the token model

Not all context costs the same:

- **Always-loaded** — `CLAUDE.md`, `MEMORY.md`, and skill descriptions *without* `disable-model-invocation: true` are injected into every session. This is your real per-session tax.
- **Deferred** — Skills with `disable-model-invocation: true` are only loaded when you type `/skill-name`. They cost nothing until invoked.

The report's "Always-Loaded Context Tax" metric is what actually matters for session startup cost.

## Reports

Reports are saved to `docs/claude-code-optimizer/audit-claude-env-YYYY-MM-DD-HHmm.md`. Each report is self-contained; running the skill again picks up the previous report automatically for delta tracking.

## Scripts

The scripts in `scripts/` are plain Node.js (ESM, no dependencies). You can run them independently:

```bash
node .claude/skills/claude-code-optimizer/scripts/token_counter.js
node .claude/skills/claude-code-optimizer/scripts/skill_linter.js
node .claude/skills/claude-code-optimizer/scripts/dependency_mapper.js
node .claude/skills/claude-code-optimizer/scripts/hook_analyzer.js
node .claude/skills/claude-code-optimizer/scripts/latency_benchmarker.js
node .claude/skills/claude-code-optimizer/scripts/delta_tracker.js <TOKEN_COUNT>
node .claude/skills/claude-code-optimizer/scripts/report_validator.js <REPORT_PATH>
```

All scripts output structured JSON, making them composable with `jq` or other tooling.

## Scope

Covers both project-level (`.claude/`) and global (`~/.claude/`) skills, settings, and hooks. Works with any Claude Code project — no project-specific conventions assumed.

## Keeping references up to date

The files in `references/` document Claude Code's hooks, memory system, skill structure, and automation patterns. As Claude Code evolves, these may drift from the official docs. Use the prompt below to sync them.

### Doc-sync prompt

Paste this into Claude Code when you want to update the references:

```
Fetch the following four official Claude Code documentation pages and compare them against the reference files in .claude/skills/claude-code-optimizer/references/. For each file, identify what is incorrect, missing, or outdated relative to the official docs, then apply the necessary corrections. Do not rewrite content that is still accurate. Preserve the "best practices" and "guidance" sections — those are editorial additions not in the official docs and should be kept if still valid.

Pages to fetch:
- https://code.claude.com/docs/en/hooks
- https://code.claude.com/docs/en/memory
- https://code.claude.com/docs/en/slash-commands
- https://code.claude.com/docs/en/settings

Reference files to update:
- .claude/skills/claude-code-optimizer/references/hooks_guide.md (maps to hooks + settings)
- .claude/skills/claude-code-optimizer/references/claude_md_guide.md (maps to memory)
- .claude/skills/claude-code-optimizer/references/skill_structure.md (maps to slash-commands)
- .claude/skills/claude-code-optimizer/references/automation_patterns.md (cross-cutting patterns; update only if the docs introduce new native automation features)

After editing, summarise what changed in each file.
```

The references are intentionally more concise than the full docs — they include only what is relevant to auditing a `.claude/` environment. When syncing, add missing facts but do not expand into a full documentation mirror.

## Key concepts

**Semantic Guardrail** — The skill distinguishes Low-Entropy tasks (deterministic, scriptable) from High-Entropy tasks (require judgment). It will not recommend scripting things that need semantic reasoning.

**Earned Context** — Not all CLAUDE.md content is bloat. The report flags only content that is redundant, outdated, or better placed in a skill reference — not essential constraints or discovery tables.
