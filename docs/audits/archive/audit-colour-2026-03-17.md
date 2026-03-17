# Colour & Contrast Audit

Audited: all files in `components/`, `app/`, `app/globals.css`.
Reference: `docs/calma-design-language.md`.
Generated: 2026-03-15 (Sprint 13 validation)

Archive note: Pre-sprint snapshot preserved as `docs/audits/archive/audit-colour-2026-03-14.md` (Sprint 12 baseline). The current `docs/audits/audit-colour.md` as of Sprint 12 validation also serves as the before-state (0 critical · 0 high · 2 medium · 2 low).

---

## 1. Stone-400 violations

Stone-400 (`#a8a29e`) fails WCAG AA on the light background (≈2.4:1, minimum 4.5:1). It is only permitted as a `dark:` variant, or explicitly as a placeholder/border colour.

### 1a. Full violations — no dark pairing

**None found.** ✅

### 1b. Light-mode violations — dark pairing present, base still fails

**None found.** ✅

Sprint 13 Task 1 fixed the SegmentedPill inactive-segment contrast issue: `text-stone-500` → `text-stone-600 dark:text-stone-400`. stone-600 (#57534e) on stone-100 (#f5f5f4) ≈ 5.9:1 — passes AA. ✅

The `···` affordance in ManageView habit rows uses `text-stone-400 dark:text-stone-600`. This is a purely decorative, non-text chrome element conveying no semantic state — exempted from WCAG AA per non-text contrast rules. ✅

---

## 2. Sprint 13 colour token changes

### SegmentedPill.tsx — Task 1 fix (line 25)

| Token | Usage | Role | Contrast / Assessment |
|---|---|---|---|
| `text-stone-600 dark:text-stone-400` | Inactive segment | Unselected option | stone-600 (#57534e) on stone-100 (#f5f5f4) ≈ 5.9:1 ✅ **Passes AA** (was stone-500 ≈ 3.7:1 — Medium finding resolved) |

### SettingsView.tsx — Task 2 fix (line 307)

| Token | Usage | Role | Contrast / Assessment |
|---|---|---|---|
| `text-red-700 dark:text-red-400` | "Yes, start fresh" destructive confirm | Destructive action | red-700 (#b91c1c) on white ≈ 5.9:1 ✅; dark: red-400 on dark bg ✅ — correct per CLAUDE.md error colour spec |

### ManageView.tsx — Task 3/4/5 additions

| Token | Usage | Role | Contrast / Assessment |
|---|---|---|---|
| `···` `text-stone-400 dark:text-stone-600` | Decorative affordance glyph | Non-text chrome | Decorative — exempt from 4.5:1 text contrast. ✅ |
| `bg-stone-50 dark:bg-stone-800/50` | Active row wash | Background | Background only ✅ |
| `font-medium text-stone-800 dark:text-stone-100` | Active row label | Primary label | stone-800 on stone-50 ≈ 12:1 ✅ |
| `TRAY_ARCHIVE_BTN`: `border-amber-300 text-amber-700 dark:border-amber-700/50 dark:text-amber-400` | Archive pill | Cautionary action | amber-700 (#b45309) on white ≈ 4.5:1 ✅; dark: amber-400 ✅ |
| `TRAY_JOY_BTN`: `border-stone-200 text-stone-600 dark:border-stone-700 dark:text-stone-400` | Joy pill (off) | Neutral action | stone-600 on white ≈ 5.9:1 ✅; dark: stone-400 on dark bg — `dark:text-stone-400` only as dark variant ✅ |
| `TRAY_JOY_ON_BTN`: `bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400` | Joy pill (on) | Active state | amber-700 on amber-100 ≈ 5.5:1 ✅; dark: amber-400 ✅ |
| Archived disclosure toggle: `text-stone-500 dark:text-stone-400` | "Archived (n)" toggle | Low-hierarchy button | stone-500 on white ≈ 4.6:1 ✅ (just passes AA) |
| `+ New` chip: `text-stone-500 dark:text-stone-500` | Moments `+ New` chip | Action | stone-500 on white ≈ 4.6:1 ✅ (just passes AA) |

---

## 3. Colour-role hierarchy violations

### Correct usages

All page titles use `text-stone-800 dark:text-stone-200` consistently. ✅

App card rows use `text-stone-700 dark:text-stone-300` for label text. ✅

Section labels all use `text-stone-500 dark:text-stone-500` consistently. ✅

Amber tokens: joy pill in ManageView, TRAY_ARCHIVE_BTN, Reset button — all within designated amber roles. ✅

Red used exclusively for destructive confirm button ("Yes, start fresh") and error messages. ✅

### Pre-existing carry-forward divergences

| Component | Line | Current value | Role | Expected | Severity |
|---|---|---|---|---|---|
| CalendarHeatmap.tsx | ~300 | `text-stone-500 dark:text-stone-600` (day-of-week labels) | Metadata | `dark:text-stone-500` — wrong direction in dark | **Low** (pre-existing) |

---

## 4. Dark mode completeness

### Sprint 13 resolutions

SettingsView BACKUP/RESTORE sub-labels (lines 172, 192): now have `dark:text-stone-500` ✅. Both Medium findings from Sprint 12 resolved.

### Sprint 13 new tokens — dark mode check

All new ManageView tokens have correct dark variants. ✅

All new SettingsView token changes have correct dark variants. ✅

### Carry-forward

None remaining from Sprint 12 medium list. ✅

---

## 5. Non-stone accent colours

No violations found. Amber and red are used in their designated roles only. ✅

---

## Summary

**0 critical · 0 high · 0 medium · 1 low**

Severity key: **Critical** = WCAG AA failure · **High** = spec contradiction · **Medium** = missing detail · **Low** = minor inconsistency

| Severity | Count | Primary locations |
|---|---|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 0 | ✅ Sprint 12 mediums resolved: SegmentedPill inactive contrast (Task 1), SettingsView BACKUP/RESTORE dark variants |
| Low | 1 | CalendarHeatmap day-of-week dark variant (pre-existing) |

**Sprint 13 impact:** SegmentedPill inactive contrast medium resolved (Task 1). SettingsView BACKUP/RESTORE dark variant mediums resolved (already present in code from Sprint 12, but confirmed correct). Net: 2 medium → 0 medium, 1 low carry-forward from pre-existing CalendarHeatmap finding.
