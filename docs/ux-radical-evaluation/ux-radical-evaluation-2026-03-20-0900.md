# UX Evaluation Report

**Date and time:** 2026-03-20 09:00
**Area reviewed:** CalendarHeatmap legend — static vs. dynamic count behavior
**Designer:** UX Radical Evaluation
**Prior evaluations:** 2026-03-15-0940 (History page — CalendarHeatmap + FrequencyList) archived; proposals shipped in Sprint 14.

---

## Context

Sprint 14 shipped the date-as-weight calendar (H1), including a legend row below the grid.
The legend currently shows a static "7" rendered in each of the three cell encodings
(ghost, bold stone, bold amber), followed by plain text labels: "no activity", "active", "joy".

The question is whether those static "7"s should be replaced with real counts — showing how
many days in the current month fall into each category.

---

## What's working

**The legend is doing its job correctly.** It sits quietly below the grid, teaches the
three-state encoding at a glance, and disappears into the background once the user
understands the calendar. It doesn't announce itself. It doesn't compete with the data.

**The label copy is well-chosen.** "no activity", "active", "joy" — lowercase, plainspoken,
no performance implication. These read as descriptions of state, not judgements.

**The typography mirrors the cells exactly.** Ghost is `font-light text-stone-300 dark:text-stone-700`,
active is `font-bold text-stone-700 dark:text-stone-300`, joy is `font-bold text-amber-600 dark:text-amber-400`.
The legend demonstrates the encoding by being the encoding — you see what an active date
looks like because you're looking at a number styled the same way.

---

## What needs attention

### 1. The triple "7" is a small craft imperfection

**What:** All three legend items show the same digit: `7 no activity / 7 active / 7 joy`.
The repetition is visually mechanical — clearly a designer's placeholder that didn't get
varied. It's not wrong, but it's not considered either.

**Where:** `CalendarHeatmap.tsx:328–341` — the legend row.

**Why it matters:** The "7" is meant to show what a calendar date number looks like in each
style. A reader might briefly wonder: "are these counts? Are there 7 of everything?" The
three identical digits nudge the eye toward the wrong question. Varied digits would read
as sample dates rather than uniform counts.

**Calma alignment:** This is a craft note, not a spec violation. Calma says words should
feel "considered and human." Three identical digits in a reading key feel neither.

---

## On the dynamic-count question

**The answer is no — and the reason matters.**

A legend has one job: explain the visual encoding. When you put real counts in it, it
gains a second job: summarise the month's performance. The problem is that second job
conflicts with what Clarity is trying to be.

A user who sees "12 no activity / 8 active / 3 joy" doesn't just learn how to read the
calendar — they receive a personal score. The mental arithmetic is immediate and involuntary:
"eight active days out of twenty. That's not great." This is exactly the kind of implicit
comparison pressure Clarity is designed to avoid. The Frequency section below is already
the place where counts live. A count in the legend competes with it structurally and
creates the same data in two places with no coordination — different periods, different
scope, different context.

There is also a semantic problem specific to this encoding. The three categories are not
exclusive: a day can be "active" AND "joy" simultaneously. Counting them separately
produces numbers that don't add up to the days in the month, which would confuse any
user who tries to verify the arithmetic. "7 + 8 + 3 = 18, but there are 20 days — why?"
The static "7" sidesteps this entirely because it's not making a claim about totals.

**A middle path worth rejecting:** dynamic *examples* rather than dynamic counts — find
an actual ghost day, active day, and joy day from the current month and show those real
date numbers as the legend samples. Clever in theory. In practice, if "13" appears in the
legend as a joy example and the user looks at March 13 in the calendar, it reads as the
legend spotlighting a specific day rather than explaining the encoding. The spatial
relationship between the legend and the grid would create confusion that isn't there now.

**The static legend wins.** It's cleaner in purpose, honest about what it is, and it
avoids all the downstream problems of count-based thinking.

---

## On using `#` instead of numbers

A natural instinct after reading the "three identical 7s" problem: replace the digits
with `#`. Styled in ghost/bold-stone/bold-amber, it would read unambiguously as a
placeholder — no one would mistake a `#` for a count. The confusion disappears.

Two problems with it.

First, `#` carries its own connotations — "number" (as in `#1`) and hashtag. Neither
is neutral. A symbol chosen to avoid one reading introduces another. The goal is a
character with no semantic baggage; `#` has some.

Second, and more importantly: the legend's job is to show what a **calendar date**
looks like in each state, so the user can look up at the grid and make the connection.
Date cells show digits. A `#` is not a digit. The correspondence breaks — "ghost `#`
= no activity" is slightly less direct than "ghost number = no activity" because the
character shape is different from what appears in the grid. This is a small loss, but
it goes against the reason for including a sample character at all.

**The cleaner direction:** Drop the sample character entirely. Style the label text
itself in the encoding. "no activity" rendered ghost-weight in ghost-color. "active"
rendered bold in stone. "joy" rendered bold in amber. The label becomes the
demonstration — no sample character, no choice-of-character problem, no risk of
confusion. The weight and color signal is taught directly through the words that name
it.

## Proposals

### L1 — Style the labels in their own encoding (no sample character)

**What to change:** Remove the separate sample-character `<span>` from each legend
item. Instead, render the entire label — "no activity", "active", "joy" — in the
weight and color of the state it describes. The label becomes its own example.

**Direction:**

```tsx
{/* Legend — labels styled per encoding, no sample character */}
<div className="mt-4 flex items-center justify-center gap-5">
  <span className="text-xs font-light text-stone-300 dark:text-stone-700">
    no activity
  </span>
  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
    active
  </span>
  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
    joy
  </span>
</div>
```

Each label is now a single `<span>` — no nested structure, no sample digit to choose.
The ghost label is light-weight in the ghost color, the active label is bold in stone,
the joy label is bold in amber. Weight and color differences are readable even at `xs`
because the three labels are side by side.

**Why this is cleaner than varying the digits:** A varied number (4/8/17) still invites
the question "what are these numbers?" The styled label removes that question entirely.
The label names the state AND demonstrates how it looks. One element, one purpose.

**Why this is cleaner than `#`:** No symbol connotations, no break in the
date-number→grid visual connection (because there is no sample character at all — the
connection now runs directly from "the word 'active' looks bold in stone" to "bold
stone dates in the grid are active days").

**Calma note:** Typography is Calma's primary design material. Letting the label text
carry the visual signal — rather than using a decorative sample character — is the most
direct application of that principle to this element.

**Effort estimate:** Low. Each legend item loses its nested inner `<span>` and gains
the weight/color classes directly. Three items to update in `CalendarHeatmap.tsx:328–341`.

---

## Sprint recommendations

This is a small, contained change — three `<span>` elements simplified in
`CalendarHeatmap.tsx`. It belongs in the next routine polish pass on that file, not
a sprint of its own. No urgency.

---

## Open questions

- **Legend visibility when a HeatmapFilter is active:** When the user taps a FrequencyList
  row and filters the calendar to a single habit, the legend still shows all three states.
  The ghost/active/joy encoding still applies to the filtered view — so the legend remains
  accurate. No change needed, but worth a visual check: does the legend read correctly
  while a filter is active and most of the grid is dimmed to 25% opacity?

- **Legend and the "no entries" month:** If the user navigates to a month with zero logged
  days, every cell is a ghost. The legend will show "ghost / active / joy" as if all three
  states are possible — but only ghost will appear in the grid above. This is technically
  correct (the legend teaches the encoding, not the current month's state), but it may
  feel slightly disconnected. Worth observing but not blocking.
