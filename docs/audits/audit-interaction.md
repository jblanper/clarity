# Interaction & Motion Audit

Generated: 2026-03-15 (Sprint 13 validation)

Archive note: Pre-sprint baseline (Sprint 12): 0 high · 1 medium · 10 low. Sprint 13 resolved the one Medium finding (ManageView habit row `aria-expanded`) and one Low finding (habit row `transition-colors`). Net: 0 medium, 9 low.

Calma principles reviewed against every interactive element and animation.
Severity: High (breaks experience or accessibility) · Medium (noticeable deviation) · Low (polish/consistency)

Sprint 13 context: Task 3 (M6) added `aria-expanded` to ManageView habit row tap button — resolving the Sprint 12 Medium finding. Task 3 (L4) added `transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50` to the habit row button — resolving Sprint 12 Low finding #10. Task 4 (M3) updated action tray exit to `paddingTop: 0, paddingBottom: 0, marginBottom: 0`. Task 5 (L1) moved `+ New` to chip grid; Task 5 (L2) added archived disclosure with height-reveal animation.

Sprint 12 context: Task 1 carry-forward (ManageView token fixes). Task 2 added SegmentedPill (new interactive component). Tasks 3–5 SettingsView restructure (App card, Your Data, Reset). Task 6 HelpView touch targets. Tasks 7–9 ManageView B1–B4 — section cards, full-row tap + action tray (AnimatePresence pattern), Moments chip grid, joy pill.

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
| Calendar day cells | CalendarHeatmap.tsx | `transition-colors` |
| HistoryView Settings link | HistoryView.tsx:70 | `transition-colors` |
| Frequency toggle button | HistoryView.tsx:99 | `transition-colors` |
| Period selector buttons | HistoryView.tsx:136–148 | `transition-colors` |
| ManageView back link | ManageView.tsx:226 | `transition-colors` |
| ManageView `+ New` buttons | ManageView.tsx:242,559 | `transition-colors` |
| ManageView habit row tap button | ManageView.tsx:263 | (no explicit transition-colors — see note) |
| ManageView action tray Edit button | ManageView.tsx:287 | `transition-colors` (via ACTION_BTN) |
| ManageView action tray Archive button | ManageView.tsx:305 | `transition-colors` (via TRAY_ARCHIVE_BTN) |
| ManageView action tray Joy button | ManageView.tsx:307 | `transition-colors` (via TRAY_JOY_BTN / TRAY_JOY_ON_BTN) |
| ManageView moment chip buttons | ManageView.tsx:620 | `transition-colors` |
| ManageView SAVE_BTN buttons | ManageView.tsx (various) | `transition-colors` |
| FrequencyList rows | FrequencyList.tsx:142 | `transition-colors` |
| SettingsView all interactive buttons | SettingsView.tsx | `transition-colors` |
| HelpView back + design-language link | HelpView.tsx:23,105 | `transition-colors` |

Sprint 13 (L4): ManageView habit row tap button (ManageView.tsx:263) now has `transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50` — **Sprint 12 Low finding resolved.** ✅

### Failing

| Component | Line | Description | Severity |
|---|---|---|---|
| SettingsView | 227 | Remove-file "✕" button — `hover:text-stone-700` but no `transition-colors` | Low (pre-existing) |
| ManageView | 425,430 | "Yes / No" and "Number" type-pickers — `hover:underline` but no `transition-colors` | Low (pre-existing) |
| BottomNav | 34 | Inactive tabs have `transition-colors` but no hover colour — transition fires over nothing | Low (pre-existing) |
| ManageView | 263 | Habit row full-row tap — no `transition-colors`, no hover colour | Low (new) |

---

## 2. Motion library usage

### Duration violations

All animations in ManageView are 220ms (`duration: 0.22`). ✅ Under 320ms ceiling.

| Component | File | Duration | Notes | Severity |
|---|---|---|---|---|
| Action tray reveal | ManageView.tsx:283 | 220ms ease-out | ✅ |
| Inline edit form reveal | ManageView.tsx:311 | 220ms ease-out | ✅ |
| Add-habit type picker | ManageView.tsx:417 | 220ms ease-out | ✅ |
| Add-habit form reveal | ManageView.tsx:451 | 220ms ease-out | ✅ |
| Add-tag form reveal | ManageView.tsx:655 | 220ms ease-out | ✅ |

All pre-existing animations unchanged and within limits. ✅

### Easing violations

**None found.** All new ManageView animations use `ease: "easeOut"` (enter) with no exit easing specified — Framer Motion defaults to `easeOut` for exits when not specified. For exit animations this defaults to a symmetric ease-out, which is technically acceptable but not the CLAUDE.md-recommended ease-in for exits. **Low** — carry-forward from pre-existing ManageView animations; consistent with existing patterns.

### Height reveal violations

**None found.** All height reveals use `animate={{ height: "auto" }}` with `style={{ overflow: "hidden" }}`. ✅

| Element | Pattern | Status |
|---|---|---|
| Action tray reveal | `height: 0 → "auto"` + `overflow: "hidden"` | ✅ |
| Inline edit form | Same pattern | ✅ |
| Add-habit type picker | Same pattern | ✅ |
| Add-habit/tag forms | Same pattern | ✅ |

### Directional slide violations

**No directional slides in Sprint 12 changes.** ✅ (Action tray is height reveal + opacity, not directional.)

### Exit snap violations

The action tray uses `exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0 }}` with `className="mb-2 … py-3"`. All three padding/margin values are animated to 0 — snap-free. ✅ (Sprint 13 M3 updated from `paddingBottom: 0` only.)

The inline edit form uses `exit={{ height: 0, opacity: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}` with className `INLINE_FORM` which includes `px-4 py-4` — both `paddingTop: 0` and `paddingBottom: 0` are animated, correctly collapsing vertical padding. ✅

Add-habit/tag forms: `exit={{ height: 0, opacity: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}` — comprehensive. ✅

### MotionProvider

`LazyMotion + domAnimation + MotionConfig reducedMotion="user"` is in place in `components/MotionProvider.tsx` and wraps the app via `app/layout.tsx`. Not duplicated. ✅

---

## 3. Reduced motion

`MotionConfig reducedMotion="user"` in `MotionProvider` handles this globally. ✅

CSS transitions in `globals.css` for `.daydetail-backdrop`, `.daydetail-sheet`, `.frequency-chevron`, `.heatmap-grid` all have `@media (prefers-reduced-motion: reduce)` guards. ✅

No new raw CSS `@keyframes` introduced in Sprint 12. ✅

---

## 4. CSS vs Motion boundary violations

No violations found. SettingsView Sprint 12 changes (SegmentedPill, App card, Your Data, Reset) use `transition-colors` only — correct for colour-only state changes with no layout motion. ✅

ManageView action tray and form reveals correctly use Motion (height changes = layout motion). ✅

---

## 5. Scroll lock

`DayDetail.tsx` correctly uses `useLayoutEffect` (not `useEffect`) for `document.body.style.overflow = "hidden"`. ✅ Unchanged from Sprint 11.

---

## 6. Touch targets (interaction view)

See Typography audit §3 for full table. Key Sprint 12 results:
- SegmentedPill: `min-h-[44px]` ✅
- App card links: `min-h-[44px]` ✅
- Reset buttons: `min-h-[44px]` ✅
- HelpView links: `min-h-[44px]` ✅
- ManageView habit rows + chip grid: `min-h-[44px]` ✅
- SettingsView back button: still missing — **Medium** (pre-existing)
- Remove-file "✕": still missing — **Medium** (pre-existing)

---

## 7. Accessibility — ARIA roles

| Element | File | ARIA | Assessment |
|---|---|---|---|
| HabitToggle | HabitToggle.tsx:25–27 | `role="switch"` `aria-checked` `aria-label` | ✅ |
| NumberStepper pill | NumberStepper.tsx:62–65 | `role="spinbutton"` `aria-valuenow` `aria-valuemin` `aria-label` | ✅ |
| NumberStepper decrement | NumberStepper.tsx:53 | `aria-label="Decrease {label}"` | ✅ |
| DayDetail dialog | DayDetail.tsx:124–127 | `role="dialog"` `aria-modal` `aria-label` | ✅ |
| MomentChip | MomentChip.tsx:14 | `aria-pressed={selected}` | ✅ |
| SettingsView back button | SettingsView.tsx:115 | `aria-label="Go back"` | ✅ New in Sprint 12 |
| SettingsView file input | SettingsView.tsx:204 | `aria-label="Choose a backup file"` | ✅ |

ManageView habit row tap button (ManageView.tsx:268): now has `aria-expanded={actionTrayId === h.id}` — **Sprint 13 M6 resolved.** ✅

---

## Remaining issues

### Medium
1. **Two-step hover jumps** (pre-existing): Codify `stone-600 → stone-800` nav-link exception in Calma doc.

Sprint 13 resolved: SettingsView back button touch target (S5) ✅; ManageView habit row `aria-expanded` (M6) ✅.

### Low (polish pass)
2. **NumberStepper spinbutton keyboard**: Add `onKeyDown` arrow-key increment/decrement (pre-existing).
3. **NumberStepper `aria-valuemax`**: Add when `max !== Infinity` (pre-existing).
4. **CalendarHeatmap opacity-25**: Raise to `opacity-30` for future/filter-dimmed cells (pre-existing).
5. **FrequencyList invisible chevron**: Replace `invisible` with `opacity-0` (pre-existing).
6. **BottomNav inactive tabs**: Add `hover:text-stone-700 dark:hover:text-stone-300` (pre-existing).
7. **Missing `transition-colors`**: SettingsView:227, ManageView:425, ManageView:430 (pre-existing).
8. **Exit easing**: ManageView exit animations inherit default easing rather than ease-in (low, consistent with pre-existing pattern).
9. **Archived disclosure touch targets**: ManageView:406, 677 — `py-1` only, no `min-h-[44px]` (new Sprint 13 — low-priority secondary control).

---

## Summary

**0 high · 1 medium · 9 low**

Sprint 13 resolved: ManageView `aria-expanded` Medium (M6) ✅; ManageView habit row `transition-colors` Low (L4) ✅; SettingsView back button touch target Medium (S5) ✅. One new Low introduced (archived disclosure toggles). Net: 1 medium → 0 medium from Sprint 12; low count 10 → 9 (1 new, 2 resolved).
