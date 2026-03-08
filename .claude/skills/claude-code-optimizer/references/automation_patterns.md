# Claude Code: Automation Patterns & the Semantic Guardrail

## 1. The Semantic Guardrail

The core question for any task: **does it require judgment, or can it be fully specified?**

| Category | Characteristics | Approach |
|---|---|---|
| **Low-Entropy** | Deterministic output from deterministic input. A human could write a spec that fully covers every case. | Script it. Move it out of LLM instructions. |
| **High-Entropy** | Output depends on context, tone, trade-offs, or novel patterns. No rule set covers all cases. | Keep as LLM skill instruction. |

Scripting High-Entropy tasks produces brittle, wrong outputs. Keeping Low-Entropy tasks in LLM instructions wastes tokens and introduces variance.

## 2. Low-Entropy Tasks (Good Script Candidates)

- Counting files, tokens, lines
- Checking for presence/absence of keys in YAML/JSON frontmatter
- Building a dependency graph by scanning for text patterns
- Validating report structure (mandatory sections, date format)
- File creation from a fixed template
- Running test/lint commands and checking exit codes
- Comparing token counts between reports (delta tracking)

## 3. High-Entropy Tasks (Keep as Skill Instructions)

- Deciding whether a CLAUDE.md section is "earned" context or bloat
- Assessing whether two skills have enough overlap to merge
- Recommending whether a workflow step needs `context: fork`
- Triaging which issues to fix first based on impact vs. effort
- Reviewing whether MEMORY.md entries are still accurate
- Semantic merging of partially-overlapping skill instructions

## 4. Script Design Principles

**Structured output:** Scripts should print JSON. This makes their output parseable and reduces the need for Claude to interpret prose.

**Graceful failure:** Handle missing files or parse errors explicitly. Exit 0 with an `{ "error": "..." }` payload rather than crashing — let Claude decide what to do.

**Self-contained:** Scripts in `scripts/` should have no external dependencies beyond Node.js stdlib. No `npm install` required.

**Scope:** Each script does one thing. Don't combine token counting with linting — separate scripts compose better.

## 5. Dynamic Context Injection (`!command`)

Claude Code skills support a native preprocessing step: prefix a line with `!` followed by a shell command in backticks, and the command runs **before** the skill content reaches Claude. The output replaces the placeholder inline.

This is a Low-Entropy operation — the command must be deterministic. Claude only sees the result, not the command.

```markdown
## Current state
- Branch: !`git branch --show-current`
- Staged files: !`git diff --cached --name-only`
- Open PRs: !`gh pr list --json title,number --limit 5`
```

Use `${CLAUDE_SKILL_DIR}` to reference scripts bundled with the skill regardless of the current working directory:

```markdown
!`node ${CLAUDE_SKILL_DIR}/scripts/gather-context.js`
```

This pattern replaces the need to instruct Claude to run scripts as a first step — the data arrives pre-fetched. Reserve it for stable, fast, deterministic commands. Avoid side-effecting commands here (they run silently before Claude sees anything).

## 6. Shared Utilities

Common helpers (frontmatter parsing, path resolution) that appear in multiple scripts should be extracted into a shared module (e.g., `scripts/utils.js`) rather than copy-pasted. This reduces inconsistency between scripts.
