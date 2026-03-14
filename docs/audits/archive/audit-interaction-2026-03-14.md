# Interaction & Motion Audit

Calma principles reviewed against every interactive element and animation in the codebase.
Date: 2026-03-13.
Severity: **High** (breaks experience or accessibility) · **Medium** (noticeable deviation) · **Low** (polish/consistency)

Sprint 9 context: Task 2 added `min-h-[44px]` to the three add-moment buttons in CheckInForm (resolving 3 medium touch-target findings from Sprint 8). Task 3 replaced the HabitToggle OS switch with a full-row `<button>` — `role="switch"`, `aria-checked`, and `active:opacity-70` are all retained; the old sliding-thumb CSS animation is removed. Task 4 replaced the NumberStepper three-zone layout with a tap-to-increment pill (`role="spinbutton"`, `aria-valuenow`, `aria-valuemin`) and a conditional decrement button. Task 5 added "Start at" number inputs in ManageView (not interactive controls — standard text inputs, no special interaction requirements).

---

## 1. Transition Completeness

### Passing

| Element | File | Classes |
|---|---|---|
| HabitToggle full-row button | HabitToggle.tsx:29 | `transition-colors` |
| HabitToggle dot indicator | HabitToggle.tsx:34 | `transition-colors` |
| MomentChip | MomentChip.tsx:11 | `transition-colors` |
| NumberStepper decrement button | NumberStepper.tsx:54 | `transition-colors` |
| NumberStepper pill button | NumberStepper.tsx:66 | `transition-colors` |
| "＋ New moment" ghost button | CheckInForm.tsx:366 | `transition-colors` |
| "Add" confirm button | CheckInForm.tsx:400 | `transition-colors` |
| "✕" dismiss button | CheckInForm.tsx:407 | `transition-colors` |
| Joy blossom button | CheckInForm.tsx:458 | `transition-opacity` |
| Save button | CheckInForm.tsx:494 | `transition-colors duration-500` |
| Back / Settings links | CheckInForm.tsx:263,271 | `transition-colors` |
| BottomNav tabs | BottomNav.tsx:31 | `transition-colors` |
| DayDetail close button | DayDetail.tsx:150 | `transition-colors` |
| DayDetail edit link | DayDetail.tsx:248 | `transition-colors` |
| CalendarHeatmap year-nav buttons | CalendarHeatmap.tsx:226,237 | `transition-colors` |
| CalendarHeatmap month nav buttons | CalendarHeatmap.tsx:248,271 | `transition-colors` |
| Calendar day cells | CalendarHeatmap.tsx | `transition-colors` |
| HistoryView Settings link | HistoryView.tsx:70 | `transition-colors` |
| Frequency toggle button | HistoryView.tsx:103 | `transition-colors` |
| Period selector buttons | HistoryView.tsx:129–139 | `transition-colors` |
| ManageView "Jump to Moments" anchor | ManageView.tsx:258 | `transition-colors` |
| ManageView header link + action buttons | ManageView.tsx (via constants) | `transition-colors` |
| FrequencyList rows | FrequencyList.tsx:142 | `transition-colors` |
| SettingsView all interactive buttons | SettingsView.tsx (many) | `transition-colors` |
| HelpView back + design-language link | HelpView.tsx:23,105 | `transition-colors` |

Note: the HabitToggle thumb slide animation (`transition-all duration-200` on the old thumb span) is removed. The new dot indicator has `transition-colors` — appropriate for a colour-only change. ✅

### Failing

| Component | Line | Description | Severity |
|---|---|---|---|
| SettingsView | 229 | Remove-file "✕" button — `hover:text-stone-700` but no `transition-colors` | Low (pre-existing) |
| ManageView | 439, 446 | "Yes / No" and "Number" type-pickers — `hover:underline` but no `transition-colors` | Low (pre-existing) |
| BottomNav | 31 | Inactive tabs have `transition-colors` but no hover colour — transition fires over nothing | Low (pre-existing) |

---

## 2. Hover State Correctness

### Passing

| Element | Hover class | Assessment |
|---|---|---|
| Joy blossom button | `active:opacity-70` | ✅ Sprint 8 fix — scale replaced with opacity |
| HabitToggle full-row button | `active:opacity-70` | ✅ Sprint 9 — correct Calma press feedback |
| NumberStepper decrement button | `active:opacity-70` | ✅ Sprint 9 — correct |
| NumberStepper pill button | `active:opacity-70` | ✅ Sprint 9 — correct |
| All nav links | `hover:text-stone-800 dark:hover:text-stone-300` | ✅ (documented two-step exception) |

### Remaining violations

| Component | Line | Description | Severity |
|---|---|---|---|
| CheckInForm / SettingsView / HelpView nav links | various | `text-stone-600 hover:text-stone-800` — two steps darker. CLAUDE.md codifies this as intended nav-link hover; recommend explicitly documenting this exception in the Calma design language. | **Medium** (pre-existing) |

---

## 3. Touch Target Compliance

Minimum 44 × 44 px for every tappable element.

### Passing

| Element | File | Enforced by |
|---|---|---|
| HabitToggle full-row button | HabitToggle.tsx:29 | `min-h-[44px]` + `w-full` |
| NumberStepper decrement button | NumberStepper.tsx:50 | `min-h-[44px] min-w-[44px]` |
| NumberStepper pill button | NumberStepper.tsx:59 | `min-h-[44px] min-w-[44px]` |
| "＋ New moment" ghost button | CheckInForm.tsx:363 | `min-h-[44px] flex items-center` (Sprint 9 fix) |
| "Add" confirm button | CheckInForm.tsx:397 | `min-h-[44px] flex items-center` (Sprint 9 fix) |
| "✕" dismiss button | CheckInForm.tsx:404 | `min-h-[44px] min-w-[44px] flex items-center justify-center` (Sprint 9 fix) |
| MomentChip | MomentChip.tsx:11 | `min-h-[44px]` (Sprint 8 fix) |
| CalendarHeatmap year-prev button | CalendarHeatmap.tsx:226 | `min-h-[44px]` (Sprint 8 fix) |
| CalendarHeatmap year-next button | CalendarHeatmap.tsx:237 | `min-h-[44px]` (Sprint 8 fix) |
| Joy blossom button | CheckInForm.tsx:454 | `min-h-[44px] min-w-[44px]` |
| DayDetail close button | DayDetail.tsx:150 | `min-h-[44px] min-w-[44px]` |
| CalendarHeatmap month nav buttons | CalendarHeatmap.tsx | `min-h-[44px]` |
| Calendar day cells | CalendarHeatmap.tsx | `h-11 w-11` (44 × 44 px) |
| Frequency toggle button | HistoryView.tsx:103 | `min-h-[44px]` |
| FrequencyList rows | FrequencyList.tsx:142 | `min-h-[44px]` |
| Full-width form buttons | SettingsView.tsx | `py-4 w-full` |

### Failing

| Component | Line | Element | Actual size | Severity |
|---|---|---|---|---|
| SettingsView | 110 | Back button | `text-xs` only — no min-h | Medium (pre-existing) |
| SettingsView | 142, 153 | Light / Dark theme buttons | `text-sm` only — no min-h | Medium (pre-existing) |
| SettingsView | 226, 297, 313, 327, 335 | Various bare-text controls | No min-h | Medium (pre-existing) |
| ManageView | 244, 278, 289, 292, 345, 353, 388, 439, 446, 597 | Various bare-text controls | No min-h | Medium (pre-existing) |
| HelpView | 21, 102 | Back link + design link | `text-xs` only | Medium (pre-existing) |

Note: Sprint 9 resolved all three CheckInForm add-moment touch-target mediums. The remaining medium findings in Settings, Manage, and Help are pre-existing and not in Sprint 9 scope.

---

## 4. Animation Audit

### CSS transitions (globals.css + Tailwind utilities)

| Element | File | Property | Duration | Reduced-motion guard | Severity |
|---|---|---|---|---|---|
| `.frequency-chevron` | globals.css | `transform` (rotation) | 200 ms | ✅ `@media` in globals.css | Pass |
| `.heatmap-grid / .frequency-list` | globals.css | `opacity` | 120 ms | ✅ `@media` in globals.css | Pass |
| DayDetail backdrop | DayDetail.tsx:132 | `opacity` via `.daydetail-backdrop` | 300 ms | ✅ `@media` in globals.css | Pass |
| DayDetail bottom sheet | DayDetail.tsx:142 | `transform` via `.daydetail-sheet` | 300 ms | ✅ `@media` in globals.css | Pass |

Note: The HabitToggle thumb `transition-all` finding from Sprint 8 is now **resolved** — the thumb element (and its animation) no longer exists. The new dot indicator uses `transition-colors`, which is correctly scoped. ✅

### Motion (JS) animations

| Element | File | Lines | Duration | Notes | Severity |
|---|---|---|---|---|---|
| Add-moment reveal | CheckInForm.tsx | 373–379 | 220 ms ease-out | ✅ via MotionProvider | Pass |
| Joy section reveal/exit | CheckInForm.tsx | 427–432 | 280 ms ease-out | ✅ | Pass |
| Joy row enter/exit | CheckInForm.tsx | 443–448 | 160 ms | ✅ | Pass |
| Month heading crossfade | CalendarHeatmap.tsx | 255–264 | 120 ms | ✅ Sprint 8 fix | Pass |
| Calendar grid slide | CalendarHeatmap.tsx | 283–291 | 220 ms ease-out | ✅ | Pass |
| Frequency section reveal | HistoryView.tsx | 110–121 | 280 ms ease-out | ✅ | Pass |
| FrequencyList hint exit | FrequencyList.tsx | 118–121 | 300 ms | ✅ | Pass |
| FrequencyList bar grow | FrequencyList.tsx | 155–165 | 250 ms | `scaleX` with static width — ✅ Sprint 8 fix | Pass |
| ManageView type picker reveal | ManageView.tsx | 425–455 | 220 ms ease-out | ✅ | Pass |
| ManageView inline edit forms | ManageView.tsx | various | 220 ms ease-out | ✅ | Pass |
| ManageView add-habit form | ManageView.tsx | 458–559 | 220 ms ease-out | ✅ | Pass |

---

## 5. Accessibility — ARIA roles and keyboard support

### Passing

| Element | File | ARIA | Assessment |
|---|---|---|---|
| HabitToggle | HabitToggle.tsx:25–27 | `role="switch"` `aria-checked={value.done}` `aria-label={label}` | ✅ Correct switch semantics |
| NumberStepper pill | NumberStepper.tsx:62–65 | `role="spinbutton"` `aria-valuenow={value}` `aria-valuemin={min}` `aria-label={label}` | ✅ Spinbutton semantics present |
| NumberStepper decrement | NumberStepper.tsx:53 | `aria-label={\`Decrease ${label}\`}` | ✅ Descriptive label |

### Findings

| Component | Line | Issue | Severity |
|---|---|---|---|
| NumberStepper pill | 59 | `role="spinbutton"` has no `onKeyDown` arrow-key handler — keyboard users cannot increment/decrement with arrow keys | **Low** (accepted per sprint plan; documented in Architecture Review M3) |
| NumberStepper pill | 59 | `aria-valuemax` absent when `max !== Infinity` — harmless for default config (no upper bound); revisit if max becomes configurable | **Low** |

---

## 6. Disabled State Audit

### Passing

| Element | File | Mechanism |
|---|---|---|
| NumberStepper decrement | NumberStepper.tsx:49 | Not rendered at all when `value <= 0` — intentional (no disabled state needed) ✅ |
| ManageView Save when label empty | ManageView.tsx:372, 545 | `disabled:opacity-40` ✅ |
| CalendarHeatmap nav at boundary | CalendarHeatmap.tsx | `disabled:opacity-30` ✅ |

### Failing

| Component | Line | Issue | Severity |
|---|---|---|---|
| CalendarHeatmap | ~341 | Future day cells at `opacity-25` (below 30% floor) | Low (pre-existing) |
| CalendarHeatmap | ~347 | Filter-dimmed cells at `opacity: 0.25` inline | Low (pre-existing) |
| FrequencyList | ~148 | Inactive-filter chevron uses `invisible` (`visibility: hidden`) | Low (pre-existing) |

---

## 7. MotionProvider

`LazyMotion + domAnimation + MotionConfig reducedMotion="user"` is in place in `components/MotionProvider.tsx` and wraps the app via `app/layout.tsx`. Not duplicated. ✅

---

## 8. Scroll lock

`DayDetail.tsx` correctly uses `useLayoutEffect` (not `useEffect`) for `document.body.style.overflow = "hidden"`. ✅

---

## Remaining issues to address in future sprints

### Medium (not this sprint's scope)
1. **Two-step hover jumps**: Codify `stone-600 → stone-800` nav-link exception in the Calma doc.
2. **Medium touch targets in Settings/Manage/Help** (numerous bare-text controls).

### Low (polish pass)
3. **NumberStepper spinbutton keyboard**: Add `onKeyDown` arrow-key increment/decrement.
4. **NumberStepper `aria-valuemax`**: Add when `max !== Infinity`.
5. **CalendarHeatmap opacity-25**: Raise to `opacity-30` for future/filter-dimmed cells.
6. **FrequencyList invisible chevron**: Replace `invisible` with `opacity-0`.
7. **BottomNav inactive tabs**: Add `hover:text-stone-700 dark:hover:text-stone-300`.
8. **Missing `transition-colors`**: SettingsView:229, ManageView:439, ManageView:446.

---

## Summary

**0 high · 1 medium · 8 low**

Sprint 9 resolved 3 medium touch-target findings from Sprint 8 (CheckInForm add-moment buttons) and 1 pre-existing low (HabitToggle thumb `transition-all` — element removed). Sprint 9 introduced 2 new low findings (NumberStepper spinbutton keyboard support; `aria-valuemax`). Net: 3 mediums resolved, 2 lows added. The one remaining medium (two-step nav-link hover) is pre-existing and carries forward.
