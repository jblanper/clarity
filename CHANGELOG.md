# Changelog

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

## [v1.0.1] — 2026-01-??

### Fixes & improvements
- Replaced dynamic `/edit/[date]` route with `/edit?date=` query param for compatibility with static export
- Settings back navigation uses `sessionStorage` instead of URL params, keeping URLs clean
- BottomNav hidden on `/settings`, `/manage`, and `/edit` pages
- Deployed to GitHub Pages via GitHub Actions

---

## [v1.0.0] — 2026-01-??

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
