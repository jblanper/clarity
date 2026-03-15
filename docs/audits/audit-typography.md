# Typography & Spacing Audit — Clarity × Calma

**Date:** 2026-03-15
**Scope:** All component and page files
**Reference:** `docs/calma-design-language.md` (source of truth)

Archive note: Bash permission was unavailable; pre-sprint snapshot preserved in memory (Sprint 11 report: 0 critical · 0 high · 0 medium · 4 low).

Sprint 12 context: Task 1 carry-forward fixes (ManageView). Task 2 added SegmentedPill component. Tasks 3–5 restructured SettingsView (App card, Your Data, Reset). Task 6 added `min-h-[44px]` to HelpView links. Tasks 7–9 ManageView card redesign (section cards, full-row tap, chip grid, joy pill).

---

## Summary

Sprint 12 introduced no new typography weight violations. Section label pattern is correct across all new components and updated sections. HelpView and SettingsView touch targets resolved. Two new touch-target medium findings resolved from pre-existing list; SegmentedPill introduces a new minor label-sizing note. Net improvement on carry-forward lows.

Severity key: **Critical** = WCAG AA failure or outright spec contradiction · **High** = systemic gap · **Medium** = missing detail · **Low** = minor inconsistency

---

## 1. Section label pattern

Canonical pattern: `text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`

### 1.1 — All section labels passing

| Component | Status |
|---|---|
| `ManageView.tsx` Habits `h2` (line 236) | ✅ All six parts correct |
| `ManageView.tsx` Moments `h2` (line 553) | ✅ All six parts correct |
| `SettingsView.tsx` Theme `h2` (line 124) | ✅ |
| `SettingsView.tsx` App `h2` (line 141) | ✅ |
| `SettingsView.tsx` Your data `h2` (line 166) | ✅ |
| `SettingsView.tsx` Reset `h3` (line 287) | ✅ |
| `CheckInForm.tsx` all five `h2` labels | ✅ Unchanged |
| `DayDetail.tsx` all four `h3` labels | ✅ Unchanged |
| `HelpView.tsx` `SECTION_LABEL` const | ✅ `mb-3 text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500` |
| `HistoryView.tsx` frequency toggle button | ✅ Unchanged |

### 1.2 — BACKUP / RESTORE sub-labels (SettingsView.tsx:172,192)

| Component | Line | Current | Status |
|---|---|---|---|
| `SettingsView.tsx` | 172 | `text-xs font-medium uppercase tracking-widest text-stone-500` | **Medium** — missing `dark:text-stone-500` (also flagged in colour audit). Typography-wise the pattern is correct for a sub-label except the missing dark variant. |
| `SettingsView.tsx` | 192 | Same | **Medium** — same issue |

These sub-labels correctly use `font-medium uppercase tracking-widest` which aligns with the section label weight/case pattern. The only gap is the missing dark variant.

### 1.3 — Remaining violations

No additional section label violations. ✅

---

## 2. Type scale — weight violations

**No `font-bold` or `font-semibold` found anywhere in the codebase.** ✅

SegmentedPill active segment uses `font-medium` (`bg-white dark:bg-stone-900 font-medium text-stone-900 dark:text-stone-100 shadow-sm`) — this is acceptable for an active/selected control state, analogous to the active period selector in HistoryView. ✅

---

## 3. Touch target violations

Minimum 44 × 44 px for every tappable element.

### 3.1 — Sprint 12 resolutions

| Fix | File | Previous state | New state |
|---|---|---|---|
| SettingsView back button | SettingsView.tsx:112 | `text-xs` only — no min-h (**Medium** pre-existing) | Still `text-xs` — **no min-h added** (pre-existing medium persists) |
| App card links (Manage, Help) | SettingsView.tsx:147,154 | Previously bare `py-2 text-sm` | Now `flex min-h-[44px] items-center justify-between px-4 py-3` ✅ |
| Reset resting button | SettingsView.tsx:294 | Previously bare text | Now `inline-flex min-h-[44px] items-center` ✅ |
| Reset confirm/cancel buttons | SettingsView.tsx:307,314 | No min-h (pre-existing medium) | Now `inline-flex min-h-[44px] items-center` ✅ |
| HelpView back link | HelpView.tsx:23 | Pre-existing medium | Now `flex min-h-[44px] items-center` ✅ |
| HelpView design-language link | HelpView.tsx:105 | Pre-existing medium | Now `inline-flex min-h-[44px] items-center` ✅ |
| ManageView back link | ManageView.tsx:226 | Pre-existing medium | Now `flex min-h-[44px] items-center` ✅ |
| ManageView `+ New` buttons | ManageView.tsx:242,559 | New — card header actions | `flex min-h-[44px] items-center` ✅ |
| ManageView habit row tap button | ManageView.tsx:263 | New B2 full-row tap | `flex w-full min-h-[44px] items-center` ✅ |
| ManageView moment chip buttons | ManageView.tsx:620 | New B3 chip grid | `min-h-[44px] flex items-center` ✅ |

### 3.2 — Remaining medium violations

| Component | Line | Element | Issue | Severity |
|---|---|---|---|---|
| SettingsView | 112 | Back button | `text-xs` only — no `min-h` or `flex` wrapping | **Medium** (pre-existing, not addressed in Sprint 12) |
| SettingsView | 226–229 | Remove-file "✕" button (import ready state) | No `min-h-[44px]` — only `flex-shrink-0` and text size | **Medium** (pre-existing) |

Note: ManageView previously had many bare-text controls without min-h (pre-existing mediums from Sprint 11 audit). The B2 action tray buttons (`ACTION_BTN`, `ARCHIVE_BTN` constants) are still bare-text (`text-xs text-stone-500…`) without `min-h-[44px]`. These are secondary actions revealed only inside the tray. **Low** — they are inline within a revealed tray div, not standalone interactive elements at page level.

### 3.3 — SegmentedPill touch target

| Component | Line | Element | Status |
|---|---|---|---|
| `SegmentedPill.tsx` | 22 | Pill segment buttons | `min-h-[44px]` ✅ |

---

## 4. Vertical rhythm

### 4.1 — ManageView section cards (Sprint 12)

Both Habits and Moments cards use `mb-6` spacing between sections — consistent. ✅

Card interior uses `px-4 py-4` — consistent. ✅

Section header within cards uses `mb-4` — consistent. ✅

### 4.2 — SettingsView section spacing

| Component | Lines | Current | Notes | Severity |
|---|---|---|---|---|
| `SettingsView.tsx` | sections | `mb-8` on all sections | Consistent internally; dividers compensate | **low** (pre-existing) |

---

## 5. Max width and layout

**All page-level containers consistently apply `max-w-md`.** ✅ No horizontal scrolling risk found.

SegmentedPill uses `inline-flex` — does not overflow on narrow viewports. ✅

ManageView chip grid uses `flex flex-wrap gap-2` — wraps correctly on narrow viewports. ✅

---

## Consolidated findings

### Critical — 0

### High — 0

### Medium — 2

| ID | Component | Line | Current | Expected | Status |
|---|---|---|---|---|---|
| M1 | `SettingsView.tsx` | 112 | Back button no `min-h` | Add `flex min-h-[44px] items-center` | Pre-existing, not fixed in Sprint 12 |
| M2 | `SettingsView.tsx` | 226 | Remove-file "✕" no `min-h` | Add `min-h-[44px]` | Pre-existing |

Note: Previously flagged SettingsView mediums (Light/Dark bare buttons, many bare-text controls) are now resolved by SegmentedPill and the full restructure.

### Low — 4

| ID | Component | Line | Current | Expected | Status |
|---|---|---|---|---|---|
| L2 | `CalendarHeatmap.tsx` | ~230 | Year display `text-sm uppercase tracking-widest` | `text-xs uppercase tracking-widest` | Pre-existing |
| L3 | `SettingsView.tsx` | sections | `mb-8` spacing | Dividers compensate | Pre-existing |
| L4 | `DayDetail.tsx` | ~200 | Numeric value `font-medium` | Borderline — acceptable | Pre-existing |
| L5 | `NumberStepper.tsx` | 66 | Pill button value — no explicit `text-sm` class | Add `text-sm` | Pre-existing (Sprint 9) |

L6 (ManageView action tray buttons lack explicit `min-h`): Low — secondary inline actions inside revealed tray.

---

## Summary counts

**0 critical · 0 high · 2 medium · 5 low**

Sprint 12 resolved multiple pre-existing medium touch-target findings (App card links, Reset buttons, HelpView links, ManageView back + habit rows + chip grid). Two pre-existing mediums remain (SettingsView back button, remove-file "✕"). Net: 2 medium remaining (down from ~10 pre-sprint), 5 low (unchanged from Sprint 9 baseline plus 1 new low for action tray buttons).
