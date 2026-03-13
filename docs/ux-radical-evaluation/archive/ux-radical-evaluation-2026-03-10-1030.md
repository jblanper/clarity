# UX Sprint Preparation — Check-in UI Refresh

**Date and time:** 2026-03-10 10:30
**Area reviewed:** HabitToggle + NumberStepper — implementation-ready spec
**Designer:** UX Radical Evaluation
**Prior evaluations:** ux-radical-evaluation-2026-03-09-1430.md · ux-radical-evaluation-2026-03-09-2104.md · ux-radical-evaluation-2026-03-09-2200.md · ux-radical-evaluation-2026-03-10-1000.md

---

## Summary

Two components, two decisions, both confirmed. This report translates the design evaluation into a sprint-ready spec. No new ground is covered — it extracts what has been decided and gives the implementation team precise guidance.

**Decision summary:**
- **HabitToggle** → P1 + Alt 4: minimal amber dot + full-row amber wash, no OS toggle switch
- **NumberStepper** → P3-A: tap-to-increment pill, decrement glyph appears at value > 0

Both changes are self-contained within their respective component files. CheckInForm, data model, routing, and storage are untouched. The changes are reversible and can be reviewed independently.

**Mockup:** [mockup-sprint-ui-refresh.html](./mockup-sprint-ui-refresh.html)

---

## HabitToggle — P1 + Alt 4

### What and why

The current HabitToggle renders an OS-style toggle switch (a rounded pill with a sliding white circle). That metaphor comes from Settings panels — toggles for persistent preferences. A habit check-in is not a preference; it's a daily act. The Settings metaphor brings the wrong spatial and semantic weight. It implies "this stays on" rather than "I did this today."

P1 + Alt 4 replaces the toggle with a full-row tap target carrying two signals:

1. **A small dot on the left** (2×2, `rounded-full`). Off: `stone-200` / `stone-700` dark — present but peripheral, asks nothing. On: `amber-500` — a small, warm, decisive point. The dot is the analog equivalent of ticking a box in a notebook. It doesn't celebrate; it records.

2. **An amber-50 wash on the row background**. The wash is spatial confirmation — it tells you which habits have been touched at a glance, without any additional elements. It reads as warmth, not achievement. On dark: a muted amber at ~14–20% opacity over charcoal (not amber-50, which would be unacceptably bright on a dark background).

The full-row tap removes the precision requirement of hitting a 48×28 toggle at the far right of the row. Every finger position on the row is valid. This is strictly better usability for a daily-use form.

### Light mode

| Element | Off state | On state |
|---|---|---|
| Row background | transparent | `bg-amber-50` (`#fffbeb`) |
| Dot | `bg-stone-200` | `bg-amber-500` |
| Label text | `text-stone-700` | `text-stone-800` |
| Active press | `active:opacity-70` | `active:opacity-70` |

### Dark mode

| Element | Off state | On state |
|---|---|---|
| Row background | transparent | `dark:bg-amber-900/15` (approx. `rgba(120,63,4,0.15)`) |
| Dot | `dark:bg-stone-700` | `bg-amber-500` (same — amber-500 reads well on both) |
| Label text | `dark:text-stone-300` | `dark:text-stone-100` |
| Active press | `active:opacity-70` | `active:opacity-70` |

### Technical implementation

**File:** `components/HabitToggle.tsx`

**Current structure:**
```tsx
<div className="flex items-center justify-between py-3.5">
  <span className="text-sm text-stone-700 dark:text-stone-300">{label}</span>
  <button type="button" role="switch" aria-checked={value.done} aria-label={label}
    onClick={handleToggle}
    className="min-h-[44px] flex-shrink-0 flex items-center focus:outline-none">
    <span className={`relative h-7 w-12 rounded-full transition-colors duration-200 ...`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm ...`} />
    </span>
  </button>
</div>
```

**New structure:**
```tsx
<button
  type="button"
  role="switch"
  aria-checked={value.done}
  aria-label={label}
  onClick={handleToggle}
  className={`w-full flex items-center gap-4 min-h-[44px] py-3.5 text-left
    focus:outline-none active:opacity-70 transition-colors ${
    value.done
      ? "bg-amber-50 dark:bg-amber-900/15"
      : ""
  }`}
>
  <span
    className={`flex-shrink-0 h-2 w-2 rounded-full transition-colors ${
      value.done ? "bg-amber-500" : "bg-stone-200 dark:bg-stone-700"
    }`}
  />
  <span
    className={`text-sm transition-colors ${
      value.done
        ? "text-stone-800 dark:text-stone-100"
        : "text-stone-700 dark:text-stone-300"
    }`}
  >
    {label}
  </span>
</button>
```

**What's removed:** The inner `<button>` and the OS toggle `<span>` with its sliding indicator.

**What's preserved:** `role="switch"`, `aria-checked`, `aria-label` — all screen reader semantics stay identical. The toggle is still semantically a switch, now with the full row as its touch target.

**CLAUDE.md compliance note:** The CLAUDE.md HabitToggle note says "the button is a transparent hit area with an inner `<span>` that carries all visual pill styles." With P1 + Alt 4 there is no visual pill — the outer button IS the interactive element and the visual feedback is the wash. The separation-of-concerns principle is preserved differently: the visual indicator (dot + wash) remains lightweight and non-structural; the button is still the sole tap target.

**Impact on archived habit display in CheckInForm:** Archived habits are wrapped in `<div className="pointer-events-none opacity-40">`. This wrapper suppresses clicks and dims the element. No change needed — it still works correctly with the button-based structure.

**Regression to check:** Dark mode amber wash. The `dark:bg-amber-900/15` value should be visually verified against the dark background (`#1c1917`). Adjust the opacity if the wash reads as too bright or too invisible on device.

### Effort estimate

**Low.** All changes are within `HabitToggle.tsx`. The outer structure simplifies (removes one level of nesting). The `handleToggle` function is unchanged. No CSS variables, no new imports, no new state. Estimated implementation time: 20–30 minutes including dark mode verification.

---

## NumberStepper — P3-A

### What and why

The current NumberStepper renders a `−` button, a number input, and a `+` button — three distinct interactive zones. This is a form input spinner pattern, appropriate for a settings panel or a precise data entry form. It is not appropriate for a daily check-in where the user is logging "I drank 3 glasses of water," not configuring a system preference. The bordered circular buttons borrow from e-commerce quantity selectors. They impose precision and fiddliness on a casual daily gesture.

P3-A replaces the three-zone control with:

1. **A pill — the entire tap target**. Rounded surface (`rounded-xl`), stone-100 background in resting state. The pill shape is the affordance: a contained, rounded surface is universally read as pressable on mobile. No label, no arrow, no icon — the shape teaches the gesture. Tapping the pill increments by one step.

2. **Amber logged state**. When value > 0: pill background shifts to `amber-50`, number to `amber-700`. This communicates "I've noted something here" without implying progress toward a target. The color is semantic, not decorative.

3. **A decrement glyph that appears when value > 0**. At zero there is nothing to decrement; the glyph is invisible. When value > 0, a lightweight `−` glyph appears to the left of the pill. It is a text character, not a bordered button — quieter and more consistent with the typographic approach. Its full 44px height touch target is preserved.

The direct type-in capability (current `<input type="number">`) is removed. For most numeric habits (water 1–8, coffee 1–5, sleep 0–12 in 0.5 increments) tap-to-increment is sufficient. See the open question below regarding decimal-step habits.

### Light mode

| Element | Zero state | Logged state (value > 0) |
|---|---|---|
| Pill background | `bg-stone-100` | `bg-amber-50` |
| Pill active press | `active:bg-stone-200` | `active:bg-amber-100` |
| Number | `text-stone-500 text-xl font-light` | `text-amber-700 text-xl font-light` |
| Decrement glyph | hidden (`invisible`) | `text-stone-400 text-sm` |
| Label text | `text-stone-700 text-sm` | `text-stone-800 text-sm` |
| Unit text | `text-stone-500 text-xs` | `text-stone-500 text-xs` |

### Dark mode

| Element | Zero state | Logged state (value > 0) |
|---|---|---|
| Pill background | `dark:bg-stone-800` | `dark:bg-amber-900/20` |
| Pill active press | `dark:active:bg-stone-700` | `dark:active:bg-amber-900/30` |
| Number | `dark:text-stone-400` | `dark:text-amber-500` |
| Decrement glyph | hidden | `dark:text-stone-500` |
| Label text | `dark:text-stone-300` | `dark:text-stone-100` |

**Accessibility note on the zero-state number:** `text-stone-500` on `bg-stone-100` is approximately 3.0:1. This is below WCAG AA for body text (4.5:1) but within the Large Text threshold (3.0:1) for text at 24px+ or 18.66px+ bold. At `text-xl font-light` (approximately 20px), this is borderline. If contrast enforcement is required, use `text-stone-600` (~4.8:1 on stone-100) for the zero state. This is a minor change from the proposed spec and does not affect the design intent.

### Technical implementation

**File:** `components/NumberStepper.tsx`

**What's removed:**
- `inputValue` state (`useState(String(value))`)
- `useEffect` keeping inputValue in sync
- `handleInputChange` function
- `handleBlur` function
- The `<input type="number">` element and all its props

**What's added:**
- Pill `<button>` replacing the `+` button
- Conditional `invisible` class on the decrement element (replacing `disabled`)

**New structure (control area only):**
```tsx
<div className="flex items-center gap-1">
  {/* Decrement glyph — invisible at min, visible when value > min */}
  <button
    type="button"
    onClick={decrement}
    aria-label={`Decrease ${label}`}
    className={`flex items-center justify-center min-h-[44px] min-w-[32px]
      text-sm rounded-xl transition-colors
      text-stone-400 dark:text-stone-500
      hover:bg-stone-100 dark:hover:bg-stone-800
      active:opacity-70
      ${value <= min ? "invisible" : ""}`}
  >
    −
  </button>

  {/* Pill — tap to increment */}
  <button
    type="button"
    onClick={increment}
    disabled={value >= max}
    aria-label={`Increase ${label}`}
    className={`flex items-center justify-center min-w-[52px] h-[44px]
      rounded-xl transition-colors disabled:opacity-30 ${
      value > min
        ? "bg-amber-50 dark:bg-amber-900/20 active:bg-amber-100 dark:active:bg-amber-900/30"
        : "bg-stone-100 dark:bg-stone-800 active:bg-stone-200 dark:active:bg-stone-700"
    }`}
  >
    <span className={`text-xl font-light transition-colors ${
      value > min
        ? "text-amber-700 dark:text-amber-500"
        : "text-stone-500 dark:text-stone-400"
    }`}>
      {value}
    </span>
  </button>
</div>
```

**Label area** — add a one-step color shift when logged (mirrors HabitToggle):
```tsx
<span className={`text-sm transition-colors ${
  value > min
    ? "text-stone-800 dark:text-stone-100"
    : "text-stone-700 dark:text-stone-300"
}`}>{label}</span>
```

**What's preserved:** `clamp`, `addStep`, `decrement`, `increment` functions are unchanged. The `Props` interface is unchanged. The outer layout (`flex items-center justify-between py-3.5`) is unchanged.

**`useEffect` and `useState` imports:** After removing `inputValue` state and the sync effect, check whether `useState` and `useEffect` are still needed. If the only removed state is `inputValue`, both imports can be dropped entirely — the component becomes a pure function of its props.

**Regression to check:** The current NumberStepper allows direct type-in (e.g. typing `7.5` for sleep). P3-A removes this. For decimal-step habits, the user must tap multiple times to reach a value. This is acceptable for `step: 0.5` habits like sleep (14 taps for 7.0 hrs) but worth noting as a usability trade-off. If direct entry is needed, it can be added later as a long-press interaction on the focused pill without changing the primary tap-to-increment gesture.

### Effort estimate

**Low–Medium.** All changes are within `NumberStepper.tsx`. The control area is replaced; the outer structure and all logic functions are preserved. The main complexity is removing the input-related state cleanly and verifying the dark mode amber values. Estimated implementation time: 30–45 minutes including dark mode verification and lint/test pass.

---

## Combined sprint scope

Both changes are independent and can be implemented in any order. They share no state, no imports, and no parent-component changes.

| Ticket | File | Effort | Dependency |
|---|---|---|---|
| HabitToggle: replace OS toggle with dot + row wash | `HabitToggle.tsx` | Low (20–30 min) | None |
| NumberStepper: replace spinner with tap pill | `NumberStepper.tsx` | Low–Med (30–45 min) | None |
| Visual QA: light + dark mode on device | — | 20 min | Both above |

**Total sprint estimate: ~1.5 hours of implementation + QA.**

The changes require `npm run lint && npm test && npm run build` before commit, as per the project workflow. No new test cases are needed — the underlying logic (`toggle`, `increment`, `decrement`, `clamp`, `addStep`) is unchanged.

---

## Open questions

- **Decimal-step habits and direct entry:** Removing the `<input>` is a regression for habits with `step: 0.5` or similar. The current default habits include Sleep (step: 0.5). Decide before implementation whether to accept 14 taps to log "7 hrs of sleep" or to keep the input as an optional secondary mode (e.g. long-press on the pill opens it).

- **Intentional zero vs. untouched (deferred from prior evaluation):** P3-A cannot visually distinguish a zero that was never touched from a zero that was explicitly set then decremented back. This is a data model question. It has no implementation consequence for this sprint — note it for future consideration.

- **Dark mode amber wash value:** `dark:bg-amber-900/15` is a reasonable starting point but should be verified on device. The exact opacity may need to shift ±5% depending on display calibration.
