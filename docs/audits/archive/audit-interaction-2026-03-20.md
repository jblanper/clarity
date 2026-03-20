# Interaction & Motion Audit

Generated: 2026-03-17 10:42

Archive note: Pre-sprint snapshot preserved as `docs/audits/archive/audit-interaction-2026-03-17.md`. Sprint 13 baseline: 0 high · 1 medium · 9 low.

Calma principles reviewed against every interactive element and animation.
Severity: High (breaks experience or accessibility) · Medium (noticeable deviation) · Low (polish/consistency)

Sprint 14 context: CalendarHeatmap refactored (typographic date-as-weight, `mode="popLayout"` grid AnimatePresence, conditional year row instant toggle). FrequencyList bar height change. SegmentedPill replaces period selector dot-buttons in HistoryView.

---

## 1. Transition Completeness

### Passing

| Element | File | Classes |
|---|---|---|
| HabitToggle full-row button | HabitToggle.tsx:29 | `transition-colors` |
| HabitToggle dot indicator | HabitToggle.tsx:34 | `transition-colors` |
| MomentChip | MomentChip.tsx:15 | `transition-colors` |
| NumberStepper decrement button | NumberStepper.tsx:54 | `transition-colors` |
| NumberStepper pill button | NumberStepper.tsx:66 | `transition-colors` |
| SegmentedPill segments | SegmentedPill.tsx:22 | `transition-colors` |
| Period selector (SegmentedPill) | HistoryView.tsx | `transition-colors` via SegmentedPill ✅ (replaces old dot-buttons) |
| "＋ New moment" ghost button | CheckInForm.tsx:366 | `transition-colors` |
| "Add" confirm button | CheckInForm.tsx:400 | `transition-colors` |
| "✕" dismiss button | CheckInForm.tsx:407 | `transition-colors` |
| Joy blossom button | CheckInForm.tsx:458 | `transition-opacity` |
| Save/Capture button | CheckInForm.tsx:494 | `transition-colors duration-500` |
| Back / Settings links | CheckInForm.tsx:263,271 | `transition-colors` |
| BottomNav tabs | BottomNav.tsx:31 | `transition-colors` |
| DayDetail close button | DayDetail.tsx:150 | `transition-colors` |
| DayDetail "Edit this day" link | DayDetail.tsx:264 | `transition-colors` |
| CalendarHeatmap year-nav buttons | CalendarHeatmap.tsx:226,237 | `transition-colors` |
| CalendarHeatmap month nav buttons | CalendarHeatmap.tsx:248,271 | `transition-colors` |
| Calendar date cells | CalendarHeatmap.tsx | `transition-colors` |
| HistoryView Settings link | HistoryView.tsx:70 | `transition-colors` |
| Frequency toggle button | HistoryView.tsx:99 | `transition-colors` |
| ManageView back link | ManageView.tsx:226 | `transition-colors` |
| ManageView `+ New` buttons | ManageView.tsx:242,559 | `transition-colors` |
| ManageView habit row tap button | ManageView.tsx:263 | `transition-colors hover:bg-stone-50` |
| ManageView action tray buttons | ManageView.tsx | `transition-colors` (via constants) |
| ManageView moment chip buttons | ManageView.tsx:620 | `transition-colors` |
| ManageView SAVE_BTN buttons | ManageView.tsx | `transition-colors` |
| FrequencyList rows | FrequencyList.tsx:142 | `transition-colors` |
| SettingsView all interactive buttons | SettingsView.tsx | `transition-colors` |
| HelpView back + design-language link | HelpView.tsx:23,105 | `transition-colors` |

### Missing

| Component | Line | Description | Severity |
|---|---|---|---|
| `SettingsView.tsx` | 227 | Remove-file "✕" button — `hover:text-stone-700` but no `transition-colors` | **Low** (pre-existing) |
| `BottomNav.tsx` | 34 | Inactive tabs have `transition-colors` but no hover colour — transition fires over nothing | **Low** (pre-existing) |

---

## 2. Motion library usage

### Duration violations

None. All animations ≤ 320ms: calendar grid 220ms, month heading crossfade 120ms, height reveals 220–280ms, joy section 280ms enter / 140–160ms per-item, FrequencyList hint exit 300ms, archived sections 220ms. ✅

### Easing violations

None. All enters use `easeOut`, all exits use `easeIn` (explicit or framework default). ✅

Minor (pre-existing Low): some ManageView exit animations omit explicit ease, inheriting default rather than `easeIn`. Consistent with pre-existing pattern — not newly introduced.

### Height reveal violations

None. All height reveals use `animate={{ height: "auto" }}` with `style={{ overflow: "hidden" }}`. ✅

All INLINE_FORM_SHELL-pattern wrappers separate border/bg from padding — Framer Motion measures height without padding offset. ✅

### Directional slide violations

None. CalendarHeatmap uses named `gridVariants` + `custom` prop on both `AnimatePresence` and `m.div` — correct pattern. ✅

### Exit snap violations

None. All animated wrappers with padding/margin animate those properties to 0 in exit:
- Action tray: `paddingTop: 0, paddingBottom: 0, marginBottom: 0` ✅
- Inline edit form: `paddingTop: 0, paddingBottom: 0, marginBottom: 0` ✅
- Add-habit/tag forms: comprehensive zero-out ✅
- Moment edit card: INLINE_FORM_SHELL pattern (padding on inner div) ✅

### MotionProvider

`LazyMotion + domAnimation + MotionConfig reducedMotion="user"` wraps the app via `app/layout.tsx`. Not duplicated. ✅

---

## 3. Reduced motion

`MotionConfig reducedMotion="user"` in MotionProvider handles all JS animations globally. ✅

CSS transitions in `globals.css` for `.daydetail-backdrop`, `.daydetail-sheet`, `.frequency-chevron`, `.heatmap-grid` all have `@media (prefers-reduced-motion: reduce)` guards. ✅

No new raw CSS `@keyframes` introduced in Sprint 14. ✅

---

## 4. CSS vs Motion boundary violations

No violations found.

- CSS transitions correct for: all hover/active colour changes, opacity fades for period update feedback ✅
- Motion library used correctly for: calendar grid month slide, all height reveals, all AnimatePresence enter/exit sequences ✅
- FrequencyList bar: `scaleX: 0 → 1` with `transformOrigin: "left"` and static `style={{ width: barWidth }}` — matches spec pattern exactly ✅

---

## 5. Scroll lock

`DayDetail.tsx` correctly uses `useLayoutEffect` (not `useEffect`) for `document.body.style.overflow = "hidden"`. ✅ Unchanged.

---

## 6. Sprint 14 new patterns assessment

### CalendarHeatmap `mode="popLayout"` grid

Switched from `mode="wait"` to `mode="popLayout"` with a `relative overflow-hidden` wrapper. The exiting element is immediately removed from document flow (positioned absolute) when its exit begins, preventing the brief zero-height gap that caused the BottomNav to jump on iOS Safari. Correct implementation — `overflow-hidden` clips the absolutely-positioned exit element within the calendar area. ✅

### Conditional year row

Year row: instant show/hide based on data condition (`showYearRow`). No animation applied — correct for a data-state transition that is not triggered by user interaction. ✅

### Calendar date cells `transition-colors`

Present. Ensures the `bg-stone-100 dark:bg-stone-800` selected-day circle and opacity filter changes animate smoothly. ✅

---

## 7. Accessibility — ARIA roles (unchanged)

All ARIA roles unchanged from Sprint 13: HabitToggle `role="switch"` ✅, NumberStepper `role="spinbutton"` ✅, DayDetail `role="dialog"` ✅, MomentChip `aria-pressed` ✅, ManageView habit row `aria-expanded` ✅.

---

## Remaining issues

### Medium — 1 (pre-existing, unchanged)

1. **Two-step hover jumps** — `stone-600 → stone-800` nav-link hover exception not documented in Calma spec. Docs-only change, low urgency. (Pre-existing)

### Low — 8 (carry-forward from Sprint 13)

| ID | Component | Issue | Status |
|---|---|---|---|
| L1 | `NumberStepper.tsx` | No `onKeyDown` arrow-key increment/decrement | Pre-existing |
| L2 | `NumberStepper.tsx` | No `aria-valuemax` when `max !== Infinity` | Pre-existing |
| L3 | `CalendarHeatmap.tsx` | `opacity-25` on filtered/future cells — could raise to `opacity-30` | Pre-existing |
| L4 | `FrequencyList.tsx` | `invisible` chevron — replace with `opacity-0` for accessibility | Pre-existing |
| L5 | `BottomNav.tsx` | Inactive tabs: no hover colour (`hover:text-stone-700`) | Pre-existing |
| L6 | `SettingsView.tsx:227` | Remove-file "✕" — `hover:text-stone-700` but no `transition-colors` | Pre-existing |
| L7 | ManageView exits | Exit animations use default easing rather than explicit `easeIn` | Pre-existing |
| L8 | ManageView:406,677 | Archived disclosure toggles `py-1` only, no `min-h-[44px]` | Pre-existing (Sprint 13) |

---

## Summary

**0 high · 1 medium · 8 low**

Sprint 14 introduced no new interaction or motion findings. The `mode="popLayout"` CalendarHeatmap change, conditional year row, and SegmentedPill period selector all comply with Calma interaction principles. One pre-existing Low resolved: period selector dot-buttons (had `transition-colors`) replaced by SegmentedPill (also has `transition-colors`). Net: 0 high unchanged; 1 medium unchanged; low 9 → 8 (1 resolved by SegmentedPill replacement).
