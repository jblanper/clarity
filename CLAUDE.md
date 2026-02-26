# Clarity — Project Guide

## What is Clarity?
Clarity is a personal daily habit tracker built as a mobile-first Next.js web app.
The goal is to make daily self-reflection feel calm and effortless — not clinical or
gamified. You open it once a day, log how things went, and close it.

## Features
- **Daily check-in form** — log each day's habits, numbers, joy moments, and a reflection note
- **Boolean habits** — toggle switches for Meditation, Exercise, Reading, Journaling, Drawing
- **Numeric habits** — steppers for Sleep (hrs), Water (glasses), Screen time (hrs), Coffee (cups), Decaf coffee (cups)
- **Joy tags** — a multi-select chip grid with 12 defaults (Time in nature, Great conversation, Good food, Calligraphy, Drawing, Poetry, Music listening, Music playing, Gardening, Making bread, Meditation, Time with friends)
- **Reflection** — a free-text textarea for end-of-day notes
- **Persistence** — all entries saved to localStorage, pre-populated on return visits
- **Export** — download all entries as a formatted `habits-backup.json` file
- **Import** — upload a backup file and merge entries (existing dates are never overwritten)
- **Settings page** — accessible from the home screen via a minimal "Settings" text link

## Style & Vibes
- **Calm and minimal** — no gamification, no streaks, no pressure. Just quiet logging.
- **Typographic** — the design language is almost entirely text-based. Navigation uses words
  (← back, Settings), not icons or emojis.
- **Stone palette** — warm off-white backgrounds, near-black text, muted stone grays for
  secondary elements. No bright accent colours.
- **Light weights** — headings use `font-light`, wide `tracking-widest`. Nothing feels heavy.
- **Mobile-first** — designed for phone screens. Max width `max-w-md`, generous touch targets
  (`min-h-[44px]`), no horizontal scrolling.
- **Section labels** — `text-xs uppercase tracking-widest text-stone-400` used consistently
  for all section headers and navigation text. This pattern must be reused for any new sections.
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

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Font**: Geist Sans
- **Storage**: localStorage
- **Testing**: Jest + jest-environment-jsdom

## Project Structure
```
app/                    # Next.js App Router
  page.tsx              # Home (check-in) — server component shell
  history/page.tsx      # History — server component shell (Sprint 2)
  settings/page.tsx     # Settings — server component shell
  globals.css           # CSS variables + Tailwind import (light + dark themes)
  layout.tsx            # Root layout: Clarity metadata, Geist Sans, viewport
components/
  CheckInForm.tsx       # Main check-in form (client) — orchestrates all sections
  HabitToggle.tsx       # iOS-style boolean toggle (client)
  NumberStepper.tsx     # −/input/+ numeric stepper with clamp (client)
  JoyTagChip.tsx        # Selectable pill chip (client)
  SettingsView.tsx      # Export/import + theme toggle UI (client)
  CalendarHeatmap.tsx   # Month-by-month heatmap with year selector (client, Sprint 2)
  DayDetail.tsx         # Day detail modal/bottom sheet (client, Sprint 2)
  BottomNav.tsx         # Two-tab bottom navigation bar (client, Sprint 2)
lib/
  storage.ts            # localStorage CRUD: saveEntry, getEntry, getAllEntries
  transferData.ts       # Export/import: prepareExportData, parseImportFile, mergeEntries, importEntries
  habits.ts             # Named constants: BOOLEAN_HABITS, NUMERIC_HABITS, DEFAULT_JOY_TAGS, EMPTY_ENTRY_FIELDS
  theme.ts              # Theme helpers: getTheme, setTheme, applyTheme (Sprint 2)
  storage.test.ts       # 13 Jest tests for storage functions
  transferData.test.ts  # 17 Jest tests for transfer functions
types/
  entry.ts              # HabitEntry interface — single source of truth for the data model
```

## Key Implementation Notes
- **Page components are server components** that wrap a single `"use client"` view component.
  Never add interactivity directly to `app/` files.
- **`lib/habits.ts` is the source of truth** for habit keys, labels, and config. If you add a
  new habit, add it there first and derive types/defaults from it.
- **Toggle thumb positioning**: use explicit `left-1`/`left-6` on the thumb `<span>`, not
  `translate-x-*`, to avoid Tailwind v4 CSS variable transform pipeline issues.
- **Date handling**: build YYYY-MM-DD strings from `getFullYear()`/`getMonth()`/`getDate()`,
  never from `toISOString().split('T')[0]` (UTC offset causes wrong date in some timezones).
- **Float precision in steppers**: use `Math.round((value + step) * 1000) / 1000` to prevent
  floating-point drift (e.g. `0.1 + 0.2 = 0.30000000000000004`).
- **FileReader over file.text()**: `importEntries` uses `FileReader.readAsText()` for jsdom
  compatibility in Jest tests.

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