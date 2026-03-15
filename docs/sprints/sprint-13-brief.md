# Sprint 13 Brief

**Status:** finalized
**Created:** 2026-03-15

---

## Goals & Business Value

Sprint 13 is a focused polish and accessibility pass on ManageView and SettingsView — the two surfaces that received a structural redesign in Sprint 12 but still carry interaction gaps, accessibility violations, and visual rough edges. The sprint delivers a complete Manage action-tray overhaul (tap affordance, active row highlight, bordered tray card, pill buttons), resolves a WCAG AA failure in SegmentedPill, corrects Settings copy and touch targets, and adds four lower-priority Manage enhancements if capacity allows. No new features, no data model changes, no new routes.

## Proposed scope

### Must — Manage (M1–M6)
- **M1** — Add `···` tap affordance on resting habit rows; position: right-aligned trailing edge (trailing the Joy pill if present — resolve with spacing, not relocation)
- **M2** — Active row highlight on tap: `font-medium text-stone-800 dark:text-stone-100` on label + stone wash (`bg-stone-50 dark:bg-stone-800/50`) on row — **not amber** (amber is semantically loaded as joy/joyByDefault in this component)
- **M3** — Tray rendered as a bordered rounded card container (not a bare list); exit animation must animate `paddingTop: 0` alongside existing `paddingBottom: 0` to prevent snap
- **M4** — Tray buttons as bordered pill buttons: amber-bordered for Archive, amber-fill for Joy-on; new dedicated style constants — do not repurpose `ACTION_BTN`/`ARCHIVE_BTN` (those are also used for Restore buttons on archived rows)
- **M5** — Joy tray button: single-label pill (`BlossomIcon + "Joy"`); bordered neutral at rest, amber fill when `joyByDefault: true` — visual state carries meaning, no two-label variant
- **M6** — `aria-expanded` attribute on habit row tap button

### Must — Settings (S2–S6)
- ~~**S1**~~ — **CLOSED as no-op.** Live code inspection confirms both BACKUP and RESTORE sub-labels at SettingsView:172,192 already carry `dark:text-stone-500`. No change needed.
- **S2** — `SegmentedPill` inactive segment `text-stone-500` → `text-stone-600` (CRITICAL — WCAG AA failure); `dark:text-stone-400` unchanged
- **S3** — Confirm button label "Import" → "Restore"; internal function/state names (`handleImport`, `importStatus`, `importBackup`) unchanged
- **S4** — Reset confirmation button escalated to red: `text-red-700 dark:text-red-400` on "Yes, start fresh" only — **Sprint 12 amber mediation decision overturned** (see resolution below); resting "Start fresh" trigger retains amber
- **S5** — Settings back button: add `flex min-h-[44px] items-center`
- **S6** — Remove-file ✕ button: add `min-h-[44px] flex items-center`

### Lower priority — Manage (L1–L2, L4; batch if capacity allows)
- **L1** — `+ New` ghost chip inside moments grid; **no dashed border** (`border-dashed` has no Calma precedent); use conventional `border border-stone-200 dark:border-stone-700` chip with `+ New` in `text-stone-500 text-xs` — ghost quality comes from stone text + transparent background, not border style
- **L2** — Archived items collapsed disclosure; interaction model: collapsed by default; trigger is a `text-xs text-stone-500 hover:text-stone-700` button at card bottom reading "Archived (n)" with a rotating chevron (same pattern as FrequencyList toggle); height-reveal body, single-phase exit; archiving an item auto-expands the disclosure so the confirmation note is always visible
- ~~**L3**~~ — **DROPPED.** Amber wash on newly added row removed from scope. A colour wash crosses from action-confirmation into feedback-as-reward; the height reveal is sufficient confirmation. Avoids timer state complexity and semantic drift of amber into a ManageView configuration context.
- **L4** — Habit row `transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50` on the full-row tap button; must be visually distinct from M2 active state — hover is lighter, active/selected is the declared wash

## Audits to run

colour, typography, interaction, microcopy, design-overall

## Out of scope

- **H1–H4** (History redesign — date-as-weight calendar, conditional year row, frequency bar, period selector pill group) — deferred to Sprint 14
- `text-stone-400` enforcement hook (P0) — not addressed this sprint; remains a live vulnerability during the colour pass

## Open questions

- ~~**S4 mediation revisit**~~ — **Resolved.** See resolution section below.
- ~~**L2 disclosure pattern**~~ — **Resolved.** Interaction model specified in scope above.
- **Mockup reconciliation** — no Sprint 13 mockup is referenced in this brief. The 2026-03-15-1430 UX evaluation report is the visual source of truth for M1–M6. Copy discrepancies between that report and this brief should be reviewed before implementation begins, specifically for M4/M5 tray pill tokens and L1 ghost chip appearance.

---

## UX/Architecture Review

*Parallel review conducted 2026-03-15. UX reviewer, Architecture reviewer, and UX Radical Evaluation all contributed.*

### UX Review summary

The sprint scope is well-suited to Clarity's identity — a polish and accessibility pass with no gamification risk. Key implementation flags: M3 exit animation must handle `paddingTop: 0`; M4 requires new style constants (not repurposed `ACTION_BTN`/`ARCHIVE_BTN`); M5 Joy pill rest state must be explicitly specified (neutral bordered, not amber); L1 dashed border rejected as outside Calma vocabulary. Colour, typography, interaction, and microcopy audits all flagged as relevant for sprint-validate. S4 red copy must stay calm and specific — not anxious.

### Architecture Review summary

No data model impact, no static export constraints. ManageView.tsx is at 695 lines — approaching monitoring boundary; L1–L4 will push toward 750 but no extraction is in scope. S1 confirmed no-op via live code inspection. Recommended implementation order: S2 → S5/S6 → S3 → S4 (after resolution) → M6 → M1/M2/L4 → M3 → M4/M5 → L1/L2. Highest runtime risk: M3 exit-snap; highest design-decision risk: M4 token spec must be explicit before coding.

### Resolutions

**S1 — Closed.** No-op confirmed. `dark:text-stone-500` already present on both sub-labels in the live file.

**S4 — Sprint 12 amber mediation decision overturned.** The "Yes, start fresh" confirmation button will use `text-red-700 dark:text-red-400`. Factory reset is permanent and non-recoverable; the Calma spec is explicit that red signals permanent destructive actions. The resting "Start fresh" trigger retains amber (reversible intent, not yet committed). Reset is confirmed as the only permanently destructive action in the app — archive is reversible by design.

**L3 — Dropped.** Amber wash on newly added rows removed from sprint scope. The colour wash risks crossing from action-confirmation to feedback-as-reward in a configuration context (as opposed to the check-in context where amber completion wash belongs). Height reveal is sufficient. Timer state complexity is not justified.

**M2 highlight colour — Stone.** `bg-stone-50 dark:bg-stone-800/50` for active row state. Amber is semantically reserved for joy/joyByDefault in ManageView; using it for row selection would introduce a third meaning.

**M1 `···` position — Right-aligned.** The overflow affordance belongs at the trailing edge where mobile users expect it. Spacing resolves any conflict with the Joy pill.

**L1 dashed chip — Replaced.** Conventional `border border-stone-200 dark:border-stone-700` chip with `+ New` text prefix. Ghost quality from stone text + transparent background; `border-dashed` has no Calma vocabulary precedent.

**L2 disclosure — Specified.** Collapsed by default. Trigger: `text-xs text-stone-500` button at card bottom, "Archived (n)" label, rotating chevron. Height-reveal body. Auto-expands when an item is archived so the confirmation note remains visible.
