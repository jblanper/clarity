# Retrospective Report

**Generated:** 2026-03-16 14:25
**Sprints analysed:** Sprint 1 – Sprint 13

---

## Recurring problems (address these)

### 1. Animation bugs rediscovered post-QA despite being documented (Sprints 6, 13)
The exit-animation snap bug (border-box + padding) was caught post-release in Sprint 6 and fixed. The height-jump variant of the same class of bug was documented in CLAUDE.md from Sprint 6 but was **not applied proactively** in Sprint 13 — it was rediscovered during post-QA, causing rework. The pattern: animation bugs encoded as rules are not referenced at implementation time, only at QA time.

**Suggested fix:** Add a pre-implementation animation checklist to task specs whenever a task introduces `height: 0 → auto` transitions. The `INLINE_FORM_SHELL` pattern reference should appear in the task spec itself, not only in CLAUDE.md. Sprint 13 retrospective flagged this explicitly.

---

### 2. `replace_all` silent misses on parallel JSX subtrees (Sprints 8, 13)
ManageView has two parallel JSX subtrees (inline edit form + add-habit form) at different indentation levels. `replace_all` edits silently miss one because the same string appears twice at different depths. This pattern has occurred **twice** (Sprint 8: `Step`→`Increment` rename; Sprint 13: `+ New` form positioning wrong in both habits and moments sections). It's documented in CLAUDE.md but continues to surface.

**Suggested fix:** For any edit to ManageView affecting label copy or form structure, add an explicit post-edit grep check as a task validation step in the sprint spec — not just in the coding standard.

---

### 3. Post-QA rework for core interactions underspecified in briefs (Sprints 12, 13)
Sprint 12: copy drift between mockup and sprint doc caused missed changes. Sprint 13: moment chip inline edit was redesigned **twice** (in-grid → below-grid card → chip stays + form below), and `+ New` form placement was wrong in both habits and moments sections. These were core interactions, not edge cases — the brief was accurate on scope but underspecified on interaction detail.

**Suggested fix:** For any task introducing a new interactive state (chip editing, form reveal, tray toggle), the brief should specify the exact placement, the open/closed state transitions, and which other elements are hidden or displaced. A small "interaction spec" subsection in affected tasks would catch this at brief time.

---

### 4. Token cost repeatedly flagged but not fully resolved (Sprints 9, 10)
Sprint 9 noted the pipeline was token-heavy (sprint-09.md grew to 618 lines; each skill re-read the full document). Sprint 10 introduced scoped-reads and still noted the cost felt high. Arch and UX skills were identified as next targets in Sprint 10 but no Sprint 11+ retro records this as resolved.

**Suggested fix:** Audit the arch and UX skills specifically for unnecessary full-file reads of CLAUDE.md and calma-design-language.md. Measure token cost before and after a targeted scoped-reads pass on those two skills.

---

### 5. WCAG stone-400/500 violations recurring across sprints (Sprints 2, 7, 8, 9, 11)
Despite being in CLAUDE.md from Sprint 2, new WCAG stone-400 (and later stone-500-on-elevated-bg) violations continued to appear in ManageView (Sprint 7), HistoryView period selector (Sprint 9), and the done-habit checkmark (Sprint 11). The rule is known but not enforced at write time.

**Suggested fix:** The rule is already well-documented. The gap is that it applies to `text-stone-500` on elevated backgrounds (stone-100/stone-50) as a distinct case not always caught by reading the stone-400 rule. Consider adding a lint-level annotation or a pre-commit grep for `text-stone-500` on `bg-stone-100`/`bg-stone-50` combinations in the same component.

---

### 6. Process improvements promised and not acted on (cross-sprint)
Several retrospective recommendations were noted and not carried forward:
- **Review intensity decision tree** (Sprint 7) — proposed tiers (full / arch-only / none) were never formalized. `/sprint-pipeline` was built in Sprint 10, then deleted in Sprint 12 without a replacement process for this.
- **Lightweight human-readable summary at end of validate/QA** (Sprint 8) — not implemented.
- **Edge cases subsection in data-model task specs** (Sprint 9) — not adopted systematically.
- **UX as lightweight sign-off at brief stage** (Sprint 12) — proposed but not done before Sprint 13.

---

## Recurring wins (protect these)

### 1. Pre-brief parallel UX + Arch review with mediation
Cited as a key win in Sprints 7, 9, 11, 12, and 13. Prevents mid-sprint reversals on design and architecture conflicts. Sprint 13 closed S1 as no-op, correctly overturned S4, dropped L3 (avoiding timer complexity), and locked M4 token spec — all potential reversals avoided before a line was written. **Do not skip this phase, even for small sprints.**

### 2. Narrow scope + precise task specs = fast, frictionless execution
Sprints 1, 7, 9, 10, 11 all cited clear briefs as a driver of smooth execution. Sprint 11 shipped all 5 tasks per spec with zero deviations. Sprint 9 shipped 6 tasks with high plan fidelity. The investment in brief quality pays off in reduced back-and-forth during implementation.

### 3. Architecture review as the right gate
The arch review consistently catches issues that would be messier to find in QA: Sprint 8 (`replace_all` indent mismatch before ship), Sprint 12 (moment archiving silently removed; `actionTrayId` dirty on archive), Sprint 9 (`startAt: 0` edge case). The gate is working as intended.

### 4. Encoding rules in CLAUDE.md immediately on discovery
Sprint 3 (`type="button"` rule), Sprint 4 (static export constraints), Sprint 8 (`replace_all` completeness check), Sprint 13 (`INLINE_FORM_SHELL` + animation rules). The pattern of immediately codifying discovered rules prevents future violations of the same class. The problem is rules not being *consulted proactively* (see Recurring Problem 1), not rules not being written.

### 5. Mediation resolves creative conflicts rather than picking a side
Sprint 9: the "Start at" feature emerged from a UX/Arch conflict — neither position had proposed it independently. Sprint 12: all three open questions resolved before implementation. The mediation step is generating better outcomes than either unilateral position would have.

---

## Planning accuracy

**Overall trend: improving and now plateaued at a high level.** The gap has shifted from scope (Sprints 1–6: scope too large or features missing) to task *depth* (Sprints 12–13: scope correct, interaction specs too thin).

| Period | Pattern |
|---|---|
| Sprints 1–5 | No formal process. Problems found post-release. Data model rework in Sprint 3 caused by Sprint 1 underdesign. |
| Sprints 6–7 | Process formalized. Sprint 7 scope too conservative — audit triage done but not pulled in fully. |
| Sprints 8–11 | Consistent: tight scope, tasks per spec, high plan fidelity. Planning accuracy strong. |
| Sprints 12–13 | Scope and estimates accurate; task *depth* is the remaining gap. Underspecified interactions → post-QA rework. |

**Task completion rate (Sprints 7–13):** Sprints 8 and 11 show fully completed checklists (67/67, 44/44). Later sprints have carry-forward open items (audit findings and deferred debt) rather than incomplete sprint tasks. No sprint has failed to ship its core tasks.

---

## Promised improvements not yet acted on

| Retrospective | Promise | Status |
|---|---|---|
| Sprint 7 | Review intensity decision tree (full / arch-only / none tiers) | Not formalized |
| Sprint 7 | Evaluate agents for role de-duplication (UX/Arch roles in 6+ skills) | Not done |
| Sprint 8 | Lightweight human-readable summary at end of validate/QA | Not implemented |
| Sprint 9 | Edge cases / gotchas subsection in data-model task specs | Not adopted systematically |
| Sprint 12 | UX as lightweight sign-off at brief stage (confirm brief matches mockup) | Not done |
| Sprint 13 | `/sprint-post-code` QA agent bash access — investigate and unblock | Open |
| Sprint 13 | Console summary in audit reports (open questions, conflicts, decisions) | Open |
| Sprint 13 | Pre-implementation animation checklist in task spec | Open |
| Sprint 13 | UX evaluation explicit coverage of all new interactive states | Open |
| Sprint 13 | `createEmptyEntry` unit test as named Sprint 14 task | Pending |

---

## Codebase health trend

**Debt is shrinking.** The trajectory is clearly positive:

- Sprint 8 cleared all 9 HIGH audit findings. Zero regressions.
- Sprint 9 reduced `text-stone-400` violations. Touch targets improved.
- Sprint 11 cleared carry-forward debt items (Highlights, DayDetail, joy section).
- Sprint 13 codified `INLINE_FORM_SHELL` pattern in both Calma spec and CLAUDE.md.
- Architecture review has caught real bugs (not just style issues) in every sprint it has run.

**Persistent patterns to watch:**
- WCAG stone-400/500 violations on elevated backgrounds remain the most common new finding introduced per sprint — the rule needs to be checked at write time, not QA time.
- Animation correctness remains the hardest category to catch pre-QA. Three sprint retros mention animation bugs appearing post-implementation. The `INLINE_FORM_SHELL` codification should help for future height-reveal work.
- 7 pre-existing findings were noted in the Sprint 11 retro as carry-forward debt (ManageView stone-400, CalendarHeatmap dark labels, touch targets in Settings/Manage/Help, undocumented nav-link hover, microcopy). Status as of Sprint 13 is unclear — check the open audit findings before Sprint 14 scope is set.

No CLAUDE.md rule violations have been repeated more than twice (the `replace_all` parallel-subtree issue is the only two-time offender). The codebase is in good shape structurally; remaining debt is UI polish and animation correctness.

---

## Recommended actions

Priority-ordered for Sprint 14 planning:

1. **[TASK] Add `createEmptyEntry` unit test** — deferred in Sprint 12 and Sprint 13 arch reviews. Add as a named task in Sprint 14 backlog, not a recommendation.

2. **[SKILL] Add pre-implementation animation checklist to task specs** — whenever a task introduces `height: 0 → auto` transitions, the task spec should reference `INLINE_FORM_SHELL` explicitly. Update the `/sprint-brief` skill to prompt for this when animation work is in scope.

3. **[SKILL] Add console summary to audit reports** — Sprint 13 retrospective: reports are too verbose for human review. Add a concise summary section (echoed to console) with open questions, conflicts, and recommended decisions clearly surfaced. Update `sprint-validate` / `sprint-qa` skills.

4. **[SKILL] Extend `/ux-radical-evaluation` to cover new interactive states** — explicitly prompt coverage of all new interactive states introduced in the sprint, not just surfaces under general audit. Chip-edit and form-placement interactions in Sprint 13 were spec-silent and got improvised.

5. **[PROCESS] Clear carry-forward debt before Sprint 14 features** — audit open findings from Sprint 11 (ManageView stone-400/631, CalendarHeatmap dark labels, Settings/Manage/Help touch targets). These are small, known fixes. Clear them in Sprint 14 or explicitly defer with a recorded decision.

6. **[PROCESS] Adopt "interaction spec" subsection in briefs** — for any task introducing a new interactive state, add explicit placement, open/closed transitions, and which elements are hidden or displaced. Addresses the post-QA rework pattern from Sprints 12–13.

7. **[INVESTIGATION] Unblock `/sprint-post-code` QA agent bash access** — Sprint 13 flagged this as blocking real QA runs. Investigate before Sprint 14 post-code phase.

8. **[SKILL] Formalize review intensity tiers** — Sprint 7 proposed (full / arch-only / none) but it was never written into a skill. Now that `/sprint-pipeline` is gone, this decision is implicit. Codify it in the brief skill or a CLAUDE.md workflow note so the right review level is chosen consistently.
