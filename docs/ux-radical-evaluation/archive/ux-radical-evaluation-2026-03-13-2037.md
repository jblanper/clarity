# UX Evaluation Report

**Date and time:** 2026-03-13 20:37
**Area reviewed:** Manage page — habit/moment list, inline edit form, add-habit flow, joy-by-default control
**Designer:** UX Radical Evaluation
**Prior evaluations:** No overlap with prior active reports. (2026-03-13-2015 covers CheckInForm only.)

---

## Scope

Full audit of the Manage page: the resting habit/moment list, inline edit forms, the add-habit multi-step flow (type picker + form), the joy-by-default toggle control, and the Add button state in inline forms. Both light and dark modes reviewed.

---

## What's working

The **section label treatment** ("HABITS", "MOMENTS") is correct throughout — `text-xs font-medium uppercase tracking-widest text-stone-500`. It creates the right rhythmic anchor for each section without adding visual weight.

The **inline form card** (`rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700`) is the right spatial pattern for progressive disclosure. It appears and disappears cleanly; the animated height reveal works well. Using the same card container for edit and add forms creates correct visual continuity.

The **amber "Archive" button** correctly signals a reversible action per Calma's semantic color rules. Archive is not destructive — it's recoverable — and amber is exactly right here. This is one of the most Calma-compliant choices on the page.

The **"Jump to Moments" anchor link** is a good practical UX affordance. On a page that can grow long, having a single-tap shortcut to the second section is considerate. It doesn't demand attention.

The **archived items** treatment — muted stone-500 text, only a "Restore" button — is clean and communicates the archived state without obscuring it.

---

## What needs attention

### 1. Every interactive element on this page fails the 44px touch target minimum

**What:** The Edit and Archive action buttons, the TEXT_INPUT fields in inline forms, and the SAVE_BTN are all below the 44px minimum touch target height required by both Calma and CLAUDE.md.

- `ACTION_BTN` and `ARCHIVE_BTN` have no `min-h` set. At `text-xs` with default line-height, the tap area is approximately 18–20px — less than half the required minimum.
- `TEXT_INPUT` uses `py-2 text-sm`, which renders at approximately 36px. Below the 44px minimum.
- `SAVE_BTN` uses `py-2 text-xs`, which renders at approximately 28px. Significantly below the minimum.
- The Cancel text link has no height at all.

**Where:** `ManageView.tsx` — `ACTION_BTN`, `ARCHIVE_BTN`, `TEXT_INPUT`, `SAVE_BTN` style constants.

**Why it matters:** On a phone, these targets require careful finger placement. Users will mis-tap — hitting Archive when they meant Edit, or triggering an unintended action. This is not a cosmetic issue; it's a usability failure on every device this app is designed for.

**Calma alignment:** Direct violation of Calma's "Touch targets are minimum 44×44px on all tappable elements" rule. Also explicit in CLAUDE.md.

---

### 2. The joy-by-default second row is verbose, repetitive, and creates uneven row heights

**What:** Every boolean habit renders a second line below the label: either "✿ Brings joy by default" (active) or "☆ Tap to mark as joyful by default" (inactive). The inactive copy is 34 characters — a full instructional sentence — repeated across every boolean habit that doesn't have it set.

**Where:** `ManageView.tsx`, the `toggleJoyByDefault` button in each boolean habit row.

**Why it matters:** Four of eight habits are boolean. That means four rows have this second line, four don't. The list becomes visually jagged — two-line rows alternating with single-line rows. The instruction "Tap to mark as joyful by default" is redundant on every visit after the first; the user learns the control quickly and the text becomes noise they skim past. It also crowded the left side, pushing the visual weight away from the right-side Edit/Archive actions.

In dark mode this is worse. The "Tap to mark as joyful by default" renders in what appears to be `text-stone-500` — borderline for WCAG AA — and the blossom icon in its outline state reads as grey noise against the dark background.

**Calma alignment:** Calma principle: "Every element should earn its place." A 34-character instructional sentence on every inactive row of a list is not earning its place.

---

### 3. List density: `space-y-0.5` provides virtually no row separation

**What:** The habit list uses `space-y-0.5` — 2px of gap between items. With inconsistent row heights (single-line numeric, double-line boolean), the list reads as a dense block rather than a scannable set of distinct items.

**Where:** `ManageView.tsx`, the `<div className="space-y-0.5">` container for both habits and moments lists.

**Why it matters:** The Manage page is a settings-type view — the user scans for a specific item, then acts. Dense lists increase scanning cost. The 2px gap does less visual work than a clear row boundary would.

**Calma alignment:** Calma: "Sections breathe. Use generous vertical space between sections — cramped layouts feel anxious." The principle applies within sections too. A list with 2px item gaps is anxious.

---

### 4. The "What kind of habit?" type selector appears as orphaned inline text

**What:** When the user taps "+ Add habit", the type picker — "What kind of habit? / Yes / No / Number / Cancel" — appears as plain inline text below the last list item. No card container, no visual framing. The "Yes / No" and "Number" options use `text-sm text-stone-600 hover:underline` — they look like links in a paragraph, not interactive choices.

**Where:** `ManageView.tsx`, `addHabit?.stage === "type"` block.

**Why it matters:** The user is being asked to make a decision. The question "What kind of habit?" deserves a clear visual container that signals "this is a step, and here are your choices." Without framing, the type picker looks like a fragment dropped below the list — no affordance that these are tappable choices.

**Calma alignment:** No direct Calma rule violated, but the inline form card pattern is already established on this page (edit form, add-tag form). The type picker is the one step that breaks from this pattern, creating visual inconsistency.

---

### 5. Input borders in the inline form are near-invisible in dark mode

**What:** In dark mode, the `TEXT_INPUT` border is `border-stone-700`. Against the inline form's `bg-stone-800/50` background, this creates very low contrast — the input fields are difficult to perceive as distinct input areas.

**Where:** `ManageView.tsx`, `TEXT_INPUT` constant, dark mode variant.

**Why it matters:** Users need to be able to see where they're tapping to type. When input borders disappear into the background, the form loses clarity and feels broken.

**Calma alignment:** The Calma "Card, input" border token for dark mode is `stone-700` — so this is technically in-spec. But `stone-700` on `stone-800/50` is insufficient in practice. The spec uses these tokens against `stone-900` backgrounds; on a `stone-800/50` card, the contrast is reduced. This is a case where following the spec letter produces the wrong result.

---

## Proposals

### P1 — Fix touch targets on Edit / Archive action buttons

**What to change:** Add `min-h-[44px] inline-flex items-center` to both `ACTION_BTN` and `ARCHIVE_BTN` constants, and add `min-h-[44px] flex items-center` to the row container so the row itself meets the minimum.

**Direction:**

```ts
const ACTION_BTN =
  "inline-flex items-center min-h-[44px] text-xs text-stone-500 dark:text-stone-400 underline-offset-2 hover:underline transition-colors";

const ARCHIVE_BTN =
  "inline-flex items-center min-h-[44px] text-xs text-amber-700 dark:text-amber-500 underline-offset-2 hover:underline transition-colors";
```

Row container:
```tsx
<div className="flex min-h-[44px] items-center justify-between gap-2">
```

(Remove `py-2` from the row — `min-h-[44px]` on the row with `items-center` handles vertical centering.)

**Calma note:** Direct compliance fix. Follows Calma's 44px touch target rule.

**Mockup:** [View mockup](./mockup-2026-03-13-2037.html#p1-touch-targets)

**Effort estimate:** Low. Two constant edits, one class change on the row div (which appears in two places in the file — habits list and moments list).

---

### P2 — Fix touch targets in inline forms (inputs + Save button)

**What to change:** Add `min-h-[44px]` to `TEXT_INPUT` and update `SAVE_BTN` to use `min-h-[44px]` with appropriate sizing. Optionally bump the Save button text from `text-xs` to `text-sm` — the primary action in an inline form should have more visual weight than a label.

**Direction:**

```ts
const TEXT_INPUT =
  "w-full min-h-[44px] rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600";

const SAVE_BTN =
  "inline-flex items-center min-h-[44px] rounded-xl bg-stone-800 dark:bg-stone-200 px-4 text-sm text-white dark:text-stone-900 transition-colors hover:bg-stone-700 dark:hover:bg-stone-300 disabled:opacity-40";
```

The Cancel button should also become `inline-flex items-center min-h-[44px]`:

```ts
const CANCEL_BTN =
  "inline-flex items-center min-h-[44px] text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors";
```

**Calma note:** Compliance fix. The bump from `text-xs` to `text-sm` on SAVE_BTN follows the CLAUDE.md primary button pattern more closely and gives the save action appropriate visual weight. CANCEL_BTN `text-xs` → `text-sm` is a judgment call, but at 44px height `text-xs` looks undersized.

**Mockup:** [View mockup](./mockup-2026-03-13-2037.html#p2-input-heights)

**Effort estimate:** Low. Three constant changes.

---

### P3 — Replace the joy-by-default second-line button with an inline icon

**What to change:** Remove the second-line "Brings joy by default" / "Tap to mark as joyful by default" button. Replace it with a small blossom icon button placed inline in the label row, between the label and the Edit/Archive actions. The icon alone communicates the state; the text disappears.

**Direction:**

Resting (not joyByDefault):
```tsx
<button
  type="button"
  onClick={() => toggleJoyByDefault(h.id)}
  className="inline-flex items-center min-h-[44px] px-1 text-stone-300 dark:text-stone-600 hover:text-amber-500 transition-colors"
  aria-label="Mark as joy by default"
>
  <BlossomIcon filled={false} size={16} />
</button>
```

Active (joyByDefault):
```tsx
<button
  type="button"
  onClick={() => toggleJoyByDefault(h.id)}
  className="inline-flex items-center min-h-[44px] px-1 text-amber-500 transition-colors"
  aria-label="Joy by default — tap to remove"
>
  <BlossomIcon filled={true} size={16} />
</button>
```

Place it in the row between the label `<div>` and the Edit/Archive `<div>`:
```tsx
<div className="flex min-h-[44px] items-center justify-between gap-2">
  <span className="text-sm text-stone-700 dark:text-stone-300">{h.label}</span>
  {h.type === "boolean" && (
    <button type="button" onClick={() => toggleJoyByDefault(h.id)} ...>
      <BlossomIcon filled={h.joyByDefault} size={16} />
    </button>
  )}
  <div className="flex shrink-0 gap-1">
    <button ... className={ACTION_BTN}>Edit</button>
    <button ... className={ARCHIVE_BTN}>Archive</button>
  </div>
</div>
```

This collapses every habit row to a single line. The blossom icon at 16px is subtle at rest (stone-300), warm when active (amber-500). No instructional text needed — the icon pattern from the Joy section of CheckInForm has already primed the user to understand what a filled/outline blossom means.

**Calma note:** Follows Calma's "Status dot variant" / two-state icon principle: "Resting: outlined stroke in stone-400/500, present but undemanding. Active: filled in amber-400/500." This is exactly that pattern. Breaking the current implementation's second-line text label is the right call — Calma's icon two-state principle was designed for exactly this use case.

**Mockup:** [View mockup](./mockup-2026-03-13-2037.html#p3-joy-inline)

**Effort estimate:** Low–Medium. The change is small in code but touches the habit row rendering, which needs careful testing in both active and inactive states, and verification that the add-habit form's joyByDefault toggle (a separate JSX subtree) is also updated consistently. CLAUDE.md specifically warns about this dual-subtree issue.

---

### P4 — Replace `space-y-0.5` with explicit row dividers

**What to change:** Remove `space-y-0.5` from the list containers. Add `border-b border-stone-100 dark:border-stone-800` to each row div. This gives rows clear visual separation without adding weight.

**Direction:**

```tsx
<div className="divide-y divide-stone-100 dark:divide-stone-800">
  {activeHabits.map((h) => (
    <div key={h.id}>
      <div className="flex min-h-[44px] items-center justify-between gap-2">
        ...
      </div>
      {/* inline edit form */}
    </div>
  ))}
</div>
```

Using `divide-y` on the container is cleaner than adding border classes to each row individually. The divider color (`stone-100` light / `stone-800` dark) matches Calma's "Section divider" border token.

**Calma note:** Calma uses `stone-100 / stone-800` as the section divider token. This directly applies that token at row level. The result should feel like paper lines — present, orienting, but not heavy.

**Mockup:** [View mockup](./mockup-2026-03-13-2037.html#p4-row-dividers)

**Effort estimate:** Low. Two class changes — one in habits list, one in moments list.

---

### P5 — Give the "What kind of habit?" type selector a card container

**What to change:** Wrap the type-selector stage in the same `INLINE_FORM` card class used for edit and add forms. Replace the plain text links with small pill-style choice buttons that clearly signal interactivity.

**Direction:**

```tsx
{addHabit?.stage === "type" && (
  <m.div
    className={`mt-3 ${INLINE_FORM}`}
    ...
  >
    <p className={FIELD_LABEL}>What kind of habit?</p>
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => setAddHabit({ stage: "form-boolean", label: "", joyByDefault: false })}
        className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 min-h-[44px] text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
      >
        Yes / No
      </button>
      <button
        type="button"
        onClick={() => setAddHabit({ stage: "form-numeric", label: "", unit: "", step: 1 })}
        className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 min-h-[44px] text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
      >
        Number
      </button>
    </div>
    <button type="button" onClick={() => setAddHabit(null)} className={CANCEL_BTN}>
      Cancel
    </button>
  </m.div>
)}
```

The `FIELD_LABEL` style (`text-xs text-stone-500`) is the right weight for a question/prompt at this level. The choice buttons use the secondary button pattern from CLAUDE.md and are clearly tappable.

**Calma note:** This brings the type-selector step into visual continuity with the rest of the inline form pattern on the page. No Calma rules are broken. The secondary button style (`border-stone-200 bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300`) is the CLAUDE.md-specified secondary button token.

**Mockup:** [View mockup](./mockup-2026-03-13-2037.html#p5-type-selector)

**Effort estimate:** Low. One JSX block replacement.

---

## Sprint recommendations

| Priority | Proposal | File | Effort | Rationale |
|---|---|---|---|---|
| 1 | P1 + P2 — Touch target compliance (buttons + inputs) | `ManageView.tsx` | Low | Two constants + one row class. Compliance failures affecting every interaction. Batch these — they're all in the same file and are purely additive changes. |
| 2 | P3 — Joy-by-default inline icon | `ManageView.tsx` | Low–Med | High clutter reduction. The two-subtree caveat warrants careful implementation — verify both the active habit row and the add-habit form are updated consistently. |
| 3 | P4 — Row dividers | `ManageView.tsx` | Low | Small change, meaningful improvement to list scannability. |
| 4 | P5 — Type selector card | `ManageView.tsx` | Low | Cosmetic but coherent — brings the one outlier step into the page's established pattern. |

All five proposals are in a single file and none affect the data model, routing, or other components. They can be batched into a single sprint with a total implementation estimate of 45–60 minutes including QA across both modes.

---

## Open questions

- **Numeric habit rows**: Currently show the unit label (`hrs`, `glasses`, `cups`) inline with the habit name in a lighter stone-500 style. This is clear and correct. But with the proposed P3 change (blossom icon only for boolean habits), the right-side of numeric rows will be asymmetric with boolean rows (no blossom icon). This is intentional and correct — but worth verifying visually that the row weights feel balanced across both types.

- **The "Start at" field**: The numeric edit form has four fields (Label, Unit, Increment, Start at). That's a relatively complex form for an inline panel. Once P2 is implemented (44px inputs), this form will be noticeably taller. This is fine — the inline form is already designed for multi-field editing — but it's worth checking on a smaller phone viewport (375px) that it doesn't dominate the viewport uncomfortably.

- **Archive confirmation copy**: The "Archived. Past entries are preserved." note (`text-xs text-stone-400 dark:text-stone-500`) uses `text-stone-400` in light mode. This fails WCAG AA on the light background. It should be `text-stone-500 dark:text-stone-400` — the same inversion used everywhere else in the file. Low-priority but a compliance fix.
