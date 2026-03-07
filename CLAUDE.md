# Clarity — Project Guide

## Project Stack
Next.js App Router · TypeScript strict · Tailwind CSS v4 · localStorage · Jest · GitHub Pages (`https://jblanper.github.io/clarity/`)

- Dynamic routes require `generateStaticParams` for static export
- Always run `npm run lint && npm test && npm run build` after changes to verify nothing is broken

## Git & Commits
- Always verify the current directory is a git repository before running git commands (`git rev-parse --git-dir`)
- When committing, stage and commit in one step unless told otherwise

## Audits & Reports
Use the dedicated audit skills rather than writing audits from scratch.
Severity levels across all audit files: **critical** · **high** · **medium** · **low**

| Skill | What it audits | Output |
|---|---|---|
| `/audit-colour` | WCAG contrast, stone palette, dark mode completeness | `docs/audits/audit-colour.md` |
| `/audit-typography` | Type scale, section label pattern, spacing rhythm | `docs/audits/audit-typography.md` |
| `/audit-interaction` | Motion library usage, transitions, reduced motion | `docs/audits/audit-interaction.md` |
| `/audit-microcopy` | Tone, technical language, error messages, copy | `docs/audits/audit-microcopy.md` |
| `/audit-design-overall` | Holistic coherence review across all pages | `docs/audits/audit-design-overall.md` |
| `/audit-triage` | Consolidates all five reports into a chunked implementation plan | `docs/audits/audit-implementation-plan.md` |
| `/audit-arch` | CLAUDE.md compliance, TypeScript strictness, test coverage, component structure, static export constraints | `docs/audits/audit-arch.md` |
| `/audit-all` | Runs all five audits in parallel, then design-overall, then triage | All of the above |

## Sprint workflow

Sprint documents live in `docs/sprints/`. Each sprint produces two files:
a brief (`sprint-NN-brief.md`) that evolves through planning, and a final
doc (`sprint-NN.md`) that drives execution.

**Rules:** Sprint brief and documents are owned by the Product Owner role.
One release per sprint if possible.

**Before starting any sprint:** check `docs/sprint-tier-guide.md` to decide which planning skills to run. Not every sprint needs the full pipeline.

### Planning
| Skill | Role | When to use |
|---|---|---|
| `/sprint-brief` | Product Owner | Start here — back-and-forth discussion, produces the brief |
| `/sprint-ux` | UX/UI Designer | Reviews brief with you; flags which audits to run at validation |
| `/sprint-arch` | Senior Architect | Reviews brief with you, technical feasibility and risks |
| `/sprint-review` | PO mediator | Runs UX + Arch in parallel, you mediate conflicts |
| `/sprint-plan` | Product Owner | Produces the final executable sprint doc |

### Execution
| Skill | When to use |
|---|---|
| `/sprint-arch-review` | After coding — lint + tests + code review against CLAUDE.md |
| `/sprint-validate` | After coding — archives pre-sprint audits, runs fresh audits, reports regressions |
| `/sprint-qa` | After coding — runs Playwright regression suite, writes new tests, manual checklist |

### Closure
| Skill | When to use |
|---|---|
| `/calma-sync` | After validation — review whether Calma spec needs updating |
| `/deploy` | After you manually validate — full release pipeline |
| `/sprint-retro` | After release — retrospective appended to sprint doc |

### Anytime
| Skill | When to use |
|---|---|
| `/sprint-kickoff` | Start of any coding session mid-sprint — git status, tasks done/pending, what to work on next |
| `/retro-report` | Analyse all past retrospectives, produce process recommendations |
| `/project-health` | Between sprints — security audit, outdated deps, test suite health, docs integrity |

### Full execution order
```
PLANNING:   /sprint-brief → /sprint-ux → /sprint-arch → /sprint-plan
                                or
            /sprint-brief → /sprint-review → /sprint-plan

EXECUTION:  /sprint-kickoff → [code] → /sprint-arch-review → /sprint-validate → /sprint-qa → [you validate]

CLOSURE:    /calma-sync → /deploy → /sprint-retro
```

## Releases
Use `/deploy` for the full release pipeline: lint → tests → build → version bump (patch / minor / major) → changelog → commit + tag → GitHub release.

## What is Clarity?
A mobile-first Next.js habit tracker. Log daily habits, numbers, moments, and reflections once a day. Calm and minimal — no gamification, no streaks.

## Design

All design decisions — palette, typography, spacing, motion, interaction, and microcopy — are in `docs/calma-design-language.md` (system: Calma). It is the single source of truth. Read it before any UI work.

### Tailwind implementation tokens

These translate the Calma spec to concrete Tailwind classes. The spec defines the principles; these define the code.

- **Section label** — `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500` — all six parts required. `font-medium` is commonly omitted by mistake.
- **Primary button** — `bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900`
- **Secondary button** — `border-stone-200 bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300`
- **Interactive elements** — `rounded-2xl`, `min-h-[44px]` touch targets, `max-w-md` content width
- **Critical WCAG constraint** — never `text-stone-400` as foreground in light mode (2.4:1, fails AA). Safe only as `dark:` variant.
- **Errors** — `text-red-700 dark:text-red-400`

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
  MotionProvider.tsx # LazyMotion + domAnimation + MotionConfig reducedMotion="user"
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
- **Motion animations** — use `LazyMotion + domAnimation` (~17 KB) via `MotionProvider`. For height reveals use `animate={{ height: "auto" }}` with `style={{ overflow: "hidden" }}`. For directional slides (e.g. calendar) use named `variants` + `custom` prop on both `AnimatePresence` and `m.*` — inline function syntax on `initial`/`exit` is NOT called with `custom` and must not be used. Duration ≤ 320 ms, ease-out for enters, ease-in for exits.
- **Exit animation snap** — when `exit={{ height: 0 }}` is on an element that has padding or margin via className, those must also be animated to 0 in `exit` (e.g. `paddingTop: 0, paddingBottom: 0, marginBottom: 0`). With `box-sizing: border-box`, `height: 0` does not collapse `py-*` padding; the element stays visible at `paddingTop + paddingBottom` height until unmount, causing a snap.
- **DayDetail scroll lock** — uses `useLayoutEffect` (not `useEffect`) for `document.body.style.overflow = "hidden"`. The layout-effect cleanup runs synchronously during the React commit, so the lock is never left behind when the user navigates away mid-animation.
- **DayDetail CSS transitions** — the backdrop (`transition-opacity`) and sheet (`transition-transform`) are plain `<div>` elements not governed by `MotionConfig`. They carry semantic class names `.daydetail-backdrop` and `.daydetail-sheet`, suppressed in `globals.css` via `@media (prefers-reduced-motion: reduce)`. Same pattern as `.frequency-chevron` and `.heatmap-grid`. Do not remove these class names.
- **`lib/habitConfig.ts` is the source of truth** for config. `lib/habits.ts` contains only `createEmptyEntry()` and should not grow.

## Coding Standards
- Strict TypeScript — no `any`. Interfaces for all data structures.
- **Always `type="button"` on non-submit buttons** — `<button>` defaults to `type="submit"` inside a `<form>`. Applies to HabitToggle, MomentChip, NumberStepper, and any button inside CheckInForm.
- Small, focused functions. Named constants, no magic numbers. Comments only on non-obvious logic.
- Jest unit tests for all `lib/` utilities. UI testing not required.
- Mobile-first. No horizontal scrolling.
