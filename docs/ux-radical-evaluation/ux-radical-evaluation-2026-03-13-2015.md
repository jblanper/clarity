# UX Evaluation Report

**Date and time:** 2026-03-13 20:15
**Area reviewed:** CheckInForm — MomentChip, Joy section, Add-moment inline form, Reflection textarea, Save button
**Designer:** UX Radical Evaluation
**Prior evaluations:** ux-radical-evaluation-2026-03-10-1030.md (HabitToggle + NumberStepper — already addressed)

---

## Scope

This evaluation covers the remaining interactive elements in Today and Edit day pages, now that HabitToggle and NumberStepper have been redesigned. The five elements under review are: MomentChip, Joy section (header + BlossomIcon row), Add-moment inline form, Reflection textarea, and Save button.

---

## What's working

The **Save button** is well-executed. `rounded-2xl`, `tracking-widest`, and the three-state label progression — "Save" → "Saving…" → "Day captured" — is a quiet Calma win. "Day captured" specifically avoids the clinical "Saved successfully" pattern and adds just enough warmth to close the form well.

The **"+ New moment" dashed border pill** works correctly as an invitation without demanding attention. Its `border-dashed` treatment signals affordance without visual weight. It disappears cleanly when the inline form opens, which is the right spatial behavior.

The **Add-moment inline form structure** is sound. Input + primary action + dismiss is a minimal three-element row. The animations (height + opacity reveal) are smooth and appropriately brief.

The **Reflection textarea** uses `font-light text-sm`, which matches the Calma "reflective body" typography role. Placeholder copy "Anything about today worth remembering?" is warm, non-prescriptive, and Calma-compliant.

The **Joy section card** — `rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800` — creates a gentle spatial container that correctly separates the emotional reflection layer from the factual logging above it. The panel approach is right for this section.

---

## What needs attention

### 1. MomentChip selected state breaks the form's amber language

**What:** Selected MomentChips use `bg-stone-500 text-white` in light mode and `bg-stone-300 text-stone-900` in dark mode. This is a solid neutral grey fill — the same grey family used for metadata, secondary text, and dividers.

**Where:** `MomentChip.tsx`, selected state.

**Why it matters:** The rest of the form has established a clear amber language for "something I noted here." HabitToggle done state → amber dot + amber-50 wash. NumberStepper logged state → amber-50 pill + amber-700 number. When the user gets to Moments, the selected chips go cold grey. The message becomes incoherent: checked habits glow warm, logged numbers glow warm, but noted moments are colourless. The language that has been built through the top two sections silently breaks here.

In dark mode this is worse. `bg-stone-300` is very light — close to white on a charcoal background. A selected chip reads as a bright, dense block, louder than anything else in the form. The amber wash on the checked habit above it is barely perceptible; the chip below it shouts.

**Calma alignment:** Calma is explicit — "amber signals: accent actions, joy, selection, reversible operations, and row-level completion." MomentChips are exactly this: reversible, selectable records. The current stone-fill directly contradicts this rule.

---

### 2. Joy section heading is a full sentence in a section label slot

**What:** The Joy section heading reads `WHAT FELT PARTICULARLY GOOD TODAY?` in the same uppercase tracking-widest style used for all section labels.

**Where:** `CheckInForm.tsx`, Joy section `<h2>`.

**Why it matters:** Calma section labels are concise chapter markers — "Habits", "By the numbers", "Moments", "Reflection". They orient without asking. "What felt particularly good today?" is an interrogative sentence — 35 characters — rendered as a section label. It feels like a survey question, not a section header. It also breaks the rhythm of the form: all other section labels are 1–3 words.

The section label style was designed for brevity. Using it for a full sentence exploits the visual authority of the style without the restraint that makes it work.

**Calma alignment:** Section label principle: concise chapter markers, uppercase, stone-500. This use case violates the conciseness principle. The style is correct; the content is not.

---

### 3. Add-moment inline form: size mismatch between input and button

**What:** The inline add-moment row pairs a `rounded-full` input (`py-2`, ~36px visual height) with a `rounded-full` Add button that has `min-h-[44px]`. The button is taller than the input, which creates a vertical size mismatch inside the same row. The Add button looks physically dominant relative to the input it accompanies.

**Where:** `CheckInForm.tsx`, inline add-moment `<div className="flex items-center gap-2">`.

**Why it matters:** The pairing should feel like an input with an action, not an input subservient to a button. When the button is noticeably taller, the visual weight tips toward the action. On mobile, this is a proportional incoherence — the user is typing, but the primary visual statement is the button.

**Calma alignment:** No direct Calma rule violation, but it goes against the principle of visual rhythm and proportional balance. Both elements should share the same height or the difference should be undetectable.

---

### 4. Reflection textarea border is heavier than its context warrants

**What:** The Reflection textarea has `border border-stone-300 dark:border-stone-700`. The section dividers elsewhere in the form use `divide-stone-100 dark:divide-stone-800` — two steps lighter.

**Where:** `CheckInForm.tsx`, Reflection `<textarea>`.

**Why it matters:** The heavier border gives the textarea a boxed, form-like appearance — it reads like a mandatory input field. Reflection is the softest, most optional element of the form. The border weight should signal this. A `stone-200` border in light mode (matching the chip unselected state rather than overriding it with `stone-300`) would keep it visible without adding tension.

**Calma alignment:** Calma uses `stone-200` as the "Card, input" border token in light mode. The current implementation uses `stone-300`, one step heavier than the spec. This is a spec compliance issue as much as a design one.

---

## Proposals

### P1 — Align MomentChip selected state to amber language

**What to change:** Replace the stone-fill selected state with an amber-tinted variant that matches the energy level of the HabitToggle and NumberStepper selected states. The chip should remain outlined (not solid-filled) to preserve its lighter visual weight relative to the toggle rows above.

**Direction:**

*Light mode — selected:*
- Background: `bg-amber-50` (matches HabitToggle wash exactly)
- Border: `border-amber-300`
- Text: `text-amber-800`

*Dark mode — selected:*
- Background: `dark:bg-amber-900/20` (matches NumberStepper logged pill)
- Border: `dark:border-amber-700/40`
- Text: `dark:text-amber-300`

*Light mode — unselected (no change needed but worth noting for clarity):*
- `border border-stone-200 bg-transparent text-stone-500`

*Dark mode — unselected:*
- `dark:border-stone-700 dark:bg-transparent dark:text-stone-400` — remove `dark:bg-stone-800`, which gives the unselected chip an unnecessary fill. Transparent background in both modes for the resting state is cleaner.

**Calma note:** This directly follows Calma's amber-for-selection rule and aligns the component with the established form language.

**Mockup:** [View mockup](./mockup-2026-03-13-2015.html#p1-moment-chip)

**Effort estimate:** Low. All changes within `MomentChip.tsx`. One class swap in the selected condition, one in unselected dark mode.

---

### P2 — Shorten Joy section heading to a section label

**What to change:** Replace "What felt particularly good today?" with "Highlights" as the section label. Keep the section's card container and Blossom interaction unchanged.

**Direction:**

```tsx
<h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500">
  Highlights
</h2>
```

**Calma note:** Follows the section label brevity principle. "Highlights" is self-explanatory on first encounter, plural (correctly implying more than one can be marked), and sits cleanly alongside "Habits", "Moments", "Reflection" — all nouns, no verbs, no questions. Preferred over "Joy" (too ambiguous without context) and "Felt good" (reads as a statement rather than a label in all-caps).

**Mockup:** [View mockup](./mockup-2026-03-13-2015.html#p2-joy-heading)

**Effort estimate:** Low. A single string change in `CheckInForm.tsx`.

---

### P3 — Match input and button height in the add-moment inline form

**What to change:** Give the text input explicit `min-h-[44px]` so it matches the Add button height. Both elements should share the same vertical dimension.

**Direction:**

```tsx
<input
  ...
  className="flex-1 min-h-[44px] rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-2 text-sm ..."
/>
```

Adding `min-h-[44px]` to the input guarantees parity and also brings the input into compliance with the 44px minimum touch target rule — the current `py-2` on `text-sm` gives approximately 36px, which is below the minimum.

**Calma note:** The 44px minimum touch target is a hard rule in both Calma and CLAUDE.md ("Touch targets are minimum 44×44px on all tappable elements"). The input is tappable — it receives focus on tap. This is a compliance fix as much as a proportional fix.

**Mockup:** [View mockup](./mockup-2026-03-13-2015.html#p3-add-moment-form)

**Effort estimate:** Low. One class addition in `CheckInForm.tsx`.

---

### P4 — Soften Reflection textarea border

**What to change:** Change the textarea border from `border-stone-300 dark:border-stone-700` to `border-stone-200 dark:border-stone-700`, bringing the light mode border into spec alignment. The dark mode value is already appropriate.

**Direction:**

```tsx
<textarea
  ...
  className="... border border-stone-200 dark:border-stone-700 ..."
/>
```

Optionally, update the focus state from `focus:border-stone-500` to `focus:border-stone-400 dark:focus:border-stone-500` to maintain a lighter hover state in light mode.

**Calma note:** `stone-200` is the Calma "Card, input" border token for light mode. The current `stone-300` is one step heavier than the spec, which is a minor compliance fix.

**Mockup:** [View mockup](./mockup-2026-03-13-2015.html#p4-reflection-textarea)

**Effort estimate:** Low. One class change in `CheckInForm.tsx`.

---

## Sprint recommendations

| Priority | Proposal | File | Effort | Why this order |
|---|---|---|---|---|
| 1 | P1 — MomentChip amber selected state | `MomentChip.tsx` | Low | Highest visual impact, fixes a language break that affects every interaction in the Moments section |
| 2 | P2 — Joy heading → "Joy" | `CheckInForm.tsx` | Low | One-line change, removes a section label that violates the Calma conciseness principle |
| 3 | P3 — Input min-height in add-moment | `CheckInForm.tsx` | Low | Touch target compliance + proportional fix, very small change |
| 4 | P4 — Reflection textarea border | `CheckInForm.tsx` | Low | Calma spec alignment, cosmetic improvement, lowest priority |

All four proposals can be batched into a single sprint. Total implementation estimate: 30–45 minutes including QA across both light and dark modes.

---

## Open questions

- **"Save" as idle label — resolved:** Change to **"Capture"**. The confirmed state "Day captured" is excellent microcopy, and "Capture" is the only idle label that runs the same root word through all three states: "Capture" → "Capturing…" → "Day captured". "Log day" was considered but introduces a verb mismatch (logging → captured) and carries a technical connotation at odds with Calma's analog sensibility. "Capture" is shorter, more human, and closes the loop the confirmed state already sets up.

- **Reflection textarea warm state:** Unlike HabitToggle and NumberStepper, the Reflection textarea has no visual acknowledgment when it contains text (no amber tint, no color shift). This feels intentional and appropriate — reflection is personal, not a trackable data point. But if the form ever gains a "completeness" indicator (e.g. a visual cue that all sections have been touched), the textarea's absence of state signal would need to be addressed.

- **Joy section blossom: joy pre-marked at joyByDefault:** When `joyByDefault: true`, the blossom appears pre-filled on the first toggle. The visual state (filled amber blossom) implies the user has actively chosen this, which is not entirely true — it was set by default. A subtle animation on the pre-filled state (fading in rather than appearing instantly) might help communicate that it was pre-selected, not explicitly chosen. Not blocking — just worth noting for a future UX iteration.
