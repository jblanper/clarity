# Audit Action List

Generated: 2026-03-14 10:06
Source audits: audit-colour.md · audit-typography.md · audit-interaction.md · audit-microcopy.md · audit-design-overall.md

Archived previous action list → docs/audits/archive/audit-action-list-2026-03-14.md

Sprint 9 resolved both High findings from the previous triage (CheckInForm add-moment touch targets; HistoryView period selector WCAG AA). No new Critical or High findings introduced in Sprint 9.

---

## Critical

None.

---

## High

None.

---

## Medium

### HistoryView: Frequency section visible on empty state creates two competing signals

Source: audit-design-overall (M1 — single most important observation)
File: `HistoryView.tsx`

What to fix:
When `entries.length === 0`, the page renders: (1) all-grey heatmap, (2) "Frequency" section divider and toggle button, (3) the empty-state message below the toggle. A first-time user encounters a toggleable UI section — implying data exists — before seeing any explanation. Expanding "Frequency" produces a second empty message ("Nothing logged in this period") that collides with the first. Conditionally suppress the Frequency section entirely when `entries.length === 0`: wrap the frequency divider and toggle in `{entries.length > 0 && ...}`. Also move the existing empty-state message (`"Your days will appear here once you start logging."`) to immediately below the heatmap so it reads as the calendar&apos;s own empty state, not an afterthought below a dead toggle.

---

## Deferred

Low findings and non-trivial Medium findings deferred to a polish pass:

### Medium — non-trivial (multiple lines or multiple files)

- `SettingsView.tsx` (lines 110, 142, 153, 226, 297, 313, 327, 335) — Bare-text controls with no `min-h` touch target; multiple lines across the file. (Medium) — audit-interaction
- `ManageView.tsx` (lines 244, 278, 289, 292, 345, 353, 388, 439, 446, 597) — Bare-text controls with no `min-h` touch target; multiple lines across the file. (Medium) — audit-interaction
- `HelpView.tsx` (lines 21, 102) — Back link and design-language link: `text-xs` only, no `min-h`. (Medium) — audit-interaction
- `HistoryView.tsx` line 63 · `ManageView.tsx` line 239 — Page header uses `flex items-center justify-between` where CLAUDE.md specifies `flex items-start justify-between`; swap `items-center` → `items-start`. Touches two files. (Medium, confirmed by audit-design-overall M2 and prior audit-interaction finding — promoted from Low) — audit-design-overall · audit-interaction
- `docs/calma-design-language.md` — Nav-link two-step hover (`stone-600 → stone-800`) is codified in CLAUDE.md as intentional but not formally documented in the Calma spec; without a named exception, future audits will continue flagging it. Add a named "Nav-link hover" exception entry. (Medium — doc update only, no code change) — audit-interaction

### Low

- `ManageView.tsx` lines 402, 631 — Archived confirmation notes use `text-stone-400 dark:text-stone-500`; should be `text-stone-500 dark:text-stone-400` (intentional archival dimming, pre-existing) — audit-colour
- `CalendarHeatmap.tsx` ~300 — Day-of-week labels use `dark:text-stone-600`; should be `dark:text-stone-500` (wrong direction — lower contrast in dark mode, pre-existing) — audit-colour
- `SettingsView.tsx` ~332 — Cancel button has no explicit `dark:text-*` base; stone-500 passes contrast but is cosmetically inconsistent (pre-existing) — audit-colour
- `CalendarHeatmap.tsx` ~230 — Year display uses `text-sm uppercase tracking-widest`; should be `text-xs uppercase tracking-widest` (pre-existing) — audit-typography
- `SettingsView.tsx` sections — `mb-8` spacing throughout vs Calma 2.5rem baseline; internal `border-t` dividers compensate (pre-existing) — audit-typography
- `DayDetail.tsx` ~200 — Numeric value uses `font-medium`; borderline acceptable for data emphasis (pre-existing) — audit-typography
- `NumberStepper.tsx` line 66 — Pill button value has no explicit `text-sm` class; browser default for `<button>` is typically equivalent but should be made explicit. (New — Sprint 9) — audit-typography
- `SettingsView.tsx` line 229 — Remove-file "✕" button has `hover:text-stone-700` but no `transition-colors` (pre-existing) — audit-interaction
- `ManageView.tsx` lines 439, 446 — "Yes / No" and "Number" type-pickers have `hover:underline` but no `transition-colors` (pre-existing) — audit-interaction
- `BottomNav.tsx` line 31 — Inactive tabs have `transition-colors` but no hover colour defined; add `hover:text-stone-700 dark:hover:text-stone-300` so the transition has a target. (Confirmed by 2 audits: audit-interaction + audit-design-overall L4) — audit-interaction · audit-design-overall
- `CalendarHeatmap.tsx` ~341, ~347 — Future day cells and filter-dimmed cells at `opacity-25` / inline `opacity: 0.25`, below the 30% disabled-state floor (pre-existing) — audit-interaction
- `FrequencyList.tsx` ~148 — Inactive-filter chevron uses `invisible` (`visibility: hidden`) instead of `opacity-0` (pre-existing) — audit-interaction
- `NumberStepper.tsx` line 59 — `role="spinbutton"` has no `onKeyDown` arrow-key handler; keyboard users cannot increment/decrement. (New — Sprint 9, accepted per sprint plan) — audit-interaction
- `NumberStepper.tsx` line 59 — `aria-valuemax` absent when `max !== Infinity`; revisit if max becomes configurable. (New — Sprint 9) — audit-interaction
- `ManageView.tsx` line 278 — joyByDefault inline toggle button has `transition-colors` but no `active:opacity-70` press-state feedback; the only interactive element in the list section without active-state acknowledgment (pre-existing) — audit-interaction · audit-design-overall
- `DayDetail.tsx` — Moments section heading uses `mb-3`; all other section headings in this component use `mb-2` (pre-existing) — audit-design-overall
- `DayDetail.tsx` — Done-habit indicator is Unicode `✓` at `text-stone-500`; HabitToggle uses an amber dot for done state. Replace `✓` with a small amber dot (`h-2 w-2 rounded-full bg-amber-500`) to match the vocabulary introduced in Sprint 9. (New — audit-design-overall L1) — audit-design-overall
- `CheckInForm.tsx` / `ManageView.tsx` — Add-action glyph inconsistency: `＋` (fullwidth U+FF0B) in CheckInForm vs `+` (ASCII U+002B) in ManageView. Align to ASCII `+` in CheckInForm line 361. (New — audit-design-overall L2) — audit-design-overall
- `DayDetail.tsx` / `CheckInForm.tsx` — Date format inconsistency: DayDetail heading uses European day-first with year ("25 February 2026"); Today subtitle uses US month-first without year ("February 25"). Standardise on European day-first with year across both surfaces. (New — audit-design-overall L3) — audit-design-overall
- `CheckInForm.tsx` line 190 — "Please enter a name." → "Give this moment a name." (pre-existing) — audit-microcopy
- `CheckInForm.tsx` line 197 — "A moment with that name already exists." → "You&apos;ve already got a moment called that." (pre-existing) — audit-microcopy
- `ManageView.tsx` lines 355, 528 — "Start at" field placeholder `"0"` where sprint plan specified `"Optional"`; `"0"` may mislead users into thinking entry is required. Change to `placeholder="Optional"` in both the inline-edit form (line 355) and the add-habit form (line 528). (New — Sprint 9) — audit-microcopy

---

## Design intent to carry forward

- The two-axis colour system (Dusk Blue for habits, Warm Ember for moments and joy) is the app&apos;s most visually distinctive design feature. Any future colour additions to the heatmap must preserve the proportional blending logic and the two-pole semantics.
- Clarity&apos;s emotional identity — no gamification, no streaks, no progress bars — is successfully reflected end-to-end. The amber semantic weight (joy, archive, reset — all reversible, all warm) is consistent throughout. Treat this as a hard constraint when evaluating any new feature.
- The Joy section&apos;s conditional appearance (revealed only after at least one boolean habit is marked done) makes the factual/emotional separation tangible without explanation. This pattern should inform any future conditional UI sections: the emotional question should arrive only when there is something to reflect on.
- "Day captured" is the most affirming the app ever gets. Its restraint is the target register for any future state messaging or confirmation copy.
- The nav-link hover pattern (`stone-600 → stone-800`, two steps darker) is intentionally codified in CLAUDE.md as a nav-specific exception to the one-step hover rule. This exception should be formally documented in `docs/calma-design-language.md` as a named pattern so future audits do not flag it as a violation. (Carried from previous triage; a deferred Medium action also covers the doc update.)
- The "Highlights" section label (renamed from "Joy" in Sprint 9) is broader and less precise. "Joy" named a specific emotional category; "Highlights" suggests summary. The rename is unlikely to cause confusion but slightly dilutes the intentional factual/emotional split (Habits = fact, Joy = feeling). Monitor in user testing before revisiting.
- The NumberStepper&apos;s amber pill when non-zero is consistent with the system-wide active/positive accent and does not read as gamified score — it increments without celebration or fanfare. The framing remains observational. Preserve this register if the stepper design changes.

---

## Summary

| # | Title | File | Severity | Source |
|---|-------|------|----------|--------|
| 1 | HistoryView: Frequency section visible on empty state | `HistoryView.tsx` | Medium | audit-design-overall |

Critical: 0 · High: 0 · Medium: 1 · Deferred: 27
Design intent notes: 7
