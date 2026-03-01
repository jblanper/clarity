# Changelog

## [v2.1.1] — 2026-03-01

### Improvements
- **Help page update** — content condensed and refined for better flow and tone; now includes specific details on heatmap coloring (Dusk Blue for habits, Warm Ember for joy/moments) and pattern filtering.
- **Documentation** — added a new `docs/help.md` file with the refined help content for easier reference.
- **A Place for Clarity** — renamed the introductory section of the Help page to better reflect the app's reflective nature.

### Fixes
- **Functional Clarity** — help content now explicitly mentions the ability to edit past entries from the history page and how archiving preserves historical data.

## [v2.1.0] — 2026-03-01

### New features
- **Joy section** — a dedicated reflective section appears between Moments and Reflection whenever at least one boolean habit is marked done. Each done habit gets a blossom button to mark it as joyful, separating factual logging (did I do this?) from emotional reflection (did it feel good?).
- **BlossomIcon** — new SVG component with empty (stroke-only, stone) and filled (amber) states; replaces the inline heart button that was part of HabitToggle.
- **Frequency list** — collapsible ranked list below the history heatmap showing how often each habit, numeric habit, and moment was logged. Period selector: Month (tracks the viewed calendar month), 3 Months, All Time.
- **Calendar filter** — tap any row in the frequency list to filter the heatmap to that single item. Non-matching days dim to 25 % opacity; matching days use the exact sunset palette colour. Tap again to clear.
- **One-time filter hint** — a prompt ("Tap any item to filter the calendar") appears on first use of the frequency list and fades away permanently after the first tap.

### Changes
- **Heatmap palette** redesigned to a sunset two-axis blend: habits map to dusk blue (hsl 210), moments and joy to warm ember (hsl 23); both axes blend proportionally when a day has entries in both categories.
- **HabitToggle** simplified: heart button removed. Joy is now captured in the dedicated Joy section; the toggle switch is the only interactive element.

### Fixes
- **DayDetail scroll lock** — `body.overflow` management moved from `useEffect` to `useLayoutEffect` so the lock is always released synchronously on navigation, preventing the Today page from being left non-scrollable.
- **Frequency hint flash** — the one-time hint no longer flickers on first mount.

---

## [v2.0.1] — 2026-02-28

### Improvements
- **Help page** — new page explaining how Clarity works, covering habits and moments, the joy layer, numeric habits, history, data storage, and design philosophy; accessible from Settings
- **Settings section order** — sections now appear in the sequence: Manage, Theme, Your Data, Help, Reset
- **Reset promoted** — Reset to factory defaults is now its own top-level section in Settings rather than a subsection of Your Data
- **BottomNav hidden on Help** — the Help page follows the same navigation pattern as Settings and Manage: back link top-right, no bottom navigation bar
- **Spacing refinements** — inter-section spacing adjusted on both the Settings and Help pages

---

## [v2.0.0] — 2026-02-28

### New features
- **Three-state habit toggle** — habits now track both completion (`done`) and whether they brought joy (`joy`), independent of each other
- **Moments** — renamed from "joy tags"; the Moments section now participates equally in the heatmap joy signal alongside joyful habits
- **Inline moment creation** — add a new moment directly from the Today and Edit pages without leaving the form; validates for duplicates
- **Archived items in edit mode** — when editing a past entry, archived habits and moments that have recorded data for that day are shown in a faded, non-interactive state
- **Factory reset** — Settings now includes a "Reset to factory defaults" option that clears all entries and restores default habits and moments
- **SVG chevrons** — all navigation arrows replaced with a consistent inline SVG `Chevron` component (no icon library dependency)
- **Edit page header** — day name rendered as a large `h1` and full date as a muted subtitle, matching the Today page typography hierarchy
- **Settings navigation** — back button moved to the top-right corner; "Habits and moments" link has the arrow sitting inline with the text

### Data model changes
- `HabitEntry.habits` values changed from `boolean` to `{ done: boolean; joy: boolean }` (`HabitState`)
- `HabitEntry.moments` is now an array of moment UUIDs (previously `joyTags`)
- Heatmap colour blend updated: blue scales with habit completion, amber scales with joy signals (joyful habits + moments)

---

## [v1.0.1] — 2026-02-27

### Fixes & improvements
- Replaced dynamic `/edit/[date]` route with `/edit?date=` query param for compatibility with static export
- Settings back navigation uses `sessionStorage` instead of URL params, keeping URLs clean
- BottomNav hidden on `/settings`, `/manage`, and `/edit` pages
- Deployed to GitHub Pages via GitHub Actions

---

## [v1.0.0] — 2026-02-27

### Initial release
- **Daily check-in form** — boolean habits, numeric habits, moments, and a free-text reflection
- **History** — calendar heatmap with month/year navigation; cells coloured by habit completion and joy intensity
- **Day detail** — bottom sheet with a past day's summary and an Edit link
- **Edit past entries** — pre-filled check-in form; stamps `lastEdited` on save
- **Habit customisation** — add, rename, archive, and restore habits and moments from a dedicated Manage page
- **Dark/light theme** — user-selected, applied before first paint to prevent flash
- **Export / Import** — download all entries as JSON; restore from backup (existing dates preserved)
- **UUID-based data model** — stable default IDs; archived configs preserved so historical entries always resolve
- **WCAG AA contrast** — all light-theme text meets 4.5:1 minimum contrast ratio
- **Static export** — deployed to GitHub Pages at https://jblanper.github.io/clarity/
