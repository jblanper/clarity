# Sprint 13 — ManageView & Settings Polish

**Dates:** 2026-03-15 – (TBD)
**Status:** active
**Release:** v2.5.1 (patch — accessibility fixes, interaction polish, no new features)

---

## Goal

Polish and accessibility pass on ManageView and SettingsView — resolving a WCAG AA colour failure, completing the Manage action-tray overhaul (tap affordance, active-row highlight, bordered card tray, pill buttons), fixing Settings copy and touch targets, and adding the archived disclosure and `+ New` chip if capacity allows.

## Business value

Sprint 12 established the structure of both surfaces; Sprint 13 closes the remaining interaction gaps and accessibility violations before they accumulate. The action-tray overhaul turns a bare text-link list into a bordered pill-button card that reads as a discrete action affordance, consistent with the rest of the app. The WCAG AA fix (SegmentedPill inactive text) is a legal and ethical obligation.

---

## Tasks

### Task 1 — S2: SegmentedPill WCAG AA fix

**What:** Inactive-segment text colour `text-stone-500` → `text-stone-600` inside `SegmentedPill`. The control renders on a `bg-stone-100` track; `text-stone-500` on `bg-stone-100` fails WCAG AA (contrast ratio below 4.5:1). `text-stone-600` passes. `dark:text-stone-400` is unchanged (safe as a dark-only variant on `bg-stone-800`).

**Files:** `components/SegmentedPill.tsx`

**Gotchas / edge cases:** Only the inactive branch of the ternary changes. The active branch (`bg-white text-stone-900`) is not touched.

**Implementation notes:**
- Line 25: `text-stone-500 dark:text-stone-400` → `text-stone-600 dark:text-stone-400` in the inactive-segment className.
- Single-character change; no logic changes.

**Validation steps:**
- [ ] Inactive segment text is `text-stone-600` (grep `SegmentedPill.tsx` for `stone-500` — must return no results)
- [ ] Active segment styling unchanged
- [ ] `npm run lint && npm test` passes

**Definition of done:** SegmentedPill inactive text passes WCAG AA in light mode.

---

### Task 2 — Settings: S3/S4/S5/S6

**What:** Four targeted fixes in SettingsView:
- **S3** — "Import" button label → "Restore" (internal names `handleImport`, `importStatus`, `importBackup` unchanged)
- **S4** — "Yes, start fresh" confirmation button: `text-amber-700 dark:text-amber-500` → `text-red-700 dark:text-red-400`; resting "Start fresh" trigger retains amber
- **S5** — Settings back button: add `flex min-h-[44px] items-center` to className (currently lacks touch-target height)
- **S6** — Remove-file ✕ button: add `min-h-[44px] flex items-center` to className

**Files:** `components/SettingsView.tsx`

**Gotchas / edge cases:**
- S3: Only the JSX button text changes — do not rename `handleImport`, `importStatus`, `importBackup`, `resetImport`. The success-state "Import another file" button label is separate; also update it to "Restore another file" for consistency.
- S4: Two `inline-flex min-h-[44px] items-center` buttons exist in the Reset section. Only the "Yes, start fresh" button (`onClick={handleReset}`) gets the red class; "Keep my data" is unchanged.
- S5: The back button is in the `<header>` at the top of the component (line ~112). Its current class begins `mt-2 text-xs uppercase tracking-widest ...`. Prepend `flex min-h-[44px] items-center` and remove the standalone `mt-2` (the `items-center` alignment handles vertical position within the header flex context).
- S6: The ✕ button is inside the `importStatus.kind === "ready"` block. Its current class is `ml-3 flex-shrink-0 text-stone-500 ...`. Add `min-h-[44px] flex items-center` alongside the existing `flex-shrink-0`.

**Implementation notes:**
- Current state (verified from live file):
  - S3 label: line ~237 `Import`
  - S4 "Yes, start fresh" class: `inline-flex min-h-[44px] items-center text-sm text-amber-700 dark:text-amber-500 ...`
  - S5 back button class: `mt-2 text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300`
  - S6 ✕ button class: `ml-3 flex-shrink-0 text-stone-500 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300`
- All four are token/string replacements; no logic changes.
- CLAUDE.md: `text-red-700 dark:text-red-400` is the designated error/destructive colour.

**Validation steps:**
- [ ] Confirm/import button reads "Restore" (not "Import") in the file-ready state
- [ ] Success-state retry button reads "Restore another file"
- [ ] "Yes, start fresh" button has `text-red-700 dark:text-red-400`; resting "Start fresh" button still has amber classes
- [ ] Back button has `min-h-[44px]` and `flex items-center`
- [ ] ✕ remove-file button has `min-h-[44px]` and `flex items-center`
- [ ] `npm run lint && npm test` passes

**Definition of done:** All four Settings fixes applied; no amber on the destructive confirm; all touch targets meet 44 px minimum.

---

### Task 3 — ManageView: M6 / M1 / M2 / L4 — Resting habit row

**What:** Four changes to the habit row tap button in ManageView (active habits only):
- **M6** — Add `aria-expanded={actionTrayId === h.id}` to the row button
- **M1** — Add a `···` affordance right-aligned at the trailing edge; it must trail the Joy pill when present
- **M2** — When tray is open: apply `bg-stone-50 dark:bg-stone-800/50` wash on the row button and `font-medium text-stone-800 dark:text-stone-100` on the label span (not amber — amber is semantically reserved for joy in this component)
- **L4** — Add `transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50` to the row button's resting className (visual hover; lighter than the M2 active state which additionally changes font weight)

**Files:** `components/ManageView.tsx`

**Gotchas / edge cases:**
- M2 visual distinction from L4: hover (L4) and active-state bg (M2) use the same token. The visual distinction comes from M2 also applying `font-medium text-stone-800` to the label — this is intentional, as specified in the brief.
- `···` must stay at trailing edge even when Joy pill is present. Use `ml-auto` on the `···` span (or add `flex-1` to the label/left group). Do not use a separate absolute-positioned element.
- Archived habit rows do not receive these changes — they are rendered as static `<div>` rows, not buttons.

**Implementation notes:**
- Current row button class: `"flex w-full min-h-[44px] items-center gap-2 py-3 text-left"` (line ~263).
- Updated button:
  ```tsx
  <button
    type="button"
    aria-expanded={actionTrayId === h.id}
    onClick={...}
    className={`flex w-full min-h-[44px] items-center gap-2 py-3 text-left transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl -mx-1 px-1 ${
      actionTrayId === h.id ? "bg-stone-50 dark:bg-stone-800/50" : ""
    }`}
  >
  ```
  Note: add slight `rounded-xl -mx-1 px-1` so the bg wash is visually bounded to the row without layout shift. Adjust as needed to match the card's internal padding.
- Label span — conditional font weight:
  ```tsx
  <span className={`text-sm ${actionTrayId === h.id ? "font-medium text-stone-800 dark:text-stone-100" : "text-stone-700 dark:text-stone-300"}`}>
    {h.label}
  </span>
  ```
- `···` affordance after the joy pill:
  ```tsx
  <span className="ml-auto text-stone-400 dark:text-stone-600 text-xs leading-none select-none">···</span>
  ```
  The `···` uses `text-stone-400 dark:text-stone-600` (not foreground text — purely decorative chrome, not conveying state). In dark mode the stone-600 value is appropriate as a purely visual chrome element (not failing WCAG because it is a non-text decorative affordance).

**Validation steps:**
- [ ] Each active habit row has a `···` at the trailing edge, including rows without Joy pill
- [ ] Tapping a row: label becomes `font-medium text-stone-800 dark:text-stone-100`; bg wash appears
- [ ] Hovering a row (desktop): subtle stone wash; visually lighter than active state
- [ ] `aria-expanded="true"` when tray is open; `"false"` when closed
- [ ] Archived rows are unchanged
- [ ] `npm run lint && npm test` passes

**Definition of done:** Resting rows show `···` affordance; active row is visually distinguished by font weight + bg wash; `aria-expanded` is correct.

---

### Task 4 — ManageView: M3 / M4 / M5 — Action tray card + pill buttons

*Depends on Task 3 (action tray is the AnimatePresence block rendered per row).*

**What:**
- **M3** — Render action tray as a bordered rounded card; fix exit-snap by animating `paddingTop: 0` alongside existing `paddingBottom: 0` and new `marginBottom: 0`
- **M4** — New style constants for tray buttons: amber-bordered pill for Archive; new dedicated Joy button states (not repurposing `ACTION_BTN`/`ARCHIVE_BTN`, which are also used for Restore buttons on archived rows)
- **M5** — Joy button: single-label `<BlossomIcon size={14} filled={h.joyByDefault} /> Joy`; neutral bordered at rest; amber fill when `joyByDefault: true`

**Files:** `components/ManageView.tsx`

**Gotchas / edge cases:**
- M3 exit-snap: The card now has `py-3` (top + bottom padding). `exit={{ height: 0, opacity: 0, paddingBottom: 0 }}` is insufficient — CLAUDE.md: "`height: 0` does not collapse `py-*` padding". Must also animate `paddingTop: 0` and `marginBottom: 0` in `exit`.
- M4: `ACTION_BTN` and `ARCHIVE_BTN` are still used for Restore and Edit buttons on archived rows. Do not modify or repurpose those constants — add new ones (`TRAY_ARCHIVE_BTN`, `TRAY_JOY_BTN`, `TRAY_JOY_ON_BTN`).
- M5: No two-label variant ("Mark joy"/"Unmark joy"). Always reads "Joy". State is conveyed by fill/border style, not text.
- Edit button in the tray stays as `ACTION_BTN` (it is an active-only action, so no conflict with archived-row reuse).

**Implementation notes:**
- Add three new style constants near the existing ones:
  ```ts
  const TRAY_ARCHIVE_BTN =
    "inline-flex items-center rounded-full border border-amber-300 dark:border-amber-700/50 px-3 py-1.5 text-xs text-amber-700 dark:text-amber-400 transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/20";

  const TRAY_JOY_BTN =
    "inline-flex items-center gap-1 rounded-full border border-stone-200 dark:border-stone-700 px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50";

  const TRAY_JOY_ON_BTN =
    "inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700/50 px-3 py-1.5 text-xs text-amber-700 dark:text-amber-400 transition-colors hover:bg-amber-200 dark:hover:bg-amber-900/50";
  ```
- Update the action tray `m.div`:
  ```tsx
  <m.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0 }}
    transition={{ duration: 0.22, ease: "easeOut" }}
    style={{ overflow: "hidden" }}
    className="mb-2 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 px-4 py-3 flex gap-3 flex-wrap"
  >
    <button type="button" onClick={() => startEditHabit(h)} className={ACTION_BTN}>Edit</button>
    <button type="button" onClick={() => archiveHabit(h.id)} className={TRAY_ARCHIVE_BTN}>Archive</button>
    {h.type === "boolean" && (
      <button
        type="button"
        onClick={() => toggleJoyByDefault(h.id)}
        className={h.joyByDefault ? TRAY_JOY_ON_BTN : TRAY_JOY_BTN}
      >
        <BlossomIcon filled={h.joyByDefault} size={14} />
        Joy
      </button>
    )}
  </m.div>
  ```
- `ACTION_BTN` is retained for the Edit button in the tray (it is an active-habit action and is not shared with archived-row Restore buttons). This is intentional.

**Validation steps:**
- [ ] Open a tray: action tray appears as a rounded bordered card, not bare links
- [ ] Archive button is amber-bordered pill
- [ ] Joy button at rest: neutral bordered; when `joyByDefault: true`: amber-filled pill
- [ ] Joy button always reads "Joy" (single label + icon) regardless of state
- [ ] Close the tray: no snap — element collapses smoothly to zero height (test a row with `py-3` padding)
- [ ] `ACTION_BTN`/`ARCHIVE_BTN` constants still used on archived-row Restore buttons — not changed
- [ ] `npm run lint && npm test` passes

**Definition of done:** Action tray is a bordered card with pill buttons; exit animation is snap-free; Joy is a single-label pill with amber fill when active.

---

### Task 5 — ManageView: L1 / L2 — `+ New` chip and archived disclosure

**What:**
- **L1** — Move the `+ New` trigger for Moments into the chip grid itself as a chip; remove the header-row `+ New` button from the Moments section (the Habits header `+ New` is separate and not changed)
- **L2** — Collapse archived habits and archived moments behind a disclosure: "Archived (n)" toggle button at card bottom; rotating chevron; height-reveal body; auto-expands when an item is archived

**Files:** `components/ManageView.tsx`

**Gotchas / edge cases:**
- L1: The Habits section header `+ New` button (`onClick={() => { closeAllEditors(); setAddHabit({ stage: "type" }); }}`) is unchanged — only the Moments section header button is replaced by the chip.
- L2: Two separate disclosure states needed — one for habits, one for moments. Use `archivedHabitsOpen` and `archivedMomentsOpen` booleans in component state.
- L2 auto-expand on archive: `archiveHabit` sets `justArchivedId`; after that, `archivedHabitsOpen` should be set to `true`. Same pattern for `archiveMoment` / `archivedMomentsOpen`.
- L2: The disclosure body uses a height-reveal animation consistent with ManageView's existing `height: 0 → "auto"` pattern. Exit must animate `paddingTop: 0` if the body wrapper has top padding.
- L2: Rotating chevron — same pattern as FrequencyList: a `Chevron` component wrapped in a `transition-transform` `<span>` with `rotate-180` applied when open. Do NOT use `translate-x-*` (can fail in Tailwind v4, per CLAUDE.md).
- L2: `closeAllEditors()` does not reset the disclosure states — they are UI preferences, not editor exclusivity state. Do not add them to `closeAllEditors`.

**Implementation notes:**

**L1 — `+ New` chip in moments grid:**
- Remove the `+ New` header button from the Moments `<div className="mb-4 flex items-center justify-between">` block (keep the `<h2>` heading; remove only the button).
- Add a chip at the end of the active-tags chip grid:
  ```tsx
  <button
    type="button"
    onClick={() => { closeAllEditors(); setAddingTag(true); }}
    className="min-h-[44px] flex items-center rounded-full border border-stone-200 dark:border-stone-700 px-4 py-2 text-xs text-stone-500 dark:text-stone-500 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800"
  >
    + New
  </button>
  ```
  Render this chip only when `editingMomentId` is null (hide while a chip is in edit mode to avoid layout conflict).

**L2 — Archived disclosure:**
- Add state:
  ```ts
  const [archivedHabitsOpen, setArchivedHabitsOpen] = useState(false);
  const [archivedMomentsOpen, setArchivedMomentsOpen] = useState(false);
  ```
- In `archiveHabit`: after `applyConfigs(...)`, add `setArchivedHabitsOpen(true)`.
- In `archiveMoment`: after `applyConfigs(...)`, add `setArchivedMomentsOpen(true)`.
- Habits disclosure toggle (render only when `archivedHabits.length > 0`), placed after the active habits + inline forms, before the closing tag of the card:
  ```tsx
  {archivedHabits.length > 0 && (
    <div className="mt-2 border-t border-stone-100 dark:border-stone-800 pt-2">
      <button
        type="button"
        onClick={() => setArchivedHabitsOpen((v) => !v)}
        className="flex w-full items-center justify-between text-xs text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors py-1"
      >
        <span>Archived ({archivedHabits.length})</span>
        <span className={`transition-transform duration-200 ${archivedHabitsOpen ? "rotate-180" : ""}`}>
          <Chevron direction="down" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {archivedHabitsOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="space-y-0.5 pt-1">
              {archivedHabits.map((h) => (/* existing archived row JSX */))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )}
  ```
- Apply the same pattern to the Moments card for archived moments (`archivedMomentsOpen`).
- `Chevron` component must support a `"down"` direction — check `components/Chevron.tsx`; if only `"left"/"right"` exist, use CSS rotation: `<span style={{ display: "inline-block", transform: archivedHabitsOpen ? "rotate(-90deg)" : "rotate(90deg)" }}>` using the right-pointing chevron, or use `direction="right"` with a wrapping `rotate-90` span.

**Validation steps:**
- [ ] Moments section: no `+ New` button in header row; chip grid has a `+ New` chip at the end; chip grid `+ New` triggers the add-moment form
- [ ] Habits header `+ New` is unchanged
- [ ] Archived habits and moments are hidden behind the disclosure by default
- [ ] "Archived (n)" count is accurate
- [ ] Chevron rotates 180° when open
- [ ] Tapping Archive on an active item: disclosure auto-opens; the archived confirmation note is visible
- [ ] Height reveal animates smoothly open and closed
- [ ] `closeAllEditors()` does not affect disclosure open/close state
- [ ] `npm run lint && npm test` passes

**Definition of done:** `+ New` chip lives in the moments chip grid; archived items are collapsed by default and auto-expand on archive.

---

## Definition of done — Sprint

- [ ] All tasks above are complete and validated
- [ ] `npm run lint && npm test && npm run build` passes clean
- [ ] Tested manually on mobile viewport in both light and dark mode
- [ ] No regressions on existing features (check Today, History, Settings, Manage, Edit)
- [ ] Ready for `/deploy`

---

## Retrospective

<!-- To be filled in after the sprint using /sprint-retro -->
