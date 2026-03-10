# UX Evaluation Report — Follow-up

**Date and time:** 2026-03-09 15:00
**Area reviewed:** HabitToggle — additional proposals and left-indicator variants
**Designer:** UX Radical Evaluation
**References:** [ux-radical-evaluation-2026-03-09-1430.md](./ux-radical-evaluation-2026-03-09-1430.md)

This document extends the original evaluation with three new proposals (P4–P6) and four alternative
treatments for the left-indicator direction established in Proposal 1.

---

## Three additional proposals

### Proposal 4 — Amber text label

**What to change:** Remove every additional element. When a habit is done, the label text itself shifts from `text-stone-700` to `text-amber-700 dark:text-amber-500`. Nothing else changes. The text is the signal.

**Direction:**
- Off: `text-sm text-stone-700 dark:text-stone-300`
- On: `text-sm text-amber-700 dark:text-amber-500`
- The entire row remains tappable (full-width button)
- No icon, no chip, no bar, no background wash — nothing is added

**Calma note:** This uses the color roles table directly: "Accent / joy / selection → amber-700 (light) / amber-500 (dark)." The proposal follows Calma without deviation, and arguably more faithfully than any proposal that adds a secondary element. Calma says "Typography is the primary design material" — this takes that literally. The risk is discovoverability: users need to understand that the text color shift means something. For a daily ritual tool used by a single person, this is an acceptable trade-off. For a product with onboarding needs, it is not.

**Mockup:** [mockup-amber-label.html](./mockup-amber-label.html) ✓

**Effort estimate:** Trivial — a single conditional class swap.

---

### Proposal 5 — Warm gradient row

**What to change:** When done, the row receives a left-to-right amber gradient wash that fades into the page background — no left bar, no icon, no chip. The row's bottom divider also warms slightly. The feel is of ink absorbed into paper: something was pressed here, and the surface received it.

**Direction:**
- Off: plain row, stone-50 background, stone-100 divider
- On: `background: linear-gradient(to right, #fffbeb, #fafaf9)` — amber-50 to page background
- Divider below a done row shifts from stone-100 to amber-100
- Label: `text-stone-800` (one step darker, no color change)
- Full-row tap, no widget

**Calma note:** There is no Tailwind gradient utility for this in Calma's current spec, so this requires an inline `style` attribute rather than a Tailwind class. That is a minor implementation departure but not a design one. The gradient itself does not violate any Calma principle — it is additive and uses only in-spec colors. The spec does not prohibit gradients; it specifies palette, not gradient policy.

**Mockup:** [mockup-warm-gradient-row.html](./mockup-warm-gradient-row.html) ✓

**Effort estimate:** Low — inline style on the row wrapper.

---

### Proposal 6 — Filled row chip (inversion)

**What to change:** When done, the row's content area becomes a filled `bg-stone-800 dark:bg-stone-100` rounded chip (using Calma's inline/compact `rounded-xl` scale). The label inverts to white/stone-900. A small amber dot sits to the right of the label as confirmation. This is the boldest of all proposals — it borrows the moment-chip's filled pill pattern and applies it at row scale.

**Direction:**
- Off: plain row, label `text-stone-700`
- On: the row wraps its interior in a `mx-3 my-1 px-4 rounded-xl bg-stone-800 dark:bg-stone-100` chip containing:
  - Label: `text-sm text-white dark:text-stone-900`
  - Trailing amber dot: `h-2 w-2 rounded-full bg-amber-400` (right-aligned)
- No divider between done rows and their neighbors — the chip shape separates them spatially
- Full-row tap

**Calma note:** This breaks the Calma shape hierarchy slightly — `rounded-xl` is specified for "inline / compact controls," and a row-spanning pill is neither compact nor inline. It also introduces a surface inversion not described in the spec. The deviation is defensible: the moment chips in CheckInForm already use the filled-pill pattern for selection, and extending that language to habits creates a system-wide "done = filled amber/dark chip" vocabulary. But this is the most forceful option, and it may read as too assertive for a tool designed around calm. Use it only if the daily check-in is meant to feel more decisive and marking-like.

**Mockup:** [mockup-inverted-pill-row.html](./mockup-inverted-pill-row.html) ✓

**Effort estimate:** Low-Medium — requires restructuring the row DOM slightly.

---

## Four alternatives for the left indicator (Proposal 1 variants)

All four share the same layout and full-row tap behaviour as Proposal 1. The only difference is the indicator form on the left.

### Alt 1 — Notebook square

A small `h-4 w-4 rounded-sm` square. Off: `border border-stone-300`, transparent fill. On: `bg-amber-500 border-amber-500`. The square is the oldest marking convention — it is what a checkbox is before it becomes a checkbox. Here it avoids the checkbox frame entirely (no outer border in off state except the stroke) and lets the amber fill do the work.

**When to prefer:** If the circular indicator in P1 is too abstract — if users read a circle as "recording" rather than "done" — the square removes that ambiguity. It reads as "slot + fill" rather than "mark."

**Mockup:** [mockup-li-alternatives.html](./mockup-li-alternatives.html) ✓ (all four in one file)

---

### Alt 2 — Blossom icon

The existing `BlossomIcon` component at 18px. Off: outlined petals in stone (the component's empty state — current color). On: filled amber blossom (the component's filled state). This creates deliberate visual continuity between habit-done and joy-marked: the same symbol appears in the left indicator on the habit row and in the Joy section's blossom buttons below habits. They are different actions, but the shared symbol acknowledges that completion and joy are kin.

**When to prefer:** If the team wants to build a coherent symbol language around the blossom, this is the strongest move. It reuses existing SVG work and deepens the meaning of an icon that currently appears only in the Joy section.

**Calma note:** Calma says: "the choice of symbol should carry meaning relevant to the context — avoid generic icon library defaults." BlossomIcon is already meaningful within Clarity. Using it here extends that meaning rather than borrowing a foreign symbol.

**Further assessment:** On reflection, do not use this. The Joy section already uses `BlossomIcon` for a distinct, intentional gesture — marking that you found joy in doing a habit. CLAUDE.md is explicit that factual logging (Habits) and emotional reflection (Joy) are "intentionally separate moments in the form." Using the same symbol for habit-done would make the visual system lie about meaning: two different gestures, one symbol. The apparent continuity is actually a semantic collision. The blossom already carries meaning in this context — the wrong meaning for this use.

---

### Alt 3 — Tally slash

A thin diagonal stroke — like a hand-drawn tally mark (`/`). Off: a faint `—` horizontal dash in stone-300. On: an amber diagonal SVG line, slightly imperfect in weight. References analog tally marking in Hobonichi and bullet journal practice. The gesture carries the feeling of a hand moving across paper.

**When to prefer:** The most analog-feeling of the four. Best suited if the wider design direction leans into the handmade, notebook aesthetic at the component level — not just in palette and type, but in iconography.

---

### Alt 4 — Minimal dot

No border in either state. Off: `h-2 w-2 rounded-full bg-stone-200` — barely there, peripheral, present but undemanding. On: `h-2 w-2 rounded-full bg-amber-500` — small, warm, decisive. The contrast between the dot's smallness and the amber warmth makes it feel like a deliberate ink point rather than a UI element. This is the most restrained indicator; it gets out of the way more than any other option.

**When to prefer:** If the label is trusted to carry the primary read and the indicator should be subordinate — a confirmation rather than an announcement. Pairs especially well with Proposal 4 (amber text label) if both are used together: the dot and the amber label reinforce each other without either one being dominant.

---

## Sprint recommendations (updated)

| Priority | Proposal | Effort | Notes |
|---|---|---|---|
| 1 | Full-row tap (all proposals) | Trivial | Fix this first, independent of visual direction |
| 2 | **P1 + Alt 4 — dot + amber-50 wash** | Low | **Recommended direction — see below** |
| 3 | P4 — Amber text label | Trivial | Layer on top of P1+Alt4 as a double signal if dot feels too subtle |
| 4 | P5 — Warm gradient row | Low | Atmospheric; worth considering if gradient wash replaces flat amber-50 |
| 5 | P6 — Inverted pill row | Low-Medium | Most confident; most break from Calma; validate with real use |
| 6 | P3 — Row highlight (from original report) | Low | Good pairing with P4 if label alone feels too subtle |

---

## Final recommendation

After evaluating all six proposals and four left-indicator variants, the answer is **P1 with Alt 4 (minimal dot) and the amber-50 row wash.**

The reasoning, in order:

**Why not the blossom (Alt 2):** Semantic collision with the Joy section — the same symbol can't mark two different gestures without lying about meaning. Ruled out.

**Why not the tally slash (Alt 3):** Conceptually the most honest analog translation, but has a real first-use confusion risk. Worth holding in reserve if the design direction leans harder into handmade iconography across the board. Not the right default.

**Why not amber label alone (P4):** Philosophically right, practically fragile. A row of plain text with no spatial affordance gives no signal that it's tappable. Too quiet on its own.

**Why the dot:** An 8px dot with no border is the direct digital translation of a bullet journal bullet — the most stripped-down marking convention that exists. Off, it's barely there: stone-200, peripheral, present but undemanding, like a blank bullet waiting. On, it's amber-500: small, warm, decisive. The contrast between its size and its warmth is what makes it readable without being loud. It satisfies Calma's two-state symbol principle with the simplest possible form, borrows no meaning from elsewhere in the app, and adds almost nothing to the DOM.

The amber-50 row wash is the second signal — a spatial confirmation that covers the full row and gives the tap zone a felt quality. Together the dot and the wash are unambiguous without either one being the loudest thing on the screen.

This is also the most bujo of all the options, which suits Clarity's analog-first sensibility exactly.

**Mockup:** [mockup-final-recommendation.html](./mockup-final-recommendation.html) ✓

---

## Open questions (carried forward)

The question about whether amber is deliberately withheld from the `done` state (to reserve it for joy) remains unanswered. All proposals in both reports assume this was an oversight, not a design decision. If it was intentional, P4 and the blossom variant (Alt 2) should be reconsidered — and a new amber-free direction explored instead.
