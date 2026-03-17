# Typography & Spacing Audit — Clarity × Calma

**Date:** 2026-03-15 (Sprint 13 validation)
**Scope:** All component and page files
**Reference:** `docs/calma-design-language.md` (source of truth)

Archive note: Pre-sprint snapshot preserved as `docs/audits/archive/audit-typography-2026-03-13.md`. The Sprint 12 baseline (0 critical · 0 high · 2 medium · 5 low) is the before-state for this comparison.

Sprint 13 context: Task 1 — SegmentedPill inactive text `text-stone-500` → `text-stone-600`. Task 2 — SettingsView back button touch target, ✕ touch target, "Yes, start fresh" colour, "Restore" label. Tasks 3–5 — ManageView row button enhancements, action tray card, `+ New` chip, archived disclosure.

---

## Summary

Sprint 13 resolved both pre-existing medium touch-target findings in SettingsView (back button, remove-file ✕). No new typography weight violations introduced. Section label pattern correct in all Sprint 13 additions. Net: 2 medium → 0 medium, 5 low unchanged.

Severity key: **Critical** = WCAG AA failure or outright spec contradiction · **High** = systemic gap · **Medium** = missing detail · **Low** = minor inconsistency

---

## 1. Section label pattern

Canonical pattern: `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`

### 1.1 — Sprint 13 additions — all passing

| Component | Status |
|---|---|
| `ManageView.tsx` Habits `h2` (line 249) | ✅ All six parts correct — unchanged |
| `ManageView.tsx` Moments `h2` (line 597) | ✅ All six parts correct — unchanged |
| `SettingsView.tsx` all section/subsection labels | ✅ Including BACKUP/RESTORE sub-labels — now have `dark:text-stone-500` ✅ |
| Archived disclosure toggles (ManageView.tsx:408, 679) | Uses `text-xs text-stone-500 dark:text-stone-400` — lower-hierarchy button, not a section label. Acceptable. ✅ |

### 1.2 — Previously flagged BACKUP/RESTORE sub-labels

| Component | Line | Current | Status |
|---|---|---|---|
| `SettingsView.tsx` | 172 | `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500` | ✅ **Fixed** — `dark:text-stone-500` now present |
| `SettingsView.tsx` | 192 | Same | ✅ **Fixed** |

Both Sprint 12 Medium findings resolved. ✅

---

## 2. Type scale — weight violations

**No `font-bold` or `font-semibold` found anywhere in the codebase.** ✅

Sprint 13 introduces `font-medium` on the active ManageView habit row label when the tray is open (`font-medium text-stone-800 dark:text-stone-100`). This is acceptable — `font-medium` is used for emphasis within interactive controls, analogous to the SegmentedPill active segment. ✅

SegmentedPill active segment retains `font-medium` — acceptable. ✅

---

## 3. Touch target violations

Minimum 44 × 44 px for every tappable element.

### 3.1 — Sprint 13 resolutions

| Fix | File | Previous state | New state |
|---|---|---|---|
| SettingsView back button | SettingsView.tsx:112 | `text-xs` only — no min-h (**Medium** pre-existing) | Now `flex min-h-[44px] items-center` ✅ |
| SettingsView ✕ remove-file button | SettingsView.tsx:227 | No `min-h-[44px]` — only `flex-shrink-0` (**Medium** pre-existing) | Now `min-h-[44px] flex items-center` ✅ |

### 3.2 — Sprint 13 new elements

| Component | Line | Element | Status |
|---|---|---|---|
| ManageView.tsx | 263 (habit row button) | `flex w-full min-h-[44px] items-center` | ✅ Already had `min-h-[44px]` from Sprint 12 |
| ManageView.tsx | 657 (moment chip) | `min-h-[44px] flex items-center` | ✅ |
| ManageView.tsx | 664 (`+ New` chip) | `min-h-[44px] flex items-center` | ✅ |
| ManageView.tsx | 406 (archived disclosure toggle) | `flex w-full … py-1` | **Low** — `py-1` is 4px top+bottom; no `min-h-[44px]`. The toggle is below the active list and has low primary-action priority. Consistent with the pre-existing pattern of ManageView secondary controls. |
| ManageView.tsx | 677 (moments archived toggle) | Same | **Low** — same as above |

Action tray buttons (`TRAY_ARCHIVE_BTN`, `TRAY_JOY_BTN`, `TRAY_JOY_ON_BTN`): `py-1.5` rounded-full pills. No `min-h-[44px]`. These are secondary actions within a revealed tray — same low-priority note as Sprint 12. **Low** (consistent with pre-existing pattern).

### 3.3 — Remaining issues

None in Medium. ✅

---

## 4. Vertical rhythm

### 4.1 — ManageView Sprint 13 additions

Archived disclosure divider uses `mt-2 border-t border-stone-100 pt-2` — consistent with card interior spacing patterns. ✅

`+ New` chip in moments grid renders inline in the flex-wrap chip grid — no additional vertical spacing needed. ✅

### 4.2 — SettingsView section spacing

Unchanged from Sprint 12. `mb-8` on all sections — consistent internally. ✅

---

## 5. Max width and layout

**All page-level containers consistently apply `max-w-md`.** ✅

ManageView archived disclosure: `flex flex-wrap` not used here — single-column layout, no overflow risk. ✅

Moments chip grid: `flex flex-wrap gap-2` — wraps correctly on narrow viewports. ✅ Unchanged.

---

## Consolidated findings

### Critical — 0

### High — 0

### Medium — 0

Sprint 12 medium findings resolved:
- SettingsView back button: now `flex min-h-[44px] items-center` ✅
- SettingsView ✕ button: now `min-h-[44px] flex items-center` ✅

### Low — 5

| ID | Component | Line | Current | Expected | Status |
|---|---|---|---|---|---|
| L1 | `ManageView.tsx` | 406, 677 | Archived disclosure toggles `py-1` only | Add `min-h-[44px]` | New (Sprint 13) — low priority secondary control |
| L2 | `CalendarHeatmap.tsx` | ~230 | Year display `text-sm uppercase tracking-widest` | `text-xs uppercase tracking-widest` | Pre-existing |
| L3 | `SettingsView.tsx` | sections | `mb-8` spacing | Dividers compensate | Pre-existing |
| L4 | `DayDetail.tsx` | ~200 | Numeric value `font-medium` | Borderline — acceptable | Pre-existing |
| L5 | `NumberStepper.tsx` | 66 | Pill button value — no explicit `text-sm` class | Add `text-sm` | Pre-existing (Sprint 9) |

L6 (ManageView action tray buttons lack explicit `min-h`): Low — secondary inline actions inside revealed tray. Pre-existing.

---

## Summary counts

**0 critical · 0 high · 0 medium · 5 low**

Sprint 13 resolved 2 pre-existing medium touch-target findings (SettingsView back button, remove-file ✕). One new low introduced (archived disclosure toggles). Net: 2 medium → 0 medium; low count +1 (5 total, down from pre-existing 5 but new one added at L1 = same count).
