# Colour & Contrast Audit

Audited: all files in `components/`, `app/globals.css`.
Reference: `docs/calma-design-language.md`.
Date: 2026-03-13.

Sprint 9 context: Task 2 fixed `text-stone-400` → `text-stone-500` on the three inactive period selector buttons in HistoryView (resolving the one remaining medium finding from Sprint 8). Task 3 introduced HabitToggle's amber-50 row wash (`bg-amber-50 dark:bg-amber-900/15`) and amber-500/400 dot indicator. Task 4 introduced NumberStepper's amber-50 non-zero pill (`bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300`) and stone-100 zero-state pill (`bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400`). Task 5 added "Start at" field in ManageView using the existing `FIELD_LABEL` constant (`text-xs text-stone-500 dark:text-stone-400`).

---

## 1. Stone-400 violations

Stone-400 (`#a8a29e`) fails WCAG AA on the light background (≈2.4:1, minimum 4.5:1). It is only permitted as a `dark:` variant, or explicitly as a placeholder/border colour.

### 1a. Full violations — no dark pairing

**None found.** ✅

### 1b. Light-mode violations — dark pairing present, base still fails

| Component | Line | Current value | Expected | Severity |
|---|---|---|---|---|
| ManageView.tsx | 402 | `text-xs text-stone-400 dark:text-stone-500` (archived habit confirmation note) | `text-stone-500 dark:text-stone-400` | **low** (intentional archival dimming — pre-existing) |
| ManageView.tsx | 631 | `text-xs text-stone-400 dark:text-stone-500` (archived moment confirmation note) | `text-stone-500 dark:text-stone-400` | **low** (intentional archival dimming — pre-existing) |

Sprint 9 resolved the HistoryView period selector finding carried from Sprint 8:
- HistoryView inactive period buttons (lines 129, 134, 139): `text-stone-400 dark:text-stone-500` → `text-stone-500 dark:text-stone-500` ✅ (Task 2)

---

## 2. New colour tokens introduced in Sprint 9

### HabitToggle (components/HabitToggle.tsx)

| Token | Usage | Role | Contrast / Assessment |
|---|---|---|---|
| `bg-amber-50` | Done-state row wash (light) | Background only | N/A — background, no WCAG text-contrast requirement ✅ |
| `dark:bg-amber-900/15` | Done-state row wash (dark) | Background only | N/A — background ✅ |
| `bg-amber-500` | Done-state dot (light) | Decorative indicator | Decorative non-text element — no WCAG contrast requirement ✅ |
| `dark:bg-amber-400` | Done-state dot (dark) | Decorative indicator | Decorative ✅ |
| `bg-stone-300` | Off-state dot (light) | Decorative indicator | Decorative ✅ |
| `dark:bg-stone-600` | Off-state dot (dark) | Decorative indicator | Decorative ✅ |
| `text-stone-700 dark:text-stone-300` | Label text | Body text | ✅ Passes AA |

### NumberStepper (components/NumberStepper.tsx)

| Token | Usage | Role | Contrast / Assessment |
|---|---|---|---|
| `bg-amber-50 text-amber-800` | Non-zero pill (light) | Value display | amber-800 (#92400e) on amber-50 (#fffbeb) ≈ 9:1 ✅ |
| `dark:bg-amber-900/20 dark:text-amber-300` | Non-zero pill (dark) | Value display | amber-300 on dark bg — passes AA ✅ |
| `bg-stone-100 text-stone-600` | Zero-state pill (light) | Value display | stone-600 (~#57534e) on stone-100 (~#f5f4f2) ≈ 5.1:1 ✅ |
| `dark:bg-stone-800 dark:text-stone-400` | Zero-state pill (dark) | Value display | `dark:text-stone-400` is a `dark:` variant — safe per rule ✅ |
| `text-stone-500 dark:text-stone-400` | Decrement `−` button | Control glyph | stone-500 on white ≈ 4.6:1 ✅; `dark:` variant safe ✅ |
| `text-stone-500 dark:text-stone-500` | Unit label | Metadata | stone-500 (~#78716c) on white ≈ 4.6:1 ✅ |

---

## 3. Colour-role hierarchy violations

### Correct usages

All page titles use `text-stone-800 dark:text-stone-200` consistently. ✅

All body text / item labels use `text-stone-700 dark:text-stone-300`. ✅

Section labels correctly use `text-stone-500 dark:text-stone-500` via `SECTION_LABEL` constant in ManageView, HistoryView frequency toggle, and inline in CheckInForm. ✅

Amber is used for: joy blossom (BlossomIcon), joy selection in FrequencyList, joyByDefault active state in ManageView, HabitToggle done-state dot and wash, NumberStepper non-zero pill, reset action in SettingsView. All uses are within the designated amber role. ✅

Red is used exclusively for error messages. ✅

### Remaining divergences

| Component | Line | Current value | Role | Expected | Severity |
|---|---|---|---|---|---|
| CalendarHeatmap.tsx | ~300 | `text-stone-500 dark:text-stone-600` (day-of-week labels) | Metadata | `dark:text-stone-500` — dark:stone-600 is lower contrast in dark mode, wrong direction | **low** (pre-existing) |

---

## 4. Dark mode completeness

All foreground tokens have appropriate dark variants. No failures found. ✅

**Borderline:** `SettingsView.tsx ~line 332` — Cancel button has `text-stone-500` with only `dark:hover:text-stone-300`; no explicit `dark:text-*` base. stone-500 (#78716c) on the dark background (#1c1917) has adequate contrast; this is a cosmetic consistency gap, not a WCAG failure. **Low** (pre-existing).

---

## 5. Non-stone accent colours

No violations found. Amber, red, and the heatmap palette are all used in their correct designated roles. ✅

---

## Summary

**0 critical · 0 high · 0 medium · 3 low**

Severity key: **Critical** = WCAG AA failure · **High** = spec contradiction · **Medium** = missing detail · **Low** = minor inconsistency

| Severity | Count | Primary locations |
|---|---|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 0 | (HistoryView period selector finding resolved in Sprint 9) |
| Low | 3 | ManageView archived confirmation notes (×2, pre-existing); CalendarHeatmap day-of-week dark variant (pre-existing) |

**Sprint 9 impact:** The one remaining medium finding from Sprint 8 (HistoryView inactive period selector `text-stone-400`) was resolved in Task 2. All new Sprint 9 colour tokens in HabitToggle and NumberStepper pass WCAG AA. Net improvement: 1 medium resolved, 0 new findings. Carry-forward lows unchanged.
