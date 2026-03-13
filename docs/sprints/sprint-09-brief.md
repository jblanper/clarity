# Sprint 9 Brief

**Status:** finalized
**Created:** 2026-03-10

---

## Goals & Business Value

Replace the OS toggle switch and number spinner on the daily check-in with gestures that feel native to Clarity — a full-row tap with an amber wash for habits, a tap-to-increment pill for numbers. Both current controls borrow metaphors from settings panels and quantity selectors; the redesign makes the check-in feel like an act of recording, not configuring. For decimal-step numeric habits (e.g. Sleep at 0.5 hr increments), a new "Start at" value per habit removes the cold-start problem: first tap lands at a realistic baseline, then step-increments take over. Alongside the redesign, close two carry-over audit findings: three sub-44px touch targets in the add-moment flow and a WCAG AA failure on the HistoryView period selector.

## Proposed scope

- **HabitToggle — P1 + Alt 4:** Replace the OS-style toggle switch with a full-row button. Done state: amber dot (left) + amber-50 row wash. Off state: stone dot, transparent background. Full row is the tap target — no separate hit area required.
- **NumberStepper — P3-A + Start at:** Replace the three-zone spinner (−, input, +) with a tap-to-increment pill. Pill is amber-50 when value > 0, stone-100 at zero. Decrement glyph (`−`) appears beside the pill only when value > 0. Direct type-in input is removed. **First-tap behaviour:** if value is 0 (untouched), the first tap jumps to the habit's configured "Start at" value rather than incrementing by step. Subsequent taps increment by step. Decrement goes step-by-step down to 0 (not floored at "Start at"). Habits with no "Start at" configured (or "Start at" = 0) behave as before — first tap = one step.
- **"Start at" in Manage:** Add a "Start at" field to the numeric habit add and edit forms in ManageView. Stored as a new optional field (e.g. `startAt?: number`) in `HabitConfig`. Read-modify-write via `getConfigs()` / `saveConfigs()` as per project rules. Label shown alongside the unit in the form (e.g. *Start at · [5] · hrs*). Field is optional — leaving it blank means first-tap behaviour is one step from 0.
- **CheckInForm add-moment touch targets:** Add `min-h-[44px]` to the "＋ New moment" dashed button, the inline "Add" confirm button, and the dismiss "✕" button (`CheckInForm.tsx` lines 361, 395, 403).
- **HistoryView period selector WCAG fix:** Change `text-stone-400` on inactive "month / 3m / always" buttons to `text-stone-500` (`HistoryView.tsx` lines 129, 134, 139).

## Out of scope

- Deferred low findings from the audit action list (ManageView archived confirmations, CalendarHeatmap day-of-week dark label, bare-text touch targets in Settings/Manage/Help, nav-link two-step hover exception)
- Calma spec sync (`/calma-sync`) — planned for post-code, after arch review confirms the new patterns

## Open questions

None — all open questions resolved in review mediation below.

## Audits to run

colour, interaction, arch, design-overall

---

## UX/UI Review

**Date:** 2026-03-10

**Calma fit:** Strong. Both changes move away from borrowed software metaphors toward Clarity's recording-over-configuring philosophy. Amber wash and dot are semantically correct. No gamification risk.

**User flow:** Clean. HabitToggle is full-row tap — no new navigation, no modal. NumberStepper collapses to pill + decrement glyph — still two zones, both discoverable through visual state. No new navigation patterns.

**Component and pattern reuse:** Both changes are scoped to their respective files. All aria semantics preserved. CheckInForm is untouched. No pattern divergence.

**Interaction and motion:** Simplified — the thumb slide animation is removed entirely. Both controls use `transition-colors` and `active:opacity-70`. No Framer Motion required. Calma-compliant throughout.

**Concerns carried into mediation:**
- NumberStepper decimal-step habits: long-press rejected; Option A (visible secondary input) and Option B (tap-only) evaluated via mockup. Resolved — see mediation.
- Zero-state pill contrast: `text-stone-500` on `bg-stone-100` is borderline (3.0:1). Shift to `text-stone-600` for full AA compliance.
- Dark mode amber wash (`dark:bg-amber-900/15` for HabitToggle, `dark:bg-amber-900/20` for NumberStepper): verify on device, adjust ±5% opacity if needed.
- Archived habits in CheckInForm: verify `pointer-events-none` still suppresses the new button-based HabitToggle.

---

## Architecture Review

**Date:** 2026-03-10

**Technical feasibility:** HabitToggle straightforward (~20 lines JSX). NumberStepper straightforward (~85 lines after removing input state). Touch targets trivial (3 edits). WCAG fix trivial (3 edits). "Start at" adds a new HabitConfig field and Manage UI — non-trivial but contained.

**Data model impact:** `startAt?: number` added to numeric `HabitConfig`. No new localStorage keys. No entry format change. Read-modify-write via `getConfigs()` / `saveConfigs()` as per CLAUDE.md rules. Backwards compatible — field is optional.

**Static export constraints:** None. All changes are UI-layer client components.

**Codebase health:** Both components shrink. HabitToggle CLAUDE.md pattern note (transparent hit area + inner pill) requires updating post-implementation to reflect the new row-button pattern.

**Implementation order:** WCAG fix → touch targets → HabitToggle → NumberStepper (+ Start at config) → Manage UI → lint/test/build.

**Concerns carried into mediation:**
- Decimal-step habits: tap-only (14 taps for Sleep) or keep input visible? Resolved — see mediation.
- Zero-state contrast: agrees → `text-stone-600`.
- Post-implementation: update CLAUDE.md HabitToggle pattern description.
- Archived habits regression: manual test required.

---

## Parallel Review Mediation

**Reviewed:** 2026-03-10

### Conflicts resolved

| Topic | UX position | Arch position | Decision |
|---|---|---|---|
| NumberStepper decimal-step habits | Option A (visible secondary input below pill) or Option B (tap-only, accept 14 taps) — rejected long-press | Option B (tap-only, ship clean, monitor usage) | Neither. PO proposed a third path: "Start at" value per habit. First tap jumps to configured baseline, eliminating cold-start friction without UI clutter or hidden interaction. User confirmed. Included in scope. |
| Zero-state pill contrast | `text-stone-600` (~4.8:1) over `text-stone-500` (borderline 3.0:1) | Agrees — `text-stone-600` | `text-stone-600` for zero-state pill number. |
| "Start at" label | "Starting value" flagged as developer vocabulary | N/A | Label is "Start at" — plain, action-adjacent, consistent with existing Manage field style. |

### Final scope after review

- HabitToggle — P1 + Alt 4: full-row button, amber dot + wash, aria semantics preserved
- NumberStepper — P3-A + Start at: tap pill (amber when logged), decrement glyph at value > 0, first tap jumps to "Start at" if configured
- "Start at" per numeric habit: new optional `startAt?` field in HabitConfig, new field in Manage add/edit form, label "Start at" with unit
- CheckInForm add-moment touch targets: `min-h-[44px]` on 3 buttons
- HistoryView period selector WCAG fix: `text-stone-400` → `text-stone-500` on 3 buttons
- Post-implementation: update CLAUDE.md HabitToggle pattern note; verify dark mode amber wash on device; verify archived habits display in CheckInForm
