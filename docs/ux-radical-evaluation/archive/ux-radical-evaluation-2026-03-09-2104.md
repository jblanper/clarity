# UX Evaluation Report

**Date and time:** 2026-03-09 21:04
**Area reviewed:** NumberStepper component — "By the Numbers" section of the check-in form
**Designer:** UX Radical Evaluation

---

## What's working

The row layout (label + unit left, controls right) is well-structured and consistent with the habits section above it. The `min-h-[44px]` touch targets on both buttons are correctly applied, and the disabled state (`opacity-30`) on the decrement button at zero is a clear, low-noise affordance. The baseline-aligned label + unit pair (`Sleep  hrs`) is a genuinely good typographic decision — the unit sits quietly beside the label without competing.

---

## What needs attention

### 1. The e-commerce quantity picker problem

**What:** The current `−  0  +` layout with two flanking circle buttons is the canonical pattern for selecting a cart quantity in a shopping app. It carries strong, pre-loaded associations with "add one more of this item" — not with recording a personal measurement.

**Where:** The entire "By the Numbers" row structure.

**Why it matters:** Clarity is a reflection tool, not a transaction interface. The metaphor shapes how the user feels about the act. Tapping `+` on a cart quantity feels like acquisition; tapping `+` on a sleep tracker should feel like writing a number in a notebook. The current chrome invites the wrong mental model.

**Calma alignment:** Calma's "analog warmth" principle explicitly references the Hobonichi Techo and bullet journaling. Neither uses `−  n  +` affordances. A tally mark, a written number, a circled count — these are the reference gestures. The current component is technically functional but culturally wrong for the design language it lives in.

---

### 2. Zero is indistinguishable from "untouched"

**What:** A row showing `0` looks identical whether the user has recorded zero glasses of water (a meaningful entry) or simply never opened the form. There's no visual distinction between intent and absence.

**Where:** All number rows at their default state.

**Why it matters:** For habit trackers specifically, the "did I log this?" question matters. If a user looks at the form and sees `0` for Sleep, they don't know if they forgot or if it's genuinely recorded. Honest, accurate personal data depends on making this distinction legible.

**Calma alignment:** Calma's "two-state symbol" interaction principle (referenced from analog patterns) implies that the visual state of an element should tell you whether it's been interacted with. The current design fails this for numeric entries.

---

### 3. The control chrome outweighs the data

**What:** Two 44×44px bordered circles visually dominate the row. The number — the actual data being recorded — is a small, lightweight `text-stone-700` value sitting quietly between two loud buttons. The tool has become louder than what it produces.

**Where:** The right side of every number row.

**Why it matters:** Calma is typography-first. The number being logged is the content. The `+`/`−` buttons are the interface. Right now the interface is more prominent than the content. This is backwards.

**Calma alignment:** This directly violates Calma's principle that hierarchy is expressed through size and weight, not decoration. The number should be larger and more visually assertive than the buttons, not the reverse.

---

### 4. The text input is an undiscoverable affordance

**What:** The `<input type="number">` between the buttons is the only way to type a value directly (for example, entering `7.5` hours of sleep without tapping `+` 15 times). But it's styled invisibly — transparent, no border, no focus ring, no affordance that it's editable.

**Where:** The number display in the center of each row.

**Why it matters:** For habits with decimal steps (sleep, screen time), tapping `+` repeatedly is genuinely laborious. The input field exists to solve this problem, but users won't know they can tap the number to type into it because there's no visual signal that it's interactive.

**Calma alignment:** No direct conflict, but Calma's "calm technology" principle (periphery → center of attention on demand) suggests the input should reveal its editability on interaction, not hide it indefinitely.

---

### 5. No visual confirmation of a recorded value

**What:** When the value changes from `0` to `8`, the row looks almost identical. The number increments but nothing in the visual hierarchy acknowledges that a measurement has been logged.

**Where:** All number rows after interaction.

**Why it matters:** Feedback isn't gamification. A subtle visual state change on a logged value (amber number, underline, weight shift) is the equivalent of seeing your handwriting appear on a page — it confirms that the entry exists, that it registered. Without it, users tap `+` and feel uncertain.

**Calma alignment:** Calma explicitly avoids "confirmation theater," but this is not about celebration — it's about legibility of logged state. The amber accent exists exactly for this purpose. It's used on joy icons. It belongs here too.

---

## Proposals

### P1 — Typography-first reveal (collapsed by default)

**What to change:** In the resting state, show the number row as a single text line: `Sleep  8 hrs` (label + value + unit). When value is zero/untouched, show `Sleep  –` to explicitly signal "not yet logged." Tapping the row expands to reveal `−  n  +` controls inline, with the row returning to summary view on blur.

**Direction:** The collapsed state is a `div` with `flex justify-between`. Tap triggers a state toggle that swaps in the stepper controls. The summary display uses a larger weight for the number (`font-medium text-base`) and amber tint when non-zero. The expand/collapse can use a simple height animation consistent with CLAUDE.md's animation patterns.

**Calma note:** Follows Calma's "calm periphery" principle — the control chrome stays out of the way until needed. Borrows the iA Writer approach: the tool disappears until you reach for it.

**Mockup:** [mockup-number-stepper-alternatives.html](./mockup-number-stepper-alternatives.html)

**Effort:** Medium — requires a stateful toggle layer above the current component.

---

### P2 — Preset value chips

**What to change:** Replace the `−  n  +` stepper with a horizontal row of pre-set value chips, derived from the habit's likely range. Sleep: `6 · 6.5 · 7 · 7.5 · 8 · 8.5 · 9`. Water: `1 · 2 · 3 · 4 · 5 · 6 · 7 · 8`. The selected chip gets an amber fill. Tapping a selected chip deselects (records zero / untouched).

**Direction:** Chips are small pill buttons (`rounded-full px-2.5 py-1 text-xs`). Selected state: `bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200`. Unselected: `bg-stone-100 text-stone-500`. The range and step values come from the existing config (min/max/step props). If the range is too wide for chips, fall back to P1 or P4.

**Calma note:** This breaks from Calma's generalized stepper pattern in favor of a habit-specific affordance. The justification: analog trackers (Hobonichi, Leuchtturm logs) use columns of pre-printed values you circle or tick — not steppers. The gesture of selecting a value from a range is more "recording" than "incrementing."

**Mockup:** [mockup-number-stepper-alternatives.html](./mockup-number-stepper-alternatives.html)

**Effort:** Medium — requires range computation and config-aware chip generation. Wide ranges (screen time 0–24) need a fallback.

---

### P3 — Tap-the-number to increment, with amber logged state

**What to change:** Remove the separate `+` button. Make the number display itself the primary tap target (`min-h-[44px] min-w-[44px]`). Tapping the number increments by one step. A small `−` button remains on the left (or appears only when value > 0). When value > 0, the number renders in amber.

**Direction:** The number is a `<button>` with large, centered type (`text-2xl font-light text-stone-800 dark:text-stone-200`, or `text-amber-700 dark:text-amber-400` when > 0). The `−` button is visually smaller or hidden until needed. A long-press on the number opens the text input for direct entry.

**Calma note:** This follows Calma's "two-state symbol" principle — the number itself changes character (neutral → amber) based on whether it's been logged. Reduces visual weight from two circles to one minimal affordance. The tap-to-increment pattern is established in productivity tools (Things 3's badge tapping).

**Mockup:** [mockup-number-stepper-alternatives.html](./mockup-number-stepper-alternatives.html)

**Effort:** Low-medium — the component logic is mostly unchanged; the visual treatment and button structure shift.

---

### P4 — Dot track (analog scale)

**What to change:** Replace the `−  n  +` stepper with a horizontal dot track representing the full range. Each dot is a small, tappable point. The filled/colored dots show the current value relative to the max. Think of a manual survey scale or a Leuchtturm habit tracker column, digitized.

**Direction:** Dots are `w-3 h-3 rounded-full`. Filled (up to value): `bg-stone-700 dark:bg-stone-300`. Empty: `bg-stone-200 dark:bg-stone-700`. Best suited for small integer ranges (water 0–10, coffee 0–6). For wider ranges, show a compressed version (every 2 steps = 1 dot) or fall back.

**Calma note:** This is the most "analog" of the proposals — closest to the Hobonichi habit columns and bullet journal trackers. It makes the range visible, contextualizing the current value (3 glasses out of 8 is different from 3 out of 4). This is more informative than a bare number.

**Mockup:** [mockup-number-stepper-alternatives.html](./mockup-number-stepper-alternatives.html)

**Effort:** Medium — requires capped rendering for wide ranges and touch target consideration for small dots.

---

### P5 — Inline scrub gesture

**What to change:** The number is displayed prominently on the right. There are no buttons. A subtle left-right swipe on the row adjusts the value (swipe right = increment, swipe left = decrement). A faint `← swipe →` microcopy hint appears on first render and fades after use.

**Direction:** Attach `onPointerDown`/`onPointerMove`/`onPointerUp` handlers to the row `div`. Track horizontal delta; each step-width of movement triggers one increment/decrement. The number updates in real time. Non-zero numbers render in amber. The gesture is discoverable via the hint text on first use (persisted to localStorage like the frequency hint).

**Calma note:** This is the most radical departure from Calma's explicit "44×44px touch target" principle — there are no discrete buttons. I'd break that rule here because the touch target *is* the entire row (well over 44px in both dimensions). The gesture is learnable and forgiving — overshooting just means one more swipe. The precedent is Snapchat's zoom and iOS slider controls. Reduces visual chrome to near-zero.

**Mockup:** [mockup-number-stepper-alternatives.html](./mockup-number-stepper-alternatives.html)

**Effort:** High — pointer event handling, delta accumulation, mobile touch event conflicts (scroll vs. swipe).

---

### P6 — Single large tap zone with directional split

**What to change:** The entire right half of the row is a single large `<button>`. Tapping the right half of that zone increments; tapping the left half decrements. The current value is displayed large in the center of the zone. A tiny `−  +` label in opposing corners provides a static affordance hint.

**Direction:** The zone is a `rounded-2xl bg-stone-100 dark:bg-stone-800` rectangle approximately `96px wide × 44px tall`. Value is centered in `text-xl font-light`. The left and right tap sub-areas are invisible overlapping hit targets. Non-zero: value in amber, zone tint in `amber-50 dark:amber-950`.

**Calma note:** Follows Calma's `rounded-2xl` page-level shape language. Keeps touch targets large and unambiguous. Reduces the separate-buttons overhead while keeping the increment/decrement metaphor legible. The amber zone tint on non-zero values solves the logged-state feedback problem cleanly.

**Mockup:** [mockup-number-stepper-alternatives.html](./mockup-number-stepper-alternatives.html)

**Effort:** Low-medium — straightforward layout change with two overlapping hit areas.

---

## Sprint recommendations

1. **P3 (Tap-the-number, amber logged state)** — Lowest effort, highest clarity improvement. Solves the "untouched vs. logged zero" problem and the "controls louder than data" problem in one change. Start here.

2. **P6 (Directional split zone)** — Low-medium effort, eliminates two separate border circles in favor of one coherent zone. Can be combined with P3's amber treatment.

3. **P2 (Preset chips)** — Medium effort, best for habits with bounded integer ranges (water, coffee). Implement as a config-driven variant — when `max ≤ 12` and `step === 1`, render chips; otherwise fall back to current or P3.

4. **P4 (Dot track)** — Medium effort. Visually the most "notebook-like." Best as an opt-in display mode per habit type, or constrained to habits with `max ≤ 10`.

5. **P1 (Typography-first reveal)** — Medium effort. Most calming for dense form screens, but adds interaction latency. Worth testing if the form ever gets longer.

6. **P5 (Scrub gesture)** — High effort, niche payoff. Revisit only if accessibility testing confirms that the directional split (P6) causes confusion.

---

## Open questions

- Should the "untouched" state (value = 0, never modified) be stored differently from an intentional `0` entry? Solving this at the data model level would remove the need for visual hacks to distinguish them.
- For habits with decimal steps (sleep: 0.5, screen time: 0.5), which proposal handles rounding most gracefully at the UI level? Chips require a curated range; the dot track gets granular.
- Is there a maximum row height budget for the "By the Numbers" section? P2 (chips) and P4 (dots) add a second visual row below the label, which may feel heavy if there are 4+ numeric habits.
