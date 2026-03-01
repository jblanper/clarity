# Clarity

A personal daily habit tracker built as a mobile-first web app. The goal is to make daily self-reflection feel calm and effortless — open it once a day, log how things went, and close it.

## Features

- **Daily check-in** — log boolean habits, numeric habits, moments, and a free-text reflection; mark any completed habit as joyful
- **History** — calendar heatmap with month/year navigation; frequency breakdown of habits and moments with period selector (month / 3 months / all time) and tap-to-filter
- **Day detail** — tap any heatmap day to review logged data; edit past entries from there
- **Habit management** — add, rename, archive, and restore habits and moments; inline moment creation directly from the check-in form
- **Dark/light theme** — user-selected, stored locally
- **Export/import** — back up and restore all data as a JSON file
- No accounts, no sync, no server — all data stays in your browser's localStorage

## Tech stack

- [Next.js](https://nextjs.org) (App Router) — TypeScript, strict mode
- [Tailwind CSS v4](https://tailwindcss.com)
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
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |

## Project structure

```
app/          # Next.js App Router pages
components/   # UI components
lib/          # Storage, config, export/import, theme helpers
types/        # TypeScript interfaces
public/       # Static assets (theme init script)
```

## Data

All data is stored in `localStorage` under four keys:

| Key | Contents |
|---|---|
| `clarity_entries` | All logged habit entries, keyed by date |
| `clarity-configs` | Habit and moment configuration |
| `clarity-theme` | `"light"` or `"dark"` |
| `clarity-frequency-hint-seen` | `"true"` once the frequency list filter hint has been dismissed |

Use **Settings → Your data → Export backup** to download a full JSON backup at any time.
