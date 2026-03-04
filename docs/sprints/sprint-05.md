# Sprint 5 — History Redesign, Joy Section & Frequency List

**Dates:** 2026-02-28 – 2026-03-01
**Releases:** v2.0.1, v2.1.0, v2.1.1

---

## What was built

### Polish & UX cleanup (v2.0.1)
- **MomentChip** — renamed from `JoyTagChip`; component name now matches the data model language
- **SVG Chevron component** — all unicode arrows replaced with a consistent inline SVG component; no icon library dependency
- **Inline moment creation** — add a new moment directly from Today and Edit pages without leaving the form; validates for duplicate names
- **Archived habits in edit mode** — past entries that reference archived habits show them in a faded, non-interactive state
- **Help page** — new page explaining how Clarity works; accessible from Settings; BottomNav hidden (follows settings nav pattern)
- **Settings spacing** — inter-section spacing tightened; Reset promoted to its own top-level section
- **Style guide** — `docs/style-guide.md` added as a design reference (later superseded by the full Calma spec)
- **CHANGELOG.md** — created retrospectively, covering v1.0.0 through v2.0.0

### History redesign & Frequency list (v2.1.0)
- **Frequency list** — collapsible ranked list below the heatmap showing occurrence counts per UUID across a selectable period (Month / 3 Months / All Time); Month period tracks the viewed calendar month
- **Calendar filter** — tap any frequency list row to filter the heatmap to that item; non-matching days dim to 25% opacity; matching days use the exact sunset palette colour
- **One-time filter hint** — "Tap any item to filter the calendar" fades out permanently after first tap; persisted to `clarity-frequency-hint-seen`
- **Heatmap palette redesign** — sunset two-axis blend: habits → dusk blue (hsl 210), moments/joy → warm ember (hsl 23); axes blend proportionally when a day has both
- **Joy section** — dedicated reflective section appears between Moments and Reflection when at least one habit is marked done; BlossomIcon component (empty/filled SVG) replaces the inline heart button on HabitToggle
- **DayDetail scroll lock fix** — `useEffect` → `useLayoutEffect` so the overflow lock is always released synchronously on navigation

### Docs & content (v2.1.1)
- **Help page content** — condensed and refined; now includes heatmap colour explanations and filter instructions
- **Product strategy & UX analysis report** — added to `docs/`
- **GEMINI.md and code review report** — external review perspective added to `docs/`

---

## Retrospective

### What went well
- The Joy section landed cleanly because the v2.0 data model (done/joy as separate fields) had prepared the ground; the feature slotted in with minimal refactoring
- The frequency list + calendar filter is the most complex interactive feature in the app and shipped without regressions
- Bringing in an external code review (GEMINI.md) mid-sprint was a good quality gate; the observations fed into subsequent sprint decisions

### What could have been better
- Sprint 5 was substantially larger than any previous sprint — it ran across two days and produced three releases. The scope should have been split earlier (Sprint 5a / 5b was implicitly recognised in a commit message but never formally defined)
- The `useLayoutEffect` fix for DayDetail scroll lock was a bug from Sprint 2 that survived two sprints unnoticed; more systematic review of lifecycle hooks would have caught it sooner
- The style guide added in this sprint (`docs/style-guide.md`) was already partially out of sync with the actual implementation — notably, the section label pattern omitted `font-medium`, which then propagated into new components. The Calma design language doc (Sprint 6) superseded it, but the `font-medium` gap persisted in CLAUDE.md until the tooling audit in March.

### Lessons
Long sprints with multiple releases are hard to review cleanly in retrospect. Keeping a running notes file during the sprint (even just bullet points per session) would make retrospectives more accurate and surfaces blockers before they're forgotten.
