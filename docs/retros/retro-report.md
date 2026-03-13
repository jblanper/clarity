# Retrospective Report

**Generated:** 2026-03-13 10:42
**Sprints analysed:** Sprint 1 – Sprint 9

---

## Recurring problems (address these)

### 1. Design constraints encoded reactively, not proactively — Sprints 1, 2, 3, 4, 5, 6

Noted in the Sprint 7 retro report and still the most persistent pattern across all nine sprints. The stone-400 rule (Sprint 2), `type="button"` (Sprint 3), static export (Sprint 4), `font-medium` on section labels (Sprint 5–7) — each established a constraint that wasn't written down until it had already caused at least one violation. The systematic audit cycle in Sprint 7 caught the accumulated drift; Sprints 8–9 closed it. Post-Sprint 9 the codebase has no HIGH or medium open findings, which marks the first time the constraint-encoding discipline has been fully caught up.

**Suggested fix:** The encode-as-you-go discipline is now well-established via Calma Sync + CLAUDE.md token update steps. The remaining risk is new patterns introduced in feature sprints. Ensure every Sprint N+1 brief explicitly asks: "Does this introduce any new pattern that must be encoded?"

---

### 2. The `replace_all` parallel-form indent miss — Sprints 8, 9 (both)

In Sprint 8, the `Step` → `Increment` rename was missed in the add-habit form because two JSX subtrees at different indentation levels in ManageView look identical to a `replace_all` call that matches only one. In Sprint 9, the same risk applied to the "Start at" field (required explicit parallel-form note in the brief). This is a structural property of ManageView — it has two form paths (inline edit + add-habit form) at different indentation depths rendering similar but not identical JSX.

**Suggested fix:** Encode a standing CLAUDE.md note that ManageView has two parallel form paths. Any change to a numeric field in ManageView must be applied to both paths. After any such edit, grep the file for the changed string before committing. This is already done informally in Sprint 9's brief — formalise it.

---

### 3. "Already correct" claims that prove false — Sprints 7, 8

In Sprint 7, implementation notes stated the SettingsView Theme and "Your data" labels were "already correct." They were not — caught in the Sprint 7 validation audit and deferred to Sprint 8 (M3). A guard was added to the `/sprint-plan` skill after Sprint 7, but the pattern has appeared once since then (M3 survived into Sprint 8 as a deferred finding, meaning the Sprint 7 brief carried the incorrect claim all the way to validation).

**Suggested fix:** The guard is now in `/sprint-plan`. Monitor for recurrence. If it appears again in Sprint 10+, elevate to a pre-brief verification step: read the relevant source lines before stating any element's current state.

---

### 4. QA run with a predicted (not live) dev server — Sprint 9

Sprint 9 QA was performed via static source-code analysis because the dev server couldn't be started in that session. All 16 new tests were predicted to pass but not confirmed live. Three Sprint 8 tests were predicted to fail by design (old control shapes). The sprint shipped on prediction rather than observation.

**Suggested fix:** The QA section should include a live server run before any final "PASS" verdict. If the dev server can't start, that is a blocker — escalate to the user rather than substituting prediction. The current workaround is acceptable for one sprint, but should not become normal practice.

---

### 5. Token cost and sprint doc length — Sprint 9 (newly emerging)

Sprint 9's sprint doc grew to 618 lines by end of sprint. Each subsequent skill re-reads the full document. The retrospective explicitly flagged token cost and suggested scoped reads per phase. No action has been taken yet — this is a brand-new concern that has appeared once and is not yet confirmed as systemic.

**Suggested fix:** Explore skill-level scoped reads (e.g. `/sprint-arch` reads only the tasks section, not the full doc). This is a workflow infrastructure change — assign to a dedicated tooling sprint rather than a feature sprint.

---

## Recurring wins (protect these)

### 1. Zero regressions across all sprints

Sprints 7, 8, and 9 all report zero regressions. The combination of TypeScript strict mode, Jest unit tests, a growing Playwright e2e suite (6 → 112 → 144 tests across sprints), and careful task scoping has prevented any sprint from breaking previously working features. This is an exceptionally strong track record. Do not trade it for speed or scope.

### 2. Narrow scope + precise briefs → high plan fidelity

Every sprint from 7 onwards records "fully faithful" or "tight" plan-to-execution match. Sprint 9 brief-to-execution match was described as "tight — implementation order held up, all tasks shipped per spec." This began with Sprint 7's introduction of line-number-level task specs. The discipline of specifying exact line numbers, exact class strings, and edge-case gotchas in the brief eliminates ambiguity during coding.

### 3. The audit cycle as a debt clearing mechanism

The structured audit (colour · typography · interaction · microcopy) with before/after tables has proven to be the correct mechanism for closing accumulated debt. Sprints 7–9 together moved the codebase from:
- **Colour:** 11 high · 7 medium · 3 low → 0 medium · 3 low
- **Typography:** 4 critical · 6 high · 6 medium · 5 low → 0 medium · 4 low
- **Interaction:** 3 high · 9 medium · 5 low → 0 high · 1 medium · 8 low
- **Microcopy:** 4 high · 5 medium · 2 low → 0 high · 0 medium · 3 low

All HIGH and critical findings cleared. All medium findings cleared except one (two-step nav-link hover, undocumented in Calma).

### 4. Design decisions resolved in mediation producing better outcomes than either position

Sprint 9's "Start at" field emerged from mediation between UX (Option A: visible input) and Arch (Option B: tap-only). Neither side had proposed it. The PO introduced it as a third path. The retrospective explicitly noted: "That kind of creative resolution signals the review process is working as intended." The mediation step is not overhead — it is where the best design decisions happen.

### 5. GitHub Actions deployment — zero maintenance since Sprint 4

Five sprints of zero deployment infrastructure failures. The static export approach is stable.

### 6. Components simplifying over time

Sprint 9 noted that both redesigned components became simpler than what they replaced: HabitToggle lost its thumb animation entirely; NumberStepper dropped its input state and `useEffect`. The redesign process reliably finds simpler implementations. This is a signal that the Calma "recording over configuring" design philosophy actively guides toward better code, not just better aesthetics.

---

## Planning accuracy

**Sprints 1–6:** No formal pipeline. Scope set informally; recurring regrets about scale and omissions.

**Sprints 7–9:** Formal pipeline in use. Plan fidelity recorded as "fully faithful" (Sprint 7), "accurate" (Sprint 8), and "tight" (Sprint 9) respectively.

**Scope estimation:** Sprint 7 was too conservative (left 8 medium findings and 3 HIGH on the table). Sprint 8 corrected by targeting severity tiers — cleared all 9 HIGH findings. Sprint 9 was right-sized. The tier-based scoping approach is working.

**Task breakdown accuracy:** The main miss pattern is parallel forms in ManageView (Sprint 8: Step→Increment missed in add-habit form; Sprint 9: "Start at" in two form paths caught only because the brief explicitly noted it). The fix is the CLAUDE.md parallel-form note recommended above.

**Review decisions in hindsight:** UX and Arch reviews have been consistently correct. The Sprint 8 arch finding (H8 import-side already done) saved time. Sprint 9 mediation produced the "Start at" feature. No review decision has proven wrong in hindsight.

**Trend:** Strong and stable at the task level. Main remaining risk is ManageView parallel-form misses and the "already correct" claim failure mode.

---

## Promised improvements not yet acted on

| Sprint | Improvement | Status |
|---|---|---|
| Sprint 3 | Verify multi-entry-point nav flows before shipping | **Acted on** — added as a permanent QA checklist item. |
| Sprint 5 | Keep a running notes file during multi-session sprints | **Not acted on** — Sprints 7–9 were single-session, so this hasn't been needed. Still valid for future multi-session work. |
| Sprint 7 | Evaluate `.claude/agents/` for skill de-duplication | **Partially acted on** — `architect` and `ux-designer` agents created (additive model). Skill de-duplication deferred pending trial validation. |
| Sprint 8 | Add "Step"→"Increment" parallel-form lesson to CLAUDE.md | **Not acted on** — the lesson was noted in the Sprint 8 arch review, but no CLAUDE.md rule was written. This applies to all parallel-form edits in ManageView. |
| Sprint 9 | Scoped reads per skill phase (token cost reduction) | **Not acted on** — identified as a tooling-sprint item, not yet started. |
| Sprint 9 | `/sprint-pipeline` orchestrator with sequential phases + human approval checkpoints | **Not acted on** — flagged as a future improvement; no sprint assigned. |
| Sprint 9 | Update `sprint-08-touch-targets.spec.ts` to remove 3 obsolete assertions | **Not confirmed** — the QA section recommended removing the old HabitToggle/NumberStepper assertions. Not verified whether this was done in the deploy step. |
| Sprint 9 | Confirm live e2e run before deploy | **Unclear** — Sprint 9 QA was static analysis; the recommended action was to run `npx playwright test` against a live server before deploying. Not confirmed. |

---

## Codebase health trend

**Significantly improved.** The three-sprint audit cycle (Sprints 7–9) has cleared every HIGH and critical finding and all medium findings except one.

### Current state (post-Sprint 9)

| Audit | Post-Sprint 9 | Trend from Sprint 1 baseline |
|---|---|---|
| Colour (WCAG) | 0 medium · 3 low | Major improvement from 11 high |
| Typography | 0 medium · 4 low | Major improvement from 4 critical + 6 high |
| Interaction | 0 high · 1 medium · 8 low | Cleared all HIGH; 1 medium remaining |
| Microcopy | 0 high · 0 medium · 3 low | Cleared all HIGH + medium |

### Remaining debt

**1 medium (interaction):** Two-step nav-link hover (`stone-600 → stone-800`) undocumented in Calma spec. Awaiting a design-language doc decision before code change.

**Low findings (selected):**
- ManageView archived confirmation notes: `text-stone-400` (intentional archival dimming — accepted)
- CalendarHeatmap day-of-week labels: `dark:text-stone-600` (wrong direction in dark mode)
- `role="spinbutton"` on NumberStepper pill: no `onKeyDown` arrow-key handler (accepted per Sprint 9 plan)
- NumberStepper pill value: no explicit `text-sm` (inherits browser default)
- ManageView "Start at" placeholder: `"0"` vs spec-intended `"Optional"`
- Remaining touch targets in SettingsView/ManageView/HelpView bare-text controls

**Structural debt (unchanged since Sprint 7):**
- `ManageView.tsx` at ~660 lines — watch threshold; inline form rendering not yet extracted
- `SECTION_LABEL` constant duplicated independently across six component files — infrastructure debt
- No test coverage for `habitConfig.ts` (`getConfigs`, `saveConfigs`) — flagged in Sprint 8 arch review, not yet addressed
- `CheckInForm.tsx` at ~507 lines — large but UI-state only; no extraction warranted yet

**Health verdict:** The functional codebase is in its best state since the project began. Structural debt is contained and non-urgent. The test suite (52 Jest unit tests + 144 e2e tests) provides strong regression coverage.

---

## Recommended actions

**1. Add CLAUDE.md note on ManageView parallel forms** — Any edit to a numeric field in ManageView must be applied to both the inline edit form and the add-habit form. After any such edit, grep the file for the changed string before committing. This has caused a missed fix in Sprint 8 and required a pre-emptive warning note in Sprint 9's brief. Formalising it in CLAUDE.md prevents a third occurrence.

**2. Confirm live e2e run and fix obsolete touch-target tests before Sprint 10** — Sprint 9 QA was static analysis, not live. Before the next sprint, run `npx playwright test` against a live dev server to confirm the 16 new Sprint 9 tests pass and to remove or replace the 3 obsolete Sprint 8 touch-target assertions. A green baseline suite is the prerequisite for all future sprint QA.

**3. Address the one remaining medium finding: document the two-step hover** — The `stone-600 → stone-800` nav-link hover pattern appears in DayDetail and Settings back links. It is flagged as undocumented in the Calma spec (interaction medium). A Calma Sync entry documenting this as a named exception ("navigation link hover: two-stop stone-600 → stone-800") would close the last medium finding in the codebase.

**4. Plan a `habitConfig.ts` test coverage sprint** — Sprint 8 arch review flagged no test coverage for `getConfigs()` and `saveConfigs()`. These are the read-modify-write functions that every config change flows through. They are currently untested. A brief Tier 3 session (no review required) to add Jest coverage for these two functions would close a structural testing gap.

**5. Plan a tooling sprint for token cost reduction** — Sprint 9 identified that the sprint doc grows to 600+ lines and is re-read fully by every subsequent skill. Scoped reads per phase (only the relevant section) and a `/sprint-pipeline` orchestrator with sequential phases are both identified improvements that would meaningfully reduce cost per sprint. Assign as a Tier 3 infrastructure sprint before Sprint 11.

**6. Generalise workflow skills for reuse** — Sprint 9 noted that most skills are project-agnostic except for Calma-specific references and Clarity-specific CLAUDE.md rules. Extracting those as configuration is the main work to turn the workflow into a reusable plugin. This is low urgency for Clarity itself but high value if the workflow is to be applied elsewhere.

**7. Watch ManageView size** — At ~660 lines it is approaching the threshold where extraction becomes warranted. If the next feature sprint adds numeric habit UI or Manage-page features, evaluate extracting the inline form rendering into a sub-component at that point rather than deferring indefinitely.
