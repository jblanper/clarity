# Sprint 7 — Accessibility & Typography Baseline

**Dates:** 2026-03-06 – (TBD)
**Status:** active
**Release:** v2.1.5 (patch)

---

## Goal

Close the WCAG AA contrast failures and systematic `font-medium` gaps across the entire app, and replace the generic Unicode ♥ in DayDetail with the custom BlossomIcon.

## Business value

The app will be more accessible, typographically correct, and visually coherent — especially for users in light mode where `text-stone-400` foreground text currently fails contrast by a wide margin. No new features; every change is felt rather than seen.

---

## Tasks

### Task 1 — ManageView: SECTION_LABEL constant, header spacing, archived colours, and remaining stone violations

**What:** Four coordinated fixes to ManageView — the highest-leverage page in this sprint.

1. Fix the `SECTION_LABEL` module-level constant (line 59): `text-stone-400 dark:text-stone-500` → `text-stone-500 dark:text-stone-500`, add `font-medium`. Propagates to the Habits (`h2` line 262) and Moments (`h2` line 520) labels.
2. Fix header `mb-2 → mb-6` (line 238) to match every other page's header rhythm.
3. Raise archived label dark variants from `dark:text-stone-600` to `dark:text-stone-500` (habit archived label line 368, tag archived label line 581).
4. Fix joyByDefault false-branch button text `text-stone-400 → text-stone-500` at lines 282 and 464.
5. Fix archived numeric unit `text-stone-300 dark:text-stone-700` → `text-stone-500 dark:text-stone-500` at line 370. (`text-stone-300` is 1.6:1 — the lowest-contrast text in the codebase.)

**Files:** `components/ManageView.tsx`

**Implementation notes:**
- The `SECTION_LABEL` constant is at the top of the file; changing it fixes both section labels via string interpolation — no need to touch lines 262 or 520 directly.
- The `FIELD_LABEL` constant (line 57) uses `text-stone-500 dark:text-stone-400` — do NOT touch it this sprint.
- Theme and "Your data" section labels in SettingsView are already correct (`text-stone-500 dark:text-stone-500`) — reference these as the canonical pattern.
- ManageView is 655 lines — avoid reformatting or refactoring anything outside the targeted lines.

**Validation steps:**
- [ ] ManageView Habits and Moments section labels are `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`
- [ ] Header has `mb-6` gap below it (visual check: consistent with other pages)
- [ ] Archived habit and tag labels are readable in dark mode (compare to light mode — should be visually de-emphasised but not invisible)
- [ ] joyByDefault false state text is at least `text-stone-500` contrast in light mode
- [ ] Archived numeric unit is `text-stone-500` in light mode (not near-invisible `text-stone-300`)
- [ ] `npm run lint && npm test` passes

**Definition of done:** All five ManageView fixes are in place, lint and tests pass.

---

### Task 2 — SettingsView: three section labels and cancel button

**What:** Fix Manage, Help, and Reset section labels plus the reset cancel button in SettingsView.

1. Manage section label (`h2` line 120): `text-stone-400 dark:text-stone-500` → `text-stone-500 dark:text-stone-500`, add `font-medium`.
2. Help section label (`h2` line 292): same fix.
3. Reset section label (`h3` line 308): `text-stone-400` (no dark variant) → `text-stone-500 dark:text-stone-500`, add `font-medium`.
4. Cancel button base (line 335): `text-stone-400` → `text-stone-500`.

**Files:** `components/SettingsView.tsx`

**Implementation notes:**
- The Theme label (line 136) and "Your data" label (line 169) are already `text-stone-500 dark:text-stone-500` — do NOT touch them.
- There is no shared `SECTION_LABEL` constant in SettingsView; each `h2`/`h3` must be edited individually.
- The Reset section label (line 308) is the only one missing its `dark:` variant entirely — add both `text-stone-500` and `dark:text-stone-500`.
- The cancel button de-emphasis is achieved by the amber confirm button drawing the eye, not by contrast failure — `text-stone-500` is the minimum safe value.

**Validation steps:**
- [ ] Manage, Help, and Reset section labels are all `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`
- [ ] Reset label is readable in dark mode (previously had no dark class at all)
- [ ] Cancel button is visible in light mode without being as prominent as the amber confirm
- [ ] Theme and "Your data" labels are unchanged
- [ ] `npm run lint && npm test` passes

**Definition of done:** All four SettingsView fixes are in place, lint and tests pass.

---

### Task 3 — DayDetail: section label font-medium and BlossomIcon for joy review

**What:** Add `font-medium` to all four DayDetail section label `h3` elements, and replace the Unicode ♥ joy indicator with the custom `BlossomIcon`.

1. Four `h3` section labels (lines 173, 193, 213, 232): add `font-medium` to each class string.
2. Replace `<span className="text-sm text-amber-500 dark:text-amber-400">♥</span>` (line 182) with `<BlossomIcon filled={true} size={16} />`.

**Files:** `components/DayDetail.tsx`, `components/BlossomIcon.tsx` (read-only for import path reference)

**Implementation notes:**
- There is no shared `SECTION_LABEL` constant in DayDetail — each `h3` must be edited individually.
- The Moments `h3` uses `mb-3`; the others use `mb-2`. Do not equalise the margins — only add `font-medium`.
- `BlossomIcon` is imported in `CheckInForm.tsx` and `HelpView.tsx` — copy the import pattern from either. The component accepts `filled` (boolean) and `size` (number) props.
- The BlossomIcon in this context is a **read-only display element** — no press state, no animation, no `type="button"`. Do not wrap it in a `<button>`.
- The joy review renders inside a `flex items-center gap-2` row alongside habit name text at `text-sm`. At `size={16}` the blossom sits visually inline with the text without dominating.

**Validation steps:**
- [ ] All four DayDetail section labels (`h3`) are `font-medium` (open a logged day in History to verify)
- [ ] Joy-marked habits in DayDetail show the filled BlossomIcon, not ♥
- [ ] BlossomIcon is amber-coloured and fills correctly in both light and dark mode
- [ ] BlossomIcon is not interactive (no hover effect, no cursor pointer)
- [ ] `npm run lint && npm test` passes

**Definition of done:** All four h3 labels have `font-medium`; the BlossomIcon renders at `size={16}` in the joy review; lint and tests pass.

---

### Task 4 — CheckInForm: section label font-medium and margin correction

**What:** Add `font-medium` to all five CheckInForm section label `h2` elements and change the Habits and By the Numbers labels from `mb-1` to `mb-3`.

1. Habits `h2` (line 280): add `font-medium`, change `mb-1 → mb-3`.
2. By the Numbers `h2` (line 308): add `font-medium`, change `mb-1 → mb-3`.
3. Moments `h2` (line 338): add `font-medium` (already has `mb-3`).
4. Joy section `h2` (line 433): add `font-medium` (already has `mb-3`).
5. Reflection `h2` (line 473): add `font-medium` (already has `mb-3`).

**Files:** `components/CheckInForm.tsx`

**Implementation notes:**
- There is no shared `SECTION_LABEL` constant in CheckInForm — each `h2` must be edited individually.
- `CheckInForm` is used in both today mode (no `date` prop) and edit mode (`date` prop from `/edit`). Validate in both contexts.
- The Joy section heading is "What felt particularly good today?" — longer than all other section labels. After adding `font-medium` it will be visually heavier than a sentence-length label typically warrants. This is spec-correct; do a visual check to confirm it reads acceptably.
- The `mb-1 → mb-3` change on Habits adds 8px above the first `divide-y` row — visual check that this does not look disconnected.

**Validation steps:**
- [ ] All five section labels are `font-medium` (Today page: Habits, By the Numbers, Moments, Joy — if at least one boolean done — and Reflection)
- [ ] Habits and By the Numbers labels have `mb-3` gap above the first item (not the cramped `mb-1`)
- [ ] Moments, Joy, and Reflection labels are unchanged in margin
- [ ] Joy section heading reads acceptably at medium weight despite its length (visual check)
- [ ] Edit mode (`/edit?date=…`) renders the same corrected labels
- [ ] `npm run lint && npm test` passes

**Definition of done:** All five section labels are `font-medium`; Habits and Numbers have `mb-3`; the form looks correct in both today and edit modes.

---

### Task 5 — HelpView and HistoryView: section labels and body text

**What:** Fix the `SECTION_LABEL` constant in HelpView, add `font-light` to its `BODY` constant, and add `font-medium` to the HistoryView frequency toggle button.

1. HelpView `SECTION_LABEL` constant (line 7): add `font-medium`. Propagates to all five section headings.
2. HelpView `BODY` constant (line 10): add `font-light`. Aligns HelpView body copy with DayDetail's reflection paragraph (the only other long-form reading surface in the app).
3. HistoryView frequency toggle `<button>` (line 93): add `font-medium` to the existing class string.

**Files:** `components/HelpView.tsx`, `components/HistoryView.tsx`

**Implementation notes:**
- HelpView's `SECTION_LABEL` already has the correct colour (`text-stone-500 dark:text-stone-500`) — only `font-medium` is missing.
- `BODY` is used at multiple lines as `${BODY}` and `${BODY} mt-3` — the constant edit propagates to all; no further changes needed.
- Check that `font-light` on `text-sm` body copy is legible in both light and dark mode on a physical device (Geist Sans at `font-light` is thinner than default).
- HistoryView frequency toggle is a `<button type="button">` — adding `font-medium` is a class-only change with no logic impact.

**Validation steps:**
- [ ] HelpView section headings are `font-medium` (Settings → Help)
- [ ] HelpView body paragraphs are visibly lighter weight (`font-light`)
- [ ] HelpView body text is legible on a physical mobile device in ambient light
- [ ] HistoryView "Frequency" toggle button label is `font-medium` (History page, scroll below heatmap)
- [ ] `npm run lint && npm test` passes

**Definition of done:** Both HelpView constants updated; HistoryView toggle gains `font-medium`; body text legible on device.

---

### Task 6 — globals.css: DayDetail reduced-motion guard

**Note: This task requires coordinated changes across two files. Both must be committed together.**

**What:** Add a `prefers-reduced-motion` media query in `globals.css` to suppress the DayDetail backdrop and sheet CSS transitions for users who have enabled reduced motion. The current `transition-opacity` and `transition-transform` on these `<div>` elements are not governed by `MotionConfig` — they must be suppressed explicitly.

1. In `DayDetail.tsx`, add class names to the backdrop `<div>` and the sheet `<div>`:
   - Backdrop: add `daydetail-backdrop` to its `className`
   - Sheet: add `daydetail-sheet` to its `className`
2. In `globals.css`, add a `@media (prefers-reduced-motion: reduce)` block:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .daydetail-backdrop,
     .daydetail-sheet {
       transition: none;
     }
   }
   ```

**Files:** `components/DayDetail.tsx`, `app/globals.css`

**Implementation notes:**
- The existing pattern for `.frequency-chevron` and `.heatmap-grid` in `globals.css` is the established precedent — follow it exactly.
- The backdrop `<div>` currently has `transition-opacity duration-300`; the sheet `<div>` has `transition-transform duration-300`. The media query sets `transition: none` on both class names.
- Do NOT alter the transition duration or easing for users without `prefers-reduced-motion` — 300 ms ease is within Calma's 320 ms ceiling.
- Commit both file changes together — a partial implementation where the class names exist in the component but the media query is absent (or vice versa) would produce broken animations.

**Validation steps:**
- [ ] In a browser with `prefers-reduced-motion: reduce` set (DevTools → Rendering → Emulate prefers-reduced-motion), the DayDetail sheet and backdrop appear/disappear without animation
- [ ] On a standard device (no reduced motion), the sheet and backdrop animate exactly as before (300 ms slide/fade)
- [ ] No other transitions or animations are affected
- [ ] Both files (`DayDetail.tsx` and `globals.css`) are in the same commit
- [ ] `npm run lint && npm test` passes

**Definition of done:** DayDetail transitions are suppressed under `prefers-reduced-motion: reduce`; standard behaviour is unchanged; both files committed together.

---

## Definition of done — Sprint

- [ ] All six tasks above are complete and validated
- [ ] `npm run lint && npm test && npm run build` passes clean
- [ ] Tested manually on mobile viewport in both light and dark mode
- [ ] No `text-stone-400` (or worse) foreground text remains in light mode across Today, History, Settings, Manage, Help, and DayDetail
- [ ] Every section label in the app carries `font-medium`
- [ ] DayDetail joy review shows BlossomIcon (not ♥) in both light and dark mode
- [ ] DayDetail reduced-motion guard verified in browser DevTools
- [ ] `docs/audit-implementation-plan.md` updated: Chunks 1, 5, 6 (partial), 7, 8, 9, 10, 11, 12 marked completed
- [ ] Ready for `/deploy`

---

## Architecture Review

**Date:** 2026-03-06
**Diff base:** eb6c5e5 (Release v2.1.4)
**Lint/tests:** pass

### Findings

| Severity | File | Issue |
|---|---|---|
| low (fixed) | `ManageView.tsx` lines 368, 581 | Archived habit/tag labels were `text-stone-400` in light mode — WCAG AA failure (2.4:1). Fixed to `text-stone-500` in the same session. |

### Must fix before deploy

None (the one finding was fixed immediately).

### Recommendations for next sprint

- `ManageView.tsx` is at 655 lines and should be watched. The next feature addition should evaluate whether inline form rendering warrants extraction into a sub-component.
- `SECTION_LABEL` constant is still duplicated independently across six component files. A shared `lib/styles.ts` export would prevent future drift (coordinate change required every time a new label property is added).
- ManageView joyByDefault toggle (`♡`/`♥` at lines 282, 464) still uses Unicode hearts — the remaining joy-icon incoherence after the DayDetail BlossomIcon fix. Flagged as direct follow-on for Sprint 8.

### Plan fidelity

Fully faithful to the sprint plan. All six tasks completed as specified. Two commits: one for the full sprint implementation, a second to fix the archived-label WCAG violation caught during arch review. No scope creep. No tasks skipped or partially done. BlossomIcon `size={16}` and archived numeric unit `text-stone-500` implemented as decided during review.

---

## Retrospective

<!-- To be filled in after the sprint using /sprint-retro -->
