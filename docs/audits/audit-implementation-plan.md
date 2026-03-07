# Audit Implementation Plan

Generated from: audit-colour · audit-typography · audit-interaction · audit-microcopy · audit-design-overall
Date: 2026-03-04

---

## Consolidated findings

Before chunking, findings were consolidated across all five reports. Where the same component was flagged by multiple audits, those findings are grouped and their combined confidence noted. All low-severity findings that touch files already addressed by a high-severity fix in the same chunk were absorbed and are not listed separately.

---

## Chunk 1 — globals.css: DayDetail reduced-motion guard

Files: `app/globals.css`

Findings addressed:
- DayDetail backdrop `transition-opacity` on a plain `<div>` has no `prefers-reduced-motion` guard — interaction audit (medium)
- DayDetail bottom sheet `transition-transform` on a plain `<div>` has no `prefers-reduced-motion` guard — interaction audit (medium)

What to do:
Add a `@media (prefers-reduced-motion: reduce)` block to `globals.css` that sets `transition: none` on the DayDetail backdrop and sheet elements. These are plain `<div>` elements with CSS class names (not Motion components), so `MotionConfig reducedMotion="user"` in `MotionProvider` does not govern them. Inspect `DayDetail.tsx` around lines 131 and 141 to confirm the exact class names used, then suppress those transitions in the media query.

Effort: trivial

---

## Chunk 2 — HabitToggle: touch target + explicit text size

Files: `components/HabitToggle.tsx`

Findings addressed:
- Toggle switch button `h-7 w-12` = 28 × 48 px — height is 16 px below the 44 px minimum — interaction audit (high)
- Label has no explicit `text-sm` — typography audit (medium)

What to do:
The toggle switch button (line 34) must reach `min-h-[44px]` without changing the visual size of the toggle track itself. The cleanest approach is to wrap the button in a transparent hit-area `<span>` with `min-h-[44px] flex items-center`, or add `py-2` to the button and use `flex items-center justify-center` so padding expands the tap area without visually enlarging the track. Do not change `h-7 w-12` on the track element itself. Also add `text-sm` to the label element at line 24.

Effort: small

---

## Chunk 3 — NumberStepper: touch target + explicit text size

Files: `components/NumberStepper.tsx`

Findings addressed:
- Decrement and increment buttons `h-8 w-8` = 32 × 32 px — both dimensions below the 44 px minimum — interaction audit (high)
- Label has no explicit `text-sm` — typography audit (medium)

What to do:
Change the decrement and increment buttons (lines 73 and 96) from `h-8 w-8` to `min-h-[44px] min-w-[44px]` with `flex items-center justify-center`. The visual circle inside the button should remain the same size — use an inner `<span>` with the original `h-8 w-8 rounded-full` styling if needed to preserve appearance. Add `text-sm` to the label element at line 63.

Effort: small

---

## Chunk 4 — MomentChip: touch target

Files: `components/MomentChip.tsx`

Findings addressed:
- Chip button `py-2` ≈ 32 px tall — below the 44 px minimum — interaction audit (medium)

What to do:
Add `min-h-[44px]` to the chip button at line 11. Adjust the internal padding so the visual pill remains compact while the tap area meets the requirement — `flex items-center` with `min-h-[44px]` will expand the invisible tap area without inflating the pill's visual size. The `rounded-full` shape and all other classes must remain unchanged.

Effort: small

---

## Chunk 5 — DayDetail: replace ♥ with BlossomIcon for joy review

Files: `components/DayDetail.tsx`

Findings addressed:
- Joy is shown as Unicode `♥` in DayDetail instead of the custom `BlossomIcon` — design-overall audit (the single most important observation)
- This is the primary review surface; using a generic heart at the moment of reflection undermines the factual/emotional distinction the BlossomIcon was designed to draw

What to do:
Find every place in `DayDetail.tsx` where joy is displayed as a Unicode character (`♥`, `♡`, or similar). Import `BlossomIcon` from `components/BlossomIcon.tsx` and replace each Unicode character with `<BlossomIcon filled={true} />` (for marked joy) using the same size as the surrounding text. The `BlossomIcon` already supports empty and filled states — use the filled amber state to represent logged joy, matching what the user saw in CheckInForm when they marked it.

Effort: small

---

## Chunk 6 — DayDetail: section label font-medium + date heading size

Files: `components/DayDetail.tsx`

*Depends on: Chunk 5 (same file — complete Chunk 5 first in the same session)*

Findings addressed:
- Four `h3` section labels (lines 173, 193, 213, 232) missing `font-medium` — typography audit (high)
- Date `h2` heading uses `text-lg tracking-wide` instead of `text-base tracking-widest` — typography audit (medium)

What to do:
Add `font-medium` to all four section label `h3` elements (Habits, Numbers, Moments, Reflection headings). The canonical pattern is `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`. For the date `h2` at line 160, change `text-lg` to `text-base` and `tracking-wide` to `tracking-widest` to match the Calma section-heading scale. Review in context — the date heading sits in a bottom sheet, so the visual change should feel appropriate for a sheet header rather than a page title.

Effort: trivial

---

## Chunk 7 — ManageView: SECTION_LABEL constant — colour + font-medium

Files: `components/ManageView.tsx`

Findings addressed:
- `SECTION_LABEL` const (~line 59/60) uses `text-stone-400 dark:text-stone-500` — stone-400 fails WCAG AA in light mode (2.4:1) — colour audit (high, confirmed by typography and interaction audits — highest confidence finding)
- `SECTION_LABEL` const missing `font-medium` — typography audit (critical)
- This single constant propagates to both the Habits and Moments section labels — two labels fixed by one change

What to do:
In the `SECTION_LABEL` constant, change `text-stone-400` to `text-stone-500` and add `font-medium`. The corrected constant should read exactly: `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`. Verify the dark mode variant is already `dark:text-stone-500` (no change needed there). No other files need to change for this fix.

Effort: trivial

---

## Chunk 8 — SettingsView: three section labels — colour + font-medium

Files: `components/SettingsView.tsx`

Findings addressed:
- "Manage" label (line 120): `text-stone-400 dark:text-stone-500` — stone-400 fails WCAG AA, missing `font-medium` — colour audit (high), typography audit (critical)
- "Help" label (line 292): same violation — colour audit (high), typography audit (critical)
- "Reset" `h3` (line 308): `text-stone-400` with no dark variant at all — colour audit (high), typography audit (critical), dark mode completeness (high)

What to do:
Fix all three labels to the canonical pattern: `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`. For line 120 and 292, change `text-stone-400` → `text-stone-500` and add `font-medium`. For line 308, change `text-stone-400` → `text-stone-500`, add `font-medium`, and add `dark:text-stone-500` (the dark variant is entirely missing). No other changes to these lines.

Effort: trivial

---

## Chunk 9 — ManageView + SettingsView: remaining stone-400 and stone-300 violations

Files: `components/ManageView.tsx`, `components/SettingsView.tsx`

*Depends on: Chunks 7 and 8 should be completed first to avoid redundant edits in the same files*

Findings addressed:
- ManageView line 282: `text-stone-400` (joyByDefault false branch) — no dark variant — colour audit (high)
- ManageView line 464: `text-stone-400` (add-habit form joyByDefault false) — no dark variant — colour audit (high)
- ManageView line 370: `text-stone-300 dark:text-stone-700` (archived numeric unit) — stone-300 far below AA in light; stone-700 also low contrast in dark — colour audit (high)
- SettingsView line 335: `text-stone-400` cancel button — no dark base variant — colour audit (high)

What to do:
ManageView lines 282 and 464: change `text-stone-400` to `text-stone-500 dark:text-stone-400`. ManageView line 370: change `text-stone-300 dark:text-stone-700` to `text-stone-500 dark:text-stone-400` — both values need raising. SettingsView line 335: add `dark:text-stone-400` to give the cancel button a dark mode base (the hover variant is already present).

Effort: trivial

---

## Chunk 10 — ManageView: header spacing + archived label dark colours

Files: `components/ManageView.tsx`

*Depends on: Chunks 7 and 9 should be completed first*

Findings addressed:
- Header `mb-2` at line 238 — all other pages use `mb-6` to `mb-10` — typography audit (high)
- Archived labels at lines 368 and 581 use `dark:text-stone-600` — very low contrast in dark mode — colour audit (medium)

What to do:
Change line 238 from `header mb-2` to `header mb-6` (matching HistoryView's `mb-6`; this is the minimum to align with the system). For lines 368 and 581, change `dark:text-stone-600` to `dark:text-stone-500` — stone-600 in dark mode is below usable contrast; stone-500 reads clearly while still conveying the dimmed-archived quality.

Effort: trivial

---

## Chunk 11 — CheckInForm: section labels — font-medium + margin consistency

Files: `components/CheckInForm.tsx`

Findings addressed:
- Five section labels (lines 280, 308, 338, 433, 473) missing `font-medium` — typography audit (high)
- Section labels at lines 280 and 308 (Habits, By the Numbers) use `mb-1` instead of `mb-3` used by the remaining three — typography audit (low), design-overall audit (noted as "two characters to fix, most felt inconsistency on the page")

What to do:
Add `font-medium` to all five section label elements. The canonical pattern is `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`. On lines 280 and 308, also change `mb-1` to `mb-3` to match the lower section labels (338, 433, 473). This closes the two-register spacing gap between the top half (Habits, Numbers) and the bottom half (Moments, Joy, Reflection) of the form.

Effort: trivial

---

## Chunk 12 — HelpView + HistoryView: section labels + body text

Files: `components/HelpView.tsx`, `components/HistoryView.tsx`

Findings addressed:
- HelpView `SECTION_LABEL` const: missing `font-medium` — typography audit (high)
- HelpView `BODY` const: missing `font-light` — typography audit (medium) — reflective body text per Calma is `sm / light`
- HistoryView frequency toggle button (line 93): section-label pattern used without `font-medium` — typography audit (medium)

What to do:
In `HelpView.tsx`, add `font-medium` to the `SECTION_LABEL` constant and `font-light` to the `BODY` constant (the full body class should be `text-sm font-light leading-relaxed text-stone-700 dark:text-stone-300`). In `HistoryView.tsx` at line 93, add `font-medium` to the frequency toggle button's class string. Verify the canonical section label pattern is applied in full — `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`.

Effort: trivial

---

## Chunk 13 — CheckInForm: joy blossom — remove forbidden scale transform

Files: `components/CheckInForm.tsx`

Findings addressed:
- Joy blossom button at line 456: `active:scale-90` applies a scale transform on press — scale is explicitly forbidden by Calma (only opacity, translate, and height allowed) — interaction audit (high)

What to do:
Remove `active:scale-90` from the joy blossom button at line 456. Replace with `active:opacity-70` to give tactile press feedback using an opacity shift, which is within Calma's allowed properties. No other changes to this button — all other classes (`min-h-[44px] min-w-[44px]`, `transition-transform` → change to `transition-opacity`) should remain otherwise intact.

Effort: trivial

---

## Chunk 14 — CheckInForm: add-moment inline touch targets

Files: `components/CheckInForm.tsx`

*Depends on: Chunk 11 and 13 should be completed first to avoid conflicting edits*

Findings addressed:
- "New moment" dashed button (line 361): `py-2` ≈ 32 px — interaction audit (medium)
- Inline "Add" button (line 395): `py-2` ≈ 32 px — interaction audit (medium)
- Inline dismiss "✕" button (line 403): no height constraint, approx 20–24 px — interaction audit (medium)
- Reflection textarea (line 483): no explicit `text-sm` or `font-light` — typography audit (medium)

What to do:
Add `min-h-[44px]` to the "New moment" dashed button (line 361), the "Add" button (line 395), and the dismiss "✕" button (line 403). For the dismiss button, add `min-h-[44px] min-w-[44px] flex items-center justify-center` to ensure both dimensions meet the target without visually enlarging the ✕ character. Add `text-sm font-light` to the reflection textarea at line 483 — the Calma scale defines reflective body text as `sm / light`, and `DayDetail.tsx:235` applies this correctly as a reference.

Effort: small

---

## Chunk 15 — CalendarHeatmap: animation fixes + year-nav touch target

Files: `components/CalendarHeatmap.tsx`

Findings addressed:
- Month heading crossfade `duration: 0.11` (110 ms) is below the 120 ms floor — interaction audit (medium)
- Year prev/next buttons at lines 223 and 234 have no `min-h` — interaction audit (medium)

What to do:
At line 257 (or wherever the month crossfade duration is set), change `0.11` to `0.12`. Add `min-h-[44px]` to the year prev and next buttons (lines 223 and 234) to match the month-nav buttons which already carry `min-h-[44px]` at lines 248 and 271.

Effort: trivial

---

## Chunk 16 — FrequencyList: bar animation — width → scaleX

Files: `components/FrequencyList.tsx`

Findings addressed:
- Bar grow animation at lines 155–163 animates `width` from `0%` to `barWidth` — only opacity, translate, and height/max-height are Calma-permitted properties for Motion animations — interaction audit (medium)

What to do:
Replace the `width` animation with a `scaleX` transform. Set the bar element to `width: barWidth` (static, at full target size) and animate `scaleX` from `0` to `1`. Add `style={{ transformOrigin: "left" }}` so the bar grows from the left edge rather than the center. The visual result should be identical; the implementation switches from a layout-affecting animation to a transform-only animation. Duration and easing can remain unchanged.

Effort: small

---

## Chunk 17 — ManageView: interaction polish

Files: `components/ManageView.tsx`

*Depends on: Chunks 7, 9, 10 should be completed first*

Findings addressed:
- "Jump to Moments" anchor (line 254): has `hover:underline` but no `transition-colors`; stone-400 foreground — interaction audit (low), colour audit (medium)
- "Boolean" type-picker button (line 413): `hover:underline` but no `transition-colors` — interaction audit (low)
- "Numeric" type-picker button (line 419): same — interaction audit (low)

What to do:
Add `transition-colors` to the "Jump to Moments" anchor (line 254), the "Boolean" button (line 413), and the "Numeric" button (line 419). For the "Jump to Moments" anchor, also change the foreground from `text-stone-400` to `text-stone-600 dark:text-stone-500` to match the navigation link role (stone-600 in light, stone-500 in dark).

Effort: trivial

---

## Chunk 18 — transferData.ts: error messages

Files: `lib/transferData.ts`

Findings addressed:
- Line 111: "The file is not valid JSON. Please choose a habits-backup.json file." — technical ("valid JSON"), references internal filename — microcopy audit (high)
- Lines 115–118: "Unrecognised file format. Only files exported from Clarity are supported." — system-speak — microcopy audit (high)
- Lines 122–124: "No valid entries found in the file." — "valid entries" is technical database language — microcopy audit (high)
- Lines 167, 178: "Failed to read the file." — "Failed" is alarming, gives no path forward — microcopy audit (high)

What to do:
Replace all four error messages with the calm/specific pattern from the Calma spec: direct, tells the user what to do next, no technical terms. Suggested replacements: line 111 → `"That doesn't look like a backup file — try exporting a fresh one from Settings."` · lines 115–118 → `"That file doesn't look right — only backups exported from Clarity will work."` · lines 122–124 → `"The file didn't contain any entries we could read — try exporting a fresh backup."` · lines 167, 178 → `"Something stopped us from reading that file — try again."` No logic changes — only the string content of each thrown or returned error.

Effort: small

---

## Chunk 19 — SettingsView: microcopy

Files: `components/SettingsView.tsx`

Findings addressed:
- Lines 175–177: export description contains "JSON" — developer jargon — microcopy audit (high)
- Lines 186–188: export error "Something went wrong. Please try again." — vague, no action — microcopy audit (high)
- Lines 79–81: import fallback "Something went wrong. Please try again." — swallows the specific error already thrown by `transferData.ts` — microcopy audit (high)
- Lines 248–259: import success "{n} entries imported." / "{n} entries already existed and were kept." — reads like a system log — microcopy audit (medium)

What to do:
Line 175–177: remove "JSON" from the export description — e.g. "Download all your habit entries as a backup file." Lines 186–188: replace with a specific message — e.g. `"Couldn't download the backup — try again."` Lines 79–81: the import fallback replaces the specific error thrown by `transferData.ts`. Change the catch block to re-throw or display the caught `error.message` directly rather than replacing it with a generic string. Lines 248–259: soften the success copy — e.g. `"{n} days added."` and `"{n} days were already in your history and weren't changed."`.

Effort: small

---

## Chunk 20 — ManageView: microcopy

Files: `components/ManageView.tsx`

*Depends on: Chunks 7, 9, 10, 17 should be completed first*

Findings addressed:
- Lines 413–425: "Boolean" / "Numeric" habit type labels — developer jargon in a personal habit page — microcopy audit (high), design-overall audit (Manage is the only page with a clearly mismatched emotional register; this vocabulary is the primary cause)
- Line 465: "♡ Does not bring joy by default" — reads like a config flag, not a human observation — microcopy audit (medium)
- Line 483: "Step" field label — unexplained to users — microcopy audit (medium)

What to do:
Lines 413–425 type-picker: replace "Boolean" with `"Yes / no"` and "Numeric" with `"A number"`. Update any surrounding prompt copy (e.g. "What kind of habit?") to feel consistent with the change. Line 465: replace with something warmer, e.g. `"♡ Doesn't mark joy automatically"` or `"♡ Joy is marked separately"`. Line 483: change the "Step" label to `"Increment"` and optionally add a brief hint like `"The amount added or subtracted each tap"` as helper text beneath the field.

Effort: trivial

---

## Chunk 21 — CheckInForm: microcopy

Files: `components/CheckInForm.tsx`

*Depends on: Chunks 11, 13, 14 should be completed first*

Findings addressed:
- Line 392: placeholder "Moment name" — functional, reads like a form field label that leaked into the placeholder — microcopy audit (medium)
- Line 190: "Please enter a name." — functions as warning tone rather than warmth — microcopy audit (medium)

What to do:
Line 392: change the placeholder from `"Moment name"` to something warmer and inviting, e.g. `"e.g. Morning light"` (matching the example-based style of all other placeholders in ManageView). Line 190: change validation message from `"Please enter a name."` to `"Give this moment a name."` — removes the formal "Please" and replaces it with a gentle directive.

Effort: trivial

---

## Design intent to carry forward

These are observations from the design-overall audit that reflect on experience and direction rather than actionable code changes. They should inform decisions in future sprints, not be treated as tasks.

- **Settings back navigation** — the back link always reads "← back" regardless of destination (Today vs History). "← Today" or "← History" would make the destination explicit and reduce wayfinding uncertainty. Worth considering as a UX refinement.
- **DayDetail "Edit" link styling** — the edit action in DayDetail renders as a hover-underline hyperlink, not in the `uppercase tracking-widest` navigation style used by every other navigation action. This causes the one primary action in the sheet to read as subordinate text. Consider elevating it to the nav-link pattern in a future sprint.
- **History heatmap color key** — the two-axis color system (cool = habits, warm = joy/moments) is never explained on the page. A first-time user must visit Help to understand the heatmap. A brief, dismissible one-line context note beneath the calendar (shown only when fewer than 7 entries exist) would orient new users without cluttering the experienced view.
- **FrequencyList "Frequency" label** — slightly clinical in tone against the human-language vocabulary of the rest of the History page. Low priority, but worth considering if the page receives design attention.
- **Nav link two-step hover** — multiple components use `text-stone-600 hover:text-stone-800`, which jumps two steps along the stone scale. Calma specifies one-step hover. Either codify this as an intentional nav-link exception in the Calma spec, or regularise to `stone-700` in a polish sprint.
- **Joy section after long use** — the Joy section must animate in fresh every session. For experienced users who always mark the same habits as joyful, this is a small recurring friction. No architectural fix fits the current model without compromising the intentional factual/emotional separation. Note for future consideration if usage patterns support it.

---

## Tier 3 — Deferred to polish pass

Not included in chunks. Listed so they are not lost.

| Finding | Component | Severity |
|---|---|---|
| CalendarHeatmap year label `text-sm` → `text-xs` | CalendarHeatmap.tsx:230 | Low |
| CalendarHeatmap day-of-week `dark:text-stone-600` → `dark:text-stone-500` | CalendarHeatmap.tsx:300 | Low |
| SettingsView section spacing `mb-8` (8px below Calma baseline) | SettingsView.tsx | Low |
| FrequencyList inactive-filter chevron `invisible` → `opacity-0` | FrequencyList.tsx:148 | Low |
| CalendarHeatmap future/filter cells `opacity-25` → `opacity-30` | CalendarHeatmap.tsx:341,347 | Low |
| HabitToggle thumb `transition-all` → `transition-[left]` | HabitToggle.tsx:41 | Low |
| BottomNav inactive tabs — add hover colour so `transition-colors` has something to animate | BottomNav.tsx:31 | Low |
| SettingsView many utility-page touch targets (theme buttons, back link, manage/help links, reset confirm/cancel) | SettingsView.tsx | Medium |
| CheckInForm "A moment with that name already exists." → warmer phrasing | CheckInForm.tsx:197 | Low |
| History first-use empty state (copy + visibility condition) | HistoryView.tsx | Low |
| ManageView input `rounded-full` vs ManageView standalone inputs `rounded-xl` — shape inconsistency | ManageView.tsx, CheckInForm.tsx | Low |

---

## Summary

| Chunk | Title | Files | Tier | Effort |
|---|---|---|---|---|
| 1 | globals.css: DayDetail reduced-motion guard | globals.css | 2 | trivial |
| 2 | HabitToggle: touch target + text size | HabitToggle.tsx | 1 | small |
| 3 | NumberStepper: touch target + text size | NumberStepper.tsx | 1 | small |
| 4 | MomentChip: touch target | MomentChip.tsx | 1 | small |
| 5 | DayDetail: replace ♥ with BlossomIcon | DayDetail.tsx | 1 | small |
| 6 | DayDetail: section labels font-medium + date heading | DayDetail.tsx | 1 | trivial |
| 7 | ManageView: SECTION_LABEL colour + font-medium | ManageView.tsx | 1 | trivial |
| 8 | SettingsView: 3 section labels colour + font-medium | SettingsView.tsx | 1 | trivial |
| 9 | ManageView + SettingsView: remaining stone-400/300 violations | ManageView.tsx, SettingsView.tsx | 1 | trivial |
| 10 | ManageView: header spacing + archived label dark colours | ManageView.tsx | 1 | trivial |
| 11 | CheckInForm: section labels font-medium + margin | CheckInForm.tsx | 1 | trivial |
| 12 | HelpView + HistoryView: section labels + body text | HelpView.tsx, HistoryView.tsx | 1 | trivial |
| 13 | CheckInForm: joy blossom — remove scale transform | CheckInForm.tsx | 1 | trivial |
| 14 | CheckInForm: add-moment inline touch targets + textarea | CheckInForm.tsx | 2 | small |
| 15 | CalendarHeatmap: animation fixes + year-nav touch target | CalendarHeatmap.tsx | 2 | trivial |
| 16 | FrequencyList: bar animation width → scaleX | FrequencyList.tsx | 2 | small |
| 17 | ManageView: interaction polish (transition-colors + link) | ManageView.tsx | 2 | trivial |
| 18 | transferData.ts: error messages | lib/transferData.ts | 1 | small |
| 19 | SettingsView: microcopy | SettingsView.tsx | 1 | small |
| 20 | ManageView: microcopy (Boolean/Numeric, joy, Step) | ManageView.tsx | 1 | trivial |
| 21 | CheckInForm: microcopy | CheckInForm.tsx | 2 | trivial |

Tier 1 chunks: 14  ·  Tier 2 chunks: 7  ·  Tier 3 deferred: 11
Design intent notes carried forward: 6
