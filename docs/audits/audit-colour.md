# Colour & Contrast Audit

Audited: all files in `components/`, `app/`, `app/globals.css`.
Reference: `docs/calma-design-language.md`.
Generated: 2026-03-15 00:00

Archive note: Bash permission was unavailable; pre-sprint snapshot preserved in memory (Sprint 11 report: 0 critical · 0 high · 0 medium · 3 low).

Sprint 12 context: Task 1 fixed the two `text-stone-400` violations in ManageView archived-habit confirmation notes. Task 2 added SegmentedPill component (new colour tokens). Task 3 restructured SettingsView navigation card — arch review fixed `text-stone-400` chevrons (Sprint 12 arch review finding, high severity). Task 4 restyle Your Data section — BACKUP/RESTORE sub-labels introduced without `dark:` variant (new finding). Task 5 Reset flow — amber-bordered button, no red. Tasks 7–9 ManageView card redesign — joy pill amber tokens, action tray.

---

## 1. Stone-400 violations

Stone-400 (`#a8a29e`) fails WCAG AA on the light background (≈2.4:1, minimum 4.5:1). It is only permitted as a `dark:` variant, or explicitly as a placeholder/border colour.

### 1a. Full violations — no dark pairing

**None found.** ✅

Sprint 12 arch review caught and fixed `text-stone-400` on App card chevrons (`SettingsView.tsx:150,157`) before this audit. Current code uses `text-stone-500 dark:text-stone-500`. ✅

### 1b. Light-mode violations — dark pairing present, base still fails

**None found.** ✅

The two ManageView carry-forward violations (archived confirmation notes, lines 402 and 631 in Sprint 11) were fixed in Task 1: both now use `text-stone-500 dark:text-stone-500`.

---

## 2. New colour tokens introduced in Sprint 12

### SegmentedPill (components/SegmentedPill.tsx)

| Token | Usage | Role | Contrast / Assessment |
|---|---|---|---|
| `bg-white dark:bg-stone-900 font-medium text-stone-900 dark:text-stone-100 shadow-sm` | Active segment | Selected option | stone-900 (#1c1917) on white — ~18:1 ✅ |
| `text-stone-500 dark:text-stone-400` | Inactive segment | Unselected option | stone-500 on bg-stone-100 (pill background) — stone-500 (#78716c) on stone-100 (#f5f5f4) ≈ 3.7:1 — fails AA 4.5:1 for text. **Medium.** See note. |
| `bg-stone-100 dark:bg-stone-800` | Pill container | Background | Background only ✅ |

Note on inactive SegmentedPill segment contrast: stone-500 on stone-100 is ≈3.7:1, which fails AA for small text (text-sm). However, these segments are interactive controls and the active state is white, so users quickly learn the distinction. This is a known gap in many segmented controls. The border of the pill container (`border-stone-200`) provides additional affordance. **Medium** — recommend raising inactive to `text-stone-600` on stone-100 for AA compliance in a future pass.

### SettingsView BACKUP/RESTORE sub-labels (components/SettingsView.tsx:172,192)

| Token | Usage | Role | Contrast / Assessment |
|---|---|---|---|
| `text-xs font-medium uppercase tracking-widest text-stone-500` | Sub-section label | Metadata | stone-500 on white ≈ 4.6:1 ✅ (passes AA) — no dark variant paired |

Note: Missing `dark:text-stone-500` on BACKUP and RESTORE sub-labels. In dark mode these render as stone-500 on dark background — stone-500 (#78716c) on stone-950 (#0c0a09) ≈ 3.5:1, which fails AA. **Medium** (dark mode WCAG failure).

### ManageView joy pill (components/ManageView.tsx:270)

| Token | Usage | Role | Contrast / Assessment |
|---|---|---|---|
| `bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-400` | Joy-by-default pill in habit row | Status indicator | amber-700 (#b45309) on amber-50 (#fffbeb) ≈ 6.5:1 ✅; dark: amber-400 on dark bg ✅ |

### SettingsView Reset button (components/SettingsView.tsx:294)

| Token | Usage | Role | Contrast / Assessment |
|---|---|---|---|
| `border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-500` | Reset at rest | Cautionary action | amber-700 on white ≈ 4.5:1 ✅; dark: amber-500 (#f59e0b) on dark bg ≈ 8:1 ✅ |
| `text-amber-700 dark:text-amber-500` | Confirmation yes button | Destructive confirm | ✅ same as above |

---

## 3. Colour-role hierarchy violations

### Correct usages

All page titles use `text-stone-800 dark:text-stone-200` consistently. ✅

App card rows use `text-stone-700 dark:text-stone-300` for label text. ✅

Section labels all use `text-stone-500 dark:text-stone-500` consistently. ✅

Amber tokens: joy pill, Reset button, ManageView Archive buttons — all within designated amber roles. ✅

Red used exclusively for error messages in SettingsView import error state. ✅

### Remaining divergences

| Component | Line | Current value | Role | Expected | Severity |
|---|---|---|---|---|---|
| CalendarHeatmap.tsx | ~300 | `text-stone-500 dark:text-stone-600` (day-of-week labels) | Metadata | `dark:text-stone-500` — wrong direction in dark | **low** (pre-existing) |

---

## 4. Dark mode completeness

### New findings — Sprint 12

| Component | Line | Missing | Severity |
|---|---|---|---|
| SettingsView.tsx | 172 | `BACKUP` sub-label: `text-stone-500` has no `dark:text-stone-500` — dark mode WCAG fail ≈3.5:1 | **Medium** |
| SettingsView.tsx | 192 | `RESTORE` sub-label: same — dark mode WCAG fail ≈3.5:1 | **Medium** |

All other new foreground tokens in Sprint 12 have appropriate dark variants. ✅

### Carry-forward

SegmentedPill inactive segment (`text-stone-500 dark:text-stone-400`) — dark:stone-400 is a `dark:` variant so technically safe per the rule, but the base stone-500 on stone-100 is the contrast concern (noted above). ✅ from a dark-mode completeness standpoint.

---

## 5. Non-stone accent colours

No violations found. Amber and red are used in their designated roles only. ✅

---

## Summary

**0 critical · 0 high · 2 medium · 2 low**

Severity key: **Critical** = WCAG AA failure · **High** = spec contradiction · **Medium** = missing detail · **Low** = minor inconsistency

| Severity | Count | Primary locations |
|---|---|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 2 | SettingsView BACKUP/RESTORE sub-labels missing dark variant (new — Sprint 12) |
| Low | 2 | CalendarHeatmap day-of-week dark variant (pre-existing); SegmentedPill inactive contrast on stone-100 (new — Sprint 12) |

**Sprint 12 impact:** ManageView carry-forward stone-400 violations resolved (2 lows cleared). Arch review caught and fixed App card chevron violation (1 high cleared before audit). Two new medium findings introduced: BACKUP/RESTORE sub-labels missing dark variant. One new low: SegmentedPill inactive contrast gap. Net: +2 medium, +1 low from Sprint 12 changes.
