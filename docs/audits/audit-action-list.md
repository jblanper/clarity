# Audit Action List

Generated: 2026-03-14 22:28
Source audits: audit-colour.md · audit-typography.md · audit-interaction.md · audit-microcopy.md · audit-design-overall.md

Archived previous action list → docs/audits/archive/audit-action-list-2026-03-14.md

Sprint 11 resolved the single remaining Medium from the Sprint 9 triage: HistoryView empty-state message is now positioned immediately below the heatmap, and the Frequency section is suppressed when `entries.length === 0`. No new Critical or High findings introduced in Sprint 11.

---

## Critical

None.

---

## High

None.

---

## Medium

### Calma spec: document nav-link two-step hover as a named exception

Source: audit-interaction · audit-design-overall
File: `docs/calma-design-language.md`

What to fix:
Nav links throughout the app use `text-stone-600 hover:text-stone-800` — a two-step jump rather than the one-step hover described in the Calma spec. This is an intentional, codified exception in CLAUDE.md (`hover:text-stone-800` for nav links), but the Calma spec does not acknowledge it, so future audits will continue flagging it as a violation. In the Interaction section under "States", add a named sub-entry "Nav-link hover exception" noting that navigation links (`text-stone-600`) jump two steps to `text-stone-800` on hover (rather than the standard one-step rule) because the lighter starting tone requires more contrast shift to communicate the hover state clearly.

---

## Deferred

Low findings and non-trivial Medium findings deferred to a polish pass:

### Medium — non-trivial (multiple lines or multiple files)

- `SettingsView.tsx` (lines 110, 142, 153, 226, 297, 313, 327, 335) — Bare-text controls with no `min-h` touch target; multiple lines across the file. (Medium) — audit-interaction
- `ManageView.tsx` (lines 244, 278, 289, 292, 345, 353, 388, 439, 446, 597) — Bare-text controls with no `min-h` touch target; multiple lines across the file. (Medium) — audit-interaction
- `HelpView.tsx` (lines 21, 102) — Back link and design-language link: `text-xs` only, no `min-h`. (Medium) — audit-interaction
- `HistoryView.tsx` line 63 · `ManageView.tsx` line 239 — Page header uses `flex items-center justify-between` where CLAUDE.md specifies `flex items-start justify-between`; swap `items-center` → `items-start`. Touches two files. (Medium, confirmed by audit-design-overall M2 and audit-interaction) — audit-design-overall · audit-interaction

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
- `BottomNav.tsx` line 31 — Inactive tabs have `transition-colors` but no hover colour defined; add `hover:text-stone-700 dark:hover:text-stone-300` so the transition has a target. (Confirmed by 2 audits) — audit-interaction · audit-design-overall
- `CalendarHeatmap.tsx` ~341, ~347 — Future day cells and filter-dimmed cells at `opacity-25` / inline `opacity: 0.25`, below the 30% disabled-state floor (pre-existing) — audit-interaction
- `FrequencyList.tsx` ~148 — Inactive-filter chevron uses `invisible` (`visibility: hidden`) instead of `opacity-0` (pre-existing) — audit-interaction
- `NumberStepper.tsx` line 59 — `role="spinbutton"` has no `onKeyDown` arrow-key handler; keyboard users cannot increment/decrement. (New — Sprint 9, accepted per sprint plan) — audit-interaction
- `NumberStepper.tsx` line 59 — `aria-valuemax` absent when `max !== Infinity`; revisit if max becomes configurable. (New — Sprint 9) — audit-interaction
- `DayDetail.tsx` — Done-habit indicator is Unicode `✓` at `text-stone-500`; HabitToggle uses an amber dot for done state. Replace `✓` with a small amber dot (`h-2 w-2 rounded-full bg-amber-500`) to unify the visual vocabulary across the form and the review surface. (Pre-existing) — audit-design-overall
- `CheckInForm.tsx` line 361 · `ManageView.tsx` — Add-action glyph inconsistency: `＋` (fullwidth U+FF0B) in CheckInForm vs `+` (ASCII U+002B) in ManageView. Align to ASCII `+` in CheckInForm. (Pre-existing) — audit-design-overall
- `DayDetail.tsx` / `CheckInForm.tsx` — Date format inconsistency: DayDetail heading uses European day-first with year ("25 February 2026"); Today subtitle uses US month-first without year ("February 25"). Standardise on European day-first with year across both surfaces. Touches two files. (Pre-existing) — audit-design-overall
- `DayDetail.tsx` — "Edit this day" tertiary link has ~28–32px vertical size, below the 44px minimum. Add `min-h-[44px] flex items-center` to the link element. (New — Sprint 11) — audit-interaction
- `CheckInForm.tsx` line 190 — "Please enter a name." → "Give this moment a name." (pre-existing) — audit-microcopy
- `CheckInForm.tsx` line 197 — "A moment with that name already exists." → "You&apos;ve already got a moment called that." (pre-existing) — audit-microcopy
- `ManageView.tsx` lines 355, 528 — "Start at" field placeholder `"0"` → `placeholder="Optional"` in both the inline-edit form and the add-habit form. (New — Sprint 9) — audit-microcopy

---

## Design intent to carry forward

- The two-axis colour system (Dusk Blue for habits, Warm Ember for moments and joy) is the app&apos;s most visually distinctive design feature. Any future colour additions to the heatmap must preserve the proportional blending logic and the two-pole semantics.
- Clarity&apos;s emotional identity — no gamification, no streaks, no progress bars — is successfully reflected end-to-end. The amber semantic weight (joy, archive, reset — all reversible, all warm) is consistent throughout. Treat this as a hard constraint when evaluating any new feature.
- The Joy section&apos;s conditional appearance (revealed only after at least one boolean habit is marked done) makes the factual/emotional separation tangible without explanation. This pattern should inform any future conditional UI sections: the emotional question should arrive only when there is something to reflect on.
- "Day captured" is the most affirming the app ever gets. Its restraint is the target register for any future state messaging or confirmation copy.
- The nav-link hover pattern (`stone-600 → stone-800`, two steps darker) is intentionally codified in CLAUDE.md as a nav-specific exception to the one-step hover rule. The Medium action above adds formal documentation to the Calma spec.
- The "Highlights" section label (renamed from "Joy" in Sprint 9) is broader and less precise. "Joy" named a specific emotional category; "Highlights" suggests summary. The rename is unlikely to cause confusion but slightly dilutes the intentional factual/emotional split (Habits = fact, Joy = feeling). Monitor in user testing before revisiting.
- The NumberStepper&apos;s amber pill when non-zero is consistent with the system-wide active/positive accent and does not read as a gamified score — it increments without celebration or fanfare. The framing remains observational. Preserve this register if the stepper design changes.
- ManageView has no `border-t` divider between the Habits and Moments sections (unlike SettingsView). When the Habits list is long, the visual jump to Moments can feel abrupt. Consider adding a divider in a future structural pass if the page grows.

---

## Summary

| # | Title | File | Severity | Source |
|---|-------|------|----------|--------|
| 1 | Calma spec: document nav-link two-step hover | `docs/calma-design-language.md` | Medium | audit-interaction · audit-design-overall |

Critical: 0 · High: 0 · Medium: 1 · Deferred: 23
Design intent notes: 8
