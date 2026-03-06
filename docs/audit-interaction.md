# Interaction & Motion Audit

Calma principles reviewed against every interactive element and animation in the codebase.
Date: 2026-03-06.
Severity: **High** (breaks experience or accessibility) · **Medium** (noticeable deviation) · **Low** (polish/consistency)

Sprint 7 context: DayDetail backdrop and sheet plain-div CSS transitions now carry semantic class names (`.daydetail-backdrop`, `.daydetail-sheet`) and are suppressed in `globals.css` under `@media (prefers-reduced-motion: reduce)`.

---

## 1. Transition Completeness

### Passing

| Element | File | Classes |
|---|---|---|
| HabitToggle switch | HabitToggle.tsx:34 | `transition-colors duration-200` |
| HabitToggle thumb | HabitToggle.tsx:41 | `transition-all duration-200` |
| MomentChip | MomentChip.tsx:15 | `transition-colors` |
| NumberStepper ± buttons | NumberStepper.tsx:73,96 | `transition-colors` |
| "New moment" / "Add" / "✕" buttons | CheckInForm.tsx:364,398,405 | `transition-colors` |
| Joy blossom button | CheckInForm.tsx:456 | `transition-transform` |
| Save button | CheckInForm.tsx:491 | `transition-colors duration-500` |
| Back / Settings links | CheckInForm.tsx:263,271 | `transition-colors` |
| BottomNav tabs | BottomNav.tsx:31 | `transition-colors` |
| DayDetail close button | DayDetail.tsx:150 | `transition-colors` |
| DayDetail edit link | DayDetail.tsx:248 | `transition-colors` |
| CalendarHeatmap nav buttons | CalendarHeatmap.tsx | `transition-colors` |
| Calendar day cells | CalendarHeatmap.tsx | `transition-colors` |
| HistoryView Settings link | HistoryView.tsx:69 | `transition-colors` |
| Frequency toggle button | HistoryView.tsx:93 | `transition-colors` |
| Period selector buttons | HistoryView.tsx:113–124 | `transition-colors` |
| FrequencyList rows | FrequencyList.tsx:142 | `transition-colors` |
| SettingsView all interactive buttons | SettingsView.tsx (many) | `transition-colors` |
| ManageView header link + action buttons | ManageView.tsx (via constants) | `transition-colors` |
| HelpView back + design-language link | HelpView.tsx:23,105 | `transition-colors` |

### Failing

| Component | Line | Description | Severity |
|---|---|---|---|
| SettingsView | 229 | Remove-file "✕" button — `hover:text-stone-700` but no `transition-colors` | Low |
| ManageView | 254 | "Jump to Moments" anchor — `hover:underline` but no `transition-colors` | Low |
| ManageView | 413 | "Boolean" type-picker — `hover:underline` but no `transition-colors` | Low |
| ManageView | 419 | "Numeric" type-picker — `hover:underline` but no `transition-colors` | Low |
| BottomNav | 31 | Inactive tabs have `transition-colors` but no hover colour — transition fires over nothing | Low |

---

## 2. Hover State Correctness

### Violations

| Component | Line | Description | Severity |
|---|---|---|---|
| CheckInForm — joy blossom button | 456 | `active:scale-90` — scale transform on press. Scale is explicitly excluded from Calma (translate-only). Replace with `active:opacity-70` or a colour shift. | **High** |
| CheckInForm / SettingsView / HelpView nav links | various | `text-stone-600 hover:text-stone-800` — two steps darker. CLAUDE.md codifies this as intended nav-link hover; it deviates from the one-step Calma rule. Recommend explicitly documenting this exception in the design language. | **Medium** |

---

## 3. Touch Target Compliance

Minimum 44 × 44 px for every tappable element.

### Passing

| Element | File | Enforced by |
|---|---|---|
| Joy blossom button | CheckInForm.tsx:456 | `min-h-[44px] min-w-[44px]` |
| DayDetail close button | DayDetail.tsx:150 | `min-h-[44px] min-w-[44px]` |
| CalendarHeatmap month nav buttons | CalendarHeatmap.tsx | `min-h-[44px]` |
| Calendar day cells | CalendarHeatmap.tsx | `h-11 w-11` (44 × 44 px) |
| Frequency toggle button | HistoryView.tsx:93 | `min-h-[44px]` |
| FrequencyList rows | FrequencyList.tsx:142 | `min-h-[44px]` |
| Full-width form buttons | SettingsView.tsx | `py-4 w-full` |

### Failing

| Component | Line | Element | Actual size | Severity |
|---|---|---|---|---|
| HabitToggle | 34 | Toggle switch button | `h-7 w-12` = **28 × 48 px** — 16 px short | **High** |
| NumberStepper | 73, 96 | Decrement / Increment buttons | `h-8 w-8` = **32 × 32 px** | **High** |
| MomentChip | 11 | Chip button | `py-2` ≈ **32 px** | Medium |
| CheckInForm | 361 | "New moment" dashed button | `py-2` ≈ **32 px** | Medium |
| CheckInForm | 395, 403 | Inline "Add" and dismiss "✕" | ~32 px / ~20 px | Medium |
| CalendarHeatmap | 223, 234 | Year prev / next buttons | No `min-h`; icon ≈ 20 px | Medium |
| SettingsView | 110 | Back button | `text-xs` only | Medium |
| SettingsView | 142, 153 | Light / Dark theme buttons | `text-sm` only | Medium |
| SettingsView | 226, 297, 313, 327, 335 | Various bare-text controls | No min-h | Medium |
| ManageView | 244, 254, 278, 289, 292, 345, 353, 388, 413, 419, 597 | Various bare-text controls | No min-h | Medium |
| HelpView | 21, 102 | Back link + design link | `text-xs` only | Medium |

---

## 4. Animation Audit

### CSS transitions (globals.css + Tailwind utilities)

| Element | File | Property | Duration | Reduced-motion guard | Severity |
|---|---|---|---|---|---|
| `.frequency-chevron` | globals.css | `transform` (rotation) | 200 ms | ✅ `@media` in globals.css | Pass |
| `.heatmap-grid / .frequency-list` | globals.css | `opacity` | 120 ms | ✅ `@media` in globals.css | Pass |
| DayDetail backdrop | DayDetail.tsx:132 | `opacity` via `.daydetail-backdrop` | 300 ms | ✅ `@media` in globals.css (Sprint 7) | **Pass** |
| DayDetail bottom sheet | DayDetail.tsx:142 | `transform` via `.daydetail-sheet` | 300 ms | ✅ `@media` in globals.css (Sprint 7) | **Pass** |
| HabitToggle thumb | HabitToggle.tsx:41 | `left` via `transition-all` | 200 ms | No guard; `transition-all` overly broad | Low |

Sprint 7 resolved the two DayDetail CSS transition reduced-motion issues by adding `.daydetail-backdrop` and `.daydetail-sheet` class names and suppressing them in the existing `@media (prefers-reduced-motion: reduce)` block. ✅

### Motion (JS) animations

| Element | File | Lines | Duration | Notes | Severity |
|---|---|---|---|---|---|
| Add-moment reveal | CheckInForm.tsx | 373–376 | 220 ms ease-out | ✅ via MotionProvider | Pass |
| Joy section reveal/exit | CheckInForm.tsx | 424–430 | 280 ms ease-out | ✅ | Pass |
| Joy row enter/exit | CheckInForm.tsx | 441–446 | 160 ms | ✅ | Pass |
| Month heading crossfade | CalendarHeatmap.tsx | 255–264 | 110 ms | Below 120 ms floor | **Medium** |
| Calendar grid slide | CalendarHeatmap.tsx | 283–291 | 220 ms ease-out | ✅ | Pass |
| Frequency section reveal | HistoryView.tsx | 101–106 | 280 ms ease-out | ✅ | Pass |
| FrequencyList hint exit | FrequencyList.tsx | 118–121 | 300 ms | ✅ | Pass |
| FrequencyList bar grow | FrequencyList.tsx | 155–163 | 250 ms | Animates `width` — only opacity/translate/height allowed | **Medium** |
| ManageView inline form reveals | ManageView.tsx | various | 220 ms ease-out | ✅ | Pass |
| Joy blossom button (CSS) | CheckInForm.tsx | 456 | — | `active:scale-90` — scale transform, Calma-forbidden | **High** |

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

## Prioritised Fix List

### High (fix before next deploy)
1. **CheckInForm joy blossom `active:scale-90`** (`CheckInForm.tsx:456`): Replace with `active:opacity-70`.
2. **HabitToggle touch target** (`HabitToggle.tsx:34`): Wrap in `min-h-[44px]` strategy.
3. **NumberStepper ± buttons** (`NumberStepper.tsx:73,96`): Increase to `min-h-[44px] min-w-[44px]` with centred visual circle.

### Medium (fix in Sprint 8)
4. **MomentChip touch target** (`MomentChip.tsx:11`): Add `min-h-[44px]`.
5. **CalendarHeatmap year-nav buttons**: Add `min-h-[44px]`.
6. **FrequencyList bar `width` animation** (`FrequencyList.tsx:163`): Swap to `scaleX` with `transform-origin: left`.
7. **Month heading crossfade 110 ms** (`CalendarHeatmap.tsx`): Raise to `0.12` to meet 120 ms floor.
8. **Two-step hover jumps**: Codify `stone-600 → stone-800` nav-link exception in the Calma doc.
9. **Missing `transition-colors`** (`SettingsView.tsx:229`, `ManageView.tsx:254,413,419`).

### Low (polish pass)
10. **CalendarHeatmap opacity-25**: Raise to `opacity-30`.
11. **FrequencyList invisible chevron**: Replace with `opacity-0`.
12. **HabitToggle thumb `transition-all`**: Narrow to `transition-[left]`.
13. **BottomNav inactive tabs**: Add `hover:text-stone-700 dark:hover:text-stone-300`.
14. Medium-severity touch targets in Settings/Manage/Help.

---

## Summary

**3 high · 7 medium · 5 low**

Sprint 7 resolved the two DayDetail reduced-motion medium findings. All other pre-sprint findings carry forward unchanged. No regressions introduced.
