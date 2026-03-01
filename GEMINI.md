# Clarity — Project Context

Clarity is a mobile-first, minimal daily habit tracker built with Next.js. It focuses on calm self-reflection, purposely avoiding gamification and streaks. All data is stored locally in the browser's `localStorage`.

## Project Overview

- **Main Technologies**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Jest.
- **Architecture**: Static-site generated (SSG) with client-side state management using `localStorage`.
- **Design Philosophy**: Follows the "Calma" design language (see `docs/calma-design-language.md`). It is typographic, minimal, and uses a warm "Stone" color palette.
- **Data Model**:
    - **Entries**: Daily records keyed by `YYYY-MM-DD` containing boolean habits, numeric habits, "moments" (tags), and a text reflection.
    - **Configs**: User-defined habits and moments, identified by UUIDs. Archiving is preferred over deletion to preserve historical data.

## Building and Running

- **Development**: `npm run dev`
- **Production Build**: `npm run build` (outputs to `/out` for static hosting)
- **Linting**: `npm run lint`
- **Testing**: `npm test` (unit tests for logic in `lib/`)
- **Watch Mode**: `npm run test:watch`

## Development Conventions

### Technical Guidelines
- **Strict TypeScript**: No `any` types. Interfaces for all data structures in `types/` or `lib/`.
- **Client-Side Storage**: Use `lib/storage.ts` and `lib/habitConfig.ts` for data persistence.
- **SSR Safety**: Initialize `useState` with defaults and load `localStorage` data inside `useEffect` or `startTransition` to avoid hydration mismatches.
- **No Dynamic Routes**: Since the project is a static export, use query parameters (e.g., `/edit?date=...`) instead of dynamic route segments.
- **Navigation**: Use `sessionStorage` (e.g., `settings-back`) to manage back-navigation intent without cluttering URLs.
- **Date Handling**: Always use `YYYY-MM-DD` derived from local date methods (`getFullYear()`, etc.), avoiding `toISOString()` to prevent UTC offset issues.

### UI & Styling
- **Mobile-First**: Optimized for small screens; `max-w-md` is a standard container.
- **Tailwind CSS v4**: Use utility classes. Note that class-based dark mode is enabled via `@custom-variant dark`.
- **Interactions**: Use `transition-colors`. Avoid heavy animations. Ensure touch targets are at least `min-h-[44px]`.
- **Typography**: Text-based navigation (e.g., "← back") over icons/emojis.
- **Forms**: Always set `type="button"` on buttons within forms unless they are the submit button.

### Testing
- Logic in `lib/` must have corresponding `.test.ts` files using Jest.
- UI components are currently not covered by automated tests (manual verification preferred).

## Key Files & Directories
- `app/`: Next.js pages (server shells wrapping client views).
- `components/`: UI components (e.g., `CheckInForm`, `CalendarHeatmap`).
- `lib/`: Business logic, storage wrappers, and config management.
- `types/`: Core TypeScript interfaces (e.g., `HabitEntry`).
- `public/theme-init.js`: Critical script to prevent theme flicker on load.
