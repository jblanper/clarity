# UX Evaluation Report — Re-evaluation: NumberStepper P3 / P4 / P5

**Date and time:** 2026-03-10 10:00
**Area reviewed:** NumberStepper — critique of P3/P4/P5 proposals; path to implementation decision
**Designer:** UX Radical Evaluation
**Follows from:** [ux-radical-evaluation-2026-03-09-2200.md](./ux-radical-evaluation-2026-03-09-2200.md)

---

## Context

The previous report proposed nine variants across three design directions (P3, P4, P5) for the NumberStepper component. The user's read is accurate: P5 still has structural problems, P4 is philosophically misaligned with Clarity's intent, and P3 is the right direction. This report explains exactly why — and closes the decision.

---

## What's working

The previous iteration report did the hard work of diagnosing the right problems. The P3 variants are all genuinely credible. The analysis of P5-B as "the most interesting of the nine" is not wrong — taken in isolation, P5-B is elegantly reasoned. The issue is that elegant reasoning about the wrong gesture is still the wrong gesture. The sprint recommendations at the end of that report were already moving toward P3; this report confirms and sharpens that direction.

---

## What needs attention

### P5 — the gesture is wrong, not the implementation

**What:** All three P5 variants are solutions to a self-inflicted problem: horizontal scrub as the primary interaction for adjusting a number.

**Where:** The design direction as a whole, not any specific variant.

**Why it matters:** Scrubbing is a borrowed gesture. It comes from video timelines, audio players, and OS sliders — contexts where a value exists on a visible continuum and the user is seeking a position within that continuum. In a notebook, you don't scrub. You write a number. Clarity's mental model is analog logging, not slider adjustment. Asking a user to scrub horizontally to log how many glasses of water they drank is borrowing a gesture from a different product category and a different mental model. The friction isn't a discoverability problem — it's a category mismatch.

Every P5 variant responds to this mismatch by adding a permanent explanation of the gesture: an icon (P5-A), a focus state that reveals affordances (P5-B), a grip handle borrowed from drag-to-reorder UI (P5-C). When a design requires a permanent explanation of its primary gesture, the gesture is wrong.

**Calma alignment:** Calma's "text navigates, words are trusted" principle runs against icon-based affordances. P5-A uses a `⟷` icon as a gesture label, which is a departure the previous report tried to justify but couldn't fully defend. P5-C uses a grip handle convention that signals list-reorder first and value-adjustment second — the mental model is wrong before the user has even touched it. P5-B introduces an invisible state: the `−` button only appears after the user taps to focus, meaning the decrement path is hidden on first encounter. Hidden state contradicts Calma's insistence on calm, legible interfaces where nothing requires discovery.

**The deeper problem with P5-B specifically:** The previous report called P5-B "the most honest solution" because it teaches itself through use. That reasoning is sound for the scrub gesture, but the hidden `−` button is not honest — it's a mode. The user who has never tapped a number doesn't know the minus button exists. They see Sleep: 0, a `+`, and a disabled `−`. After tapping, they see a focused number and a newly visible `−`. That is an interface with invisible states, which is precisely what calm technology argues against.

---

### P4 — range visualization contradicts Clarity's philosophical intent

**What:** P4 in all three variants is fundamentally a range visualization. It shows a value within a defined span — from 0 to max. That is goal framing.

**Where:** The design direction as a whole.

**Why it matters:** Clarity's research corpus is explicit on this point. The product is not a tracker of progress toward targets; it is a tool for self-knowledge through honest recording. The Calm Technology principles say technology should inform without taking focus. A dot track, a filled bar, or a ruler with ticks all say something the product should not say: "here is where you are relative to where you could be." Even if the user has no conscious goal, the visual structure of a progress element primes comparative thinking. The previous report acknowledged this ("P4-B's segment bar invites a 'goal' reading. Clarity deliberately avoids goal framing. Does this association matter enough to reject the bar in favor of dots or ticks?"). The answer is yes. It matters enough.

P4-B (filled segment bar) is especially problematic because it is indistinguishable from a standard progress indicator. The report notes it "breaks from 'no progress bars' only in the sense that a horizontal bar exists" — but that is precisely what "no progress bars" means. A bar that fills from left to right as a value increases is a progress bar, regardless of what the value represents.

P4-A (dots) and P4-C (ruler ticks) are more defensible aesthetically but carry the same semantic weight. The dots show completeness toward a max. The ruler shows position within a range. Both frame the number as a distance between two points, which is goal framing by another name.

**Calma alignment:** The Calma spec says "no progress bars, no streak counters." P4 is a family of progress bar variants. The spec also says the aesthetic should feel closer to a handwritten notebook than a productivity dashboard. A dot track or a ruler tick is closer to a dashboard readout than to a notebook entry.

---

## Proposals

### P3 — confirmed direction; close the decision

P3 is right because it matches the notebook mental model directly. You tap the number and it increments. There's no range visible, no target implied, no comparative structure. The number is just a number — the same as a handwritten entry in a Hobonichi.

The remaining choice is between P3-A (pill badge) and P3-B (phantom plus). Here is the final comparison:

---

### P3-A — Pill badge (production choice)

**What to change:** Wrap the number display in a `rounded-xl bg-stone-100` pill with `min-w-[52px] h-[44px]` (the full touch target is the pill itself, no invisible overlay needed). On press: `active:bg-stone-200`. When value > 0: `bg-amber-50`, number in `amber-700`. The `−` button appears to the left as a lightweight circle or plain text glyph, always sized to `min-h-[44px]` with the same quiet amber treatment.

**Why the pill teaches the gesture:** The rounded surface is the universal pressable affordance across every mobile app the user has touched. It requires no learning, no hint, no icon. The shape is the instruction.

**Why the logged state matters:** The amber pill surface at value > 0 communicates "I've noted something here" — it changes the spatial character of the control without implying progress toward a target. It says "touched" not "toward goal."

**One refinement from this evaluation:** The number at zero should be `stone-500` (not `stone-300` as in the previous mockup — that fails WCAG AA). The pill is `stone-100`, the background is `stone-50`/white, and `stone-300` on `stone-100` is approximately 1.3:1. Not acceptable even for a gesture affordance. The zero should be readable: `stone-500` at minimum.

**Calma note:** Fully within spec. `rounded-xl` for inline controls, `stone-100` surface, `amber-50`/`amber-700` for logged state. No rules broken.

**Effort:** Low — CSS class change on the number wrapper, state-driven class swap on logged.

**Mockup:** [mockup-p3-final.html](./mockup-p3-final.html)

---

### P3-B — Phantom plus (personal recommendation if contrast is acceptable)

**What to change:** At value = 0, the display reads `0 +` with the `+` in `stone-500` (not `stone-300` — same accessibility correction as above, applied here too). The entire zone is one tap target. On first tap the `+` disappears, value becomes `1` in amber. The `+` is permanent at zero — it never dismisses.

**Why this is the most honest:** The phantom `+` is the notebook equivalent of a pre-printed line. It doesn't impose structure, but it guides the pen. It's the only P3 variant that answers the "intentional zero vs. untouched" question at a glance: a zero with no `+` would signal "this was explicitly set to zero"; a zero with a ghost `+` signals "this hasn't been touched yet." That's a meaningful distinction that P3-A cannot make.

**The accessibility correction from previous report:** The previous report proposed `stone-300` for the ghost `+`, accepted as a deliberate exception. That exception is unnecessary and I'd revoke it. `stone-500` is the minimum safe text color in Calma light mode and passes WCAG AA. The ghost feeling comes from the `font-light` weight and the small `text-xs` scale, not from failing contrast. Keep the contrast, reduce the weight.

**Calma note:** Fully within spec with the correction. The `aria-hidden` span approach means screen readers hear only the number.

**Effort:** Low — single extra `<span aria-hidden="true">` in the number wrapper.

**Mockup:** [mockup-p3-final.html](./mockup-p3-final.html)

---

### The decrement button — settle this once

Both P3-A and P3-B handle the decrement button the same way: it is absent at zero and appears when value > 0. This is already the current behavior. Keep it. The previous report's P5-B state machine (where `−` only appears in focused state) is not relevant to P3. In P3 there is no focus state — the `−` appears as soon as there is something to decrement. Simple, legible, always correct.

---

## Sprint recommendations

**One ticket, low effort:** Implement P3-A as the default. The pill shape is the lowest-risk, most universally readable choice. It requires no copy changes, no new gestures, no new state models — just a wrapper class and a color-swap on logged.

**Optional follow-up:** If P3-B's "intentional zero vs. untouched" distinction turns out to matter in practice (it will for users who track habits like alcohol or coffee, where zero is sometimes deliberate), P3-B is a one-line code change on top of P3-A. It doesn't need to be in the same ticket — but it should be in the same sprint.

**Close P4 and P5:** Remove both directions from the open options list. They solve the wrong problems for this product.

---

## Open questions (resolved and remaining)

**Resolved from previous report:**
- P5-B second-tap behavior: resolved (always increment). Moot — P5 is closed.
- P5 scroll conflict: resolved via `touch-action: pan-y`. Moot — P5 is closed.
- P4-B goal framing concern: resolved — goal framing is reason enough to reject P4 entirely.

**Remaining:**
- **Intentional zero vs. untouched:** P3-B answers this visually; P3-A does not. If the data model ever needs to distinguish `value: 0` (user deliberately logged zero) from `undefined` (user never touched the field), this needs a decision before sprint work. The current data model stores sparse records — untouched habits are absent from the entry. If a user explicitly sets Sleep to 7 and then decrements back to 0, is that stored as `0` or erased? This is a data model question, not a design question — but the answer affects which P3 variant is the right choice.
- **Unit label placement:** In the current design, the unit label ("hrs", "glasses") appears next to the habit name on the left. In a P3-A pill layout, there's a visual question about where the unit lives at logged state. The amber pill draws the eye right; the unit label stays left. That's probably fine — but worth checking in the mockup at different label lengths.
