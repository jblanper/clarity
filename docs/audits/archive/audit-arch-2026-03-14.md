# Architecture Audit

Audited: Sprint 9 changes (commits 10df89f, 683ea49, ffd7634).
Reference: `CLAUDE.md` + `docs/calma-design-language.md`.
Date: 2026-03-13.

Sprint 9 context: Check-In Controls Redesign — HabitToggle full-row button, NumberStepper tap-to-increment pill, `startAt` field for numeric habits, WCAG colour + touch-target fixes.

---

## 1. CLAUDE.md compliance

| Rule | Status | Notes |
|---|---|---|
| Never delete an archived config | ✅ | No archive logic touched |
| Never add interactivity to `app/` files | ✅ | No `app/` files modified |
| Never use `toISOString()` | ✅ | No date handling changed |
| Never use `text-stone-400` as light-mode foreground | ✅ | HistoryView period selector fixed (stone-400 → stone-500); pre-existing archival dimming intentionally unchanged |
| Never use `router.back()` | ✅ | No navigation changes |
| Never add partial helpers to AppConfigs | ✅ | `startAt` added via read-modify-write; `getConfigs()`/`saveConfigs()` unchanged |
| `type="button"` on non-submit buttons | ✅ | All new buttons in HabitToggle, NumberStepper, CheckInForm carry `type="button"` |
| `active:opacity-70` press feedback (not `active:scale-*`) | ✅ | Used on all new interactive elements |
| No `animate:width/height` (layout reflow) | ✅ | No Framer Motion used in sprint changes |
| Primary/secondary button token compliance | ✅ | No new primary/secondary buttons added |

---

## 2. Sprint plan fidelity

| Task | Status | Notes |
|---|---|---|
| Task 1: `startAt?: number` in `NumericHabitConfig` | ✅ | Added after `step` field, optional, backward-compatible |
| Task 2: WCAG stone-400 → stone-500 (HistoryView, 3 buttons) | ✅ | All three inactive period selector buttons corrected |
| Task 2: Touch targets on add-moment buttons | ✅ | `min-h-[44px]` on all three (+ New moment, Add, ✕) |
| Task 3: HabitToggle full-row button | ✅ | Matches plan spec exactly — `role="switch"`, amber dot, `active:opacity-70` |
| Task 4: NumberStepper tap-to-increment pill | ✅ | Matches plan spec — pill, conditional `−` glyph, `startAt` first-tap |
| Task 5: ManageView "Start at" field — inline edit | ✅ | Field present after "Increment" in edit form |
| Task 5: ManageView "Start at" field — add-habit form | ✅ | Field present after "Increment" in add form |
| Task 6: CLAUDE.md HabitToggle note updated | ✅ | Bullet now describes full-row button pattern |

---

## 3. Findings

### 3a. Minor deviations (non-blocking)

**M1 — `startAt` input placeholder differs from plan**
- Sprint plan specifies `placeholder="Optional"`. Implementation uses `placeholder="0"`.
- Both edit and add forms affected.
- `placeholder="0"` is arguably more informative (matches the default value). No functional difference.
- Severity: **low** (cosmetic).

**M2 — `startAt` clear logic differs from plan on boundary values**
- Plan: `isNaN(v) || v <= 0 ? undefined : v` — clears on empty, `NaN`, or `≤ 0`.
- Implementation: `e.target.value === "" ? undefined : parseFloat(e.target.value)` — allows `startAt: 0` to be saved.
- Save condition: `...(editingHabit.startAt !== undefined && ...)` vs plan's truthy check `...(editingHabit.startAt ? ...)` — implementation would persist `startAt: 0`.
- At runtime, `handleTap` condition `startAt && startAt > 0` means `startAt: 0` is a stored no-op.
- Severity: **low** (harmless; stored value has no behavioral effect).

**M3 — `role="spinbutton"` without keyboard interaction**
- ARIA `spinbutton` role expects arrow-key support (`onKeyDown`). Pill button has `onClick` only.
- Sprint plan explicitly specifies `role="spinbutton"` — intentional per plan.
- Screen readers will announce it as a spinner but keyboard-only users cannot increment via arrow keys.
- Severity: **low** (accepted per sprint plan; documented for future sprint consideration).

### 3b. Dead code

None detected. Removed imports (`useState`, `useEffect` from NumberStepper) and deleted JSX (toggle thumb, direct input) are fully cleaned up.

---

## 4. Lint & tests

| Check | Result |
|---|---|
| `npm run lint` | 0 errors, 7 warnings (all pre-existing, unrelated to sprint changes) |
| `npm test` | 52 passed, 0 failed |

---

## 5. Gate decision

**PASS** — No must-fix issues. All six sprint tasks implemented per plan. CLAUDE.md compliance confirmed. Three minor findings (M1–M3) documented; none require code changes before merging.

Recommended follow-up (future sprint): add `onKeyDown` arrow-key support to NumberStepper pill if screen-reader keyboard navigation is a priority.
