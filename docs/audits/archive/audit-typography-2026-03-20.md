# Typography & Spacing Audit

Generated: 2026-03-17 10:42
Scope: All component and page files
Reference: docs/calma-design-language.md

Archive note: Pre-sprint snapshot preserved as `docs/audits/archive/audit-typography-2026-03-17.md`. Sprint 13 baseline: 0 critical · 0 high · 0 medium · 5 low.

Sprint 14 context: CalendarHeatmap refactored to typographic date-as-weight calendar (font weight as data channel, amber for joy/moments, legend row). FrequencyList bar refinement. SegmentedPill period selector in HistoryView. Conditional year row.

---

## Summary

Full compliance across all typography and spacing checks. Sprint 14's CalendarHeatmap refactor correctly uses font weight as a data-encoding channel on date cells (font-light → font-bold) — intentional design, not a spec violation. All section labels contain all six required parts. All touch targets meet the 44px minimum. Max-width constraints consistently applied. The 5 pre-existing Low findings from Sprint 13 carry forward unchanged.

Severity key: Critical = WCAG AA failure or outright spec contradiction
· High = systemic gap · Medium = missing detail · Low = minor inconsistency

---

## 1. Section label pattern

Canonical pattern: `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`

All six parts present in every section label across the codebase. ✅

| Component | Line(s) | Status |
|---|---|---|
| `CheckInForm.tsx` | 281, 309, 341, 472 | ✅ All six parts correct |
| `DayDetail.tsx` | 174, 193, 210, 230, 249 | ✅ All six parts correct |
| `HistoryView.tsx` | 118 | ✅ All six parts correct |
| `ManageView.tsx` | 253, 607 | ✅ All six parts correct |
| `SettingsView.tsx` | 124, 141, 166, 287 | ✅ All six parts correct |
| `HelpView.tsx` | `SECTION_LABEL` constant | ✅ Shared constant, all six parts correct |

No violations.

## 2. Type scale — weight violations

| Component | Line | Value | Issue | Severity |
|---|---|---|---|---|
| All components | — | — | No violations. | ✅ Pass |

Intentional data-encoding (not violations): `CalendarHeatmap.tsx` weight classes (`font-light`, `font-normal`, `font-semibold`, `font-bold`) on date numbers encode habit completion fraction — by design per Sprint 14. Legend row sample numbers: `font-light` / `font-bold` — by design. `SegmentedPill.tsx` active segment `font-medium` — interaction state emphasis (permitted). `BottomNav.tsx` active link `font-medium` — navigation emphasis (permitted).

## 3. Touch target violations

| Component | Line | Element | Issue | Severity |
|---|---|---|---|---|
| All sprint-14 additions | — | — | No new violations. | ✅ Pass |
| `ManageView.tsx` | 406, 677 | Archived disclosure toggles `py-1` only | No `min-h-[44px]` — secondary low-priority controls | **Low** (pre-existing) |
| ManageView action tray buttons | — | Secondary inline pill buttons | No explicit `min-h` | **Low** (pre-existing) |

All primary interactive elements (HabitToggle, NumberStepper, MomentChip, ManageView/SettingsView buttons, FrequencyList rows, SegmentedPill segments, BottomNav links) meet `min-h-[44px]`. ✅

## 4. Vertical rhythm inconsistencies

| Component | Lines | Issue | Severity |
|---|---|---|---|
| All components | — | Consistent throughout: section gaps `mb-10`, section label margins `mb-3`, SegmentedPill spacing `mt-5 mb-6`. No asymmetries. | ✅ Pass |

## 5. Max width / layout issues

| Component | Line | Issue | Severity |
|---|---|---|---|
| All pages | — | All correctly constrained to `max-w-md`. | ✅ Pass |

CheckInForm `max-w-md px-5`, DayDetail `max-w-md px-6`, HistoryView `max-w-md px-5`, ManageView `max-w-md px-5`, SettingsView `max-w-md px-5`, HelpView `max-w-md px-5`. ✅

---

## Consolidated findings

### Critical — 0

### High — 0

### Medium — 0

### Low — 5 (all pre-existing, unchanged from Sprint 13)

| ID | Component | Line | Issue | Status |
|---|---|---|---|---|
| L1 | `ManageView.tsx` | 406, 677 | Archived disclosure toggles `py-1` only, no `min-h-[44px]` | Pre-existing (Sprint 13) |
| L2 | `CalendarHeatmap.tsx` | year row | Year display `text-sm uppercase tracking-widest` (expected `text-xs`) | Pre-existing — year row now conditional; still applies when shown |
| L3 | `SettingsView.tsx` | sections | `mb-8` section spacing vs. `mb-10` used elsewhere | Pre-existing |
| L4 | `DayDetail.tsx` | ~200 | Numeric value `font-medium` — borderline but acceptable | Pre-existing |
| L5 | `NumberStepper.tsx` | 66 | Pill button value lacks explicit `text-sm` class | Pre-existing (Sprint 9) |

---

## Summary counts

**0 critical · 0 high · 0 medium · 5 low**

Sprint 14 introduced no new typography findings. All 5 Low findings carry forward from Sprint 13 unchanged.
