# UX Evaluation Report

**Date and time:** 2026-03-09 14:30
**Area reviewed:** HabitToggle component — Today page
**Designer:** UX Radical Evaluation

---

## What's working

The layout skeleton is sound. Label left, control right, consistent vertical rhythm, generous row padding. The typography is correctly applied — `text-sm text-stone-700` for habit labels is exactly right per the Calma body text spec. The section label "HABITS" follows the uppercase + widest tracking pattern. The row dividers are appropriately hairline-light. None of this needs to change.

The touch target architecture is also well-intentioned: the button wraps a larger `min-h-[44px]` area rather than sizing the visual element to meet the target. That's the right separation.

---

## What needs attention

**1. The toggle is an OS metaphor wearing Calma clothes.**

- **What:** The control is a pill-plus-sliding-thumb toggle — the exact form factor of iOS UISwitch and Android's Material toggle. It is not a custom element with Clarity's character; it's a borrowed system affordance.
- **Where:** `HabitToggle.tsx` — the `<span>` track + `<span>` thumb construction inside the button.
- **Why it matters:** A habit tracker that positions itself as a personal, reflective tool should not feel like it was assembled from a system settings screen. The iOS toggle says "this is a preference." The act of marking a habit done should feel like marking — a small deliberate gesture, more notebook than control panel.
- **Calma alignment:** Calma's two-state symbol principle says clearly: "use an outlined form for the default and a filled amber form for the selected state." The current toggle uses stone-500 (dark grey) for the `on` state — not amber. It violates both the spirit and the explicit semantic color rule that says amber carries "accent actions, joy, selection."

**2. Amber is missing from the entire interaction.**

- **What:** The `on` state is `bg-stone-500 dark:bg-stone-300` — a neutral dark pill. There is no amber anywhere in the habit-done state.
- **Where:** The `className` on the track `<span>`.
- **Why it matters:** Amber is Clarity's single semantic accent. Every other form of selection in the app uses it (moment chips, joy markings, filter highlights). The habit toggle — the primary daily interaction — does not. This is an inconsistency that makes the toggle feel like it came from a different product.
- **Calma alignment:** Direct violation of the color roles table: "Accent / joy / selection → amber-700 (light) / amber-500 (dark)."

**3. Tapping the habit label does nothing.**

- **What:** The `onClick` handler lives only on the `<button>` (the right-side widget). The left portion of the row — where the label lives — is not tappable.
- **Where:** The wrapping `<div className="flex items-center justify-between py-3.5">` has no handler.
- **Why it matters:** Users naturally tap the label to toggle a row. On a phone, the right-side widget is a small target that requires deliberate aim. Confining the tap zone to a 48px-wide widget on the far right of a full-width row is a usability failure on mobile, regardless of how the element looks.
- **Calma alignment:** Calma requires 44×44px minimum touch targets. The button technically meets this vertically (`min-h-[44px]`), but the horizontal tap zone is unnecessarily narrow when the full row could serve.

---

## Proposals

### Proposal 1 — Left indicator + full-row tap

**What to change:** Replace the OS toggle entirely. Move the state indicator to the left of the label: an outlined circle in the resting state (stone-300), filled amber in the done state. Make the entire row the tap target. Remove the separate button widget.

**Direction:**
- Wrapper `<button>` spans the full row width with `w-full text-left`
- Left side: a small circle (`h-5 w-5 rounded-full`) — outlined with `border-2 border-stone-300` when off, `bg-amber-500 border-amber-500` when on — placed with `flex-shrink-0` before the label
- Label: `text-sm text-stone-700` when off, `text-sm text-stone-800` (one step darker) when on — small weight shift, no color jump
- The row itself gets a faint `bg-amber-50 dark:bg-amber-950/10` wash when done, to confirm the state change at the row level
- No sliding thumb. No pill track. The mark is the gesture.

**Calma note:** Follows the two-state symbol principle directly: outlined → filled amber. The full-row tap is not in the Calma spec but is additive — it expands the touch target without changing the visual language. Calma's 44px minimum is met more generously.

**Mockup:** [mockup-left-indicator.html](./mockup-left-indicator.html) ✓

**Effort estimate:** Low — it's a simpler component than the current one.

---

### Proposal 2 — Amber check chip (right-side, low disruption)

**What to change:** Keep the right-side indicator position but replace the sliding toggle with a static rounded chip. The chip shows a checkmark when done, is empty when not. Background shifts from stone-100 to amber-100 with an amber-600 checkmark on completion.

**Direction:**
- Right-side `<span>` becomes a `h-7 w-7 rounded-xl` chip (not full pill — inline/compact scale per Calma shape hierarchy: `rounded-xl`)
- Off: `bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700`, no mark inside
- On: `bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700`, with a small amber-600 check or dot centered inside
- Full-row tap should also be applied here (same as Proposal 1)

**Calma note:** This breaks Calma's two-state symbol principle slightly — the spec says outlined → filled amber, not bordered chip → tinted chip. The deviation is defensible because the check conveys completion semantics more clearly than a filled dot for users unfamiliar with the new pattern. But Proposal 1 is more faithful.

**Mockup:** [mockup-amber-chip.html](./mockup-amber-chip.html) ✓

**Effort estimate:** Low.

---

### Proposal 3 — Row highlight with left accent bar

**What to change:** Remove all right-side widgets. State is communicated entirely through the row: a thin left border bar in amber and a subtle amber-50 background tint appear when done. No icon, no chip, no toggle.

**Direction:**
- Wrapping `<button>` is the full row, `w-full text-left`
- Off: plain row — stone-50 bg, no left border
- On: `bg-amber-50 dark:bg-amber-950/10` background, with a `border-l-2 border-amber-500` left accent on the row container, and label shifts to `text-stone-900 dark:text-stone-100`
- Padding adjusts slightly left to accommodate the border (`pl-3`)

**Calma note:** This is the most typographically confident option — it trusts the background and border to carry meaning without any icon. It aligns with Calma's philosophy ("Typography is the primary design material") and the notebook/analog sensibility of the research corpus (Hobonichi Techo: "minimal scaffolding invites more honest use"). It breaks no Calma rules. The risk is that the state change may be too subtle for new users — but for a calm daily ritual tool, that subtlety is a feature not a bug.

**Mockup:** [mockup-row-highlight.html](./mockup-row-highlight.html) ✓

**Effort estimate:** Low — even simpler than Proposal 1.

---

## Sprint recommendations

1. **(P1) Full-row tap — regardless of which visual style is chosen.** This is a usability fix, not a design preference. Every proposal benefits from it. Do this first and independently. Effort: Low.

2. **(P2) Adopt Proposal 1 (left indicator)** as the primary redesign direction. It is the most faithful to Calma's two-state symbol spec, removes the OS metaphor completely, and introduces a gesture that feels closer to marking a page than flipping a switch. Effort: Low.

3. **(P3) Consider Proposal 3 (row highlight) for a future "calm mode"** if user testing suggests the left indicator is too unfamiliar. It's the most radical departure from affordance convention, but also the most Calma-coherent.

4. **(P4) Skip Proposal 2** unless there is a specific accessibility reason to preserve an explicit check indicator. It's the weakest of the three — it substitutes one widget type for another without addressing the root problem.

---

## Open questions

- Is there a reason the `done` state deliberately avoids amber? If it was an intentional choice to keep amber only for joy/blossom markings, that constraint should be documented in CLAUDE.md — and reconsidered, since it contradicts the Calma color role spec.
- The current component handles the `joyByDefault` pre-fill silently. Will the visual redesign affect how joy state is communicated — or is that handled separately via the BlossomIcon in the Joy section below habits? Worth confirming the component boundary before implementing.
