# Retrospective Report

**Generated:** 2026-03-15 21:08
**Sprints analysed:** Sprint 1 – Sprint 12

---

## Recurring problems (address these)

### 1. WCAG contrast violations recur across the codebase
**Sprints:** 2, 5, 7, 9, 11 (five of twelve)

`text-stone-400` as foreground in light mode has been caught and re-caught in every major audit cycle. Sprint 2 introduced the pattern; Sprint 5's style guide propagated it; Sprint 7's audit cleared several instances but not all; Sprint 9 found it again in the HistoryView period selector; Sprint 11 flagged the checkmark glyph. The rule has been in CLAUDE.md for years yet violations keep appearing in new components.

**Suggested fix:** The rule is documented but not enforced. Add a `grep` in a `PostToolUse` hook (or pre-commit hook) that fails if `text-stone-400` appears outside a `dark:` prefix in any `.tsx` file. Zero-tolerance enforcement, not documentation.

---

### 2. `replace_all` indent mismatches in ManageView cause silent partial edits
**Sprints:** 8, 11 (carry-forward)

Two parallel JSX subtrees (inline edit form + add-habit form) at different indentation depths cause `replace_all` to silently miss one subtree. Noted in Sprint 8 arch review, documented in CLAUDE.md, but the ManageView stone-400 violation was still listed as carry-forward debt in Sprint 11 — meaning the CLAUDE.md note alone wasn't sufficient.

**Suggested fix:** When editing ManageView, always grep for the old string immediately after any `replace_all` to verify zero remaining instances. This is already in CLAUDE.md ("Verify `replace_all` completeness") but hasn't been applied consistently. Reinforce by making it an explicit step in the `sprint-kickoff` task spec template for ManageView tasks.

---

### 3. UX report / mockup drift causes copy corrections during implementation
**Sprints:** 7, 12

Sprint 7 found that "already correct" claims in implementation notes were false (SettingsView Theme and "Your data" labels). Sprint 12 found that the `ux-radical-evaluation` report omitted changes visible in the mockup, leading to copy corrections during implementation. In both cases, the sprint plan was accurate — but the inputs to the plan were not.

**Suggested fix:** Add a UX sign-off step in the brief phase: before finalising the sprint doc, confirm that every copy change visible in the mockup is explicitly enumerated in the report. The `ux-radical-evaluation` skill was updated in Sprint 12; reinforce by making mockup-brief reconciliation a named step in `sprint-brief`.

---

### 4. Token cost remains high despite scoped-reads work
**Sprints:** 8, 9, 10 (three consecutive)

Sprint 8 raised the issue. Sprint 9 flagged sprint docs growing to 600+ lines and skills re-reading the full document each phase. Sprint 10 delivered scoped reads for several skills but still felt token-heavy. Sprint 10 identified arch and UX skills as the next targets; no evidence this was done before Sprint 11.

**Suggested fix:** Audit the arch and UX skills specifically — they still likely read CLAUDE.md + calma-design-language.md in full even for tooling-only sprints. Add conditional context loading based on the sprint tier (tooling vs. UI vs. data model).

---

### 5. Animation bugs surface only at runtime, after code is written
**Sprints:** 6, 7

Sprint 6: exit animation snap (border-box + padding) and calendar direction bug both shipped to production and required a follow-up release. Sprint 7: FrequencyList scroll-jump and layout-shift required several iterations. These are interaction-layer bugs that linters, type-checks, and static analysis cannot catch.

**Suggested fix:** This is a structural constraint — the mitigation (manual animation review in the `/deploy` checklist) is already in place. No new action needed; preserve the existing checklist step.

---

## Recurring wins (protect these)

### 1. Arch review as a pre-commit gate
Arch review has caught real blockers in every sprint it has run: Sprint 7 (archived-label contrast), Sprint 8 (replace_all indent mismatch, scaleX percentage bug), Sprint 9 (startAt edge cases), Sprint 12 (moment archiving silently removed by chip-grid change, actionTrayId dirty state). In all cases the catch happened before implementation shipped — exactly the right moment. Keep this gate mandatory for all feature and UI sprints.

---

### 2. Mediation resolving UX–Arch conflicts before coding begins
Sprint 9 (startAt creative resolution), Sprint 11 (Highlights position, tertiary button token), Sprint 12 (S3 colour, B2 animation, B3 editing pattern). In every case, questions that could have caused mid-sprint rework were resolved before a line was written. Preserve the parallel review + mediation pattern for all sprints with open design questions.

---

### 3. Sprint docs as complete, durable records
From Sprint 7 onward, sprint docs have served as self-contained records — any future sprint can read them and reconstruct what happened and why. Implementation notes in briefs have been specific enough to code from directly with minimal ambiguity. Maintain the habit of closing the loop in the sprint doc (status fields, retrospective, arch review).

---

### 4. Refactors simplify the codebase
Sprint 9: HabitToggle lost its thumb animation entirely; NumberStepper dropped its input state and `useEffect`. Both redesigned components ended up simpler than what they replaced. Sprint 6: Motion library adoption replaced ad-hoc CSS/setTimeout orchestration with a declarative API. The Calma design constraint (no gamification, minimal interaction) naturally produces simpler implementations. Keep this bias active.

---

### 5. Zero regressions from Sprint 8 onward
Sprint 8 cleared 9 HIGH audit findings with zero regressions. Sprints 9–12 all shipped with zero regressions. The Playwright regression baseline (54 tests, Sprint 7) has been maintained and extended each sprint. Sprints 8 and 11 show 100% task/validation checkbox completion. Preserve the validation + QA phase and the arch review gate.

---

## Planning accuracy

**Trend: strongly improving from Sprint 6 onward.**

- **Sprints 1–5** — no formal planning process. Sprint 1 scoped too narrowly (no History page). Sprint 5 was too large (ran across two days, three releases, should have been split).
- **Sprint 7** — scope too conservative. All six tasks completed cleanly but the sprint could have absorbed 8 medium-severity + 3 HIGH findings without risk. Audit-driven sprints should aim to clear full severity tiers.
- **Sprint 8** — accurate. Two minor scope adjustments from arch (H8 already implemented, M15 in two locations), both non-blocking.
- **Sprint 9** — accurate. "Start at" feature emerged from mediation and slotted in without disrupting the plan.
- **Sprint 10** — mostly accurate; `sprint-pipeline` grew slightly beyond spec during implementation (tier-aware phases, extra skill references) — a minor scope creep worth monitoring.
- **Sprint 11** — accurate. Brief's mediation step resolved all open questions upfront; no mid-sprint rework.
- **Sprint 12** — accurate. Scope, ordering, and estimates were right; B2 correctly identified as highest-risk. The copy drift was a planning-input problem, not a planning-accuracy problem.

**Overall:** The brief + arch gate + mediation pattern has been reliable for five consecutive sprints (8–12). Planning accuracy is no longer the limiting factor; planning input quality (report/mockup reconciliation, edge case coverage) is the current frontier.

---

## Promised improvements not yet acted on

| Sprint | Promise | Status |
|---|---|---|
| 7 | Formal review intensity decision tree (tier 1/2/3 by sprint type) | Not formalised into a skill or checklist |
| 7 | Evaluate agents to de-duplicate UX/Arch role definitions across 6+ skills | Not done |
| 8 | Lightweight human-readable terminal summary from `sprint-validate` / `sprint-qa` | Not implemented |
| 9 | "Edge cases / gotchas" subsection in task specs for data-model tasks | Not adopted systematically |
| 10 | Reduce token cost in arch and UX skills (scoped reads for tooling sprints) | No evidence of action |
| 12 | Pull UX into brief review as a lightweight sign-off step (confirm brief matches mockup) | Not yet formalised in `sprint-brief` skill |

Note: the `/sprint-pipeline` skill was built (Sprint 10), evaluated, and deliberately removed (Sprint 12) — this is resolution, not neglect.

---

## Codebase health trend

**Verdict: improving, with one persistent pocket of debt.**

**Debt cleared (highlights):**
- All 9 HIGH audit findings from the colour/typography/interaction audit cleared in Sprint 8.
- HabitToggle and NumberStepper redesigned to simpler, more maintainable implementations (Sprint 9).
- DayDetail scroll lock corrected from `useEffect` → `useLayoutEffect` (Sprint 5).
- FrequencyList scroll-jump and layout-shift fixed (Sprint 7).

**Remaining open debt:**
- CalendarHeatmap dark-mode label colours, touch targets in Settings/Manage/Help, undocumented nav-link hover state — listed as carry-forward in Sprint 11; status after Sprint 12 unclear.
- `role="spinbutton"` on NumberStepper has no keyboard arrow-key support (M3, accepted in Sprint 9).

**Most persistent violation:** `text-stone-400` as foreground in light mode — found in 5 of 12 sprints. Every other recurring violation has been tamed by a CLAUDE.md rule. This one needs enforcement, not just documentation.

**Pattern:** Rules added reactively after a violation (type="button", toISOString, router.back) have generally held once encoded. Rules that rely on memory without tooling enforcement continue to be violated periodically.

---

## Recommended actions

Prioritised from highest signal to lowest.

### P0 — Enforce, don't document
1. **Add a lint/hook check for `text-stone-400` outside `dark:` context.** This has been documented for years and keeps recurring. A pre-commit grep will end the cycle. Example check: `grep -rn 'text-stone-400' components/ | grep -v 'dark:text-stone-400'` — fails if non-empty.

### P1 — Brief process fixes (high leverage, low effort)
2. **Add UX mockup reconciliation as a named step in `sprint-brief`.** Before finalising the sprint doc, explicitly confirm all copy and layout changes visible in the mockup are listed in the report. Sprint 12 identified this; Sprint 13 should codify it in the skill.
3. **Add an "edge cases / gotchas" subsection to task spec templates for data-model tasks.** The `startAt: 0` no-op and `placeholder="0"` vs `"Optional"` discrepancy (Sprint 9) both stemmed from specs that described intent but not edge cases. A named section surfaces these at brief time.
4. **Formalise the review intensity decision tree in `sprint-brief`.** Sprint 7 proposed three tiers (full pipeline / arch-only / no review). Without a formal decision point, every sprint defaults to full pipeline regardless of scope. Codifying the criteria saves significant time on tooling, docs, and copy sprints.

### P2 — Token cost (medium effort, medium payoff)
5. **Audit arch and UX skills for scoped context loading.** Sprint 10 fixed several skills but deferred arch and UX as "next targets." For tooling-only sprints, neither skill needs the full Calma spec or the full CLAUDE.md.
6. **Implement lightweight terminal summary for `sprint-validate` / `sprint-qa`.** Promised Sprint 8; still not done. One line per audit with a pass/fail count reduces cognitive load without changing file output.

### P3 — Tooling / maintenance
7. **Evaluate de-duplicating UX/Arch role definitions into `.claude/agents/`.** Sprint 7 proposed this; still open. UX designer and architect personas are re-embedded across 6+ and 3+ skills respectively — a maintenance tax that grows with each new skill.
8. **Confirm Sprint 11 carry-forward findings before Sprint 13 scope is set.** Verify whether CalendarHeatmap dark-mode labels and Settings/Manage/Help touch targets were resolved in Sprint 12. If not, include them explicitly.
