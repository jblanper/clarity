# Retrospective Report

**Generated:** 2026-03-17 11:16
**Sprints analysed:** Sprint 1 – Sprint 14

---

## Recurring problems (address these)

### 1. WCAG contrast violations keep reappearing (8 sprints: 2, 5, 7, 8, 9, 11, 12, 14)
`text-stone-400` and `text-stone-500` as foreground in light mode is the single most persistent pattern across the project. The rule has been in CLAUDE.md since Sprint 2 and was strengthened in Sprint 8 (added `text-stone-500` on elevated backgrounds). Sprint 14 still caught a `text-stone-400` regression on ManageView moment chips. The violation is being introduced during implementation — CLAUDE.md is not being consulted at write time, only at QA time.

**Suggested fix:** Add a mechanical `grep -n "text-stone-400\|text-stone-500" components/` check to the arch review checklist. A 30-second scan would catch this before QA every time.

---

### 2. Animation bugs caught in QA rather than during implementation (Sprints 6, 7, 13, 14)
Exit-snap, height-jump, stale-closure calendar direction, and BottomNav `mode="wait"` jump — all documented in CLAUDE.md, yet each was rediscovered at QA rather than avoided by the implementer. Sprint 13 explicitly flagged: "the height-jump bug was rediscovered during post-QA rather than applied proactively." Sprint 14 confirmed the pattern with a different variant.

**Suggested fix:** For any task introducing `height: 0 → auto` animations or `AnimatePresence`, task specs must reference `INLINE_FORM_SHELL`, exit-padding rules, and the `mode="popLayout"` vs `mode="wait"` trade-off explicitly. Update arch review and sprint-kickoff skills to include a one-line animation prompt.

---

### 3. `replace_all` silent misses on parallel JSX subtrees in ManageView (Sprints 8, 13)
ManageView has two parallel JSX subtrees (inline edit + add-habit form) at different indentation depths. `replace_all` edits silently miss one. Occurred twice: `Step` → `Increment` rename (Sprint 8) and `+ New` form positioning (Sprint 13). Documented in CLAUDE.md but continues to surface.

**Suggested fix:** For any ManageView edit involving label copy or form structure, the arch review checklist should include: grep the file for the old string after edit to confirm zero remaining instances. Reinforce in ManageView component notes.

---

### 4. Report verbosity — no human-readable console summary (Sprints 8, 9, 13)
Three separate retrospectives (Sprint 8, 9, 13) have requested a concise summary at the end of validate/QA reports: open questions, conflicts, and pass/fail counts echoed to terminal. Not implemented. Sprint 13 described the full reports as "too verbose for human review."

**Suggested fix:** `sprint-validate` and `sprint-post-code` should emit a terminal-only summary at the end (one line per audit, no file write). Small addition, high signal-to-noise payoff.

---

### 5. Underspecified interactive states in task specs (Sprints 9, 12, 13)
Sprint 9: `startAt` edge cases missed. Sprint 12: copy drift between UX mockup and sprint doc. Sprint 13: moment chip inline edit redesigned twice, `+ New` form placement wrong in both sections — "core interactions, not edge cases." Specs describe intent but not all states.

**Suggested fix:** For tasks introducing new interactive states, the brief must include a "States to cover" subsection listing all states the component can be in. Add this as a prompt to the `sprint-brief` template.

---

## Recurring wins (protect these)

### 1. Pre-brief parallel review with mediation
Cited as the key win in Sprints 7, 9, 11, 12, 13, 14. Resolves design/arch conflicts before a line is written, eliminating mid-sprint reversals. Sprint 13: S1 closed as no-op, S4 overturned, L3 dropped, M4 locked. Sprint 14: H2 year-row threshold and filter opacity behaviour resolved upfront. **Do not skip this phase, even for small sprints.**

### 2. Architecture review as a real gate
Consistently catches issues before QA: Sprint 8 (`replace_all` indent mismatch), Sprint 12 (moment archiving silently removed; `actionTrayId` dirty), Sprint 13 (INLINE_FORM_SHELL enforcement), Sprint 14 (Joy section enter animation regression). The gate is doing exactly what it should.

### 3. Sprint docs as a complete, navigable record
Since Sprint 7, sprint docs serve as full records: task specs, arch findings, validation checklists, QA results, retro notes all in one place. Any future sprint can reconstruct what happened and why. Live `[x]` checklist and `**Status:**` field updates maintain this discipline.

### 4. Playwright e2e suite as stable regression baseline
Sprint 7 established 54 tests. Sprint 14: 62 tests, zero failures on first run. Seven sprints of growth without brittleness. Well-calibrated to the actual app state.

### 5. CLAUDE.md as living enforcement document
Each sprint immediately codifies new rules on discovery. The data model rules, animation patterns, navigation constraints, and WCAG constraints are all grounded in specific incidents. This has progressively raised the baseline — the question is proactive consultation, not the quality of the written rules.

---

## Planning accuracy

**Trend: high and stable since Sprint 8, with one remaining gap (task depth).**

| Period | Pattern |
|---|---|
| Sprints 1–5 | No formal process. Problems found post-release. Data model rework in Sprint 3 caused by Sprint 1 underdesign. Sprint 5 scope too large (two-day sprint, three releases). |
| Sprints 6–7 | Process formalized. Sprint 7 scope too conservative — audit triage done but not fully pulled in. |
| Sprints 8–11 | Consistent high accuracy: tight scope, tasks per spec, high plan fidelity. All core tasks shipped. |
| Sprint 12 | Scope accurate; copy drift from UX mockup was the only miss. |
| Sprint 13 | Scope correct; interaction specs underspecified → post-QA rework on chip-edit and form placement. |
| Sprint 14 | Scope right-sized; slack absorbed two unplanned tasks cleanly. BottomNav bug was a runtime side-effect, not a planning failure. |

**Remaining gap:** Task *depth*. Scope is reliably right-sized. But tasks introducing new interactive states tend to describe intent rather than enumerate all states — causing improvisation and post-QA rework (Sprints 9, 13).

**Task completion:** No sprint since Sprint 7 has failed to ship its core tasks. Carry-forward items are audit debt, not failed sprint work.

---

## Promised improvements not yet acted on

| Retrospective | Promise | Status |
|---|---|---|
| Sprint 7 | Review intensity decision tree (full / arch-only / none tiers) | Not formalised |
| Sprint 7 | Evaluate agents for role de-duplication (UX/Arch roles in 6+ and 3+ skills) | Not done |
| Sprint 7 | Playwright smoke run at start of manual QA | Unclear — not referenced in subsequent retros |
| Sprint 8 | Lightweight human-readable terminal summary for validate/QA | Not implemented (re-requested Sprint 13) |
| Sprint 9 | Edge cases / gotchas subsection in data-model task specs | Not adopted systematically |
| Sprint 12 | UX as lightweight sign-off at brief stage (confirm brief matches mockup) | Not done |
| Sprint 13 | `/sprint-post-code` QA agent bash access — investigate and unblock | Status unknown |
| Sprint 13 | Console summary in audit reports (open questions, conflicts, decisions) | Open |
| Sprint 13 | Pre-implementation animation checklist in task specs | Not yet applied systematically |
| Sprint 13 | UX evaluation explicit coverage of all new interactive states | Unclear |
| Sprint 14 | Create `/debug` skill | New recommendation, not yet acted on |

**Resolved this period:** `createEmptyEntry` unit test (deferred Sprints 12 and 13 → shipped Sprint 14). ✓

---

## Codebase health trend

**Debt is shrinking. Overall trajectory is positive.**

- Sprint 8 cleared all 9 HIGH audit findings. Zero regressions.
- Sprints 9–11 addressed WCAG contrast, touch targets, typography, and the joy/highlights section.
- Sprint 13 codified `INLINE_FORM_SHELL` in both Calma spec and CLAUDE.md.
- Sprint 14 closed the last outstanding HIGH item (heatmap redesign). 62 e2e tests, zero failures.
- All `lib/` utilities now have unit tests.

**Persistent concerns:**
- **WCAG contrast** remains the most commonly introduced violation per sprint (8 of 14 sprints). The rule is well-documented; the gap is write-time enforcement.
- **Animation correctness** is the hardest category to catch pre-QA. Every sprint touching motion has had at least one post-implementation discovery. CLAUDE.md docs are comprehensive; proactive application is the gap.
- **ManageView complexity** — highest-risk file in the codebase. Two parallel JSX subtrees, `actionTrayId` + `editingHabit` + `editingMomentId` state interactions, `AnimatePresence` wrapping. Each sprint touching it has required a second pass. Worth monitoring.

No CLAUDE.md rule has been violated more than twice in the same class. The codebase is structurally sound; remaining debt is UI polish and animation correctness at the margins.

---

## Recommended actions

Prioritised by impact and actionability:

### High priority

**1. [SKILL] Create `/debug` skill**
Structure: reproduce → isolate → fix → document (root cause / what was tried / what worked). Sprint 14 recommendation. The BottomNav bug consumed a significant investigation pass without a structured approach. Would preserve institutional knowledge explicitly and save time on the next non-obvious runtime bug.

**2. [SKILL/PROCESS] Add animation checklist to arch review and sprint-kickoff**
For any task introducing `height: 0 → auto` animations or `AnimatePresence`: explicitly reference `INLINE_FORM_SHELL`, exit-padding rule, and `mode="popLayout"` vs `mode="wait"` trade-off in the task spec itself. CLAUDE.md has the knowledge; the gap is prompting the implementer before coding starts.

**3. [PROCESS] Add `grep text-stone-400\|text-stone-500` to arch review checklist**
Mechanical check on `components/`. WCAG contrast is the most persistent recurring violation across 8 sprints. A 30-second grep during arch review would catch it every time.

### Medium priority

**4. [SKILL] Console summary for `sprint-validate` and `sprint-post-code`**
Terminal-only, no file write. One line per audit (pass/fail + count + any open questions). Three retros have requested this. Small change, high human-readability payoff.

**5. [SKILL] Add "States to cover" subsection to brief template**
For tasks introducing new interactive states, enumerate all states in the spec. Addresses the underspecification pattern from Sprints 9, 12, 13. Update `sprint-brief` skill template.

**6. [PROCESS] Formalise review intensity decision tree**
Sprint 7 proposed three tiers (full pipeline / arch-only / no review) — never codified. Add to `docs/workflow.md` and reference from brief/pre-flight. Reduces token cost on tooling and docs-only sprints.

### Lower priority

**7. [INVESTIGATION] Unblock `/sprint-post-code` QA agent bash access**
Sprint 13 flagged this. Status unknown. Investigate and resolve or close with a recorded decision.

**8. [SKILL] Evaluate agent de-duplication for UX/Arch roles**
The `ux-designer` and `architect` roles are embedded in 6+ and 3+ skills respectively. Extracting to `.claude/agents/` with `@file` references reduces maintenance overhead as CLAUDE.md and Calma spec evolve. Low urgency but accumulates linearly.
