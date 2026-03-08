# Architecture & Code Health Audit

Date: 2026-03-08
Scope: components/ · app/ · lib/ · types/
Reference: CLAUDE.md

---

## Summary

No critical or high findings. All Sprint 8 CLAUDE.md violations are resolved. Three pre-existing medium findings remain: two foreground `text-stone-400` in light mode (ManageView "Archived" confirmations and HistoryView period selectors), and missing test coverage for `habitConfig.ts` and `habits.ts`. ManageView and CheckInForm are large components worth watching but hold no actionable logic-extraction case yet.

Severity key: **Critical** = data loss risk or build-breaking constraint violation
· **High** = CLAUDE.md rule violation · **Medium** = structural signal worth addressing
· **Low** = minor deviation

---

## 1. CLAUDE.md compliance

| File | Line | Rule | Issue | Severity |
|---|---|---|---|---|
| `components/ManageView.tsx` | 380, 590 | No `text-stone-400` foreground in light mode | "Archived. Past entries are preserved." confirmation uses `text-stone-400 dark:text-stone-500` — stone-400 is light-mode foreground. Pre-existing. | Medium |
| `components/HistoryView.tsx` | 129, 134, 139 | No `text-stone-400` foreground in light mode | Inactive period selector buttons use `text-stone-400 dark:text-stone-500`. Pre-existing. | Medium |
| `components/CheckInForm.tsx` | 231 | Never use `toISOString()` for dates | `entry.lastEdited = new Date().toISOString()` — used for a timestamp field, not a YYYY-MM-DD key. Acceptable in intent but technically violates the literal rule. Pre-existing. | Low |

## 2. TypeScript strictness

| File | Line | Pattern | Issue | Severity |
|---|---|---|---|---|
| — | — | — | No `: any`, `as any`, or unsafe casts found across components/, lib/, app/, or types/. | — |

## 3. Test coverage

| lib/ file | Exported symbol | Test present | Notes | Severity |
|---|---|---|---|---|
| `habitConfig.ts` | `getConfigs()` | No | No test file for habitConfig. Pre-existing gap. | Medium |
| `habitConfig.ts` | `saveConfigs()` | No | Same. | Medium |
| `habits.ts` | `createEmptyEntry()` | No | No test for the entry factory. Pre-existing gap. | Low |
| `storage.ts` | all exports | Yes | `storage.test.ts` covers all exported functions. | — |
| `transferData.ts` | all exports | Yes | `transferData.test.ts` covers all paths including error branches. | — |
| `theme.ts` | all exports | Yes | `theme.test.ts` covers toggle and init. | — |

## 4. Component structure signals

| Component | Lines | Issue | Severity |
|---|---|---|---|
| `ManageView.tsx` | 657 | Large; contains all inline form state for add-habit, edit-habit, add-moment, edit-moment flows. Logic is UI-state only — no data manipulation — so extraction is not urgent. Worth watching. | Low |
| `CheckInForm.tsx` | 507 | Large; orchestrates today/edit mode, joy section, moment input. Same pattern — UI state only. | Low |

## 5. Static export constraints

| File | Issue | Severity |
|---|---|---|
| `app/edit/page.tsx` | Uses `"use client"` with `useEffect` + `window.location.search` — the documented pattern for query param reading in static export (avoids `useSearchParams` + Suspense). Correct. | — |
| All other `app/` pages | Server components; no dynamic routes without `generateStaticParams`. | — |

---

## Summary counts

0 critical · 0 high · 4 medium · 3 low
