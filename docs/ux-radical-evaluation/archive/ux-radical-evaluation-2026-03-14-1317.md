# UX Evaluation Report

**Date and time:** 2026-03-14 13:17
**Area reviewed:** DayDetail dialog — full view (habits, numbers, moments, highlights, reflection, edit action)
**Designer:** UX Radical Evaluation
**Prior evaluations:** ux-radical-evaluation-2026-03-13-2015.md (CheckInForm), ux-radical-evaluation-2026-03-14-0840.md (Manage page). Neither covered DayDetail. No archiving required.

---

## Scope

The DayDetail bottom sheet — the read-only historical record of a single logged day. Accessed by tapping any day cell in the heatmap calendar on the History page. Evaluated against the design changes made in the previous evaluation cycle: the P1 amber language for MomentChips, the Highlights section rename in CheckInForm, and the broader amber-for-completion language now established across HabitToggle and NumberStepper.

---

## What's working

The **bottom sheet structure** is well-executed. `rounded-t-3xl`, a 90vh max-height with overflow-y scroll, and the dimmed backdrop form a clean mobile-native pattern. The sticky close button header means the exit affordance never disappears when content scrolls — that's the right call.

The **"By the numbers" triplet** is typographically elegant. `7.5 · hrs · Sleep` — value in `font-medium stone-800`, unit in `text-xs stone-500`, label in `text-sm stone-600` — creates a precise reading order. It flows like a measurement, not a label. The `items-baseline` alignment keeps the numbers anchored correctly when value sizes differ.

The **reflection typography** is right. `text-sm font-light leading-relaxed text-stone-700` gives it the most considered treatment on the page — it breathes, it doesn't compete with the section labels, and it reads as personal rather than logged.

The **date heading** — `font-light tracking-widest` — has appropriate airy character. The formatting choice ("Friday, 13 March 2026") is readable and unhurried. The full weekday name is the right call here — it grounds the day in felt time, not just index time.

The **close button placement** in a sticky header is correct. On a screen where content scrolls, a fixed-position × is the only reliable exit path.

---

## What needs attention

### 1. Moment chips: the P1 fix went to MomentChip.tsx, not here

**What:** The moment chips in DayDetail are rendered as independent `<span>` elements at `DayDetail.tsx:221` — not through the `MomentChip` component. Their current classes: `rounded-full bg-stone-500 dark:bg-stone-300 px-4 py-2 text-sm text-white dark:text-stone-900`. The P1 fix shipped to `MomentChip.tsx` and the amber language is now established in the CheckInForm. DayDetail is using the pre-P1 stone-filled treatment, independently, with no connection to the resolved component.

**Where:** `DayDetail.tsx:221`, the moments rendering loop.

**Why it matters:** In light mode, stone-500 chips are a heavy dark grey fill — the most visually dominant element in the dialog, heavier than the reflection text below them, heavier than the section labels, heavier than the habit rows. A user who just logged moments with warm amber chips in the form comes back to history and sees dark grey pills. In dark mode it flips: `stone-300` on the dark background gives very bright, prominent chips — the same overcorrection problem from the opposite direction. The visual language that was repaired in CheckInForm is absent here.

More fundamentally: in DayDetail, moments are read-only records in the "captured" state. Every moment chip on this screen was selected. The Calma spec is explicit — "amber signals: selection, reversible operations, row-level completion." Calma also specifically addresses this context: "In read-only review contexts, the filled state may be used as a static display indicator — no press state, no animation, no button wrapper. The filled amber form communicates a marked state without implying interactivity." The current stone fill ignores both of these.

**Calma alignment:** Direct violation of the amber-for-selection rule. The spec explicitly addresses read-only display of captured states.

---

### 2. Habit checkmark: stone-500 grey in a dialog where amber means completion

**What:** Each checked habit row renders `✓` as `text-stone-500 dark:text-stone-500` — the same stone-500 used for metadata, timestamps, and section labels. The checkmark carries zero warmth. Nothing in its appearance signals that this habit was intentionally done today.

**Where:** `DayDetail.tsx:180`, the checkmark `<span>`.

**Why it matters:** Across the app, amber now means "done / selected / captured." HabitToggle: amber dot + amber-50 wash. NumberStepper: amber-50 pill + amber-700 number. MomentChip (post-P1): amber-50 fill + amber-800 text. DayDetail habits: stone-500 `✓`. The one element in DayDetail that signals habit completion uses the same color as metadata. A user scanning the dialog reads the checkmarks as decorative noise rather than as affirmations. The Calma spec's "status dot variant" says: "amber-500/400 when active." This is active — the habit was done.

**Calma alignment:** The spec says: "Stone-900/100 for neutral selection, amber for accent/emotional selection." Completing a habit is emotional selection. The current stone-500 is the wrong register.

---

### 3. No Highlights section — the joy data is invisible

**What:** When a habit is logged with `joy: true`, DayDetail displays a small amber BlossomIcon inline beside the habit label. That's all. There is no dedicated Highlights section. The CheckInForm now surfaces joy-marked habits in a distinct card (amber-tinted panel, "Highlights" section label). DayDetail has no corresponding read-back.

**Where:** `DayDetail.tsx:182-184`, the inline BlossomIcon render condition.

**Why it matters:** The inline blossom is passive — a small amber flower floating to the right of a label. A first-time reader has no idea what it means. Even a regular user may not consciously notice it when scanning. The information it carries — "this habit was meaningful today, not just done" — is one of the more significant things the app captures. It should surface with some intention.

The CheckInForm sends a clear signal: there is a layer above simple completion. DayDetail, as the read-back, should honor that signal. A day where you marked Meditation as a highlight should read differently from a day where you just checked it off. Right now it doesn't.

**Calma alignment:** Not a Calma rule violation — there's no rule mandating symmetry between input and display. But it's a failure to complete the design's own intent. The Highlights section was added to the form because that emotional layer mattered. The detail view should reflect it.

---

### 4. The "Edit" link uses section label styling — it reads as another section heading

**What:** The Edit link at the bottom of the dialog uses `text-xs uppercase tracking-widest text-stone-600` — visually identical to the section labels `HABITS`, `BY THE NUMBERS`, `MOMENTS`, `REFLECTION`. A user scanning the dialog from top to bottom reads: Habits, By the numbers, Moments, Reflection, Edit. Five items in the same uppercase tracked style. Four are section anchors; one is a navigation action. There is no visual distinction.

**Where:** `DayDetail.tsx:247-251`.

**Why it matters:** Section label style has typographic authority — it sets the rhythm of the page. Using it for a navigation action borrows that authority and creates a false equivalence. The Edit link is not a section. A user building a mental model of the dialog will include it in the list of content sections, not realize it's a link, and potentially miss it entirely as an entry point.

**Calma alignment:** No specific Calma rule is violated. But the section label is described as "the single most consistent typographic element — every section of every page uses it without exception" and "creates visual rhythm." Using it for a navigation affordance that is not a section undermines the element's semantic clarity.

---

## Proposals

### P1 — Align DayDetail moment chips to amber "captured" language

**What to change:** Replace the static stone-filled chips with an amber read-only display treatment, matching the post-P1 MomentChip selected state.

**Direction:**

```tsx
<span
  key={label}
  className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-sm text-amber-800 dark:bg-amber-900/20 dark:border-amber-700/40 dark:text-amber-300"
>
  {label}
</span>
```

These chips are read-only — no `cursor-pointer`, no hover state, no press handler. The amber fill communicates "captured" without implying interactivity. `px-3 py-1.5` is slightly tighter than the interactive MomentChip (`px-4 py-2`) — appropriate for a display-only context.

**Calma note:** Direct application of the amber-for-selection rule and the Calma note on read-only display indicators: "In read-only review contexts, the filled state may be used as a static display indicator — no press state, no animation, no button wrapper." Follows Calma precisely.

**Mockup:** [View mockup](./mockup-2026-03-14-1317.html#p1-moment-chips)

**Effort estimate:** Low. One span class change in `DayDetail.tsx`, lines 219-225.

---

### P2 — Change habit checkmark color to amber

**What to change:** Change the checkmark `<span>` from `text-stone-500 dark:text-stone-500` to `text-amber-500 dark:text-amber-400`.

**Direction:**

```tsx
<span className="text-amber-500 dark:text-amber-400">✓</span>
```

That's the entire change. The `✓` glyph stays — just the color shifts to amber. This brings the completion indicator in line with the amber language everywhere else in the form. It's a single class swap.

Optionally — higher effort but stronger result — replace the `✓` glyph with the amber status dot from the Calma spec: a `•` at `text-amber-500`, 14px. This matches the HabitToggle's amber dot exactly. But the color change alone is the minimum necessary fix.

**Calma note:** Calma's status dot variant: "amber-500/400 when active." The checkmark is the active/done indicator. This is a spec compliance fix.

**Mockup:** [View mockup](./mockup-2026-03-14-1317.html#p2-habit-checkmark)

**Effort estimate:** Low. One class change in `DayDetail.tsx`, line 180.

---

### P3 — Add Highlights section for joy-marked habits

**What to change:** When at least one checked habit has `joy: true`, render a "Highlights" section before the Habits section. Use the same amber panel card from CheckInForm's Highlights section. Remove the inline BlossomIcon from individual habit rows once this section exists — the information is now surfaced more prominently and the per-row blossom becomes redundant.

**Direction:**

```tsx
{/* Highlights — habits where joy was marked */}
{checkedHabits.some((h) => h.joy) && (
  <section className="mb-6 rounded-2xl bg-amber-50 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-900/30 px-4 py-3">
    <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500">
      Highlights
    </h3>
    <div className="space-y-1">
      {checkedHabits.filter((h) => h.joy).map((h) => (
        <div key={h.id} className="flex items-center gap-2">
          <BlossomIcon filled={true} size={14} />
          <span className="text-sm text-stone-700 dark:text-stone-300">{h.label}</span>
        </div>
      ))}
    </div>
  </section>
)}
```

Position: between the date heading and the Habits section. A day's highlights are its emotional summary — they belong at the top, not buried below numeric counts.

**Calma note:** The amber-50/amber-900/15 panel card is the same surface token used for the Highlights panel in CheckInForm — `bg-amber-50 dark:bg-amber-900/15` with `border-amber-100 dark:border-amber-900/30`. This is an existing pattern applied consistently, not a new one introduced. No Calma rules broken.

**Mockup:** [View mockup](./mockup-2026-03-14-1317.html#p3-highlights-section)

**Effort estimate:** Low–Medium. Adds ~15 lines to `DayDetail.tsx`. Removes the inline BlossomIcon from the habits loop (DayDetail.tsx:182-184). Straightforward implementation.

---

### P4 — Restyle the Edit link as a distinct secondary action

**What to change:** Remove the section-label styling from the Edit link and replace it with a small secondary button that reads as a navigation affordance, not a content section.

**Direction:**

```tsx
<div className="mt-6">
  <Link
    href={`/edit?date=${date}`}
    className="inline-flex items-center rounded-xl border border-stone-200 dark:border-stone-700 px-4 py-2 text-xs text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50 hover:text-stone-800 dark:hover:text-stone-200"
  >
    Edit this day
  </Link>
</div>
```

Two changes beyond the class: (1) the label becomes "Edit this day" rather than "EDIT" — lowercase, more specific, reads as an action not a heading; (2) the button uses the Calma secondary button token (`border-stone-200 bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300`), which is visually distinct from every section label on the page.

**Calma note:** This applies the Calma secondary button token directly. The current uppercase tracking-widest treatment for a navigation link is not a Calma-prescribed pattern — it borrows section label authority for an unrelated purpose. The secondary button is the correct token for this use case.

**Mockup:** [View mockup](./mockup-2026-03-14-1317.html#p4-edit-action)

**Effort estimate:** Low. Class and label change in `DayDetail.tsx`, lines 246-251.

---

## Sprint recommendations

| Priority | Proposal | File | Effort | Why this order |
|---|---|---|---|---|
| 1 | P1 — Amber moment chips | `DayDetail.tsx` | Low | Fixes the most glaring language break — the pre-P1 stone chips are immediately visible and contradict the shipped CheckInForm fix |
| 2 | P2 — Amber checkmark | `DayDetail.tsx` | Low | Single class change, closes the amber-for-completion language gap in habits |
| 3 | P3 — Highlights section | `DayDetail.tsx` | Low–Med | Surfaces meaningful data that's currently invisible; completes the CheckInForm → DayDetail narrative |
| 4 | P4 — Edit as secondary button | `DayDetail.tsx` | Low | Interaction clarity fix, removes the section-label style collision |

All four proposals touch only `DayDetail.tsx`. None affect the data model, routing, or other components. Total implementation estimate: 45–60 minutes including QA across light and dark modes.

---

## Open questions

- **Highlights section position:** This report places Highlights above Habits, on the premise that highlights are the emotional summary of the day and deserve top billing. An alternative — placing it between Habits and By the numbers — preserves the "logged data first, emotional layer second" reading order from the form. Worth a quick check against user expectation before implementing.

- **Reflection warm state in DayDetail:** The CheckInForm's second open question (from the 2026-03-13 evaluation) noted the textarea has no visual acknowledgment when it contains text. In DayDetail, the opposite question applies: does the Reflection section need any visual differentiation from a "rich day" vs. "sparse day" context? For now, no — the content itself carries the weight. But if a visual completeness indicator is ever added, the presence/absence of reflection text will need to be factored in.

- **Date heading size:** The current `text-base font-light tracking-widest` is functional but slightly understated for a dialog header. `text-lg font-light` would give it more presence without breaking the airy character. This is a low-stakes aesthetic call — not a language or accessibility issue — and is deliberately left out of the sprint recommendations to keep the batch focused on the language fixes.
