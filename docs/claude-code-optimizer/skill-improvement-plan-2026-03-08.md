# Skill Improvement Plan — 2026-03-08
**Status:** planned
**Supersedes:** `workflow-skill-evaluation-2026-03-08-1130.md` (strategy) + `scripts-impl-plan-2026-03-08-1211.md` (scripts)

---

## How this plan was built

The evaluation report identified 7 inconsistencies, 6 token-efficiency gaps, and 6 automation opportunities. The scripts plan proposed two shared utility scripts. After reviewing both, `find_active_sprint.js` was rejected: it would have updated 13 skill files to replace natural-language instructions that already work reliably, adding a new failure mode (node path, working directory, script bugs) with no evidence of actual failures to fix. `archive_audit.js` was kept: it fixes a real path bug, handles `mkdir -p` safely, and enables parallel archiving for D1. This document merges the remaining items, fills in gaps from both reports, and corrects one additional bug found during direct file inspection.

---

## One conflict resolved

The evaluation (§4.3) recommends running `sprint-validate` audits **in parallel** for a 4× speed improvement. `archive_audit.js` is exactly what makes safe parallel archiving possible — each audit's archive is an independent atomic script call. The two changes are synergistic: archive in parallel (Phase 1), then run audits in parallel (Phase 2). The existing "not in parallel" rationale in `sprint-validate/SKILL.md` will be removed.

---

## One additional bug found

Reading `audit-all/SKILL.md` directly revealed a **second** inconsistency the evaluation missed:

- Line 18: "spawn **four** background agents" (should be five) — already caught
- Line 29: "confirm all **four** output files exist" (should be five) — new finding

Both are fixed in Phase A below.

---

## Phases

Ordered by: fix correctness first → build infrastructure → improve logic → document.

---

### Phase A — Trivial fixes (no dependencies, do first)

Text and logic changes only, each touching one file. No scripts needed.

#### A1. `audit-all/SKILL.md` — two count bugs

| Location | Current | Fix |
|---|---|---|
| Line 18 | "spawn **four** background agents" | → "spawn **five** background agents" |
| Line 29 | "confirm all **four** output files exist" | → "confirm all **five** output files exist" |

#### A2. `audit-all/SKILL.md` — description field count bug

The YAML `description:` says "four design + one architecture". Change to "five audits (four design + one architecture)".

#### A3. `sprint-validate/SKILL.md` — add audit-arch guard

After the "Identify which audits to run" block (Step 2), add:

> **Guard:** `audit-arch` must never appear in the "Audits to run" list — it is always handled by `sprint-arch-review`. If the list contains `audit-arch`, remove it and note: "audit-arch is excluded from sprint-validate; it runs via sprint-arch-review."

#### A4. `sprint-post-code/SKILL.md` — add sprint-arch-review to Setup parallel reads

Setup currently reads three things in parallel: sprint doc, sprint-validate SKILL.md, sprint-qa SKILL.md. Add sprint-arch-review SKILL.md to that parallel batch, eliminating a serial read at the start of Phase 1.

Replace:
> "Perform all three reads in parallel"

With:
> "Perform all four reads in parallel:
> - ...sprint doc...
> - `.claude/skills/sprint-validate/SKILL.md`
> - `.claude/skills/sprint-qa/SKILL.md`
> - `.claude/skills/sprint-arch-review/SKILL.md` (used in Phase 1)"

#### A5. `sprint-plan/SKILL.md` — harden the unreviewed-brief check

Current: warns and asks "Proceed anyway, or run the missing review first?" — open-ended, user can dismiss it without acknowledging.

Replace with a hard gate requiring explicit acknowledgement:

> If Status is `draft`, `ux-reviewed`, or `arch-reviewed`:
> Print: "⚠ Brief status is [X] — not all reviews are complete. Proceeding will skip the missing review and may produce an incomplete sprint doc. Type `proceed` to continue anyway, or run the missing review first."
> Wait for user input. Only continue if the user types `proceed`.

#### A6. `sprint-retro/SKILL.md` — mark sprint completed + prompt update-claude-md

At the **Closing** step, before the final message:
1. Edit the sprint doc's `**Status:**` field to `completed`.
2. Add to the closing message:
   > "Session learnings are fresh — run `/update-claude-md` now to capture any new patterns, gotchas, or corrections before you close this session."

This fixes the `sprint-retro` "looking for completed sprint" reference (evaluation §3.2) and the missing `update-claude-md` trigger (evaluation §5.6) in one edit.

---

### Phase B — Script infrastructure

One shared utility script. Self-contained; no skill file updates required to take effect.

#### B1. Create `.claude/skills/scripts/package.json`

```json
{ "type": "module" }
```

#### B2. Create `.claude/skills/scripts/archive_audit.js`

- **Invocation:** `node .claude/skills/scripts/archive_audit.js <source-path> <YYYY-MM-DD>`
- **Output (success):** `{ "archived": true, "source": "...", "destination": "docs/audits/archive/audit-colour-2026-03-08.md" }`
- **Output (no-op):** `{ "archived": false, "source": "...", "reason": "source file does not exist" }` — exit 0
- **Output (error):** `{ "error": "..." }` — exit 1
- **Algorithm:** validate args → check source exists → `mkdir docs/audits/archive/ -p` → copy file → emit JSON
- **Also fixes:** `sprint-arch-review` currently archives to `docs/archive/` (path does not exist). This script normalises all audit archives to `docs/audits/archive/`.
- **Conventions:** ESM, top-level await, JSDoc `@fileoverview`, no third-party deps. Match style of `delta_tracker.js` in the claude-code-optimizer scripts.

Applied to two skills (Phase D1 and D2):
- `sprint-validate/SKILL.md` Phase 1 archive step
- `sprint-arch-review/SKILL.md` Phase 4 archive step

---

### Phase D — Logic improvements

#### D1. `sprint-validate/SKILL.md` — parallel audit execution + use archive script

**Phase 1 (archive) — replace Read/Write with script, run in parallel:**

Replace:
> For each audit to run, if the audit file already exists: Read `docs/audits/audit-[name].md` and Write its contents to `docs/audits/archive/audit-[name]-YYYY-MM-DD.md`

With:
> For each audit to run, run the following in parallel (one call per audit):
> `node .claude/skills/scripts/archive_audit.js docs/audits/audit-[name].md YYYY-MM-DD`
> If `archived: true`, report the destination. If `archived: false`, note "no pre-sprint baseline for [name]".

**Phase 2 (run audits) — parallel background agents:**

Replace:
> Run them sequentially (not in parallel…)

With:
> Spawn one background agent per audit simultaneously, each following the instructions from its SKILL.md. Wait for all to complete before Phase 3.

**Tool permissions:** Add `Bash` (for the script) and `Agent` (for parallel agents) to `allowed-tools`.

#### D2. `sprint-arch-review/SKILL.md` — use archive script + fix path bug

Replace the archive step in Phase 4:
> If `docs/audit-arch.md` exists, Write its contents to `docs/archive/audit-arch-YYYY-MM-DD.md`

With:
> Run: `node .claude/skills/scripts/archive_audit.js docs/audits/audit-arch.md YYYY-MM-DD`
> If `archived: true`, report the destination. If `archived: false`, note "No pre-sprint architecture audit baseline."

**Tool permissions:** Add `Bash` to `allowed-tools` if not already present.

#### D3. `sprint-review/SKILL.md` — fix agent analysis-only mode

The skill already instructs agents to produce "only the written analysis" — but agents receive the full `sprint-ux/SKILL.md` and `sprint-arch/SKILL.md`, which contain interactive discussion phases. The conflict means the agents' built-in instructions can win.

**Fix:** Do not pass the full SKILL.md files as agent prompts. Construct trimmed prompts inline in sprint-review's SKILL.md containing only: read brief → read relevant codebase files → produce written findings. Explicitly include: "Do not engage in discussion. Do not update the brief. Return only the written analysis as your response."

#### D4. Sprint status lifecycle — define and enforce

No skill currently sets `completed`. `sprint-retro` searches for "latest completed sprint" but the status never exists.

Document the full state machine in `sprint-plan/template.md`:

```
draft → ux-reviewed / arch-reviewed → reviewed → finalized → active → completed
```

| Transition | Set by |
|---|---|
| `draft` | sprint-brief |
| `ux-reviewed` | sprint-ux |
| `arch-reviewed` | sprint-arch |
| `reviewed` | sprint-review |
| `finalized` | sprint-plan (brief file) |
| `active` | sprint-plan (sprint doc) |
| `completed` | sprint-retro ← fixed by A6 |

`sprint-kickoff` finds sprints with status `active` — after retro sets `completed`, old sprints are no longer matched. Correct behaviour.

#### D5. `sprint-pre-flight/SKILL.md` — write pre-flight report

Instead of producing conversational-only output, sprint-pre-flight now writes `docs/sprints/pre-flight-report.md` at the end of every run, always overwriting any previous report.

**Report structure:**

```markdown
# Pre-flight Report
**Generated:** YYYY-MM-DD HH:MM
**Sprint:** N+1 (next)

## Blockers
### From last sprint retro
[Unresolved items, or "None"]
### From audit findings (critical + high)
[Open findings with severity and source, or "None"]

## Tier recommendation
Tier [1 / 2 / 3] — [one-line rationale]

## Audits to run
[Comma-separated list relevant to the sprint scope, e.g. "colour, typography"]
(For Tier 1: all four design audits unless scope is clearly narrower.
 For Tier 2: only audits relevant to the changes planned.
 For Tier 3: none.)

## Recommended skill sequence
Planning:   [exact skills]
Execution:  [exact skills]
Closure:    [exact skills]
```

This replaces the previous manual instruction to users to write "Audits to run" themselves (the old D5 fix). The field is now written by pre-flight and flows automatically into sprint-brief (D6) → sprint-plan → sprint-validate.

#### D6. `sprint-brief/SKILL.md` — read pre-flight report as context, with staleness check

Add a Setup step before the brief discussion begins:

1. Read `docs/sprints/pre-flight-report.md`.
   - If not found: stop with "No pre-flight report found. Run `/sprint-pre-flight` first."
   - If `Generated` date is older than 1 day: stop with "Pre-flight report is from [date] — findings may be stale. Re-run `/sprint-pre-flight` to refresh it, or type `proceed` to continue with the existing report."

2. Use the report to seed the brief discussion:
   - If blockers are listed, surface them early: "Before we scope the sprint, there are N open items from the last retro/audits: [list]. Do you want to address any of these, or defer them?"
   - Include the "Audits to run" field from the report in the brief doc under the `## Audits to run` section — sprint-plan will carry it forward to the sprint doc.

3. Use the tier recommendation as a starting point for scope discussion, not a hard constraint — the brief conversation may revise it.

This also means sprint-brief no longer needs to read audit files or the last retro directly: the pre-flight report is the single source of that context.

#### D7. `calma-sync/SKILL.md` — document base commit detection

The skill references `git diff [base]..HEAD` without explaining how `[base]` is determined. Add the same detection logic used in `sprint-arch-review`:

> To find the base commit:
> 1. Read the sprint doc to find the sprint number (N)
> 2. Run `git log --oneline` and find the commit just before the first commit referencing "Sprint N" or the sprint theme
> 3. Use that commit hash as `[base]`
> 4. If no clear boundary is found, ask the user to provide the base commit hash

---

### Phase E — Documentation only

No code or logic changes.

#### E1. `sprint-review/SKILL.md` — document trade-off vs. running UX + Arch individually

Add a note after the description:

> **Trade-off vs. running individually:** `/sprint-review` runs UX and Arch in analysis-only mode (no discussion phase) and adds a mediation step. Running `/sprint-ux` then `/sprint-arch` separately gives a full discussion phase per review. Choose sprint-review when you want speed; choose individually when you want depth.

#### E2. `deploy/SKILL.md` — add recovery section

After Step 10, add:

> **If deployment fails mid-way:**
> - Tag pushed, release failed: run `gh release create` again with the same tag (idempotent).
> - Commit pushed, tag failed: run `git tag -a v{version} -m "v{version}"` then `git push origin v{version}`.
> - Commit failed: working tree changes are local; re-run from Step 9.
> - GitHub Pages Actions failure: check the Actions tab — it usually self-heals on retry.

---

## Files to create or modify

| Action | File | Phase |
|---|---|---|
| Create | `.claude/skills/scripts/package.json` | B1 |
| Create | `.claude/skills/scripts/archive_audit.js` | B2 |
| Modify | `.claude/skills/audit-all/SKILL.md` | A1, A2 |
| Modify | `.claude/skills/sprint-validate/SKILL.md` | A3, D1 |
| Modify | `.claude/skills/sprint-post-code/SKILL.md` | A4 |
| Modify | `.claude/skills/sprint-plan/SKILL.md` | A5 |
| Modify | `.claude/skills/sprint-retro/SKILL.md` | A6 |
| Modify | `.claude/skills/sprint-arch-review/SKILL.md` | D2 |
| Modify | `.claude/skills/sprint-review/SKILL.md` | D3, E1 |
| Modify | `.claude/skills/sprint-plan/template.md` | D4 |
| Modify | `.claude/skills/sprint-pre-flight/SKILL.md` | D5 |
| Modify | `.claude/skills/sprint-brief/SKILL.md` | D6 |
| Modify | `.claude/skills/calma-sync/SKILL.md` | D7 |
| Modify | `.claude/skills/deploy/SKILL.md` | E2 |
| Runtime artifact | `docs/sprints/pre-flight-report.md` | D5 — written by sprint-pre-flight, read by sprint-brief; always overwritten, not committed |
| Modify | `.gitignore` | D5 — add `docs/sprints/pre-flight-report.md` to prevent accidental commits |

**Total: 2 new files, 12 modified files.**

---

## Priority order for implementation

| Priority | Item | Phase | Effort |
|---|---|---|---|
| Do first | audit-all count bugs (A1, A2) | A | Trivial |
| Do first | audit-arch guard in sprint-validate (A3) | A | Trivial |
| Do first | sprint-post-code Setup parallel read (A4) | A | Trivial |
| High | sprint-plan hard gate (A5) | A | Low |
| High | sprint-retro: completed status + update-claude-md prompt (A6) | A | Low |
| High | archive_audit.js script (B1, B2) | B | Low |
| High | sprint-validate: archive script + parallel execution (D1) | D | Low |
| High | sprint-arch-review: archive script + path fix (D2) | D | Trivial |
| Medium | sprint-review: trimmed agent prompts (D3) | D | Medium |
| Medium | Sprint status lifecycle: document in template (D4) | D | Low |
| Medium | sprint-pre-flight: write pre-flight report (D5) | D | Low |
| Medium | sprint-brief: read pre-flight report, staleness check (D6) | D | Low |
| Medium | calma-sync: base commit detection (D7) | D | Low |
| Low | sprint-review: trade-off note (E1) | E | Trivial |
| Low | deploy: recovery section (E2) | E | Low |

---

## What was deliberately excluded

Items from the evaluation and scripts plan that are low-ROI, premature, or out of scope:

- **`find_active_sprint.js`** — would update 13 skill files to replace natural-language instructions that already work reliably. No evidence of actual sprint-discovery failures. Adds a new failure mode (node path, cwd, script bugs) with no upside at current project scale.
- **§4.1 Pass shared context to agents** — meaningful savings only at Sprint 20+; adds prompt complexity now. Defer.
- **§4.2 sprint-arch-review smart diff reads** — premature optimisation.
- **§4.5 retro-report incremental reads** — defer until Sprint 20+.
- **§4.6 Inline templates in SKILL.md** — reduces readability for marginal token savings.
- **§5.1 Auto-kickoff at session start** — desirable but requires hook infrastructure not yet in place.
- **§5.3 sprint-pre-flight Tier detection from draft brief** — the interactive Q&A is useful for surfacing ambiguities.
- **§5.4 project-health on a schedule** — the loop skill handles this; out of scope for skill edits.
- **§5.5 Lint/test pre-commit hook** — git configuration change, not a skill change.
- **§6.1 audit-triage deduplication spec** — valid but low impact at current scale.
- **§6.3 calma-sync HTML/MD sync** — intentional design; a clearer warning is sufficient (not tracked here).
