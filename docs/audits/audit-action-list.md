# Audit Action List

Generated: 2026-03-15 21:06
Source audits: audit-colour.md · audit-typography.md · audit-interaction.md · audit-microcopy.md · audit-design-overall.md

Archived previous action list → docs/audits/archive/audit-action-list-2026-03-15.md

Sprint 12 resolved all remaining deferred touch-target mediums (SettingsView App card links, Reset buttons, HelpView links, ManageView back + habit rows + chip grid + "Edit this day" link) and both Start-at placeholder lows. Two pre-existing mediums remain (SettingsView back button and remove-file button). One new WCAG AA failure introduced: SegmentedPill inactive segment text. One new ARIA medium introduced: ManageView habit row missing `aria-expanded`.

---

## Critical

### [CRITICAL] SegmentedPill — inactive segment text fails WCAG AA

**Audits:** audit-colour
**File:** `components/SegmentedPill.tsx` line 22
**Found:** Inactive segment uses `text-stone-500 dark:text-stone-400`. Stone-500 (`#78716c`) on stone-100 (`#f5f5f4`, the pill container background) is ≈3.7:1 — below the 4.5:1 AA minimum for small text (`text-sm`).
**Fix:** Change `text-stone-500` to `text-stone-600` on the inactive segment class. `text-stone-600` (`#57534e`) on stone-100 is ≈5.0:1 — passes AA. Keep `dark:text-stone-400` unchanged (dark pairing is already compliant).
**Confidence:** Single audit

---

## High

None.

---

## Medium

### [MEDIUM] SettingsView — back button has no touch target

**Audits:** audit-typography · audit-interaction
**File:** `components/SettingsView.tsx` line 116
**Found:** The back button uses `className="mt-2 text-xs uppercase tracking-widest text-stone-600 ..."` with no `min-h` or `flex` wrapping. Its actual rendered height is approximately 18–20 px — well below the 44 px minimum.
**Fix:** Add `flex min-h-[44px] items-center` to the button's className, keeping existing classes. No structural change needed — the button is already the only element in that position in the header.
**Confidence:** Confirmed by 2 audits

---

### [MEDIUM] SettingsView — remove-file "✕" button has no touch target

**Audits:** audit-typography · audit-interaction
**File:** `components/SettingsView.tsx` line 227
**Found:** The "✕" button to remove the selected import file uses `className="ml-3 flex-shrink-0 text-stone-500 ..."` with no `min-h`. The button is approximately 16 × 16 px — unusable on mobile.
**Fix:** Add `min-h-[44px] flex items-center` to the button's className. This widens the tap target vertically without affecting layout, since the button is inside a flex row and its height is currently constrained by the text line.
**Confidence:** Confirmed by 2 audits

---

### [MEDIUM] ManageView — habit row tap button missing `aria-expanded`

**Audits:** audit-interaction
**File:** `components/ManageView.tsx` line 253
**Found:** The full-row `<button>` that reveals the action tray has no `aria-expanded` or `aria-controls` attribute. Screen-reader users who tap the button get no feedback that an action tray appeared or that it is now visible.
**Fix:** Add `aria-expanded={actionTrayId === h.id}` to the button element. Optionally add `aria-controls` referencing the tray `id` if you want the strongest association, but `aria-expanded` alone satisfies the immediate gap. The tray `<AnimatePresence>` block at line 278 would need an `id` prop on its root element to support `aria-controls`.
**Confidence:** Single audit

---

### [MEDIUM] Calma spec — document nav-link two-step hover as a named exception

**Audits:** audit-interaction · audit-design-overall
**File:** `docs/calma-design-language.md`
**Found:** Nav links throughout the app use `text-stone-600 hover:text-stone-800` — a two-step jump rather than the one-step hover stated in the Calma spec ("Color transitions are subtle — one step along the scale. No exceptions."). This is an intentional, codified choice in CLAUDE.md but the Calma spec contradicts it, causing future audits to flag it as a violation.
**Fix:** In `docs/calma-design-language.md`, under the Interaction section "States", add a named note "Nav-link hover exception: navigation links start at stone-600 and jump two steps to stone-800 on hover (rather than the standard one-step rule) because the lighter starting tone requires more contrast shift to communicate the hover state clearly."
**Confidence:** Confirmed by 2 audits

---

## Deferred

Low findings and non-trivial Medium findings deferred to a polish pass:

### Medium — non-trivial (multiple lines or multiple files)

- `HistoryView.tsx` line 63 · `ManageView.tsx` line 220 — Page header uses `flex items-center justify-between` where CLAUDE.md specifies `flex items-start justify-between`; swap `items-center` → `items-start`. Touches two files. (Medium, confirmed by audit-design-overall M2 and audit-design-overall) — audit-design-overall

### Low

- `CalendarHeatmap.tsx` ~300 — Day-of-week labels use `dark:text-stone-600`; should be `dark:text-stone-500` (wrong direction — lower contrast in dark mode, pre-existing) — audit-colour
- `SegmentedPill.tsx` — Inactive segment `text-stone-500` on stone-100 note: the Critical fix above raises to `text-stone-600`; dark variant `dark:text-stone-400` is already fine — audit-colour
- `CalendarHeatmap.tsx` ~230 — Year display uses `text-sm uppercase tracking-widest`; should be `text-xs uppercase tracking-widest` (pre-existing) — audit-typography
- `SettingsView.tsx` sections — `mb-8` spacing throughout; internal `border-t` dividers compensate (pre-existing) — audit-typography
- `DayDetail.tsx` ~200 — Numeric value uses `font-medium`; borderline acceptable for data emphasis (pre-existing) — audit-typography
- `NumberStepper.tsx` line 66 — Pill button value has no explicit `text-sm` class (pre-existing) — audit-typography
- `ManageView.tsx` action tray buttons (line ~287) — Bare-text secondary buttons in the revealed tray have no `min-h-[44px]`; secondary inline actions within a tray are exempt from the primary touch-target rule but worth a future review — audit-typography
- `SettingsView.tsx` line 227 — Remove-file "✕" has `hover:text-stone-700` but no `transition-colors` (pre-existing) — audit-interaction
- `ManageView.tsx` lines 425, 430 — "Yes / No" and "Number" type-pickers have `hover:underline` but no `transition-colors` (pre-existing) — audit-interaction
- `BottomNav.tsx` line 34 — Inactive tabs have `transition-colors` but no hover colour defined; add `hover:text-stone-700 dark:hover:text-stone-300` so the transition has a target (confirmed by 2 audits) — audit-interaction · audit-design-overall
- `ManageView.tsx` line 263 — Habit row full-row tap has no `transition-colors` and no hover colour; `active:opacity-70` is the only press feedback (new — Sprint 12) — audit-interaction
- `CalendarHeatmap.tsx` ~341, ~347 — Future day cells and filter-dimmed cells at `opacity-25`, below the 30% disabled-state floor (pre-existing) — audit-interaction
- `FrequencyList.tsx` ~148 — Inactive-filter chevron uses `invisible` (`visibility: hidden`) instead of `opacity-0` (pre-existing) — audit-interaction
- `NumberStepper.tsx` line 59 — `role="spinbutton"` has no `onKeyDown` arrow-key handler; keyboard users cannot increment/decrement (pre-existing — accepted per sprint plan) — audit-interaction
- `NumberStepper.tsx` line 59 — `aria-valuemax` absent when `max !== Infinity`; revisit if max becomes configurable (pre-existing) — audit-interaction
- `ManageView.tsx` exit animations — default easing is `easeOut` for exits rather than the CLAUDE.md-recommended `easeIn`; consistent with pre-existing pattern throughout ManageView — audit-interaction
- `DayDetail.tsx` — Done-habit indicator is Unicode `✓` at `text-stone-500`; HabitToggle uses amber dot for done state. Replace `✓` with a small amber dot (`h-2 w-2 rounded-full bg-amber-500`) to unify visual vocabulary across form and review — audit-design-overall
- `CheckInForm.tsx` line 361 · `ManageView.tsx` — Add-action glyph inconsistency: `＋` (fullwidth U+FF0B) in CheckInForm vs `+` (ASCII U+002B) in ManageView. Align to ASCII `+` in CheckInForm. Touches two files — audit-design-overall
- `DayDetail.tsx` / `CheckInForm.tsx` — Date format inconsistency: DayDetail heading uses European day-first with year ("25 February 2026"); Today subtitle uses US month-first without year ("February 25"). Standardise on European day-first with year. Touches two files — audit-design-overall
- `CheckInForm.tsx` line 190 — "Please enter a name." → "Give this moment a name." (pre-existing) — audit-microcopy
- `CheckInForm.tsx` line 197 — "A moment with that name already exists." → "You&apos;ve already got a moment called that." (pre-existing) — audit-microcopy
- `SettingsView.tsx` line 301 — Reset warning "Your entries will be removed and habits reset to defaults." could be more explicit about permanence: "This will permanently remove all your entries and reset habits to defaults. This can&apos;t be undone." (Low — tone is acceptable; current copy is unambiguous) — audit-microcopy

---

## Design intent to carry forward

- The two-axis colour system (Dusk Blue for habits, Warm Ember for moments and joy) is the app's most visually distinctive design feature. Any future colour additions to the heatmap must preserve the proportional blending logic and the two-pole semantics.
- Clarity's emotional identity — no gamification, no streaks, no progress bars — is successfully reflected end-to-end. The amber semantic weight (joy, archive, reset — all reversible, all warm) is consistent throughout. Treat this as a hard constraint when evaluating any new feature.
- The Joy section's conditional appearance (revealed only after at least one boolean habit is marked done) makes the factual/emotional separation tangible without explanation. This pattern should inform any future conditional UI sections: the emotional question should arrive only when there is something to reflect on.
- "Day captured" is the most affirming the app ever gets. Its restraint is the target register for any future state messaging or confirmation copy.
- The nav-link hover pattern (`stone-600 → stone-800`, two steps darker) is intentionally codified in CLAUDE.md as a nav-specific exception to the one-step hover rule. The Medium action above adds formal documentation to the Calma spec.
- The "Highlights" section label (renamed from "Joy" in Sprint 9) is broader and less precise. "Joy" named a specific emotional category; "Highlights" suggests summary. The rename is unlikely to cause confusion but slightly dilutes the intentional factual/emotional split (Habits = fact, Joy = feeling). Monitor in user testing before revisiting.
- The NumberStepper's amber pill when non-zero is consistent with the system-wide active/positive accent and does not read as a gamified score — it increments without celebration or fanfare. The framing remains observational. Preserve this register if the stepper design changes.
- ManageView has no `border-t` divider between the Habits and Moments sections (unlike SettingsView). When the Habits list is long, the visual jump to Moments can feel abrupt. Consider adding a divider in a future structural pass if the page grows.
- The theme picker in SettingsView (two `text-sm` text buttons with `font-medium` on the active state) replaced by the SegmentedPill in Sprint 12 is the right call — the pill makes the mutual-exclusion and the active state unambiguous at a glance.

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 0 |
| Medium | 4 |
| Deferred | 23 |
| Design intent | 9 |
| **Total actioned** | **5** |
