# Sprint 14 — Typographic Calendar & History Polish

**Dates:** 2026-03-16 – (TBD)
**Status:** active
**Release:** v2.6.0 (minor — visual overhaul of core calendar feature, new SegmentedPill in history, legend row)

---

## Goal

Replace the filled-cell heatmap with a typographic, date-as-weight calendar that fits Clarity's ink-on-paper identity. Clean up History navigation (conditional year row, repositioned empty-state), tighten frequency bar proportions, and unify the period selector with the SegmentedPill pattern. Closes the last outstanding High audit finding and adds the long-deferred `createEmptyEntry` unit test.

## Business value

The filled GitHub-green squares introduce gamification signals that contradict Clarity's calm identity; replacing them with weighted typography makes data visible without scoring. The SegmentedPill period selector and conditional year row reduce visual noise for new users. The `createEmptyEntry` test closes the last uncovered `lib/` utility from Sprint 11.

---

## Tasks

### Task 1 — H6: `createEmptyEntry` unit test

**What:** Add a unit test for `createEmptyEntry` in a new `lib/habits.test.ts` file. No test file exists yet.

**Files:** `lib/habits.test.ts` (new)

**Gotchas / edge cases:** None — the function is pure and side-effect-free.

**Implementation notes:**
- Create `lib/habits.test.ts` importing `createEmptyEntry` from `@/lib/habits`.
- Test name: `"createEmptyEntry returns a blank entry for the given date"`.
- Assert: `date` equals the input string; `habits` is `{}`; `numeric` is `{}`; `moments` is `[]`; `reflection` is `""`.
- Follow the Jest pattern used in `lib/storage.test.ts` (no describe wrapper needed for a single function).

**Validation steps:**
- [x] `lib/habits.test.ts` exists and contains at least one `it()` or `test()` block named for `createEmptyEntry`
- [x] `npm test` passes with the new file included

**Definition of done:** `createEmptyEntry` has a passing unit test in `lib/habits.test.ts`.

---

### Task 2 — H3: Frequency bar refinement

**What:** Two one-line changes to `FrequencyList.tsx`:
1. `barWidth * 38` → `* 100` — bars now fill the full container width proportionally to the top item
2. Bar track height `h-0.5` → `h-1`

**Files:** `components/FrequencyList.tsx`

**Gotchas / edge cases:** The bar width calculation (line 133) uses `Math.round((item.count / maxCount) * 38)` with a `%` suffix. Replace `38` with `100`.

**Implementation notes:**
- Line 133: `const barWidth = \`${Math.round((item.count / maxCount) * 38)}%\`` → `* 100`
- Line 153: `<div className="mt-1.5 h-0.5 w-full rounded-full">` → `h-1`
- No other changes.

**Validation steps:**
- [x] Grep `FrequencyList.tsx` for `* 38` — must return no results
- [x] Grep `FrequencyList.tsx` for `h-0.5` — must return no results
- [x] `npm run lint` passes

**Definition of done:** Frequency bars fill proportional width and render at 4px height.

---

### Task 3 — H4: Period SegmentedPill

**What:** Replace the three dot-separated text buttons (Month · 3 Months · Always) in `HistoryView.tsx` with an `<SegmentedPill<Period>>`. The `handlePeriodChange` handler is preserved; `SegmentedPill` calls it via `onChange`.

**Files:** `components/HistoryView.tsx`

**Gotchas / edge cases:**
- `handlePeriodChange` guards against the same-period re-selection (`if (p === period) return`). Since `SegmentedPill` calls `onChange` on every tap, this guard stays important — do not remove it.
- The `isUpdating` fade (`.is-updating` CSS class on `.frequency-list`) still works because `handlePeriodChange` sets `isUpdating` before updating `period`.

**Implementation notes:**
- Add import: `import SegmentedPill from "@/components/SegmentedPill";`
- Define options constant outside the component (avoids recreating on each render):
  ```tsx
  const PERIOD_OPTIONS = [
    { value: "month" as const, label: "Month" },
    { value: "3m" as const, label: "3 Months" },
    { value: "always" as const, label: "Always" },
  ] satisfies { value: Period; label: string }[];
  ```
- Replace the `<div className="mt-5 mb-6 flex items-center justify-center gap-3">` block (lines 135–150) with:
  ```tsx
  <div className="mt-5 mb-6 flex items-center justify-center">
    <SegmentedPill<Period>
      options={PERIOD_OPTIONS}
      value={period}
      onChange={handlePeriodChange}
    />
  </div>
  ```
- Remove the three `<button>` elements and two `<span>` dot separators entirely.

**Validation steps:**
- [x] No `Month · 3 Months · Always` dot-button pattern remains in `HistoryView.tsx` (grep for `· 3 Months`)
- [x] SegmentedPill renders in the frequency section; all three options selectable
- [x] `handlePeriodChange` is still called on selection (not inlined into `onChange`)
- [x] `npm run lint && npm test` passes

**Definition of done:** Period selector is a SegmentedPill that calls `handlePeriodChange`, matching the SettingsView pill pattern.

---

### Task 4 — High audit fix: HistoryView empty-state

**What:** When `entries.length === 0`: suppress the Frequency section entirely; position the empty-state `<p>` immediately below the heatmap.

**Files:** `components/HistoryView.tsx`

**Gotchas / edge cases:** After reading the current file, this fix **appears already correctly implemented**:
- Line 88–92: `{entries.length === 0 && (<p className="mt-10 text-center ...">...)}` is already below the heatmap.
- Line 95: `{entries.length > 0 && (...)}` already suppresses the entire Frequency section.

This task is therefore a **verification task**: confirm the current implementation satisfies the High audit finding, then mark it closed.

**Implementation notes:**
- Read `components/HistoryView.tsx` and confirm:
  1. The empty-state `<p>` appears after the `<div className="heatmap-grid ...">` block and before the Frequency section.
  2. The Frequency toggle button and its `<AnimatePresence>` block are both inside the `entries.length > 0` conditional.
- If either condition is not met, apply the fix (DOM reorder only, ~5 lines).
- If both conditions are met, no code change needed — the finding is already resolved.

**Validation steps:**
- [x] When `entries` is empty (clear localStorage and reload), no Frequency toggle appears
- [x] When `entries` is empty, the "Your days will appear here once you start logging." message appears directly below the heatmap
- [x] When `entries` is non-empty, Frequency section renders normally

**Definition of done:** Empty state shows only the heatmap + message; Frequency section is invisible with zero entries.

---

### Task 5 — H1 + H2: CalendarHeatmap — date-as-weight encoding + conditional year row

**What:** Two interconnected changes to `CalendarHeatmap.tsx` batched into one pass:
- **H1:** Remove all filled-cell backgrounds. Replace the two-axis colour blend with a typographic encoding: font weight encodes habit completion; amber colour fires for any joy or moment. Add a legend row below the grid.
- **H2:** Hide the year navigation row when `currentYear - earliestYear < 1 || entries.length < 7`; inline the year into the month heading when row is hidden.

**Files:** `components/CalendarHeatmap.tsx`

**Gotchas / edge cases:**
- Pre-work: grep for `HABIT_LIGHT`, `MOMENT_LIGHT`, `HABIT_DARK`, `MOMENT_DARK`, `computeCellColor`, `getFilterHighlightColor` — all are confirmed to live only in `CalendarHeatmap.tsx` (not imported elsewhere). Safe to delete.
- `activeHabitCount` state and its `useEffect` must be preserved — used for weight normalisation.
- `useIsDark()` hook: no longer needed for cell colour computation (Tailwind dark: classes handle dark mode), but keep it if the legend row uses it. If unused after the refactor, remove it and its import to avoid lint errors.
- Filter behavior: `isFilteredOut ? "opacity-25" : ""` on the outer button. Unchanged — do not modify.
- The `doesEntryMatchFilter` function: keep as-is. It is still used to determine `isFilteredOut`.
- Cell size stays `h-11 w-11`.

**Implementation notes:**

**Step 1 — Delete colour constants and old functions:**
Remove lines 65–121 (the `HABIT_LIGHT`, `MOMENT_LIGHT`, `HABIT_DARK`, `MOMENT_DARK`, HSL constants, `computeCellColor`, and `getFilterHighlightColor` functions). Keep `doesEntryMatchFilter`.

**Step 2 — Add `computeCellStyle`:**
```tsx
interface CellStyle {
  weightClass: string;
  colorClass: string;
}

function computeCellStyle(
  entry: HabitEntry | null,
  activeHabitCount: number,
): CellStyle {
  if (!entry) {
    return { weightClass: "font-light", colorClass: "text-stone-300 dark:text-stone-700" };
  }
  const done = Object.values(entry.habits).filter((s) => s.done).length;
  const b = activeHabitCount > 0 ? done / activeHabitCount : 0;
  const hasJoyOrMoment =
    Object.values(entry.habits).some((s) => s.joy) || entry.moments.length > 0;

  const weightClass =
    b === 0 ? "font-light"
    : b <= 0.33 ? "font-normal"
    : b <= 0.67 ? "font-semibold"
    : "font-bold";

  const colorClass = hasJoyOrMoment
    ? "text-amber-600 dark:text-amber-400"
    : "text-stone-700 dark:text-stone-300";

  return { weightClass, colorClass };
}
```

**Step 3 — H2 condition:**
Compute `earliestYear` and `showYearRow` near the top of the component, after the existing `isAtCurrentMonth` line:
```tsx
const sortedDates = entries.map((e) => e.date).sort();
const earliestYear = sortedDates[0] ? parseInt(sortedDates[0].substring(0, 4), 10) : currentYear;
const showYearRow = currentYear - earliestYear >= 1 && entries.length >= 7;
```

**Step 4 — Year row conditional:**
Wrap the existing year-row `<div className="mb-1 flex items-center justify-center gap-8">` block with `{showYearRow && (...)}`.

**Step 5 — Month heading with inline year:**
Replace the `<m.h2>` content from `{MONTH_NAMES[month]}` to:
```tsx
{MONTH_NAMES[month]}{!showYearRow ? ` ${year}` : ""}
```

**Step 6 — Cell rendering:**
Replace the per-cell rendering logic:
```tsx
const { weightClass, colorClass } = computeCellStyle(entry, activeHabitCount);
const isFilteredOut = !!filter && !!entry && !isFuture && !doesEntryMatchFilter(entry, filter);
```

New cell button:
```tsx
<button
  key={d}
  type="button"
  onClick={() => !isFuture && onDayClick(dateStr)}
  disabled={isFuture}
  aria-label={dateStr}
  aria-pressed={isSelected}
  className={[
    "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
    isSelected ? "bg-stone-100 dark:bg-stone-800" : "",
    isFuture ? "cursor-default opacity-30" : "cursor-pointer",
    isFilteredOut ? "opacity-25" : "",
  ]
    .filter(Boolean)
    .join(" ")}
>
  <span className={`text-sm leading-none ${weightClass} ${colorClass}`}>
    {dayNum}
  </span>
</button>
```

Remove all `cellBg`, `matchesFilter`, and `dimmed` variables. Remove all `style={{ backgroundColor }}` from cells.

**Step 7 — Legend row:**
Add immediately after the closing `</AnimatePresence>` of the grid (before the final `</div>`):
```tsx
{/* ── Legend ─────────────────────────────────────── */}
<div className="mt-4 flex items-center justify-center gap-5">
  <span className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-500">
    <span className="text-sm font-light text-stone-300 dark:text-stone-700">7</span>
    no activity
  </span>
  <span className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-500">
    <span className="text-sm font-bold text-stone-700 dark:text-stone-300">7</span>
    active
  </span>
  <span className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-500">
    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">7</span>
    joy
  </span>
</div>
```

**Step 8 — Clean up `isDark`:**
After the refactor, `useIsDark()` is no longer called in cell rendering. If the legend row uses static Tailwind classes only, remove `const isDark = useIsDark()` and the `useIsDark` function entirely to avoid unused-variable lint errors. Keep `useIsDark` only if used elsewhere in the component.

**Validation steps:**
- [x] Grep `CalendarHeatmap.tsx` for `HABIT_LIGHT` — must return no results
- [x] Grep `CalendarHeatmap.tsx` for `computeCellColor` — must return no results
- [x] Grep `CalendarHeatmap.tsx` for `backgroundColor` — must return no results
- [x] Grep `CalendarHeatmap.tsx` for `bg-stone-200` in cell — must return no results
- [ ] Cells render as date numbers only; no filled square backgrounds
- [ ] A day with all habits done shows `font-bold` number; a day with no habits shows `font-light`
- [ ] A day with joy or moments shows amber text
- [ ] Filter dimming still works: tapping a FrequencyList row dims non-matching days to 25% opacity
- [ ] Selected day shows `rounded-full bg-stone-100 dark:bg-stone-800` circle (no ring)
- [ ] Year row hidden for a fresh/new account (< 7 entries or all in same calendar year)
- [ ] Month heading shows year when year row is hidden: e.g. "March 2026"
- [ ] Year row appears once threshold is met: `entries.length >= 7 && spans more than one calendar year`
- [ ] Legend row renders below the grid with three labelled sample numbers
- [x] `npm run lint && npm test && npm run build` passes clean

**Definition of done:** CalendarHeatmap renders a typographic date-as-weight calendar with amber joy signal, inline year when appropriate, and a legend row. No filled cell backgrounds remain.

---

### Bug fix — BottomNav jump on month change

**What:** After implementing the typographic calendar (Task 5), changing the calendar month caused the fixed BottomNav to visually jump down for a fraction of a second on iOS Safari.

**Root cause:** The grid `AnimatePresence` was using `mode="wait"` (sequential exit → enter). Between the exit completing and the enter starting, there is a brief gap where `AnimatePresence` has no children in the DOM. Even though the grid's actual content height is constant at 344px (7 rows × 44px + 6 gaps × 6px), this gap caused the wrapper to briefly collapse, triggering a layout reflow. iOS Safari re-paints `position: fixed` elements during layout reflows, making the BottomNav visually snap.

An initial attempt with `min-h-[294px]` (wrong value — should have been 344px) didn't fix it.

**Fix:** Switched the grid `AnimatePresence` to `mode="popLayout"`. The exiting element is immediately removed from document flow (made `position: absolute`) the moment its exit animation begins, so the new element enters straight away and layout height never changes. A `relative overflow-hidden` wrapper contains the absolutely-positioned exiting element so it doesn't overflow the calendar area during the slide-out.

**Files:** `components/CalendarHeatmap.tsx`

---

## Definition of done — Sprint

- [ ] All tasks above are complete and validated
- [ ] `npm run lint && npm test && npm run build` passes clean
- [ ] Tested manually on mobile viewport in both light and dark mode
- [ ] No regressions on existing features (check Today, History, Settings, Manage, Edit)
- [ ] Ready for `/deploy`

---

## Retrospective

<!-- To be filled in after the sprint using /sprint-retro -->
