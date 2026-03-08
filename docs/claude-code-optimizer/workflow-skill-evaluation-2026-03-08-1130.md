# Workflow & Skill Evaluation — 2026-03-08

Evaluation of all 25 skills in `.claude/skills/` against `docs/workflow.md` and `docs/sprint-tier-guide.md`. Covers inter-skill interactions, inconsistencies, token efficiency, and automation opportunities.

---

## 1. Overall Assessment

The architecture is solid. The tier system, the separation between planning/execution/closure, and the orchestrator pattern (`sprint-post-code`, `sprint-review`, `audit-all`) are well-designed. The main problems are: (a) a few concrete inconsistencies between skills, (b) significant token waste in repeated reads, and (c) the workflow is almost entirely manual — every step requires the user to remember the next command.

---

## 2. Inter-Skill Data Flow

The critical shared data structures:

| Resource | Written by | Read by |
|---|---|---|
| `sprint-NN-brief.md` | sprint-brief, sprint-ux, sprint-arch, sprint-review | sprint-plan, sprint-arch |
| `sprint-NN.md` | sprint-plan | sprint-kickoff, sprint-post-code, sprint-validate, sprint-arch-review, sprint-qa, calma-sync, sprint-retro |
| `docs/audits/audit-*.md` | audit-* skills | sprint-validate, sprint-arch-review, sprint-pre-flight, audit-triage |
| `docs/audits/audit-action-list.md` | audit-triage | sprint-pre-flight |
| `CLAUDE.md` | update-claude-md, sprint-arch-review | nearly every skill |
| `docs/calma-design-language.md` | calma-sync | sprint-ux, sprint-arch, calma-sync, project-health |

The sprint doc is the central shared state — it grows as sections are appended by each skill. Skills that read it late in the cycle (sprint-retro, deploy) are reading a large composite document. No skill summarises or prunes it.

---

## 3. Inconsistencies Found

### 3.1 `audit-all` counts agents incorrectly
`SKILL.md` says "spawn **four** background agents simultaneously" but the table has **five** rows (colour, typography, interaction, microcopy, arch). The text and the table disagree.

**Fix:** Change "four" to "five" in the prose.

---

### 3.2 Sprint doc `Status` lifecycle is undocumented
Status values set across skills: `draft` (sprint-brief) → `arch-reviewed` / `reviewed` (sprint-arch / sprint-review) → `finalized` (sprint-plan) → `active` (sprint-plan template) → ??? (nothing sets `completed`).

- `sprint-retro` looks for "latest completed sprint doc" — but nothing ever writes `completed`.
- `deploy` says nothing about updating sprint status.
- `sprint-kickoff` looks for `active` status — will it keep finding old sprints after retro?

**Fix:** Define the full status lifecycle in one place (the sprint-plan template), and have `deploy` or `sprint-retro` set status to `completed`.

---

### 3.3 Arch audit is run twice in a full pipeline
In `sprint-post-code`:
- `sprint-arch-review` (Phase 4) **always** archives and re-runs `audit-arch`.
- `sprint-validate` runs audits from the "Audits to run" list — if this list includes `audit-arch`, the arch audit runs **twice**, with the second silently overwriting the first.

**Fix:** Document explicitly that `audit-arch` must never appear in the "Audits to run" list (it is always handled by sprint-arch-review). Add a guard in sprint-validate's instructions.

---

### 3.4 "Audits to run" field: who writes it for Tier 2?
For Tier 1: `sprint-ux` writes the "Audits to run" field to the sprint brief → `sprint-plan` carries it to the sprint doc → `sprint-validate` reads it.

For Tier 2: `sprint-ux` is skipped. `sprint-pre-flight` says it "infers which audits apply" and recommends them — but this recommendation is conversational output, not written to the sprint doc. The user must manually write this field into the brief they write by hand.

If they forget, `sprint-validate` falls back to running all four design audits — defeating the purpose of targeted Tier 2 audits.

**Fix:** `sprint-pre-flight` should explicitly instruct the user to write the inferred "Audits to run" into the brief before running `sprint-plan`, OR `sprint-plan` should carry it from pre-flight's output.

---

### 3.5 `sprint-review` runs an undocumented "analysis-only" mode
`sprint-review` spawns sprint-ux and sprint-arch as background agents with "analysis only, no discussion." But sprint-ux and sprint-arch's own SKILL.md files contain discussion phases (step 4 in both). The agents receive the full SKILL.md as their prompt and will try to follow discussion instructions they cannot complete as background agents.

**Fix:** Either give sprint-review trimmed prompts that explicitly skip the discussion phase, or add an "When called in analysis-only mode: skip step 4" section to sprint-ux and sprint-arch SKILL.md files.

---

### 3.6 `calma-sync` doesn't document how it finds the base commit
`sprint-arch-review` finds the base commit via `git log` looking for the commit before the sprint started. `calma-sync` also needs to diff sprint changes but its SKILL.md just says "get sprint changes: `git diff [base]..HEAD`" without explaining how `[base]` is determined.

**Fix:** Add the same base-commit-detection logic from sprint-arch-review to calma-sync (or have calma-sync explicitly reference how sprint-arch-review does it).

---

### 3.7 `sprint-plan` warns but proceeds without full review
If the sprint brief doesn't have `reviewed` or `arch-reviewed` status, sprint-plan "warns" but writes the sprint doc anyway. This means a plan can be executed without any review.

**Fix:** Make the check a hard stop unless the user explicitly overrides: "Status is `draft` — brief has not been reviewed. Proceed anyway? (y/n)"

---

## 4. Token Efficiency Improvements

### 4.1 CLAUDE.md and calma-design-language.md are read repeatedly
These two large documents are read by 10+ skills. In a single `/sprint-post-code` run, multiple agents each read them fresh independently.

**Improvement:** At the top of skills that spawn multiple agents, read shared context once and pass the relevant excerpt in the agent prompt rather than having each agent read the full file.

---

### 4.2 `sprint-arch-review` reads every changed file in full
Reading full files when only a small diff is relevant is expensive for large files. Could be smarter: read full files only for files where the diff is >30% of the file; read diff only for large files with small changes.

---

### 4.3 `sprint-validate` runs audits sequentially — unnecessarily
The skill explicitly says "not parallel." But the four design audits (colour, typography, interaction, microcopy) are completely independent. Running them sequentially is ~4x slower than running them as parallel background agents.

**Improvement:** Run the four design audits in parallel (as `audit-all` does), then archive the old files after all four complete.

---

### 4.4 `sprint-post-code` Setup reads sprint-arch-review separately
Setup reads sprint doc + sprint-validate SKILL.md + sprint-qa SKILL.md. Then Phase 1 reads sprint-arch-review SKILL.md. All four could be read in one parallel batch.

**Fix:** Add sprint-arch-review to the Setup parallel reads.

---

### 4.5 `retro-report` grows unboundedly
It reads every sprint doc ever written. By sprint 20+, this is a large read. Since retro-report produces a dated file, the next invocation could read the last retro-report as a baseline and only process new sprints since that date.

---

### 4.6 Templates inlined in SKILL.md eliminate one file read per invocation
Several skills read their `fragment.md` or `template.md` at write time. Inlining those templates directly in the SKILL.md would eliminate that extra file read — especially impactful for sprint-post-code which reads three fragment files.

---

## 5. Automation Opportunities

Every workflow step requires the user to remember which skill comes next and type the command manually. Key opportunities:

### 5.1 Auto-kickoff at session start
If an active sprint exists, `sprint-kickoff` should suggest or auto-run when the user starts a session. Currently the user must remember to type `/sprint-kickoff`.

### 5.2 Chain closure steps inline
After `sprint-post-code` succeeds, the consolidated summary already recommends "Proceed to `/calma-sync` → `/deploy`." This could be more actionable: ask "Run calma-sync now? (y/n)" and trigger it inline rather than requiring the user to type the command.

### 5.3 `sprint-pre-flight` Tier detection from draft brief
Currently Q1–Q4 sometimes require user answers. If the user's sprint intent is captured in a draft brief, pre-flight could read it and infer the tier from the description rather than asking every question interactively.

### 5.4 `project-health` on a schedule
This skill is entirely reactive. A scheduled trigger (e.g., every N sprints) would surface dependency drift and security issues automatically. The `loop` skill already provides this capability.

### 5.5 Lint/test as a pre-commit hook
`sprint-arch-review` Phase 1 and `deploy` both run `npm run lint && npm test`. Making this a git pre-commit hook would catch failures earlier without requiring a manual gate.

### 5.6 Prompt `update-claude-md` at end of sprint-retro
`update-claude-md` is listed as "Anytime" but sprint-retro is the natural trigger. Sprint-retro could end with: "Session learnings are fresh — run `/update-claude-md` now to capture them."

---

## 6. Additional Observations

### 6.1 No recovery/rollback documentation
`deploy` pushes commits, tags, and creates a GitHub release. If it fails mid-way (tag pushed, GitHub release failed), there's no documented recovery procedure.

### 6.2 `sprint-qa` assumes e2e/ exists
The skill "checks if `e2e/` exists" but provides no bootstrap path. The first time sprint-qa runs on a project without an e2e directory, the expected behaviour is undefined.

### 6.3 `calma-sync` updates both `.md` and `.html` files
The HTML file must be "sync content, not styling" — a manual, judgment-dependent process. This is error-prone. Consider whether the HTML should be generated from the markdown, or whether the sync requirement should carry an explicit "review carefully" warning.

### 6.4 `sprint-review` is not equivalent to running UX + Arch individually
The workflow presents them as alternatives but they differ:
- `/sprint-review` → analysis only, no discussion, mediation step
- `/sprint-ux + /sprint-arch` individually → full discussion phase per review

The trade-off is not documented. Users choosing `/sprint-review` lose the discussion phase without knowing it.

### 6.5 `audit-triage` deduplication is underspecified
The instruction says "merge duplicate findings, promote confirmed findings one severity level." What constitutes a "confirmed" finding is not defined (appeared in 2+ audits?). This leads to inconsistency across runs.

### 6.6 The archive pattern is unbounded
sprint-validate and sprint-arch-review archive old audits to `docs/audits/archive/`. Over 20+ sprints this produces 80+ archived files (4 audits × 20 sprints). `project-health` could check and prune audits older than N sprints.

---

## 7. Priority Recommendations

| Priority | Issue | Effort |
|---|---|---|
| High | Sprint status lifecycle: define all states, have deploy/retro set `completed` | Low |
| High | Fix audit-all "four" → "five" agents text bug | Trivial |
| High | Document that `audit-arch` must not appear in "Audits to run" | Low |
| High | Make sprint-validate run audits in parallel (4x speed improvement) | Low |
| High | sprint-review: fix agent mode — pass analysis-only instructions | Medium |
| Medium | sprint-pre-flight: ensure "Audits to run" gets written to the sprint doc for Tier 2 | Low |
| Medium | calma-sync: document base commit detection | Low |
| Medium | sprint-post-code Setup: read sprint-arch-review SKILL.md in the initial parallel read | Low |
| Medium | sprint-plan: hard stop on unreviewed brief | Low |
| Medium | Add auto-kickoff suggestion at session start if active sprint detected | Low |
| Medium | update-claude-md: prompt at end of sprint-retro | Low |
| Low | retro-report: incremental reads from last report | Medium |
| Low | deploy: add recovery section | Low |
| Low | project-health: add archive cleanup check | Low |
