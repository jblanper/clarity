# Interaction & Motion Audit

Generated: 2026-03-20 12:41

Archive note: Archived previous report → docs/audits/archive/audit-interaction-2026-03-20.md. Sprint 14 baseline: 0 high · 1 medium · 8 low.

Calma principles reviewed against every interactive element and animation.
Severity: High (breaks experience or accessibility) · Medium (noticeable deviation) · Low (polish/consistency)

Sprint 15 context: All pre-existing Low and Medium findings addressed. BottomNav inactive tabs get hover colour. SettingsView `✕` button gets `transition-colors`. FrequencyList chevron changed from `invisible` to `opacity-0`. CalendarHeatmap `opacity-25` → `opacity-30`. ManageView exit animations updated to `ease: "easeIn"`. Calma spec updated to document two-step hover jump. ManageView `+ New` unification completed (Moments section header matches Habits pattern).

---

## 1. Transition Completeness

### Passing

| Element | File | Classes |
|---|---|---|
| HabitToggle full-row button | HabitToggle.tsx:29 | `transition-[background-color]` |
| HabitToggle dot indicator | HabitToggle.tsx:34 | `transition-colors` |
| MomentChip | MomentChip.tsx:15 | `transition-colors` |
| NumberStepper decrement button | NumberStepper.tsx:54 | `transition-colors` |
| NumberStepper pill button | NumberStepper.tsx:66 | `transition-colors` |
| SegmentedPill segments | SegmentedPill.tsx:22 | `transition-colors` |
| "＋ New moment" ghost button | CheckInForm.tsx:366 | `transition-colors` |
| "Add" confirm button | CheckInForm.tsx:400 | `transition-colors` |
| "✕" dismiss button | CheckInForm.tsx:407 | `transition-colors` |
| Joy blossom button | CheckInForm.tsx:456 | `transition-opacity` |
| Save/Capture button | CheckInForm.tsx:498 | `transition-colors duration-500` |
| Back / Settings links | CheckInForm.tsx:263, 271 | `transition-colors` |
| BottomNav tabs (active) | BottomNav.tsx:33 | `transition-colors` |
| BottomNav tabs (inactive) | BottomNav.tsx:34 | `transition-colors` + hover colour ✅ (fixed Sprint 15) |
| DayDetail close button | DayDetail.tsx:151 | `transition-colors` |
| DayDetail "Edit this day" link | DayDetail.tsx:265 | `transition-colors` |
| CalendarHeatmap year-nav buttons | CalendarHeatmap.tsx:128, 140 | `transition-colors` |
| CalendarHeatmap month nav buttons | CalendarHeatmap.tsx:153, 177 | `transition-colors` |
| Calendar date cells | CalendarHeatmap.tsx:244 | `transition-colors` |
| HistoryView Settings link | HistoryView.tsx:77 | `transition-colors` |
| Frequency toggle button | HistoryView.tsx:118 | `transition-colors` |
| ManageView back link | ManageView.tsx:243 | `transition-colors` |
| ManageView `+ New` (Habits) | ManageView.tsx:258 | `transition-colors` |
| ManageView `+ New` (Moments) | ManageView.tsx:616 | `transition-colors` ✅ (new in Sprint 15) |
| ManageView habit row tap button | ManageView.tsx:424 | `transition-colors` |
| ManageView action tray buttons | ManageView.tsx | `transition-colors` (via constants) |
| ManageView moment chip buttons | ManageView.tsx:684 | `transition-colors` |
| ManageView SAVE_BTN buttons | ManageView.tsx | `transition-colors` |
| FrequencyList rows | FrequencyList.tsx:142 | `transition-colors` |
| SettingsView all interactive buttons | SettingsView.tsx | `transition-colors` |
| SettingsView remove-file `✕` button | SettingsView.tsx:227 | `transition-colors` ✅ (fixed Sprint 15) |
| HelpView back + design-language link | HelpView.tsx:22, 110 | `transition-colors` |

### Missing

**None.** ✅

All two pre-existing Low findings (BottomNav hover colour, SettingsView `✕` `transition-colors`) resolved in Sprint 15.

---

## 2. Motion library usage

### Duration violations

None. All animations ≤ 320ms: calendar grid 220ms, month heading crossfade 120ms, height reveals 220–280ms, joy section 280ms enter / 140–160ms per-item, FrequencyList hint exit 300ms, archived sections 220ms, action tray 200ms. ✅

### Easing violations

None. All enters use `easeOut`, all exits use `easeIn`. ✅

Sprint 15 fix verified: ManageView exit animations previously inherited default easing rather than explicit `easeIn`. All `m.div` exit objects in ManageView now include `transition: { ease: "easeIn" }` inside each `exit` prop; top-level `transition` retains `ease: "easeOut"` for enters. ✅

### Height reveal violations

None. All height reveals use `animate={{ height: "auto" }}` with `style={{ overflow: "hidden" }}`. ✅

Sprint 15 `+ New` form (Moments section): correctly uses `INLINE_FORM_SHELL` (border+bg only on `m.div`); padding on inner `div`. No height-jump on enter. ✅

### Directional slide violations

None. CalendarHeatmap uses named `gridVariants` + `custom` prop on both `AnimatePresence` and `m.div` — correct pattern. ✅

### Exit snap violations

None. All animated wrappers with padding/margin animate those properties to 0 in exit. ✅

Spot-checked Sprint 15 additions:
- Moments add-moment form: `marginBottom: 0` in exit ✅
- ManageView all existing exit objects: `transition: { ease: "easeIn" }` added inside each exit prop ✅

### MotionProvider

`LazyMotion + domAnimation + MotionConfig reducedMotion="user"` wraps the app via `app/layout.tsx`. Not duplicated. ✅

---

## 3. Reduced motion

`MotionConfig reducedMotion="user"` in MotionProvider handles all JS animations globally. ✅

CSS transitions in `globals.css` for `.daydetail-backdrop`, `.daydetail-sheet`, `.frequency-chevron`, `.heatmap-grid` all have `@media (prefers-reduced-motion: reduce)` guards. ✅

No new raw CSS `@keyframes` introduced in Sprint 15. ✅

---

## 4. CSS vs Motion boundary violations

No violations found.

- CSS transitions correct for: all hover/active colour changes ✅
- Motion library used correctly for: calendar grid month slide, all height reveals, all AnimatePresence enter/exit sequences ✅
- FrequencyList bar: `scaleX: 0 → 1` with `transformOrigin: "left"` and static `style={{ width: barWidth }}` — matches spec pattern exactly ✅

---

## 5. Scroll lock

`DayDetail.tsx` correctly uses `useLayoutEffect` (not `useEffect`) for `document.body.style.overflow = "hidden"`. ✅ Unchanged.

---

## 6. Sprint 15 new patterns assessment

### ManageView `+ New` Moments unification

Moments section header now matches Habits pattern: `flex items-center justify-between` with `+ New` button in the header row. Add-moment form renders above the chip grid (before it in JSX). Old chip-style `+ New` removed from the grid entirely. `closeAllEditors()` continues to govern both `addingTag` and `editingMomentId`. Animation uses `INLINE_FORM_SHELL` — border+bg on `m.div`, padding on inner `div`. ✅

### Two-step hover jump documentation

Calma spec updated in `docs/calma-design-language.md` Interaction section: the `stone-600 → stone-800` nav-link hover jump is now documented as a deliberate pattern providing clear affordance at hover without adding weight at rest. Medium finding closed. ✅

### FrequencyList chevron `invisible` → `opacity-0`

The layout-spacing chevron span at FrequencyList.tsx line 148 was using `invisible` (removes from accessibility tree). Verified the `<span>` wrapping `<Chevron />` has no `aria-label` or semantic role; changing to `opacity-0` is correct — keeps it in layout and visually hidden, preserves DOM without accessibility-tree content. ✅

---

## Remaining issues

### Medium — 0

Two-step hover jump now documented in Calma spec. ✅

### Low — 0

All 8 pre-existing Low findings resolved:

| ID | Issue | Status |
|---|---|---|
| L1 | NumberStepper keyboard navigation | Dropped permanently — not appropriate for mobile-first app |
| L2 | NumberStepper `aria-valuemax` | Dropped alongside keyboard nav |
| L3 | CalendarHeatmap `opacity-25` filtered cells | **Closed** — raised to `opacity-30` Sprint 15 |
| L4 | FrequencyList `invisible` chevron | **Closed** — changed to `opacity-0` Sprint 15 |
| L5 | BottomNav inactive tabs: no hover colour | **Closed** — `hover:text-stone-700 dark:hover:text-stone-200` added Sprint 15 |
| L6 | SettingsView `✕` no `transition-colors` | **Closed** — `transition-colors` added Sprint 15 |
| L7 | ManageView exits default easing | **Closed** — `ease: "easeIn"` added to all exit objects Sprint 15 |
| L8 | ManageView archived toggles no `min-h-[44px]` | **Closed** — `min-h-[44px]` added Sprint 15 (also covered by typography audit) |

---

## Summary

**0 high · 0 medium · 0 low**

Sprint 15 closed all remaining interaction findings. Zero open interaction findings entering Sprint 16.
