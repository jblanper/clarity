# Typography & Spacing Audit — Clarity × Calma

**Date:** 2026-03-06
**Scope:** All component and page files
**Reference:** `docs/calma-design-language.md` (source of truth)

Sprint 7 context: added `font-medium` to section labels across CheckInForm, ManageView, SettingsView (Manage/Help/Reset), DayDetail, HelpView; corrected ManageView header spacing; fixed `mb-1 → mb-3` on Habits and By the Numbers; added `font-light` to HelpView `BODY` constant; added `font-medium` to HistoryView frequency toggle.

---

## Summary

Sprint 7 resolved all four WCAG-critical stone-400 failures and closed the systemic `font-medium` gap on section labels across the majority of the codebase. Two SettingsView section labels (Theme, Your data) were missed in the sprint. Several medium-severity role-declaration items remain deferred. No `font-bold` or `font-semibold` anywhere — that constraint is clean.

Severity key: **Critical** = WCAG AA failure or outright spec contradiction · **High** = systemic gap · **Medium** = missing detail · **Low** = minor inconsistency

---

## 1. Section label pattern

Canonical pattern: `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`

### 1.1 — Resolved (Sprint 7)

All six previously failing section-label sites have been fixed:
- `ManageView.tsx` `SECTION_LABEL` const — now `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500` ✅
- `SettingsView.tsx` Manage `h2` — full 6-part pattern ✅
- `SettingsView.tsx` Help `h2` — full 6-part pattern ✅
- `SettingsView.tsx` Reset `h3` — full 6-part pattern ✅
- `CheckInForm.tsx` all five `h2` labels — all have `font-medium` ✅
- `DayDetail.tsx` all four `h3` labels — all have `font-medium` ✅
- `HelpView.tsx` `SECTION_LABEL` const — full 6-part pattern ✅
- `HistoryView.tsx` frequency toggle button — has `font-medium` ✅

### 1.2 — Remaining violations

| Component | Line | Current | Expected | Severity |
|---|---|---|---|---|
| `SettingsView.tsx` | 136 | `text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500` (Theme `h2`) | + `font-medium` | **medium** |
| `SettingsView.tsx` | 169 | `text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500` (Your data `h2`) | + `font-medium` | **medium** |

Sprint 7 fixed the three sprint-targeted SettingsView labels (Manage, Help, Reset). Theme and "Your data" were not in scope and remain. The sprint plan implementation notes explicitly called out these two as "already correct" — this was incorrect; they were missing `font-medium` but had the correct colour.

---

## 2. Type scale — weight violations

**No `font-bold` or `font-semibold` found anywhere in the codebase.** ✅

All `font-medium` instances are intentional (active-state indicators, section labels, data emphasis). No violations.

---

## 3. Section headings and body text

### 3.1 — DayDetail date heading: still oversized

| Component | Line | Current | Expected | Severity |
|---|---|---|---|---|
| `DayDetail.tsx` | 161 | `text-lg font-light tracking-wide text-stone-800 dark:text-stone-200` | `text-base font-light tracking-widest` | **medium** |

This was M5 in the pre-sprint baseline. Unchanged — deferred from Sprint 7.

### 3.2 — Body/item labels: missing explicit `text-sm`

| Component | Line | Current | Expected | Severity |
|---|---|---|---|---|
| `HabitToggle.tsx` | 24 | `text-stone-700 dark:text-stone-300` (label, no size) | `text-sm text-stone-700 dark:text-stone-300` | **medium** |
| `NumberStepper.tsx` | 63 | `text-stone-700 dark:text-stone-300` (label, no size) | `text-sm text-stone-700 dark:text-stone-300` | **medium** |

M1 and M2 from the pre-sprint baseline. Both labels are wrapped in `py-3.5` rows alongside `text-sm` siblings — visually correct, but the absence of an explicit size is fragile. Unchanged — deferred from Sprint 7.

### 3.3 — Reflective text: missing `font-light` in CheckInForm

| Component | Line | Current | Expected | Severity |
|---|---|---|---|---|
| `CheckInForm.tsx` | 483 | `text-stone-700 dark:text-stone-300` (reflection textarea, no size or weight) | `text-sm font-light` | **medium** |

M3 from the pre-sprint baseline. HelpView `BODY` was fixed in Sprint 7 (added `font-light`). The CheckInForm reflection textarea was not in the sprint scope. Deferred.

---

## 4. Vertical rhythm

### 4.1 — ManageView header spacing: resolved ✅

ManageView header changed from `mb-2` to `mb-6` in Sprint 7, matching the minimum threshold for page headers. ✅

### 4.2 — CheckInForm section label margin: resolved ✅

Habits and By the Numbers section labels changed from `mb-1` to `mb-3` in Sprint 7, matching Moments, Joy, and Reflection. All five section labels now use `mb-3`. ✅

### 4.3 — SettingsView section spacing: `mb-8` vs Calma baseline

| Component | Lines | Current | Notes | Severity |
|---|---|---|---|---|
| `SettingsView.tsx` | 119, 135, 168, 291, 307 | `mb-8` on all sections | Consistent internally; 8px below Calma baseline of 40px; explicit border dividers compensate | **low** |

Unchanged from pre-sprint. Low priority.

---

## 5. Max width and layout

**All page-level containers consistently apply `max-w-md`.** ✅ No horizontal scrolling risk found.

---

## Consolidated findings

### Critical — 0 (all fixed)

Previously: `text-stone-400` as section label text (ManageView SECTION_LABEL, SettingsView Manage/Help/Reset). All resolved in Sprint 7.

### High — 0 (all fixed)

Previously: systemic `font-medium` gap across CheckInForm, DayDetail, HelpView, ManageView, HistoryView, SettingsView. All resolved in Sprint 7 (SettingsView partially — see below).

### Medium — 6 remaining

| ID | Component | Line | Current | Expected |
|---|---|---|---|---|
| R1 | `SettingsView.tsx` | 136 | Theme `h2` missing `font-medium` | + `font-medium` |
| R2 | `SettingsView.tsx` | 169 | "Your data" `h2` missing `font-medium` | + `font-medium` |
| M1 | `HabitToggle.tsx` | 24 | Label — no `text-sm` | `text-sm` |
| M2 | `NumberStepper.tsx` | 63 | Label — no `text-sm` | `text-sm` |
| M3 | `CheckInForm.tsx` | 483 | Reflection textarea — no size or weight | `text-sm font-light` |
| M5 | `DayDetail.tsx` | 161 | Date heading `text-lg tracking-wide` | `text-base tracking-widest` |

### Low — 4 remaining

| ID | Component | Line | Current | Expected |
|---|---|---|---|---|
| L2 | `CalendarHeatmap.tsx` | ~230 | Year display `text-sm uppercase tracking-widest` | `text-xs uppercase tracking-widest` |
| L3 | `SettingsView.tsx` | sections | `mb-8` spacing (vs Calma baseline 2.5rem) | Dividers compensate; low impact |
| L4 | `DayDetail.tsx` | 200 | Numeric value `font-medium` | Borderline — acceptable |
| L5 | `SettingsView.tsx` | 248 | Import count `font-medium` | Borderline — acceptable |

---

## Summary counts

**0 critical · 0 high · 6 medium · 4 low**

Sprint 7 resolved all 4 critical and all 6 high findings from the pre-sprint baseline, plus 2 of the 6 pre-sprint medium findings (M4 HelpView font-light, M6 HistoryView toggle font-medium) and both low findings L1 (CheckInForm mb-1) and H6 (ManageView mb-2). Two previously-high SettingsView labels (Theme, Your data) remain with missing font-medium and are now medium severity.
