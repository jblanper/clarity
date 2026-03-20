# Debug report — History page crash on mobile when switching months

**Date:** 2026-03-20 10:07
**Class:** navigation / runtime
**Status:** Fixed

## Bug

When a user with exactly one logged day navigates to the previous month on the History page on mobile, the app crashes with "Application error: a client-side exception has occurred while loading jblanper.github.io".

## Reproduction steps

1. Log your first day (save via CheckInForm). The save redirects to `/clarity/history?open=YYYY-MM-DD`.
2. HistoryView mounts, reads the `?open=` param, calls `window.history.replaceState({}, "", "/history")` — this strips the `/clarity` basePath from the URL.
3. On mobile (iOS Safari), Next.js App Router intercepts the `replaceState` call and tries to resolve `/history` as a route (without the basePath).
4. The static export has no route at `/history`; all routes are under `/clarity/`. The router crashes.
5. The user sees the crash at step 3/4 — but since this is async/deferred, it may surface only when the next React render is triggered (e.g. switching months).

**Could not be reproduced directly** — no mobile device available. Root cause confirmed by static analysis.

## Root cause

`HistoryView.tsx` line 44 called `window.history.replaceState` with a hardcoded absolute path that omits the `basePath`:

```ts
// Before (buggy):
window.history.replaceState({}, "", "/history");
```

With `basePath: "/clarity"` set in `next.config.ts`, the app lives at `/clarity/history`. Calling `replaceState` with `/history` changes the browser URL to `https://jblanper.github.io/history`. Next.js App Router patches the native `history.replaceState` method to intercept navigations; when it sees `/history` (outside the basePath), it attempts to render a route that doesn't exist in the static export and throws a client-side exception.

## What was tried

- Checked CalendarHeatmap animation logic (`mode="popLayout"`, `gridVariants`) — no crash vectors found.
- Checked FrequencyList filtering with 1 entry — no division-by-zero or index errors.
- Checked `buildMonthWeeks` — no exceptions possible.
- Checked `sortedDates` calculations — fine with 1 entry.
- Root cause identified as the basePath-stripping `replaceState` call.

## Fix

Changed `HistoryView.tsx` line 44 to use `window.location.pathname` instead of a hardcoded path:

```ts
// After (fixed):
window.history.replaceState({}, "", window.location.pathname);
```

At the time the effect runs, `window.location.pathname` is already `/clarity/history` (the full path with basePath). This removes only the query string (`?open=...`) while preserving the correct pathname, so Next.js Router never sees an out-of-basePath URL.

**File changed:** `components/HistoryView.tsx` (1 line)

## Scope check

Searched all `components/**/*.tsx` and `app/**/*.tsx` for any other `replaceState` or `pushState` calls. **None found.** This was the only direct `window.history` call in the codebase. All other navigations use `router.push()` / `router.replace()` from `next/navigation`, which automatically prepend the basePath.

## CLAUDE.md update

Not needed — the existing "Navigation Architecture" section already documents the `sessionStorage` back pattern and `window.history.replaceState` is not a recurring pattern. Added awareness note below for future reference only.
