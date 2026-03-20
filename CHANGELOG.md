# Changelog

## [v2.6.1] — 2026-03-20

### Fixes
- Layout: hardcoded `/clarity/` basePath prefix in `theme-init.js` script src — `strategy="beforeInteractive"` does not auto-prepend basePath, causing a 404 on GitHub Pages
- Layout: added `data-scroll-behavior="smooth"` to `<html>` to suppress Next.js smooth-scroll console warning

### Docs / Tooling
- Skills: added `/debug` skill for structured bug investigation workflow
- Audits: design-overall, microcopy, and triage audits post-Sprint 14
- Retros: Sprint 14 retrospective report

## [v2.6.0] — 2026-03-17

### Features
- **Typographic calendar** — filled-cell heatmap replaced with date-as-weight encoding; font weight encodes habit completion (ghost → light → normal → semibold → bold); amber text signals any joy or moment logged that day
- **Calendar legend row** — three labelled sample numbers ("no activity / active / joy") render below the grid, teaching the encoding inline
- **Conditional year row** — year navigation hidden for fresh accounts (fewer than 7 entries or single calendar year); year inlined into the month heading ("March 2026") when row is absent
- **SegmentedPill period selector** — Month · 3 Months · Always dot-button pattern replaced with the enclosed SegmentedPill component, matching the Settings pill pattern
- **Help discoverability link** — quiet "How Clarity works" link below the Capture button on Today for first-time users

### Fixes
- CalendarHeatmap: `mode="popLayout"` eliminates BottomNav layout jump on month change (iOS Safari)
- CalendarHeatmap: `border-color` flash below Journaling on navigation eliminated
- CheckInForm: Joy section enter animation restored (`initial={{ height: 0, opacity: 0 }}` on `m.section`)
- ManageView: `+ New` chip contrast raised to `text-stone-600` (WCAG AA)
- ManageView: moment chip edit-state contrast raised from `text-stone-400` to `text-stone-600` on `bg-stone-100` (WCAG AA)
- FrequencyList: bar width scale corrected to proportional 100% (was capped at 38%); bar track height raised to 4px
- HistoryView: empty-state message repositioned immediately below heatmap; Frequency section suppressed when no entries exist

### Docs
- Help page updated for typographic calendar encoding; numeric habits and import/reset documented
- Sprint-14 e2e spec added (62 tests)
- Audit docs refreshed (colour, typography, interaction, arch)

---

## [v2.5.1] — 2026-03-16

### Features
- ManageView: action tray card with pill buttons (Edit / Archive) per habit row
- ManageView: `+ New` chip and archived disclosure toggles (habits & moments)
- ManageView: resting habit row redesign with full-row tap target

### Fixes
- ManageView: SegmentedPill WCAG AA contrast on stone-100 background
- ManageView: height animation jump on inline form enter (INLINE_FORM_SHELL pattern)
- ManageView: animate moment edit card close and disabled chip state
- ManageView: tray/edit AnimatePresence `mode="wait"` to prevent counter-animations
- Settings: copy polish and touch target improvements

### Docs
- Calma spec: INLINE_FORM_SHELL pattern and `AnimatePresence mode="wait"` documented
- CLAUDE.md: height-jump fix token and mutually exclusive animated states token
- Audit docs refreshed; public calma-design-language.html synced
- Sprint-13 e2e spec added

---

## [v2.5.0] — 2026-03-15

### Features
- **ManageView section cards** — habits and moments now live inside rounded card containers (B1) for clearer visual grouping.
- **Full-row tap + action tray** — active habit rows are fully tappable, revealing an inline action tray with Edit and Archive actions (B2); moments use a chip grid with in-place label editing (B3).
- **Joy-by-default toggle** — per-habit pill tag in ManageView lets users enable `joyByDefault`, pre-filling joy when the habit is first toggled on each day (B4).
- **SettingsView redesign** — Settings page restructured into thematic sections (Account, Appearance, Data) with clearer hierarchy, updated copy for backup/restore/reset actions (S1–S4).

### Fixes
- **Settings copy** — backup, restore, and reset labels updated to match UX evaluation mockup language.

### Docs / Chore
- Sprint-12 brief, audit updates (arch, colour, interaction, microcopy, typography), Calma design language sync, e2e specs for sprint-12, and audit archive entry.

## [v2.4.0] — 2026-03-14

### Features
- **MomentChip amber selected state** — selected chips now render amber (bg-amber-50/border-amber-300/text-amber-800 light; bg-amber-900/20/border-amber-700/40/text-amber-300 dark), unifying the completion language with HabitToggle and NumberStepper.
- **DayDetail Highlights section** — joy-marked habits from a historical entry now surface as a dedicated "Highlights" section in the day detail sheet.
- **CheckInForm "Capture" label** — new-entry save button now reads "Capture" → "Capturing…" → "Day captured"; edit path retains "Save" / "Saving…" / "Saved".
- **CheckInForm polish** — add-moment input gains `min-h-[44px]` touch target; reflection textarea border softened to `border-stone-200` in light mode.

### Fixes
- **HistoryView** — Frequency toggle no longer appears when there are no entries (removes confusing dead UI for new users).

### Docs
- Sprint 11 brief and implementation doc added.
- Audit files updated and archived (2026-03-14 snapshots).
- Retro report updated and archived (2026-03-14).
- Calma design language updated; HTML export refreshed.
- CLAUDE.md updated with amber language tokens.

## [v2.3.1] — 2026-03-13

### Tooling

- **`/sprint-pipeline` skill** — new orchestrator skill that reads pre-flight tier and brief/doc Status fields to display the tier-appropriate pipeline (Tier 1: 11 phases, Tier 2: 10, Tier 3: 5), marks the current position with ▶, and offers to advance with human approval at each checkpoint.
- **Scoped reads** — `sprint-validate`, `sprint-qa`, and `sprint-plan` SKILL.md files updated to read only the sections each skill needs (Goal → Definition of done, not the full appended doc).
- **Task template gotchas field** — `sprint-plan/template.md` now includes a `Gotchas / edge cases` subsection between Files and Implementation notes.

### Tests

- **e2e baseline** — verified full Playwright suite passes against a live dev server; Sprint 8 touch-target tests confirmed working with Sprint 9 control shapes.

## [v2.3.0] — 2026-03-13

### Features

- **HabitToggle full-row tap** — the entire row is now a single `<button>` with an amber row wash when done, replacing the pill + separate hit-area approach.
- **NumberStepper tap-to-increment pill** — tapping the value pill increments by one step; long-tap still opens the inline stepper.
- **ManageView `startAt` field** — numeric habits expose a "Start at" input so users can set an initial value other than zero.
- **WCAG + touch-target fixes** — additional touch-target and colour-contrast corrections identified in the Sprint 9 audit.

### Tooling

- Added Playwright e2e suite for Sprint 9 (144/144 passing).
- New UX skills: `clarity-feature-explorer`, `ux-radical-evaluation` (with calm-research corpus and mockup pipeline).

## [v2.2.0] — 2026-03-08

### Improvements

- **Touch targets** — HabitToggle, NumberStepper, MomentChip, and CalendarHeatmap year-nav buttons all meet the 44×44px minimum. HabitToggle uses a transparent hit-area wrapper so the visual pill stays compact while the tap target is full-height.
- **Typography & colour** — reflection textarea uses `font-light`; SettingsView section labels gain `font-medium`; ManageView numeric unit label raised to `text-stone-500`; DayDetail date heading changed to `text-base tracking-widest`; Edit link styled as a nav-link (uppercase, tracked, stone-600).
- **History empty state** — new message ("Your days will appear here once you start logging.") shown below the heatmap when no entries exist.
- **Microcopy** — developer vocabulary eliminated from the UI: "Boolean" → "Yes / No", "Numeric" → "Number", "Step" → "Increment". Error and import copy in SettingsView and transferData rewritten to plain English. Moment input placeholder updated to "e.g. Morning light". Back button in Settings is context-aware ("← Today" / "← History").
- **Animation** — FrequencyList bar animation switched from `width` to `scaleX` (reflow-free). Press states on joy blossom use `active:opacity-70` instead of `active:scale-90`.
- **Joy icons** — ManageView `joyByDefault` toggle uses `BlossomIcon` instead of Unicode ♥/♡.

### Fixes

- Corrected "Step" → "Increment" in ManageView add-habit form (had been missed in the initial pass).

### Tooling

- Added Playwright regression suite for Sprint 8 (touch targets, typography, microcopy).
- Updated Calma spec: active press state rule (opacity, not scale) and navigation label microcopy pattern.
- Updated CLAUDE.md: permitted animation properties, HabitToggle touch-target pattern, `replace_all` verification rule, JSX unescaped-entities rule.

## [v2.1.5] — 2026-03-06

### Fixes

- Fixed WCAG AA contrast failures across ManageView, SettingsView, DayDetail, CheckInForm, HelpView, and HistoryView — all `text-stone-400` foreground uses in light mode raised to `text-stone-500`
- Added `font-medium` to every section label (`h2`/`h3`) in all six views
- Replaced Unicode ♥ joy indicator in DayDetail with the custom BlossomIcon
- Added `prefers-reduced-motion` guard for DayDetail backdrop and sheet CSS transitions
- Fixed FrequencyList scroll-position jump on collapse (synchronous scroll + two-phase exit animation)
- Fixed Joy section height snap when removing a habit item (animated height with padding fix)
- Fixed scrollbar layout shift when FrequencyList opens (`overflow-y: scroll` on `html`)
- Fixed archived habit/tag label contrast in dark mode (ManageView)
- Fixed ManageView header spacing (`mb-2 → mb-6`) to match other pages
- Fixed `mb-1 → mb-3` spacing below Habits and By the Numbers labels in CheckInForm
- Added `font-light` to HelpView body copy (reflective body role)

### Tooling

- Added Playwright regression suite (54 tests, chromium desktop + mobile)
- Scoped Jest `testMatch` to `lib/` to prevent conflict with Playwright spec files
- Updated Calma spec with two new documented patterns: read-only filled icon usage and two-phase exit animation for collapsible sections

## [v2.1.3] — 2026-03-02

### Improvements
- **Motion library** — replaced custom CSS/setTimeout animation orchestration with the `motion/react` library (`LazyMotion + domAnimation`, ~17 KB). All height reveals, directional slides, and exit animations now use `AnimatePresence` and `m.*` components. `MotionConfig reducedMotion="user"` centralises reduced-motion support across the entire app.
- **Animation polish** — fixed a visual snap at the end of close animations in ManageView (habit/moment edit forms) and CheckInForm (joy section, add-moment form). Root cause: `box-sizing: border-box` does not collapse `py-*` padding when `height: 0`; padding and margin now animate to zero in sync with height.
- **Calendar direction** — fixed a stale-closure bug where reversing navigation direction (← then →) caused the exit animation to slide the wrong way. Resolved by using named `variants` with `custom` prop on `AnimatePresence`, which forwards the current direction value to the exiting element at animation time.

## [v2.1.2] — 2026-03-01

### Improvements
- **History page animations** — calendar month navigation slides left/right with a heading crossfade; frequency section expands and collapses smoothly using a `grid-template-rows` transition (no max-height dead zone); frequency chevron rotates on open/close; heatmap and frequency list briefly dim when switching time periods; frequency bars grow from zero on period change. All transitions respect `prefers-reduced-motion`.
- **Chevron component** — extended to support all four directions (`up`, `down`, `left`, `right`) via a single SVG polyline with CSS rotation; optional `size` prop added. Unicode arrows removed from HistoryView and ManageView.
- **Favicon** — replaced the default Next.js favicon with a minimal amber dot SVG.
- **Docs** — CLAUDE.md and README.md updated to reflect the frequency list, calendar filter, inline moment creation, and the correct localStorage key count.

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
