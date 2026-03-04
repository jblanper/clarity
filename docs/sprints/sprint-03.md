# Sprint 3 — UUID Data Model & Manage Page

**Dates:** 2026-02-27 (early)
**Releases:** pre-release (no tag)

---

## What was built

- **New data model** — habit values keyed by stable UUID instead of label string; sparse records (no zeroes stored for untouched habits); export/import updated for the new shape
- **UUID migration** — all components migrated: CheckInForm, DayDetail, CalendarHeatmap, SettingsView
- **DayDetail label resolution** — labels now resolved dynamically by iterating the entry's UUIDs, not the config list, so archived and imported habits always display correctly
- **Manage page** — habit customisation (add, rename, archive, restore) moved from Settings into a dedicated `/manage` route; all inline editors mutually exclusive via `closeAllEditors()`
- **sessionStorage back-nav** — Settings back navigation switched from URL params to `sessionStorage`, keeping URLs clean across round-trips
- **Save flow** — three-state button (`idle → saving → confirmed`); `saveEntry()` deferred one tick so "Saving…" renders before the write; redirects after 1200 ms
- **Form button fix** — all non-submit buttons inside CheckInForm given `type="button"` to prevent accidental form submission

### Notable bugs caught
- Form buttons were defaulting to `type="submit"` inside `<form>`, causing the check-in to save unexpectedly when interacting with steppers or tag chips
- Back navigation initially used `router.back()` which broke when Settings was opened from History — fixed by reading `sessionStorage` and calling `router.push()` with the correct destination

---

## Retrospective

### What went well
- The UUID migration was comprehensive — every component updated in a single sprint with no regressions
- The `type="button"` rule, once discovered, was immediately codified in CLAUDE.md as a standing requirement
- The save flow three-state is still the exact implementation in v2.1 — it was right the first time

### What could have been better
- The `router.back()` → `sessionStorage` bug required a second pass; the edge case (Settings opened from two different pages) should have been considered in the first implementation
- The form button submission bug was a subtle default browser behaviour that wasn't caught until a user interaction revealed it; a brief note in CLAUDE.md from Sprint 1 would have prevented it

### Lessons
Browser form defaults (`type="submit"`) are a footgun in React. Encoding `type="button"` as a hard rule in CLAUDE.md from the start of any form-heavy sprint prevents a class of hard-to-debug bugs.
