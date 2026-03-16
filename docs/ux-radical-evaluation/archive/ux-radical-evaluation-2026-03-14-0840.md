# UX Evaluation Report

**Date and time:** 2026-03-14 08:40
**Area reviewed:** Manage page — bold redesign proposal
**Designer:** UX Radical Evaluation
**Prior evaluations:** Supersedes 2026-03-13-2037 (archived). That report covered the same area with incremental fixes. This report proposes a more fundamental restructure of the page.
**Artefacts:** [Unified mockup](./mockup-2026-03-14-0840.html) — proposals (B1–B4, full page) and interaction flows in one file

---

## Scope

A bolder redesign of the Manage page that addresses the same underlying problems as the previous report — touch targets, joy clutter, list density, type selector framing — but through structural and interaction-model changes rather than class-level fixes. Every proposal remains within the Calma spec.

---

## What's working

The header is clean. Title left, nav right. Light tracking on "Manage" reads correctly at the page level. The `← Settings` link is appropriately subdued.

The section label treatment (`HABITS`, `MOMENTS`) is correct and consistent. It creates the right rhythmic anchor.

The inline form card pattern — used for edit and add forms — is the right spatial pattern for progressive disclosure. It is one of the better-considered choices on this page. The bold redesign leans into it more aggressively.

The amber `Archive` button correctly signals a reversible action.

---

## What needs attention

The previous report documented five specific issues (touch targets, joy verbosity, list density, type selector framing, dark mode input contrast). All five are valid and unresolved. This report treats them as symptoms of a deeper structural problem and addresses them at the root.

**The structural problem:** The Manage page is designed as a *form with persistent controls* — every row shows Edit and Archive at all times. This creates visual noise proportional to the number of habits and moments. With eight habits, sixteen control links are always visible. The page feels like a settings panel that grew organically rather than a page that was designed.

The page should be a *quiet inventory*. You open it to see what you have, not to be presented with sixteen calls to action. The actions should be reachable, but they should not demand your attention when you don't need them.

**The format mismatch:** Habits and Moments are conceptually different and handled differently in the check-in form — habits are rows (boolean/numeric), moments are chips. But on the Manage page both sections use the identical list format. This loses a visual language that the user has already learned.

---

## Proposals

### B1 — Section cards with Add action in the header

**What to change:** Wrap each section (Habits, Moments) in a subtle card container: `rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 px-4 pt-4 pb-3`. Move the section label inside the card as a header row. Align a `+ New` action to the right of the header — `text-xs text-stone-500 dark:text-stone-400 hover:text-stone-700` — replacing the `+ Add habit` and `+ Add moment` text links below the lists.

**Direction:**

```tsx
<section className="mb-8">
  <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 px-4 pt-4 pb-3">
    <div className="flex items-center justify-between mb-3">
      <h2 className={SECTION_LABEL}>Habits</h2>
      <button
        type="button"
        onClick={() => { closeAllEditors(); setAddHabit({ stage: "type" }); }}
        className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
      >
        + New
      </button>
    </div>
    <div className="divide-y divide-stone-100 dark:divide-stone-800">
      {/* rows */}
    </div>
  </div>
</section>
```

**Why it's bold:** It fundamentally changes the page structure from bare lists to contained sections. The card container is not a new pattern — it's the same pattern used by inline forms — applied at the section level. The Add action moves from a text orphan below the list to an intentional affordance in the header. The page gains visual hierarchy it currently lacks.

**Calma note:** Direct application of the "subtle panel" surface token (`stone-50 / stone-800/50`) and the section divider border token (`stone-100 / stone-800`) for row separation. No Calma rules broken.

**Mockup:** [View mockup](./mockup-2026-03-14-0840.html#b1-section-cards)

**Effort estimate:** Low–Medium. Restructures the JSX wrapper around each section list, moves the Add button, removes the standalone Add button at the bottom.

---

### B2 — Full-row tap with contextual action tray (hiding Edit / Archive at rest)

**What to change:** Remove the persistent Edit and Archive links from every row. Make each row a silent, full-width touch target (`min-h-[44px] w-full flex items-center`). Tapping a row toggles an action tray below it — a compact strip with "Edit label" and "Archive" as pill-style secondary buttons. The tray is animated in (height reveal, same pattern as inline forms). Tapping "Edit label" closes the tray and opens the full inline edit form.

**Direction — resting row:**

```tsx
<button
  type="button"
  onClick={() => toggleActionTray(h.id)}
  className="w-full flex items-center justify-between min-h-[44px] gap-2 text-left"
>
  <div className="flex items-baseline gap-2 min-w-0">
    <span className="text-sm text-stone-700 dark:text-stone-300">{h.label}</span>
    {h.type === "numeric" && (
      <span className="text-xs text-stone-500">{h.unit}</span>
    )}
    {h.type === "boolean" && h.joyByDefault && (
      <BlossomIcon filled size={12} />  {/* amber, 12px — present but undemanding */}
    )}
  </div>
  <span className="text-stone-300 dark:text-stone-600 text-xs shrink-0">···</span>
</button>
```

**Direction — action tray (animated reveal):**

```tsx
<AnimatePresence initial={false}>
  {actionTrayId === h.id && (
    <m.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{ overflow: "hidden" }}
      className="flex gap-2 pb-2"
    >
      <button
        type="button"
        onClick={() => { setActionTrayId(null); startEditHabit(h); }}
        className="inline-flex items-center min-h-[44px] px-3 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
      >
        Edit label
      </button>
      <button
        type="button"
        onClick={() => archiveHabit(h.id)}
        className="inline-flex items-center min-h-[44px] px-3 rounded-xl border border-amber-200 dark:border-amber-800/40 text-xs text-amber-700 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
      >
        Archive
      </button>
    </m.div>
  )}
</AnimatePresence>
```

This requires a new `actionTrayId` state (replaces the current behaviour of `editingHabit` for displaying the action step). Note: `closeAllEditors()` must be updated to also clear `actionTrayId`.

**Why it's bold:** The resting list shows zero action links. The page becomes a clean inventory — eight habit names, nothing competing for attention. The user's first interaction reveals what they can do. This is the most significant change to the page's interaction model. It is also the change with the most visible before/after difference.

**Calma note:** This follows Calma's "controls that only become relevant at a specific state — where their absence is itself informative — may appear contextually." The persistent Edit/Archive links are a case where absence is more informative than presence. The three-dot disclosure indicator (`···`) uses stone-300/stone-600 — present but undemanding, per Calma's resting state principle.

**Mockup:** [View mockup](./mockup-2026-03-14-0840.html#b2-action-tray)

**Effort estimate:** Medium. Requires new `actionTrayId` state, restructures the row render and action area for both habits and moments, and updates `closeAllEditors()`. Logic is not complex but touches both sections.

---

### B3 — Moments as an editable chip grid

**What to change:** Replace the linear Moments list with a chip grid (`flex flex-wrap gap-2`). Each moment renders as a secondary chip — the same pill style used in the check-in form's MomentChip component. Tapping a chip reveals a compact inline edit form directly below the chip row (not below a list item). The `+ New` chip (dashed border) lives at the end of the grid.

**Direction — chip grid:**

```tsx
<div className="flex flex-wrap gap-2 pb-1">
  {activeTags.map((t) => (
    <button
      key={t.id}
      type="button"
      onClick={() => toggleTagTray(t.id)}
      className={`min-h-[44px] inline-flex items-center rounded-full px-4 text-sm transition-colors ${
        actionTrayId === t.id
          ? "border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300"
          : "border border-stone-200 dark:border-stone-700 bg-transparent text-stone-500 dark:text-stone-400"
      }`}
    >
      {t.label}
    </button>
  ))}
  {!addingTag && (
    <button
      type="button"
      onClick={() => { closeAllEditors(); setAddingTag(true); }}
      className="min-h-[44px] inline-flex items-center rounded-full px-4 text-sm border border-dashed border-stone-300 dark:border-stone-600 text-stone-500 dark:text-stone-500 transition-colors hover:border-stone-400 dark:hover:border-stone-500"
    >
      + New
    </button>
  )}
</div>
```

The inline edit/add forms stay as-is (same `INLINE_FORM` card pattern), just repositioned below the chip grid rather than inline in a list.

**Why it's bold:** It visually differentiates Habits (structured rows) from Moments (informal chips). This matches the check-in experience — where moments are chips and habits are rows — and creates two visually distinct sections on the Manage page that communicate the difference in kind between the two types. The page teaches its own mental model.

**Calma note:** The chip style directly applies Calma's pill shape (`rounded-full`) and the secondary chip color tokens. No new patterns introduced — this uses an existing component pattern in a new context.

**Mockup:** [View mockup](./mockup-2026-03-14-0840.html#b3-chip-grid)

**Effort estimate:** Low–Medium. The Moments section JSX replaces a `<div className="space-y-0.5">` list with a chip grid. The edit/add form animation stays the same. The main work is the chip tap interaction and the tray below the grid.

---

### B4 — Joy-by-default as an amber pill tag (inline in resting row)

**What to change:** Replace the current joy-by-default indicator — the second-line text button with verbose copy — with a small amber pill tag that sits inline with the habit label in the resting row. Active: `rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-400 text-xs px-2` with a `✿ Joyful` label. Inactive: no tag shown. Toggling moves to the action tray (B2 proposal): the tray gets a third button — `✿ Joyful` — neutral border when off, amber fill when on. One label for both states; the visual styling carries the toggle.

**Direction — resting row with active joy tag:**

```tsx
<div className="flex items-center gap-2 min-w-0">
  <span className="text-sm text-stone-700 dark:text-stone-300">{h.label}</span>
  {h.type === "boolean" && h.joyByDefault && (
    <span className="rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5 leading-none shrink-0">
      ✿ Joyful
    </span>
  )}
</div>
```

**Direction — action tray with joy toggle:**

```tsx
<button
  type="button"
  onClick={() => { toggleJoyByDefault(h.id); }}
  className={`inline-flex items-center min-h-[44px] px-3 rounded-xl border text-xs transition-colors ${
    h.joyByDefault
      ? "border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
      : "border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
  }`}
>
  ✿ Joyful
</button>
```

**Why it's bold:** The resting row becomes even cleaner — the only joy indicator is a small amber `✿ Joyful` pill beside the label. No instructional text, no second line. It reads like a quality tag on a notebook entry — present, warm, undemanding. Moving the toggle into the action tray integrates the joy action into the same interaction pattern as Edit and Archive.

**Calma note:** The amber pill uses the exact amber semantic tokens from the Calma spec (`amber-50 / amber-900/20 bg`, `amber-200 / amber-700/40 border`, `amber-700 / amber-400 text`). This follows the "two-state icon" principle where the active state is amber and the inactive state is absent (no indicator at rest). Calma explicitly states "controls that only become relevant at a specific state may appear contextually" — the joy indicator appearing only when active is exactly this.

**Mockup:** [View mockup](./mockup-2026-03-14-0840.html#b4-joy-pill)

**Effort estimate:** Low. The resting row render changes (remove second-line button, add conditional pill), and the action tray (B2) gets a third button. The `toggleJoyByDefault()` function stays the same.

---

## Sprint recommendations

| Priority | Proposal | File | Effort | Rationale |
|---|---|---|---|---|
| 1 | B1 — Section cards + header Add action | `ManageView.tsx` | Low–Med | Sets the structural frame for everything else. Independent of other proposals — can ship alone. Immediate visual improvement. |
| 2 | B2 — Action tray (hide Edit/Archive at rest) | `ManageView.tsx` | Medium | The most impactful single change. Requires B1's section card structure to work well visually. Implement after B1. |
| 3 | B4 — Joy pill in resting row + tray toggle | `ManageView.tsx` | Low | Trivial once B2's action tray exists. The pill tag is one conditional span. |
| 4 | B3 — Moments chip grid | `ManageView.tsx` | Low–Med | Can be implemented independently of B1/B2. But it lands best once the section card structure (B1) is in place. |

All four proposals touch `ManageView.tsx` only. None affect the data model, routing, or other components.

**Note on B2 + B4 state:** The `actionTrayId: string | null` state replaces no existing state — it's additive. `closeAllEditors()` needs one additional line. The current `editingHabit` and `editingTag` states stay as-is.

---

## Open questions

- **Archived items in the card container:** With B1's card structure, archived habits and moments will live inside the same card as active ones. This might make the card feel long if there are many archived items. Consider a separate "Archived" disclosure section at the bottom of each card, collapsed by default, with a `Show archived (n)` toggle. This is out of scope for the current sprint but worth noting.

- **Action tray and inline edit form coexistence (B2):** When the action tray is open and the user taps "Edit label", the tray closes and the inline edit form opens. This is a sequential state change that needs a smooth transition — fade tray out, then reveal form. The current `AnimatePresence` pattern handles both; just ensure `actionTrayId` is cleared before `editingHabit` is set, so both don't render simultaneously.

- **Chip grid and archived moments (B3):** Archived moments currently render in the same list. With a chip grid, archived chips would need a distinct visual treatment — perhaps rendered outside the main chip grid, below a divider. Again, out of scope for this sprint but worth designing before implementation.

- **Touch target for the joy `✿ Joyful` pill (B4):** The pill itself is not a button in the resting state — the whole row is the tap target. The pill is purely visual. This is correct. But verify that the `✿` glyph renders consistently across iOS/Android system fonts — it is a Unicode character (U+273F), not an SVG. If rendering is inconsistent, substitute with `BlossomIcon` at 10px.

---

## Interaction flows

The mockup (`mockup-2026-03-14-0840.html`) contains five interaction flows — Edit label, Add habit, Archive, Joyful, Add moment — that specify how each proposal behaves step-by-step. These were not included in the proposal sections above. They are documented here as spec.

---

### Flow: Edit label

**Steps:** Resting → tap row → action tray opens → tap "Edit label" → inline form pre-filled → save → updated row.

**Step-by-step:**
1. **Resting** — every row shows label (+ joy pill if applicable) + `···` right-side affordance in `text-stone-300 dark:text-stone-600`.
2. **Tap row** — tapped row gets an active highlight: `font-medium text-stone-800 dark:text-stone-100` on the label, `row-active` background wash. Action tray opens in a `tray-card` container (bordered, rounded, muted background) below the row with three bordered pill buttons: **Edit label** (neutral), **Archive** (amber border), **✿ Joyful** (neutral if off, amber fill if on).
3. **Tap "Edit label"** — tray closes; inline form card opens below the row, pre-filled with the current label. Form: label input (focused state), Save button, Cancel link.
4. **Saved** — form collapses; row returns to resting with updated label. `···` affordance visible again.

**Key styling details:**
- Active row: `font-medium` label weight + light background wash (`bg-stone-100 dark:bg-stone-800/60`, inset `rounded-xl -mx-2 px-2`).
- Tray card: `rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-2.5 mt-0.5 mb-1`.
- Tray buttons: `inline-flex items-center min-h-[40px] rounded-xl border px-3 text-xs` — neutral stone border for Edit/Joyful-off, amber border for Archive, amber fill for Joyful-on.

---

### Flow: Add habit

**Steps:** Tap "+ New" in header → type picker form appears inside card above list → choose type → add form with ✿ Joyful toggle → confirm → new row added with amber flash.

**Step-by-step:**
1. **Tap "+ New"** — "+ New" label becomes darker (`text-stone-700 font-medium`) to signal it was pressed.
2. **Type picker** — an `inline-form` card appears above the habit list (inside the section card). Contains: "What kind of habit?" label, "Yes / No" button, "Number" button, Cancel link. Existing rows visible below.
3. **Choose type** — type picker collapses; add form expands. Contains: Label input (auto-focused), **✿ Joyful** bordered pill toggle button (inline in the form, not a separate section), Add button (disabled until label entered), Cancel.
4. **Added** — form collapses; new habit row appears at bottom of list with a brief amber background wash (`rgba(254,243,199,0.35)`) to signal what just changed.

**Key detail:** The **✿ Joyful** toggle lives inside the add form as a `tray-btn-neutral` pill button. Tapping it switches to `tray-btn-amber-filled`. This is a single-tap toggle, no label change — the visual state carries the meaning.

---

### Flow: Archive

**Steps:** Resting → tap row → tray with Archive pressed (amber fills) → row becomes strikethrough + Restore link → tap Restore → row returns.

**Step-by-step:**
1. **Resting** — normal rows with `···`.
2. **Tap row → tap Archive** — Archive button in the tray shows `tray-btn-amber-filled` (pressed state, amber fill) at the moment of confirmation.
3. **Archived state** — row remains visible in the list at its original position with `line-through text-stone-400 dark:text-stone-600` label. Right side shows a `Restore` text link. The section card shows a note below the list: `"Archived. Past entries are preserved."` in `text-xs text-stone-500`.
4. **Restored** — row returns to normal resting state; strikethrough and note disappear.

**Key detail:** Archived items stay in the card, in position, with visual degradation (strikethrough + muted color). They do not move to a separate section. Restore is inline.

---

### Flow: Joyful

**Steps:** Resting (joy off) → tap row → tray shows ✿ Joyful with neutral border (= off) → tap → joy pill appears in resting row → tray re-opened shows ✿ Joyful with amber fill (= on).

**Step-by-step:**
1. **Resting (joy off)** — row shows label only, `···`. No pill.
2. **Tap row** — tray opens. "✿ Joyful" button has `tray-btn-neutral` style (stone border = off).
3. **Tap ✿ Joyful** — tray closes. Row immediately shows amber `✿ Joyful` pill tag beside the label.
4. **Re-open (joy on)** — tap same row again. Tray shows "✿ Joyful" with `tray-btn-amber-filled` (amber fill = on). Tapping again removes the pill.

**Key design principle:** One label — `✿ Joyful` — for both toggle states. The button's border/fill style communicates the current state; no copy change is needed. This was an explicit design decision: "Neutral border = off. Amber fill = on. The visual state carries the meaning — no copy change, no second line."

---

### Flow: Add moment (chip grid)

**Steps:** Grid resting with `+ New` dashed chip → tap chip → selected state + tray below grid → tap "Edit label" → form below grid → add via `+ New` chip.

**Step-by-step:**
1. **Grid resting** — chips in `flex flex-wrap gap-2`. A `+ New` dashed ghost chip (`border-dashed border-stone-300`) sits at the end of the grid.
2. **Tap chip** — tapped chip gets a selected-state outline ring (`outline: 2px solid stone-400, outline-offset: 1px`). A `tray-card` appears **below the entire chip grid** (not replacing the chip). The tray shows the moment name as a `text-xs` label, then two tray buttons: **Edit label** (neutral) and **Archive** (amber border).
3. **Tap "Edit label"** — tray collapses; an `inline-form` card appears below the grid with a pre-filled text input, Save and Cancel. The chip grid remains intact above.
4. **Tap `+ New` dashed chip** — add form appears below the grid: label input, Add button, Cancel.

**Key detail:** The chip grid always stays visually intact. Editing and adding happen in a zone *below* the grid, not within it. The grid is never interrupted.

---

## Design decisions

Resolved after review of the interaction flows mockup (`mockup-2026-03-14-0840.html`):

**Trigger label — `+ New` (confirmed).** The alternative `+ Add` was considered and rejected. "New" is an invitation; "Add" implies administrative work. In the header of a section card, `+ New` avoids redundancy (the section already names what's being created) and fits Calma's understated register. All code direction in this report uses `+ New`.

**Joy copy — `✿ Joyful` (resolved).** The earlier draft copy ("Joy by default", "Mark as joy default", "Remove joy default") read as implementation language — a settings toggle, not a quality of the habit. Replaced with `✿ Joyful` throughout: resting row pill, action tray button. One label for both toggle states; the button's visual style (neutral border = off, amber fill = on) carries the meaning. "Joyful" describes the habit as a quality — it's warm, brief, and non-technical.
