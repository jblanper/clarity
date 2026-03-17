# Audit Action List

Generated: 2026-03-16 14:25
Source audits: audit-colour.md · audit-typography.md · audit-interaction.md · audit-microcopy.md · audit-design-overall.md

Archived previous action list → docs/audits/archive/audit-action-list-2026-03-16.md

Sprint 13 resolved all five issues from the Sprint 12 action list: SegmentedPill inactive contrast (Critical), SettingsView back button touch target (Medium), SettingsView remove-file ✕ touch target (Medium), ManageView habit row `aria-expanded` (Medium). The nav-link hover Calma-spec documentation Medium carries forward unresolved. Two findings from `audit-design-overall` (dated 2026-03-14, post-Sprint 9) remain open and are classified here for the first time.

---

## Critical

None.

---

## High

### HistoryView — empty-state message positioned after Frequency toggle

Source: audit-design-overall (M1 — flagged as the single most important observation)
File: `components/HistoryView.tsx`

What to fix:
When `entries.length === 0`, the page currently renders: (1) all-grey calendar, (2) a Frequency toggle button, (3) the empty-state message below the toggle. A first-time user encounters a toggleable section — implying data exists — before seeing the explanation that nothing has been logged. Expanding Frequency produces a second empty message ("Nothing logged in this period") that overlaps with the first. Two changes, both in `HistoryView.tsx`: (1) suppress the Frequency section entirely when `entries.length === 0` — the toggle and its contents should not render — and (2) move the empty-state message `<p>` immediately below the heatmap so it reads as the calendar's own empty state rather than a page footer.

---

## Medium

### Calma spec — document nav-link two-step hover as a named exception

Source: audit-interaction · audit-design-overall (confirmed by 2 audits)
File: `docs/calma-design-language.md`

What to fix:
Nav links throughout the app use `text-stone-600 hover:text-stone-800` — a two-step jump — while the Calma spec states "Color transitions are subtle — one step along the scale. No exceptions." This causes every future interaction audit to flag it as a violation. In `docs/calma-design-language.md`, under the Interaction section "States", add a named exception note: "Nav-link hover exception: navigation links start at stone-600 and jump two steps to stone-800 on hover (rather than the standard one-step rule) because the lighter starting tone requires more contrast shift to communicate the hover state clearly." No code changes required; the fix is 1–3 lines in the spec document.

---

## Deferred

Low findings and non-trivial Medium findings deferred to a polish pass:

### Medium — non-trivial (touches more than one file)

- `HistoryView.tsx` · `ManageView.tsx` — Page headers use `flex items-center justify-between`; CLAUDE.md specifies `flex items-start justify-between`. Swap `items-center` → `items-start` in both files. Visually harmless on single-line headers. Deferred: touches two files. — audit-design-overall M2

### Low — colour

- `CalendarHeatmap.tsx` ~300 — Day-of-week labels use `dark:text-stone-600`; wrong direction in dark (lower contrast, not higher). Correct to `dark:text-stone-500`. Pre-existing. — audit-colour

### Low — typography & spacing

- `ManageView.tsx` lines 406, 677 — Archived disclosure toggles have `py-1` only, no `min-h-[44px]`. Low-priority secondary controls below the active list. New in Sprint 13. — audit-typography · audit-interaction
- `CalendarHeatmap.tsx` ~230 — Year display uses `text-sm uppercase tracking-widest`; should be `text-xs uppercase tracking-widest` for spec compliance. Pre-existing. — audit-typography
- `SettingsView.tsx` sections — `mb-8` spacing throughout; internal `border-t` dividers compensate. Pre-existing. — audit-typography
- `DayDetail.tsx` ~200 — Numeric value uses `font-medium`; borderline but acceptable for data emphasis. Pre-existing. — audit-typography
- `NumberStepper.tsx` line 66 — Pill button value has no explicit `text-sm` class. Pre-existing. — audit-typography
- `ManageView.tsx` action tray buttons (~line 287) — Revealed tray secondary pills have no `min-h-[44px]`. Pre-existing pattern for secondary controls inside a tray. — audit-typography

### Low — interaction & motion

- `BottomNav.tsx` line 34 — Inactive tabs have `transition-colors` but no hover colour target; add `hover:text-stone-700 dark:hover:text-stone-300` so the transition has something to animate. Pre-existing. Confirmed by 2 audits. — audit-interaction · audit-design-overall
- `SettingsView.tsx` line 227 — Remove-file "✕" has `hover:text-stone-700` but no `transition-colors`. Pre-existing. — audit-interaction
- `ManageView.tsx` lines 425, 430 — "Yes / No" and "Number" type-pickers have `hover:underline` but no `transition-colors`. Pre-existing. — audit-interaction
- `NumberStepper.tsx` — `role="spinbutton"` has no `onKeyDown` arrow-key handler; keyboard increment/decrement not possible. Pre-existing (accepted per sprint plan). — audit-interaction
- `NumberStepper.tsx` — `aria-valuemax` absent when `max !== Infinity`; revisit if a configurable max is introduced. Pre-existing. — audit-interaction
- `CalendarHeatmap.tsx` ~341, ~347 — Future and filter-dimmed cells at `opacity-25`; raise to `opacity-30` (30% disabled-state floor). Pre-existing. — audit-interaction
- `FrequencyList.tsx` ~148 — Inactive-filter chevron uses `invisible` (visibility: hidden) instead of `opacity-0`. Pre-existing. — audit-interaction
- `ManageView.tsx` exit animations — default easing is `easeOut` for exits rather than CLAUDE.md-recommended `easeIn`; consistent with pre-existing pattern. — audit-interaction

### Low — microcopy

- `CheckInForm.tsx` line 190 — "Please enter a name." → suggested rewrite "Give this moment a name." Pre-existing. — audit-microcopy
- `CheckInForm.tsx` line 197 — "A moment with that name already exists." → suggested rewrite "You&apos;ve already got a moment called that." Pre-existing. — audit-microcopy
- `SettingsView.tsx` line 301 — Reset warning could be more explicit about permanence: "This will permanently remove all your entries and reset habits to defaults. This can&apos;t be undone." Current copy is unambiguous; suggested rewrite adds stronger permanence signal. — audit-microcopy

### Low — visual consistency

- `DayDetail.tsx` — Done-habit indicator is Unicode `✓` at `text-stone-500`; HabitToggle uses an amber dot for done state. Replace `✓` with a small amber dot (`h-2 w-2 rounded-full bg-amber-500`) to unify visual vocabulary between form and review surfaces. — audit-design-overall L1
- `CheckInForm.tsx` line ~361 · `ManageView.tsx` — Add-action glyph mismatch: `＋` (fullwidth U+FF0B) in CheckInForm vs `+` (ASCII U+002B) in ManageView. Align to ASCII `+` in CheckInForm. Touches two files. — audit-design-overall L2
- `DayDetail.tsx` · `CheckInForm.tsx` — Date format inconsistency: DayDetail heading uses European day-first with year ("25 February 2026"); Today subtitle uses US month-first without year ("February 25"). Standardise on European day-first with year across both. Touches two files. — audit-design-overall L3

---

## Design intent to carry forward

- The two-axis colour system (Dusk Blue for habits, Warm Ember for moments and joy) is the app's most visually distinctive design feature. Any future colour additions to the heatmap must preserve the proportional blending logic and the two-pole semantics.
- Clarity's emotional identity — no gamification, no streaks, no progress bars — is successfully reflected end-to-end. The amber semantic weight (joy, archive, reset — all reversible, all warm) is consistent throughout. Treat this as a hard constraint when evaluating any new feature.
- The Joy section's conditional appearance (revealed only after at least one boolean habit is marked done) makes the factual/emotional separation tangible without explanation. This pattern should inform any future conditional UI sections: the emotional question should arrive only when there is something to reflect on.
- "Day captured" is the most affirming the app ever gets. Its restraint is the target register for any future state messaging or confirmation copy.
- The nav-link hover pattern (`stone-600 → stone-800`, two steps darker) is intentionally codified in CLAUDE.md as a nav-specific exception to the one-step hover rule. The Medium action above adds formal documentation to the Calma spec.
- The "Highlights" section label (renamed from "Joy" in Sprint 9) is broader and less precise. "Joy" named a specific emotional category; "Highlights" suggests a summary. The rename is unlikely to cause confusion but slightly dilutes the intentional factual/emotional split (Habits = fact, Joy = feeling). Monitor in user testing before revisiting.
- The NumberStepper's amber pill when non-zero is consistent with the system-wide active/positive accent and does not read as a gamified score — it increments without celebration or fanfare. The framing remains observational. Preserve this register if the stepper design changes.
- ManageView has no `border-t` divider between the Habits and Moments sections (unlike SettingsView). When the Habits list is long, the visual jump to Moments can feel abrupt. Consider adding a divider in a future structural pass if the page grows.

---

## Summary

| # | Title | File | Severity | Source |
|---|-------|------|----------|--------|
| 1 | HistoryView — empty-state after Frequency toggle | `HistoryView.tsx` | High | audit-design-overall |
| 2 | Calma spec — nav-link two-step hover exception | `calma-design-language.md` | Medium | audit-interaction · audit-design-overall |

Critical: 0 · High: 1 · Medium: 1 · Deferred: 21 · Design intent notes: 8
