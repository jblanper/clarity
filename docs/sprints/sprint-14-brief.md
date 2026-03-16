# Sprint 14 Brief

**Status:** reviewed
**Created:** 2026-03-16

---

## Goals & Business Value

Replace the GitHub-vocabulary filled-cell heatmap with a typographic, date-as-weight calendar that fits Clarity's ink-on-paper identity. Weight and amber carry the data signal; no filled backgrounds, no colour blending, no teal. Clean up the History navigation for first-time users (year row hidden by default, empty-state message repositioned), tighten the frequency bar proportions, and unify the period selector with the Settings segmented pill pattern. Also close the outstanding High audit finding (empty-state/Frequency ordering) and add the long-deferred `createEmptyEntry` unit test.

---

## Proposed scope

- **H1 — Date-as-weight calendar** (`CalendarHeatmap.tsx`)
  Remove all filled cell backgrounds. Each day renders only its date number. Two independent channels:
  - Font weight encodes habit completion: ghost (no data) → `font-light` → `font-normal` → `font-semibold` → `font-bold`
  - Amber colour fires for any joy or moment logged (replaces stone on those days)
  - Future days: dimmed at opacity-30
  - Selected day: `rounded-full bg-stone-100 dark:bg-stone-800` circle behind the number (per mockup)
  - No teal, no blending; the two-axis heatmap colour system is replaced by this simpler, typographic encoding

- **H2 — Conditional year row** (`CalendarHeatmap.tsx` / `HistoryView.tsx`)
  Hide the year navigation row when data spans fewer than 12 months; inline the year into the month label ("March 2026"). Year row reappears once the user has 12+ months of data. Exact threshold definition is an open question for UX review.

- **H3 — Frequency bar refinement** (`FrequencyList.tsx`)
  Two changes only: `barWidth * 38` → `* 100` (proportional to highest item), bar height `h-0.5` → `h-1`. No count labels added.

- **H4 — Period pill group** (`FrequencyList.tsx`)
  Replace the dot-separated floating text buttons (Month · 3 Months · Always) with an enclosed `SegmentedPill` component. Reuses the existing component already used in SettingsView; no new component needed.

- **High audit fix — HistoryView empty-state** (`HistoryView.tsx`)
  When `entries.length === 0`: suppress the Frequency section entirely (toggle + contents do not render); move the empty-state `<p>` immediately below the heatmap so it reads as the calendar's own empty state.

- **`createEmptyEntry` unit test** (`lib/habits.test.ts` or similar)
  Add a named unit test for `createEmptyEntry` — carry-forward since Sprint 11.

---

## Out of scope

- Deferred Low audit findings (CalendarHeatmap dark labels, ManageView/SettingsView touch targets, microcopy rewrites, visual consistency items)
- Calma spec nav-link hover exception documentation (Medium — separate docs-only change, low urgency)
- Any new data model changes or new routes

---

## Open questions

**For UX review:**

1. **H2 threshold** — What is the correct condition for showing the year row? Options: (a) 12+ distinct calendar months in the entries data, (b) the oldest entry date is more than 11 months ago, (c) entries span more than one calendar year. Which is most intuitive for the user?

2. **H1 + HeatmapFilter interaction** — Currently tapping a FrequencyList row sets a `HeatmapFilter` that dims non-matching cells to 25% opacity. With the new date-as-weight encoding, how should filtering be expressed? Options: (a) dim the date number to low opacity on non-matching days, (b) keep the number at full weight/colour but add a subtle background wash on matching days, (c) a different signal entirely.

**For Arch review:**

3. **H1 selection state** — Mockup specifies `bg-stone-100 dark:bg-stone-800` circle behind the selected date number. Confirm this is the right implementation token and that it doesn't conflict with the new ghost-day colour (light `hsl(25,5%,84%)` — which is close to stone-200, not stone-100).

4. **H1 CalendarHeatmap refactor scope** — The existing heatmap renders via a two-axis colour blend (`b` + `y` values → hsl). H1 replaces this entirely with weight + amber. Confirm which parts of the colour computation can be removed and what, if anything, from the existing system should be preserved (e.g. for dark mode).

---

## Audits to run

colour · typography · interaction · design-overall

---
---

## UX Review

**Reviewer:** UX Radical Evaluation
**Source:** `docs/ux-radical-evaluation/ux-radical-evaluation-2026-03-15-0940.md` (prior evaluation that originated this brief)

### Calma fit
H1 (date-as-weight) is Calma's typographic primacy principle applied correctly — type carries data, no infographic filled squares, amber signals emotional presence. H2–H4 are housekeeping consistent with identity. No gamification risk anywhere in scope.

### User flow
- Empty state fix (High audit): correct placement below the heatmap. Existing copy ("Your days will appear here once you start logging.") is fine in the new position.
- H2 conditional year row: year hidden by default; inline year in month heading ("March 2026") when row is absent. Year row reappears once threshold is met.
- H4 period selector: SegmentedPill replaces floating dot-separated buttons — clean, no flow ambiguity.
- H1 filter interaction: `opacity-25` on the outer button when `isFilteredOut` — unchanged from current behavior, explicitly preserved.

### Component and pattern reuse
- `CalendarHeatmap.tsx`: `computeCellColor` removed entirely; replaced by `computeCellStyle`. `activeHabitCount` kept (needed to normalise weight scale). `isDark` hook and `useIsDark()` unchanged.
- `FrequencyList.tsx`: two one-line property changes (H3). SegmentedPill for period selector (H4) — already proven in SettingsView.
- `HistoryView.tsx`: DOM reorder only for empty-state fix.
- No new components needed.

### Interaction and motion
No new Framer Motion work. Year row reveal/hide is **instant** — data-state transition, not user action. All other animations unchanged.

### Legend row
A legend renders immediately below the calendar grid. Three labels displayed in the actual cell colors and weights: ghost = no activity, bold = active, amber = joy. Teaches the encoding inline without additional chrome. **In scope.**

### Audit relevance
- **Colour:** New amber encoding, ghost-day opacity, selected-state circle contrast vs ghost days, removal of orphaned HSL constants.
- **Typography:** Weight scale legibility (5 levels) at phone size; bar height bump; year-label inline year format; legend row typography.
- **Interaction:** Filter opacity on new weight-only encoding; year-row layout stability; SegmentedPill in FrequencyList context.
- **Design-overall:** M1 empty-state fix verified; overall cohesion under weight-based model.

---

## Architecture Review

**Reviewer:** Senior Architect

### Technical feasibility
- **H1:** Straightforward. ~20 lines new logic, ~40 lines removed. No grid, nav, or filter logic changes.
- **H2:** Non-trivial — depends on threshold decision (resolved below). Once condition is clear, ~5 lines.
- **H3:** Straightforward. Two isolated property changes.
- **H4:** Straightforward. SegmentedPill swap, ~15 lines JSX.
- **High audit fix:** Straightforward. JSX reorder, ~5 lines.
- **H6 (`createEmptyEntry` test):** Straightforward. ~10 lines.

### Data model impact
None. No new localStorage keys, no type changes, no migration paths.

### Static export constraints
All satisfied. No dynamic routes, no new server-side logic, no new dependencies.

### Codebase degradation signals
CalendarHeatmap shrinks after H1 (~40 lines deleted). H6 closes the last `lib/` test coverage gap from Sprint 13. No pattern drift.

### Implementation order
H6 → H3 → H4 → H2 → H1 (H1 and H2 batch together in the same CalendarHeatmap pass once H2 threshold is confirmed).

### Pre-work
- Grep for `HABIT_LIGHT`, `MOMENT_LIGHT`, and related HSL constants before deleting — confirm no external references outside `CalendarHeatmap.tsx`.
- Confirm `activeHabitCount` prop is preserved (needed for weight normalisation).

---

## Parallel Review Mediation

**Reviewed:** 2026-03-16

### Conflicts resolved

| Topic | UX position | Arch position | Decision |
|---|---|---|---|
| H2 year-row threshold | Option (c): spans >1 calendar year — simplest to reason about | Option (a): 12+ distinct calendar months — most data-aware; sparse cross-year data would trigger (c) prematurely | **(c) with 7-entry guard** — year row shows only when data spans more than one calendar year AND `entries.length >= 7`. Prevents early-use false trigger. Implementation: `currentYear - earliestYear >= 1 && entries.length >= 7`. |
| H1 + HeatmapFilter visual | Opacity dimming may be insufficient without filled backgrounds | Try opacity first; escalate to text-colour shift if QA fails | **Opacity dimming confirmed** — `isFilteredOut ? "opacity-25" : ""` on the outer button, unchanged from current behavior. No new design question. |
| Legend row | Prior eval proposed inline legend below grid (ghost/bold/amber labels in actual cell colors) | Not flagged | **In scope.** Three labels in actual cell colors and weights, `mt-2` below the grid. |

### Final scope after review

- **H1 — Date-as-weight calendar** (`CalendarHeatmap.tsx`) — remove filled backgrounds; weight encodes habit completion (ghost/light/normal/semibold/bold); amber fires on any joy or moment; `opacity-25` filter behavior unchanged; `computeCellStyle` replaces `computeCellColor`; legend row below grid.
- **H2 — Conditional year row** (`CalendarHeatmap.tsx`) — show year row only when `currentYear - earliestYear >= 1 && entries.length >= 7`; inline year in month heading when row is hidden.
- **H3 — Frequency bar refinement** (`FrequencyList.tsx`) — `barWidth * 38` → `* 100`; `h-0.5` → `h-1`.
- **H4 — Period pill group** (`FrequencyList.tsx` / `HistoryView.tsx`) — SegmentedPill replaces dot-separated buttons.
- **High audit fix — HistoryView empty-state** (`HistoryView.tsx`) — suppress Frequency section when `entries.length === 0`; move empty-state `<p>` immediately below heatmap.
- **H6 — `createEmptyEntry` unit test** (`lib/habits.test.ts`) — carry-forward from Sprint 11.
- **Design intent note:** The two-axis colour blend (Dusk Blue × Warm Ember) is intentionally retired. Weight carries structural habit completion; amber carries emotional presence. The two channels are orthogonal, not blended. Captured in commit message; no Calma spec update required.
