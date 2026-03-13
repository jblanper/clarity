# Typography & Spacing Audit — Clarity × Calma

**Date:** 2026-03-13
**Scope:** All component and page files
**Reference:** `docs/calma-design-language.md` (source of truth)

Sprint 9 context: Task 3 replaced the HabitToggle OS switch with a full-row `<button>`; label text remains `text-sm text-stone-700 dark:text-stone-300` (unchanged from Sprint 8 fix). Task 4 replaced the NumberStepper three-zone input with a tap-to-increment pill; label `text-sm` and unit `text-xs` are unchanged; the pill displays the value at `text-sm` equivalent (inheriting default). Task 5 added "Start at" fields in ManageView using the `FIELD_LABEL` constant (`text-xs text-stone-500 dark:text-stone-400`), consistent with existing "Increment" and "Unit" field labels.

---

## Summary

Sprint 9 introduced no new typography violations. All prior medium findings from Sprint 8 remain resolved. The three pre-existing low findings carry forward unchanged. Section label pattern is correct across all components including new ManageView "Start at" labels. No `font-bold` or `font-semibold` exists anywhere.

Severity key: **Critical** = WCAG AA failure or outright spec contradiction · **High** = systemic gap · **Medium** = missing detail · **Low** = minor inconsistency

---

## 1. Section label pattern

Canonical pattern: `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`

### 1.1 — All section labels passing

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

### 1.2 — New Sprint 9 field labels

The "Start at" label in ManageView uses the `FIELD_LABEL` constant: `text-xs text-stone-500 dark:text-stone-400`. This is the inline form label style (not a section heading), consistent with all other ManageView field labels ("Label", "Unit", "Increment"). Both the inline-edit form and the add-habit form use the same constant — no divergence. ✅

Note: `FIELD_LABEL` (`text-xs text-stone-500 dark:text-stone-400`) differs from the section label (`SECTION_LABEL`) by design — field labels are subordinate to their containing form cards and don't need `font-medium uppercase tracking-widest`. This is correct usage.

### 1.3 — Remaining violations

**None.** All section labels across the codebase match the canonical six-part pattern. ✅

---

## 2. Type scale — weight violations

**No `font-bold` or `font-semibold` found anywhere in the codebase.** ✅

All `font-medium` instances are intentional (active-state period selector, section labels, data emphasis). No violations.

---

## 3. Section headings and body text

### 3.1 — HabitToggle label (Sprint 9 redesign)

| Component | Line | Current | Status |
|---|---|---|---|
| `HabitToggle.tsx` | 40 | `text-sm text-stone-700 dark:text-stone-300` | ✅ Unchanged from Sprint 8 fix; correct |

The redesign removed the old outer `div`, inner pill, and thumb spans. The label `<span>` retains the correct `text-sm` class. No regression.

### 3.2 — NumberStepper labels (Sprint 9 redesign)

| Component | Line | Current | Status |
|---|---|---|---|
| `NumberStepper.tsx` | 45 | `text-sm text-stone-700 dark:text-stone-300` (habit label) | ✅ Unchanged from Sprint 8 fix; correct |
| `NumberStepper.tsx` | 46 | `text-xs text-stone-500 dark:text-stone-500` (unit label) | ✅ Appropriate metadata sizing |
| `NumberStepper.tsx` | 66 | Pill button value — no explicit `text-*` size | Inherits `text-sm` from browser default for `<button>` — functionally acceptable; could be made explicit. **Low.** |

The redesign removed the `<input>` field entirely. The pill button renders the numeric value without an explicit `text-sm` class. Browser default for `<button>` is typically equivalent to `text-sm` / 14px in a `text-sm` context. Low-severity note for future cleanup.

### 3.3 — DayDetail date heading ✅

| Component | Line | Current | Status |
|---|---|---|---|
| `DayDetail.tsx` | 161 | `text-base font-light tracking-widest text-stone-800 dark:text-stone-200` | ✅ Fixed in Sprint 8; unchanged |

### 3.4 — Reflective text ✅

| Component | Line | Current | Status |
|---|---|---|---|
| `CheckInForm.tsx` | 486 | `text-sm font-light text-stone-700 dark:text-stone-300` | ✅ Fixed in Sprint 8; unchanged |

---

## 4. Vertical rhythm

### 4.1 — ManageView header spacing ✅

ManageView header uses `mb-6` — correct. ✅

### 4.2 — CheckInForm section label margin ✅

All five section labels use `mb-3` — consistent. ✅

### 4.3 — SettingsView section spacing: `mb-8` vs Calma baseline

| Component | Lines | Current | Notes | Severity |
|---|---|---|---|---|
| `SettingsView.tsx` | 119, 135, 168, 291, 307 | `mb-8` on all sections | Consistent internally; explicit border dividers compensate | **low** (pre-existing) |

---

## 5. Max width and layout

**All page-level containers consistently apply `max-w-md`.** ✅ No horizontal scrolling risk found.

---

## Consolidated findings

### Critical — 0

### High — 0

### Medium — 0

All six medium findings from the Sprint 7 baseline and zero from Sprint 8 baseline to carry forward. Sprint 9 introduced no new medium findings.

### Low — 4

| ID | Component | Line | Current | Expected | Status |
|---|---|---|---|---|---|
| L2 | `CalendarHeatmap.tsx` | ~230 | Year display `text-sm uppercase tracking-widest` | `text-xs uppercase tracking-widest` | Pre-existing |
| L3 | `SettingsView.tsx` | sections | `mb-8` spacing (vs Calma baseline 2.5rem) | Dividers compensate; low impact | Pre-existing |
| L4 | `DayDetail.tsx` | ~200 | Numeric value `font-medium` | Borderline — acceptable for data emphasis | Pre-existing |
| L5 | `NumberStepper.tsx` | 66 | Pill button value — no explicit `text-sm` class | Add `text-sm` for explicitness | **New — Sprint 9** |

---

## Summary counts

**0 critical · 0 high · 0 medium · 4 low**

Sprint 9 introduced one new low finding (NumberStepper pill value has no explicit `text-sm` class). Three pre-existing lows carry forward. No regressions on sprint-8 fixes. No new medium or high findings.
