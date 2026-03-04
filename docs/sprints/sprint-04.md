# Sprint 4 — Deployment & v2.0 Data Model

**Dates:** 2026-02-27 (later)
**Releases:** v1.0.0, v1.0.1, v2.0.0

---

## What was built

### Deployment (v1.0.0 → v1.0.1)
- **GitHub Pages** — static export via `next export`; GitHub Actions workflow for automated deployment to `https://jblanper.github.io/clarity/`
- **Static export fix** — replaced dynamic `/edit/[date]` route with `/edit?date=` query param; dynamic routes require `generateStaticParams` for static export and using a query param avoids the constraint entirely
- **README** — project overview and setup instructions

### v2.0 data model (v2.0.0)
- **`HabitState`** — habit values changed from `boolean` to `{ done: boolean; joy: boolean }`, separating completion from emotional reflection
- **Moments** — renamed from "joy tags"; now a first-class data type (array of moment UUIDs in `HabitEntry`)
- **HabitToggle** — upgraded to three-state (off / done / done+joy); heart button removed in later sprint when Joy section replaced it
- **All components updated** — CheckInForm, DayDetail, ManageView, SettingsView, CalendarHeatmap all migrated to v2.0 model
- **Factory reset** — Settings now includes "Reset to factory defaults" (clear all entries, restore defaults)
- **Settings navigation polish** — back button moved to top-right; Manage link arrow inline with text

---

## Retrospective

### What went well
- Three releases shipped in a single day — the deployment setup was straightforward once the static export constraint was understood
- The v2.0 data model change (done + joy as separate fields) was the right abstraction; the Joy section built in Sprint 5 slots directly into this model
- GitHub Actions workflow has been zero-maintenance since setup

### What could have been better
- The dynamic route issue (`/edit/[date]` failing static export) was only discovered at build time, not during development — a gap that caused friction. Now encoded in CLAUDE.md and the deploy skill catches it proactively
- CLAUDE.md's note about `generateStaticParams` was added reactively after the failure rather than before

### Lessons
Static export constraints are invisible during `next dev`. Always run `npm run build` after adding or modifying any route. This is now in CLAUDE.md and enforced by the `PostToolUse` hook.
