# UX Evaluation Report — Follow-up: NumberStepper Iterations

**Date and time:** 2026-03-09 22:00
**Area reviewed:** NumberStepper — P3, P4, P5 iteration round (discoverability + range handling)
**Designer:** UX Radical Evaluation
**Follows from:** [ux-radical-evaluation-2026-03-09-2104.md](./ux-radical-evaluation-2026-03-09-2104.md)

---

## Context

The previous report proposed six distinct directions for the NumberStepper component. The user responded positively to P3, P4, and P5 and requested a focused iteration round on each — at least three variants per direction, with a new combined mockup. P5's discoverability problem was called out specifically: the concept (gesture-based input, near-zero chrome) is right, but the implementation (whole-row horizontal swipe with a one-time dismissable hint) doesn't work. This report addresses that directly.

---

## P3 — Tap the number to increment

### Core discoverability gap (restated)

In P3's original form, the number at zero looked like static display text. Nothing in the resting state communicated "this is tappable." The amber logged state solved the *post-interaction* problem but not the *first-contact* problem.

All three P3 variants keep the core mechanic (tap number → increment; amber when > 0; minimal or absent decrement button when at zero). They differ only in how they signal interactivity before the first tap.

---

### P3-A — Pill badge wrapping

The number is wrapped in a visible `rounded-xl bg-stone-100` pill. The shape itself is the affordance — it reads as a pressable chip without any text or icon. On press: `active:bg-stone-200`. When logged (value > 0): pill background shifts to `amber-50`, number renders in `amber-700`. The `−` button appears to the left as a small, lighter weight circle or plain text glyph.

**Why this works:** Calma already uses pill shapes for Moments chips, and the shape language is established. A contained, rounded surface is universally read as pressable. No learning required — the shape teaches.

**Calma note:** Uses `rounded-xl` (inline control scale) and the `stone-50` / `amber-50` surface role. Fully within spec.

**Effort:** Low — CSS change on the number display wrapper; state-driven class swap on logged.

**Mockup:** [mockup-number-stepper-iterations.html](./mockup-number-stepper-iterations.html)

---

### P3-B — Phantom plus at zero

At value = 0, the display reads `0 +` — with the `+` rendered very lightly (`text-stone-300`, `text-xs`, `font-light`). It sits to the right of the `0` as a ghost suggestion, not a separate button. The entire zone (number + ghost `+`) is one tap target. On first tap, the `+` disappears (value becomes `1`, rendered in amber). The `0 +` pattern is analogous to a pre-printed field in a notebook — you see where the pen is meant to go.

**Why this works:** It uses the existing `+` symbol but integrates it typographically rather than as a button. The hint is permanent (not a one-time dismiss) but extremely quiet. There's no chrome to maintain — just a character.

**Calma note:** The ghost `+` is `text-stone-300`, which fails WCAG AA as a text element. However: it is not information — it is a visual gesture, more like punctuation than a label. If accessibility requires it to meet contrast, it can be `text-stone-400` (still marginal) or replaced with a `title` attribute and visually faint. This is the one place in the design where I would accept a deliberate contrast exception — the ghost character has no meaning to screen readers and should be `aria-hidden`.

**Effort:** Low — single extra `<span aria-hidden="true">` in the number wrapper.

**Mockup:** [mockup-number-stepper-iterations.html](./mockup-number-stepper-iterations.html)

---

### P3-C — Paired micro-arrows

Two small `‹` and `›` glyphs sit to the left and right of the number, rendered faintly (`text-stone-300`, `text-xs`). They are not separate buttons — they are decorative affordance elements, `aria-hidden`. The entire zone is one tap target. Tapping anywhere in the zone increments. The arrows read as "this adjusts" without adding button chrome.

When logged: both arrows take the amber tint along with the number. When at max (if defined), the right `›` dims further. When at min (0), the left `‹` dims further.

**Why this works:** The paired arrow convention is established across many contexts (sliders, carousels, spinners) as a signal for "adjustable value." Using it as decoration rather than as interactive elements keeps the touch surface unified and large.

**Calma note:** Calma says typography is the primary tool — this uses typographic characters as affordance. Clean. The `aria-hidden` on the glyphs ensures screen readers hear only the number value via the input.

**Effort:** Low — two `aria-hidden` spans in the wrapper.

**Mockup:** [mockup-number-stepper-iterations.html](./mockup-number-stepper-iterations.html)

---

## P4 — Dot track (range visualization)

### Core problems restated

P4's original dots were 0.65rem — too small for 44px touch targets without invisible overlay engineering. The design also had no graceful fallback for decimal steps (sleep at 0.5 increments has too many dots) or wide ranges (screen time 0–24 is unrenderable as dots). The three variants below address these separately.

---

### P4-A — Spaced dots with range labels and numeric readout

Dots grow to `0.85rem` with `gap-2.5` spacing. Tiny range labels appear below the track at the left and right ends (`0` and max value in `text-stone-400 text-xs`). The current numeric value is displayed in amber to the right of the track, at `text-base font-medium`. Touch targets are invisible overlapping hit areas (44px height, proportional width) layered over each dot.

This is the fullest expression of P4: the range is visible (dots), the scale is legible (labels), and the exact value is unambiguous (numeric readout). Nothing is hidden.

**Calma note:** The numeric readout in amber solves the logged-state feedback problem from the original evaluation independently of the control interaction. It's a clean separation of concerns.

**Effort:** Medium — hit area overlay grid, range label positioning.

**Mockup:** [mockup-number-stepper-iterations.html](./mockup-number-stepper-iterations.html)

---

### P4-B — Filled segment bar (tap to position)

A thin filled bar (`h-1.5 rounded-full`) replaces discrete dots. The filled portion represents the current value proportionally against the max. A small amber circle (`w-3 h-3`) marks the current position on the bar — like a slider thumb but smaller and lighter. Tapping anywhere on the bar sets the value at that proportional position. The bar width maps directly to the `(max - min)` range.

This handles wide ranges and decimal steps gracefully because position is computed from touch offset, not from a fixed number of steps. The numeric value is still displayed to the right of the bar in amber.

**Why this works:** The filled-bar metaphor is extremely well-established — it reads as "progress toward a target," which for habits like sleep and water is exactly the mental model. It doesn't impose a step grid visually, even though the actual stored value still snaps to step boundaries.

**Calma note:** This is closer to a traditional slider than to the analog notebook metaphor. I'd call that an acceptable trade — the bar is minimal and typographic in feel (thin line, no chrome), and it handles the full range of habit configurations elegantly. This breaks from "no progress bars" only in the sense that a horizontal bar exists — it doesn't carry any achievement framing.

**Effort:** Medium — proportional position computation, touch/pointer offset handling for tap-to-set.

**Mockup:** [mockup-number-stepper-iterations.html](./mockup-number-stepper-iterations.html)

---

### P4-C — Ruler ticks with sliding amber marker

Thin vertical tick marks (`w-px h-3 bg-stone-200`) are evenly spaced along a horizontal baseline. The current value is represented by a small amber pill (e.g. `w-2 h-2 rounded-full bg-amber-600`) that sits above the corresponding tick. Range labels appear at the start, midpoint, and end. The pill is draggable (horizontal drag snaps to nearest tick); any tick is also individually tappable.

This is the most "analog ruler" of the three P4 variants. It references the physical sense of a measuring scale — each tick is a discrete unit, the marker shows your position.

**Calma note:** The tick baseline is `bg-stone-100` — a hairline divider, in keeping with Calma's section divider token. The amber marker is Calma's accent/selection color applied correctly.

**Effort:** Medium-high — draggable marker position, tick snap logic, wide-range compression.

**Mockup:** [mockup-number-stepper-iterations.html](./mockup-number-stepper-iterations.html)

---

## P5 — Scrub gesture (discoverability focus)

### The technical foundation (corrected from previous report)

The scroll conflict is solved by `touch-action: pan-y` on the scrub zone. This single CSS property tells the browser: vertical touches are for page scrolling; horizontal touches are handled by JavaScript. No `preventDefault` fighting, no scroll breakage. Applied to the scrub element only (not the whole row), page scroll works normally when the user's touch starts anywhere outside the zone.

All three P5 variants share this foundation. They differ only in how they make the horizontal drag gesture permanently discoverable without a dismissable hint.

---

### P5-A — Permanent bidirectional icon inside a scrub pill

The number sits inside a `rounded-xl bg-stone-100` pill (same as P3-A). On the right interior edge of the pill, a small `⟷` character (or `← →` in `text-xs text-stone-400`) lives as a permanent static glyph — `aria-hidden`, not a button. The entire pill is the drag zone (`touch-action: pan-y`). The glyph explains the gesture at a glance: you drag this thing horizontally.

When logged (value > 0): pill shifts to `amber-50`, number to `amber-700`, icon to `amber-400`. The icon is always present — it never dismisses, never requires a first-time state. It's a label, not a hint.

**Why this works:** The `⟷` symbol is universally associated with horizontal adjustment (resize handles, column width dragging, scroll thumb). Using it as static microcopy rather than an interactive element keeps the chrome minimal while ensuring the gesture is legible on every encounter.

**Calma note:** Calma avoids icon-driven navigation ("text navigates, words are trusted") — but this icon is not navigational. It's a gesture label, equivalent to the `←` in `← Today`. A single, semantically clear symbol at this scale is within the spirit of the spec.

**Effort:** Low-medium — pill wrapper with icon, pointer event handling, `touch-action: pan-y`.

**Mockup:** [mockup-number-stepper-iterations.html](./mockup-number-stepper-iterations.html)

---

### P5-B — Tap to focus, then drag

**This is the most interesting of the nine.**

In the resting state, the number looks like P3-A (minimal pill or bare number). On first tap, two things happen simultaneously: the value increments by one step (tap-to-increment, same as P3), and the element enters a focused state — amber underline or gentle ring appears, and two faint `‹ ›` arrows become visible flanking the number. While focused, horizontal drag scrubs continuously. Tapping outside the element unfocuses (and saves whatever value it reached).

The design teaches itself through use. The first tap (increment by one) is discoverable because tapping things is a universal mobile gesture. The focused state then reveals the drag affordance — the user sees `‹ 1 ›` and understands they can drag. They didn't need to know about scrubbing to discover it; the focused state surfaced it naturally after the first interaction.

**Calma note:** This merges P3's tap-to-increment with P5's scrub gesture. It introduces a two-step interaction model, which adds a small amount of complexity. I'd break Calma's "prefer the simplest interaction" principle here because the payoff is real: the first gesture is always discoverable (tap), and the second (scrub) is never hidden or dependent on a hint. The complexity is in the implementation, not the user experience.

**Effort:** Medium — focus state management, pointer events for drag while focused, tap vs. drag disambiguation (dead zone ~4px of movement before drag activates).

**Mockup:** [mockup-number-stepper-iterations.html](./mockup-number-stepper-iterations.html)

---

### P5-C — Dedicated drag handle grip

A small grip indicator — three pairs of horizontal dots (`⠿`) or two short parallel lines — lives on the right side of the row as a clearly bounded drag zone. This is the same visual convention as iOS list reorder handles, the Notion block drag handle, and every drag-to-reorder interface the user has ever seen. The number is displayed to the left of the grip in amber when logged.

The grip zone is small (approximately 24×44px touch area), which focuses the drag gesture and prevents accidental triggers while scrolling. Dragging the grip horizontally scrubs the value. The number updates in real time.

**Why this works:** The reorder handle convention is one of the most universally understood drag affordances in mobile UI. It requires no hint, no first-time state, no icon explanation. Users see the grip and know they can drag it — the gestural meaning is pre-loaded from every other app they use.

**Calma note:** A grip icon is a departure from Calma's "text navigates, words are trusted" principle. But a grip is not navigation — it's a gesture affordance. The grip is not labeling a destination; it's saying "this is draggable." I'd keep it if the icon is extremely minimal (two or three thin parallel lines, not a full iOS handle). Avoid the six-dot `⠿` — it has a Braille connotation that could confuse.

**Effort:** Medium — isolated drag zone, pointer events, `touch-action: pan-y` on the grip zone only.

**Mockup:** [mockup-number-stepper-iterations.html](./mockup-number-stepper-iterations.html)

---

## Sprint recommendations

### P3 — pick one for immediate implementation

**P3-A (pill badge)** is the cleanest production choice. The shape teaches the gesture, it's within Calma spec, and it naturally accommodates the amber logged state. **P3-B (phantom plus)** is my personal favourite for typographic purity — it's the most "notebook entry" of the three — but the contrast exception requires care. **P3-C (micro-arrows)** is the most conservative and closest to the current visual language, but the ghost arrows add more visual noise than B for comparable discoverability gain.

**Recommendation: P3-A or P3-B. Decide based on whether the phantom-plus contrast exception is acceptable.**

### P4 — depends on the habit configuration

**P4-A (spaced dots + readout)** is best for small integer ranges (water 1–8, coffee 1–5). **P4-B (segment bar)** is the most versatile — handles decimals and wide ranges without any config-aware branching. **P4-C (ruler ticks)** is the most analog and the most interesting visually, but the highest implementation effort for the least range coverage.

**Recommendation: P4-B as the general-purpose implementation, P4-A as a config-driven variant for bounded integer habits.**

### P5 — P5-B is the right answer

**P5-B (tap to focus, then drag)** resolves the discoverability problem through use rather than through explanation. The first gesture (tap) is universal and always works; the focused state surfaces the drag affordance without any hint infrastructure. This is the most honest of the three solutions — it doesn't reach for an icon or a convention borrowed from a different context; it teaches the gesture through the interaction itself.

**P5-A (permanent icon)** is a good fallback if P5-B feels too complex to implement cleanly. **P5-C (grip handle)** is pragmatic but visually the most foreign to Calma.

**Recommendation: P5-B. If implementation is too complex in the current sprint, ship P5-A and iterate.**

---

## Open questions (carried forward)

- The "intentional zero vs. untouched" data model question remains unresolved. P3-B's phantom plus is the only variant that visually distinguishes these states at zero — all others show the same zero display. Worth flagging before committing to a specific variant.
- P4-B's segment bar invites a "goal" reading (fill the bar → hit your goal). Clarity deliberately avoids goal framing. Does this association matter enough to reject the bar in favor of dots or ticks?
- P5-B introduces a tap-then-drag model. Should tapping a focused number a second time decrement (toggle between increment/decrement)? Or reset to zero? Or do nothing beyond the first tap? The interaction model needs a decision before implementation.

---

## P5-B second-tap decision (added 2026-03-09)

**Recommendation: second tap increments. Always. Stay focused.**

The number should have a single, consistent meaning regardless of focus state: tap → increment by one step. Introducing a different behavior on the second tap (decrement, nothing, open text input) creates an invisible mode — the same gesture doing different things depending on state the user can't see. That's a cognitive trap, and it contradicts the whole rationale for P5-B, which is that the interaction teaches itself through consistency.

The state machine:

- **Unfocused:** tap number → increment by one step + enter focused state
- **Focused:** tap number → increment by one step (stays focused)
- **Focused:** drag left/right → scrub continuously
- **Focused, value > 0:** `−` button becomes visible for decrement
- **Focused:** tap outside the element → save and unfocus

This keeps the number always tap-to-increment. Focus is purely additive — it unlocks scrubbing and reveals the `−` button. It doesn't change what a tap means. The mental model is simple enough to be learned in one interaction and never violated thereafter.

The one scenario that still requires care: decimal-step habits (sleep at 0.5 steps). Getting from 0 to 7.5 means 15 taps or a rightward scrub. Scrubbing is the natural answer here, and P5-B's focused state makes that available. If direct number entry is ever added (typing `7.5` into the field), it slots cleanly into the focused state — a long-press or held tap on the focused number could open the input without conflicting with the tap-to-increment gesture.
