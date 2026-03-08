# High-Priority Scripts Implementation Plan
**Date:** 2026-03-08 12:11
**Status:** planned

---

## Overview

Two shared utility scripts to eliminate duplicated Low-Entropy logic across the skill library.

**Location:** `.claude/skills/scripts/` (new shared directory, sibling to individual skill directories)
**New file needed:** `.claude/skills/scripts/package.json` with `"type": "module"`

---

## Script 1: `find_active_sprint.js`

### Invocation
```bash
node .claude/skills/scripts/find_active_sprint.js [--mode=active|latest|brief|next-number]
```

### Modes
| Mode | Returns | Used by |
|---|---|---|
| `active` (default) | Highest-numbered sprint doc with `**Status:** active` | sprint-kickoff, sprint-validate, sprint-arch-review, sprint-qa, sprint-post-code, calma-sync |
| `latest` | Highest-numbered sprint doc regardless of status | sprint-retro, sprint-pre-flight, sprint-plan |
| `brief` | Highest-numbered `-brief.md` | sprint-ux, sprint-arch, sprint-review |
| `next-number` | Next sprint number (int) | sprint-brief, sprint-plan |

### Output (JSON to stdout)

Success:
```json
{
  "path": "docs/sprints/sprint-07.md",
  "number": 7,
  "status": "active",
  "theme": "Accessibility & Typography Baseline"
}
```

No match (`path: null` is not an error — skills must check and halt gracefully):
```json
{ "path": null, "number": null, "status": null, "theme": null }
```

For `--mode=next-number`:
```json
{ "nextNumber": 8, "lastFile": "docs/sprints/sprint-07.md" }
```

Error:
```json
{ "error": "..." }
```
+ `process.exit(1)`

### Algorithm
1. Parse `--mode` from `process.argv`, default to `active`, validate against allowed values
2. Determine regex: `^sprint-\d{2}\.md$` for `active`/`latest`/`next-number`; `^sprint-\d{2}-brief\.md$` for `brief`
3. `readdir docs/sprints/`, filter by regex, sort descending (lexicographic works for zero-padded two-digit numbers)
4. Branch by mode:
   - `latest` / `brief`: take first file
   - `active`: iterate from highest to lowest, read each, check `/^\*\*Status:\*\*\s*active$/m`, return first match
   - `next-number`: take first file, parse number, add 1
5. For `active` and `latest`: extract `number` from filename, `theme` from H1 (`/^# Sprint \d+ — (.+)$/m`), `status` from Status line
6. Emit JSON

### Error cases
- `docs/sprints/` does not exist → `{ path: null, ... }` (exit 0)
- No files match → `{ path: null, ... }` (exit 0)
- Unknown `--mode` → exit 1 with error JSON
- File read failure → exit 1 with error JSON

### Affected skill files (13 total)
All of these replace their manual glob/sort/read block with a single Bash call:

| Skill | Mode | Replacement instruction |
|---|---|---|
| `sprint-kickoff` | `active` | `node .claude/skills/scripts/find_active_sprint.js` |
| `sprint-validate` | `active` | same |
| `sprint-arch-review` | `active` | same |
| `sprint-qa` | `active` | same |
| `sprint-post-code` | `active` | same |
| `calma-sync` | `active` | same |
| `sprint-retro` | `latest` | `node .claude/skills/scripts/find_active_sprint.js --mode=latest` |
| `sprint-pre-flight` | `latest` | same |
| `sprint-plan` | `latest` | same |
| `sprint-ux` | `brief` | `node .claude/skills/scripts/find_active_sprint.js --mode=brief` |
| `sprint-arch` | `brief` | same |
| `sprint-review` | `brief` | same |
| `sprint-brief` | `next-number` | `node .claude/skills/scripts/find_active_sprint.js --mode=next-number` |

**Replacement text for `active` pattern in skill Setup sections:**

Replace:
> List `docs/sprints/sprint-[0-9][0-9].md`, sort, take the latest with status `active`

With:
> Run `node .claude/skills/scripts/find_active_sprint.js` — if `path` is `null`, stop with the no-active-sprint message

---

## Script 2: `archive_audit.js`

### Invocation
```bash
node .claude/skills/scripts/archive_audit.js <source-path> <YYYY-MM-DD>
```

Both arguments are required.

### Output (JSON to stdout)

Success:
```json
{
  "archived": true,
  "source": "docs/audits/audit-colour.md",
  "destination": "docs/audits/archive/audit-colour-2026-03-08.md"
}
```

No-op (source missing — not an error):
```json
{ "archived": false, "source": "docs/audits/audit-colour.md", "reason": "source file does not exist" }
```

Error:
```json
{ "error": "..." }
```
+ `process.exit(1)`

### Algorithm
1. Parse `process.argv[2]` as `sourcePath`, `process.argv[3]` as `date`
2. Validate both present; validate date matches `/^\d{4}-\d{2}-\d{2}$/`
3. `existsSync(sourcePath)` → if false, emit `{ archived: false }` and exit 0
4. Derive destination:
   - `basename = path.basename(sourcePath, '.md')` → e.g. `audit-colour`
   - `destDir = path.join(path.dirname(sourcePath), 'archive')`
   - `destPath = path.join(destDir, `${basename}-${date}.md`)`
5. `fs.mkdir(destDir, { recursive: true })`
6. `fs.readFile(sourcePath, 'utf8')` → `fs.writeFile(destPath, content, 'utf8')`
7. Emit success JSON

### Error cases
- Missing args → exit 1 with error JSON
- Invalid date format → exit 1 with error JSON
- Source missing → exit 0 with `{ archived: false }` (non-error)
- Directory creation or file I/O failure → exit 1 with error JSON

### Affected skill files (2 total)

**`sprint-validate/SKILL.md`** — Phase 1, archive step:

Replace:
> For each audit to run, if the audit file already exists, Read `docs/audits/audit-[name].md` and Write its contents to `docs/audits/archive/audit-[name]-YYYY-MM-DD.md`.

With:
> For each audit to run, run:
> `node .claude/skills/scripts/archive_audit.js docs/audits/audit-[name].md YYYY-MM-DD`
> If `archived: true`, report the destination. If `archived: false`, note "no pre-sprint baseline for [name]".

**`sprint-arch-review/SKILL.md`** — Phase 4, archive step:

Replace:
> If `docs/audit-arch.md` exists, Write its contents to `docs/archive/audit-arch-YYYY-MM-DD.md`.

With:
> Run: `node .claude/skills/scripts/archive_audit.js docs/audits/audit-arch.md YYYY-MM-DD`
> If `archived: true`, report the destination. If `archived: false`, note "No pre-sprint architecture audit baseline."

**Note:** This also fixes a path bug — `sprint-arch-review` currently archives to `docs/archive/` (non-existent). The script normalises all audit archives to `docs/audits/archive/`.

---

## Shared Conventions (must match existing optimizer scripts)

- `#!/usr/bin/env node` shebang
- ES module syntax (`import fs from 'fs/promises'`, `import { existsSync } from 'fs'`, `import path from 'path'`)
- Top-level `await`, no wrapper async function
- JSDoc `@fileoverview` block with usage line
- All output: `console.log(JSON.stringify(result, null, 2))`
- All errors: `console.error(JSON.stringify({ error: '...' }))` + `process.exit(1)`
- No third-party dependencies
- Reference implementations: `delta_tracker.js` (single-arg + early validation pattern), `token_counter.js` (directory traversal + complex JSON output)

## Files to Create / Modify

| Action | Path |
|---|---|
| Create | `.claude/skills/scripts/package.json` |
| Create | `.claude/skills/scripts/find_active_sprint.js` |
| Create | `.claude/skills/scripts/archive_audit.js` |
| Modify | `.claude/skills/sprint-kickoff/SKILL.md` |
| Modify | `.claude/skills/sprint-validate/SKILL.md` |
| Modify | `.claude/skills/sprint-arch-review/SKILL.md` |
| Modify | `.claude/skills/sprint-qa/SKILL.md` |
| Modify | `.claude/skills/sprint-post-code/SKILL.md` |
| Modify | `.claude/skills/calma-sync/SKILL.md` |
| Modify | `.claude/skills/sprint-retro/SKILL.md` |
| Modify | `.claude/skills/sprint-pre-flight/SKILL.md` |
| Modify | `.claude/skills/sprint-plan/SKILL.md` |
| Modify | `.claude/skills/sprint-ux/SKILL.md` |
| Modify | `.claude/skills/sprint-arch/SKILL.md` |
| Modify | `.claude/skills/sprint-review/SKILL.md` |
| Modify | `.claude/skills/sprint-brief/SKILL.md` |
