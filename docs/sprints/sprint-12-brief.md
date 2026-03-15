# Sprint 12 Brief

**Status:** finalized
**Created:** 2026-03-15

---

## Goals & Business Value

Redesign SettingsView and ManageView to bring them up to the same standard of polish as the rest of the app — cleaner copy, better visual hierarchy, and interaction patterns that feel intentional rather than utilitarian. The Manage page in particular gets a bold rethink: section cards, a full-row tap model that hides Edit/Archive at rest, and Moments surfaced as an editable chip grid. Carry-forward debt (stone-400 foreground violations, touch target gaps, placeholder microcopy) is resolved in the same pass so the audit slate is clean heading into Sprint 13.

## Proposed scope

### Settings improvements

- **S1 — Theme section:** Replace bare light/dark toggle with a segmented pill control.
- **S2 — Your Data section:** Add BACKUP/RESTORE sub-labels, restyle actions as tertiary buttons, rewrite copy in plain human language.
- **S3 — Reset flow:** Amber bordered button at rest → red confirmation state with rewritten destructive copy.
- **S4 — Manage entry point:** Wrap the Manage link in a card container that matches Manage page vocabulary.

### Manage bold redesign

- **B1 — Section cards:** Wrap Habits and Moments sections in card containers with a section header carrying a "+ New" action.
- **B2 — Full-row tap + action tray:** Resting row shows label only; tapping reveals Edit and Archive inline. Single `actionTrayId` state enforces mutual exclusivity.
- **B3 — Moments as chip grid:** Replace the flat list with an editable chip grid; inline editing on tap.
- **B4 — Joy-by-default pill tag:** Display joy-by-default status as an amber pill tag in the resting row; togglable from the action tray.

### Carry-forward debt

- ManageView `text-stone-400` → `text-stone-500` (lines 402 and 631).
- Touch target fixes: bare-text controls in SettingsView, ManageView, and HelpView that fall below `min-h-[44px]`.
- ManageView add/edit form placeholder `"0"` → `"Optional"` for the Start at field.

## Out of scope

- Data model changes or new localStorage keys.
- New routes.
- New Calma spec rules beyond what the above interactions require.
- CalendarHeatmap `dark:text-stone-600` day-of-week label fix (low priority, deferred).
- Undocumented nav-link two-step hover (low priority, deferred).
- CheckInForm inline validation microcopy rewrites (deferred).

## Open questions

- **B2 action tray animation:** slide-down reveal vs. fade-in? Needs UX/arch sign-off on the AnimatePresence pattern before implementation.
- **B3 chip grid editing:** confirm whether editing a moment chip opens an inline text field in place or reuses the existing bottom-of-list add form.
- **S3 reset confirmation:** single-step amber→red colour transition in place, or two-step with a separate confirm button reveal?

---

## Audits to run

colour, typography, interaction, microcopy, arch, design-overall

## UX/UI Review

**Calma fit:** Strong alignment. No risk of dashboard energy. B2 action tray introduces new behavioural vocabulary — restrained animations keep it consistent with Calma. Minor: "+" in card headers must be inline text, not a standalone icon button.

**User flow:**
- S1–S4 flows are clean and non-breaking.
- S4: Manage card wrapper should include Help as a second row in the same card (single shared card, stacked rows, divider between them). Both are secondary navigation; separate cards would inflate their visual weight.
- B2 mutual exclusion: tapping a row while another tray is open closes the first and opens the second — same `closeAllEditors()` pattern as existing inline edit forms.
- B3: in-place chip editing (chip becomes `<input>` on tap, Save/Cancel inline).

**Component and pattern reuse:**
- Tertiary button: documented CLAUDE.md token — extract to a constant in SettingsView.
- Card container: reuse existing `INLINE_FORM` border pattern.
- Segmented pill (S1): new — extract to a `<SegmentedPill>` component for future reuse.
- Chip grid: reuse `MomentChip` with `flex flex-wrap gap-2`.
- Joy-by-default pill: derives from MomentChip selected-state + amber token.

**Interaction and motion:**
- S1–S4: `transition-colors` only, no Framer Motion needed.
- B2: fade-in + height reveal combined, 220ms ease-out.
- B3: in-place text field, 220ms height reveal.
- B4: static pill indicator at rest; toggle button appears in action tray.
- S3: no colour transition — amber button at rest, confirm/cancel copy revealed on tap.

**Audits to run at validate:** colour (red tokens if used, amber already audited), typography (segmented pill labels, button sizing), interaction (touch-target sweep, action tray animation), microcopy (BACKUP/RESTORE copy, reset confirmation states), arch, design-overall.

---

## Architecture Review

**Technical feasibility:**
- Straightforward: S1, S4, carry-forward fixes.
- Non-trivial but safe: S2, B1, B3, B4.
- Was risky (open questions now resolved): B2, S3.

**Data model impact:** None. No new localStorage keys, no type changes, no migrations.

**Static export constraints:** None. All changes within existing `"use client"` components on existing routes.

**Degradation signals:** ManageView is 699 lines; B1–B4 will add ~100–150 lines. Monitor — extract `HabitSection` / `MomentSection` post-sprint if file exceeds 850 lines.

**Recommended implementation order:**
1. S1 → S4 → carry-forward (low friction, confidence building)
2. S2 (isolated to SettingsView)
3. B1 (section cards — surfaces scroll-position edge cases early)
4. B2 + B3 together (coupled via `actionTrayId` state and animation pattern)
5. B4 (depends on B2 action tray being in place)
6. S3 last

**Key risks:**
- B2 action tray: new AnimatePresence pattern at row level — test in isolation before integration to avoid clashing with existing inline-edit forms.
- B3 in-place editing: requires new `editingMomentId` state that must integrate cleanly with `closeAllEditors()`.
- B1 scroll position: if section card reveals/collapses, apply the `window.scrollTo({ top: savedPosition, behavior: "auto" })` pattern before state update (CLAUDE.md).
- S2 tertiary buttons: verify `min-h-[44px]` is met — `px-4 py-2 text-xs` alone may fall short.

---

## Parallel Review Mediation

**Reviewed:** 2026-03-15

### Conflicts resolved

| Topic | UX position | Arch position | Decision |
|---|---|---|---|
| S3 reset colour | Copy only — no red colour change. Words over colour. | Colour change is trivially easy to add; neutral on approach. | **Option A — copy only.** Amber button at rest; confirm/cancel copy revealed on tap. No red state. |
| B2 action tray animation | Fade-in + height reveal (220ms ease-out) — softer than slide, avoids spatial hierarchy implication. | Same recommendation. Pattern consistent with existing height+opacity reveals in ManageView. | **Fade-in + height reveal, 220ms ease-out.** Document in CLAUDE.md once proven. |
| B3 chip editing pattern | In-place text field (chip → `<input>` on tap). More modern, tighter feedback loop. | In-place requires new `editingMomentId` state + `closeAllEditors()` integration. Achievable. | **In-place text field.** Chip becomes `<input>` on tap; Save/Cancel inline; integrates with mutual-exclusion pattern. |
| S4 card scope | Manage + Help in a single shared card (stacked rows, divider). Avoids inflating both as primary-weight cards. | Straightforward either way. | **Single shared card for Manage + Help** — stacked rows with a divider, full-row links with `›` chevron. |

### Final scope after review

**Settings improvements:**
- S1 — Theme section: segmented pill control replacing bare toggle buttons. Extract to `<SegmentedPill>` component.
- S2 — Your Data section: BACKUP/RESTORE sub-labels, tertiary buttons (verify `min-h-[44px]`), plain-language copy rewrite.
- S3 — Reset flow: amber button at rest; tap reveals confirm/cancel copy. No colour change to red.
- S4 — Navigation card: single card containing Manage and Help as stacked full-row links with divider and `›` chevrons.

**Manage bold redesign:**
- B1 — Section cards: card containers for Habits and Moments; section header with inline "+ New" text action.
- B2 — Full-row tap + action tray: resting row shows label only; fade-in + height reveal (220ms) on tap; single `actionTrayId` state; mutual exclusion via `closeAllEditors()` pattern.
- B3 — Moments as chip grid: `flex flex-wrap gap-2` using `MomentChip`; in-place `<input>` editing on tap; `editingMomentId` state integrates with mutual exclusion.
- B4 — Joy-by-default pill tag: amber read-only pill in resting row; togglable from action tray.

**Carry-forward debt:**
- `text-stone-400` → `text-stone-500` (ManageView lines 402 and 631).
- Touch target sweep: all bare-text controls in SettingsView, ManageView, HelpView — ensure `min-h-[44px]`.
- ManageView Start at placeholder `"0"` → `"Optional"`.
