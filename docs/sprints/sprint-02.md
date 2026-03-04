# Sprint 2 — History, Theming & Navigation

**Dates:** 2026-02-26
**Releases:** pre-release (no tag)

---

## What was built

- **Dark/light theme system** — class-based (`.dark` on `<html>`), applied before first paint via `public/theme-init.js` to prevent flash; `useTheme()` hook; persisted to `clarity-theme` in localStorage
- **History page** — calendar heatmap with month/year navigation; cells coloured by habit completion and joy intensity
- **DayDetail** — bottom sheet overlay showing a past day's full entry; scroll lock via `useEffect`
- **Edit mode** — `CheckInForm` receives an optional `date?` prop to pre-fill and edit past entries
- **BottomNav** — Today / History tab bar wired into the root layout
- **UI polish** — DayDetail centering, larger nav arrows, smart back in Settings
- **WCAG AA contrast** — fixed light-theme text failing 4.5:1 minimum (stone-400 as foreground)
- **Calendar sizing** — enlarged cells, labels, and arrows for better legibility

---

## Retrospective

### What went well
- The heatmap and DayDetail came together quickly and established the visual identity of the app — the heatmap is still the signature element in v2.1
- Theme system was solid from the start; no regressions across subsequent sprints

### What could have been better
- WCAG AA contrast violations were caught at the end of the sprint rather than during development; the stone-400-as-foreground mistake would recur in later sprints (ManageView, SettingsView) because CLAUDE.md didn't encode the rule clearly enough
- `useEffect` for DayDetail scroll lock was the wrong hook — the scroll lock was occasionally left behind on fast navigation; this wasn't caught until Sprint 5 (`useLayoutEffect` fix in v2.1.0)

### Lessons
Encode design constraints in CLAUDE.md the moment they're established, not after a violation is caught. The stone-400 rule existed from the beginning but wasn't written down, which caused it to be violated repeatedly across four later components.
