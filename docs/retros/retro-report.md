# Retrospective Report

**Generated:** 2026-03-14 14:35
**Sprints analysed:** Sprint 1 – Sprint 10

---

## Recurring problems (address these)

### 1. Design constraints encoded reactively, not proactively — Sprints 1, 2, 3, 4, 5, 6

The most persistent pattern across the entire project history. The stone-400 foreground rule (Sprint 2), `type="button"` on form buttons (Sprint 3), static-export dynamic route constraint (Sprint 4), `font-medium` on section labels (Sprints 5–7) — each established a constraint only after a violation was already built and shipped. The systematic audit cycle in Sprint 7 cleared all accumulated drift; Sprints 8–9 closed what remained. Post-Sprint 9 the codebase has no HIGH or Critical open findings for the first time.

**Status:** Substantially addressed. The encode-as-you-go discipline is now well-established via the Calma Sync + CLAUDE.md token update steps in the sprint pipeline. The remaining risk is new patterns introduced in future feature sprints.

**Suggested fix:** Every Sprint N+1 brief should explicitly ask: "Does this introduce any new pattern that must be encoded?" before scope is finalised.

---

### 2. The `replace_all` parallel-form indent miss — Sprints 8, 9

In Sprint 8, the `Step` → `Increment` rename was missed in the add-habit form because ManageView has two JSX subtrees at different indentation levels (inline edit form + add-habit form) that look identical to a `replace_all` call matching only one. In Sprint 9, the same risk applied to the "Start at" field — only avoided because the brief explicitly flagged it. This is a structural property of ManageView, not a one-off error.

**Status:** Partially addressed. A CLAUDE.md note documents the ManageView parallel-form risk. The pattern has now cost at least one arch-review correction and one near-miss.

**Suggested fix:** After any edit to a shared field or label in ManageView, grep the file for the changed string before committing. This should be a standing rule in CLAUDE.md, not just a sprint-specific note.

---

### 3. "Already correct" claims that prove false — Sprints 7, 8

In Sprint 7, implementation notes stated SettingsView Theme and "Your data" labels were "already correct." They were not — caught in Sprint 7 validation and deferred to Sprint 8 (M3). The guard was added to `/sprint-plan` after Sprint 7 but the pattern survived one more sprint as a deferred finding.

**Status:** Guard in place in `/sprint-plan`. No recurrences since Sprint 8.

**Suggested fix:** Monitor for recurrence. If it reappears, elevate to a pre-brief verification step: read the relevant source lines before stating any element's current state.

---

### 4. QA confirmed by prediction rather than live run — Sprint 9

Sprint 9 QA was performed via static source-code analysis because the dev server couldn't start. All 16 new tests were predicted to pass, and 3 Sprint 8 tests were predicted to fail by design. The sprint shipped on prediction rather than observation. Sprint 10 (Task 1) was specifically designed to confirm this prediction and clean up the stale tests — and it did.

**Status:** Resolved in Sprint 10. Sprint 10 Task 1 ran the full Playwright suite live and confirmed the Sprint 9 predictions were accurate. The e2e baseline is now clean and live-verified.

**Suggested fix:** Formalise the rule in `/sprint-qa` and sprint process: a live server run is required before any final PASS verdict. Prediction is acceptable only as a documented intermediate step, not a final gate.

---

### 5. Token cost and sprint doc length — Sprints 9, 10

Sprint 9's doc grew to 618 lines by end of sprint; each subsequent skill re-read the full document. Sprint 10 Task 3 introduced scoped reads for `sprint-validate`, `sprint-qa`, and `sprint-plan`, targeting the most expensive reads. The Sprint 10 retro still flags token burn as a concern — the arch and UX skills (which pull in CLAUDE.md + Calma in full even for tooling sprints) are the next targets.

**Status:** Partially addressed. Scoped reads landed in Sprint 10. Full solution (arch/UX skill scoping) deferred.

**Suggested fix:** Next tooling sprint should scope `sprint-arch` and `sprint-ux` reads — they currently pull full CLAUDE.md + calma-design-language.md even for tooling sprints where neither file is relevant.

---

### 6. Sprint scope too conservative at tier boundaries — Sprint 7

Sprint 7 was too conservative — all six tasks were completed cleanly, but the sprint could have absorbed 8 more medium-severity findings and the 3 HIGH interaction findings without adding risk. The audit triage had identified them; they simply weren't pulled in. Sprint 8 corrected by targeting severity tiers completely rather than stopping at a subset.

**Status:** Resolved. From Sprint 8 onwards, scope targets full severity tiers rather than cherry-picking. Sprint 8 cleared all 9 HIGH findings; Sprint 9 cleared all remaining mediums.

---

## Recurring wins (protect these)

### 1. Zero regressions across all sprints

Every sprint from 7 onwards records zero regressions. TypeScript strict mode, 52 Jest unit tests, and a growing Playwright e2e suite (0 → 54 → 112 → 144 tests across Sprints 7–10) have prevented any sprint from breaking previously working features. Sprint 10 confirmed the e2e baseline live for the first time — the suite is now both clean and verified.

Do not trade this record for speed or scope.

### 2. Narrow scope + precise briefs → high plan fidelity

Every sprint from 7 onwards records "fully faithful," "accurate," or "tight" plan-to-execution match. The discipline of specifying exact line numbers, exact class strings, and edge-case gotchas in the brief eliminates ambiguity during coding. Sprint 10 noted "planning was frictionless — precise task specs meant each task could be executed without back-and-forth."

### 3. The audit cycle as a debt clearing mechanism

The structured audit (colour · typography · interaction · microcopy) with before/after tables has proven to be the correct mechanism for closing accumulated debt. Sprints 7–9 together moved the codebase from a high-debt state to:

| Audit | Starting state | Post-Sprint 9 |
|---|---|---|
| Colour (WCAG) | 11 high · 7 medium | 0 high · 0 medium · 3 low |
| Typography | 4 critical · 6 high · 6 medium | 0 critical · 0 high · 0 medium · 4 low |
| Interaction | 3 high · 9 medium | 0 high · 1 medium · 8 low |
| Microcopy | 4 high · 5 medium | 0 high · 0 medium · 3 low |

All HIGH and Critical findings cleared. One medium remains (two-step nav-link hover undocumented in Calma spec).

### 4. Design decisions resolved in mediation producing better outcomes

Sprint 9's "Start at" field emerged from mediation between UX and Arch positions — neither had independently proposed it. The retrospective explicitly noted: "That kind of creative resolution signals the review process is working as intended." The mediation step (UX review + arch review before planning) is not overhead; it is where the best design decisions happen.

### 5. GitHub Actions deployment — zero maintenance since Sprint 4

Six sprints with zero deployment infrastructure failures. The static export approach is stable.

### 6. Components simplifying over time

Sprint 9 noted that both redesigned components became simpler than what they replaced: HabitToggle lost its thumb animation entirely; NumberStepper dropped its input state and `useEffect`. The redesign process reliably finds simpler implementations — a signal that the Calma "recording over configuring" design philosophy guides toward better code, not just better aesthetics.

### 7. Sprint pipeline skill now operational — Sprint 10

Sprint 10 delivered the `/sprint-pipeline` orchestrator, completing the workflow tooling investment started in retro recommendations from Sprint 9. The pipeline is self-describing, tier-aware, and resumable. Combined with the scoped reads (also Sprint 10) and pre-flight report (Sprint 8 infrastructure), the full planning → execution → validation loop is now guided end-to-end.

---

## Planning accuracy

**Sprints 1–6:** No formal pipeline. Scope set informally; recurring regrets about scale and omissions.

**Sprints 7–10:** Formal pipeline in use. Plan fidelity recorded as "fully faithful" (Sprint 7), "accurate" (Sprint 8), "tight" (Sprint 9), and "frictionless — precise task specs" (Sprint 10). The trend is consistently improving.

**Scope estimation:** Sprint 7 was too conservative (left 8 medium findings and 3 HIGH on the table). Sprint 8 corrected by targeting severity tiers — cleared all 9 HIGH findings. Sprint 9 was right-sized for a feature sprint. Sprint 10 was a Tier 3 tooling sprint and shipped exactly as scoped.

**Task breakdown accuracy:** The main miss pattern is ManageView parallel forms (Sprint 8: Step→Increment missed in add-habit form; Sprint 9: "Start at" in two form paths caught only because the brief explicitly warned about it). The Gotchas/edge-cases subsection added in Sprint 10 (Task 2) is the structural fix for this class of miss.

**Review decisions in hindsight:** UX and Arch reviews have been consistently correct. The Sprint 8 arch finding (H8 import-side already done) saved time. Sprint 9 mediation produced the "Start at" feature. No review decision has proven wrong in hindsight.

---

## Promised improvements not yet acted on

| Sprint | Improvement | Status |
|---|---|---|
| Sprint 3 | Verify multi-entry-point nav flows before shipping | **Acted on** — added as a permanent QA checklist item |
| Sprint 5 | Keep a running notes file during multi-session sprints | **Not acted on** — Sprints 7–10 were all single-session, so this hasn't been needed. Still valid for future multi-session work |
| Sprint 7 | Evaluate `.claude/agents/` for skill de-duplication | **Partially acted on** — `architect` and `ux-designer` agents created. Full skill de-duplication deferred |
| Sprint 8 | Add "Step"→"Increment" parallel-form lesson to CLAUDE.md | **Acted on** — Sprint 9 brief explicitly addressed it; CLAUDE.md ManageView parallel-form note added |
| Sprint 9 | Scoped reads per skill phase | **Acted on** — Sprint 10 Task 3 delivered scoped reads for `sprint-validate`, `sprint-qa`, `sprint-plan` |
| Sprint 9 | `/sprint-pipeline` orchestrator | **Acted on** — Sprint 10 Task 4 delivered the pipeline skill |
| Sprint 9 | Update `sprint-08-touch-targets.spec.ts` | **Acted on** — Sprint 10 Task 1 confirmed all tests pass live; suite is green |
| Sprint 9 | Confirm live e2e run before deploy | **Acted on** — Sprint 10 Task 1 ran the full suite against a live dev server |
| Sprint 10 | Scope `sprint-arch` and `sprint-ux` reads for tooling sprints | **Not yet acted on** — identified in Sprint 10 retro; no sprint assigned |
| Sprint 10 | Document two-step nav-link hover in Calma spec | **Not yet acted on** — carried as a medium finding since Sprint 8; a doc-only change with no code impact |
| Sprint 10 | Add test coverage for `habitConfig.ts` (`getConfigs`, `saveConfigs`) | **Not yet acted on** — flagged in Sprint 8 arch review and retro report |
| Sprint 10 | Generalise workflow skills for reuse across projects | **Not yet acted on** — low urgency for Clarity; deferred |

---

## Codebase health trend

**Significantly improved and now stable.** The three-sprint audit cycle (Sprints 7–9) cleared every HIGH and Critical finding and all medium findings except one. Sprint 10 delivered no app code changes and confirmed the baseline is clean.

### Current state (post-Sprint 10)

| Audit | Post-Sprint 10 | Trend |
|---|---|---|
| Colour (WCAG) | 0 medium · 3 low | Stable from post-Sprint 9 |
| Typography | 0 medium · 4 low | Stable from post-Sprint 9 |
| Interaction | 0 high · 1 medium · 8 low | Stable — 1 medium (two-step hover, doc-only fix needed) |
| Microcopy | 0 high · 0 medium · 3 low | Stable from post-Sprint 9 |

### Remaining open debt

**1 medium (interaction):** Two-step nav-link hover (`stone-600 → stone-800`) undocumented in Calma spec. Code is intentional and correct; only a design-language doc entry is needed to close it.

**Low findings (selected):**
- ManageView archived confirmation notes: `text-stone-400` (intentional archival dimming — accepted)
- CalendarHeatmap day-of-week labels: `dark:text-stone-600` (wrong direction in dark mode)
- `role="spinbutton"` on NumberStepper pill: no `onKeyDown` arrow-key handler (accepted per Sprint 9 plan)
- NumberStepper pill value: no explicit `text-sm` (inherits browser default)
- ManageView "Start at" placeholder: `"0"` vs spec-intended `"Optional"`
- Remaining touch targets in SettingsView/ManageView/HelpView bare-text controls

**New medium finding (post-audit-list update, 2026-03-14):**
- `HistoryView.tsx`: Frequency section and toggle visible when `entries.length === 0`, before the empty-state message — creates two competing signals. Fix: suppress Frequency section entirely when no entries; move empty-state message directly below the heatmap.

**Structural debt (unchanged since Sprint 7):**
- `ManageView.tsx` at ~660 lines — watch threshold; inline form rendering not yet extracted
- `SECTION_LABEL` constant duplicated independently across six component files — infrastructure debt, low urgency
- No test coverage for `habitConfig.ts` (`getConfigs`, `saveConfigs`) — flagged in Sprint 8 arch review, still unaddressed
- `CheckInForm.tsx` at ~507 lines — large but UI-state only; no extraction warranted yet

**Health verdict:** The functional codebase is in its best state since the project began. Structural debt is contained and non-urgent. The test suite (52 Jest unit tests + 144 live-verified e2e tests) provides strong regression coverage.

---

## Recommended actions

**1. Close the HistoryView medium finding (empty state + Frequency section)** — Suppress the Frequency section entirely when `entries.length === 0`; move the empty-state message directly below the heatmap. This is a targeted single-file change — suitable for inclusion in the next feature sprint's polish pass or as a standalone Tier 2 sprint if the next sprint is unrelated.

**2. Document the two-step nav-link hover in Calma spec** — The `stone-600 → stone-800` pattern appears in DayDetail and Settings back links. A Calma Sync entry documenting this as a named exception closes the last remaining medium finding in the codebase. This is a doc-only change (no code impact) — suitable for a Tier 3 sprint or as an add-on to any upcoming sprint.

**3. Add test coverage for `habitConfig.ts`** — `getConfigs()` and `saveConfigs()` are the read-modify-write functions that every config change flows through. Currently untested despite being flagged in Sprint 8 arch review. A brief Tier 2 session (no review required) would close a structural testing gap. Target: `lib/habitConfig.test.ts` covering round-trip get/save, archived item preservation, and UUID stability.

**4. Scope `sprint-arch` and `sprint-ux` reads for tooling sprints** — Both skills currently pull CLAUDE.md and calma-design-language.md in full even for tooling sprints where app code is not touched. A conditional read (skip Calma and CLAUDE.md if the brief's scope confirms no UI changes) would meaningfully reduce token cost for Tier 2/3 sprints. Assign as part of the next tooling sprint.

**5. ManageView: formalise the parallel-form grep rule** — The `replace_all` indent-miss pattern has cost at least one arch-review correction (Sprint 8) and one near-miss (Sprint 9). The Gotchas field in task specs (Sprint 10 Task 2) addresses the symptom at brief time, but the underlying risk is structural. Add a standing CLAUDE.md note: "Any edit to a label or field in ManageView must be applied to both the inline edit form and the add-habit form. After any such edit, grep the file for the changed string before committing."

**6. Consider extracting ManageView inline forms** — At ~660 lines, ManageView is approaching the threshold where extraction warrants evaluation. The next feature sprint that touches Manage-page numeric UI should evaluate extracting the inline edit form into a sub-component at that point rather than deferring indefinitely. This is a watch item, not an immediate action.
