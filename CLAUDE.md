# Clarity — Project Guide

## What is Clarity?
A mobile-first Next.js habit tracker. Log daily habits, numbers, moments, and reflections once a day. Calm and minimal — no gamification, no streaks.

## Tech Stack
Next.js App Router · TypeScript strict · Tailwind CSS v4 · localStorage · Jest · GitHub Pages (`https://jblanper.github.io/clarity/`)

## Style & Vibes

> The full design language spec lives in **`docs/calma-design-language.md`** (system: Calma). Follow it for all new UI work. The notes below are a practical summary; the doc is the source of truth for palette, typography, spacing, interaction, and microcopy principles.

- **Typographic** — text-based navigation (← back, Settings), no icons or emojis.
- **Stone palette** — warm off-whites/near-blacks. No bright accent colours. See `globals.css`.
- **Section labels** — `text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500` everywhere. Must be reused for any new section.
- **Rounded UI** — `rounded-2xl` on interactive elements. `max-w-md`, `min-h-[44px]` touch targets.
- **Subtle interactions** — CSS transitions for hover/active states and layout changes (calendar slide, section reveals). No JS animation libraries. All transitions respect `prefers-reduced-motion`.
- Primary button: `bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900`.
- Secondary button: `border-stone-200 bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300`.

### Color-role hierarchy (WCAG AA, light theme)
| Role | Class |
|---|---|
| Primary text | `text-stone-800` / `text-stone-900` |
| Body / labels | `text-stone-700` |
| Nav links, arrows | `text-stone-600` (hover: `stone-800`) |
| Section labels, timestamps | `text-stone-500` |
| **Never in light mode** | `text-stone-400` — only OK as `dark:` variant |
| Errors | `text-red-700 dark:text-red-400` |

## Navigation Architecture

```
/           Today        BottomNav visible
/history    History      BottomNav visible
/settings   Settings     BottomNav hidden — back via sessionStorage + router.push()
/manage     Manage       BottomNav hidden — back via ← Settings link
/help       Help         BottomNav hidden — back via ← Settings link
/edit       Edit         BottomNav hidden — back via ← history link
```

- **Page headers** — `flex items-start justify-between`: title left, nav link top-right in `text-xs uppercase tracking-widest text-stone-600`.
- **Settings back** — caller writes `sessionStorage.setItem("settings-back", "/" | "/history")` before navigating; SettingsView reads it on mount and calls `router.push(backDest)`, never `router.back()`. Today sets `"/"`, HistoryView sets `"/history"`.
- **DayDetail → Edit** — `/edit?date=[date]`; on save redirects to `/history?open=[date]`; HistoryView auto-opens DayDetail then cleans the URL with `replaceState`.

## Project Structure
```
app/
  page.tsx / history / settings / manage   # server component shells
  edit/page.tsx                            # client component — reads ?date= query param
  globals.css / layout.tsx
components/
  CheckInForm.tsx    # today + edit mode (date? prop)
  HabitToggle.tsx / NumberStepper.tsx / MomentChip.tsx
  BlossomIcon.tsx    # SVG blossom for joy marking (empty / filled states)
  ManageView.tsx / SettingsView.tsx / HelpView.tsx / CalendarHeatmap.tsx
  FrequencyList.tsx  # ranked habit/moment count list with period selector and calendar filter
  DayDetail.tsx / BottomNav.tsx
lib/
  storage.ts         # saveEntry, getEntry, getAllEntries
  habitConfig.ts     # AppConfigs types, defaults, getConfigs(), saveConfigs()
  transferData.ts    # exportBackup, importBackup, parseImportFile
  habits.ts / theme.ts
  *.test.ts          # Jest unit tests
types/
  entry.ts           # HabitEntry, HabitState — data model source of truth
```

## Data Model
Types live in `types/entry.ts` (`HabitEntry`, `HabitState`) and `lib/habitConfig.ts` (`AppConfigs`, `HabitConfig`, `MomentConfig`).

| localStorage key | Contents |
|---|---|
| `clarity_entries` | Date-keyed map of HabitEntry records |
| `clarity-configs` | AppConfigs (habits + moments) |
| `clarity-theme` | `"light"` \| `"dark"` |
| `clarity-frequency-hint-seen` | `"true"` once the FrequencyList filter hint has been dismissed |

- **Habit values keyed by UUID**, not label. Sparse records — never store zeroes for untouched habits.
- **Default UUIDs** — stable hardcoded IDs (`00000000-...`): 1–4 boolean, 6–9 numeric, 11–14 moments. User-created items use `crypto.randomUUID()`.
- **Archived items** (`archived: true`) — kept in storage forever so historical UUIDs resolve correctly. Never delete a used config.
- **AppConfigs** — always read-modify-write via `getConfigs()` / `saveConfigs()`. No partial helpers.
- **Import** (`importBackup`) — merges entries (skips existing dates), **replaces configs entirely**.

## Key Implementation Notes

- **No dynamic routes** — static export means build-time routes only. Use query params + `window.location.search` in a `useEffect`. See `app/edit/page.tsx`.
- **Page components are server components** wrapping a single `"use client"` view. Never add interactivity to `app/` files (except `edit/page.tsx`).
- **Reading configs SSR-safely** — init `useState` with module-level defaults, then call `getConfigs()` inside a `useEffect` via `startTransition`. Avoids localStorage-during-SSR errors. Used in CheckInForm, DayDetail, CalendarHeatmap, ManageView.
- **Date handling** — build YYYY-MM-DD from `getFullYear()`/`getMonth()`/`getDate()`, never `toISOString()` (UTC offset bug).
- **Float precision** — use `Math.round((value + step) * 1000) / 1000` in steppers.
- **Avoid `useSearchParams()`** — requires `<Suspense>`. Read `window.location.search` directly in a `useEffect` instead.
- **sessionStorage for nav intent** — keeps URLs clean; survives round-trips without extra params.
- **Tailwind v4 dark mode** — class-based via `@custom-variant dark` in `globals.css`. `translate-x-*` can fail; use inline `style` or explicit `left-*` positioning.
- **Theme** — `public/theme-init.js` applies the class before first paint. `useIsDark()` in CalendarHeatmap uses a `MutationObserver` for runtime changes.
- **Heatmap palette** — "sunset" two-axis blend. `b` = fraction of boolean habits done (0–1); `y` = (joy count + moments count) / 6, capped at 1. Habits map to dusk blue (hsl 210), moments/joy map to warm ember (hsl 23). When both are non-zero the hue, saturation, and lightness are blended proportionally by weight. Empty/zero days use a muted stone tone.
- **HeatmapFilter** — exported type `{ type: "boolean-habit" | "numeric-habit" | "moment"; id: string }` from `CalendarHeatmap.tsx`. When set, non-matching cells drop to 25% opacity; matching cells use the exact palette colour for their type. Filter is owned by `HistoryView` state and passed to both `CalendarHeatmap` and `FrequencyList`.
- **FrequencyList** — collapsible section below the heatmap (toggle button). Counts occurrences per UUID across the selected period (`Period = "month" | "3m" | "always"`). The `"month"` period follows the calendar's currently viewed month via `viewedYear`/`viewedMonth` props (synced through `CalendarHeatmap`'s `onMonthChange` callback). Tapping a row sets or clears the `HeatmapFilter`. A one-time hint ("Tap any item to filter the calendar") fades out on first tap and is persisted to `clarity-frequency-hint-seen`.
- **DayDetail labels** — resolve by iterating the entry's UUIDs, not the config list, so archived and imported habits display correctly.
- **ManageView** — all inline editors are mutually exclusive via `closeAllEditors()`. Archive buttons use `text-amber-700` (reversible, not destructive).
- **Save flow** (CheckInForm) — three states: `idle → saving → confirmed`. `saveEntry()` deferred one tick so "Saving…" renders first. Redirects after 1200 ms.
- **Joy section** (CheckInForm) — appears between Moments and Reflection when at least one boolean habit is done. Lists done habits with `BlossomIcon` buttons to mark `joy` independently of `done`. `joyByDefault` on the config pre-fills joy when a habit is first toggled on. Factual logging (Habits) and emotional reflection (Joy) are intentionally separate moments in the form.
- **DayDetail scroll lock** — uses `useLayoutEffect` (not `useEffect`) for `document.body.style.overflow = "hidden"`. The layout-effect cleanup runs synchronously during the React commit, so the lock is never left behind when the user navigates away mid-animation.
- **`lib/habitConfig.ts` is the source of truth** for config. `lib/habits.ts` contains only `createEmptyEntry()` and should not grow.

## Microcopy & Tone
The words should feel as considered as the design — calm, human, never clinical.

- **Empty states** — inviting, never guilt-inducing. *"Nothing logged for this day yet"* ✅ / *"You missed this day"* ❌
- **Error messages** — calm and specific. *"That file doesn't look right — try exporting a fresh backup"*
- **Labels** — plain and human. *"Theme"*, *"Your data"*, not *"Appearance Settings"*
- **Save confirmation** — brief and unobtrusive. No modal, no fanfare.
- No exclamation marks. No all-caps except the `tracking-widest` section label pattern.

## Coding Standards
- Strict TypeScript — no `any`. Interfaces for all data structures.
- **Always `type="button"` on non-submit buttons** — `<button>` defaults to `type="submit"` inside a `<form>`. Applies to HabitToggle, MomentChip, NumberStepper, and any button inside CheckInForm.
- Small, focused functions. Named constants, no magic numbers. Comments only on non-obvious logic.
- Jest unit tests for all `lib/` utilities. UI testing not required.
- Mobile-first. No horizontal scrolling.
