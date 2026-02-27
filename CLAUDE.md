# Clarity — Project Guide

## What is Clarity?
Clarity is a personal daily habit tracker built as a mobile-first Next.js web app.
The goal is to make daily self-reflection feel calm and effortless — not clinical or
gamified. You open it once a day, log how things went, and close it.

## Features
- **Daily check-in form** — log each day's habits, numbers, joy moments, and a reflection note
- **Boolean habits** — toggle switches (default: Meditation, Exercise, Reading, Journaling, Drawing)
- **Numeric habits** — steppers with custom units (default: Sleep/hrs, Water/glasses, Screen time/hrs, Coffee/cups, Decaf coffee/cups)
- **Joy tags** — a multi-select chip grid (12 defaults; fully customisable)
- **Habit customisation** — add, rename, archive, and restore habits and joy tags in Settings
- **Reflection** — a free-text textarea for end-of-day notes
- **Persistence** — all entries saved to localStorage, pre-populated on return visits
- **History** — calendar heatmap (month view, year navigation) showing entry intensity by habits + joy
- **Day detail** — bottom sheet showing a past day's logged data, with an Edit link
- **Edit past entries** — full check-in form pre-filled with existing data; stamps `lastEdited` on save
- **Dark/light theme** — user-selected, stored in localStorage, toggled in Settings
- **Bottom navigation** — fixed two-tab bar (Today / History); hidden on Settings and Edit pages
- **Export** — download all entries and configs as a formatted `habits-backup.json` file
- **Import** — upload a backup file; entries are merged (existing dates skipped), configs are replaced
- **Settings** — theme toggle, export, import, and habit management; accessible from both Today and History headers

## Style & Vibes
- **Calm and minimal** — no gamification, no streaks, no pressure. Just quiet logging.
- **Typographic** — the design language is almost entirely text-based. Navigation uses words
  (← back, Settings), not icons or emojis.
- **Stone palette** — warm off-white backgrounds, near-black text, muted stone grays for
  secondary elements. No bright accent colours.
- **Light weights** — headings use `font-light`, wide `tracking-widest`. Nothing feels heavy.
- **Mobile-first** — designed for phone screens. Max width `max-w-md`, generous touch targets
  (`min-h-[44px]`), no horizontal scrolling.
- **Section labels** — `text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500`
  used consistently for all section headers. This pattern must be reused for any new sections.
- **Rounded UI** — interactive elements use `rounded-2xl`. Avoid sharp corners.
- **Subtle interactions** — `transition-colors` on hover/active. Active states use a slightly
  darker shade (e.g. `active:bg-stone-900`). No animations beyond simple transitions.

## Color Palette (globals.css)

### Light Theme (default)
| Variable       | Value     | Usage                        |
|----------------|-----------|------------------------------|
| `--background` | `#fafaf9` | Page background (warm white) |
| `--foreground` | `#1c1917` | Primary text                 |
| `--muted`      | `#78716c` | Secondary text               |
| `--border`     | `#e7e5e4` | Dividers, input borders      |
| `--accent`     | `#a8a29e` | Subtle accents               |

### Dark Theme
| Variable       | Value     | Usage                             |
|----------------|-----------|-----------------------------------|
| `--background` | `#1c1917` | Page background (warm charcoal)   |
| `--foreground` | `#fafaf9` | Primary text                      |
| `--muted`      | `#a8a29e` | Secondary text                    |
| `--border`     | `#292524` | Dividers, input borders           |
| `--accent`     | `#57534e` | Subtle accents                    |

The dark theme mirrors the light theme's stone palette — warm charcoal rather than cold black.
It is **not** auto-applied based on system preference. The user selects it explicitly in Settings
and the choice is stored in localStorage under the key `clarity-theme` (`"light"` | `"dark"`).
Apply the `dark` class to the root `<html>` element and use Tailwind's `dark:` variants throughout.

The primary action button uses `bg-stone-800 dark:bg-stone-200` with `text-white dark:text-stone-900`.
Secondary/outline buttons use `border-stone-200 bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300`.

### Light theme color-role hierarchy (WCAG AA compliant)
All text in the light theme must meet WCAG AA (4.5:1 for normal text, 3:1 for UI components)
against the `#fafaf9` background. Verified contrast ratios:

| Role | Tailwind class | Contrast vs bg |
|---|---|---|
| Primary text | `text-stone-800` / `text-stone-900` | 12–15:1 ✅ |
| Body / form labels | `text-stone-700` | ~9:1 ✅ |
| Navigation links, arrows, close buttons | `text-stone-600` (hover: `stone-800`) | 7.3:1 ✅ |
| Section labels, unit labels, timestamps | `text-stone-500` | 4.6:1 ✅ |
| **stone-400 — do not use for light-mode text** | `text-stone-400` | 2.4:1 ❌ |
| Error messages | `text-red-700 dark:text-red-400` | 6.2:1 ✅ |

- `text-stone-400` is only acceptable as a `dark:` variant (on the dark bg it reaches ~7:1).
- Interactive element borders use `border-stone-300` in light mode (improvement over stone-200;
  strict 3:1 compliance would require stone-500 which is visually heavy).
- Toggle off-state track: `bg-stone-300 dark:bg-stone-600`.
- Empty calendar cells: `bg-stone-200 dark:bg-stone-800`.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Font**: Geist Sans
- **Storage**: localStorage
- **Testing**: Jest + jest-environment-jsdom

## Navigation Architecture

```
/           Today        BottomNav visible
/history    History      BottomNav visible
/settings   Settings     BottomNav hidden — back via router.back()
/edit/[date] Edit        BottomNav hidden — back via ← history link
```

- **BottomNav** (`components/BottomNav.tsx`) — fixed bottom bar, 56px + safe-area inset.
  Returns `null` on `/settings` and any `/edit/*` path. Uses `usePathname()` for active state.
- **Settings** is reachable from both Today and History headers (top-right, same muted style).
  Its back arrow uses `router.back()` so it always returns to the calling page.
- **DayDetail → Edit** flow: Edit link navigates to `/edit/[date]`. On save, `router.push`
  goes to `/history?open=[date]`. HistoryView reads `?open=` on mount, auto-opens DayDetail,
  then cleans the URL with `window.history.replaceState`.

## Project Structure
```
app/                    # Next.js App Router
  page.tsx              # Home (Today) — server component shell
  history/page.tsx      # History — server component shell
  settings/page.tsx     # Settings — server component shell
  edit/[date]/page.tsx  # Edit a past entry — async params, server shell
  globals.css           # CSS variables + Tailwind import (light + dark themes)
  layout.tsx            # Root layout: theme script, BottomNav, Geist Sans
components/
  CheckInForm.tsx       # Check-in form (client) — today + edit mode via date? prop
  HabitToggle.tsx       # iOS-style boolean toggle (client)
  NumberStepper.tsx     # −/input/+ numeric stepper; min/max optional (default 0/∞)
  JoyTagChip.tsx        # Selectable pill chip (client)
  ManageSection.tsx     # Habit + joy tag management (add/edit/archive/restore); used in SettingsView
  SettingsView.tsx      # Settings page: Theme → Manage → Export → Import
  CalendarHeatmap.tsx   # Month heatmap with year/month nav, HSL color blend (client)
                        #   Cells: h-11 w-11 (44px), gap-1.5, rounded-md
                        #   Labels: year text-sm, month text-base, arrows text-xl
  DayDetail.tsx         # Bottom sheet: read-only day summary + Edit link (client)
  BottomNav.tsx         # Two-tab fixed bottom navigation (client)
lib/
  storage.ts            # localStorage CRUD: saveEntry, getEntry, getAllEntries
  habitConfig.ts        # Config types, defaults, getConfigs(), saveConfigs() — single source of truth
  transferData.ts       # Export/import: prepareExportData, parseImportFile, mergeEntries, exportBackup, importBackup
  habits.ts             # createEmptyEntry() helper only
  theme.ts              # Theme helpers: getTheme, setTheme, applyTheme
  storage.test.ts       # 13 Jest tests for storage functions
  transferData.test.ts  # 21 Jest tests for transfer functions
  theme.test.ts         # 12 Jest tests for theme functions
public/
  theme-init.js         # Inline script: applies saved theme class before first paint
types/
  entry.ts              # HabitEntry interface — single source of truth for the data model
```

## Data Model (Sprint 3)

### localStorage keys
| Key | Contents |
|-----|----------|
| `clarity_entries` | `Record<string, HabitEntry>` — date-keyed map of all logged days |
| `clarity-configs` | `AppConfigs` — habit and joy tag config; falls back to defaults if absent |
| `clarity-theme` | `"light"` \| `"dark"` |

### HabitEntry (`types/entry.ts`)
Habit values are keyed by UUID, not by label. Only habits the user has touched are present
(sparse records — never store zeroes for untouched habits).

```ts
interface HabitEntry {
  date: string                        // YYYY-MM-DD, primary key
  booleanHabits: Record<string, boolean>  // UUID → true/false
  numericHabits: Record<string, number>   // UUID → value
  joyTags: string[]                   // array of selected tag UUIDs
  reflection: string
  lastEdited?: string                 // ISO timestamp, set on edit
}
```

### AppConfigs (`lib/habitConfig.ts`)
```ts
interface AppConfigs {
  habits: HabitConfig[]     // BooleanHabitConfig | NumericHabitConfig
  joyTags: JoyTagConfig[]
}
```
- `getConfigs()` reads from `clarity-configs`, falls back to `DEFAULT_HABIT_CONFIGS` +
  `DEFAULT_JOY_TAG_CONFIGS` if the key is absent or malformed.
- `saveConfigs(configs)` writes the full object atomically.
- **Never call `saveHabitConfigs` / `saveJoyTagConfigs` separately** — they don't exist.
  Always read-modify-write the full `AppConfigs`.

### Default UUIDs
Default habits and tags use stable hardcoded IDs (`00000000-0000-4000-8000-00000000000X`)
so entries always resolve to the right config across sessions. IDs 1–5 are boolean habits,
6–10 are numeric habits, 11–22 are joy tags. User-created items get `crypto.randomUUID()`.

### Archived configs
Archived habits/tags (`archived: true`) are hidden from the check-in form but kept in
storage so historical entries that reference their UUIDs remain valid. Never delete a config
that has been used in an entry.

### Export file shape (`lib/transferData.ts`)
```ts
interface ExportFile {
  version: 1
  exportedAt: string        // ISO timestamp
  configs: AppConfigs       // full habit + joy tag config
  entries: HabitEntry[]
}
```
- `exportBackup()` — exports entries + current configs; no guard for empty entries.
- `importBackup(file)` — merges entries (skip existing dates), **replaces configs entirely**.
- `parseImportFile(content)` returns `{ entries, configs }`.

## Key Implementation Notes

### General
- **Page components are server components** that wrap a single `"use client"` view component.
  Never add interactivity directly to `app/` files.
- **`lib/habitConfig.ts` is the source of truth** for habit and joy tag config. If you add or
  change a default habit or tag, update it there first. `lib/habits.ts` now only contains
  `createEmptyEntry()` and should not grow.
- **Date handling**: build YYYY-MM-DD strings from `getFullYear()`/`getMonth()`/`getDate()`,
  never from `toISOString().split('T')[0]` (UTC offset causes wrong date in some timezones).
- **Float precision in steppers**: use `Math.round((value + step) * 1000) / 1000` to prevent
  floating-point drift (e.g. `0.1 + 0.2 = 0.30000000000000004`).
- **FileReader over file.text()**: `importBackup` uses `FileReader.readAsText()` for jsdom
  compatibility in Jest tests.
- **Next.js dynamic route params are async**: use `params: Promise<{ date: string }>` and
  `await params` in server components (Next.js 15+).

### Tailwind v4
- **Class-based dark mode**: Tailwind v4 defaults `dark:` variants to `prefers-color-scheme`.
  To use the `.dark` class instead, add this to `globals.css`:
  ```css
  @custom-variant dark (&:where(.dark, .dark *));
  ```
- **Transform pipeline**: `translate-x-*` / `translate-y-*` can fail in Tailwind v4 due to
  CSS variable composition. Use inline `style={{ transform: "..." }}` for animated transforms,
  and explicit `left-1`/`left-6` for toggle thumb positioning.

### Theme system
- Theme is stored in localStorage under `clarity-theme` (`"light"` | `"dark"`).
- `public/theme-init.js` is loaded via `<Script strategy="beforeInteractive">` in `layout.tsx`
  to apply the saved theme class before first paint, preventing flash of unstyled content.
- `suppressHydrationWarning` is set on `<html>` to suppress React's class-mismatch warning.
- For components that need to react to theme changes at runtime, use the `useIsDark()` hook
  in `CalendarHeatmap.tsx` as a reference — it uses a `MutationObserver` on `document.documentElement`.

### Reading configs in client components
Any component that needs `AppConfigs` should follow this SSR-safe pattern to avoid
hydration mismatches and localStorage-during-SSR errors:

```ts
const [configs, setConfigs] = useState<AppConfigs>({
  habits: DEFAULT_HABIT_CONFIGS,
  joyTags: DEFAULT_JOY_TAG_CONFIGS,
});
useEffect(() => { setConfigs(getConfigs()); }, []);
```

Initialise with the module-level defaults (same values the server would produce),
then replace with saved values on mount. Components using this pattern:
`CheckInForm`, `DayDetail`, `CalendarHeatmap`, `ManageSection`.

### ManageSection behaviour
- All inline editors (edit habit, edit tag, add habit, add tag) are mutually exclusive —
  opening any one closes all others via `closeAllEditors()`.
- The `justArchivedId` state shows the "Archived. Past entries are preserved." note
  on the most recently archived item; any other action clears it.
- The Manage section label uses `text-stone-400` (not the usual `text-stone-500`).
  This is intentional per the design spec for this section.

### DayDetail resolution pattern
DayDetail resolves habit and joy tag labels by **iterating the entry's stored UUIDs**
(not the config list), then looking each up in an `id → config` Map. This ensures:
- Archived habits are included (the Map is built from all configs, not just active ones).
- Unknown IDs (e.g. from an imported backup with different defaults) are surfaced with
  the raw UUID as a fallback label instead of being silently dropped.

Always prefer this entry-first pattern over config-first filtering whenever displaying
historical data whose IDs may not match the current config set.

### URL state without useSearchParams
- Avoid `useSearchParams()` in client components — it requires wrapping in `<Suspense>`.
- For simple one-shot URL params (e.g. auto-opening a sheet after navigation), read
  `window.location.search` directly in a `useEffect`, then clean up with
  `window.history.replaceState({}, "", "/path")`.

## Microcopy & Tone

The words in the app should feel as considered as the design. Calm, human, never clinical.

- Empty states: inviting, never guilt-inducing
  - ✅ *"Nothing logged for this day yet"* / *"Nothing here yet"*
  - ❌ *"No data found"* / *"You missed this day"*
- Save confirmation: a brief, unobtrusive toast — no modal, no fanfare
- Error messages: calm and specific — *"That file doesn't look right — try exporting a fresh backup"*
- Settings labels: plain and human — *"Theme"*, *"Your data"*, not *"Appearance Settings"*
- No all-caps except for the established `tracking-widest` section label pattern
- No exclamation marks in UI copy

## Coding Standards

### Code Quality
- Write clean, readable code with meaningful variable and function names.
- Avoid magic numbers — use named constants instead.
- Keep functions small and focused on a single responsibility.

### TypeScript
- Use strict typing throughout. No `any` types.
- Define interfaces for all data structures.

### Component Structure
- Keep components small and reusable. Separate UI from logic.
- Store data helper functions in `lib/`.
- **Always add `type="button"` to every `<button>` that is not a form submit.** In HTML,
  `<button>` defaults to `type="submit"`, so any untyped button inside a `<form>` will
  trigger form submission on click. This applies to toggle switches (`HabitToggle`),
  chips (`JoyTagChip`), stepper arrows (`NumberStepper`), and any future interactive
  button rendered inside `CheckInForm` or similar form wrappers.

### Comments
- Add a short comment to any function that isn't immediately obvious.
- No need to comment every line.

### Error Handling
- Handle edge cases gracefully — if localStorage is unavailable or an imported JSON file is
  malformed, show a user-friendly message rather than crashing.

### Testing
- For each utility function (`saveEntry`, `getEntry`, `getAllEntries`, `export`, `import`),
  write a simple unit test using Jest. UI testing is not required for now.

### Mobile-First
- All components should be designed for small screens first. No horizontal scrolling.