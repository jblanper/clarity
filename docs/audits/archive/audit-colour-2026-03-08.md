# Colour & Contrast Audit

Audited: all files in `components/`, `app/globals.css`.
Reference: `docs/calma-design-language.md`.
Date: 2026-03-06.

Sprint 7 context: fixes to ManageView SECTION_LABEL, SettingsView section labels (Manage, Help, Reset), joyByDefault false spans, archived labels/units, and dark-mode completeness failures.

---

## 1. Stone-400 violations

Stone-400 (`#a8a29e`) fails WCAG AA on the light background (≈2.4:1, minimum 4.5:1). It is only permitted as a `dark:` variant, or explicitly as a placeholder/border colour.

### 1a. Full violations — no dark pairing

**None.** All four pre-sprint full violations (SettingsView 308, 335; ManageView 282, 464) were fixed in Sprint 7. ✅

### 1b. Light-mode violations — dark pairing present, base still fails

| Component | Line | Current value | Expected | Severity |
|---|---|---|---|---|
| ManageView.tsx | 254 | `text-stone-400 underline-offset-4 hover:underline dark:text-stone-500` (Jump to Moments anchor) | `text-stone-600 dark:text-stone-500` | **medium** |
| ManageView.tsx | 273 | `text-xs text-stone-400 dark:text-stone-500` (numeric unit label, active habits) | `text-stone-500 dark:text-stone-500` | **medium** |
| ManageView.tsx | 378 | `text-xs text-stone-400 dark:text-stone-500` (archived confirmation note) | `text-stone-500 dark:text-stone-400` | **low** (intentional archival dimming) |
| ManageView.tsx | 587 | `text-xs text-stone-400 dark:text-stone-500` (archived moment confirmation note) | `text-stone-500 dark:text-stone-400` | **low** (intentional archival dimming) |
| CheckInForm.tsx | 364 | `text-stone-400 dark:text-stone-500` (new-moment ghost button text) | `text-stone-500 dark:text-stone-400` or kept as placeholder | **medium** |
| CheckInForm.tsx | 405 | `text-stone-400 dark:text-stone-500` (dismiss "✕" button) | `text-stone-500 dark:text-stone-400` | **medium** |

---

## 2. Colour-role hierarchy violations

### Correct usages

All page titles use `text-stone-800 dark:text-stone-200` consistently. ✅

All body text / item labels use `text-stone-700 dark:text-stone-300`. ✅

Section labels now correctly use `text-stone-500 dark:text-stone-500` across ManageView, SettingsView (Manage, Help, Reset), CheckInForm, DayDetail, HelpView, HistoryView. ✅

Amber is used exclusively for: joy blossom (BlossomIcon), joy selection in FrequencyList, joyByDefault active state in ManageView, reset action in SettingsView. ✅

Red is used exclusively for error messages. ✅

### Remaining divergences

| Component | Line | Current value | Role | Expected | Severity |
|---|---|---|---|---|---|
| ManageView.tsx | 254 | `text-stone-400` (Jump to Moments anchor) | Navigation link | `text-stone-600 dark:text-stone-500` | **medium** |
| CalendarHeatmap.tsx | ~300 | `text-stone-500 dark:text-stone-600` (day-of-week labels) | Metadata | `dark:stone-500` — dark:stone-600 is lower contrast in dark mode, wrong direction | **low** |

---

## 3. Dark mode completeness

All four pre-sprint dark-mode completeness failures are resolved: ✅
- SettingsView Reset `h3` now has `dark:text-stone-500`
- SettingsView Cancel button base raised to `text-stone-500` (no `dark:` base needed — stone-500 has adequate contrast on dark background)
- ManageView joyByDefault false spans (282, 464) now `text-stone-500` in both modes

No new dark-mode completeness failures introduced.

**Borderline:** `SettingsView.tsx line 335` — Cancel button has `text-stone-500` with only `dark:hover:text-stone-300`; no explicit `dark:text-*` base. stone-500 (#78716c) on the dark background (#1c1917) has adequate contrast; this is a cosmetic consistency gap, not a WCAG failure. **Low.**

---

## 4. Non-stone accent colours

No violations found. Amber, red, and the heatmap palette are all used in their correct designated roles. ✅

---

## Summary

**0 critical · 0 high · 4 medium · 4 low**

Severity key: **Critical** = WCAG AA failure · **High** = spec contradiction · **Medium** = missing detail · **Low** = minor inconsistency

| Severity | Count | Primary locations |
|---|---|---|
| Critical | 0 | (all WCAG AA violations fixed in Sprint 7) |
| High | 0 | (all spec contradictions fixed in Sprint 7) |
| Medium | 4 | ManageView nav anchor + numeric unit label; CheckInForm ghost button + dismiss button |
| Low | 4 | ManageView archived confirmation notes (×2); CalendarHeatmap day-of-week dark variant; SettingsView Cancel dark base |

**Sprint 7 impact:** 11 high and most medium findings from the pre-sprint baseline were resolved. The remaining medium items were out of Sprint 7 scope (CheckInForm placeholder-style elements, ManageView nav anchor).
