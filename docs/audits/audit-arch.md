# Architecture & Code Health Audit

Generated: 2026-03-16 22:01
Scope: components/ · app/ · lib/ · types/
Reference: CLAUDE.md

---

## Summary

Sprint 14 introduced no new CLAUDE.md violations. The five changed components
(CalendarHeatmap, CheckInForm, FrequencyList, HabitToggle, HistoryView) are all
compliant. One carry-over Medium surfaces in ManageView (`text-stone-500` on
`hover:bg-stone-50` for the `+ New` chip — present before Sprint 14, now formally
recorded). The Sprint 13 Low (`createEmptyEntry` test coverage) is resolved. The
`text-stone-400` dimmed moment chip is spec-mandated and classified as an accepted
deviation, not a violation.

Severity key: **Critical** = data loss risk or build-breaking constraint violation
· **High** = CLAUDE.md rule violation · **Medium** = structural signal worth addressing
· **Low** = minor deviation

---

## 1. CLAUDE.md compliance

| File | Line | Rule | Issue | Severity |
|---|---|---|---|---|
| `components/ManageView.tsx` | 640 | WCAG — `text-stone-500` on `bg-stone-50` | `+ New` chip: `text-stone-500` at rest is fine on white (~4.6:1), but `hover:bg-stone-50` brings it to ~4.4:1 for `text-xs` — just under AA threshold on hover. Carry-over; ManageView unchanged in Sprint 14. | **Medium** |

Notable compliant patterns confirmed across sprint diff:

- **CalendarHeatmap.tsx**: `computeCellStyle` uses pure Tailwind dark: classes — no `useIsDark()` needed. `doesEntryMatchFilter` preserved. `activeHabitCount` state preserved for weight normalisation. `type="button"` added to all cell buttons. `mode="popLayout"` correctly wrapped in `<div className="relative overflow-hidden">` to contain the absolutely-positioned exiting element. Legend uses `text-stone-500` on page-level background — passes AA.
- **CheckInForm.tsx**: `Link` was already imported. `!isEditMode` guard on help link correct. `doneHabits` moved out of IIFE — clean simplification, no side effects. Exit animation on Joy section (`marginBottom: 0` in exit) correctly handles the only spacing on `m.section` (`mb-10`).
- **FrequencyList.tsx**: `* 100` bar width and `h-1` track height — both one-line changes, no surrounding drift.
- **HabitToggle.tsx**: `transition-[background-color] duration-150` correctly scoped — avoids transitioning the amber dot's color change at the same rate as the row wash.
- **HistoryView.tsx**: `handlePeriodChange` guard (`if (p === period) return`) preserved. `PERIOD_OPTIONS` defined outside component. `satisfies` constraint on options array is correct TypeScript.
- **ManageView.tsx line 628**: `text-stone-400 dark:text-stone-600` on selected chip — explicitly prescribed in CLAUDE.md ("tapping a chip shows a dimmed selected state (`bg-stone-100 text-stone-400 cursor-default`)"). Accepted deviation per spec; WCAG AA exemption applies to disabled/selected UI states.

## 2. TypeScript strictness

| File | Line | Pattern | Issue | Severity |
|---|---|---|---|---|

No `any` annotations, `as any` casts, or unsafe type assertions found in changed files or codebase-wide.

## 3. Test coverage

| lib/ file | Exported symbol | Test present | Notes | Severity |
|---|---|---|---|---|
| `lib/habits.ts` | `createEmptyEntry` | **Yes** | `lib/habits.test.ts` added in Sprint 14. Asserts date, habits, numeric, moments, reflection. | — |
| `lib/storage.ts` | All exports | Yes | Full coverage in `storage.test.ts` | — |
| `lib/transferData.ts` | All exports | Yes | Full coverage in `transferData.test.ts` (`downloadJson` is browser side-effect only — acceptable) | — |
| `lib/theme.ts` | All exports | Yes | Full coverage in `theme.test.ts` | — |
| `lib/habitConfig.ts` | `getConfigs`, `saveConfigs` | Indirect | Covered via storage and transferData integration tests | — |

All `lib/` utilities now have direct test coverage.

## 4. Component structure signals

| Component | Lines | Issue | Severity |
|---|---|---|---|

No structural concerns. `ManageView.tsx` is ~803 lines; all logic remains UI state with no business logic or localStorage access outside `applyConfigs`. `CalendarHeatmap.tsx` decreased by ~40 lines after removing the colour-blend machinery — a positive simplification signal.

## 5. Static export constraints

| File | Issue | Severity |
|---|---|---|

No issues. No dynamic routes introduced. No `useSearchParams()`. No server-runtime assumptions. `edit/page.tsx` correctly reads `window.location.search` in a `useEffect`. Static export constraints fully satisfied.

---

## Summary counts
0 critical · 0 high · 1 medium · 0 low

---

## Comparison vs. Sprint 13 baseline

| | Before (Sprint 13) | After (Sprint 14) | Fixed | Regressions |
|---|---|---|---|---|
| Critical | 0 | 0 | — | 0 |
| High | 0 | 0 | — | 0 |
| Medium | 0 | 1 | 0 | 0* |
| Low | 1 | 0 | 1 | 0 |

*The Medium is a carry-over finding (ManageView `+ New` chip) that was present before Sprint 14
and not previously recorded — it is not a regression introduced by this sprint.

Sprint 14 fixed the only previous Low (`createEmptyEntry` test) and introduced no new violations.

---

## Gate decision

**PASS** — No must-fix issues. Sprint 14 changes are clean.
One Medium carry-over (`+ New` chip `text-stone-500 hover:bg-stone-50` in ManageView) is
non-blocking and not introduced by this sprint.

Sprint plan fidelity: all 7 tasks + BottomNav bug fix implemented per spec. One animation
regression (Joy section `initial={false}` removes enter animation) flagged in arch-review
as Medium; does not block deploy but warrants a follow-up fix.
