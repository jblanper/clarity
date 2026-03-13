# Sprint 9 — Check-In Controls Redesign

**Dates:** 2026-03-10 – (TBD)
**Status:** active
**Release:** v2.2.0 (minor)

---

## Goal

Replace the OS-style toggle switch and three-zone number spinner with controls designed for Clarity: a full-row tap for habits, and a tap-to-increment pill for numbers. Add a per-habit "Start at" value to remove the cold-start problem for decimal-step habits like Sleep.

## Business value

The current controls borrow metaphors from settings panels and quantity selectors. The redesign makes the check-in feel like an act of recording, not configuring. Sleep at 0.5 hr increments currently requires up to 14 taps from zero — the "Start at" baseline eliminates that friction without adding UI clutter.

---

## Tasks

### Task 1 — Data model: `startAt` field

**What:** Add `startAt?: number` to `NumericHabitConfig` in `lib/habitConfig.ts`. This is the only data model change in the sprint — every subsequent task depends on it.

**Files:** `lib/habitConfig.ts`

**Implementation notes:**
- Add `startAt?: number` to the `NumericHabitConfig` interface, after the `step` field. Field is optional — existing habits that omit it behave as before (first tap = one step from 0).
- No changes to defaults, `getConfigs()`, `saveConfigs()`, or any localStorage key. Backwards compatible.
- Never add partial helpers to AppConfigs — read-modify-write via `getConfigs()` / `saveConfigs()` as per CLAUDE.md. This task touches only the interface, not the functions.
- The final `NumericHabitConfig` interface should read:
  ```ts
  export interface NumericHabitConfig {
    id: string;
    label: string;
    type: "numeric";
    unit: string;
    step: number;
    startAt?: number;
    archived: boolean;
  }
  ```

**Validation steps:**
- [ ] `lib/habitConfig.ts` — `NumericHabitConfig` interface has `startAt?: number` field
- [ ] No changes to `DEFAULT_HABIT_CONFIGS`, `getConfigs()`, or `saveConfigs()`
- [ ] `npm run lint && npm test` passes (no type errors introduced)

**Definition of done:** `startAt?: number` added to `NumericHabitConfig`; lint and tests pass.

---

### Task 2 — Quick fixes: WCAG period selector + add-moment touch targets

**What:** Two independent audit findings. (1) Change `text-stone-400` on inactive period buttons in HistoryView to `text-stone-500` (WCAG AA fix). (2) Add `min-h-[44px]` to the three add-moment buttons in CheckInForm.

**Files:** `components/HistoryView.tsx`, `components/CheckInForm.tsx`

**Implementation notes:**

**HistoryView period selector (lines 129, 134, 139):**
- The three `className` ternaries read: `period === "month" ? "text-stone-900 ... font-medium" : "text-stone-400 dark:text-stone-500 hover:text-stone-600 ..."`.
- Change `text-stone-400` → `text-stone-500` in each inactive branch (dark pairing `dark:text-stone-500` already correct, do not touch it).
- Three buttons: Month (line 129), 3 Months (line 134), Always (line 139). All three inactive branches must be updated.

**CheckInForm add-moment buttons:**
- `＋ New moment` button (~line 361): add `min-h-[44px] flex items-center` to className. The button has `py-2` (≈32 px) — `min-h-[44px]` raises the minimum without changing visual padding.
- `Add` confirm button (~line 395): add `min-h-[44px] flex items-center` to className. The button has `py-2`.
- `✕` dismiss button (~line 402): add `min-h-[44px] min-w-[44px] flex items-center justify-center` to className. The button currently has no explicit size.

**Validation steps:**
- [ ] HistoryView: open History → expand Frequency → inactive period buttons are visibly legible (`text-stone-500`, not near-invisible `text-stone-400`); no `text-stone-400` remains in the period selector className
- [ ] CheckInForm: inspect computed height of each add-moment button in DevTools → all ≥44 px
- [ ] `npm run lint && npm test` passes

**Definition of done:** Three WCAG colour fixes and three touch-target fixes applied; no `text-stone-400` on the period selector; all add-moment buttons ≥44 px; lint and tests pass.

---

### Task 3 — HabitToggle redesign: full-row tap

**What:** Replace the OS toggle switch (transparent hit area + visual pill + sliding thumb) with a full-row tap button. Done state: amber dot (left of label) + amber-50 row wash. Off state: stone dot, transparent background. The entire row is the tap target — no separate outer `div` required.

**Files:** `components/HabitToggle.tsx`

**Implementation notes:**

The current component returns a `div.flex.items-center.justify-between.py-3.5` containing a label `<span>` and a `<button>`. Replace the entire return with a single `<button>` that is the full row:

```tsx
return (
  <button
    type="button"
    role="switch"
    aria-checked={value.done}
    aria-label={label}
    onClick={handleToggle}
    className={`w-full flex items-center gap-3 min-h-[44px] py-3 rounded-xl px-2 -mx-2 transition-colors active:opacity-70 ${
      value.done ? "bg-amber-50 dark:bg-amber-900/15" : ""
    }`}
  >
    <span
      className={`h-2.5 w-2.5 flex-shrink-0 rounded-full transition-colors ${
        value.done
          ? "bg-amber-500 dark:bg-amber-400"
          : "bg-stone-300 dark:bg-stone-600"
      }`}
    />
    <span className="text-sm text-stone-700 dark:text-stone-300">{label}</span>
  </button>
);
```

- `role="switch"`, `aria-checked`, `aria-label`, `onClick` stay on the `<button>`.
- `focus:outline-none` may be omitted since the full-row visual state is sufficient affordance; include it if you prefer keyboard focus to be invisible.
- `w-full` makes the button fill its container; `-mx-2 px-2` extends the amber wash slightly beyond the text content area for a wider wash feel — adjust if it causes layout issues with the parent `divide-y` borders.
- `transition-colors` replaces the old `duration-200` — consistent with Calma interaction pattern.
- `active:opacity-70` is the Calma-required press feedback (no `active:scale-*`).
- The old thumb slide animation is removed entirely — no Framer Motion required.
- **Archived habits**: the `pointer-events-none` wrapper in CheckInForm wraps the `<HabitToggle>` component. Since the `<button>` is now the root element (not a child of a `<div>`), `pointer-events-none` on the parent still suppresses it correctly — verify manually.
- The `handleToggle` function is unchanged.
- Remove the `import type { HabitState }` line only if it becomes unused — it is still needed for the `Props` interface.

**Validation steps:**
- [ ] Tapping a habit row toggles state; amber dot and row wash appear when done; stone dot and transparent background when off
- [ ] Amber wash is visible in light mode (`bg-amber-50`) and dark mode (`dark:bg-amber-900/15`)
- [ ] No sliding thumb animation — no OS switch appearance
- [ ] `pointer-events-none` on archived habits: tapping archived habit rows does nothing (verify in CheckInForm)
- [ ] Row height is ≥44 px (computed in DevTools)
- [ ] `npm run lint && npm test` passes

**Definition of done:** Full-row button with amber dot and wash; no OS toggle; archived habits still suppressed; lint and tests pass.

---

### Task 4 — NumberStepper redesign: tap-to-increment pill

**Depends on Task 1** (requires `startAt?: number` prop, which flows from the updated `NumericHabitConfig`).

**What:** Replace the three-zone (−, input, +) stepper with a tap-to-increment pill. The pill is amber-50 when value > 0, stone-100 at zero. A decrement glyph (`−`) appears beside the pill only when value > 0. Direct type-in input is removed. First-tap behavior: if value is 0, the first tap jumps to `startAt` if configured (> 0); otherwise increments by step. Subsequent taps always increment by step. Decrement goes step-by-step down to 0.

**Files:** `components/NumberStepper.tsx`, `components/CheckInForm.tsx`

**Implementation notes:**

**`NumberStepper.tsx` — new interface:**
```ts
interface Props {
  label: string;
  unit: string;
  value: number;
  min?: number;
  max?: number;
  step: number;
  startAt?: number;
  onChange: (value: number) => void;
}
```

**Remove:** `inputValue` local state, its `useEffect` sync, `handleInputChange`, `handleBlur`. Remove `useState` and `useEffect` imports if they become unused after this removal.

**Keep:** `clamp()` and `addStep()` helper functions — still needed.

**New tap handler:**
```ts
const handleTap = () => {
  if (value === 0 && startAt && startAt > 0) {
    onChange(clamp(startAt, min, max));
  } else {
    onChange(clamp(addStep(value, step), min, max));
  }
};
const decrement = () => onChange(clamp(addStep(value, -step), min, max));
```

**New JSX structure:**
```tsx
return (
  <div className="flex items-center justify-between py-3.5">
    <div className="flex items-baseline gap-2">
      <span className="text-sm text-stone-700 dark:text-stone-300">{label}</span>
      <span className="text-xs text-stone-500 dark:text-stone-500">{unit}</span>
    </div>
    <div className="flex items-center gap-2">
      {value > 0 && (
        <button
          type="button"
          onClick={decrement}
          aria-label={`Decrease ${label}`}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 dark:text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200 active:opacity-70"
        >
          −
        </button>
      )}
      <button
        type="button"
        onClick={handleTap}
        role="spinbutton"
        aria-valuenow={value}
        aria-valuemin={min ?? 0}
        aria-label={label}
        className={`min-h-[44px] min-w-[44px] px-4 rounded-full transition-colors active:opacity-70 ${
          value > 0
            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
            : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
        }`}
      >
        {value}
      </button>
    </div>
  </div>
);
```

- Zero-state pill text is `text-stone-600` (~4.8:1 contrast on `bg-stone-100`). Do not use `text-stone-500` for the zero-state value — resolved in mediation.
- The decrement button has no `disabled` — it is not rendered at all when `value <= 0`. This is intentional: the glyph appears and disappears with the value.
- `max` is not checked on the pill button (`disabled` removed): there is no upper limit in the default habit configs. If `max` is a concern in future, add `disabled={value >= max}` to the pill. For now, omit it.
- `aria-valuemax` may be omitted if `max === Infinity` (default) — screen readers handle that gracefully.

**`CheckInForm.tsx` — pass `startAt` prop:**
In the `activeNumeric.map()` block (~line 313), add `startAt={h.startAt}` to the `<NumberStepper>` call:
```tsx
<NumberStepper
  key={h.id}
  label={h.label}
  unit={h.unit}
  value={fields.numeric[h.id] ?? 0}
  step={h.step}
  startAt={h.startAt}
  onChange={(value) => setNumericHabit(h.id, value)}
/>
```
The archived numeric block (~line 324) may also receive `startAt={h.startAt}` for consistency, though it has no effect (those rows are `pointer-events-none`).

**Validation steps:**
- [ ] Tapping the pill increments by step when value > 0
- [ ] Tapping the pill at zero: if `startAt` is configured for that habit, value jumps to `startAt` on first tap; if not configured, increments by step
- [ ] Decrement glyph (`−`) is not visible when value is 0; appears when value > 0
- [ ] Tapping `−` decrements by step down to 0 (not floored at `startAt`)
- [ ] Zero-state pill: `bg-stone-100 text-stone-600` in light mode (not `text-stone-500`)
- [ ] Non-zero pill: amber-50 background with amber-800 text in light mode; amber-900/20 background in dark mode
- [ ] No type-in input visible anywhere
- [ ] `npm run lint && npm test` passes

**Definition of done:** Tap-to-increment pill with first-tap `startAt` behavior; decrement glyph present only when value > 0; no direct input; correct zero-state contrast; lint and tests pass.

---

### Task 5 — ManageView: "Start at" field

**Depends on Task 1** (requires `startAt?: number` in `NumericHabitConfig`).

**What:** Add a "Start at" input field to both the inline edit form and the add-habit form for numeric habits in ManageView. Label shows the unit alongside ("Start at · hrs"). Stored via read-modify-write into the updated `NumericHabitConfig`.

**Files:** `components/ManageView.tsx`

**Implementation notes:**

**1. Extend `EditingHabit` type** (line 20–26) — add `startAt?: number`:
```ts
interface EditingHabit {
  id: string;
  label: string;
  type: "boolean" | "numeric";
  unit: string;
  step: number;
  startAt?: number;
}
```

**2. Extend `AddHabitStep` for `form-numeric`** (line 36) — add `startAt?: number`:
```ts
| { stage: "form-numeric"; label: string; unit: string; step: number; startAt?: number }
```

**3. `startEditHabit()`** (line 107–115) — populate `startAt` when opening edit:
```ts
setEditingHabit({
  id: h.id,
  label: h.label,
  type: h.type,
  unit: h.type === "numeric" ? h.unit : "",
  step: h.type === "numeric" ? h.step : 1,
  startAt: h.type === "numeric" ? h.startAt : undefined,
});
```

**4. Inline edit form** — add "Start at" field after the "Increment" field (inside the `{h.type === "numeric" && (<>...</>)}` block, ~line 344):
```tsx
<div>
  <label className={FIELD_LABEL}>
    Start at{editingHabit.unit ? ` · ${editingHabit.unit}` : ""}
  </label>
  <input
    type="number"
    min={0}
    step={editingHabit.step}
    value={editingHabit.startAt ?? ""}
    placeholder="Optional"
    onChange={(e) => {
      const v = parseFloat(e.target.value);
      setEditingHabit({
        ...editingHabit,
        startAt: isNaN(v) || v <= 0 ? undefined : v,
      });
    }}
    className={TEXT_INPUT}
  />
</div>
```

**5. Add-habit form** — add "Start at" field after the "Increment" field (inside `{addHabit.stage === "form-numeric" && (<>...</>)}` block, ~line 498):
```tsx
<div>
  <label className={FIELD_LABEL}>
    Start at{addHabit.unit ? ` · ${addHabit.unit}` : ""}
  </label>
  <input
    type="number"
    min={0}
    step={addHabit.step}
    value={addHabit.startAt ?? ""}
    placeholder="Optional"
    onChange={(e) => {
      const v = parseFloat(e.target.value);
      setAddHabit({
        ...addHabit,
        startAt: isNaN(v) || v <= 0 ? undefined : v,
      });
    }}
    className={TEXT_INPUT}
  />
</div>
```

**6. `saveEditHabit()`** — include `startAt` in the numeric path (line 128–134):
```ts
return {
  id: h.id,
  label: editingHabit.label,
  type: "numeric",
  unit: editingHabit.unit,
  step: editingHabit.step,
  ...(editingHabit.startAt ? { startAt: editingHabit.startAt } : {}),
  archived: h.archived,
};
```

**7. `saveNewHabit()`** — include `startAt` for numeric (line 175–177):
```ts
: {
  id,
  label: addHabit.label.trim(),
  type: "numeric",
  unit: addHabit.unit.trim(),
  step: addHabit.step,
  ...(addHabit.startAt ? { startAt: addHabit.startAt } : {}),
  archived: false,
}
```

**Parallel form note:** ManageView has two numeric form paths (inline edit + add-habit form) at different indentation levels. Both must receive the "Start at" field. After editing, grep for `Start at` to confirm both instances are present.

**Validation steps:**
- [ ] Manage → edit a numeric habit (e.g. Sleep) → "Start at · hrs" field appears after "Increment"; entering 7 saves correctly; reopening edit shows 7
- [ ] Manage → add a numeric habit with unit "km" → "Start at · km" field appears; leaving it blank saves the habit without `startAt`; entering a value saves correctly
- [ ] After saving a "Start at" on Sleep: go to Today → tapping Sleep pill at zero jumps to the configured value (verify Task 4 integration)
- [ ] Clearing "Start at" field (setting to blank) removes `startAt` from config — subsequent first tap is one step from 0
- [ ] `npm run lint && npm test` passes

**Definition of done:** "Start at" field in both Manage forms for numeric habits; saves and loads correctly; integrates with NumberStepper first-tap behavior; lint and tests pass.

---

### Task 6 — CLAUDE.md: update HabitToggle pattern note

**What:** Update the `HabitToggle touch target` implementation note in CLAUDE.md to reflect the new full-row button design. The old pattern (transparent hit area + inner visual pill) no longer applies.

**Files:** `CLAUDE.md`

**Implementation notes:**
- Find the `**HabitToggle touch target**` bullet in CLAUDE.md.
- Replace the description of the transparent-hit-area + inner-pill pattern with the new full-row button pattern: the `<button>` is the full row (`w-full`), the amber dot is an inline `<span>`, and the label is a nested `<span>` — no separate inner pill or thumb span.
- Also update the nearby archived habits note if it mentions the inner span structure.
- Keep the bullet concise — it is a code-level implementation rule, not a design principle.

**Validation steps:**
- [ ] CLAUDE.md `HabitToggle touch target` bullet accurately describes the new full-row button (no mention of inner pill or thumb)
- [ ] No contradictions between the updated bullet and the actual component implementation

**Definition of done:** CLAUDE.md updated to reflect the new HabitToggle pattern.

---

## Definition of done — Sprint

- [ ] All six tasks above are complete and validated
- [ ] `npm run lint && npm test && npm run build` passes clean
- [ ] Tested manually on mobile viewport (375 px) in both light and dark mode
- [ ] Dark mode amber washes (`dark:bg-amber-900/15` for HabitToggle, `dark:bg-amber-900/20` for NumberStepper) verified on device — adjust ±5% opacity if wash is invisible or too strong
- [ ] Archived habits in CheckInForm: tapping HabitToggle and NumberStepper rows does nothing (pointer-events-none confirmed)
- [ ] No regressions on Today, History, Settings, Manage, Edit, and DayDetail
- [ ] CLAUDE.md HabitToggle pattern note updated (Task 6)
- [ ] Ready for `/deploy`

---

## Retrospective

<!-- To be filled in after the sprint using /sprint-retro -->
