# Typography & Spacing Audit — Clarity × Calma

**Date:** 2026-03-08
**Scope:** All component and page files
**Reference:** `docs/calma-design-language.md` (source of truth)

Sprint 8 context: Task 1 added `font-medium` to SettingsView Theme and "Your data" `h2` labels (M3), corrected DayDetail date heading from `text-lg tracking-wide` to `text-base tracking-widest` (M2), added `text-sm font-light` to CheckInForm reflection textarea (M1), added explicit `text-sm` to HabitToggle and NumberStepper labels (Task 2 M17/M18).

---

## Summary

Sprint 8 closed all six remaining medium typography findings from the pre-sprint baseline. No `font-bold` or `font-semibold` exists anywhere. Section label pattern is now correct across all components. All targeted touch-target and label fixes have been applied.

Severity key: **Critical** = WCAG AA failure or outright spec contradiction · **High** = systemic gap · **Medium** = missing detail · **Low** = minor inconsistency

---

## 1. Section label pattern

Canonical pattern: `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`

### 1.1 — Resolved this sprint

- `SettingsView.tsx` Theme `h2` — now has `font-medium` ✅ (line 136)
- `SettingsView.tsx` "Your data" `h2` — now has `font-medium` ✅ (line 169)

### 1.2 — All other section labels passing

| Component | Status |
|---|---|
| `ManageView.tsx` `SECTION_LABEL` const | ✅ `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500` |
| `SettingsView.tsx` Manage `h2` | ✅ |
| `SettingsView.tsx` Help `h2` | ✅ |
| `SettingsView.tsx` Reset `h3` | ✅ |
| `SettingsView.tsx` Theme `h2` | ✅ (Sprint 8 fix) |
| `SettingsView.tsx` "Your data" `h2` | ✅ (Sprint 8 fix) |
| `CheckInForm.tsx` all five `h2` labels | ✅ |
| `DayDetail.tsx` all four `h3` labels | ✅ |
| `HelpView.tsx` `SECTION_LABEL` const | ✅ |
| `HistoryView.tsx` frequency toggle button | ✅ |

### 1.3 — Remaining violations

**None.** All section labels across the codebase now match the canonical six-part pattern. ✅

---

## 2. Type scale — weight violations

**No `font-bold` or `font-semibold` found anywhere in the codebase.** ✅

All `font-medium` instances are intentional (active-state indicators, section labels, data emphasis). No violations.

---

## 3. Section headings and body text

### 3.1 — DayDetail date heading: resolved ✅

| Component | Line | Current | Status |
|---|---|---|---|
| `DayDetail.tsx` | 161 | `text-base font-light tracking-widest text-stone-800 dark:text-stone-200` | ✅ Fixed in Sprint 8 |

### 3.2 — Body/item labels: resolved ✅

| Component | Line | Current | Status |
|---|---|---|---|
| `HabitToggle.tsx` | 24 | `text-sm text-stone-700 dark:text-stone-300` | ✅ Fixed in Sprint 8 |
| `NumberStepper.tsx` | 63 | `text-sm text-stone-700 dark:text-stone-300` | ✅ Fixed in Sprint 8 |

Note: NumberStepper unit label (line 64) correctly uses `text-xs text-stone-500 dark:text-stone-500` — appropriate metadata sizing for a unit display.

### 3.3 — Reflective text: resolved ✅

| Component | Line | Current | Status |
|---|---|---|---|
| `CheckInForm.tsx` | 484 | `text-sm font-light text-stone-700 dark:text-stone-300` | ✅ Fixed in Sprint 8 |

---

## 4. Vertical rhythm

### 4.1 — ManageView header spacing ✅

ManageView header uses `mb-6` — correct. ✅

### 4.2 — CheckInForm section label margin ✅

All five section labels use `mb-3` — consistent. ✅

### 4.3 — SettingsView section spacing: `mb-8` vs Calma baseline

| Component | Lines | Current | Notes | Severity |
|---|---|---|---|---|
| `SettingsView.tsx` | 119, 135, 168, 291, 307 | `mb-8` on all sections | Consistent internally; explicit border dividers compensate | **low** |

Unchanged from pre-sprint. Low priority.

---

## 5. Max width and layout

**All page-level containers consistently apply `max-w-md`.** ✅ No horizontal scrolling risk found.

---

## Consolidated findings

### Critical — 0

### High — 0

### Medium — 0

All six medium findings from the Sprint 7 baseline (R1, R2, M1, M2, M3, M5) have been resolved in Sprint 8.

### Low — 3 remaining

| ID | Component | Line | Current | Expected |
|---|---|---|---|---|
| L2 | `CalendarHeatmap.tsx` | ~230 | Year display `text-sm uppercase tracking-widest` | `text-xs uppercase tracking-widest` |
| L3 | `SettingsView.tsx` | sections | `mb-8` spacing (vs Calma baseline 2.5rem) | Dividers compensate; low impact |
| L4 | `DayDetail.tsx` | 200 | Numeric value `font-medium` | Borderline — acceptable for data emphasis |

---

## Summary counts

**0 critical · 0 high · 0 medium · 3 low**

Sprint 8 resolved all 6 remaining medium findings from the pre-sprint baseline. The three low findings are pre-existing and carry forward. No regressions introduced.
