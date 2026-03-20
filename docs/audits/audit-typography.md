# Typography & Spacing Audit

Generated: 2026-03-20 12:41
Scope: All component and page files
Reference: docs/calma-design-language.md

Archive note: Archived previous report → docs/audits/archive/audit-typography-2026-03-20.md. Sprint 14 baseline: 0 critical · 0 high · 0 medium · 5 low.

Sprint 15 context: All 5 pre-existing Low findings addressed. ManageView archived disclosure toggles now have `min-h-[44px]`. CalendarHeatmap year row corrected from `text-sm` to `text-xs`. SettingsView spacing updated from `mb-8` to `mb-10`. NumberStepper pill gains explicit `text-sm`. DayDetail numeric `font-medium` verified and closed.

---

## Summary

All typography and spacing checks pass. Sprint 15 closed all five pre-existing Low findings: touch targets on archived disclosure toggles, CalendarHeatmap year row size, SettingsView section spacing, and NumberStepper pill size. The DayDetail numeric `font-medium` was verified as borderline but acceptable and closed without a code change. Zero open findings entering Sprint 16.

Severity key: Critical = WCAG AA failure or outright spec contradiction
· High = systemic gap · Medium = missing detail · Low = minor inconsistency

---

## 1. Section label pattern

Canonical pattern: `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`

All six parts present in every section label across the codebase. ✅

| Component | Line(s) | Status |
|---|---|---|
| `CheckInForm.tsx` | 281, 309, 341, 433, 472 | ✅ All six parts correct |
| `DayDetail.tsx` | 175, 194, 211, 231, 250 | ✅ All six parts correct |
| `HistoryView.tsx` | 118 | ✅ All six parts correct |
| `ManageView.tsx` | 253, 609 | ✅ All six parts correct |
| `SettingsView.tsx` | 124, 141, 166, 172, 192, 287 | ✅ All six parts correct |
| `HelpView.tsx` | `SECTION_LABEL` constant | ✅ Shared constant, all six parts correct |

Note: SettingsView `Backup` (line 172) and `Restore` (line 192) use the subsection label pattern with `uppercase` CSS class — source text is sentence case, rendering is uppercase. Correct. ✅

No violations.

## 2. Type scale — weight violations

| Component | Line | Value | Issue | Severity |
|---|---|---|---|---|
| All components | — | — | No violations. | ✅ Pass |

Intentional data-encoding (not violations): `CalendarHeatmap.tsx` weight classes (`font-light`, `font-normal`, `font-semibold`, `font-bold`) on date numbers encode habit completion fraction — by design. Legend row sample numbers: `font-light` / `font-bold` — by design. `SegmentedPill.tsx` active segment `font-medium` — interaction state emphasis (permitted). `BottomNav.tsx` active link `font-medium` — navigation emphasis (permitted).

DayDetail numeric value `font-medium` (line 217): carries display emphasis for a data value, not a label — borderline but accepted per arch review mediation. Verified and closed without code change. ✅

## 3. Touch target violations

| Component | Line | Element | Issue | Severity |
|---|---|---|---|---|
| All primary elements | — | — | No violations. | ✅ Pass |

Sprint 15 fixes verified:
- `ManageView.tsx` line 557: Archived habits disclosure toggle now has `min-h-[44px]` ✅
- `ManageView.tsx` line 762: Archived moments disclosure toggle now has `min-h-[44px]` ✅

All primary interactive elements (HabitToggle, NumberStepper, MomentChip, ManageView buttons, SettingsView buttons, FrequencyList rows, SegmentedPill segments, BottomNav links, CalendarHeatmap nav buttons) meet `min-h-[44px]`. ✅

ManageView action tray pill buttons (Edit, Archive, Joy — secondary inline controls): no explicit `min-h` but positioned inside a padded tray that provides adequate tap area via the tray's own padding. Noted as acceptable — these are secondary disclosure actions accessed only after a deliberate row tap.

## 4. Vertical rhythm inconsistencies

| Component | Lines | Issue | Severity |
|---|---|---|---|
| All components | — | Consistent throughout. No asymmetries. | ✅ Pass |

Sprint 15 fix verified: SettingsView `mb-8` → `mb-10` applied to all instances (sections and border-top dividers). Grep confirmed zero remaining `mb-8` instances in SettingsView. ✅

Section gaps consistent at `mb-10` across CheckInForm, SettingsView, HelpView. ManageView uses `mb-6` between sections (card-boxed layout — different context, intentional). ✅

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

### Low — 0 (all five pre-existing findings closed in Sprint 15)

| ID | Component | Line | Issue | Status |
|---|---|---|---|---|
| L1 | `ManageView.tsx` | 557, 762 | Archived disclosure toggles lacked `min-h-[44px]` | **Closed** — `min-h-[44px]` added Sprint 15 |
| L2 | `CalendarHeatmap.tsx` | year row | Year display was `text-sm`; expected `text-xs` | **Closed** — `text-xs` applied Sprint 15 |
| L3 | `SettingsView.tsx` | all `mb-8` | Section spacing was `mb-8` vs. `mb-10` used elsewhere | **Closed** — `mb-8` → `mb-10` replace_all Sprint 15 |
| L4 | `DayDetail.tsx` | 217 | Numeric value `font-medium` — borderline | **Closed** — verified acceptable, no code change |
| L5 | `NumberStepper.tsx` | 66 | Pill button value lacked explicit `text-sm` | **Closed** — `text-sm` added Sprint 15 |

---

## Summary counts

**0 critical · 0 high · 0 medium · 0 low**

Sprint 15 closed all 5 pre-existing Low findings. Zero open typography findings entering Sprint 16.
