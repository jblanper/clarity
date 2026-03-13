# Interaction & Motion Audit

Calma principles reviewed against every interactive element and animation in the codebase.
Date: 2026-03-08.
Severity: **High** (breaks experience or accessibility) · **Medium** (noticeable deviation) · **Low** (polish/consistency)

Sprint 8 context: Task 2 applied `min-h-[44px]` fixes to HabitToggle, NumberStepper, MomentChip, and CalendarHeatmap year-nav buttons. Task 3 replaced `active:scale-90` with `active:opacity-70` on the joy blossom button, raised month crossfade duration from 0.11 to 0.12, and added `transition-colors` to ManageView "Jump to Moments" anchor. Task 4 replaced FrequencyList `width` animation with `scaleX`.

---

## 1. Transition Completeness

### Passing

| Element | File | Classes |
|---|---|---|
| HabitToggle switch | HabitToggle.tsx:34 | `transition-colors duration-200` (on inner pill span) |
| HabitToggle thumb | HabitToggle.tsx:44 | `transition-all duration-200` |
| MomentChip | MomentChip.tsx:11 | `transition-colors` |
| NumberStepper ± buttons | NumberStepper.tsx:73,96 | `transition-colors` |
| "New moment" ghost button | CheckInForm.tsx:364 | `transition-colors` |
| "Add" confirm button | CheckInForm.tsx:398 | `transition-colors` |
| "✕" dismiss button | CheckInForm.tsx:405 | `transition-colors` |
| Joy blossom button | CheckInForm.tsx:456 | `transition-opacity` |
| Save button | CheckInForm.tsx:491 | `transition-colors duration-500` |
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
| ManageView "Jump to Moments" anchor | ManageView.tsx:255 | `transition-colors` (Sprint 8 fix) |
| FrequencyList rows | FrequencyList.tsx:142 | `transition-colors` |
| SettingsView all interactive buttons | SettingsView.tsx (many) | `transition-colors` |
| ManageView header link + action buttons | ManageView.tsx (via constants) | `transition-colors` |
| HelpView back + design-language link | HelpView.tsx:23,105 | `transition-colors` |

### Failing

| Component | Line | Description | Severity |
|---|---|---|---|
| SettingsView | 229 | Remove-file "✕" button — `hover:text-stone-700` but no `transition-colors` | Low |
| ManageView | 417, 423 | "Yes / No" and "Number" type-pickers — `hover:underline` but no `transition-colors` | Low |
| BottomNav | 31 | Inactive tabs have `transition-colors` but no hover colour — transition fires over nothing | Low |

---

## 2. Hover State Correctness

### Passing

| Element | Hover class | Assessment |
|---|---|---|
| Joy blossom button | `active:opacity-70` | ✅ Sprint 8 fix — scale replaced with opacity |
| All nav links | `hover:text-stone-800 dark:hover:text-stone-300` | ✅ (documented two-step exception) |

### Remaining violations

| Component | Line | Description | Severity |
|---|---|---|---|
| CheckInForm / SettingsView / HelpView nav links | various | `text-stone-600 hover:text-stone-800` — two steps darker. CLAUDE.md codifies this as intended nav-link hover; recommend explicitly documenting this exception in the Calma design language. | **Medium** |

---

## 3. Touch Target Compliance

Minimum 44 × 44 px for every tappable element.

### Passing

| Element | File | Enforced by |
|---|---|---|
| HabitToggle switch button | HabitToggle.tsx:34 | `min-h-[44px]` (Sprint 8 fix) |
| NumberStepper − button | NumberStepper.tsx:73 | `min-h-[44px] min-w-[44px]` (Sprint 8 fix) |
| NumberStepper + button | NumberStepper.tsx:96 | `min-h-[44px] min-w-[44px]` (Sprint 8 fix) |
| MomentChip | MomentChip.tsx:11 | `min-h-[44px]` (Sprint 8 fix) |
| CalendarHeatmap year-prev button | CalendarHeatmap.tsx:226 | `min-h-[44px]` (Sprint 8 fix) |
| CalendarHeatmap year-next button | CalendarHeatmap.tsx:237 | `min-h-[44px]` (Sprint 8 fix) |
| Joy blossom button | CheckInForm.tsx:456 | `min-h-[44px] min-w-[44px]` |
| DayDetail close button | DayDetail.tsx:150 | `min-h-[44px] min-w-[44px]` |
| CalendarHeatmap month nav buttons | CalendarHeatmap.tsx | `min-h-[44px]` |
| Calendar day cells | CalendarHeatmap.tsx | `h-11 w-11` (44 × 44 px) |
| Frequency toggle button | HistoryView.tsx:103 | `min-h-[44px]` |
| FrequencyList rows | FrequencyList.tsx:142 | `min-h-[44px]` |
| Full-width form buttons | SettingsView.tsx | `py-4 w-full` |

### Failing

| Component | Line | Element | Actual size | Severity |
|---|---|---|---|---|
| CheckInForm | 361 | "＋ New moment" dashed button | `py-2` ≈ **32 px** | Medium |
| CheckInForm | 395, 403 | Inline "Add" and dismiss "✕" | ~32 px / small | Medium |
| SettingsView | 110 | Back button | `text-xs` only | Medium |
| SettingsView | 142, 153 | Light / Dark theme buttons | `text-sm` only | Medium |
| SettingsView | 226, 297, 313, 327, 335 | Various bare-text controls | No min-h | Medium |
| ManageView | 244, 278, 289, 292, 345, 353, 388, 417, 423, 597 | Various bare-text controls | No min-h | Medium |
| HelpView | 21, 102 | Back link + design link | `text-xs` only | Medium |

---

## 4. Animation Audit

### CSS transitions (globals.css + Tailwind utilities)

| Element | File | Property | Duration | Reduced-motion guard | Severity |
|---|---|---|---|---|---|
| `.frequency-chevron` | globals.css | `transform` (rotation) | 200 ms | ✅ `@media` in globals.css | Pass |
| `.heatmap-grid / .frequency-list` | globals.css | `opacity` | 120 ms | ✅ `@media` in globals.css | Pass |
| DayDetail backdrop | DayDetail.tsx:132 | `opacity` via `.daydetail-backdrop` | 300 ms | ✅ `@media` in globals.css | Pass |
| DayDetail bottom sheet | DayDetail.tsx:142 | `transform` via `.daydetail-sheet` | 300 ms | ✅ `@media` in globals.css | Pass |
| HabitToggle thumb | HabitToggle.tsx:44 | `left` via `transition-all` | 200 ms | No guard; `transition-all` overly broad | Low |

### Motion (JS) animations

| Element | File | Lines | Duration | Notes | Severity |
|---|---|---|---|---|---|
| Add-moment reveal | CheckInForm.tsx | 373–376 | 220 ms ease-out | ✅ via MotionProvider | Pass |
| Joy section reveal/exit | CheckInForm.tsx | 424–430 | 280 ms ease-out | ✅ | Pass |
| Joy row enter/exit | CheckInForm.tsx | 441–446 | 160 ms | ✅ | Pass |
| Month heading crossfade | CalendarHeatmap.tsx | 255–264 | 120 ms | ✅ Sprint 8 fix (was 110 ms) | Pass |
| Calendar grid slide | CalendarHeatmap.tsx | 283–291 | 220 ms ease-out | ✅ | Pass |
| Frequency section reveal | HistoryView.tsx | 110–121 | 280 ms ease-out | ✅ | Pass |
| FrequencyList hint exit | FrequencyList.tsx | 118–121 | 300 ms | ✅ | Pass |
| FrequencyList bar grow | FrequencyList.tsx | 155–165 | 250 ms | `scaleX` animation with static width — ✅ Sprint 8 fix | Pass |
| ManageView type picker reveal | ManageView.tsx | 402–433 | 220 ms ease-out | ✅ | Pass |
| ManageView inline edit forms | ManageView.tsx | various | 220 ms ease-out | ✅ | Pass |
| ManageView add-habit form | ManageView.tsx | 436–518 | 220 ms ease-out | ✅ | Pass |

---

## 5. Disabled State Audit

### Passing

| Element | File | Mechanism |
|---|---|---|
| NumberStepper ± at min/max | NumberStepper.tsx:73,96 | `disabled:opacity-30` ✅ |
| CalendarHeatmap nav at boundary | CalendarHeatmap.tsx | `disabled:opacity-30` ✅ |
| ManageView Save when label empty | ManageView.tsx:345,500 | `disabled:opacity-40` ✅ |

### Failing

| Component | Line | Issue | Severity |
|---|---|---|---|
| CalendarHeatmap | ~341 | Future day cells at `opacity-25` (below 30% floor) | Low |
| CalendarHeatmap | ~347 | Filter-dimmed cells at `opacity: 0.25` inline | Low |
| FrequencyList | ~148 | Inactive-filter chevron uses `invisible` (`visibility: hidden`) | Low |

---

## 6. MotionProvider

`LazyMotion + domAnimation + MotionConfig reducedMotion="user"` is in place in `components/MotionProvider.tsx` and wraps the app via `app/layout.tsx`. Not duplicated. ✅

---

## 7. Scroll lock

`DayDetail.tsx` correctly uses `useLayoutEffect` (not `useEffect`) for `document.body.style.overflow = "hidden"` at line 67. ✅

---

## Remaining issues to address in future sprints

### Medium (not this sprint's scope)
1. **Two-step hover jumps**: Codify `stone-600 → stone-800` nav-link exception in the Calma doc.
2. **CheckInForm "New moment" dashed button touch target**: Add `min-h-[44px]`.
3. **Medium touch targets in Settings/Manage/Help** (numerous bare-text controls).

### Low (polish pass)
4. **CalendarHeatmap opacity-25**: Raise to `opacity-30` for future/filter-dimmed cells.
5. **FrequencyList invisible chevron**: Replace `invisible` with `opacity-0`.
6. **HabitToggle thumb `transition-all`**: Narrow to `transition-[left]`.
7. **BottomNav inactive tabs**: Add `hover:text-stone-700 dark:hover:text-stone-300`.
8. **Missing `transition-colors`**: SettingsView:229, ManageView:417, ManageView:423.

---

## Summary

**0 high · 3 medium · 7 low**

Sprint 8 resolved all 3 pre-sprint high findings (H1 scale transform, H5 HabitToggle touch target, H6 NumberStepper touch target) and 4 of the 7 pre-sprint medium findings (MomentChip touch target, CalendarHeatmap year-nav touch targets, FrequencyList bar animation, month crossfade duration). No regressions introduced.
