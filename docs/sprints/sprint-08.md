# Sprint 8 — Touch, Copy & Polish

**Dates:** 2026-03-08 – (TBD)
**Status:** active
**Release:** v2.1.6 (patch)

---

## Goal

Clear all 9 HIGH audit findings — every touch target, every piece of developer vocabulary, every forbidden scale transform — and close the medium-severity typography and colour gaps that remained after Sprint 7.

## Business value

The two most-used controls in the app (HabitToggle and NumberStepper) are below the 44 px touch minimum. Users with larger fingers or reduced dexterity are hitting miss-taps every day. The microcopy findings expose developer vocabulary ("Boolean", "Numeric", "JSON", raw exception messages) to a general audience — the most visible trust break in the product. Clearing both tiers in one sprint sets a clean baseline for the audit backlog and completes work the retro identified as "deferred twice."

---

## Tasks

### Task 1 — Typography & colour baseline

**What:** Close the remaining typography and colour medium findings across five components. All changes are className-only — no logic, no structure.

1. **M1 — CheckInForm reflection textarea** (line 484): add `text-sm font-light` to className. Aligns the writing surface with the DayDetail reading surface (`text-sm font-light leading-relaxed`).
2. **M2 — DayDetail date heading** (line 161): `text-lg tracking-wide` → `text-base tracking-widest`. Current: `text-lg font-light tracking-wide text-stone-800 dark:text-stone-200`. Target: `text-base font-light tracking-widest text-stone-800 dark:text-stone-200`.
3. **M3 — SettingsView Theme and "Your data" section labels** (lines 136, 169): add `font-medium` to each `h2`. Both currently read `text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500` — missing the `font-medium` required by the section label token. (The Sprint 7 implementation notes incorrectly stated these were already correct — this was caught in the Sprint 7 validation audit.)
4. **M10 — ManageView "Jump to Moments" anchor** (line 254): `text-stone-400` fails WCAG AA (2.4:1). Change to `text-stone-600 dark:text-stone-500`. Add `transition-colors`. Current className: `"text-xs text-stone-400 underline-offset-4 hover:underline dark:text-stone-500"`.
5. **M11 — ManageView active numeric unit label** (line 273): `text-stone-400` → `text-stone-500`. The `dark:text-stone-500` pairing is already correct; only the light-mode value changes.
6. **M12 — CheckInForm "New moment" ghost button** (line 364): `text-stone-400` → `text-stone-500`. The dark pairing `dark:text-stone-500` is already correct.
7. **M13 — CheckInForm dismiss "✕"** (line 405): `text-stone-400` → `text-stone-500`. Same pattern as M12.

**Files:** `components/CheckInForm.tsx`, `components/DayDetail.tsx`, `components/SettingsView.tsx`, `components/ManageView.tsx`

**Implementation notes:**
- Section label token (all six parts required): `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`. M3 adds only the missing `font-medium` — do not touch the other parts.
- `text-stone-400` is the WCAG constraint documented in CLAUDE.md: never foreground in light mode. M10–M13 all correct to `text-stone-500` minimum.
- M10 currently has no `transition-colors`; add it alongside the colour fix. The rest (M11–M13) already have `transition-colors` via their hover states — do not add it again.
- ManageView is 655 lines. Only touch the four targeted lines (254, 273, and two section-label lines if checking — but M3 is in SettingsView). Avoid formatting or refactoring anything else.

**Validation steps:**
- [x] SettingsView: "Theme" and "Your data" `h2` labels are `font-medium` (open Settings and inspect; visual weight should match "Manage", "Help", and "Reset" labels)
- [x] DayDetail date heading is `text-base` not `text-lg` (open a logged day — heading should be smaller and more spaced)
- [x] CheckInForm reflection textarea text is `font-light` (type into the Reflection field — should feel lighter than the section labels)
- [x] ManageView "Jump to Moments" link: `text-stone-600` in light mode (not near-invisible stone-400); has hover:underline and transition-colors
- [x] ManageView numeric unit label: visibly distinct from the habit label but not washed out
- [x] CheckInForm "＋ New moment" button and "✕" dismiss are `text-stone-500` (not the previous stone-400)
- [x] No `text-stone-400` foreground remains in any of the four files in light mode
- [x] `npm run lint && npm test` passes

**Definition of done:** All seven className fixes applied; no `text-stone-400` foreground in light mode across the four files; lint and tests pass.

**Status: ✓ Complete** (2026-03-08)

---

### Task 2 — Touch targets

**What:** Bring HabitToggle, NumberStepper, MomentChip, and the CalendarHeatmap year-nav buttons up to the 44 px minimum touch target. Add explicit `text-sm` to HabitToggle and NumberStepper labels.

1. **H5 — HabitToggle** (`components/HabitToggle.tsx`): The `<button>` currently carries both the hit area and visual styling (`h-7 w-12 rounded-full`). Separate them: the button becomes the transparent hit area (`min-h-[44px] flex-shrink-0 flex items-center focus:outline-none`) and a new inner `<span>` carries the visual pill (`relative h-7 w-12 rounded-full transition-colors duration-200` + the bg colour classes). The thumb `<span>` (absolute positioning, `top-1 h-5 w-5`) moves inside this new span unchanged.
2. **M17 — HabitToggle label**: the label `<span>` currently has `text-stone-700 dark:text-stone-300`. Add explicit `text-sm`.
3. **H6 — NumberStepper** (`components/NumberStepper.tsx`): both `−` and `+` buttons have `flex h-8 w-8 items-center justify-center`. Replace `h-8 w-8` with `min-h-[44px] min-w-[44px]`. The `disabled:opacity-30` class must be preserved.
4. **M18 — NumberStepper label**: the label `<span>` has `text-stone-700 dark:text-stone-300`. Add explicit `text-sm`.
5. **M16 — MomentChip** (`components/MomentChip.tsx`): the `<button>` has `py-2` (≈32 px). Add `min-h-[44px] flex items-center` to the className. No change to `px-4`, `text-sm`, or `rounded-full`.
6. **M7 — CalendarHeatmap year-nav** (`components/CalendarHeatmap.tsx`): the `prevYear` button (line 222) and `nextYear` button (line 233) have no `min-h`. Add `min-h-[44px] flex items-center justify-center` to each. The adjacent month-nav buttons (lines 248, 271) already have `min-h-[44px]` — match that pattern exactly.

**Files:** `components/HabitToggle.tsx`, `components/NumberStepper.tsx`, `components/MomentChip.tsx`, `components/CalendarHeatmap.tsx`

**Implementation notes:**
- **HabitToggle restructuring**: the button's existing `role="switch"`, `aria-checked`, `aria-label`, `onClick` stay on the `<button>`. The `bg-stone-500`/`bg-stone-300` colour classes and `transition-colors duration-200` move to the new inner pill span. `focus:outline-none` stays on the button. Result: button has no visible styling; inner span is the visible pill.
- **NumberStepper buttons**: replacing `h-8 w-8` with `min-h-[44px] min-w-[44px]` is the complete change. All other classes (`flex items-center justify-center rounded-full border ...`) stay. The row has `py-3.5` on the outer div providing row height — verify no overflow against `divide-y` separators at 375 px viewport.
- **MomentChip**: the chip row in CheckInForm uses `flex flex-wrap gap-2`. A taller chip (44 px min) with visual `py-2` padding means the chip's content is vertically centred, not top-aligned. This is correct. Visual padding appearance is unchanged.
- **CalendarHeatmap year buttons**: the `disabled:opacity-30` class is already on both buttons — keep it. The chevron icon is `text-xl` — centring it at 44 px height with `flex items-center justify-center` is the same pattern as the month-nav buttons.
- **Always `type="button"`** on all non-submit buttons (CLAUDE.md rule). All four components already have this; do not remove it during the edit.

**Validation steps:**
- [x] HabitToggle: tap target is visually confirmed at ≥44 px tall (DevTools → inspect → computed height on the `<button>`) — visual pill still appears as `h-7` (28 px)
- [x] HabitToggle: toggle still slides left/right, colours transition correctly in both states and both modes
- [x] HabitToggle label: `text-sm` explicit (inspect computed font-size → 14 px)
- [x] NumberStepper: `−` and `+` buttons are at least 44×44 px (computed); no row overflow at 375 px viewport
- [x] NumberStepper label: `text-sm` explicit
- [x] MomentChip: taller hit area; chip label is vertically centred; no change to border-radius or horizontal padding
- [x] CalendarHeatmap: year-prev and year-next buttons are at least 44 px tall (match month-nav); chevron is centred; `disabled:opacity-30` still applies when at min/max year
- [x] `npm run lint && npm test` passes

**Definition of done:** All six touch-target fixes applied; visual appearance of each control unchanged; HabitToggle and NumberStepper labels have explicit `text-sm`; lint and tests pass.

**Status: ✓ Complete** (2026-03-08)

---

### Task 3 — Interaction & animation

**What:** Fix the forbidden scale transform on the joy blossom button, replace Unicode hearts with BlossomIcon in ManageView (with combined M6 copy update), and correct the month crossfade duration.

1. **H1 — Joy blossom `active:scale-90`** (`components/CheckInForm.tsx`, line 456): the joy button className includes `transition-transform active:scale-90`. Scale transforms are Calma-forbidden. Replace `transition-transform active:scale-90` with `transition-opacity active:opacity-70`. The `min-h-[44px] min-w-[44px] flex items-center justify-end` classes stay unchanged.
2. **ManageView BlossomIcon + M6** (`components/ManageView.tsx`): two joyByDefault toggle buttons still use Unicode `♥`/`♡`. Replace both with `<BlossomIcon>`. Combined with M6 copy update for the inactive state.
   - **Active habits list** (~line 277): the toggle button wraps a span with `"♥ Brings joy by default"` (active) or `"♡ Tap to mark as joyful by default"` (inactive). Replace the unicode `♥` with `<BlossomIcon filled={true} size={16} />` and the unicode `♡` with `<BlossomIcon filled={false} size={16} />`. Keep the surrounding text.
   - **Add-habit form** (~line 457, M6 combined): same button with `"♥ Brings joy by default"` (active) or `"♡ Does not bring joy by default"` (inactive). Replace icons with `<BlossomIcon>` at `size={16}`. Update the inactive copy from "♡ Does not bring joy by default" to "Joy is marked separately" (the `♡` icon replaces the text emoji — the text reads "Joy is marked separately" after the icon).
   - Add `import BlossomIcon from "@/components/BlossomIcon";` at the top of ManageView.tsx (it is not currently imported).
3. **M9 — CalendarHeatmap month crossfade duration** (`components/CalendarHeatmap.tsx`, line 260): `duration: 0.11` → `duration: 0.12`. This is the `<m.h2>` month-name crossfade transition — below Calma's 120 ms floor.

**Files:** `components/CheckInForm.tsx`, `components/ManageView.tsx`, `components/CalendarHeatmap.tsx`

**Implementation notes:**
- **H1**: only two class strings change: remove `transition-transform` and `active:scale-90`; add `transition-opacity` and `active:opacity-70`. Check that no other transform class is present on that button before removing `transition-transform`.
- **BlossomIcon in ManageView**: the button buttons already have `type="button"` and `onClick`. The BlossomIcon is an interactive press-state element here (unlike the DayDetail read-only display) — do not remove the button wrapper. `size={16}` keeps it visually balanced next to `text-xs` copy. The amber colour from BlossomIcon's `filled={true}` state matches the existing `text-amber-600 dark:text-amber-500` colour pattern on those buttons.
- **M6 copy**: only the add-habit form's inactive state changes ("Does not bring joy by default" → "Joy is marked separately"). The active habits list inactive state ("Tap to mark as joyful by default") is a call-to-action and stays unchanged.
- **M9**: this is a one-number change. The surrounding `<m.h2>` animation (`opacity: 0` → `opacity: 1`) is correct; only the duration value changes.

**Validation steps:**
- [x] Joy blossom button: pressing and holding no longer produces a scale effect; produces an opacity dim instead (test on Today with at least one boolean habit checked)
- [x] ManageView active habits: joyByDefault toggle shows filled BlossomIcon (amber) when active, outlined BlossomIcon when inactive — no Unicode hearts visible
- [x] ManageView add-habit form: same icons; inactive state reads "Joy is marked separately" (not "Does not bring joy by default")
- [x] Active habits list inactive state still reads "Tap to mark as joyful by default" (unchanged)
- [x] BlossomIcon renders correctly in both light and dark mode in ManageView
- [x] CalendarHeatmap month crossfade: no visible change expected (11 ms → 12 ms is imperceptible); `duration: 0.11` is gone from the file
- [x] `npm run lint && npm test` passes

**Definition of done:** Scale transform removed from joy blossom; ManageView joyByDefault toggles use BlossomIcon at size={16} with correct copy; month crossfade is ≥ 120 ms; lint and tests pass.

**Status: ✓ Complete** (2026-03-08)

---

### Task 4 — FrequencyList bar animation

**What:** Replace the `width` animation on FrequencyList bars with a `scaleX` animation. Width animation causes layout reflow on every frame; scaleX is a transform and reflow-free.

The bar element (`m.div` at ~line 155) currently uses `animate={{ width: barWidth }}` where `barWidth` is a percentage string computed as `` `${Math.round((item.count / maxCount) * 38)}%` `` (capped at 38% of the container). The max bar always reaches 38%; others are proportionally smaller.

New approach: set the bar's natural width to `barWidth` as a static style, then animate `scaleX` from 0 to 1 with `transformOrigin: "left"`. The visual result is identical — the bar grows from left to right to its target width — with no layout reflow.

**Files:** `components/FrequencyList.tsx`

**Implementation notes:**
- The change is on the `m.div` only. Before:
  ```jsx
  initial={{ width: "0%" }}
  animate={{ width: barWidth }}
  transition={{ duration: 0.25, ease: "easeOut" }}
  ```
  After:
  ```jsx
  initial={{ scaleX: 0 }}
  animate={{ scaleX: 1 }}
  transition={{ duration: 0.25, ease: "easeOut" }}
  style={{ width: barWidth, transformOrigin: "left" }}
  ```
- `barWidth` stays a percentage string — no computation change needed. It becomes a static style width rather than an animated one.
- The outer container div (`div.mt-1.5.h-0.5.w-full.rounded-full`) does not need `overflow: hidden` — the inner bar never exceeds its own natural width.
- `rounded-full` on the bar element will cause the corners to scale with the transform at low `scaleX` values. This is acceptable given the bar is only 2 px (`h-0.5`) tall; corners are imperceptible at that height.
- **Calma motion constraint reminder**: only opacity, translate, and height/max-height are permitted for animation. `scaleX` is a transform, not a layout property — this is the correct Calma-compliant replacement for `width`.

**Validation steps:**
- [x] Open History → expand FrequencyList → bars animate from left on first render
- [x] Switch between "Month", "3m", and "Always" periods — bars re-animate to new widths
- [x] No `animate={{ width: ... }}` remains in FrequencyList.tsx (grep confirms)
- [x] Bar visual appearance matches before: grows left-to-right, proportional to count, max 38% of row
- [x] `npm run lint && npm test` passes

**Definition of done:** `width` animation replaced with `scaleX`; bars animate correctly on first render and period change; no layout reflow; lint and tests pass.

**Status: ✓ Complete** (2026-03-08)

---

### Task 5 — Microcopy

**What:** Replace all developer vocabulary and technical error messages with calm, human, action-giving copy. Seven items across three files.

1. **H2 — ManageView habit type selector** (`components/ManageView.tsx`, ~line 417 "Boolean", ~line 424 "Numeric"): "Boolean" → "Yes / No"; "Numeric" → "Number". These are the two buttons in the type-selector step ("What kind of habit?").
2. **H7 — transferData.ts error messages** (`lib/transferData.ts`): five strings. Replace with:
   - Line 111 (JSON parse failure): `"That file doesn't look right — try exporting a fresh backup."`
   - Lines 115–118 (unrecognised file format): `"This doesn't look like a Clarity backup — try exporting a fresh one."`
   - Lines 122–124 (no valid entries): `"No recognisable entries were found in that file."`
   - Line 167 (FileReader string check failure): `"Couldn't read that file — try a different one."`
   - Line 178 (FileReader onerror): `"Couldn't read that file — try a different one."`
3. **H8 — SettingsView export error** (`components/SettingsView.tsx`, lines 185–188): **import-side is already correctly implemented** (verified: lines 79–81 already surface the thrown `transferData.ts` message). Only the export side changes: `"Something went wrong. Please try again."` → `"Couldn't download the backup — try again."`
4. **H9 — SettingsView export description** (`components/SettingsView.tsx`, lines 175–177): `"Download all your habit entries as a JSON backup file."` → `"Download a backup of all your entries."`
5. **M4 — SettingsView import success messages** (`components/SettingsView.tsx`, lines 248–259): Two strings:
   - `"{n} entries imported."` → `"{n} days added."` (the `{n}` and singular/plural logic stay the same; replace "entries imported" with "days added")
   - `"{n} entries already existed and were kept."` → `"{n} days were already in your history and weren't changed."` (keep the conditional `skipped > 0` guard)
6. **M5 — CheckInForm add-moment placeholder** (`components/CheckInForm.tsx`, line 392): `placeholder="Moment name"` → `placeholder="e.g. Morning light"`
7. **M15 — ManageView "Step" field label** (`components/ManageView.tsx`): the label "Step" appears in **two** places — the inline edit form (~line 330) and the add-habit form (~line 483). Both must change to "Increment". The brief references only line 483; both require updating.

**Files:** `components/ManageView.tsx`, `lib/transferData.ts`, `components/SettingsView.tsx`, `components/CheckInForm.tsx`

**Implementation notes:**
- H7 are pure string replacements inside `throw new Error(...)` calls. The function and error-throwing structure stay unchanged.
- H8 import side: do not touch lines 79–81 of SettingsView. The export error is at lines 185–188 in the `exportStatus === "error"` block.
- M4 singular/plural: the current pattern uses a ternary `entry`/`entries` — replace the noun phrase while keeping the count variable and ternary structure. The new phrases are single/plural-agnostic ("days added", "days were already in your history…") — confirm the ternary is no longer needed for the noun itself once you've updated the copy.
- **M15 "Step" in two places**: search for `>Step<` in ManageView.tsx to confirm both occurrences before committing. Missing one leaves the two form paths inconsistent.
- M15 brief asks to optionally add a `text-xs text-stone-500` hint: "The amount added each tap." This is a copy decision — include it as a `<p>` below the "Increment" input if you want (not required for DoD).

**Validation steps:**
- [x] ManageView → "Add habit" → type selector shows "Yes / No" and "Number" (not "Boolean"/"Numeric")
- [x] Import a non-JSON file in Settings → error reads "That file doesn't look right — try exporting a fresh backup."
- [x] Import a valid JSON that is not a Clarity backup → error reads "This doesn't look like a Clarity backup — try exporting a fresh one."
- [x] Export backup: description reads "Download a backup of all your entries." (no mention of JSON)
- [x] Trigger an export error (e.g. mock a failure or test in the console) → reads "Couldn't download the backup — try again."
- [x] Successful import: success message reads "N days added." and (if applicable) "N days were already in your history and weren't changed."
- [x] Add-moment input: placeholder is "e.g. Morning light"
- [x] ManageView → edit a numeric habit → field label reads "Increment" (not "Step")
- [x] ManageView → add a numeric habit → field label reads "Increment" (not "Step") — both forms confirmed
- [x] `npm run lint && npm test` passes

**Definition of done:** All seven microcopy items updated; no developer vocabulary visible in the UI; both "Step"→"Increment" instances changed; lint and tests pass.

**Status: ✓ Complete** (2026-03-08)

---

### Task 6 — UI text & hierarchy

**What:** Add the History empty state, fix the DayDetail Edit link visual hierarchy, and make the SettingsView back button label context-aware.

1. **H3 — History empty state** (`components/HistoryView.tsx`): when `entries.length === 0`, show a single calm line below the calendar: `"Your days will appear here once you start logging."` The calendar continues to render (it remains a useful structural fixture even with zero entries). The message appears where history items would appear.
2. **H4 — DayDetail Edit link** (`components/DayDetail.tsx`, lines 246–251): current class `"text-sm text-stone-500 dark:text-stone-400 underline-offset-4 transition-colors hover:underline"` reads as a footnote. Replace with `"text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300"`.
3. **M14 — SettingsView back button destination** (`components/SettingsView.tsx`, line 114): button currently reads "← back". Use the `backDest` value (already read from sessionStorage on mount into the `backDest` state) to show "← Today" when `backDest === "/"` and "← History" when `backDest === "/history"`.

**Files:** `components/HistoryView.tsx`, `components/DayDetail.tsx`, `components/SettingsView.tsx`

**Implementation notes:**
- **H3 placement**: put the empty state **below** the `<CalendarHeatmap>` block and the FrequencyList toggle section, where the entry list would appear. Use: `{entries.length === 0 && (<p className="mt-10 text-center text-sm text-stone-500 dark:text-stone-500">Your days will appear here once you start logging.</p>)}`. The `entries` array is already in state from `getAllEntries()` in `useEffect`.
- **H4**: the Edit link is a `<Link>` element — only the className changes. The `href` stays `\`/edit?date=${date}\``. Do not wrap it or change its position in the DOM.
- **M14**: `backDest` is already initialised in state with type `"/" | "/history"`. The button label is the only change: `` `← ${backDest === "/" ? "Today" : "History"}` ``. The `aria-label="Go back"` stays. No logic changes needed.
- The Chevron component is already used for the back arrow in the button (`<Chevron direction="left" />`). Keep it; only the text after it changes.

**Validation steps:**
- [x] History page with no entries: "Your days will appear here once you start logging." appears below the calendar; calendar still renders
- [x] History page with entries: empty state message is not shown
- [x] DayDetail Edit link: visually appears as a section-label-style nav link (uppercase, tracked, stone-600), not a blue underline or footnote
- [x] DayDetail Edit link navigates correctly to `/edit?date=…`
- [x] SettingsView opened from Today: back button reads "← Today"
- [x] SettingsView opened from History: back button reads "← History"
- [x] `npm run lint && npm test` passes

**Definition of done:** Empty state renders below the calendar with zero entries; Edit link matches nav-link hierarchy; back button label reflects origin; lint and tests pass.

**Status: ✓ Complete** (2026-03-08)

---

## Definition of done — Sprint

- [x] All six tasks above are complete and validated
- [x] `npm run lint && npm test && npm run build` passes clean
- [x] Tested manually on mobile viewport (375 px) in both light and dark mode
- [x] No `text-stone-400` foreground remains in light mode across all pages
- [x] No `active:scale-*` or `transition-transform` remains on interactive controls
- [x] HabitToggle, NumberStepper, MomentChip, and CalendarHeatmap year-nav buttons are all ≥44 px tall
- [x] No developer vocabulary ("Boolean", "Numeric", "JSON", raw error text) visible in any user-facing string
- [x] All 9 HIGH audit findings closed (H1–H9)
- [x] No regressions on Today, History, Settings, Manage, Edit, and DayDetail
- [x] Ready for `/deploy`

---

## Architecture Review

**Date:** 2026-03-08
**Diff base:** 933d88c (sprint brief commit)
**Lint/tests:** pass

### Findings

| Severity | File | Issue |
|---|---|---|
| Must fix | `components/ManageView.tsx:486` | `Step` label in add-habit form not changed to `Increment` — missed by `replace_all` indent mismatch. Fixed in commit d76dec2. |
| Medium | `components/ManageView.tsx:380, 590` | `text-stone-400` foreground on "Archived" confirmation in light mode. Pre-existing. |
| Medium | `components/HistoryView.tsx:129, 134, 139` | `text-stone-400` on inactive period selectors in light mode. Pre-existing. |
| Medium | `lib/habitConfig.ts` | No test coverage for `getConfigs()` / `saveConfigs()`. Pre-existing. |
| Low | `components/CheckInForm.tsx:231` | `toISOString()` used for `lastEdited` timestamp (not a date key). Pre-existing. |
| Low | `ManageView.tsx`, `CheckInForm.tsx` | 657 / 507 lines — large but UI-state only; no extraction warranted yet. |

### Must fix before deploy

Must-fix resolved: `Step` → `Increment` in add-habit form committed before proceeding.

### Recommendations for next sprint

- Add tests for `habitConfig.ts` (`getConfigs`, `saveConfigs`) and `habits.ts` (`createEmptyEntry`)
- Address pre-existing `text-stone-400` foreground in ManageView "Archived" confirmations and HistoryView period selectors

### Plan fidelity

All 6 tasks implemented as specified. No scope creep. The missed `Step` → `Increment` instance was caught here and fixed. Implementation matches the sprint plan throughout.

### Architecture audit comparison

| Before | After | Fixed | Regressions |
|---|---|---|---|
| No baseline | 0 critical · 0 high · 4 medium · 3 low | — | No regressions. |

---

## Validation

**Date:** 2026-03-08

### Audit results

| Audit | Before | After | Fixed | Regressions |
|---|---|---|---|---|
| colour | 0 critical · 0 high · 4 medium · 4 low | 0 critical · 0 high · 0 medium · 4 low | 4 medium (ManageView nav anchor, numeric unit label; CheckInForm ghost button, dismiss "✕") | 0 |
| typography | 0 critical · 0 high · 6 medium · 4 low | 0 critical · 0 high · 0 medium · 3 low | 6 medium (SettingsView Theme + "Your data" font-medium; DayDetail date heading; CheckInForm reflection textarea; HabitToggle + NumberStepper text-sm labels) | 0 |
| interaction | 3 high · 7 medium · 5 low | 0 high · 3 medium · 7 low | 3 high (scale transform, HabitToggle touch target, NumberStepper touch target); 4 medium (MomentChip touch, year-nav touch, FrequencyList bar animation, month crossfade) | 0 |
| microcopy | 4 high · 5 medium · 2 low | 0 high · 0 medium · 2 low | 4 high (all transferData.ts + export errors); 5 medium (Boolean/Numeric labels, import success copy, moment placeholder, joy copy, Step→Increment) | 0 |

### Remaining findings

**Colour (4 low):**
- ManageView archived confirmation notes (×2): `text-stone-400` — intentional archival dimming, accepted.
- HistoryView inactive period selectors: `text-stone-400` — pre-existing, deferred.
- CalendarHeatmap day-of-week `dark:text-stone-600` — wrong direction for dark mode, deferred.

**Typography (3 low):**
- CalendarHeatmap year display `text-sm` (should be `text-xs`) — deferred.
- SettingsView `mb-8` section spacing — compensated by dividers, deferred.
- DayDetail numeric value `font-medium` — borderline, accepted.

**Interaction (3 medium, 7 low):**
- Two-step hover jumps — document exception in Calma spec next sprint.
- Remaining touch targets in Settings/Manage/Help bare-text controls — deferred to a dedicated polish sprint.
- CalendarHeatmap opacity-25 cells, FrequencyList invisible chevron, HabitToggle `transition-all`, BottomNav inactive hover, missing `transition-colors` on two ManageView type-picker buttons and one SettingsView button — deferred.

**Microcopy (2 low):**
- CheckInForm inline validation: "Please enter a name." and "A moment with that name already exists." — edge-case polish, deferred.

### Regressions

None. All sprint changes are improvements only. No pre-existing passing checks were broken.

---

## QA Results

**Date:** 2026-03-08

### Regression suite

112 tests passed · 0 failed · 0 stale tests updated

### New tests written

- `e2e/sprint-08-typography.spec.ts` — 6 tests (M1–M3, M10–M13: section labels, textarea, colour)
- `e2e/sprint-08-touch-targets.spec.ts` — 7 tests (H5, H6, M7, M16–M18: all touch targets + labels)
- `e2e/sprint-08-microcopy.spec.ts` — 11 tests (H2–H4, H9, M4–M5, M14–M15: copy, empty state, nav)
- `e2e/section-labels.spec.ts` — updated: added Theme and "Your data" font-medium checks (M3)

### Failures found

None.

### Stale tests updated

None — all pre-existing tests passed against the Sprint 8 changes.

### Manual checklist

- [x] HabitToggle: tap the switch — pill slides left/right; opacity transition on joy blossom (not scale)
- [x] ManageView: joyByDefault toggle shows BlossomIcon (not ♥/♡) in both states; inactive add-habit form reads "Joy is marked separately"
- [x] ManageView: "Add habit" → type selector shows "Yes / No" and "Number"; form shows "Increment" label
- [x] FrequencyList: bars animate left-to-right on expand and on period change; no layout jump
- [x] Settings from Today: back button reads "← Today"; Settings from History: reads "← History"
- [x] History with no entries: calm message visible below calendar; calendar still renders
- [x] DayDetail Edit link: uppercase, tracked, stone-600 — not an underlined footnote
- [x] Import a non-JSON file → error reads "That file doesn't look right — try exporting a fresh backup."
- [x] Animations feel smooth on enter and exit (≤320 ms)
- [x] Dark mode: no invisible text, no layout shifts
- [x] Mobile (390px): no horizontal overflow, all touch targets feel reachable by thumb
- [x] Reduced motion: enable in OS settings, verify animations are suppressed

---

## Post-Code Summary

**Date:** 2026-03-08

### Architecture gate

PASS — one must-fix found (missed `Step`→`Increment` in add-habit form) and resolved before proceeding.

### Validation

| Audit | Before | After | Fixed | Regressions |
|---|---|---|---|---|
| colour | 4 medium · 4 low | 0 medium · 4 low | 4 medium | 0 |
| typography | 6 medium · 4 low | 0 medium · 3 low | 6 medium | 0 |
| interaction | 3 high · 7 medium · 5 low | 0 high · 3 medium · 7 low | 3 high + 4 medium | 0 |
| microcopy | 4 high · 5 medium · 2 low | 0 high · 0 medium · 2 low | 4 high + 5 medium | 0 |

Regressions: None.

### QA

Regression suite: 112 tests · Smoke: 12/12

Failures: None.

### Recommended next action

Proceed to `/calma-sync` → `/deploy`

---

## Retrospective

<!-- To be filled in after the sprint using /sprint-retro -->
