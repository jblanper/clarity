# Clarity

A personal daily habit tracker built as a mobile-first web app. The goal is to make daily self-reflection feel calm and effortless — open it once a day, log how things went, and close it. Live at [jblanper.github.io/clarity](https://jblanper.github.io/clarity/).

## Features

- **Daily check-in** — log boolean habits, numeric habits, moments, and a free-text reflection
- **Joy marking** — independently mark any completed habit as a source of joy, separate from simply logging it done
- **History** — calendar heatmap with a two-axis colour blend (habits vs. moments/joy); month/year navigation; tap any cell to open the day detail
- **Frequency breakdown** — ranked list of habits and moments with a period selector (month / 3 months / all time); tap any row to filter the heatmap
- **Day detail** — review logged data for any past day; edit entries from there
- **Habit management** — add, rename, archive, and restore habits and moments; inline moment creation directly from the check-in form
- **Dark/light theme** — user-selected, stored locally; no flash on load
- **Export/import** — back up and restore all data as a JSON file; import merges entries without overwriting existing dates
- No accounts, no sync, no server — all data stays in your browser's localStorage

## Tech stack

- [Next.js](https://nextjs.org) (App Router) — TypeScript strict mode, static export
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/) — LazyMotion + domAnimation (~17 KB), reduced-motion aware
- [Jest](https://jestjs.io) + jest-environment-jsdom for unit tests

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build and export static files to `out/` |
| `npx serve out` | Serve the static export locally after building |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |

## Project structure

```
app/          # Next.js App Router pages (server components)
components/   # UI components and client views
lib/          # Storage, config, export/import, theme, unit tests
types/        # TypeScript interfaces (HabitEntry, HabitState, AppConfigs)
public/       # Static assets — theme-init.js applies theme before first paint
docs/         # Design language (Calma spec), workflow, sprint docs, audit reports
```

The visual and interaction language is documented in `docs/calma-design-language.md` (the Calma design system) — palette, typography, spacing, motion, and microcopy principles that govern every UI decision in the app.

## Data

All data is stored in `localStorage` under four keys:

| Key | Contents |
|---|---|
| `clarity_entries` | All logged habit entries, keyed by date (YYYY-MM-DD) |
| `clarity-configs` | Habit and moment configuration, including archived items |
| `clarity-theme` | `"light"` or `"dark"` |
| `clarity-frequency-hint-seen` | `"true"` once the frequency list filter hint has been dismissed |

Habit values are keyed by UUID, not label, so renaming a habit never breaks historical entries. Archived habits are kept in storage forever so historical UUIDs always resolve correctly.

Use **Settings → Your data → Export backup** to download a full JSON backup at any time.
