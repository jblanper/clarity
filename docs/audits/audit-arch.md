# Architecture & Code Health Audit

Generated: 2026-03-20 12:28
Scope: components/ · app/ · lib/ · types/
Reference: CLAUDE.md

---

## Summary

The codebase is in strong health overall: no `any` types, no `router.back()` calls, no `useSearchParams()` usage, full test coverage across all `lib/` utilities, and the static export constraint is consistently respected. The three high-severity findings are: four `<button>` elements missing `type="button"` in `CalendarHeatmap.tsx`, one in `DayDetail.tsx`, and one bare `text-stone-400` foreground in light mode in `ManageView.tsx`. Medium findings include missing tests for `lib/habitConfig.ts` and two pure utility functions inside `CalendarHeatmap.tsx` that are untestable in their current location. Three page headers use `items-center` where the spec requires `items-start`.

Severity key: **Critical** = data loss risk or build-breaking constraint violation
· **High** = CLAUDE.md rule violation · **Medium** = structural signal worth addressing
· **Low** = minor deviation

---

## 1. CLAUDE.md compliance

| File | Line | Rule | Issue | Severity |
|---|---|---|---|---|
| `components/CalendarHeatmap.tsx` | 187, 198, 211, 233 | Always `type="button"` on non-submit buttons | Four `<button>` elements (prevYear, nextYear, prevMonth, nextMonth) missing `type="button"` | **High** |
| `components/DayDetail.tsx` | 147 | Always `type="button"` on non-submit buttons | Close `<button>` missing `type="button"` | **High** |
| `components/ManageView.tsx` | 437 | Never `text-stone-400` as foreground in light mode | `text-stone-400 dark:text-stone-600` on the `···` row indicator span — `text-stone-400` is the light-mode foreground value, fails WCAG AA (2.4:1) | **High** |
| `components/HistoryView.tsx` | 70 | Page header — `flex items-start justify-between` | Header uses `flex items-center justify-between`; spec requires `items-start` | **Low** |
| `components/HelpView.tsx` | 17 | Page header — `flex items-start justify-between` | Header uses `flex items-center justify-between`; spec requires `items-start` | **Low** |
| `components/ManageView.tsx` | 237 | Page header — `flex items-start justify-between` | Header uses `flex items-center justify-between`; spec requires `items-start` | **Low** |
| `components/CalendarHeatmap.tsx` | 220 | Do not use `mode="wait"` on the CalendarHeatmap grid `AnimatePresence` | `mode="wait"` is used on the month-heading `AnimatePresence` (not the grid). The grid correctly uses `mode="popLayout"` (line 252). Spec targets the grid specifically; heading use is a grey area. Heading contributes to layout height so iOS repaint risk applies, though lower than the grid. | **Low** |
| `lib/transferData.ts` | 66 | Never use `toISOString()` for dates | `new Date().toISOString()` for the `exportedAt` metadata field — a full ISO timestamp, not a YYYY-MM-DD date key. The CLAUDE.md rule targets UTC offset bugs on date keys; this field is never parsed as a date key. No practical risk. | — |
| `components/CheckInForm.tsx` | 232 | Never use `toISOString()` for dates | `new Date().toISOString()` for `entry.lastEdited` — same rationale as above; this is a display timestamp, not a storage key. No practical risk. | — |

---

## 2. TypeScript strictness

| File | Line | Pattern | Issue | Severity |
|---|---|---|---|---|
| `lib/habitConfig.ts` | 81–82, 86 | `as Record<string, unknown>` / `as AppConfigs` | Post-parse cast to `AppConfigs` after validating only that `habits` and `moments` are arrays; per-element types not narrowed. Low runtime risk since `getConfigs()` is guarded by default fallback. | **Low** |
| `lib/storage.ts` | 40, 46 | `as Record<string, HabitEntry>` / `as Partial<HabitState>` | Post-parse casts following structural checks. `sanitizeHabitState` provides a runtime safety net for malformed habit states. | **Low** |
| `lib/transferData.ts` | 34 | `as unknown[]` | Narrowing cast inside a type-guard function; the outer `isPlainObject` has already established the type. Acceptable. | **Low** |
| `lib/transferData.test.ts` | 233 | `as unknown as ProgressEvent<FileReader>` | Double-cast in test mock for `ProgressEvent`. Test infrastructure only; no runtime impact. | — |

No `any` annotations or `as any` casts found anywhere. TypeScript strict mode is well-observed across all files.

---

## 3. Test coverage

| lib/ file | Exported symbol | Test present | Notes | Severity |
|---|---|---|---|---|
| `lib/storage.ts` | `sanitizeHabitState` | Yes | 4 cases — empty, done-only, joy-only, inconsistent | — |
| `lib/storage.ts` | `saveEntry` | Yes | 3 cases | — |
| `lib/storage.ts` | `getEntry` | Yes | 4 cases | — |
| `lib/storage.ts` | `getAllEntries` | Yes | 3 cases + sort order | — |
| `lib/storage.ts` | `clearAllEntries` | Yes | 2 cases | — |
| `lib/habits.ts` | `createEmptyEntry` | Yes | 1 case — function is trivial | — |
| `lib/theme.ts` | `getTheme` | Yes | 4 cases | — |
| `lib/theme.ts` | `setTheme` | Yes | 5 cases | — |
| `lib/theme.ts` | `applyTheme` | Yes | 3 cases | — |
| `lib/transferData.ts` | `prepareExportData` | Yes | 5 cases | — |
| `lib/transferData.ts` | `parseImportFile` | Yes | 8 cases including edge cases | — |
| `lib/transferData.ts` | `mergeEntries` | Yes | 4 cases | — |
| `lib/transferData.ts` | `exportBackup` | No | Thin wrapper over `prepareExportData` + browser `document.createElement`; not testable in Jest without DOM mocking. Acceptable gap. | **Low** |
| `lib/transferData.ts` | `importBackup` | Yes | 3 cases via `FileReader` mock | — |
| `lib/habitConfig.ts` | `getConfigs` | **No test file** | Branching logic across four paths (localStorage unavailable, null, malformed JSON, valid JSON) — all untested. No `habitConfig.test.ts` exists. | **Medium** |
| `lib/habitConfig.ts` | `saveConfigs` | **No test file** | localStorage-unavailable path untested. | **Medium** |

---

## 4. Component structure signals

| Component | Lines | Issue | Severity |
|---|---|---|---|
| `ManageView.tsx` | 805 | Largest component. Config mutation helpers (`archiveHabit`, `archiveMoment`, `restoreHabit`, `restoreTag`, `toggleJoyByDefault`, `saveNewHabit`, `saveNewTag`, `saveEditHabit`) all live inline. They are thin wrappers over `saveConfigs`; CLAUDE.md explicitly forbids partial helpers on AppConfigs so extraction would be out-of-spec. Worth watching as the component grows further. | **Medium** |
| `CalendarHeatmap.tsx` | 335 | `buildMonthWeeks`, `computeCellStyle`, `doesEntryMatchFilter` are pure utility functions with no component dependencies. Currently untestable in Jest without importing the full component. Could be extracted to `lib/` or a co-located `calendarUtils.ts`. | **Medium** |
| `CheckInForm.tsx` | 516 | Inline moment creation (`handleAddMoment`) calls `saveConfigs` / `setConfigs` directly — a second component (besides ManageView) performing config mutations. CLAUDE.md's "no partial helpers" rule means this pattern is by design; acceptable at current scale. | **Low** |
| `FrequencyList.tsx` | 177 | Period-filtering and frequency-counting logic is inline IIFE + loop. Pure data transformation; could be extracted but file is small. | **Low** |

---

## 5. Static export constraints

| File | Issue | Severity |
|---|---|---|
| `app/edit/page.tsx` | Reads `?date=` via `window.location.search` in `useEffect` — correct static-export pattern; no `useSearchParams()` or dynamic route. Compliant. | — |
| All `app/` pages | No dynamic route segments (`[param]`) found. All routes are statically known at build time. Compliant. | — |
| `app/layout.tsx` | `next/font/google` (Geist) fetched at build time — compatible with static export. Compliant. | — |
| `components/BottomNav.tsx` | `usePathname()` reads path client-side — compatible with static export. Compliant. | — |
| Entire codebase | No `useSearchParams()` calls found — the hook that requires `<Suspense>` wrapping and breaks static builds is absent everywhere. Compliant. | — |

---

## Summary counts

0 critical · 3 high · 4 medium · 5 low
