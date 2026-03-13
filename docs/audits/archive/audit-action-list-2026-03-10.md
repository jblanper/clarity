# Audit Action List

Generated: 2026-03-09 20:03
Source audits: audit-colour.md · audit-typography.md · audit-interaction.md · audit-microcopy.md · audit-design-overall.md

---

## Consolidation notes

Sprint 8 resolved all 9 High and 15 of 18 Medium findings from the 2026-03-07 action list. The five specific audits (colour, typography, interaction, microcopy) were re-run on 2026-03-08 and reflect the post-Sprint 8 codebase. The design-overall audit is dated 2026-03-07 (pre-Sprint 8); findings from it have been cross-checked against the specific audit reports to determine which remain open.

Findings confirmed open across multiple audits are noted and carry higher confidence.

---

## Critical

None.

---

## High

### DayDetail Edit link is styled as a footnote, not a primary action

Source: audit-design-overall (single most important observation per that audit)
File: `DayDetail.tsx` (lines 246–251)

What to fix:
The Edit link that takes the user to the edit screen — the primary action in the review sheet — is styled with `text-sm text-stone-500 dark:text-stone-400 ... hover:underline`: no uppercase, no widest tracking, no hover colour shift. It reads as a footnote. Every other navigation action in the codebase uses the `text-xs uppercase tracking-widest` pattern. Replace the current class string with `text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300`. This closes the sharpest hierarchy inversion in the app and makes the primary action in the most-visited review screen readable as an action.

---

## Medium

### SettingsView back button does not name its destination

Source: audit-design-overall
File: `SettingsView.tsx` (line 114)

What to fix:
The back button reads "← back" — the only navigation element in the app that does not name its destination. Every other nav link is explicit: "← history", "← Settings", "Today", "History". The `backDest` value read from sessionStorage on mount already determines where the user will go. Use it to display "← Today" when `backDest === "/"` and "← History" when `backDest === "/history"`. This is a one-line change to the button's text content.

---

### CheckInForm add-moment flow touch targets below 44 px

Source: audit-interaction
File: `CheckInForm.tsx` (lines 361, 395, 403)

What to fix:
Three elements in the add-moment sub-flow fall below the 44 px touch-target minimum: the "＋ New moment" dashed button (`py-2` ≈ 32 px, line 361), the inline "Add" confirm button (~32 px, line 395), and the dismiss "✕" button (~20 px, line 403). The ✕ is particularly small and positioned close to Add, creating a real mis-tap risk. Add `min-h-[44px]` to each of the three elements and add `flex items-center justify-center` where needed to keep content vertically centred. Do not change the visual padding or border-radius of any element.

---

## Deferred

Low findings and non-trivial Medium findings deferred to a polish pass:

- `ManageView.tsx` lines 378, 587 — archived confirmation notes at `text-stone-400` (intentional archival dimming; Low) — audit-colour
- `HistoryView.tsx` lines 129, 134, 139 — inactive period selector buttons at `text-stone-400 dark:text-stone-500` (functionally distinct; Low) — audit-colour
- `CalendarHeatmap.tsx` ~300 — day-of-week labels `dark:text-stone-600` (should be `dark:text-stone-500`; Low) — audit-colour
- `SettingsView.tsx` line 332 — Cancel button missing explicit `dark:text-*` base; stone-500 passes contrast (Low) — audit-colour
- `CalendarHeatmap.tsx` ~230 — year display `text-sm` where `text-xs` is expected (Low) — audit-typography
- `SettingsView.tsx` sections — `mb-8` spacing vs Calma baseline; dividers compensate (Low) — audit-typography
- `DayDetail.tsx` line 200 — numeric value `font-medium`; borderline acceptable (Low) — audit-typography
- `SettingsView.tsx` line 229 — remove-file "✕" button missing `transition-colors` (Low) — audit-interaction
- `ManageView.tsx` lines 417, 423 — "Yes / No" / "Number" type-picker buttons missing `transition-colors` (Low) — audit-interaction
- `BottomNav.tsx` line 31 — inactive tabs have `transition-colors` but no hover colour (Low) — audit-interaction
- `CalendarHeatmap.tsx` ~341, ~347 — future day cells and filter-dimmed cells at `opacity-25`, below the 30% floor (Low) — audit-interaction
- `FrequencyList.tsx` ~148 — inactive-filter chevron uses `visibility: hidden` instead of `opacity-0` (Low) — audit-interaction
- `HabitToggle.tsx` line 41 — thumb uses `transition-all`; narrow to `transition-[left]` (Low) — audit-interaction
- `CheckInForm.tsx` line 190 — "Please enter a name." → "Give this moment a name." (Low) — audit-microcopy
- `CheckInForm.tsx` line 197 — "A moment with that name already exists." → "You've already got a moment called that." (Low) — audit-microcopy
- Touch targets for bare-text controls in `SettingsView.tsx` (lines 110, 142, 153, 226, 297, 313, 327, 335), `ManageView.tsx` (lines 244, 278, 289, 292, 345, 353, 388, 597), `HelpView.tsx` (lines 21, 102) — Medium per audit-interaction but span many elements across multiple files; deferred as a batch
- Nav-link two-step hover (`stone-600 → stone-800`) deviates from the one-step Calma rule — Medium per audit-interaction; requires a design-language doc decision before any code change

---

## Design intent to carry forward

- The History heatmap's two-axis colour system (dusk blue for habits, warm ember for joy and moments) is the most visually distinctive feature of the app. Any future colour additions to the heatmap must preserve the proportional blending logic and the two-pole semantics.
- The Joy section's conditional appearance — revealed only after at least one boolean habit is marked done — makes the factual/emotional separation tangible without explaining it. This pattern should inform any future conditional UI sections: the emotional question should arrive only when there is something to reflect on.
- The nav-link hover pattern (`stone-600 → stone-800`, two steps darker) consistently deviates from the one-step Calma rule. Consider formalising this as a documented exception in `calma-design-language.md` before the next audit cycle; without documentation, it will continue to appear as a violation.
- Help is the best-written page in the app — accurate, unhurried, never condescending. Its register and depth should serve as the reference for any future content additions, onboarding copy, or expanded guidance.

---

## Summary

| # | Title | File | Severity | Source |
|---|-------|------|----------|--------|
| 1 | DayDetail Edit link styled as footnote | `DayDetail.tsx:246–251` | High | audit-design-overall |
| 2 | SettingsView back button destination unnamed | `SettingsView.tsx:114` | Medium | audit-design-overall |
| 3 | CheckInForm add-moment flow touch targets below 44 px | `CheckInForm.tsx:361,395,403` | Medium | audit-interaction |

Critical: 0 · High: 1 · Medium: 2 · Deferred: 18
Design intent notes: 4
