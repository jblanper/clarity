# Retrospective Report

**Generated:** 2026-03-14 22:39
**Sprints analysed:** Sprint 1 – Sprint 11

---

## Recurring problems (address these)

### 1. Design constraints encoded reactively, not proactively — Sprints 1, 2, 3, 4, 5, 6
The `stone-400` WCAG AA failure, `type="button"` requirement, `router.back()` anti-pattern, and `toISOString()` UTC bug all entered CLAUDE.md *after* a violation was caught in production or review. Each constraint was violated at least once before being written down, and several (stone-400) were violated multiple times across four components because the rule wasn't codified after the first occurrence.

**Suggested fix:** At the start of any sprint touching UI or data, do a 5-minute scan of recent CLAUDE.md additions and confirm they're reflected in the components about to be edited. When a violation is caught in arch review or QA, write the CLAUDE.md rule *in the same session*, not deferred.

### 2. `replace_all` silent misses on ManageView dual-subtree — Sprints 8, 9
The same pattern appeared twice: an edit targeting a string that appears in two parallel JSX subtrees (inline edit form + add-habit form) at different indentation levels caused a partial replacement. Caught by arch review both times but required a second pass.

**Suggested fix:** After any `replace_all` edit, immediately grep the file for the old string to confirm zero remaining instances. This rule is now in CLAUDE.md but has still been triggered — elevate it to a PostToolUse hook check, or make it a standing first step after every `replace_all`.

### 3. Carry-forward debt accumulating without a clear burn-down plan — Sprints 7, 8, 9, 10, 11
Each sprint's retrospective notes deferred items (touch targets in Settings/Manage/Help, ManageView stone-400 lines 402/631, CalendarHeatmap dark labels, undocumented nav-link hover, microcopy). The same items recur in subsequent retrospectives without being resolved. Sprint 11 named 7 carry-forward items; Sprint 10 named similar ones.

**Suggested fix:** Maintain a single `docs/audits/carry-forward.md` (or a section in the active audit doc) where deferred items are tracked by severity. Sprint 12 brief must explicitly clear or defer each item by name, not leave them as ambient context.

### 4. Token cost / context bloat in the pipeline — Sprints 9, 10
Sprint docs grow large (Sprint 9 reached 618 lines); skills re-read entire files even when only a section is relevant. Sprint 10's scoped-reads task helped, but the retrospective still flagged token burn as high. Several skills (arch, UX) still pull in CLAUDE.md and the Calma doc in full even for tooling or copy sprints.

**Suggested fix:** Audit which phases of which skills are still reading full documents. Apply the scoped-read pattern (grep for the relevant section, not `Read` of the full file) to arch and UX skills on their next revision. Pre-flight report already seeds relevance; skills should honour it.

### 5. Sprint scope over-runs causing fatigue — Sprint 5, Sprint 8 (minor)
Sprint 5 ran across two days with three releases. Sprint 8's retrospective noted high verbosity and cognitive load from long skill output. The root cause in both cases was a combination of scope that could have been split and skill output that was designed for agent context rather than human reading.

**Suggested fix:** Apply the review-intensity decision tree introduced in Sprint 7 consistently. Full pipeline (UX + arch + mediation + plan) is warranted for new features and data model changes. Audit-driven or tooling sprints need arch review only. Enforce this decision at the brief stage, not mid-sprint.

---

## Recurring wins (protect these)

### 1. Sprint pipeline produces precise, codeable task specs — Sprints 7–11
The planning pipeline (brief → UX eval → arch review → mediation → sprint plan) consistently delivers implementation notes specific enough to code from directly. Sprint 7 introduced the format; Sprints 9, 10, and 11 all cited "precise task specs" as the reason execution was smooth. This is the most valuable process investment to date.

**Protect by:** Not shortcutting the mediation step even when UX and arch seem to agree. Several key decisions (Highlights position, tertiary button token, `startAt` feature) emerged from mediation that neither review produced independently.

### 2. Data model solidity — Sprints 3, 4, 5, 9
Getting the data model right (UUID keying, done/joy split, `startAt` as optional, sparse records) has paid dividends in every subsequent sprint. Components slot into the model without refactoring. Sprint 9 noted that both redesigned components were *simpler* than their predecessors because the model had room for them.

**Protect by:** Honouring the "never partial-helper, always read-modify-write" rule and not adding convenience fields to `AppConfigs` without going through the full arch review.

### 3. Arch review catches real bugs before production — Sprints 7, 8, 9, 10, 11
The arch review has caught a production bug in every sprint since Sprint 7: archived-label contrast (Sprint 7), `replace_all` indent mismatch (Sprint 8), `scaleX` percentage string (Sprint 8), `placeholder` discrepancy (Sprint 9), WCAG checkmark colour (Sprint 11). These are not hypothetical issues — they would have shipped.

**Protect by:** Never skipping arch review for sprints that touch UI components, data model, or animations, even if the scope seems narrow.

### 4. Calma design language as single source of truth — Sprints 6–11
Naming and formalising the design system (Sprint 6) gave design decisions a stable home. The Calma spec has been referenced in every sprint since and has prevented design drift. The spec vs. CLAUDE.md boundary (principles vs. implementation) has held cleanly.

**Protect by:** Keeping CLAUDE.md implementation tokens in sync with the Calma spec after every sprint that changes visual patterns. Audit the two documents together at the start of each brief.

### 5. Background skill execution reducing main-context noise — Sprints 8–11
Running `sprint-validate` and `sprint-qa` in the background (Sprint 8 onwards) kept the execution context clean. Sprint 9's daily skill was specifically noted as well-received.

**Protect by:** Making background execution the default for all validation and QA phases in the pipeline, not optional.

---

## Planning accuracy

**Trend: steadily improving, with scope conservatism as the main remaining gap.**

- **Sprints 1–4:** Scope was underdefined. Sprint 1 shipped a complete but limited set; Sprint 3 had to do significant rework (UUID migration) because Sprint 1's data model was wrong. No formal planning process.
- **Sprints 5–6:** Scope was too large (Sprint 5 ran two days, three releases). Planning was ad hoc; no brief/UX/arch separation.
- **Sprints 7–8:** Planning pipeline introduced. Sprint 7 retrospective noted scope was *too conservative* — the audit had done the triage work but only a subset of findings were pulled in. Sprint 8 was right-sized.
- **Sprints 9–11:** Brief-to-execution match rated "accurate" or "tight" in all three retrospectives. Sprint 9 noted one edge-case gap in task specs (placeholder discrepancy, `startAt: 0` guard) — addressed by a CLAUDE.md note and a recommendation to add "edge cases / gotchas" subsections to data-model tasks.
- **Sprint 11:** Scope, effort, and ordering were all accurate. The mediation step resolved all decisions that could have caused mid-sprint rework.

**Remaining gap:** The decision-tree for review intensity (introduced Sprint 7 as a recommendation) has not been applied consistently — all sprints since have run the full pipeline regardless of complexity. Sprint 10 (tooling) and Sprint 8 (audit pass) are candidates where arch-only would have been sufficient.

---

## Promised improvements not yet acted on

| Retrospective | Promised improvement | Status |
|---|---|---|
| Sprint 7 | Introduce review intensity decision tree (full / arch-only / none) | **Not applied** — all subsequent sprints ran full pipeline |
| Sprint 7 | Verify "already correct" claims manually before writing sprint doc | **Partially applied** — no recurrence found but not a formal step |
| Sprint 7 | Evaluate agents to de-duplicate skill role definitions | **Not started** |
| Sprint 8 | Lightweight human-readable summary at end of `sprint-validate` / `sprint-qa` | **Not implemented** |
| Sprint 9 | Add "edge cases / gotchas" subsection to data-model task specs | **Partially applied** — noted in CLAUDE.md but not a standing template field |
| Sprint 9 | Consider `/sprint-pipeline` orchestrator | **Implemented** in Sprint 10 |
| Sprint 10 | Continue reducing token consumption in arch/UX skills | **Not started** |
| Sprint 11 | Each workflow step must update sprint `**Status:**` field | **Added to CLAUDE.md**, not yet validated in practice |
| Sprint 11 | Address carry-forward debt (ManageView stone-400, touch targets, microcopy) | **Pending Sprint 12** |

---

## Codebase health trend

**Trend: net improving, with a growing tail of low-priority deferred items.**

- **Technical debt:** The major structural issues (UUID keying, `router.back()`, `toISOString()`, `useLayoutEffect`) are resolved and codified. No repeated CLAUDE.md violations in Sprints 9–11.
- **Accessibility:** High-severity WCAG failures (stone-400 in CheckInForm, HistoryView, ManageView, SettingsView; touch targets in interactive components) were cleared in Sprints 7–8. Remaining known failures are lower-severity: ManageView archive button lines 402/631 (stone-400), CalendarHeatmap dark-mode labels, touch targets in Settings/Manage/Help links.
- **Animation:** Exit animation snap and calendar direction bugs (Sprint 6) resolved and generalised. `scaleX` pattern codified. No animation regressions since Sprint 7.
- **Test coverage:** Playwright suite introduced Sprint 7 (54 tests). Three tests required updating in Sprint 11 due to intentional control shape changes — handled cleanly. No test rot observed.
- **Carry-forward debt growing:** 7 named items entering Sprint 12 without a resolution plan. None are high-severity, but the list is long enough that items from Sprint 7 are still appearing in Sprint 11 retrospectives. This is the primary codebase health risk.

---

## Recommended actions

**Ordered by impact / urgency:**

1. **[Sprint 12 scope] Clear the carry-forward debt list.** The ManageView stone-400 two-liner (lines 402/631) is already scoped from Sprint 11. Pull in the touch-target fixes for Settings/Manage/Help and at least one microcopy item. Create `docs/audits/carry-forward.md` as the single tracking location so items don't get lost between sprint docs.

2. **[Process] Apply the review intensity decision tree.** Audit-driven and tooling sprints should run arch review only, not the full UX + arch + mediation pipeline. Code the decision at brief time: if the sprint touches new UI patterns or the data model, run full pipeline; otherwise arch-only. Estimate: saves 30–40% of planning tokens on lighter sprints.

3. **[Process] Add a standing "edge cases / gotchas" subsection to data-model task specs in the brief template.** Sprint 9 surfaced this gap (`startAt: 0`, placeholder string). A two-sentence prompt in the task spec template would catch most of these at brief time.

4. **[Tooling] Reduce token cost in arch and UX skills.** Both skills still read CLAUDE.md and the Calma doc in full even for narrow sprints. Apply the scoped-read pattern: grep for the relevant sections (e.g. animation rules for animation tasks, colour tokens for UI tasks) rather than reading the full files. The pre-flight report already identifies relevant areas — honour it in the skill logic.

5. **[Tooling] Validate the `**Status:**` field update requirement.** Added to CLAUDE.md in Sprint 11. Run a mock sprint-pipeline pass to confirm the skill reads and skips already-done phases correctly before relying on it in production.

6. **[Process] Evaluate de-duplicating agent role definitions.** The UX designer and architect roles are embedded in 6+ and 3+ skills respectively. Extracting them to `.claude/agents/` with references to CLAUDE.md and the Calma spec would reduce drift when either document is updated. Low urgency but will pay off in maintenance as the skill set grows.

7. **[Hygiene] After every `replace_all` edit, grep for the old string before moving on.** This is in CLAUDE.md but has been triggered twice. Consider a PostToolUse hook that automatically runs the grep and surfaces any remaining matches as a warning — removes the reliance on discipline alone.
