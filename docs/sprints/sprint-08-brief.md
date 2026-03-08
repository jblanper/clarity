# Sprint 8 Brief

**Status:** draft
**Created:** 2026-03-08
**Tier:** 2 — see [Sprint Tier Guide](../sprint-tier-guide.md)

> **Why Tier 2:** No new features, no data model changes, no new navigation or
> Calma patterns. Sprint touches animation polish, touch target sizing, and
> accessible copy — all carry interaction-layer risk invisible to static
> analysis. Arch review is cheap insurance; full UX pipeline is not warranted.
> Tier 2 sequence: write brief directly → `/sprint-arch` → `/sprint-plan`.

---

## Goals & Business Value

Sprint 8 is a quality pass targeting the two most tangible categories of
remaining debt: **touch accessibility** and **human-register copy**. No new
features, no data model changes, no new navigation.

The HIGH interaction findings (H5, H6) affect the two most-used controls in
the app — every user taps a HabitToggle or NumberStepper at least once per
day. Both are below the 44 px minimum by a meaningful margin (28 px and 32 px
respectively). The HIGH microcopy findings (H2, H7, H8, H9) expose developer
vocabulary — "Boolean", "Numeric", "JSON", raw exception messages — to a
general audience. These are the most obvious trust breaks in the product.

Clearing all 9 HIGH findings sets a clean baseline for the rest of the audit
backlog and completes the work the retro identified as "deferred twice."

---

## Proposed scope

### Group 1 — Touch targets (interaction, HIGH + medium)

- **H5 — HabitToggle:** `h-7` button (28 px) → `min-h-[44px]` with `flex
  items-center`. Visual switch dimensions unchanged.
- **H6 — NumberStepper:** `h-8 w-8` buttons (32 px) → `min-h-[44px]
  min-w-[44px]` with `flex items-center justify-center`. `disabled:opacity-30`
  must be preserved. Verify no row overflow.
- **M7 — CalendarHeatmap year-nav buttons:** No `min-h`; approximately 20 px.
  Add `min-h-[44px]` to both year-prev and year-next, vertically centre icon
  inside. Must match the adjacent month-nav buttons which already have
  `min-h-[44px]`.
- **M16 — MomentChip:** `py-2` gives approximately 32 px. Add `min-h-[44px]`
  and `flex items-center`. No change to visual padding or border-radius.
- **M17 — HabitToggle label:** Add explicit `text-sm` to label className.
- **M18 — NumberStepper label:** Add explicit `text-sm` to label className.

### Group 2 — Interaction & animation (HIGH + medium)

- **H1 — Joy blossom `active:scale-90`:** Scale transforms are Calma-forbidden.
  Replace `active:scale-90` with `active:opacity-70` on the joy blossom button
  in CheckInForm. Remove `transition-transform` if no other transform is in
  use on that element.
- **ManageView joy-icon toggle (♡/♥):** Lines 282 and 464 still use Unicode
  hearts for the joyByDefault toggle — the remaining icon inconsistency after
  the Sprint 7 DayDetail BlossomIcon fix. Replace with `<BlossomIcon
  filled={false} />` (inactive) and `<BlossomIcon filled={true} />` (active).
  These are interactive buttons, so press state and `type="button"` are
  required. Flagged in Sprint 7 Calma Sync and Retrospective as a direct
  Sprint 8 follow-on.
- **M8 — FrequencyList bar `width` animation:** Calma permits only opacity,
  translate, and height/max-height. Replace `animate={{ width: ... }}` with
  `scaleX` from 0 to target width, `style={{ transformOrigin: "left" }}`.
  Visual result identical; no layout reflow.
- **M9 — CalendarHeatmap month crossfade 110 ms:** Below the 120 ms Calma
  floor. Change `duration: 0.11` to `duration: 0.12`.

### Group 3 — Microcopy: vocabulary & error messages (HIGH + medium)

- **H2 — ManageView "Boolean"/"Numeric" labels:** Replace developer type names
  at lines 417 and 424. "Boolean" → "Yes / No"; "Numeric" → "Number". Applies
  to the habit-type selector visible when creating or editing a habit.
- **H7 — transferData.ts error messages:** Five strings at lines 111,
  115–118, 122–124, 167, 178. Replace with calm, specific, action-giving copy
  per the audit action list wording.
- **H8 — SettingsView import/export error copy:** Lines 186–188 (generic
  export failure); lines 79–81 (import error swallows the specific message from
  transferData.ts). Fix: surface the thrown error message directly instead of
  replacing it. Replace the export generic with "Couldn't download the backup
  — try again."
- **H9 — SettingsView export description "JSON":** Lines 175–177. Replace
  "Download all your habit entries as a JSON backup file." with "Download a
  backup of all your entries."
- **M4 — SettingsView import success messages:** Lines 248–259. "{n} entries
  imported." → "{n} days added." "{n} entries already existed and were kept."
  → "{n} days were already in your history and weren't changed."
- **M5 — CheckInForm add-moment placeholder:** Line 392. `placeholder="Moment
  name"` → `placeholder="e.g. Morning light"`.
- **M6 — ManageView "Does not bring joy by default":** Line 465. Replace with
  "♡ Joy is marked separately" to describe the behaviour in human terms.
- **M15 — ManageView "Step" field label:** Line 483. Replace "Step" with
  "Increment". Optionally add a `text-xs text-stone-500` hint: "The amount
  added each tap."

### Group 4 — UI text & hierarchy (HIGH + medium)

- **H3 — History page empty state:** When `entries.length === 0`, show a
  single calm line below the calendar: "Your days will appear here once you
  start logging." Matches the DayDetail empty-state register. No structural
  changes.
- **H4 — DayDetail Edit link:** Lines 246–251. Current style reads as a
  footnote. Replace class string with `text-xs uppercase tracking-widest
  text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800
  dark:hover:text-stone-300`.
- **M14 — SettingsView back button destination:** Line 114. Button reads "←
  back". Use the `backDest` value (already read from sessionStorage on mount)
  to display "← Today" when `backDest === "/"` and "← History" when
  `backDest === "/history"`.

### Group 5 — Typography & colour mediums

- **M1 — Reflection textarea:** Line 483 (CheckInForm). Add `text-sm
  font-light` to className. Aligns the writing surface with the DayDetail
  reading surface.
- **M2 — DayDetail date heading:** Line 161. `text-lg tracking-wide` →
  `text-base tracking-widest`. Calma section-heading scale.
- **M3 — SettingsView Theme/"Your data" labels:** Lines 136, 169. Both have
  the correct colour but are missing `font-medium`. These were incorrectly
  stated as "already correct" in the Sprint 7 implementation notes — the
  validation audit found otherwise. Add `font-medium` to each.
- **M10 — ManageView "Jump to Moments" anchor:** Line 254. `text-stone-400`
  fails WCAG AA (2.4:1). → `text-stone-600 dark:text-stone-500`. Add
  `transition-colors`.
- **M11 — ManageView numeric unit label:** Line 273. `text-stone-400` →
  `text-stone-500`. Dark pairing already correct.
- **M12 — CheckInForm "New moment" ghost button:** Line 364. `text-stone-400`
  → `text-stone-500`.
- **M13 — CheckInForm dismiss "✕":** Line 405. `text-stone-400` →
  `text-stone-500`.

---

## Out of scope

- Remaining medium touch targets across SettingsView, ManageView, HelpView
  (deferred batch — many elements, one future sprint)
- Nav-link two-step hover deviation (`stone-600 → stone-800`) — requires a
  design-language doc decision before code change
- `SECTION_LABEL` constant consolidation into a shared `lib/styles.ts` —
  infrastructure sprint, not this sprint
- ManageView at 655 lines — watch threshold; extraction of inline form
  rendering deferred to the next feature sprint
- All Deferred findings from the audit action list (low severity)

---

## Open questions

- **Joy-icon BlossomIcon sizing in ManageView:** In CheckInForm, the
  interactive joy blossom uses the default size. The ManageView joyByDefault
  toggle sits beside a `text-sm` label. What size keeps it visually balanced?
  Arch to advise.
- **M15 "Increment" hint text:** Is "The amount added each tap." the right
  phrasing? One line is sufficient; exact wording is a copy decision.
- **H3 empty state placement:** The calendar renders even with no entries (all
  cells are muted stone). Should the empty-state message sit above the
  calendar, below it, or replace it entirely? Arch to advise.
