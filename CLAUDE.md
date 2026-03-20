<!-- Last reviewed: 2026-03-17 (update-claude-md, sprint-14-retro) -->
# Clarity — Project Guide

## What is Clarity?
A mobile-first Next.js habit tracker. Log daily habits, numbers, moments, and reflections once a day. Calm and minimal — no gamification, no streaks. Deployed as a static export to GitHub Pages: https://jblanper.github.io/clarity/

## Project Stack
Next.js App Router · TypeScript strict · Tailwind CSS v4 · localStorage · Jest · GitHub Pages

- Dynamic routes require `generateStaticParams` for static export

## Never do these things
- **Never delete an archived config** — historical entries reference UUIDs that must stay resolvable forever.
- **Never add interactivity to `app/` page files** — server components only; all client logic goes in the `*View.tsx` or component layer.
- **Never use `toISOString()` for dates** — UTC offset bug. Always build YYYY-MM-DD from `getFullYear()`/`getMonth()`/`getDate()`.
- **Never use `text-stone-400` as foreground in light mode** — fails WCAG AA (2.4:1). Safe only as a `dark:` variant.
- **Never use `router.back()`** — use the sessionStorage pattern documented in Navigation Architecture.
- **Never add partial helpers to AppConfigs** — always read-modify-write via `getConfigs()` / `saveConfigs()`.

## When you're unsure — stop first
Before touching >4 unplanned files, the data model, localStorage keys, navigation patterns, or the Calma spec: state your interpretation, list affected files, flag assumptions, and wait for go-ahead.

## Workflow Preferences
- When asked to 'update' or 'enrich' a file like CLAUDE.md, edit the file — don't just read it
- Avoid unnecessary intermediate/temporary files; prefer direct transformations
- Keep solutions simple; don't add complexity (e.g., 'lightweight modes') unless explicitly requested
- **Never run `/skill-creator` for prose-format or workflow skills** — its eval harness is designed for measurable output and produces low-signal boilerplate for narrative skills.
- **After completing each task during the development phase, update its validation checklist (`[x]`) in the sprint doc before moving on** — keeps the doc as a live record and reduces QA guesswork.
- **Each workflow step must update the sprint Status field** — QA, validation, calma-sync, and deploy each set `**Status:**` on completion so the sprint doc stays as a live record.

## Project Structure (Claude-specific)
- Skills are located in `.claude/skills/` — each skill is a markdown file
- Documentation lives in `docs/` with subfolders
- When asked to find a skill or command, check `.claude/skills/` first before exploring other directories

## Git & Development
- Verify git repo before running git commands: `git rev-parse --git-dir`
- Stage and commit in one step unless told otherwise
- Always run `npm run lint && npm test && npm run build` before committing
- Before staging, check `git status` and only add files changed in the current session. Do not pick up pre-existing unstaged changes without confirming with the user.

## Workflows
Sprint phases, audit skills, and release pipeline: see `docs/workflow.md`.

## Design (Calma Design Language)

All design decisions — palette, typography, spacing, motion, interaction, and microcopy — are in `docs/calma-design-language.md`. "Calma" is the name of this project's design system. It is the single source of truth. Read it before any UI work.

**Spec vs. CLAUDE.md boundary** — `docs/calma-design-language.md` holds design principles; CLAUDE.md holds code-level implementation rules. Never add implementation specifics to the Calma spec.

### Tailwind implementation tokens

These translate the Calma spec to concrete Tailwind classes. The spec defines the principles; these define the code.

- **Section label** — `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500` — all six parts required. `font-medium` is commonly omitted by mistake.
- **Primary button** — `bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900`
- **Secondary button** — `border-stone-200 bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300`
- **Interactive elements** — `rounded-2xl`, `min-h-[44px]` touch targets, `max-w-md` content width
- **Critical WCAG constraint** — never `text-stone-400` as foreground in light mode (2.4:1, fails AA). Safe only as `dark:` variant. On elevated component backgrounds (`bg-stone-100` tracks, `bg-stone-50` panels), `text-stone-500` also fails AA — use `text-stone-600` minimum (e.g. SegmentedPill inactive segments).
- **Tertiary button** — `inline-flex items-center rounded-xl border border-stone-200 dark:border-stone-700 px-4 py-2 text-xs text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50` — transparent bg at rest, border, small text, hover wash. Use for low-hierarchy actions within a detail view (e.g. "Edit this day" in DayDetail).
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

- **Page headers** — `flex items-center justify-between`: title left, nav link top-right in `text-xs uppercase tracking-widest text-stone-600`.
- **Settings back** — caller writes `sessionStorage.setItem("settings-back", "/" | "/history")` before navigating; SettingsView reads it on mount and calls `router.push(backDest)`, never `router.back()`. Today sets `"/"`, HistoryView sets `"/history"`.
- **DayDetail → Edit** — `/edit?date=[date]`; on save redirects to `/history?open=[date]`; HistoryView auto-opens DayDetail then cleans the URL with `replaceState`.

## Project Structure
```
app/          server shells (page.tsx, history, settings, manage); edit/page.tsx is the only client page (?date= query param)
components/   CheckInForm.tsx (today+edit) · DayDetail.tsx · CalendarHeatmap.tsx · FrequencyList.tsx · HabitToggle.tsx · NumberStepper.tsx · MomentChip.tsx · BlossomIcon.tsx · MotionProvider.tsx · ManageView.tsx · SettingsView.tsx · HelpView.tsx · BottomNav.tsx
lib/          storage.ts · habitConfig.ts · transferData.ts · habits.ts · theme.ts · *.test.ts
types/        entry.ts — HabitEntry, HabitState (data model source of truth)
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
- **`NumericHabitConfig.startAt`** — optional `startAt?: number` field added in Sprint 9. Omitting it means first tap = one step from 0. Never store `startAt: 0` (no-op at runtime; guard with `v <= 0 ? undefined : v` when parsing form input).
- **Import** (`importBackup`) — merges entries (skips existing dates), **replaces configs entirely**.

## Key Implementation Notes

### Rendering & SSR
- **Page components are server components** wrapping a single `"use client"` view. Never add interactivity to `app/` files (except `edit/page.tsx`).
- **Reading configs SSR-safely** — init `useState` with module-level defaults, then call `getConfigs()` inside a `useEffect` via `startTransition`. Avoids localStorage-during-SSR errors. Used in CheckInForm, DayDetail, CalendarHeatmap, ManageView.
- **Avoid `useSearchParams()`** — requires `<Suspense>`. Read `window.location.search` directly in a `useEffect` instead.

### Routing & Navigation
- **No dynamic routes** — static export means build-time routes only. Use query params + `window.location.search` in a `useEffect`. See `app/edit/page.tsx`.
- **sessionStorage for nav intent** — keeps URLs clean; survives round-trips without extra params.

### Data & Storage
- **Date handling** — build YYYY-MM-DD from `getFullYear()`/`getMonth()`/`getDate()`, never `toISOString()` (UTC offset bug).
- **Float precision** — use `Math.round((value + step) * 1000) / 1000` in steppers.

### Animations (Framer Motion)
- **Motion animations** — use `LazyMotion + domAnimation` (~17 KB) via `MotionProvider`. For height reveals use `animate={{ height: "auto" }}` with `style={{ overflow: "hidden" }}`. For directional slides (e.g. calendar) use named `variants` + `custom` prop on both `AnimatePresence` and `m.*` — inline function syntax on `initial`/`exit` is NOT called with `custom` and must not be used. Duration ≤ 320 ms, ease-out for enters, ease-in for exits.
- **Permitted animation properties** — opacity · translate · height/max-height (reveals) · scaleX/scaleY (reflow-free substitute for width animations — animate `scaleX` from `0` to `1`; set the target width as a static `style={{ width: barWidth }}` and `transformOrigin` to the growth edge. Never pass a percentage string to `scaleX`). Never animate `width` or `height` directly (layout reflow on every frame). Never use `scale` or `transition-transform` on interactive press states — use `active:opacity-70` instead.
- **Exit animation snap** — when `exit={{ height: 0 }}` is on an element that has padding or margin via className, those must also be animated to 0 in `exit` (e.g. `paddingTop: 0, paddingBottom: 0, marginBottom: 0`). With `box-sizing: border-box`, `height: 0` does not collapse `py-*` padding; the element stays visible at `paddingTop + paddingBottom` height until unmount, causing a snap.
- **Height animation jump (enter)** — Framer Motion measures natural height while `paddingTop/paddingBottom` from `initial` are still 0, so the measured height excludes padding. When `height: auto` restores at animation end, the element snaps to content+padding height. **Preferred fix:** use a shell constant (e.g. `INLINE_FORM_SHELL`) that carries only border and background on the animated `m.div`; put all `px-*/py-*` padding on a plain inner `div` that Framer Motion never measures. This is cleaner than animating padding to 0 in `exit`. The ManageView `INLINE_FORM_SHELL` constant is the reference implementation. **Apply this proactively** when writing any new `height: 0 → auto` animation — do not wait for QA to catch it.
- **Mutually exclusive animated states** — when one UI slot alternates between two components (e.g. action tray ↔ inline edit form), use a single `<AnimatePresence mode="wait">` wrapping both with distinct `key` props. Without `mode="wait"`, exit and enter run simultaneously, causing jank.
- **`mode="wait"` + fixed elements (iOS Safari)** — `mode="wait"` creates a brief DOM gap between exit completing and enter starting. If the animated element contributes to document height, iOS Safari repaints `position: fixed` elements during the resulting layout reflow, causing a visible snap (e.g. BottomNav jump on calendar month change). Fix: use `mode="popLayout"` instead and wrap the animated area in `<div className="relative overflow-hidden">`. The exiting element is immediately made `position: absolute`, so layout height never changes. Do not use `mode="wait"` on the CalendarHeatmap grid `AnimatePresence`.
- **Never set `initial={false}` on a child `m.*` inside `AnimatePresence`** — it suppresses the enter animation not just on first render but whenever the element mounts mid-session (e.g. when a user toggles a habit on). Always provide explicit `initial={{ height: 0, opacity: 0 }}` (or equivalent) so enters animate correctly at any point in the session. `initial={false}` on the parent `AnimatePresence` only affects elements already in the DOM on first render — it does not affect children.

### Theming & Dark Mode
- **Tailwind v4 dark mode** — class-based via `@custom-variant dark` in `globals.css`. `translate-x-*` can fail; use inline `style` or explicit `left-*` positioning.
- **Theme** — `public/theme-init.js` applies the class before first paint. `useIsDark()` in CalendarHeatmap uses a `MutationObserver` for runtime changes.

### Component-specific notes
- **CalendarHeatmap encoding** — typographic date-as-weight. Font weight encodes habit completion: `font-light` (no data) → `font-normal` → `font-semibold` → `font-bold` (all done). Amber (`text-amber-600 dark:text-amber-400`) fires for any joy or moment logged on a day; stone (`text-stone-700 dark:text-stone-300`) otherwise. No filled cell backgrounds. Selected day: `rounded-full bg-stone-100 dark:bg-stone-800` circle behind the number. Year row shown only when `currentYear - earliestYear >= 1 && entries.length >= 7`; otherwise the year is inlined into the month heading ("March 2026"). The two-axis colour blend (Dusk Blue × Warm Ember) is retired — do not restore it.
- **HeatmapFilter** — exported type `{ type: "boolean-habit" | "numeric-habit" | "moment"; id: string }` from `CalendarHeatmap.tsx`. When set, non-matching cells drop to `opacity-25` on the outer button; no other filter signal. Filter is owned by `HistoryView` state and passed to both `CalendarHeatmap` and `FrequencyList`.
- **FrequencyList** — collapsible section below the heatmap (toggle button). Counts occurrences per UUID across the selected period (`Period = "month" | "3m" | "always"`). The `"month"` period follows the calendar's currently viewed month via `viewedYear`/`viewedMonth` props (synced through `CalendarHeatmap`'s `onMonthChange` callback). Tapping a row sets or clears the `HeatmapFilter`. A one-time hint ("Tap any item to filter the calendar") fades out on first tap and is persisted to `clarity-frequency-hint-seen`.
- **HistoryView Frequency section** — wrapped in `{entries.length > 0 && ...}`; empty-state message renders directly below the heatmap when no entries exist.
- **DayDetail labels** — resolve by iterating the entry's UUIDs, not the config list, so archived and imported habits display correctly.
- **DayDetail Highlights** — amber panel section above Habits when `checkedHabits.some(h => h.joy)`. Lists joy-marked habits with `BlossomIcon filled={true}`. Done-habit checkmark: `text-amber-600 dark:text-amber-400`. Inline per-row BlossomIcon removed once the section exists.
- **ManageView** — all inline editors are mutually exclusive via `closeAllEditors()`. Archive buttons use `text-amber-700` (reversible, not destructive). The add-habit form and the inline edit form are separate JSX subtrees with different indentation — when editing label copy in one, always verify the other is updated too. Active habit rows use a full-width tap button that reveals an **action tray** (`actionTrayId` state); the tray and inline edit form share a single `<AnimatePresence mode="wait">` block (keys `"tray"` / `"edit-form"`) to prevent simultaneous counter-animations. Animated wrappers use `INLINE_FORM_SHELL` (border+bg only); padding lives on a plain inner `div` to avoid height-jump on enter. The tray is hidden while `editingHabit` is set. Moments use a chip grid with `editingMomentId`/`editingMomentLabel`; tapping a chip shows a dimmed selected state (`bg-stone-100 text-stone-600 cursor-default`) and renders the edit form as a separate `AnimatePresence`-wrapped card below the grid (not replacing the chip). The `+ New` chip hides only while `addingTag` is true (not during chip editing). Archived habits and moments are collapsed behind `archivedHabitsOpen`/`archivedMomentsOpen` disclosure toggles; `archiveHabit` and `archiveMoment` call `setArchivedHabitsOpen(true)` / `setArchivedMomentsOpen(true)` to auto-expand on archive.
- **HabitToggle** — full-row `<button>` (`w-full flex items-center gap-3 min-h-[44px] py-3 rounded-xl px-2 -mx-2`). An amber dot `<span>` (h-2.5 w-2.5 rounded-full) sits left of the label `<span>`; amber-50 row wash when done, transparent when off. `active:opacity-70` for press feedback. No sliding thumb or separate hit area.
- **NumberStepper** — tap-to-increment pill (`role="spinbutton"`) beside a conditionally rendered decrement glyph (`−`). Zero state: `bg-stone-100 text-stone-600` (never `text-stone-500` — fails AA on stone-100). Active state: `bg-amber-50 text-amber-800` light / `bg-amber-900/20 text-amber-300` dark. The decrement button is not rendered at all when `value <= 0` — no `disabled` state. `startAt?: number` prop: if set and `value === 0`, first tap jumps to `startAt` rather than incrementing by step; subsequent taps always increment by step regardless of `startAt`. No direct type-in input.
- **Save flow** (CheckInForm) — three states: idle → saving → confirmed. Labels branch on `isEditMode`: new entries "Capture"/"Capturing…"/"Day captured"; edit mode "Save"/"Saving…"/"Saved". `saveEntry()` deferred one tick; redirects after 1200 ms.
- **Joy section** (CheckInForm) — appears between Moments and Reflection when at least one boolean habit is done. Lists done habits with `BlossomIcon` buttons to mark `joy` independently of `done`. `joyByDefault` on the config pre-fills joy when a habit is first toggled on. Factual logging (Habits) and emotional reflection (Joy) are intentionally separate moments in the form.
- **DayDetail scroll lock** — uses `useLayoutEffect` (not `useEffect`) for `document.body.style.overflow = "hidden"`. The layout-effect cleanup runs synchronously during the React commit, so the lock is never left behind when the user navigates away mid-animation.
- **Scroll position before collapse** — when collapsing a section that could shift page scroll (e.g. FrequencyList), call `window.scrollTo({ top: savedPosition, behavior: "auto" })` synchronously before the state update that triggers the collapse. The call must be synchronous and before state update — `"auto"` (not `"smooth"`) prevents a visible jump. Discovered in Sprint 7.
- **DayDetail CSS transitions** — the backdrop (`transition-opacity`) and sheet (`transition-transform`) are plain `<div>` elements not governed by `MotionConfig`. They carry semantic class names `.daydetail-backdrop` and `.daydetail-sheet`, suppressed in `globals.css` via `@media (prefers-reduced-motion: reduce)`. Same pattern as `.frequency-chevron` and `.heatmap-grid`. Do not remove these class names.
- **`lib/habitConfig.ts` is the source of truth** for config. `lib/habits.ts` contains only `createEmptyEntry()` and should not grow.

## Coding Standards
- Strict TypeScript — no `any`. Interfaces for all data structures.
- **Always `type="button"` on non-submit buttons** — `<button>` defaults to `type="submit"` inside a `<form>`. Applies to HabitToggle, MomentChip, NumberStepper, and any button inside CheckInForm.
- **Escape apostrophes and quotes in JSX text** — literal `'` and `"` inside JSX text content (not attribute values) trigger `react/no-unescaped-entities`. Use `&apos;` and `&quot;` instead. Caught by `npm run lint`.
- **Verify `replace_all` completeness** — after any `replace_all` edit, grep the file for the old string to confirm no instances remain. Different indentation levels in the same file can cause silent misses (e.g. the same label appearing in both an inline edit form and an add form at different indentation depths).
- Small, focused functions. Named constants, no magic numbers. Comments only on non-obvious logic.
- Jest unit tests for all `lib/` utilities. UI testing not required.
- Mobile-first. No horizontal scrolling.
- **Tailwind v4 colour format in tests** — `getComputedStyle().color` returns oklch format in Tailwind v4, not `rgb()` strings. Never assert computed colour values in tests. Use class-name checks instead: `element.getAttribute("class")` contains `"amber"` (or `"stone"`, etc.).
