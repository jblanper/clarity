# Audit Action List

Generated: 2026-03-10 10:42
Source audits: audit-colour.md · audit-typography.md · audit-interaction.md · audit-microcopy.md · audit-design-overall.md

---

## Critical

None.

---

## High

### CheckInForm add-moment flow: three touch targets below 44px

Source: audit-interaction.md · audit-design-overall.md (single most important observation)
File: `CheckInForm.tsx` (lines 361, 395, 403)

What to fix:
Three elements in the add-moment flow fall below the 44px touch-target minimum required by the Calma spec. The "＋ New moment" dashed trigger button (line 361) uses `py-2` (≈ 32px). The inline "Add" confirm button (line 395) also uses `py-2` (≈ 32px). The dismiss "✕" button (line 403) has no sizing at all (≈ 20px) and sits immediately adjacent to the Add button, creating a real mis-tap risk on mobile. Add `min-h-[44px]` to the trigger button and the Add button; wrap the ✕ in a `min-h-[44px] min-w-[44px] flex items-center justify-center` container without changing its visual appearance. Follow the HabitToggle pattern: a transparent hit area with an inner visual element, so the tap area is larger than what is visible.

---

### HistoryView inactive period selector fails WCAG AA in light mode

Source: audit-colour.md · audit-design-overall.md
File: `HistoryView.tsx` (lines 129, 134, 139)

What to fix:
The inactive period selector buttons ("month", "3m", "always") use `text-stone-400 dark:text-stone-500`. In light mode, stone-400 (#a8a29e) is 2.4:1 contrast against the page background — well below the WCAG AA minimum of 4.5:1. The Calma spec and CLAUDE.md both prohibit `text-stone-400` as foreground in light mode. Change to `text-stone-500 dark:text-stone-500` to meet the contrast floor while preserving visual distinction from the active state (which uses a darker token). The design-overall audit notes these buttons appear on a page experienced users visit often, elevating the practical risk.

---

## Medium

No Medium findings meet the inclusion criteria (one to three lines, at most one file). The remaining Medium findings from the source audits are deferred — see below.

---

## Deferred

Low findings and non-trivial Medium findings deferred to a polish pass:

- `HistoryView.tsx` — History empty state appears below the Frequency section divider, disconnected from the blank calendar it describes. Moving it between the heatmap and the section divider would improve first-time user orientation. Structural JSX change. (Medium) — audit-design-overall
- `SettingsView.tsx` (lines 110, 142, 153, 226, 297, 313, 327, 335) — Bare-text controls with no `min-h` touch target. (Medium, multi-line batch) — audit-interaction
- `ManageView.tsx` (lines 244, 278, 289, 292, 345, 353, 388, 417, 423, 597) — Bare-text controls with no `min-h` touch target. (Medium, multi-line batch) — audit-interaction
- `HelpView.tsx` (lines 21, 102) — Back link and design-language link: `text-xs` only, no `min-h`. (Medium) — audit-interaction
- Nav-link two-step hover (`stone-600 → stone-800`) deviates from the one-step Calma spec — already codified as intentional in CLAUDE.md. Should be formally documented as a named exception in `docs/calma-design-language.md` before the next audit cycle; without it, audits will continue flagging it. (Medium — requires doc update, not code change) — audit-interaction
- `ManageView.tsx` lines 380, 590 — Archived confirmation notes at `text-stone-400 dark:text-stone-500` (intentional archival dimming; Low) — audit-colour
- `CalendarHeatmap.tsx` ~300 — Day-of-week labels use `dark:text-stone-600`; should be `dark:text-stone-500` (wrong direction — lower contrast in dark mode; Low) — audit-colour
- `SettingsView.tsx` line 332 — Cancel button has no explicit `dark:text-*` base; stone-500 passes contrast but is inconsistent with the pattern (Low) — audit-colour
- `CalendarHeatmap.tsx` ~230 — Year display uses `text-sm uppercase tracking-widest`; should be `text-xs uppercase tracking-widest` (Low) — audit-typography
- `SettingsView.tsx` sections — `mb-8` spacing throughout vs Calma 2.5rem baseline; internal dividers compensate (Low) — audit-typography
- `DayDetail.tsx` ~200 — Numeric value `font-medium`; borderline acceptable for data emphasis (Low) — audit-typography
- `SettingsView.tsx` line 229 — Remove-file "✕" button has `hover:text-stone-700` but no `transition-colors` (Low) — audit-interaction
- `ManageView.tsx` lines 417, 423 — "Yes / No" and "Number" type-pickers have `hover:underline` but no `transition-colors` (Low) — audit-interaction
- `BottomNav.tsx` line 31 — Inactive tabs have `transition-colors` but no hover colour defined; transition fires over nothing. Add `hover:text-stone-700 dark:hover:text-stone-300` (Low) — audit-interaction
- `CalendarHeatmap.tsx` ~341, ~347 — Future day cells and filter-dimmed cells at `opacity-25` / inline `opacity: 0.25`, below the 30% disabled-state floor (Low) — audit-interaction
- `FrequencyList.tsx` ~148 — Inactive-filter chevron uses `visibility: hidden` (`invisible`) instead of `opacity-0` (Low) — audit-interaction
- `HabitToggle.tsx` line 44 — Thumb uses `transition-all` (overly broad); narrow to `transition-[left]` (Low) — audit-interaction
- `ManageView.tsx` line 278 — joyByDefault inline toggle button has `transition-colors` but no `active:opacity-70` press-state feedback; it is the only interactive element in the list section without active-state acknowledgment (Low) — audit-interaction · audit-design-overall
- `DayDetail.tsx` — Moments section heading uses `mb-3`; all other section headings in this component use `mb-2` (Low) — audit-design-overall
- `HistoryView.tsx` line 63, `ManageView.tsx` line 239 — Page header uses `flex items-center justify-between` where CLAUDE.md spec requires `flex items-start justify-between` (Low) — audit-design-overall
- `CheckInForm.tsx` line 190 — "Please enter a name." → suggested: "Give this moment a name." (Low) — audit-microcopy
- `CheckInForm.tsx` line 197 — "A moment with that name already exists." → suggested: "You&apos;ve already got a moment called that." (Low) — audit-microcopy

---

## Design intent to carry forward

- The two-axis colour system (Dusk Blue for habits, Warm Ember for moments and joy) is the app&apos;s most visually distinctive design feature. It is working correctly. Any future colour additions to the heatmap must preserve the proportional blending logic and the two-pole semantics.
- Clarity&apos;s emotional identity — no gamification, no streaks, no progress bars — is now successfully reflected end-to-end. The amber semantic weight (joy, archive, reset — all reversible, all warm) is consistent throughout. Treat this as a hard constraint when evaluating any new feature.
- The Joy section&apos;s conditional appearance (revealed only after at least one boolean habit is marked done) makes the factual/emotional separation tangible without explanation. This pattern should inform any future conditional UI sections: the emotional question should arrive only when there is something to reflect on.
- "Day captured" is the most affirming the app ever gets. Its restraint is the target register for any future state messaging or confirmation copy.
- The nav-link hover pattern (`stone-600 → stone-800`, two steps darker) is intentionally codified in CLAUDE.md as a nav-specific exception to the one-step hover rule. This exception should be formally documented in `docs/calma-design-language.md` as a named pattern so future audits do not flag it as a violation.
- The "＋ New moment" trigger button uses the fullwidth plus sign `＋` (CheckInForm line 361) while ManageView uses the standard `+` for equivalent add-item buttons. The difference is imperceptible to most users but represents a small inconsistency in the add-item vocabulary worth aligning in a future pass.

---

## Summary

| # | Title | File | Severity | Source |
|---|-------|------|----------|--------|
| 1 | CheckInForm add-moment flow: three touch targets below 44px | `CheckInForm.tsx` | High | audit-interaction · audit-design-overall |
| 2 | HistoryView inactive period selector fails WCAG AA in light mode | `HistoryView.tsx` | High | audit-colour · audit-design-overall |

Critical: 0 · High: 2 · Medium: 0 · Deferred: 22
Design intent notes: 6
