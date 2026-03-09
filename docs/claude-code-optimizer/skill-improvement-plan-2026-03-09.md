# Skill Improvement Plan — 2026-03-09
**Status:** completed — 2026-03-09
**Supersedes / extends:** `skill-improvement-plan-2026-03-08.md`

> **All 6 passes implemented on 2026-03-09.** Passes 1–5 follow the original plan
> exactly. Pass 6 (Phase G) was added during implementation: self-archiving via
> `archive_audit.js` added to all 7 individual audit skills and `audit-all`, ensuring
> no report is ever silently overwritten regardless of how a skill is invoked.

This plan takes the 2026-03-08 plan as its base and adds two new phases (F1, F2) covering retro-report archiving and date+time stamps in all report content. All other phases (A–E) are carried forward unchanged.

---

## Pass 1 — Phase A: Trivial fixes (all parallel, each touches a different file)

| Item | File | Change |
|---|---|---|
| A1+A2 | `.claude/skills/audit-all/SKILL.md` | Fix "four→five" on lines 18, 29, and in YAML description field |
| A3 | `.claude/skills/sprint-validate/SKILL.md` | Add audit-arch guard after Step 2 |
| A4 | `.claude/skills/sprint-post-code/SKILL.md` | Add 4th parallel read in Setup (sprint-arch-review SKILL.md) |
| A5 | `.claude/skills/sprint-plan/SKILL.md` | Replace open-ended warn with hard `proceed` gate |
| A6 | `.claude/skills/sprint-retro/SKILL.md` | Set `completed` status at close + prompt `update-claude-md` |

---

## Pass 2 — Phase B: Script infrastructure (sequential — B1 before B2)

| Item | Action | Detail |
|---|---|---|
| B1 | Create `.claude/skills/scripts/package.json` | `{ "type": "module" }` |
| B2 | Create `.claude/skills/scripts/archive_audit.js` | ESM, top-level await, no deps. Args: `<source-path> <YYYY-MM-DD> [<archive-dir>]`. Archive-dir defaults to `docs/audits/archive/`. Algorithm: validate args → check source exists → `mkdir -p <archive-dir>` → copy → emit JSON. Exit 0 on no-op, exit 1 on error. |

---

## Pass 3a — Phase D (depends on B, can parallelise with each other)

| Item | File | Change |
|---|---|---|
| D1 | `.claude/skills/sprint-validate/SKILL.md` | Replace Read/Write archive with `archive_audit.js` call; switch audit execution to parallel background agents; add `Bash` + `Agent` to allowed-tools |
| D2 | `.claude/skills/sprint-arch-review/SKILL.md` | Replace archive step with `archive_audit.js` call; fix path bug (`docs/archive/` → `docs/audits/archive/`); add `Bash` to allowed-tools |

---

## Pass 3b — Phase D (independent, all parallel)

| Item | File | Change |
|---|---|---|
| D3 | `.claude/skills/sprint-review/SKILL.md` | Replace full SKILL.md agent prompts with trimmed inline prompts; add explicit "no discussion, return analysis only" instruction |
| D4 | `.claude/skills/sprint-plan/template.md` | Document full status state machine (`draft → ux-reviewed / arch-reviewed → reviewed → finalized → active → completed`) with table of which skill sets each transition |
| D5 | `.claude/skills/sprint-pre-flight/SKILL.md` | Write `docs/sprints/pre-flight-report.md` at end of every run (always overwrite). Report includes: Blockers, Tier recommendation, Audits to run, Recommended skill sequence |
| D5 | `.gitignore` | Add `docs/sprints/pre-flight-report.md` (ephemeral runtime artifact, never commit) |
| D6 | `.claude/skills/sprint-brief/SKILL.md` | Add Setup step: read pre-flight report; hard-stop if missing; require `proceed` if >1 day old; use report to seed discussion and populate `## Audits to run` |
| D7 | `.claude/skills/calma-sync/SKILL.md` | Document base commit detection: read sprint doc for N → scan `git log` → use commit hash just before first "Sprint N" reference → ask user if no clear boundary |

---

## Pass 4 — Phase E: Documentation only (parallel)

| Item | File | Change |
|---|---|---|
| E1 | `.claude/skills/sprint-review/SKILL.md` | Add trade-off note: sprint-review = speed (analysis-only), running individually = depth (full discussion) |
| E2 | `.claude/skills/deploy/SKILL.md` | Add recovery section after Step 10 covering: tag pushed/release failed, commit pushed/tag failed, commit failed, Pages Actions failure |

---

## Pass 5 — Phase F: Retro-report archiving + date/time in reports (unchanged — see above)

---

## Pass 6 — Phase G: Self-archiving in all individual audit skills

**Rationale:** After Pass 5, individual audit skills run standalone (outside `sprint-validate`) still overwrite previous reports without archiving. The script exists and the pattern is established — it should apply everywhere.

**Decision:** Keep `sprint-validate`'s Phase 1 archive step as-is (explicit pre-sprint bulk snapshot, all files archived before any agent starts). Individual skills also self-archive — the second call on the same date is harmless (identical content).

### G1 — Individual audit SKILL.md files: self-archive before writing (all parallel)

Add `Bash(node *)` to `allowed-tools` and insert an archive call in the Output section
(between the `date` step and the write), for each of these files:

| File | Archive call |
|---|---|
| `.claude/skills/audit-colour/SKILL.md` | `archive_audit.js docs/audits/audit-colour.md YYYY-MM-DD` |
| `.claude/skills/audit-typography/SKILL.md` | `archive_audit.js docs/audits/audit-typography.md YYYY-MM-DD` |
| `.claude/skills/audit-interaction/SKILL.md` | `archive_audit.js docs/audits/audit-interaction.md YYYY-MM-DD` |
| `.claude/skills/audit-microcopy/SKILL.md` | `archive_audit.js docs/audits/audit-microcopy.md YYYY-MM-DD` |
| `.claude/skills/audit-arch/SKILL.md` | `archive_audit.js docs/audits/audit-arch.md YYYY-MM-DD` |
| `.claude/skills/audit-design-overall/SKILL.md` | `archive_audit.js docs/audits/audit-design-overall.md YYYY-MM-DD` |
| `.claude/skills/audit-triage/SKILL.md` | `archive_audit.js docs/audits/audit-action-list.md YYYY-MM-DD` |

### G2 — `audit-all/SKILL.md`: archive all 7 output files before Phase 1 (parallel)

Extend the existing "Before Phase 1" step to also archive all 7 output files in parallel
before any agent or in-session phase starts. Add `Bash(node *)` to allowed-tools.

Files to archive: `audit-colour.md`, `audit-typography.md`, `audit-interaction.md`,
`audit-microcopy.md`, `audit-arch.md`, `audit-design-overall.md`, `audit-action-list.md`.

---

### F1 — `retro-report/SKILL.md`: fixed filename + archive (depends on B2)

- Before writing, call: `node .claude/skills/scripts/archive_audit.js docs/retros/retro-report.md YYYY-MM-DD docs/retros/archive/`
- Write to `docs/retros/retro-report.md` (fixed filename, always overwrite — **committed to git**)
- Update YAML `description:` to reflect fixed filename (remove dated-file reference)
- Add `Bash` to `allowed-tools`

### F2 — Date + time in all report contents (all parallel)

**`audit-all/SKILL.md`:** Run `date '+%Y-%m-%d %H:%M'` once at the start, pass the timestamp string into each agent's prompt so agents don't need Bash.

**Individual audit SKILL.md files** (for standalone runs): add `Bash` to `allowed-tools` + one line in Output section: "Run `date '+%Y-%m-%d %H:%M'` and write the result into the `Generated:` field." Affects:
- `.claude/skills/audit-colour/SKILL.md`
- `.claude/skills/audit-typography/SKILL.md`
- `.claude/skills/audit-interaction/SKILL.md`
- `.claude/skills/audit-microcopy/SKILL.md`
- `.claude/skills/audit-arch/SKILL.md`
- `.claude/skills/audit-design-overall/SKILL.md`
- `.claude/skills/audit-triage/SKILL.md`

**`retro-report/SKILL.md`** already gets `Bash` via F1 — same instruction added there.

**Templates** (add or update `Generated: YYYY-MM-DD HH:MM`):

| Template | Change |
|---|---|
| `.claude/skills/audit-colour/template.md` | `Date: [today]` → `Generated: YYYY-MM-DD HH:MM` |
| `.claude/skills/audit-typography/template.md` | Same |
| `.claude/skills/audit-arch/template.md` | Same |
| `.claude/skills/audit-design-overall/template.md` | Same |
| `.claude/skills/audit-triage/template.md` | `Generated: [today]` → `Generated: YYYY-MM-DD HH:MM` |
| `.claude/skills/audit-interaction/template.md` | Add `Generated: YYYY-MM-DD HH:MM` (currently missing) |
| `.claude/skills/audit-microcopy/template.md` | Add `Generated: YYYY-MM-DD HH:MM` (currently missing) |
| `.claude/skills/retro-report/template.md` | `**Generated:** YYYY-MM-DD` → `**Generated:** YYYY-MM-DD HH:MM` |

---

## Files to create or modify

| Action | File | Phase |
|---|---|---|
| Create | `.claude/skills/scripts/package.json` | B1 |
| Create | `.claude/skills/scripts/archive_audit.js` | B2 |
| Modify | `.claude/skills/audit-all/SKILL.md` | A1, A2, F2, G2 |
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
| Modify | `.claude/skills/retro-report/SKILL.md` | F1, F2 |
| Modify | `.claude/skills/audit-colour/SKILL.md` | F2, G1 |
| Modify | `.claude/skills/audit-typography/SKILL.md` | F2, G1 |
| Modify | `.claude/skills/audit-interaction/SKILL.md` | F2, G1 |
| Modify | `.claude/skills/audit-microcopy/SKILL.md` | F2, G1 |
| Modify | `.claude/skills/audit-arch/SKILL.md` | F2, G1 |
| Modify | `.claude/skills/audit-design-overall/SKILL.md` | F2, G1 |
| Modify | `.claude/skills/audit-triage/SKILL.md` | F2, G1 |
| Modify | `.claude/skills/audit-colour/template.md` | F2 |
| Modify | `.claude/skills/audit-typography/template.md` | F2 |
| Modify | `.claude/skills/audit-interaction/template.md` | F2 |
| Modify | `.claude/skills/audit-microcopy/template.md` | F2 |
| Modify | `.claude/skills/audit-arch/template.md` | F2 |
| Modify | `.claude/skills/audit-design-overall/template.md` | F2 |
| Modify | `.claude/skills/audit-triage/template.md` | F2 |
| Modify | `.claude/skills/retro-report/template.md` | F2 |
| Modify | `.gitignore` | D5 |
| Runtime artifact | `docs/sprints/pre-flight-report.md` | D5 — ephemeral, not committed |
| Persistent artifact | `docs/retros/retro-report.md` | F1 — fixed filename, committed |

**Total: 2 new files, 29 modified files.** (G1/G2 modify files already counted above)

---

## Priority order for implementation

| Priority | Item | Phase | Pass |
|---|---|---|---|
| Do first | audit-all count bugs (A1, A2) | A | 1 |
| Do first | audit-arch guard in sprint-validate (A3) | A | 1 |
| Do first | sprint-post-code Setup parallel read (A4) | A | 1 |
| High | sprint-plan hard gate (A5) | A | 1 |
| High | sprint-retro: completed status + update-claude-md prompt (A6) | A | 1 |
| High | archive_audit.js script with optional archive-dir arg (B1, B2) | B | 2 |
| High | sprint-validate: archive script + parallel execution (D1) | D | 3a |
| High | sprint-arch-review: archive script + path fix (D2) | D | 3a |
| Medium | sprint-review: trimmed agent prompts (D3) | D | 3b |
| Medium | Sprint status lifecycle: document in template (D4) | D | 3b |
| Medium | sprint-pre-flight: write pre-flight report (D5) | D | 3b |
| Medium | sprint-brief: read pre-flight report, staleness check (D6) | D | 3b |
| Medium | calma-sync: base commit detection (D7) | D | 3b |
| Low | sprint-review: trade-off note (E1) | E | 4 |
| Low | deploy: recovery section (E2) | E | 4 |
| Medium | retro-report: fixed filename + archive via script (F1) | F | 5 |
| Medium | Date + time in all report templates and skill instructions (F2) | F | 5 |
| Medium | Self-archiving in individual audit skills standalone runs (G1) | G | 6 |
| Medium | audit-all: archive all outputs before Phase 1 (G2) | G | 6 |
