# Sprint 1 — Foundation

**Dates:** 2026-02-25
**Releases:** pre-release (no tag)

---

## What was built

The initial working app in a single session. Starting from a blank Next.js scaffold, the sprint delivered a usable product:

- **Check-in form** — boolean habits, numeric habits with a stepper, free-text reflection
- **Settings page** — theme toggle (dark/light), export to JSON, import from JSON backup
- **Export/import** — full localStorage backup and restore via file download/upload
- **CLAUDE.md** — initial project guide with context, style, and implementation notes

The app was functional but had a flat data model (`boolean` habit values keyed by label string, no UUIDs) and no History page.

---

## Retrospective

### What went well
- A complete, deployable feature set landed in a single session — proof that a narrow scope and a clear brief produces fast results
- Export/import was built from the start, before there was any real data to lose; good defensive instinct

### What could have been better
- Habit values keyed by label rather than UUID made migration painful in Sprint 3; the UUID model should have been the starting point
- No History page meant the app had no way to review past entries — core to the product's value proposition and should have been Sprint 1 scope

### Lessons
Start with the data model. Changing the shape of stored data after users exist is the most expensive refactor a small app can face.
