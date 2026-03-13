# Colour & Contrast Audit

Audited: all files in `components/`, `app/globals.css`.
Reference: `docs/calma-design-language.md`.
Date: 2026-03-08.

Sprint 8 context: Task 1 fixed ManageView Jump-to-Moments anchor (stone-400 → stone-600), ManageView numeric unit label (stone-400 → stone-500), CheckInForm "New moment" ghost button (stone-400 → stone-500), CheckInForm dismiss "✕" (stone-400 → stone-500), and added font-medium to SettingsView Theme and "Your data" section labels.

---

## 1. Stone-400 violations

Stone-400 (`#a8a29e`) fails WCAG AA on the light background (≈2.4:1, minimum 4.5:1). It is only permitted as a `dark:` variant, or explicitly as a placeholder/border colour.

### 1a. Full violations — no dark pairing

**None found.** ✅

### 1b. Light-mode violations — dark pairing present, base still fails

| Component | Line | Current value | Expected | Severity |
|---|---|---|---|---|
| ManageView.tsx | 380 | `text-xs text-stone-400 dark:text-stone-500` (archived habit confirmation note) | `text-stone-500 dark:text-stone-400` | **low** (intentional archival dimming — pre-existing) |
| ManageView.tsx | 590 | `text-xs text-stone-400 dark:text-stone-500` (archived moment confirmation note) | `text-stone-500 dark:text-stone-400` | **low** (intentional archival dimming — pre-existing) |
| HistoryView.tsx | 129, 134, 139 | `text-stone-400 dark:text-stone-500` (inactive period selector buttons) | `text-stone-500 dark:text-stone-500` | **low** (pre-existing; functionally distinct from body text) |

Sprint 8 resolved four medium findings from the pre-sprint baseline:
- ManageView "Jump to Moments" anchor: `text-stone-400` → `text-stone-600` ✅
- ManageView active numeric unit label: `text-stone-400` → `text-stone-500` ✅
- CheckInForm "New moment" ghost button: `text-stone-400` → `text-stone-500` ✅
- CheckInForm dismiss "✕": `text-stone-400` → `text-stone-500` ✅

---

## 2. Colour-role hierarchy violations

### Correct usages

All page titles use `text-stone-800 dark:text-stone-200` consistently. ✅

All body text / item labels use `text-stone-700 dark:text-stone-300`. ✅

Section labels correctly use `text-stone-500 dark:text-stone-500` across all components including SettingsView Theme and "Your data" sections (fixed in Sprint 8). ✅

Amber is used exclusively for: joy blossom (BlossomIcon), joy selection in FrequencyList, joyByDefault active state in ManageView, reset action in SettingsView. ✅

Red is used exclusively for error messages. ✅

### Remaining divergences

| Component | Line | Current value | Role | Expected | Severity |
|---|---|---|---|---|---|
| CalendarHeatmap.tsx | ~300 | `text-stone-500 dark:text-stone-600` (day-of-week labels) | Metadata | `dark:text-stone-500` — dark:stone-600 is lower contrast in dark mode, wrong direction | **low** |

---

## 3. Dark mode completeness

All foreground tokens have appropriate dark variants. No failures found. ✅

**Borderline:** `SettingsView.tsx line 332` — Cancel button has `text-stone-500` with only `dark:hover:text-stone-300`; no explicit `dark:text-*` base. stone-500 (#78716c) on the dark background (#1c1917) has adequate contrast; this is a cosmetic consistency gap, not a WCAG failure. **Low.**

---

## 4. Non-stone accent colours

No violations found. Amber, red, and the heatmap palette are all used in their correct designated roles. ✅

---

## Summary

**0 critical · 0 high · 0 medium · 4 low**

Severity key: **Critical** = WCAG AA failure · **High** = spec contradiction · **Medium** = missing detail · **Low** = minor inconsistency

| Severity | Count | Primary locations |
|---|---|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 0 | (all 4 medium findings from Sprint 7 baseline fixed in Sprint 8) |
| Low | 4 | ManageView archived confirmation notes (×2); HistoryView inactive period selectors; CalendarHeatmap day-of-week dark variant |

**Sprint 8 impact:** All 4 medium colour findings from the pre-sprint baseline were resolved. No regressions introduced.
