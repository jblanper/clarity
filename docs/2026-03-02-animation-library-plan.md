# Animation Evaluation & Plan — Clarity

_2026-03-02_

---

## 1. Current State

The project has two categories of motion:

**CSS transitions that work well and should stay** — these are the right tool for their purpose:
- `transition-colors` on every hover/active state (buttons, links, chips, nav)
- HabitToggle knob slide (`left-1` ↔ `left-6`, `transition-all duration-200`)
- Save button state crossfade (`transition-colors duration-500`)
- Frequency bar width growth (`transition: width 250ms ease-out` in CSS)
- Frequency chevron rotation (simple class toggle, no unmounting)
- DayDetail backdrop + sheet slide (works correctly; `isVisible` + 10ms defer is a known React pattern)

**Three complexity hotspots that are the real problem:**

| Area | What it does | Current cost |
|---|---|---|
| `CalendarHeatmap` | Directional month slide | `SlidePhase` type, `slidePhase` + `headingFading` states, `isAnimating` ref, `animateToMonth()` with nested `setTimeout` + double `requestAnimationFrame` — ~50 lines of orchestration |
| `HistoryView` + frequency | Section reveal/hide | `frequencyMounted` + `frequencyOpen` + `frequencyClosing` (3 boolean flags) + 600ms `setTimeout` — all to manage a single show/hide |
| `FrequencyList` | Bar reset on period change | Direct DOM class manipulation (`barsListRef.current.classList.add(…)`) + double RAF — correct result but wrong React pattern |

**Animations currently missing** (instant DOM changes that should be smooth):
- Joy section appearing/disappearing when habits are toggled
- ManageView inline edit forms opening/closing
- CheckInForm add-moment form expanding

The root cause of all this complexity is the same: **CSS transitions cannot animate elements as they unmount, and cannot animate `height: auto`.** Every workaround — the 3-flag pattern, mount/unmount timers, `grid-template-rows: 0fr/1fr`, double RAF — exists to paper over these two CSS limitations.

---

## 2. Library Evaluation

**Motion (formerly Framer Motion) — v12.34.3**
The only React-first library that directly solves both problems: `AnimatePresence` delays unmounting until exit animations finish; `height: "auto"` as an animation target is measured and resolved at runtime. 30.7k GitHub stars, 8.1M weekly downloads, TypeScript-first, actively maintained (last release February 2026). Fully compatible with Next.js App Router + static export (all affected components are already `"use client"`).

Bundle cost: ~34KB raw, but **~17KB gzipped with `LazyMotion` + `domAnimation`** features (the hybrid preset that includes `AnimatePresence`, variants, and height: "auto" — everything we'd use). The heavier `domMax` features (drag, layout groups) are never loaded.

**Auto-animate — v0.9.0**
3.28KB, zero-config, single `useAutoAnimate()` hook on a parent. Handles list add/remove/reorder automatically. Genuinely useful for ManageView habit/moment lists. But it's a blunt instrument: it applies the same animation to every child of the parent, with limited control over direction, timing, or easing — which conflicts with Calma's requirement for motion that feels deliberate. It cannot handle directional slides, section reveals with custom timing, or the calendar navigation where direction matters.

**React Spring**
Physics-based (spring constants, not duration/easing). Overkill and philosophically wrong for Calma: spring physics adds bounce and energy, the opposite of what a notebook-aesthetic app should feel. ~35KB. Skip.

**Motion One / vanilla WAAPI**
3.8KB, but React integration is a secondary concern. No `AnimatePresence` equivalent. Would require rebuilding mount/unmount orchestration manually — the exact problem we're trying to solve.

**Verdict: Motion with `LazyMotion + domAnimation`.** It's the only option that eliminates the timing orchestration code entirely rather than just moving it.

---

## 3. Alignment with Calma

Calma's interaction principle: _"Motion is subtle — color shifts only, no movement."_ — this refers to hover/active states, which we're keeping as pure CSS. For layout transitions (section reveals, navigation) Calma's broader philosophy applies: _"Every decision should pass one test: does this feel considered and human, or does it feel like software?"_

Derived animation contract for Clarity:

| Type | Duration | Easing | Rationale |
|---|---|---|---|
| Hover/active color | 150–200ms | ease | Already correct, keep in CSS |
| Element enter | 220–280ms | ease-out | Gentle arrival, not rushed |
| Element exit | 180–220ms | ease-in | Deliberate departure |
| Section reveal (height) | 280ms | ease-out | Feels like content settling |
| Section hide (height) | 220ms | ease-in | Faster — already gone |
| Directional slide | 220ms | ease-out | Communicates navigation direction |
| Fade only | 160ms | ease | Very quick — no spatial change |

No spring physics. No stagger on lists. No overshooting. Duration never exceeds 320ms. `useReducedMotion()` disables all JS-driven animations (CSS transitions already covered by the `@media` block).

---

## 4. Implementation Plan

### Install

```bash
npm install motion
```

Wrap the root layout with `LazyMotion` using the `domAnimation` async bundle (loads only when a `m.*` component is rendered):

```tsx
// app/layout.tsx
import { LazyMotion, domAnimation } from "motion/react";
// wrap children: <LazyMotion features={domAnimation}>{children}</LazyMotion>
```

---

### Step 1 — CalendarHeatmap: replace slide orchestration

Remove: `SlidePhase` type, `slidePhase` state, `headingFading` state, `isAnimating` ref, `animateToMonth()` function, all slide CSS classes in `globals.css`.

Replace with a `direction` ref and a keyed `AnimatePresence`:

```tsx
import { AnimatePresence, m } from "motion/react";

const dirRef = useRef<1 | -1>(1); // +1 = forward, -1 = back

// In nav handlers:
dirRef.current = 1; setMonth(next); // no orchestration needed

// In JSX:
<AnimatePresence mode="wait" initial={false}>
  <m.div
    key={`${year}-${month}`}
    initial={{ x: dirRef.current * 40, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: dirRef.current * -40, opacity: 0 }}
    transition={{ duration: 0.22, ease: "easeOut" }}
  >
    {/* grid */}
  </m.div>
</AnimatePresence>
```

The heading crossfade becomes a simple `key` on the `<h2>` or an `opacity` prop — no separate state needed.
This removes ~50 lines and 4 CSS classes.

---

### Step 2 — Frequency section: replace 3-flag pattern

Remove: `frequencyMounted`, `frequencyOpen`, `frequencyClosing` states, `toggleFrequency()` function, all `.frequency-body` CSS classes (the `grid-template-rows` hack goes away entirely).

Replace with a single boolean + `AnimatePresence`:

```tsx
const [frequencyOpen, setFrequencyOpen] = useState(false);

<AnimatePresence initial={false}>
  {frequencyOpen && (
    <m.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      style={{ overflow: "hidden" }}
    >
      <FrequencyList … />
    </m.div>
  )}
</AnimatePresence>
```

This removes 3 state variables, a 600ms timer, and ~15 CSS lines.

---

### Step 3 — Joy section: restore animation simply

Currently an instant conditional render. With Motion, this becomes trivial — no state management needed beyond what already drives the render:

```tsx
<AnimatePresence initial={false}>
  {doneHabits.length > 0 && (
    <m.section
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      style={{ overflow: "hidden" }}
      className="mb-10"
    >
      {/* existing section content */}
    </m.section>
  )}
</AnimatePresence>
```

Individual rows entering/exiting:

```tsx
<AnimatePresence initial={false}>
  {doneHabits.map((h) => (
    <m.div
      key={h.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
    >
      {/* row content */}
    </m.div>
  ))}
</AnimatePresence>
```

No `JoyRow` interface. No `joySectionMounted`. No `closeTimerRef`. No timer coordination. The `doneHabits` derivation already drives everything.

---

### Step 4 — ManageView inline editors

Currently no animation. With Motion, each inline edit/add form wraps in `AnimatePresence`:

```tsx
<AnimatePresence initial={false}>
  {isEditing && (
    <m.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ overflow: "hidden" }}
    >
      {/* edit form */}
    </m.div>
  )}
</AnimatePresence>
```

Same pattern for the CheckInForm add-moment form.

---

### Step 5 — FrequencyList bars

Remove `barsListRef`, `prevPeriodRef`, the DOM class manipulation effect, and the double RAF. Bars still use CSS `transition: width 250ms ease-out`. Reset by giving the bar list `key={period}` so React remounts it on period change — each bar starts at `width: 0` naturally via inline style on mount, then transitions to its target width.

---

### Step 6 — Cleanup globals.css

After the above, remove:
- `.calendar-grid-wrap`, `.calendar-grid`, `.slide-exit-*`, `.slide-enter-*` (~8 lines)
- `.month-heading`, `.month-heading.fading` (~2 lines)
- `.frequency-body`, `.frequency-body > div`, `.frequency-body.is-open`, `.frequency-body.is-closing` (~10 lines)
- Corresponding entries in the `prefers-reduced-motion` block

Keep:
- `html { scroll-behavior: smooth }`
- `.frequency-chevron` rotation
- `.heatmap-grid`, `.frequency-list` opacity pulse
- `.frequency-bar`, `.bars-resetting`

---

## 5. Total Impact

| Metric | Before | After |
|---|---|---|
| Animation-related state variables | 7 (`slidePhase`, `headingFading`, `frequencyMounted`, `frequencyOpen`, `frequencyClosing`, `isUpdating`, `isAnimating` ref) | 2 (`frequencyOpen`, `dirRef`) |
| `setTimeout` calls for animation timing | 3 (slide 220ms, frequency close 600ms, period update 120ms) | 0 |
| `requestAnimationFrame` calls | 4 (double RAF × 2) | 0 |
| Direct DOM ref manipulation | 1 (`barsListRef` + classList) | 0 |
| Net lines changed | — | ~−90 lines |
| New dependency | — | `motion` ~17KB gzipped |
| Missing animations fixed | — | Joy section, ManageView editors, add-moment form |
| CSS animation classes in globals.css | 14 | ~6 |

---

## 6. What's out of scope

- **DayDetail sheet** — the `isVisible` + 10ms defer + `setTimeout(onClose, 300)` pattern is correct and well-understood. Motion would simplify it marginally but it's not a pain point.
- **BottomNav, HabitToggle, MomentChip, save button** — pure CSS `transition-*`. Already correct. No change.
- **Page transitions** — not in scope for Calma's design language; navigating between pages is instant by design.
- **Scroll animations** — not appropriate for a calm notebook app.
