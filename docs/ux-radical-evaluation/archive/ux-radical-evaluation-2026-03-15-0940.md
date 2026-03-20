# UX Evaluation Report

**Date and time:** 2026-03-15 09:40
**Area reviewed:** History page — CalendarHeatmap + FrequencyList, including assessment of the "Ma" Seasonal Tapestry proposal
**Designer:** UX Radical Evaluation
**Prior evaluations:** 2026-03-14-0840 (Manage bold redesign), 2026-03-14-2130 (Settings). Neither covers History. No archiving required.

---

## Scope

The full History page — the calendar heatmap, the month/year navigation, the Frequency section and its period selector and list — evaluated against the live deployed state and the code in `CalendarHeatmap.tsx` and `FrequencyList.tsx`. The "Ma" Seasonal Tapestry feature proposal (`docs/clarity-feature-explorer/proposed-features-2026-03-09-1545.md`) is reviewed as a potential design direction and assessed against both the existing implementation problems and the Calma spec.

---

## What's working

**The two-axis sunset palette is genuinely thoughtful.** Dusk blue (hsl 210) for structural habit completion, warm ember (hsl 23) for moments and joy, blended proportionally when both signals are present. This is Calma's "two-axis blend" principle applied correctly. It's non-arbitrary: the color communicates something specific and meaningful.

**The month navigation animation is well-executed.** The directional slide (custom + variants pattern, not inline functions) correctly reverses when going backward. The month heading crossfade is clean at 120ms. The `AnimatePresence` handling is correct. This is one of the better interaction details in the app.

**The FREQUENCY toggle is correctly styled.** `text-xs font-medium uppercase tracking-widest text-stone-500` — all six parts of the section label, applied to a collapsible toggle. This is the right pattern.

**The calendar-to-frequency-list filter interaction is a genuinely clever idea.** Tapping a habit in the list highlights matching days in the calendar and dims the rest. The bidirectional connection between the two sections of the page makes the History page more than a list — it makes it a tool for seeing patterns. The one-time hint dismiss is implemented correctly too.

**The bar animation in FrequencyList is well-done.** `scaleX` from 0 with `transformOrigin: "left"` follows the CLAUDE.md animation rules correctly — no width animation, no reflow.

**The scroll-preservation on Frequency collapse is handled correctly.** Synchronous `window.scrollTo` before the state update that collapses the section — the CLAUDE.md pattern for this exact problem, applied correctly.

---

## What needs attention

### 1. The cell boxes make it look like GitHub

**What:** Every calendar day renders as a 44×44px filled square — `h-11 w-11 rounded-md` with `bg-stone-200 dark:bg-stone-800` for empty days and a sunset-blend color for active ones. This is, structurally, GitHub's contribution graph: a grid of colored squares where intensity communicates activity.

**Where:** `CalendarHeatmap.tsx:330–354` — the cell `<button>` render.

**Why it matters:** The user named this directly: "the calendar is a bit too similar to Github's one." Even with the sunset blend (which is genuinely different from GitHub's green), the first impression is a developer activity chart. Clarity is a personal reflection tool. It should not visually reference a code contribution tracking product. The association is wrong for the audience, the purpose, and the emotional register.

**Calma alignment:** Calma says typography is the primary design material. Colored boxes are the opposite — they reduce language to pure area and saturation, which is data dashboard territory. The current calendar uses color as its primary encoding on a grid of opaque cells. That's not Calma. It's infographic.

Also: the cells use `rounded-md` — Calma's `rounded-xl` is the minimum for inline/compact controls. `rounded-md` makes the cells feel sharper and more grid-like, reinforcing the GitHub aesthetic.

---

### 2. The frequency bar is too constrained to communicate relative difference

**What:** `FrequencyList.tsx:133, 153–166` — the bar is `h-0.5` (2px tall) and capped at 38% max width (`Math.round((item.count / maxCount) * 38)`). A bar that can only reach 38% of the row width — and is only 2px tall — is too compressed to communicate the relative differences between habits clearly.

**Where:** `FrequencyList.tsx` — the `barWidth` calculation and the bar element.

**Why it matters:** The bar is the right encoding for a reflection tool — it communicates rhythm and relative proportion without anchoring to a goal number. But at 2px height and 38% max width, it barely registers. Two habits with meaningfully different rhythms (one done every day, one done once a week) look almost identical in bar length. The encoding is correct in principle; it's just too quiet to do its job.

**Calma alignment:** The bar as a qualitative signal — not a numeric count — is fully aligned with Clarity's philosophy. Approximate relative comparison serves reflection; precise counts risk creating implicit targets. The fix is to make the bar more expressive, not to add numbers.

---

### 3. The period selector uses weight alone as its active signal

**What:** `HistoryView.tsx:136–149` — `font-medium text-stone-900` is the only active state signal for the period buttons (Month / 3 Months / Always). Inactive: `text-stone-500`. No enclosure, no shape.

**Where:** The period selector row inside the Frequency section.

**Why it matters:** This is the same affordance problem flagged in `ux-radical-evaluation-2026-03-14-2130.md` for the Settings Theme toggle (S1). Typographic weight alone is the weakest possible affordance signal for a selection control. A user scanning the section cannot immediately see which period is active. Note that the Settings report already recommends a segmented pill (S1) — the same solution applies here.

**Calma alignment:** The Calma spec's "chip / tag variant" — "a pill-shaped chip communicates selection state through amber fill when selected; transparent background with stone border at rest" — describes this use case. The current implementation does not follow it.

---

### 4. The year row adds visual noise for most users

**What:** `CalendarHeatmap.tsx:220–241` — the year navigation row (`< 2026 >`) renders unconditionally above the month row. This means every History view has two rows of navigation controls, even for users who have data only within a single year.

**Where:** The top of the `CalendarHeatmap` component.

**Why it matters:** A user who started Clarity in January 2026 will never have data in 2025. The year selector is visually present but functionally irrelevant for their entire first year of use. Two navigation rows on a compact mobile view create a navigation hierarchy that isn't earned yet.

**Calma alignment:** "Every omission should serve calm, not emptiness." Omitting the year row until it's needed serves calm — it removes a control that hasn't been earned by the user's data span. This aligns with Calma's principle that the interface should contain only what is necessary for the current moment.

---

## Proposals

### H1 — Date-as-weight: remove cell boxes, let typography carry the data

**What to change:** Remove the filled cell backgrounds entirely. Each day is its date number — nothing else. Two independent channels carry the signal: **weight** communicates how much structural habit work was done; **color** communicates whether any emotional signal was present (joy marked or moment logged). The selected day gets a subtle `rounded-full` circle behind it, not a filled square. Tappable area stays 44×44px — the hit target doesn't change.

---

#### Activity encoding — two independent channels

| Channel | Signal | Values |
|---|---|---|
| Font weight | Habit completion ratio | Ghost (300) → Present (400) → Bold (600) → Bolder (700) |
| Color | Joy / moments present | Stone (neutral) if none; amber if any |

The two channels are orthogonal — amber fires regardless of weight, weight changes regardless of amber. This means a day with no habits but a moment logged renders at weight 400 in amber. A day with full habits but no joy renders at weight 700 in stone. There is no blending or mixing of the two signals.

| State | Font weight | Color — light | Color — dark |
|---|---|---|---|
| No entry (ghost) | 300 | `hsl(25, 5%, 84%)` | `hsl(25, 5%, 32%)` |
| Habit-only, low (< 55%) | 400 | `hsl(25, 6%, 30%)` | `hsl(25, 6%, 76%)` |
| Habit-only, medium (55–85%) | 600 | `hsl(25, 6%, 30%)` | `hsl(25, 6%, 76%)` |
| Habit-only, full (≥ 85%) | 700 | `hsl(25, 6%, 30%)` | `hsl(25, 6%, 76%)` |
| Joy only, no habits | 400 | `hsl(28, 72%, 38%)` | `hsl(35, 88%, 62%)` |
| Joy present, low habits (< 55%) | 400 | `hsl(28, 72%, 38%)` | `hsl(35, 88%, 62%)` |
| Joy present, medium habits (55–85%) | 600 | `hsl(28, 72%, 38%)` | `hsl(35, 88%, 62%)` |
| Joy present, full habits (≥ 85%) | 700 | `hsl(28, 72%, 38%)` | `hsl(35, 88%, 62%)` |
| Future day | 300 | `hsl(25, 5%, 84%)` at opacity 0.35 | `hsl(25, 5%, 32%)` at opacity 0.35 |

**Joy detection:** `hasJoy` is true when `Object.values(entry.habits).some(s => s.joy)` OR `entry.moments.length > 0`. Either signal — a joy-marked habit or any logged moment — switches the color channel to amber.

**Habit completion ratio `b`:** `habitCount / (totalBooleanHabits || 1)` where `habitCount = Object.values(entry.habits).filter(s => s.done).length`. `totalBooleanHabits` is a prop already passed to the component — no new data required.

**Ghost treatment:** Empty days (no entry or no activity at all) use font weight 300 and the ghost color. At small screen sizes they are barely legible — intentionally watermark-level. They preserve the structural calendar grid without competing with logged days.

---

#### What is removed from the existing cell render

The following must be removed from the current `<button>` className:

- `rounded-md` — the GitHub-square-grid shape is gone entirely
- `bg-stone-200` / `dark:bg-stone-800` — no filled background on any cell state
- `ring-2 ring-stone-500` (or equivalent) — the selected-day ring indicator is replaced

The `computeCellColor` function is deleted in its entirety. It is replaced by `computeCellStyle`.

---

#### `computeCellStyle` — full implementation

```tsx
function computeCellStyle(
  entry: HabitEntry,
  isDark: boolean,
  totalBooleanHabits: number,
): { fontWeight: number; color: string } {
  const ghost = isDark ? "hsl(25, 5%, 32%)" : "hsl(25, 5%, 84%)";
  const habitCount = Object.values(entry.habits).filter((s) => s.done).length;
  const hasJoy =
    Object.values(entry.habits).some((s) => s.joy) ||
    entry.moments.length > 0;
  const b = habitCount / (totalBooleanHabits || 1);

  if (!hasJoy && b === 0) return { fontWeight: 300, color: ghost };

  const amber = isDark ? "hsl(35, 88%, 62%)" : "hsl(28, 72%, 38%)";
  const stone = isDark ? "hsl(25, 6%, 76%)" : "hsl(25, 6%, 30%)";
  const color = hasJoy ? amber : stone;
  const fontWeight = b === 0 ? 400 : b < 0.55 ? 400 : b < 0.85 ? 600 : 700;
  return { fontWeight, color };
}
```

Call site: `const cellStyle = entry ? computeCellStyle(entry, isDark, totalBooleanHabits) : { fontWeight: 300, color: ghost };` — where `ghost` is derived from the same `isDark` value, consistent with the function internals.

---

#### Cell render — complete JSX

```tsx
<button
  type="button"
  onClick={() => !isFuture && onDayClick(dateStr)}
  disabled={isFuture}
  aria-label={dateStr}
  aria-pressed={isSelected}
  className={[
    "flex h-11 w-11 items-center justify-center transition-colors",
    isFuture ? "cursor-default" : "cursor-pointer",
    isFilteredOut ? "opacity-25" : "",
  ]
    .filter(Boolean)
    .join(" ")}
>
  <span
    className={[
      "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
      isSelected ? "bg-stone-100 dark:bg-stone-800" : "",
    ]
      .filter(Boolean)
      .join(" ")}
    style={{
      fontWeight: cellStyle.fontWeight,
      color: cellStyle.color,
      ...(isFuture ? { opacity: 0.35 } : {}),
    }}
  >
    {dayNum}
  </span>
</button>
```

Key notes on the render:

- **Outer `<button>`** — carries the 44×44px touch target (`h-11 w-11`), cursor state, and the HeatmapFilter opacity (`opacity-25` when `isFilteredOut`). Has no background, no border, no rounded shape of its own. `transition-colors` is present for filter opacity transitions.
- **Inner `<span>`** — carries the 32×32px visual circle (`h-8 w-8`), always `rounded-full` so the selected-state background appears as a circle. `bg-stone-100 dark:bg-stone-800` is applied only when `isSelected`. `transition-colors` for color/background transitions.
- **`fontWeight` and `color`** go on the inner span via `style={}` — not via Tailwind classes, because the values are computed at runtime and Tailwind's purger does not generate all 4 weight × 6 color combinations at build time.
- **Future day opacity (`0.35`)** is applied on the inner span via `style={}`, not on the outer button — this preserves the full touch area while making the number appear dimmed. Future days have `disabled={true}` on the button, which also prevents click.
- **HeatmapFilter opacity (`opacity-25`)** is applied on the outer button via `className` — this is the existing filter-dimming behavior, unchanged. It sits on the outer element so both the number and any selected-state circle dim together.
- **`isFilteredOut`** — this variable's logic is unchanged from the existing implementation: it is true when a `HeatmapFilter` is active and the day's entries do not include a match for the active filter.
- **`type="button"`** is required on all non-submit buttons per CLAUDE.md.

---

#### Selected state

The selected day gets a `bg-stone-100 dark:bg-stone-800` circle (32×32px, `rounded-full`) rendered by the inner span's conditional `className`. The date number sits centered inside this circle, in its usual weight and color. The circle is subtle — just enough contrast to indicate focus without being distracting.

Removed: the existing `ring-2 ring-stone-500` ring that currently marks the selected day. Do not keep the ring — it conflicts with the no-border-on-cells intent.

---

#### Legend row (new element, below the grid)

A new legend row renders immediately below the calendar grid, inside `CalendarHeatmap`. This is a new element not present in the current code.

```tsx
{/* Legend — placed after the calendar grid div, before any bottom margin */}
<div className="mt-2 flex items-center justify-center gap-4">
  <span
    className="text-xs font-light"
    style={{ color: isDark ? "hsl(25, 5%, 32%)" : "hsl(25, 5%, 84%)" }}
  >
    ghost = no activity
  </span>
  <span
    className="text-xs font-bold"
    style={{ color: isDark ? "hsl(25, 6%, 76%)" : "hsl(25, 6%, 30%)" }}
  >
    bold = active
  </span>
  <span
    className="text-xs font-semibold"
    style={{ color: isDark ? "hsl(35, 88%, 62%)" : "hsl(28, 72%, 38%)" }}
  >
    amber = joy
  </span>
</div>
```

The legend uses the same color constants as the cells — ghost, stone, and amber — derived from `isDark`. This keeps the legend perfectly in sync with the encoding: each legend label is literally displayed in the color it describes. Font weight also mirrors the encoding: `font-light` for ghost, `font-bold` for active, `font-semibold` for amber (matching the weight used for a day with joy and some habits).

Position: `mt-2` below the calendar grid, centered horizontally with `gap-4` between items.

---

#### What does NOT change

The following are explicitly unchanged by H1:

- Grid structure (columns = weeks, rows = days of week, day-label column on the left)
- Day label column: `h-11 w-5 flex items-center justify-center text-xs uppercase tracking-widest text-stone-400 dark:text-stone-600`, letters M T W T F S S arranged vertically
- Cell dimensions: `h-11 w-11` outer button, `h-8 w-8` inner span — unchanged
- Month/year navigation rows and their behavior
- `AnimatePresence` directional slide animation for month transitions
- `onDayClick` click handler and all selection state logic
- HeatmapFilter filter/highlight logic and the `isFilteredOut` opacity treatment
- `totalBooleanHabits` prop — already available
- `isDark` hook (`useIsDark()`) — already in use
- All aria attributes on the cell button

---

**Calma note:** Two independent channels — weight for structure, amber for feeling — is more orthogonal than a blend. Neither signal overwrites the other; both are readable simultaneously. This follows Calma's semantic color rule (amber signals emotional weight) and its typographic primacy principle (type is the primary material, no decorative surface). The ghost empty-day treatment is Calma's principle of contextual omission: a day with nothing logged has nothing to say; it steps back.

**On the Ma Tapestry proposal:** This proposal implements the philosophical core of the Tapestry's "Typographic Rhythm" direction — type carries data, no colored boxes, amber for joy — in the simplest possible form. It does NOT implement the 5-style system (Typographic Rhythm / Weave / Petals / Mist / Field). That system is over-engineered for what is, at root, a binary problem: "does this look like GitHub?" and "does it feel considered?" H1 answers both without requiring the user to choose from five visualization modes. The Weave, Petals, Mist, and Field directions are interesting design provocations that belong in the feature explorer backlog, not a sprint.

**Mockup:** [View mockup](./mockup-2026-03-15-0940.html#h1-date-weight)

**Effort estimate:** Medium. Changes the cell render in `CalendarHeatmap.tsx` — removes `bg-stone-200 dark:bg-stone-800 rounded-md` logic, replaces `computeCellColor` with `computeCellStyle`, adds the legend row. No changes to grid structure, navigation, filter logic, or parent components.

---

### H2 — Collapse the year row until it's earned

**What to change:** Only render the year navigation row when the user's earliest entry is more than 11 months ago. Derive this from `entries` — sort and take the first date. If `entries.length === 0` or the earliest entry is within 11 months of today, hide the year row entirely. When hidden, include the year inline in the month heading so the user always knows what year they're in.

---

#### `hasMultiYearData` derivation

This boolean is computed once inside `CalendarHeatmap`, from the `entries` prop that is already available:

```tsx
const hasMultiYearData = (() => {
  if (!entries.length) return false;
  const earliest = entries.map((e) => e.date).sort()[0];
  const earliestYear = parseInt(earliest.split("-")[0], 10);
  return currentYear - earliestYear >= 1;
})();
```

`currentYear` is the currently viewed year (already a prop or derived state in the component — the same one used to render the year label in the year row). `earliest.split("-")[0]` is safe because dates are always `YYYY-MM-DD` strings per CLAUDE.md data model.

---

#### Year row — conditional render

Wrap the existing year row JSX in a conditional. The year row itself is unchanged in structure and styling:

```tsx
{hasMultiYearData && (
  <div className="mb-1 flex items-center justify-center gap-8">
    {/* existing year row content — buttons and year label — unchanged */}
  </div>
)}
```

The existing year row contains: a back-chevron `<button>` (`text-stone-500 dark:text-stone-400 min-h-[44px] flex items-center justify-center`, chevron character `‹`), the year label (`text-sm uppercase tracking-widest text-stone-500 dark:text-stone-500`), and a forward-chevron `<button>` (same classes as back, but `opacity-30 cursor-default` when `currentYear >= thisYear`). None of these classes change.

---

#### Month heading — inline year when row is hidden

The month heading text is already rendered as `{monthName}` (e.g. "March"). When `hasMultiYearData` is false (year row hidden), it becomes `{monthName} ${currentYear}` (e.g. "March 2026"). When `hasMultiYearData` is true (year row visible), it reverts to `{monthName}` alone, since the year row above carries year context.

```tsx
<span className="text-base font-light tracking-widest text-stone-600 dark:text-stone-400">
  {hasMultiYearData ? monthName : `${monthName} ${currentYear}`}
</span>
```

This is a one-character change in the JSX text expression. All other classes on the month heading span are unchanged.

---

#### Month nav row spacing

The month nav row (`flex items-center justify-between`) currently sits below the year row with some margin. When the year row is hidden, the month nav row gains visual breathing room above it automatically — no spacing changes needed. The existing `mb-6` (or equivalent) below the month nav row is unchanged.

---

#### What does NOT change

- Year row internal structure, chevron buttons, and their onClick handlers — unchanged
- Year row appearing/disappearing has no entrance/exit animation — it is a conditional render based on data state, which changes at most once in a user's lifetime of app usage
- Month nav row structure and spacing — unchanged
- `currentYear` and `thisYear` (or equivalent "actual current year") are already available in the component

---

**Calma note:** This is Calma's "controls that only become relevant at a specific state may appear contextually" principle. The year selector is only relevant when data spans multiple years. Its absence when irrelevant is not confusing — it's calm.

**Mockup:** [View mockup](./mockup-2026-03-15-0940.html#h2-year-row)

**Effort estimate:** Low. One conditional render wrapping the existing year row JSX, one ternary in the month heading text. The `entries` prop is already available in `CalendarHeatmap`.

---

### H3 — Frequency bar: taller and full-width

**What to change:** Remove the 38% max-width cap and increase the bar height from `h-0.5` (2px) to `h-1` (4px). Let the top item's bar run to the full row width (100%), with all other bars proportional to it. This makes relative differences between habits legible at a glance without adding any numeric data.

---

#### Exact changes in `FrequencyList.tsx`

**Change 1 — `barWidth` calculation (line 133):**

```tsx
// Before:
const barWidth = `${Math.round((item.count / maxCount) * 38)}%`;

// After:
const barWidth = `${Math.round((item.count / maxCount) * 100)}%`;
```

Only the multiplier changes: `38` → `100`. The rest of the expression — `item.count`, `maxCount`, `Math.round` — is unchanged.

**Change 2 — bar container height (line 153):**

```tsx
// Before:
<div className="mt-1.5 h-0.5 w-full rounded-full">

// After:
<div className="mt-1.5 h-1 w-full rounded-full">
```

Only the height class changes: `h-0.5` → `h-1`. All other classes on this element — `mt-1.5`, `w-full`, `rounded-full` — are unchanged.

---

#### What does NOT change

The following are explicitly unchanged by H3:

- Bar fill div inside the container: `<div className="h-full rounded-full" style={{ width: barWidth }} />` structure unchanged
- Bar fill color classes: joy habits use `bg-amber-400 dark:bg-amber-500`, regular habits use `bg-stone-300 dark:bg-stone-600` — unchanged
- `scaleX` animation from 0 to 1 with `transformOrigin: "left"` — unchanged
- `style={{ width: barWidth }}` as a static style (not animated) — unchanged
- The bar container has no background color (no visible track) — the bar is a thin colored line, not a bar-with-track. This is unchanged.
- `maxCount` derivation — unchanged
- `mb-1` or any other surrounding margin — only the `h-` class on the container changes

---

**Why not add the count number:** A precise count creates an implicit target. A user who sees "22" inevitably thinks about "25 next month." The bar communicates rhythm and relative proportion — the right framing for a reflection tool — without anchoring to a goal. Approximate comparison is a feature, not a limitation. This aligns with the explicit rejection of BJ Fogg's extrinsic motivation loops documented in `docs/calm-research.md`.

**Calma note:** No Calma rules touched. The bar's qualitative encoding is consistent with Calma's philosophy that this is a tool for feeling patterns, not measuring them. Making it more expressive is a craft improvement, not a philosophical shift.

**Mockup:** [View mockup](./mockup-2026-03-15-0940.html#h3-bar-refinement)

**Effort estimate:** Low. Two one-line changes in `FrequencyList.tsx`. No logic changes, no new state, no component changes.

---

### H4 — Period selector: enclosed pill group

**What to change:** Replace the floating dot-separated text buttons with an enclosed segmented pill control — the same pattern recommended in `ux-radical-evaluation-2026-03-14-2130.md` (S1) for the Settings Theme toggle. The active period gets a filled stone indicator; inactive periods use transparent background with muted text.

---

#### Complete replacement JSX

The entire period selector block in `HistoryView.tsx` (currently lines 135–150, containing the three floating text buttons and the `·` separators) is replaced with:

```tsx
<div className="mt-5 mb-6 flex justify-center">
  <div className="inline-flex gap-0.5 rounded-full border border-stone-200 p-0.5 dark:border-stone-700">
    {(["month", "3m", "always"] as Period[]).map((p) => (
      <button
        key={p}
        type="button"
        onClick={() => handlePeriodChange(p)}
        className={[
          "rounded-full px-3 py-1.5 text-xs uppercase tracking-widest transition-colors",
          period === p
            ? "bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900"
            : "text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200",
        ].join(" ")}
      >
        {p === "month" ? "Month" : p === "3m" ? "3 Months" : "Always"}
      </button>
    ))}
  </div>
</div>
```

---

#### Class-by-class breakdown

**Outer wrapper:** `mt-5 mb-6 flex justify-center`
- `mt-5` — spacing above the pill group, below the Frequency section label
- `mb-6` — spacing below the pill group, before the frequency list
- `flex justify-center` — centers the pill group horizontally in the column

**Pill group container:** `inline-flex gap-0.5 rounded-full border border-stone-200 p-0.5 dark:border-stone-700`
- `inline-flex` — shrinks to content width (does not stretch full row)
- `gap-0.5` — 2px gap between pill buttons inside the container
- `rounded-full` — fully rounded ends, matching the pill-button roundness inside
- `border border-stone-200 dark:border-stone-700` — the enclosure ring (1px, stone-200 light / stone-700 dark)
- `p-0.5` — 2px inner padding so buttons sit slightly inset from the border

**Active pill button:** `rounded-full px-3 py-1.5 text-xs uppercase tracking-widest transition-colors bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900`
- `rounded-full` — fully rounded, matches container shape
- `px-3 py-1.5` — horizontal and vertical padding; `py-1.5` is required (not `py-1`) for adequate touch height
- `text-xs uppercase tracking-widest` — section label typography, consistent with surrounding UI
- `transition-colors` — smooth switch when period changes
- `bg-stone-800 text-white` — primary button token in light mode
- `dark:bg-stone-200 dark:text-stone-900` — primary button token in dark mode

**Inactive pill button:** `rounded-full px-3 py-1.5 text-xs uppercase tracking-widest transition-colors text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200`
- Same structure and padding as active
- `text-stone-500` light — passes WCAG AA on white background (per CLAUDE.md, `text-stone-400` is forbidden as foreground in light mode)
- `hover:text-stone-700` light — hover darkens text for feedback
- `dark:text-stone-400` dark — muted but readable on stone-900 background
- `dark:hover:text-stone-200` dark — hover brightens for feedback
- No background on inactive — transparent

---

#### What is removed

- The three floating text buttons (`<button className="text-xs uppercase tracking-widest font-medium text-stone-900">`) and their `text-stone-500` inactive counterparts
- The `·` dot separators (`<span className="text-stone-300">·</span>`) between options — the enclosure makes them redundant
- Any `font-medium` active-state-only class — the filled background replaces weight as the selection signal

#### What does NOT change

- `handlePeriodChange` function and its 120ms `setTimeout` / `isUpdating` debounce — unchanged, the pill buttons call the same handler
- `Period` type and `period` state — unchanged
- The Frequency section label above the pill group — unchanged

---

**Calma note:** Direct application of the Calma "chip / tag variant" at the selection control level — an enclosed pill group where the active option uses the primary button token. This makes the selected period unmistakable. The dots-as-separators pattern (a design quirk from an earlier sprint) disappears — its purpose was to suggest separation between choices that now have an explicit container.

Note: this matches the S1 proposal for the Settings Theme toggle. If both ship in the same sprint, the two segmented pills should look identical — one source of truth for the component would be ideal.

**Mockup:** [View mockup](./mockup-2026-03-15-0940.html#h4-period-pill)

**Effort estimate:** Low. Replaces the period selector block in `HistoryView.tsx:135–150`. No logic changes.

---

## Sprint recommendations

| Priority | Proposal | File(s) | Effort | Rationale |
|---|---|---|---|---|
| 1 | H1 — Date-as-weight calendar | `CalendarHeatmap.tsx` | Medium | Resolves the core GitHub resemblance problem. The most visible change on the page. Should be the centrepiece of any History sprint. |
| 2 | H3 — Frequency bar: taller + full-width | `FrequencyList.tsx` | Low | Two one-line changes that make relative differences legible. Trivial to ship alongside H1. |
| 3 | H4 — Period selector pill group | `HistoryView.tsx` | Low | Fixes an affordance gap flagged across two reports now. Can share a sprint with the Settings S1 Theme toggle — same pattern, same effort level. |
| 4 | H2 — Conditional year row | `CalendarHeatmap.tsx` | Low | Low urgency — most users won't have multi-year data yet. Worth doing before the one-year anniversary of any user's first entry. Can be bundled with H1 since both touch `CalendarHeatmap.tsx`. |

H1 and H2 both touch `CalendarHeatmap.tsx` and should be batched in the same pass.

H3 touches `FrequencyList.tsx` and H4 touches `HistoryView.tsx` — both trivial, appropriate for the same polish sprint.

---

## On the Ma Seasonal Tapestry proposal

The proposal is philosophically well-aimed. Its core argument — that colored squares make Clarity look like a developer productivity tool, and that typographic encoding would feel more personal and reflective — is correct, and H1 above implements exactly that in its simplest form.

The full 5-style system (Typographic Rhythm / Weave / Petals / Mist / Field) should not be implemented as specified. The reasons:

1. **User choice creates decision cost.** Presenting five visualization styles requires the user to evaluate and select one. Calma doesn't do configurability for its own sake — every option adds cognitive friction that needs to be justified. Five styles for the same data is not justified.

2. **Dynamic CSS classes break Tailwind's purge.** The Typographic Rhythm style requires per-cell `tracking-*` and `font-*` classes generated at runtime. Tailwind v4 can handle this via inline CSS, but it's a constraint worth naming. The Weave and Field styles would require inline SVG or Canvas rendering, which is significantly more complex.

3. **The philosophical goal is achievable with one style.** H1 does what the proposal wants — type carries data, no colored boxes, amber for joy — without asking the user to become a designer. The five-style system treats the visualization as a feature to be explored. H1 treats it as a quiet, considered design decision.

The Weave, Petals, Mist, and Field directions are genuinely interesting. They belong in the feature explorer backlog for a future sprint where the exploration is the point — perhaps a "seasonal themes" sprint that gives users a way to choose their visual personality. That's a different product bet than fixing the GitHub resemblance, and it shouldn't block the fix.

---

## Open questions

- **H1 and the sunset blend — resolved:** Three alternatives were explored and compared in `mockup-h1-blend-comparison.html`: (A) filled squares + blend (current), (B) circles + blend, (C) weight + amber. Circles break the GitHub square-grid association but the blend still produces teal at intermediate hue values — a color with no semantic home in Calma. Blend-as-typography was also explored (moving the blend from background fill to date number ink color) but the teal intermediate persists regardless of medium. The final direction — weight + amber with ghosted empty days — separates the two-axis reading onto orthogonal channels: weight carries habit completion, amber carries emotional presence. No blending, no teal, no information loss that matters for reflection.

- **H4 and HistoryView's `handlePeriodChange` debounce:** The 120ms `setTimeout` in `handlePeriodChange` (`HistoryView.tsx:53–57`) creates a brief `isUpdating` state that fades the frequency list. This pattern should survive the H4 change unchanged — the pill group calls the same handler.

- **Frequency section when empty:** Currently the `{entries.length > 0 &&}` guard prevents the Frequency section from rendering with no data. But when there IS data and a specific month is viewed that has no entries, the frequency list shows "Nothing logged in this period." The Frequency toggle still appears in this state, which makes the section feel like a dead end. Consider whether the toggle should be hidden when the current period has no data — or whether the empty state message is sufficient.
