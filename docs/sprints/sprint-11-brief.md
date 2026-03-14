# Sprint 11 Brief

**Status:** finalized
**Created:** 2026-03-14

---

## Goals & Business Value

Sprint 11 completes the amber language system across the check-in and history surfaces. The MomentChip, DayDetail moment chips, and habit completion indicator all currently use stone-grey for selected/done states — directly contradicting the warm amber language established by HabitToggle and NumberStepper in Sprint 9. This sprint closes that gap, adds a Highlights section to DayDetail so joy-marked habits surface meaningfully in the historical record, and resolves a UX conflict in HistoryView where the Frequency section appears before the empty-state message when no entries exist. All changes are UI-only: no data model changes, no new routes.

## Proposed scope

### CheckInForm / MomentChip
- **P1 — MomentChip amber selected state** (`MomentChip.tsx`): Replace stone-fill selected state (`bg-stone-500 text-white` / `bg-stone-300 text-stone-900`) with amber treatment: `bg-amber-50 border-amber-300 text-amber-800` / `dark:bg-amber-900/20 dark:border-amber-700/40 dark:text-amber-300`. Also remove `dark:bg-stone-800` from the unselected dark state (transparent background at rest is cleaner).
- **P3 — Add-moment input height** (`CheckInForm.tsx`): Add `min-h-[44px]` to the inline add-moment text input — brings it to 44px touch target compliance and matches the Add button height, resolving the size mismatch in the row.
- **P4 — Reflection textarea border** (`CheckInForm.tsx`): Soften `border-stone-300` → `border-stone-200` in light mode, bringing the textarea into Calma "Card, input" border spec. Dark mode (`dark:border-stone-700`) unchanged.
- **"Capture" idle label** (`CheckInForm.tsx`): Change the Save button idle label from `"Save"` to `"Capture"`, so the three-state progression reads `"Capture" → "Capturing…" → "Day captured"` — same root word throughout, more human and analog in register.

### DayDetail
- **P1 — Amber moment chips** (`DayDetail.tsx`): Replace static stone-filled moment chip spans (`bg-stone-500 text-white` / `bg-stone-300`) with amber read-only display: `bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-700/40 dark:text-amber-300`. These are read-only — no cursor-pointer, no hover, no press handler. Use slightly tighter padding (`px-3 py-1.5`) vs. interactive chips.
- **P2 — Amber habit checkmark** (`DayDetail.tsx`): Change the done-habit `✓` glyph from `text-stone-500 dark:text-stone-500` to `text-amber-500 dark:text-amber-400`. Closes the amber-for-completion language gap in the historical view.
- **P3 — Highlights section** (`DayDetail.tsx`): When at least one checked habit has `joy: true`, render a "Highlights" section using the same amber panel card token used in CheckInForm (`bg-amber-50 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-900/30 rounded-2xl`). Lists joy-marked habits with `BlossomIcon filled={true}`. Remove the inline BlossomIcon from individual habit rows once this section exists. **Position TBD — see Open questions.**
- **P4 — Edit as secondary button** (`DayDetail.tsx`): Replace the section-label-styled `EDIT` link with a small secondary button: `inline-flex items-center rounded-xl border border-stone-200 dark:border-stone-700 px-4 py-2 text-xs text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50`. Label becomes `"Edit this day"` (lowercase, specific, reads as an action not a heading).

### HistoryView (audit finding M1)
- **Suppress Frequency section when no entries** (`HistoryView.tsx`): Wrap the Frequency section divider and toggle in `{entries.length > 0 && ...}`. Move the empty-state message (`"Your days will appear here once you start logging."`) to immediately below the heatmap so it reads as the calendar's own empty state, not an afterthought below a dead toggle.

## Out of scope

- **ManageView bold redesign** (B1 section cards, B2 action tray, B3 chip grid, B4 joy pill) → Sprint 12
- **CheckInForm P2** (Joy → "Highlights" heading) — already shipped in Sprint 9
- **Date heading size** in DayDetail (`text-lg font-light`) — low-stakes aesthetic, deferred
- **Reflection warm state** in DayDetail — intentionally no visual state for reflection text

## Open questions

- **DayDetail Highlights section position:** Evaluation proposes above Habits (emotional summary first). Alternative: between Habits and By the numbers (preserves logged-data-first reading order from the form). UX review to resolve before planning.
- **Highlights section: inline BlossomIcon removal** — once the Highlights section exists, the per-row inline BlossomIcon becomes redundant. Confirm the removal is intended and won't break any edge cases (e.g. a day with no Highlights but an older entry format).

## Audits to run

colour · interaction · microcopy · audit-design-overall
(Typography changes are minor — "Capture" label copy only — but include if the reviewer judges the full typography spec needs a pass.)

---

## UX/UI Review

### Calma fit
Strong alignment. All changes extend the amber language established in Sprint 9 — no new visual noise, urgency, or dashboard energy. The "Capture" label strengthens Calma's analogue, human register, unifying the three-state progression around a single root verb.

Flag: the "Edit this day" button introduces a tertiary pattern (transparent bg at rest, border, small text, hover wash) not yet in the design system. Resolved in mediation: document as a reusable tertiary token in CLAUDE.md.

### User flow
All flows are refinements, not reroutes. Highlights section: when ≥1 checked habit has `joy: true`, an amber panel section appears above Habits in DayDetail. Read-only BlossomIcon fills signal joy markers; per-row inline BlossomIcon is removed once the section exists. When no habits are joy-marked, the section does not render. HistoryView empty-state fix is a clean layout correction.

### Component and pattern reuse
- MomentChip — dual-mode (interactive in CheckInForm, read-only via inline styling in DayDetail). Pragmatic for this sprint; `readOnly` prop extraction noted as a future improvement.
- BlossomIcon — reused as a read-only display element in Highlights; no press handler.
- Amber panel card — reuses existing token from CheckInForm's Joy section. ✅
- "Edit this day" — new tertiary button pattern. To be added to CLAUDE.md.

### Interaction and motion
Low complexity. Only the Highlights section reveal requires animation — apply the existing height/opacity pattern (≤280ms ease-out) from CheckInForm's Joy section.

### Audit relevance
Run: colour · interaction · microcopy · audit-design-overall

### Concerns resolved in mediation
- Highlights position: above Habits (emotional summary first)
- Tertiary button: new reusable token, document in CLAUDE.md
- Inline BlossomIcon removal: safe — guard is `checkedHabits.some(h => h.joy)`, not `length > 0`
- "Capture" label: new entries only; edit path retains "Save"

---

## Architecture Review

### Technical feasibility
All items straightforward to non-trivial-but-low-risk. No item is risky. Colour changes are isolated one-line edits. Highlights section is the largest change (~20 lines of conditional rendering), fully reusing existing amber tokens.

### Data model impact
None. No new localStorage keys, no type changes, no migration. The `joy` field on `HabitState` is already the source of truth.

### Static export constraints
None. All changes are client-side React styling and conditional rendering.

### Codebase degradation signals
None detected. DayDetail grows by ~20 lines (~280–290, acceptable). No pattern drift. Highlights introduces intentional coupling between CheckInForm's joy assignment and DayDetail's joy display — through the stable data model, not shared mutable state.

### Implementation order
1. MomentChip amber selected state
2. Reflection textarea border
3. Add-moment input height
4. "Capture" label (new entries only)
5. Amber moment chips in DayDetail
6. Amber checkmark + dark mode
7. Edit as secondary/tertiary button
8. Highlights section — add section → verify → then remove inline BlossomIcon
9. Suppress Frequency section in HistoryView

### Concerns resolved in mediation
- Highlights position: above Habits (JSX order change only, no behavioral impact)
- Tertiary button: document in CLAUDE.md as deliberate divergence from secondary token
- BlossomIcon removal: guard with `checkedHabits.some(h => h.joy)` — days with zero joy do not render the section; inline icon removal is safe
- HistoryView empty state: use `&&` JSX conditional, not CSS hide, to avoid layout flash

---

## Parallel Review Mediation

**Reviewed:** 2026-03-14

### Conflicts resolved

| Topic | UX position | Arch position | Decision |
|---|---|---|---|
| Highlights section position | Above Habits (emotional summary first) | Between Habits and By the numbers (mirrors form order) | **Above Habits** — emotional summary leads the historical view |
| Tertiary button pattern ("Edit this day") | New pattern, confirm intent and document | Undocumented divergence from secondary token; align or document | **New reusable tertiary token** — add to CLAUDE.md |
| Inline BlossomIcon removal safety | Safe once Highlights guards on `some(h => h.joy)` | Confirm guard is `some`, not `length > 0` | **No section when zero joy** — guard confirmed as `checkedHabits.some(h => h.joy)` |
| "Capture" in edit mode | Unclear from brief | Trivial to branch via `date?` prop | **New entries only** — edit path retains "Save" / "Saving…" / "Saved" |

### Final scope after review
- **MomentChip:** amber selected state (`bg-amber-50 border-amber-300 text-amber-800` / dark equivalents); remove `dark:bg-stone-800` from unselected dark state
- **CheckInForm:** add-moment input `min-h-[44px]`; reflection textarea `border-stone-200`; idle label `"Capture"` for new entries only (edit path: `"Save"`)
- **DayDetail:** amber read-only moment chips (tighter `px-3 py-1.5`); amber checkmark `text-amber-500 dark:text-amber-400`; Highlights section **above Habits** with amber panel card, `checkedHabits.some(h => h.joy)` guard, inline BlossomIcon removed from habit rows after section is live; "Edit this day" as new tertiary button — document token in CLAUDE.md
- **HistoryView:** suppress Frequency section + toggle when `entries.length === 0`; move empty-state message to immediately below heatmap
