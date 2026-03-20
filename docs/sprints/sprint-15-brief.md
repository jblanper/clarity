# Sprint 15 Brief

**Status:** finalized
**Created:** 2026-03-20

---

## Goals & Business Value

Close every remaining open audit finding — critical, high, medium, and all 19 previously deferred low/medium items — so Clarity enters the next feature cycle with zero known debt. Ship the already-committed calendar legend refinement and skills workflow refactor as part of this release. Most tasks are one-to-five-line fixes; the one substantive change is unifying the `+ New` pattern in ManageView so Habits and Moments share the same header-row placement.

## Proposed scope

**Deploy-only (already committed):**
- Calendar legend refinement (`1a16953` — labels styled as their own encoding)
- Skills workflow refactor (`3c4397e` — sprint-pre-flight merged into sprint-brief)

**Critical:**
- ManageView moment chip editing state: `text-stone-400` → `text-stone-600` on `bg-stone-100` (WCAG AA, ManageView.tsx:628)

**High:**
- SettingsView BACKUP/RESTORE literal ALL CAPS in JSX: change source text to `Backup` / `Restore` (CSS `uppercase` handles the visual; SettingsView.tsx:172,192)
- CheckInForm "How Clarity works" link: move above the Capture button so it is visible before the primary action

**Medium:**
- SettingsView generic error copy: `"Something went wrong. Please try again."` → `"That didn't work — try a different file."` (SettingsView.tsx:84)
- ManageView field label: `"Increment"` → `"Step"` (ManageView.tsx:353)
- CheckInForm section label: `"By the numbers"` → `"Numbers"`
- ManageView page title: `"Manage"` → `"Habits & Moments"` (h1 only; Settings nav card unchanged)

**Deferred — colour:**
- CalendarHeatmap day-of-week header: `dark:text-stone-600` → `dark:text-stone-500`

**Deferred — typography:**
- ManageView archived disclosure toggles: add `min-h-[44px]` touch target (ManageView.tsx:406,677)
- CalendarHeatmap year row: `text-sm` → `text-xs`
- SettingsView section spacing: `mb-8` → `mb-10`
- DayDetail numeric habit value `font-medium`: verify-and-close (audit accepted as borderline acceptable — no code change)
- NumberStepper.tsx:66 pill button value: add explicit `text-sm`

**Deferred — interaction:**
- CalendarHeatmap filtered/future cells: `opacity-25` → `opacity-30`
- FrequencyList layout-spacing chevron: `invisible` → `opacity-0` (removes from accessibility tree)
- BottomNav inactive tabs: add hover colour to match the `transition-colors` already present
- SettingsView:227 remove-file `✕` button: add `transition-colors`
- ManageView exit animations: replace explicit `easeIn` with framework default easing
- Two-step hover jump (`stone-600 → stone-800`) on nav links: add to Calma spec as a documented decision (docs only, no code change)

**Deferred — microcopy:**
- ManageView `Start at` field: add helper text explaining the first-tap jump concept
- CheckInForm:191 validation: `"Please enter a name."` → softer register
- CheckInForm:198 validation: `"A moment with that name already exists."` → softer register
- ManageView:277 type-picker intro: `"What kind of habit?"` → less transactional phrasing

**Deferred — design-overall:**
- ManageView `+ New` unification: move Moments `+ New` out of the chip grid into the section header row, matching the Habits pattern (Option A)
- HelpView header alignment: `items-start` → `items-center` to match History and Manage
- HelpView arrow convention: trailing `›` on "Design language" link → leading `←` to match all other back-links

## Out of scope

- NumberStepper keyboard navigation (`onKeyDown` arrow-key increment/decrement) — not appropriate for a mobile-first app; **dropped from audits permanently**
- NumberStepper `aria-valuemax` — dropped alongside keyboard nav per the same decision
- Any new features or non-debt work

## Audits to run

colour, typography, interaction, microcopy, arch

## Open questions

- ManageView `+ New` header unification: confirm the Moments section header gets the same `+ New` inline button style as Habits (not a chip). Arch review should check for `AnimatePresence` / `addingTag` state interactions.
- Calma spec update for two-step hover jump: confirm the exact wording before adding to `docs/calma-design-language.md`.

---

## UX/UI Review

**Reviewed:** 2026-03-20

### Calma fit

The scope is a strong fit for Clarity's identity. Every proposed change reduces friction, corrects inconsistency, or brings copy into register with the Calma voice. No new visual complexity, gamification, or dashboard energy.

**"Manage" → "Habits & Moments"** is the right call — "Manage" is a verb; Calma names pages as destinations. Risk is implementation scope: the `h1` rename must not touch the Settings nav card ("Habits and moments"), which is a separate string at a separate location. The brief already flags this boundary.

**"By the numbers" → "Numbers"** aligns the section label with the single-noun pattern every other label follows. Closes an existing medium finding cleanly.

**"How Clarity works" repositioning** is the most important UX repair in the sprint. The help link is currently below the Capture button, below the fold, essentially invisible after the first session. Moving it above is the correct minimum intervention: quiet and unobtrusive but visible before the user's primary action.

Nothing in the scope risks adding urgency or dashboard energy. The sprint is entirely reduction and correction.

### User flow

No new user-facing flows. All changes are in-place corrections on existing pages.

Notable: the `+ New` unification moves the Moments trigger button from inside the chip grid to the section header row. The `AnimatePresence` block for the add-moment form is unaffected — the form's position (before or after the chip grid) should follow the Habits pattern (form appears before the list). The `{!addingTag && ...}` guard must be removed from the chip grid entirely and placed on the header button only.

CheckInForm link move: the link is an anchor (`<Link>`), not a button, so no submit risk. Spacing needs a visual check — `mt-6` clearance currently sits below the Capture button; above it, appropriate bottom margin before the button is needed.

### Component and pattern reuse

Every fix uses existing patterns. No new components required. The `+ New` header row pattern for Habits (lines 252–263: `flex items-center justify-between`, section label + button) is the exact template for the Moments section header change.

### Interaction and motion

No new Framer Motion patterns. All existing animation logic preserved. The `transition-colors` additions (BottomNav, SettingsView `✕`) are straightforward. `opacity-0` vs `invisible` on the FrequencyList chevron is a semantics fix, not a motion change. ManageView `+ New` unification: the trigger button's position in JSX does not touch the `AnimatePresence` for the add form.

### Audit relevance

All five audits (colour, typography, interaction, microcopy, arch) should run at sprint-validate. A brief design-overall pass should confirm zero known medium findings across all audits for the first time.

### Concerns carried into implementation

- `+ New` unification: `{!addingTag}` conditional must be on the header button only; no chip remnant in the grid
- "Increment" → "Step": two JSX subtrees in ManageView — grep after `replace_all` is mandatory per CLAUDE.md
- ManageView title: Settings nav card ("Habits and moments") is a separate string — confirm no shared constant
- CheckInForm link move: visual QA on `pb-28` bottom clearance and spacing above Capture
- Calma spec two-step hover jump wording: must be agreed before the interaction medium finding can close
- HelpView "Design language" link: outbound external link (`target="_blank"`) — keeping `›` per mediation decision (see below)

---

## Architecture Review

**Reviewed:** 2026-03-20

### Technical feasibility

All single-class/text changes: zero risk. Key non-trivial items:

- **"Increment" → "Step"**: two subtrees in ManageView (add form ~line 353, edit form ~line 498) — silent-miss risk; `replace_all` + mandatory grep
- **CheckInForm link move**: straightforward but `pb-28` clearance needs visual QA after move
- **ManageView exit easing**: brief said "replace explicit `easeIn`" but actual code has `ease: "easeOut"` on exit transitions — fix confirmed as `easeOut` → `easeIn` per CLAUDE.md ("ease-in for exits")
- **ManageView `+ New` unification**: highest structural complexity; reorders Moments section JSX; `INLINE_FORM_SHELL` / padding pattern must be applied to the entering form; `closeAllEditors()` must continue to govern both `addingTag` and `editingMomentId` correctly
- **HelpView `items-start` → `items-center`**: must remove the `mt-2` from the back-link simultaneously (line 22), otherwise fix is incomplete
- **SettingsView `mb-8` → `mb-10`**: applies to both `<section>` elements and the border-top divider `<div>`s (confirmed in mediation)

### Data model impact

None. Every change is display-only. No localStorage keys, type changes, or migration paths.

### Static export constraints

None introduced. All changes are within existing client components.

### Codebase degradation signals

- ManageView at ~803 lines is at the upper boundary of readability; `+ New` unification must not expand scope into the Habits section
- Calma spec / code consistency on the chip WCAG fix: spec and code must be updated atomically (resolved in mediation — both updates in the same commit)
- Joy section `initial={false}`: inner `m.section` carries explicit `initial={{ height: 0, opacity: 0 }}`, which should be correct for conditional mounts. Recommend verify-and-close rather than code change

### Implementation order

1. All single-class/text changes (zero risk, commit-able intermediate states)
2. "Increment" → "Step" — grep to confirm both subtrees
3. ManageView h1 title
4. Chip `text-stone-400` → `text-stone-600` + Calma spec update (same commit)
5. CheckInForm link move (visual QA)
6. Archived toggles `min-h-[44px]`
7. FrequencyList chevron `invisible` → `opacity-0` (inspect element role first)
8. HelpView header `items-start` → `items-center` + remove `mt-2` from back-link
9. ManageView `+ New` unification (dedicated commit, animation QA)
10. ManageView exit easing `easeOut` → `easeIn`
11. SettingsView `mb-8` → `mb-10`

### Concerns carried into implementation

- Chip WCAG fix and Calma spec update must be one atomic commit (resolved in mediation)
- ManageView `+ New` form position: before the chip grid, matching the Habits pattern (confirmed in mediation)
- Joy section `initial={false}`: verify-and-close at validate
- FrequencyList chevron: inspect element role/content before committing `opacity-0` change

---

## Parallel Review Mediation

**Reviewed:** 2026-03-20

### Conflicts resolved

| Topic | UX position | Arch position | Decision |
|---|---|---|---|
| Chip `text-stone-400` → `text-stone-600` vs. Calma spec | Critical WCAG fix, implement immediately | Spec currently documents `stone-400` as correct; code and spec must change atomically | Implement both in one commit: change the class in ManageView and update the "Chip active-edit state" sentence in `docs/calma-design-language.md` |
| HelpView "Design language" link icon `›` vs `←` | Needs confirmation — link opens new tab, `←` is semantically misleading for outbound navigation | `←` implies back-navigation in this app; `›` is directionally correct for an external link | Keep `›`. Document in the interaction audit that this link is a deliberate exception to the back-link `←` convention because it is an external outbound link |
| ManageView exit animation easing | Cosmetic/code-consistency, no perceptible user difference | Brief said "easeIn" but code has "easeOut"; CLAUDE.md requires ease-in for exits | Fix is `ease: "easeOut"` → `ease: "easeIn"` on ManageView exit transitions, aligning with CLAUDE.md |
| SettingsView `mb-8` → `mb-10` scope | Five locations (sections + dividers) | Brief said "section spacing" without distinguishing sections from divider `<div>`s | Apply to both `<section>` elements and the border-top divider `<div>`s — all `mb-8` instances in SettingsView |

### Final scope after review

All items from the proposed scope are confirmed. No additions, no removals. Key implementation notes:

- Chip colour fix and Calma spec update are one atomic commit
- ManageView `+ New` add-moment form renders *before* the chip grid (matching Habits pattern)
- HelpView "Design language" link retains trailing `›`; interaction audit records this as a documented exception
- ManageView exit easing fix targets `ease: "easeOut"` → `ease: "easeIn"` (not key removal)
- SettingsView spacing applies to sections and dividers both
- HelpView `items-start` → `items-center` must also remove `mt-2` from the back-link (line 22)
- Joy section `initial={false}`: verify-and-close at validate, no code change expected
