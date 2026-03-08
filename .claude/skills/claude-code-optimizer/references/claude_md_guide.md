# Claude Code: CLAUDE.md & Memory Reference

## 1. What Gets Loaded Every Session

| Source | Loaded | Notes |
|---|---|---|
| Managed policy `CLAUDE.md` | Always | Cannot be excluded. Org-wide instructions. |
| `CLAUDE.md` / `.claude/CLAUDE.md` (project) | Always (in full) | Primary project instructions |
| `CLAUDE.local.md` (project) | Always (in full) | Personal per-project preferences. Not checked into git. |
| `CLAUDE.md` in parent directories (up to `~`) | Always (in full) | Cascading — each ancestor's file adds to context |
| `~/.claude/CLAUDE.md` | Always (in full) | Personal preferences across all projects |
| `.claude/rules/*.md` (no `paths` frontmatter) | Always | Unconditional rules |
| `.claude/rules/*.md` (with `paths` frontmatter) | On demand | Only loaded when Claude reads matching files |
| `~/.claude/projects/<id>/memory/MEMORY.md` | Always (first 200 lines) | Auto-memory index — lines after 200 are not loaded at session start |
| Auto-memory topic files (`debugging.md`, etc.) | On demand | Claude reads them during a session when needed, not at startup |
| Skill descriptions (no `disable-model-invocation`) | Always | Injected for auto-triggering, subject to 16K char budget |
| `SessionStart` hook stdout | Always | Dynamic context injection |

**CLAUDE.md files have no hard line limit and load in full.** The 200-line limit applies only to `MEMORY.md`. However, the official guidance is to target under 200 lines per file — longer files reduce adherence (not because they're truncated, but because dense context is harder to follow reliably).

Subdirectory `CLAUDE.md` files (below the working directory) are discovered but **load on demand** — only when Claude reads files in those subdirectories, not at session start.

## 2. CLAUDE.md File Locations

| Scope | Path | Shared? |
|---|---|---|
| Managed policy | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`<br>Linux/WSL: `/etc/claude-code/CLAUDE.md` | All users on machine |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team via source control |
| Local (project) | `./CLAUDE.local.md` | Just you, auto-added to `.gitignore` |
| User (personal) | `~/.claude/CLAUDE.md` | Just you, all projects |

## 3. CLAUDE.md Best Practices

**Target under 200 lines per file.** Longer files consume more context and reduce adherence. Split using `@path` imports or `.claude/rules/` files.

**Import additional files with `@path` syntax:**
```
See @README for project overview.

# Workflows
- git workflow: @docs/git-instructions.md
```
Imported files are expanded at launch. Max import depth: 5 hops. Both relative and absolute paths work.

**Earned Context:** A rule earns its space if removing it would cause Claude to behave incorrectly. Critical constraints, data model rules, and navigation patterns are earned. General programming advice Claude already knows is not.

**Progressive Disclosure:** Move deep documentation into skill `references/` dirs. CLAUDE.md should say "see `/sprint-pre-flight`" not embed the entire sprint checklist.

**Exclude files you don't need** (`claudeMdExcludes` in settings):
```json
{ "claudeMdExcludes": ["**/other-team/CLAUDE.md"] }
```

## 4. `.claude/rules/` — Path-Scoped Rules

For larger projects, split instructions into topic files under `.claude/rules/`. Rules without `paths` frontmatter load unconditionally (same priority as `.claude/CLAUDE.md`). Rules with `paths` load only when Claude works with matching files:

```markdown
---
paths:
  - "src/api/**/*.ts"
---
# API rules — only loads when Claude reads TypeScript files under src/api/
```

User-level rules at `~/.claude/rules/` apply to every project.

## 5. Auto-Memory

Auto-memory lets Claude save notes across sessions without you writing anything. Enabled by default. Disable with `autoMemoryEnabled: false` in settings or `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`.

### Storage structure

```
~/.claude/projects/<project>/memory/
├── MEMORY.md          # Concise index — first 200 lines loaded every session
├── debugging.md       # Detail file — loaded on demand
└── patterns.md        # Detail file — loaded on demand
```

The `<project>` path is derived from the git repository root, so all worktrees share one auto-memory directory.

**MEMORY.md** is an index. Claude keeps it concise by moving detailed notes into topic files. Only the first 200 lines of `MEMORY.md` load at session start. Topic files are NOT loaded at startup — Claude reads them on demand during a session when it needs the information.

### What belongs in MEMORY.md vs. topic files

**MEMORY.md (index):** Short entries pointing to topic files. Build commands, key debugging insights, confirmed preferences, architectural patterns.

**Topic files (detail):** Extended notes Claude might need during a specific kind of work. `debugging.md` for recurring bug patterns, `api-conventions.md` for API design decisions.

### Best practices

- Write semantically, not chronologically. Group by topic, not by session. Update stale entries — don't append.
- Don't duplicate CLAUDE.md. CLAUDE.md is for rules; MEMORY.md is for learnings.
- Speculative conclusions from a single session don't belong here.

## 6. Pruning Checklist

When auditing CLAUDE.md or MEMORY.md, flag content that:
- Duplicates the other file (one source of truth per rule vs. learning)
- Describes a resolved bug or one-off workaround
- Is general programming advice Claude already knows
- Has grown beyond 200 lines without splitting into imports or rules
- Could live in a skill reference and be accessed only when needed
