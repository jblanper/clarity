# Sprint 11 — Amber Language Completion

**Dates:** 2026-03-14 – (TBD)
**Status:** active
**Release:** v2.4.0 (minor — visible language change across multiple surfaces)

---

## Goal

Complete the amber completion language across all check-in and history surfaces, surface joy-marked habits as a Highlights section in DayDetail, and fix a layout bug in HistoryView where the Frequency section appears when no entries exist.

## Business value

Sprint 9 established amber as the completion language in HabitToggle and NumberStepper, but MomentChip, DayDetail moment chips, and the done-habit checkmark still use stone-grey — breaking the visual language. This sprint closes that gap, making every "done" signal speak the same warm amber. The Highlights section gives joy-marked habits a meaningful presence in the historical record. The HistoryView fix removes a confusing dead toggle for new users.

---

## Tasks

### Task 1 — MomentChip: amber selected state

**What:** Replace the stone-fill selected state in `MomentChip` with amber treatment. Also remove `dark:bg-stone-800` from the unselected dark state (transparent at rest is cleaner and matches HabitToggle's unselected dark pattern).

**Files:** `components/MomentChip.tsx`

**Gotchas / edge cases:**
None — single file, no data model involvement.

**Implementation notes:**
Current selected classes: `bg-stone-500 dark:bg-stone-300 text-white dark:text-stone-900`
Replace with: `bg-amber-50 border border-amber-300 text-amber-800 dark:bg-amber-900/20 dark:border dark:border-amber-700/40 dark:text-amber-300`

Current unselected dark class includes `dark:bg-stone-800` — remove it. The unselected state should be:
`border border-stone-200 dark:border-stone-700 bg-transparent text-stone-500 dark:text-stone-400`

The `min-h-[44px]` touch target and `rounded-full` must be preserved. `transition-colors` stays.

**Validation steps:**
- [x] Selected chip: amber tinted background and text in light mode
- [x] Selected chip: dim amber background and amber text in dark mode
- [x] Unselected chip: transparent background in dark mode (no stone-800 wash)
- [x] `npm run lint && npm test` passes

**Definition of done:** Selected MomentChip renders amber in both modes; unselected dark is transparent at rest.

---

### Task 2 — CheckInForm: add-moment input height, textarea border, Capture label

**What:** Three small tweaks to `CheckInForm`:
1. Add `min-h-[44px]` to the inline add-moment text input (line ~395) to match the Add button height.
2. Soften the reflection textarea light-mode border from `border-stone-300` → `border-stone-200` (line ~486). Dark mode `dark:border-stone-700` unchanged.
3. Change the save button idle label from `"Save"` to `"Capture"` for new entries only. Edit path retains `"Save"` / `"Saving…"` / `"Saved"`. The three-state progression for new entries becomes: `"Capture"` → `"Capturing…"` → `"Day captured"`.

**Files:** `components/CheckInForm.tsx`

**Gotchas / edge cases:**
- `isEditMode` is `!!date` (line 105). Use this flag to branch all three save-button labels.
- Current confirmed label is `"Day captured"` for all modes. Edit mode needs this changed to `"Saved"`.
- Current saving label is `"Saving..."`. New entries need this changed to `"Capturing…"`.

**Implementation notes:**

**1. Add-moment input height** — find the input at ~line 395 (`flex-1 rounded-full border border-stone-300`). Add `min-h-[44px]` to its className.

**2. Textarea border** — find the textarea at ~line 486 (`border border-stone-300 dark:border-stone-700`). Change `border-stone-300` → `border-stone-200`. Leave `dark:border-stone-700` intact.

**3. Save button labels** — the current save button (lines ~491–505) renders:
```
saveState === "saving" ? "Saving..." : saveState === "confirmed" ? "Day captured" : "Save"
```
Replace with a branch on `isEditMode`:
```tsx
saveState === "saving"
  ? (isEditMode ? "Saving…" : "Capturing…")
  : saveState === "confirmed"
    ? (isEditMode ? "Saved" : "Day captured")
    : (isEditMode ? "Save" : "Capture")
```

**Validation steps:**
- [x] Add-moment input row: input and button are visually the same height (~44px)
- [x] Reflection textarea: lighter border in light mode; dark mode border unchanged
- [x] New entry save button: idle shows `"Capture"`, saving shows `"Capturing…"`, confirmed shows `"Day captured"`
- [x] Edit mode save button: idle shows `"Save"`, saving shows `"Saving…"`, confirmed shows `"Saved"`
- [x] `npm run lint && npm test` passes

**Definition of done:** All three tweaks live; save button labels branch correctly on `isEditMode`.

---

### Task 3 — DayDetail: amber moment chips + amber checkmark

**What:** Two colour changes in `DayDetail`:
1. Replace stone-filled read-only moment chip spans with amber styling (tighter padding than interactive chips).
2. Change the done-habit `✓` glyph from `text-stone-500 dark:text-stone-500` to amber.

**Files:** `components/DayDetail.tsx`

**Gotchas / edge cases:**
These chips are read-only (`<span>`, not `<button>`) — no cursor-pointer, no hover state, no press handler. Use slightly tighter padding (`px-3 py-1.5`) than the interactive MomentChip (`px-4 py-2`) to communicate read-only status.

**Implementation notes:**

**1. Moment chips** — find the `<span>` at ~line 220 (`rounded-full bg-stone-500 dark:bg-stone-300 px-4 py-2 text-sm text-white dark:text-stone-900`). Replace with:
```tsx
className="rounded-full bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border dark:border-amber-700/40 dark:text-amber-300 px-3 py-1.5 text-sm"
```
No `transition-colors`, no hover — static display.

**2. Checkmark** — find `<span className="text-sm text-stone-500 dark:text-stone-500">✓</span>` at ~line 180. Change classes to `text-amber-500 dark:text-amber-400`.

**Validation steps:**
- [x] DayDetail moment chips: amber tinted in light mode, amber in dark mode, tighter padding than interactive chips
- [x] Done-habit checkmark: amber in both light and dark modes
- [x] Chips are non-interactive (no pointer cursor, no hover response)
- [x] `npm run lint && npm test` passes

**Definition of done:** All read-only moment chips and done-habit checkmarks display amber in both modes.

---

### Task 4 — DayDetail: Highlights section + Edit button + CLAUDE.md token

**Depends on:** Task 3 must be complete first (same file — complete Task 3 before starting this task).

**What:** Three changes to `DayDetail`, plus one CLAUDE.md update:
1. Add a Highlights section **above Habits** — amber panel card listing joy-marked habits with `BlossomIcon filled={true}`. Renders only when `checkedHabits.some(h => h.joy)`.
2. Remove the per-row inline `BlossomIcon` from individual habit rows (rendered safe by the Highlights guard).
3. Replace the section-label-styled `Edit` link with a new tertiary button: `"Edit this day"`.
4. Document the tertiary button token in `CLAUDE.md`.

**Files:** `components/DayDetail.tsx`, `CLAUDE.md`

**Gotchas / edge cases:**
- Guard is `checkedHabits.some(h => h.joy)` — not `checkedHabits.length > 0`. Days with zero joy never render the section.
- Remove inline BlossomIcon only after the section is verified working — step 1 and 2 are sequential.
- `BlossomIcon` is already imported at line 6 — no new import needed.
- Highlights section uses the same amber panel card token as CheckInForm's Joy section: `bg-amber-50 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-900/30 rounded-2xl`.
- Apply the existing height/opacity animation pattern (≤280ms ease-out) for the Highlights reveal — consistent with CheckInForm's Joy section. Use `AnimatePresence` + `m.div` with `animate={{ height: "auto", opacity: 1 }}` and `style={{ overflow: "hidden" }}`. Check that `m` is already imported in this file (use `LazyMotion` + `domAnimation` via `MotionProvider`).

**Implementation notes:**

**1. Highlights section** — insert before the `{checkedHabits.length > 0 && ...}` block (i.e. above Habits):
```tsx
{/* Highlights — joy-marked habits */}
{checkedHabits.some((h) => h.joy) && (
  <section className="mb-6 bg-amber-50 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-900/30 rounded-2xl px-4 py-4">
    <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500">
      Highlights
    </h3>
    <div className="space-y-1.5">
      {checkedHabits
        .filter((h) => h.joy)
        .map((h) => (
          <div key={h.id} className="flex items-center gap-2">
            <BlossomIcon filled={true} size={16} />
            <span className="text-sm text-stone-700 dark:text-stone-300">{h.label}</span>
          </div>
        ))}
    </div>
  </section>
)}
```

No motion wrapping needed if the section simply shows/hides with the data — but if you wish to animate its appear/disappear, apply `AnimatePresence` + `m.section` with `initial={{ height: 0, opacity: 0 }}` / `animate={{ height: "auto", opacity: 1 }}` / `exit={{ height: 0, opacity: 0 }}` and `style={{ overflow: "hidden" }}`, duration ≤280ms ease-out.

**2. Remove per-row BlossomIcon** — in the Habits section (lines ~178–186), delete the `{h.joy && (<BlossomIcon filled={true} size={16} />)}` conditional from each habit row.

**3. Edit button** — replace the existing `<Link>` at lines ~246–251:
```tsx
<Link href={`/edit?date=${date}`} className="text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 ...">
  Edit
</Link>
```
With a tertiary-styled button-like `<Link>`:
```tsx
<Link
  href={`/edit?date=${date}`}
  className="inline-flex items-center rounded-xl border border-stone-200 dark:border-stone-700 px-4 py-2 text-xs text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
>
  Edit this day
</Link>
```
Wrap it in `<div className="mt-4">` as before.

**4. CLAUDE.md** — add the tertiary button token to the Tailwind implementation tokens section:
```
- **Tertiary button** — `inline-flex items-center rounded-xl border border-stone-200 dark:border-stone-700 px-4 py-2 text-xs text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50` — transparent bg at rest, border, small text, hover wash. Use for low-hierarchy actions within a detail view (e.g. "Edit this day" in DayDetail).
```

**Validation steps:**
- [x] Highlights section appears above Habits when ≥1 checked habit has `joy: true`
- [x] Highlights section does not render when no habits are joy-marked
- [x] BlossomIcon is no longer shown inline in the Habits list rows
- [x] Highlights section correctly lists only joy-marked habits with filled BlossomIcon
- [x] "Edit this day" link renders as a small bordered button (tertiary style)
- [x] "Edit this day" navigates to `/edit?date=...` correctly
- [x] CLAUDE.md contains the tertiary button token entry
- [x] `npm run lint && npm test` passes

**Definition of done:** Highlights section renders above Habits for joy days, inline BlossomIcon removed from habit rows, "Edit this day" styled as tertiary button, token documented in CLAUDE.md.

---

### Task 5 — HistoryView: suppress Frequency section + relocate empty-state

**What:** Two layout changes to `HistoryView`:
1. Wrap the entire Frequency section (divider + toggle + animated list) in `{entries.length > 0 && ...}` so it never renders when there are no entries.
2. Move the empty-state `<p>` to immediately below the heatmap (`<div>` wrapper) so it reads as the calendar's own empty state, not an afterthought below a dead toggle.

**Files:** `components/HistoryView.tsx`

**Gotchas / edge cases:**
- Use JSX `&&` conditional, not CSS `hidden`, to avoid layout flash.
- The section divider (`<div className="mt-10 border-t ...">`) and everything inside it must be inside the guard — not just the toggle button.
- The empty-state `<p>` currently lives at ~line 161, after the Frequency `</div>`. It should move to immediately after the `</div>` that closes the heatmap container (~line 85).

**Implementation notes:**

Current structure (lines ~87–165):
```
{/* Section divider + Frequency */}
<div className="mt-10 border-t ...">
  {/* Toggle */}
  ...
  {/* AnimatePresence */}
  ...
</div>

{/* Empty state */}
{entries.length === 0 && (
  <p>Your days will appear here once you start logging.</p>
)}
```

Target structure:
```
{/* Empty state — immediately below heatmap */}
{entries.length === 0 && (
  <p className="mt-10 text-center text-sm text-stone-500 dark:text-stone-500">
    Your days will appear here once you start logging.
  </p>
)}

{/* Section divider + Frequency — only when entries exist */}
{entries.length > 0 && (
  <div className="mt-10 border-t border-stone-100 dark:border-stone-800 pt-8">
    {/* Toggle + AnimatePresence — unchanged */}
    ...
  </div>
)}
```

The empty-state `<p>` moves to immediately after the closing `</div>` of the heatmap block (~line 85). Keep the `mt-10` spacing class on the `<p>` so it has breathing room from the calendar.

**Validation steps:**
- [x] When no entries: Frequency toggle does not appear; empty-state message appears below the calendar
- [x] When entries exist: Frequency toggle appears as before; empty-state message is absent
- [x] Toggling Frequency open/closed still animates correctly when entries exist
- [x] `npm run lint && npm test` passes

**Definition of done:** Frequency section is hidden when no entries; empty-state message renders directly below the calendar.

---

## Definition of done — Sprint

- [ ] All tasks above are complete and validated
- [ ] `npm run lint && npm test && npm run build` passes clean
- [ ] Tested manually on mobile viewport in both light and dark mode
- [ ] No regressions on existing features (check Today, History, Settings, Manage, Edit)
- [ ] Ready for `/deploy`

---

## Architecture Review

**Date:** 2026-03-14
**Diff base:** 479d5c1 (Release v2.3.1)
**Lint/tests:** pass

### Findings

| Severity | File | Issue |
|---|---|---|
| High | `components/ManageView.tsx:402,631` | `text-stone-400` as light-mode foreground on archived confirmation note — pre-existing, not introduced by Sprint 11. Fix: `text-stone-400` → `text-stone-500`. |
| Low | `lib/habits.ts` | `createEmptyEntry` has no unit test. Trivial function, low risk. |

### Must fix before deploy

None — both findings are pre-existing and not introduced by Sprint 11.

### Recommendations for next sprint

- Fix ManageView `text-stone-400` (two-line change — `ManageView.tsx:402` and `631`).
- Consider adding `habits.test.ts` with a trivial test for `createEmptyEntry`.

### Plan fidelity

All 5 tasks implemented exactly as specified. No deviations, no scope creep.
Amber-600 substituted for amber-500 on the ✓ checkmark glyph during review (WCAG improvement, reviewer-initiated).

### Architecture audit comparison

| Before (Sprint 9) | After (Sprint 11) | Fixed | Regressions |
|---|---|---|---|
| 3 findings (0C/0H/0M/3L) | 3 findings (0C/1H/0M/2L) | 1 (M1 — accepted) | 0 |

No regressions. The new High finding (ManageView stone-400) was pre-existing and outside the Sprint 11 diff.

---

## QA Results

**Date:** 2026-03-14

### Regression suite
176 tests passed · 0 failed · 3 stale tests updated

### New tests written
- `e2e/sprint-11-amber-language.spec.ts` — 16 tests across Tasks 1–5 (desktop + mobile viewports, dark mode)

### Failures found
None

### Stale tests updated
- `e2e/smoke.spec.ts:80` — save button selector `"Save"` → `"Capture"` (Task 2: label changed for new entries)
- `e2e/section-labels.spec.ts:154` — Frequency toggle test now seeds an entry first (Task 5: toggle hidden when no entries)
- `e2e/sprint-08-microcopy.spec.ts:172` — "Edit link uses nav-link style" test replaced with "Edit this day" label + navigation test (Task 4: link restyled as tertiary button)

### Manual checklist
- [ ] MomentChip: selected chip shows warm amber tint in light mode; dim amber in dark mode; unselected is transparent in dark mode (no stone wash)
- [ ] CheckInForm: idle save button reads "Capture"; mid-save reads "Capturing…"; confirmed reads "Day captured"
- [ ] CheckInForm edit mode: idle save button reads "Save"; mid-save reads "Saving…"; confirmed reads "Saved"
- [ ] DayDetail: done-habit checkmark `✓` is amber in both light and dark modes
- [ ] DayDetail: moment chips render amber-tinted (not stone-filled); no pointer cursor, no hover response
- [ ] DayDetail: Highlights section appears above Habits when ≥1 habit is joy-marked; BlossomIcon visible per entry
- [ ] DayDetail: Highlights section absent on days with no joy-marked habits
- [ ] DayDetail: "Edit this day" renders as a small bordered button (tertiary style); tapping navigates to edit
- [ ] HistoryView (new user / empty state): Frequency toggle not visible; empty-state message appears directly below calendar
- [ ] HistoryView (with entries): Frequency toggle visible and collapses/expands correctly
- [ ] Animations feel smooth on enter and exit
- [ ] Dark mode: no invisible text, no layout shifts
- [ ] Mobile (390px): no horizontal overflow, touch targets feel reachable
- [ ] Reduced motion: enable in OS settings, verify animations are suppressed

---

## Validation

**Date:** 2026-03-14

### Audit results

| Audit | Before | After | Fixed | Regressions |
|---|---|---|---|---|
| colour | 0C · 0H · 0M · 3L | 0C · 0H · 0M · 3L | 0 | 0 |
| interaction | 0H · 1M · 8L | 0H · 1M · 9L | 1M (add-moment input touch target) | 0 |
| microcopy | 0H · 0M · 3L | 0H · 0M · 3L | 0 | 0 |

### Remaining findings

All remaining findings are pre-existing and carry forward from Sprint 9:

- **Colour (2 low):** ManageView lines 402 and 631 — `text-stone-400` light-mode foreground on archived confirmation notes. Recommended fix listed in Sprint 11 Architecture Review. Defer to Sprint 12.
- **Colour (1 low):** CalendarHeatmap day-of-week labels use `dark:text-stone-600` (wrong direction for dark mode). Low priority.
- **Interaction (1 medium):** Two-step nav-link hover (`stone-600 → stone-800`) — intentional but undocumented in the Calma spec. Defer.
- **Interaction (multiple medium):** Touch targets in Settings, Manage, Help (bare-text controls). Not in Sprint 11 scope.
- **Interaction (1 low — new):** "Edit this day" tertiary button in DayDetail: `py-2` gives ~28–32px vertical — below 44px minimum. Low traffic, low risk. Add `min-h-[44px] flex items-center` in a future pass.
- **Microcopy (2 low):** CheckInForm inline validation messages (`"Please enter a name."`, `"A moment with that name already exists."`). Suggested rewrites available in audit.
- **Microcopy (1 low):** ManageView "Start at" placeholder `"0"` vs spec-specified `"Optional"`.

### Regressions

None. No new high or medium findings introduced by Sprint 11.

---

## Post-Code Summary

**Date:** 2026-03-14

### Architecture gate
PASS — 0 must-fix issues. 1 pre-existing High (ManageView stone-400 foreground, lines 402/631) flagged for Sprint 12. Sprint 11 diff is clean.

### Validation
| Audit | Before | After | Fixed | Regressions |
|---|---|---|---|---|
| colour | 0C · 0H · 0M · 3L | 0C · 0H · 0M · 3L | 0 | 0 |
| interaction | 0H · 1M · 8L | 0H · 1M · 9L | 1M (add-moment touch target) | 0 |
| microcopy | 0H · 0M · 3L | 0H · 0M · 3L | 0 | 0 |

Regressions: None

### QA
Regression suite: 176 tests passed · 0 failed. Smoke: 12/12.
3 stale tests updated (save button label, Frequency toggle guard, DayDetail Edit link text).

Failures: None

### Recommended next action
Proceed to `/calma-sync` → `/deploy`

---

## Calma Sync

**Date:** 2026-03-14

### Spec changes made

- **Accessibility rule (Palette)** — removed Tailwind-specific `dark:` variant reference; rephrased to "safe only in dark mode"
- **Active press states (Motion)** — removed `active:opacity-70` Tailwind class from the principle statement
- **Chip / tag variant (Interaction)** — new paragraph documenting pill-chip selection state (amber when selected, transparent at rest) and the reduced-padding convention for read-only contexts
- **Button hierarchy (Interaction)** — new subsection defining primary, secondary, and tertiary button levels before the States table
- **Writing examples table** — two new rows: "Save (new entry)" → "Capture / Capturing… / Day captured" and "Save (edit)" → "Save / Saving… / Saved"

### CLAUDE.md token updates

None — tertiary button token was already added in Task 4.

### Open design decisions identified

- Two-step nav-link hover (`stone-600 → stone-800`) is intentional but still undocumented in the Calma spec. Carries from Sprint 11 validation. Low priority.

---

## Retrospective

<!-- To be filled in after the sprint using /sprint-retro -->
