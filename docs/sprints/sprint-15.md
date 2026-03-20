# Sprint 15 — Audit Zero

**Dates:** 2026-03-20 – (TBD)
**Status:** active
**Release:** v2.6.3 (patch — all audit debt closure and polish; no new features)

---

## Goal

Close every remaining open audit finding across colour, typography, interaction, microcopy, and design-overall — leaving zero known debt before the next feature cycle begins. Ship the `+ New` unification in ManageView as the only structural change; everything else is a one-to-five-line fix.

## Business value

Clarity enters its next phase with a fully clean audit record. Each fix closes a concrete inconsistency: copy that undercuts the Calma voice, touch targets below 44 px, WCAG failures on elevated backgrounds, and a pattern divergence in ManageView that would otherwise compound as the screen grows. Closing all 19 previously deferred items in one sprint prevents fragmentation across future sprints.

---

## Tasks

### Task 1 — Text & copy fixes (batch)

**What:** Four text-only changes across SettingsView and CheckInForm. No logic changes.

**Files:** `components/SettingsView.tsx`, `components/CheckInForm.tsx`

**Gotchas / edge cases:** None.

**Implementation notes:**
- SettingsView line 172: `BACKUP` → `Backup` (CSS `uppercase` still renders as ALL CAPS visually)
- SettingsView line 192: `RESTORE` → `Restore` (same)
- SettingsView line 84: `"Something went wrong. Please try again."` → `"That didn't work — try a different file."`
- CheckInForm line 310 (section label h2 content): `By the numbers` → `Numbers`

**Validation steps:**
- [ ] Grep SettingsView.tsx for literal `BACKUP` and `RESTORE` — must return no results in JSX text
- [ ] Grep SettingsView.tsx for `Something went wrong` — must return no results
- [ ] Grep CheckInForm.tsx for `By the numbers` — must return no results
- [ ] Visual check: SettingsView renders "BACKUP" and "RESTORE" section labels as uppercase via CSS

**Definition of done:** All four strings updated; `npm run lint` passes clean.

---

### Task 2 — ManageView "Increment" → "Step"

**What:** Rename the step-size field label from "Increment" to "Step" in ManageView. Two separate JSX subtrees contain this label.

**Files:** `components/ManageView.tsx`

**Gotchas / edge cases:** Two occurrences at different indentation depths — add-habit form (~line 353) and inline edit form (~line 498). `replace_all` must catch both. **Mandatory grep after the edit to confirm zero remaining instances** (per CLAUDE.md).

**Implementation notes:**
- Use `replace_all` to change `Increment` → `Step` in the FIELD_LABEL context
- After edit: grep ManageView.tsx for literal `Increment` — must return zero results

**Validation steps:**
- [ ] Grep ManageView.tsx for `Increment` — zero results
- [ ] Add-habit form shows "Step" label
- [ ] Inline edit form shows "Step" label

**Definition of done:** "Step" in both subtrees; `npm run lint` passes.

---

### Task 3 — ManageView h1 "Manage" → "Habits & Moments"

**What:** Rename the page `<h1>` from "Manage" to "Habits & Moments". The Settings nav card ("Habits and moments") is a separate string and must not change.

**Files:** `components/ManageView.tsx`

**Gotchas / edge cases:** Only the `<h1>` at line 239 changes. The SettingsView.tsx nav card at ~line 149 reads "Habits and moments" and is a separate string — confirm it is untouched after this edit.

**Implementation notes:**
- ManageView line 239: `Manage` → `Habits &amp; Moments` (JSX entity escape for `&` — avoids `react/no-unescaped-entities` lint error)
- After edit: grep SettingsView.tsx for `Habits and moments` — must still return one result (the nav card is unchanged)

**Validation steps:**
- [ ] ManageView renders "HABITS & MOMENTS" heading (uppercase via CSS)
- [ ] Grep SettingsView.tsx for `Habits and moments` — one result confirms nav card unchanged
- [ ] `npm run lint` passes (no unescaped entity error)

**Definition of done:** ManageView h1 updated; Settings nav card untouched.

---

### Task 4 — WCAG chip fix + Calma spec update (atomic commit)

**What:** The Calma spec still documents the moment chip active-edit state as `stone-400 text`. Code at ManageView line 628 currently reads `text-stone-600 dark:text-stone-600` — the light-mode WCAG fix appears already applied. Verify the code state, then update the spec to match.

**Files:** `components/ManageView.tsx` (verify only), `docs/calma-design-language.md`

**Gotchas / edge cases:** Code and spec update must be in the **same commit** (arch review requirement). If code still shows `text-stone-400` (brief's claim), fix it to `text-stone-600` in the same commit.

**Implementation notes:**
- Read ManageView.tsx line 628: confirm `text-stone-600` is present for light mode (the WCAG fix). If not, change `text-stone-400` → `text-stone-600`.
- Update `docs/calma-design-language.md` line ~188 (`**Chip active-edit state:**`): change `stone-100 background, stone-400 text` → `stone-100 background, stone-600 text`
- This closes the Critical WCAG AA finding on `bg-stone-100` elevated backgrounds (stone-400 = 2.4:1; stone-600 = ~5.6:1).

**Validation steps:**
- [ ] ManageView.tsx line 628: `text-stone-600` present in light-mode class list
- [ ] Calma spec `**Chip active-edit state:**` sentence reads `stone-600 text`
- [ ] Both changes in one commit

**Definition of done:** Code and Calma spec both document the chip active-edit state as stone-600 in light mode.

---

### Task 5 — CheckInForm "How Clarity works" link above Capture

**What:** Move the "How Clarity works" link from below the Capture button (below the fold) to just above it — visible before the user's primary action.

**Files:** `components/CheckInForm.tsx`

**Gotchas / edge cases:** After moving the link above the button, spacing needs a visual check — `pb-28` bottom clearance must still prevent the bottom nav from overlapping; and appropriate bottom margin before Capture is needed. The link is a `<Link>`, not a `<button>`, so no submit risk.

**Implementation notes:**
- Current order (lines ~490–512): Capture button → `{!isEditMode && <div className="mt-6 ..."><Link>How Clarity works</Link></div>}`
- Target order: `{!isEditMode && <div className="mb-4 ..."><Link>How Clarity works</Link></div>}` → Capture button
- Change `mt-6` → `mb-4` on the link wrapper div (margin now references the button below)
- The `{!isEditMode && ...}` guard must be preserved — link not rendered in edit mode

**Validation steps:**
- [ ] "How Clarity works" link appears above the Capture button on Today screen
- [ ] Link is not rendered when `isEditMode` is true (edit a past day — link absent)
- [ ] `pb-28` still prevents bottom nav overlap (visual check on mobile viewport)

**Definition of done:** "How Clarity works" link visible above Capture button; guard preserved.

---

### Task 6 — Typography polish batch

**What:** Three one-line typography fixes: archived disclosure toggles get 44 px touch targets; CalendarHeatmap year row uses `text-xs`; NumberStepper pill button gets explicit `text-sm`.

**Files:** `components/ManageView.tsx`, `components/CalendarHeatmap.tsx`, `components/NumberStepper.tsx`

**Gotchas / edge cases:** ManageView has **two** archived disclosure toggles — line 556 (habits) and line 761 (moments). Both need `min-h-[44px]`.

**Implementation notes:**
- ManageView line 556: add `min-h-[44px]` to the archived habits disclosure button className (currently `flex w-full items-center justify-between text-xs ...`)
- ManageView line 761: add `min-h-[44px]` to the archived moments disclosure button className (same shape)
- CalendarHeatmap line 195: `text-sm` → `text-xs` on the year-row `<span>`
- NumberStepper line 66: add `text-sm` to the pill button className (currently `min-h-[44px] min-w-[44px] px-4 rounded-full ...`)

**Validation steps:**
- [ ] ManageView: both archived disclosure toggles have `min-h-[44px]` (grep ManageView.tsx for the archived toggle button classNames)
- [ ] CalendarHeatmap: year row span has `text-xs`, not `text-sm`
- [ ] NumberStepper: pill button className includes `text-sm`

**Definition of done:** All three typography items patched.

---

### Task 7 — SettingsView spacing & transition polish

**What:** Increase section breathing room from `mb-8` to `mb-10` across all five instances in SettingsView. Add `transition-colors` to the remove-file `✕` button.

**Files:** `components/SettingsView.tsx`

**Gotchas / edge cases:** The `mb-8` change applies to both `<section>` elements **and** the border-top `<div>` separators — mediation confirmed all `mb-8` instances in SettingsView change (lines ~123, 137, 140, 162, 165, 283).

**Implementation notes:**
- Use `replace_all` to change `mb-8` → `mb-10` in SettingsView.tsx
- After edit: grep SettingsView.tsx for `mb-8` — must return zero results
- Line 227: add `transition-colors` to the `<button>` wrapping the `✕` character

**Validation steps:**
- [ ] Grep SettingsView.tsx for `mb-8` — zero results
- [ ] SettingsView sections have visibly increased gap (visual check)
- [ ] Remove-file `✕` button has `transition-colors` class

**Definition of done:** All `mb-8` → `mb-10`; remove-file button has `transition-colors`.

---

### Task 8 — Colour, interaction & motion batch

**What:** Five small colour/interaction fixes and one motion consistency fix across four components.

**Files:** `components/CalendarHeatmap.tsx`, `components/FrequencyList.tsx`, `components/BottomNav.tsx`, `components/ManageView.tsx`

**Gotchas / edge cases:**
- **FrequencyList chevron**: `invisible` keeps the element in layout but hides it visually **and** removes it from the accessibility tree. `opacity-0` keeps it in layout and visually hidden but *preserves* its accessibility tree presence. Inspect the element (FrequencyList.tsx line 148) before committing: if the `<span>` wrapping `<Chevron />` has no `aria-label` or role, `opacity-0` is correct — it resolves any unintended accessibility-tree pollution from `invisible`.
- **ManageView exit easing**: the `transition` prop at top level applies to both enters and exits. To change only exit easing **without** affecting enter easing, add `transition: { ease: "easeIn" }` **inside each `exit` object** rather than changing the top-level `transition: { duration: ..., ease: "easeOut" }`. The top-level ease stays "easeOut" for enters. Affected `m.div` elements: approximately lines 268, 307, 445, 471, 564, 653, 712, 771.

**Implementation notes:**
- CalendarHeatmap line 271: `dark:text-stone-600` → `dark:text-stone-500` on the day-of-week header cells
- CalendarHeatmap line 307: `opacity-25` → `opacity-30` on the `isFilteredOut` conditional class
- FrequencyList line 148: `invisible` → `opacity-0` on the chevron `<span>` (verify no semantic content first)
- BottomNav line 34: add `hover:text-stone-700 dark:hover:text-stone-200` to the inactive tab className (the `transition-colors` is already present)
- ManageView: for each exit object on animated `m.div` elements, add `transition: { ease: "easeIn" }` inside the `exit` prop — keep top-level `transition: { duration: ..., ease: "easeOut" }` unchanged

**Validation steps:**
- [ ] CalendarHeatmap: day-of-week header cells use `dark:text-stone-500`
- [ ] CalendarHeatmap: grep for `opacity-25` in CalendarHeatmap.tsx — zero results
- [ ] FrequencyList: chevron span uses `opacity-0` (not `invisible`)
- [ ] BottomNav: inactive tab className includes a hover colour class
- [ ] ManageView: each `exit` object includes `transition: { ease: "easeIn" }`; top-level `transition` still has `ease: "easeOut"`

**Definition of done:** All five class changes applied; ManageView exit animations use ease-in.

---

### Task 9 — HelpView header alignment

**What:** Align the HelpView header with other pages: `items-start` → `items-center`. Remove the `mt-2` offset from the back-link (offset only existed to compensate for `items-start` layout).

**Files:** `components/HelpView.tsx`

**Gotchas / edge cases:** Both changes are a unit — applying `items-center` without removing `mt-2` would push the back-link below centre. Confirmed in arch review.

**Implementation notes:**
- HelpView line 17: `flex items-start justify-between` → `flex items-center justify-between`
- HelpView line 23: remove `mt-2` from the back-link className
- The "Design language" link at the bottom retains its trailing `›` — no change required (mediation resolved this as a documented exception for external links)

**Validation steps:**
- [ ] HelpView header: title and back-link are vertically centred
- [ ] Back-link className does not contain `mt-2`
- [ ] `›` on the Design language link is unchanged

**Definition of done:** HelpView header centre-aligned; `mt-2` removed from back-link.

---

### Task 10 — ManageView `+ New` unification

**What:** Move the Moments `+ New` trigger from inside the chip grid (chip-style button) to the section header row (text-button style), matching the Habits section pattern. The add-moment form also moves before the chip grid.

**Files:** `components/ManageView.tsx`

**Gotchas / edge cases:**
- The `{!addingTag}` guard moves from the chip button to the header button — the chip-style `+ New` is **removed entirely** from the grid (lines 636–644).
- The add-moment `AnimatePresence` form (currently at ~line 710, after the chip grid) moves to **before** the chip grid to match the Habits pattern.
- Form margin changes from `mt-3`/`marginTop` to `mb-3`/`marginBottom` now that it precedes the grid.
- `closeAllEditors()` must continue to close both `addingTag` and `editingMomentId`.
- ManageView is at ~803 lines — keep scope strictly to the Moments section; do not touch the Habits section.

**Implementation notes:**

**Step A — Update the Moments section header** (lines 606–610):

Change:
```jsx
<div className="mb-4">
  <h2 className="text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500">
    Moments
  </h2>
</div>
```
To:
```jsx
<div className="mb-4 flex items-center justify-between">
  <h2 className="text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500">
    Moments
  </h2>
  {!addingTag && (
    <button
      type="button"
      onClick={() => { closeAllEditors(); setAddingTag(true); }}
      className="flex min-h-[44px] items-center text-xs text-stone-500 dark:text-stone-400 transition-colors hover:text-stone-700 dark:hover:text-stone-200"
    >
      + New
    </button>
  )}
</div>
```

**Step B — Move the add-moment form before the chip grid.** After the header div, insert:
```jsx
{/* Add moment form — rendered above the chip grid */}
<AnimatePresence initial={false}>
  {addingTag && (
    <m.div
      className={`mb-3 ${INLINE_FORM_SHELL}`}
      initial={{ height: 0, opacity: 0, marginBottom: 0 }}
      animate={{ height: "auto", opacity: 1, marginBottom: 12 }}
      exit={{ height: 0, opacity: 0, marginBottom: 0, transition: { ease: "easeIn" } }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ overflow: "hidden" }}
    >
      <div className="px-4 py-4 space-y-3">
        {/* ...copy form contents from old position unchanged... */}
      </div>
    </m.div>
  )}
</AnimatePresence>
```

**Step C** — Remove the old add-moment form block (~lines 709–754) — the `AnimatePresence` wrapping `{addingTag && ...}` that sits after the chip grid.

**Step D** — Remove the `{!addingTag && <button...+ New...>}` chip from inside the chip grid (lines 636–644).

**Interaction contract:**
- Open state (`addingTag = true`): `+ New` header button hidden; add-moment form visible above chip grid; chip grid visible below
- Closed state (`addingTag = false`): `+ New` header button visible; add-moment form hidden; chip grid visible
- Mutual exclusion: `closeAllEditors()` governs both `addingTag` and `editingMomentId`; tapping `+ New` closes any open chip edit form
- Animation: height reveal via `INLINE_FORM_SHELL` — `m.div` carries border/bg only; all `px-*/py-*` padding on inner `div`; exit uses ease-in per CLAUDE.md

**Validation steps:**
- [ ] Moments section header has `flex items-center justify-between` (matching Habits)
- [ ] `+ New` button hidden when add form is open; visible when closed
- [ ] Add-moment form appears above the chip grid (not below it)
- [ ] Grep ManageView.tsx for `min-h-[44px] flex items-center rounded-full border` in the Moments section — old chip-style `+ New` must be gone
- [ ] `closeAllEditors()` closes the add form when another chip is tapped
- [ ] Animated `m.div` has no `px-*/py-*` — padding on inner div only (INLINE_FORM_SHELL)
- [ ] No height jump on enter; exit animates smoothly (visual QA)
- [ ] `npm run lint && npm test && npm run build` passes

**Definition of done:** Moments `+ New` is in the header row; form renders before chip grid; chip-style `+ New` removed from grid.

---

### Task 11 — Microcopy batch

**What:** Three copy softening items: ManageView type-picker intro, ManageView "Start at" helper text, and two CheckInForm validation messages.

**Files:** `components/ManageView.tsx`, `components/CheckInForm.tsx`

**Gotchas / edge cases:** Type-picker intro (`"What kind of habit?"`) at ManageView line 277 appears once only — no `replace_all` risk. Read CheckInForm.tsx lines 185–205 to locate the exact current validation strings before editing.

**Implementation notes:**
- ManageView line 277: `"What kind of habit?"` → `"Choose a type."` (shorter, less transactional)
- ManageView "Start at" field (~line 353 and ~line 498, in both subtrees): add helper text immediately below the input:
  ```jsx
  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">First tap jumps here; further taps add one step.</p>
  ```
- CheckInForm: locate `"Please enter a name."` validation message and soften (e.g. `"A name helps you recognise this later."`)
- CheckInForm: locate `"A moment with that name already exists."` and soften (e.g. `"You already have a moment with that name."`)

**Validation steps:**
- [ ] ManageView type-picker no longer shows "What kind of habit?"
- [ ] "Start at" field has visible helper text in both add and edit subtrees
- [ ] CheckInForm validation messages use softer copy (trigger both: empty name, duplicate name)

**Definition of done:** All three microcopy items updated; `npm run lint` passes.

---

### Task 12 — Calma spec docs + verify-and-close

**What:** Two documentation additions to the Calma spec. Two verify-and-close audit items (no code change expected).

**Files:** `docs/calma-design-language.md`, `components/DayDetail.tsx` (read-only), `components/CheckInForm.tsx` (read-only)

**Gotchas / edge cases:** Calma spec changes are docs-only. The verify items require reading the files but are expected to close without code changes.

**Implementation notes:**

**Calma spec — two-step hover jump:** Add a note in the Interaction Patterns section:
> Nav links (`stone-600` at rest → `stone-800` on hover) use a deliberate two-step jump rather than a smooth `stone-700` intermediate. This provides clear affordance at hover without adding weight at rest. This is a documented pattern, not a contrast inconsistency.

**Calma spec — HelpView `›` exception:** Add a note near the Navigation section:
> The "Design language" link in HelpView deliberately uses a trailing `›` (not the back-link `←` convention). The link opens an external URL in a new tab; `←` implies back-navigation within the app. `›` is semantically correct for an outbound link. This is a deliberate exception to the back-link convention.

**DayDetail numeric `font-medium` — verify:** Read DayDetail.tsx and locate numeric habit value rendering. The finding was accepted as borderline acceptable — confirm current state and close (no code change expected).

**CheckInForm Joy section `initial={false}` — verify:** Grep CheckInForm.tsx for `initial={false}`. Per CLAUDE.md, child `m.*` inside `AnimatePresence` must not use `initial={false}`. If found in the Joy section, remove it and add `initial={{ height: 0, opacity: 0 }}`. Expected: not present.

**Validation steps:**
- [ ] Calma spec: two-step hover jump documented
- [ ] Calma spec: HelpView `›` exception documented
- [ ] DayDetail numeric `font-medium` finding confirmed closed (no WCAG failure, no code change)
- [ ] Grep CheckInForm.tsx for `initial={false}` — zero results, or fixed if found

**Definition of done:** Both spec additions written; both verify items explicitly closed.

---

## Definition of done — Sprint

- [ ] All tasks above are complete and validated
- [ ] `npm run lint && npm test && npm run build` passes clean
- [ ] Tested manually on mobile viewport in both light and dark mode
- [ ] No regressions on existing features (check Today, History, Settings, Manage, Edit, Help)
- [ ] Zero open audit findings across colour, typography, interaction, microcopy, and design-overall
- [ ] Ready for `/deploy`

---

## Retrospective

<!-- To be filled in after the sprint using /sprint-retro -->
