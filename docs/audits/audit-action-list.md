# Audit Action List

Generated: 2026-03-07
Source audits: audit-colour.md · audit-typography.md · audit-interaction.md · audit-microcopy.md · audit-design-overall.md

---

## High

### H1. Joy blossom button uses forbidden scale transform on press

Source: audit-interaction, audit-design-overall (two audits — promoted confidence)
File: `CheckInForm.tsx` (line 456)

What to fix:
The joy blossom button has `active:scale-90`. Calma explicitly forbids scale transforms; the permitted active feedback is an opacity shift or a colour step. Replace `active:scale-90` with `active:opacity-70`. The `transition-transform` class already on the element can be removed or left; verify no other transform is in use on that element.

---

### H2. ManageView uses "Boolean" and "Numeric" — developer jargon in the human register

Source: audit-microcopy, audit-design-overall (two audits — promoted confidence)
File: `ManageView.tsx` (lines 417, 424)

What to fix:
The habit-type selector labels read "Boolean" and "Numeric". These are programming terms entirely opaque to non-technical users and are the most visible vocabulary break in the app. Replace with plain-language equivalents: "Yes / No" (or "Done / Not done") for Boolean, and "Number" (or "Count") for Numeric. Calma's writing principle: labels are plain and human. Choose words that describe what the habit tracks, not what data type it stores.

---

### H3. History page has no empty state for first-time users

Source: audit-design-overall, audit-microcopy (two audits — promoted confidence)
File: `HistoryView.tsx`

What to fix:
When no entries exist, the History page shows a grid of pale, unlabelled cells with no explanation. First-time users following the natural path (Today → History) arrive with no orientation. Add a calm, single-line message visible only when `entries.length === 0`, placed below the calendar grid: "Your days will appear here once you start logging." This matches the tone of the existing DayDetail empty state ("Nothing here yet") and requires no structural changes.

---

### H4. DayDetail Edit link is styled as a footnote, not as a primary action

Source: audit-design-overall (single most important observation per that audit)
File: `DayDetail.tsx` (lines 246–251)

What to fix:
The Edit link that takes the user to the edit screen — the primary action in the review sheet — is styled with `text-sm text-stone-500 dark:text-stone-400 ... hover:underline`: no uppercase, no widest tracking, no hover colour shift. It reads as a footnote. Every other navigation action in the codebase uses the `text-xs uppercase tracking-widest` pattern. Replace the current class string with `text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300`. This closes the sharpest hierarchy inversion in the app.

---

### H5. HabitToggle switch button is 16 px below the 44 px touch target minimum

Source: audit-interaction
File: `HabitToggle.tsx` (line 34)

What to fix:
The toggle switch button uses `h-7 w-12` (28 × 48 px). The Calma minimum is 44 × 44 px. The visual switch is deliberately compact; solve this with a wrapping approach: add `min-h-[44px]` to the button itself and vertically centre the visual switch inside it (`flex items-center`). Do not change the visual dimensions of the switch track or thumb.

---

### H6. NumberStepper decrement and increment buttons are 32 × 32 px

Source: audit-interaction
File: `NumberStepper.tsx` (lines 73, 96)

What to fix:
Both `−` and `+` buttons use `h-8 w-8` (32 × 32 px), 12 px short in each dimension. Change to `min-h-[44px] min-w-[44px]` and keep the visual circle centred inside (`flex items-center justify-center`). The `disabled:opacity-30` behaviour is correct and must be preserved. Verify that the increased touch target does not cause layout overflow in the stepper row.

---

### H7. transferData.ts error messages are technical and give no action path

Source: audit-microcopy
File: `lib/transferData.ts` (lines 111, 115–118, 122–124, 167, 178)

What to fix:
Five error strings use developer vocabulary or dead-end phrasing. Replace each as follows — line 111: "That doesn't look like a backup file — try exporting a fresh one from Settings." · lines 115–118: "That file doesn't look right — only backups exported from Clarity will work." · lines 122–124: "The file didn't contain any entries we could read — try exporting a fresh backup." · lines 167 and 178: "Something stopped us from reading that file — try again." Calma's error pattern: calm, specific, gives the user a next step.

---

### H8. SettingsView import and export error copy is generic

Source: audit-microcopy
File: `SettingsView.tsx` (lines 79–81, 186–188)

What to fix:
Lines 186–188 display "Something went wrong. Please try again." for an export failure — the most generic possible message. Replace with the specific failure reason, or at minimum: "Couldn't download the backup — try again." Lines 79–81 catch import errors and display the same generic fallback, swallowing the more specific message already thrown by `transferData.ts`. Fix: pass the thrown error message through and display it directly instead of replacing it with the generic string.

---

### H9. SettingsView export description exposes "JSON" to the user

Source: audit-microcopy, audit-design-overall
File: `SettingsView.tsx` (lines 175–177)

What to fix:
The export description reads "Download all your habit entries as a JSON backup file." "JSON" is developer vocabulary with no meaning to a general user. Replace with: "Download a backup of all your entries." The word "backup" already conveys what the user needs to know; the format is irrelevant to them.

---

## Medium

### M1. CheckInForm reflection textarea missing text-sm and font-light

Source: audit-typography, audit-design-overall (two audits — confirmed)
File: `CheckInForm.tsx` (line 483)

What to fix:
The reflection textarea has `text-stone-700 dark:text-stone-300` but no size or weight. Calma specifies reflective body text as `text-sm font-light`. DayDetail already renders the same text with `text-sm font-light leading-relaxed` — the writing space and the reading space should give the same words the same weight. Add `text-sm font-light` to the textarea's className.

---

### M2. DayDetail date heading uses text-lg instead of text-base

Source: audit-typography, audit-design-overall (two audits — confirmed)
File: `DayDetail.tsx` (line 161)

What to fix:
The date heading uses `text-lg font-light tracking-wide`. Calma's section-heading scale specifies `text-base font-light tracking-widest`. In a compact bottom sheet `text-lg` sizes the heading as a page title. Change `text-lg` to `text-base` and `tracking-wide` to `tracking-widest`.

---

### M3. SettingsView "Theme" and "Your data" section labels missing font-medium

Source: audit-typography, audit-design-overall (two audits — confirmed)
File: `SettingsView.tsx` (lines 136, 169)

What to fix:
Both `h2` elements have `text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500` but are missing `font-medium`. The canonical six-part section-label pattern requires all six parts; `font-medium` is the most commonly omitted. Add `font-medium` to each. These are the last two section-label failures in the codebase — all other pages were fixed in Sprint 7.

---

### M4. SettingsView import success messages read as system output

Source: audit-microcopy, audit-design-overall (two audits — confirmed)
File: `SettingsView.tsx` (lines 248–259)

What to fix:
After a successful import the panel shows "{n} entries imported." and "{n} entries already existed and were kept." — database log language. Replace with warmer equivalents: "{n} days added." and "{n} days were already in your history and weren't changed." Keep the count display; only the surrounding copy changes.

---

### M5. CheckInForm add-moment placeholder reads as a field label

Source: audit-microcopy, audit-design-overall (two audits — confirmed)
File: `CheckInForm.tsx` (line 392)

What to fix:
The inline add-moment input has `placeholder="Moment name"` — the only placeholder in the app that functions as a form-field label rather than an invitation. ManageView uses example-based placeholders throughout. Replace with `placeholder="e.g. Morning light"` to match the established pattern.

---

### M6. ManageView "Does not bring joy by default" reads as a configuration flag

Source: audit-microcopy, audit-design-overall (two audits — confirmed)
File: `ManageView.tsx` (line 465)

What to fix:
The negative joyByDefault state reads "♡ Does not bring joy by default" — a property-sheet entry. Its counterpart "♥ Brings joy by default" is warm; the negative should match that register. Replace with "♡ Joy is marked separately" to describe the behaviour in human terms rather than stating the absence of a flag.

---

### M7. CalendarHeatmap year-nav buttons have no touch target minimum

Source: audit-interaction, audit-design-overall (two audits — confirmed)
File: `CalendarHeatmap.tsx` (lines 222, 234)

What to fix:
The year-prev and year-next buttons have no `min-h` constraint; they are approximately 20 px tall. The month-nav buttons directly adjacent have `min-h-[44px]`. The inconsistency is visible within the same component. Add `min-h-[44px]` to both year-nav buttons and vertically centre the icon inside.

---

### M8. FrequencyList bar animation animates width — layout-affecting, Calma-forbidden

Source: audit-interaction, audit-design-overall (two audits — confirmed)
File: `FrequencyList.tsx` (lines 161–163)

What to fix:
The frequency bar animates from `width: "0%"` to its target width. Calma permits only opacity, translate, and height/max-height for Motion animations. Replace with a `scaleX` transform: set the bar to its full target width, animate `scaleX` from `0` to `1`, and set `style={{ transformOrigin: "left" }}`. The visual result is identical; the animation no longer causes layout reflow.

---

### M9. CalendarHeatmap month-heading crossfade is below the 120 ms duration floor

Source: audit-interaction, audit-design-overall (two audits — confirmed)
File: `CalendarHeatmap.tsx` (lines 255–264)

What to fix:
The month heading crossfade uses a duration of `0.11` (110 ms). Calma sets 120 ms as the minimum animation duration. Change `duration: 0.11` to `duration: 0.12`.

---

### M10. ManageView "Jump to Moments" anchor fails WCAG AA in light mode

Source: audit-colour
File: `ManageView.tsx` (line 254)

What to fix:
The anchor uses `text-stone-400 underline-offset-4 hover:underline dark:text-stone-500`. Stone-400 (#a8a29e) fails WCAG AA on the light background (2.4:1, minimum 4.5:1). For a navigation link the correct role is `stone-600 dark:text-stone-500`. Replace `text-stone-400` with `text-stone-600` and add `transition-colors` (currently missing per the interaction audit).

---

### M11. ManageView numeric unit label uses text-stone-400 in light mode

Source: audit-colour
File: `ManageView.tsx` (line 273)

What to fix:
The unit label for active numeric habits uses `text-xs text-stone-400 dark:text-stone-500`. Stone-400 fails WCAG AA in light mode. Change `text-stone-400` to `text-stone-500`; the dark pairing `dark:text-stone-500` is already correct.

---

### M12. CheckInForm new-moment ghost button uses text-stone-400 in light mode

Source: audit-colour
File: `CheckInForm.tsx` (line 364)

What to fix:
The dashed "New moment" ghost button uses `text-stone-400 dark:text-stone-500`. Stone-400 fails WCAG AA in light mode. Change `text-stone-400` to `text-stone-500`. The element functions as a placeholder-style invitation; stone-500 is still visually quiet while passing contrast.

---

### M13. CheckInForm dismiss button uses text-stone-400 in light mode

Source: audit-colour
File: `CheckInForm.tsx` (line 405)

What to fix:
The add-moment dismiss "✕" button uses `text-stone-400 dark:text-stone-500`. Stone-400 fails WCAG AA in light mode. Change `text-stone-400` to `text-stone-500`. The dark pairing is already correct.

---

### M14. SettingsView back button does not name its destination

Source: audit-design-overall
File: `SettingsView.tsx` (line 114)

What to fix:
The back button reads "← back" — the only navigation element in the app that does not name its destination. Every other nav link is explicit ("← history", "← Settings", "Today"). The `backDest` value read from sessionStorage on mount already determines the destination. Use it to display "← Today" when `backDest === "/"` and "← History" when `backDest === "/history"`. This is a one-line change to the button's text content.

---

### M15. ManageView "Step" field label is unexplained jargon

Source: audit-microcopy
File: `ManageView.tsx` (line 483)

What to fix:
The label for the numeric habit increment field reads "Step". The word is unexplained; a user must guess it refers to the amount added per tap. Replace with "Increment" — more descriptive, still concise. Optionally add a brief `text-xs text-stone-500` hint below: "The amount added each tap." Either change alone is sufficient.

---

### M16. MomentChip touch target is approximately 32 px tall

Source: audit-interaction
File: `MomentChip.tsx` (line 11)

What to fix:
The chip button uses `py-2` giving approximately 32 px height. Calma requires 44 px minimum. Add `min-h-[44px]` to the button and add `flex items-center` to keep the chip label vertically centred. Do not change the chip's visual padding or border-radius.

---

### M17. HabitToggle item label has no explicit text-sm

Source: audit-typography
File: `HabitToggle.tsx` (line 24)

What to fix:
The habit label uses `text-stone-700 dark:text-stone-300` with no size declaration. Calma body text is `text-sm`. The element is visually correct because it sits alongside `text-sm` siblings, but the absence of an explicit size is fragile. Add `text-sm` to the className.

---

### M18. NumberStepper item label has no explicit text-sm

Source: audit-typography
File: `NumberStepper.tsx` (line 63)

What to fix:
The numeric habit label uses `text-stone-700 dark:text-stone-300` with no size declaration. Same issue as M17. Add `text-sm` to the className.

---

## Deferred

Low findings and non-trivial Medium findings deferred to a polish pass:

- `ManageView.tsx` lines 378, 587 — archived confirmation notes at `text-stone-400` (intentional archival dimming; Low) — audit-colour
- `CalendarHeatmap.tsx` ~300 — day-of-week labels `dark:text-stone-600` (should be `dark:text-stone-500`; Low) — audit-colour
- `SettingsView.tsx` line 335 — Cancel button missing explicit `dark:text-*` base; stone-500 passes contrast but is inconsistent (Low) — audit-colour
- `CalendarHeatmap.tsx` ~230 — year display `text-sm` where `text-xs` is expected (Low) — audit-typography
- `SettingsView.tsx` sections — `mb-8` spacing vs 2.5rem Calma baseline; dividers compensate (Low) — audit-typography
- `DayDetail.tsx` line 200 — numeric value `font-medium`; borderline acceptable (Low) — audit-typography
- `SettingsView.tsx` line 248 — import count `font-medium`; borderline acceptable (Low) — audit-typography
- `SettingsView.tsx` line 229 — remove-file "✕" button missing `transition-colors` (Low) — audit-interaction
- `ManageView.tsx` lines 413, 419 — Boolean/Numeric type-picker buttons missing `transition-colors` (Low) — audit-interaction
- `BottomNav.tsx` line 31 — inactive tabs have no hover colour; transition fires over nothing (Low) — audit-interaction
- `CalendarHeatmap.tsx` ~341, ~347 — future day cells and filter-dimmed cells at `opacity-25`, below the 30% floor (Low) — audit-interaction
- `FrequencyList.tsx` ~148 — inactive-filter chevron uses `visibility: hidden` instead of `opacity-0` (Low) — audit-interaction
- `HabitToggle.tsx` line 41 — thumb uses `transition-all`; narrow to `transition-[left]` (Low) — audit-interaction
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
| H1 | Joy blossom `active:scale-90` — forbidden scale transform | `CheckInForm.tsx:456` | High | audit-interaction, audit-design-overall |
| H2 | ManageView "Boolean"/"Numeric" — developer jargon | `ManageView.tsx:417,424` | High | audit-microcopy, audit-design-overall |
| H3 | History page empty state missing | `HistoryView.tsx` | High | audit-design-overall, audit-microcopy |
| H4 | DayDetail Edit link styled as footnote | `DayDetail.tsx:246–251` | High | audit-design-overall |
| H5 | HabitToggle touch target 28 × 48 px (16 px short) | `HabitToggle.tsx:34` | High | audit-interaction |
| H6 | NumberStepper ± buttons 32 × 32 px | `NumberStepper.tsx:73,96` | High | audit-interaction |
| H7 | transferData.ts technical error messages | `lib/transferData.ts:111,115,122,167,178` | High | audit-microcopy |
| H8 | SettingsView generic import/export error copy | `SettingsView.tsx:79–81,186–188` | High | audit-microcopy |
| H9 | SettingsView export description exposes "JSON" | `SettingsView.tsx:175–177` | High | audit-microcopy, audit-design-overall |
| M1 | Reflection textarea missing `text-sm font-light` | `CheckInForm.tsx:483` | Medium | audit-typography, audit-design-overall |
| M2 | DayDetail date heading `text-lg` → `text-base tracking-widest` | `DayDetail.tsx:161` | Medium | audit-typography, audit-design-overall |
| M3 | SettingsView Theme/"Your data" labels missing `font-medium` | `SettingsView.tsx:136,169` | Medium | audit-typography, audit-design-overall |
| M4 | SettingsView import success copy reads as system log | `SettingsView.tsx:248–259` | Medium | audit-microcopy, audit-design-overall |
| M5 | CheckInForm add-moment placeholder "Moment name" | `CheckInForm.tsx:392` | Medium | audit-microcopy, audit-design-overall |
| M6 | ManageView "Does not bring joy by default" | `ManageView.tsx:465` | Medium | audit-microcopy, audit-design-overall |
| M7 | CalendarHeatmap year-nav buttons no `min-h` | `CalendarHeatmap.tsx:222,234` | Medium | audit-interaction, audit-design-overall |
| M8 | FrequencyList bar animates `width` — Calma-forbidden | `FrequencyList.tsx:161–163` | Medium | audit-interaction, audit-design-overall |
| M9 | CalendarHeatmap month crossfade 110 ms — below 120 ms floor | `CalendarHeatmap.tsx:255–264` | Medium | audit-interaction, audit-design-overall |
| M10 | ManageView Jump to Moments anchor `text-stone-400` WCAG fail | `ManageView.tsx:254` | Medium | audit-colour |
| M11 | ManageView numeric unit label `text-stone-400` | `ManageView.tsx:273` | Medium | audit-colour |
| M12 | CheckInForm ghost button `text-stone-400` | `CheckInForm.tsx:364` | Medium | audit-colour |
| M13 | CheckInForm dismiss "✕" `text-stone-400` | `CheckInForm.tsx:405` | Medium | audit-colour |
| M14 | SettingsView back button destination unnamed | `SettingsView.tsx:114` | Medium | audit-design-overall |
| M15 | ManageView "Step" label — unexplained jargon | `ManageView.tsx:483` | Medium | audit-microcopy |
| M16 | MomentChip touch target ~32 px | `MomentChip.tsx:11` | Medium | audit-interaction |
| M17 | HabitToggle label no explicit `text-sm` | `HabitToggle.tsx:24` | Medium | audit-typography |
| M18 | NumberStepper label no explicit `text-sm` | `NumberStepper.tsx:63` | Medium | audit-typography |

Critical: 0 · High: 9 · Medium: 18 · Deferred: 16
Design intent notes: 4
