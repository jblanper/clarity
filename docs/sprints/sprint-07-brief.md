# Sprint 7 Brief

**Status:** finalized
**Created:** 2026-03-04

---

## Goals & Business Value

Sprint 7 is a design-infrastructure pass — no new features, no logic changes.
It closes the most critical gap from the full audit cycle: WCAG AA contrast
failures on section labels across four pages, the systematic absence of
`font-medium` from every section label in the app, and the single most
important design observation from the overall audit (DayDetail showing a
generic ♥ instead of the custom BlossomIcon when reviewing logged joy).

The user benefit is felt rather than seen: the app will be more accessible,
typographically correct, and visually coherent — especially for users in light
mode where stone-400 text currently fails contrast by a wide margin.

## Proposed scope

- **DayDetail — BlossomIcon for joy review** (Chunk 5): replace the Unicode ♥
  character in DayDetail with the custom `BlossomIcon` (filled state). This is
  the single most important finding from the design-overall audit — the app's
  most distinctive visual element is absent from its primary review surface.

- **DayDetail — section labels `font-medium`** (Chunk 6, partial): add
  `font-medium` to the four section label `h3` elements in DayDetail. Date
  heading size change (`text-lg` → `text-base`) deferred to a later sprint.

- **ManageView — SECTION_LABEL colour + weight** (Chunk 7): fix the shared
  `SECTION_LABEL` constant from `text-stone-400` to `text-stone-500` and add
  `font-medium`. Highest-confidence finding — flagged by three separate audits.
  One constant change fixes both the Habits and Moments section labels.

- **SettingsView — three section labels** (Chunk 8): fix Manage, Help, and
  Reset section labels from `text-stone-400` to `text-stone-500 dark:text-stone-500`
  and add `font-medium`. The Reset label is also missing its dark variant entirely.

- **ManageView + SettingsView — remaining stone-400/300 violations** (Chunk 9):
  fix joyByDefault false-branch labels in ManageView (lines 282, 464), the
  cancel button base in SettingsView (line 335), and the archived numeric unit
  which uses `text-stone-300` (line 370) — the lowest-contrast text in the app.

- **ManageView — header spacing + archived label dark colours** (Chunk 10):
  change header `mb-2` to `mb-6` (every other page uses `mb-6` to `mb-10`),
  and raise archived label dark variants from `dark:text-stone-600` to
  `dark:text-stone-500` for usable contrast in dark mode.

- **CheckInForm — section labels `font-medium` + margin** (Chunk 11): add
  `font-medium` to all five section labels; change the Habits and By the Numbers
  labels from `mb-1` to `mb-3` to close the spacing asymmetry between the top
  and bottom halves of the form.

- **HelpView + HistoryView — section labels + body text** (Chunk 12): add
  `font-medium` to HelpView's `SECTION_LABEL` constant and HistoryView's
  frequency toggle; add `font-light` to HelpView's `BODY` constant to match the
  Calma reflective body text scale.

- **globals.css — DayDetail reduced-motion guard** (Chunk 1): add a
  `prefers-reduced-motion` media query for the DayDetail backdrop and sheet CSS
  transitions, which are plain `<div>` elements not governed by `MotionConfig`.

## Out of scope

- DayDetail date heading size (`text-lg` → `text-base`) — visible layout change
  deferred to a later sprint
- Touch targets (HabitToggle, NumberStepper, MomentChip, add-moment buttons) —
  next sprint
- Microcopy (transferData.ts errors, Boolean/Numeric labels, SettingsView copy)
  — dedicated copy sprint
- Interaction/animation polish (FrequencyList scaleX, CalendarHeatmap animation
  fixes, transition-colors on ManageView utility buttons)

## Open questions

- BlossomIcon sizing in DayDetail: should the filled BlossomIcon in the review
  surface match the surrounding inline text size, or should it be slightly
  larger (as it appears in CheckInForm)? UX to advise.
- Adding `font-medium` to section labels that previously had no explicit weight
  declaration: are there any components where the visual weight increase would
  be jarring given surrounding context? UX to flag if so.
- After the sprint, update `docs/audit-implementation-plan.md` to mark Chunks
  1, 5, 6 (partial), 7, 8, 9, 10, 11, 12 as completed so the plan stays
  accurate for subsequent sprints.

---

## UX/UI Review

**Reviewed:** 2026-03-06

### Analysis summary

- Sprint scope is entirely aligned with Calma — corrective only, no new features, no new navigation, no visual noise introduced.
- BlossomIcon substitution in DayDetail is a read-only display; the same icon appears in CheckInForm so user recognition is not a concern.
- ManageView `SECTION_LABEL` constant is the highest-leverage change: one edit propagates to both section labels.
- CheckInForm `mb-1 → mb-3` on Habits and Numbers closes the spacing asymmetry identified by the overall audit as "the most felt inconsistency on the page."
- HelpView `font-light` on `BODY` aligns it with DayDetail's reflection paragraph — the only other long-form reading surface.
- Chunk 1 (reduced-motion guard) must use the semantic-class approach (`.daydetail-backdrop`, `.daydetail-sheet`) consistent with the existing `.frequency-chevron`/`.heatmap-grid` pattern in `globals.css`.
- ManageView joyByDefault toggle (lines 282, 464) still uses Unicode hearts after this sprint — flag as direct follow-on item for Sprint 8.

### Decision log

| Topic | Discussion | Decision |
|---|---|---|
| BlossomIcon size in DayDetail | `size={20}` (default) would be taller than surrounding `text-sm` text causing baseline misalignment; `size={16}` matches the inline read-only context without losing petal legibility | `size={16}` |
| `font-medium` on Joy section heading | "What felt particularly good today?" is longer than all other section labels; `font-medium` will feel heavier on a sentence-length label — spec-correct but warrants visual check after Chunk 11 | Apply `font-medium` per spec; visual check required |

### Audits to run during sprint-validate

audit-colour, audit-typography, audit-interaction (Chunk 1 reduced-motion specifically)

### Scope adjustments from UX review

No scope changes. BlossomIcon size confirmed as `size={16}` for the DayDetail read-only context.

---

## Architecture Review

**Reviewed:** 2026-03-06

### Assessment summary

- All chunks are technically straightforward; no data model impact, no static export risk, no new dependencies.
- Chunk 7 (ManageView `SECTION_LABEL`) is highest leverage: one constant edit at line 59 propagates to lines 262 and 520.
- Chunk 1 (globals.css reduced-motion guard) is the only chunk requiring two coordinated file changes (`DayDetail.tsx` + `globals.css`) — must land in the same commit.
- SettingsView Reset label (line 308) has no dark variant at all — the most critical of the three Chunk 8 fixes.
- Theme and "Your data" labels in SettingsView (lines 136, 169) are already correct and must not be touched.
- `ManageView.tsx` at 655 lines is the largest component; this sprint doesn't worsen it but it should be watched.
- No shared `SECTION_LABEL` constant across the codebase — accepted as infrastructure debt for a future sprint.

### Data model changes required

None.

### Risks flagged

- **Chunk 5 (BlossomIcon size):** Size must be decided before implementation — default `size={20}` causes baseline misalignment in `text-sm` context. *Mitigation: confirmed `size={16}`.*
- **Chunk 9 line 370 (archived numeric unit):** Target colour was unspecified in the brief. *Mitigation: confirmed `text-stone-500`.*
- **Chunk 11 (`mb-1 → mb-3`):** Gap before first `divide-y` row in Habits section may look disconnected. *Mitigation: visual check in both today mode and edit mode.*
- **Chunk 12 (`font-light` on HelpView body):** Geist Sans `text-sm font-light` may be harder to read on a physical device in ambient light. *Mitigation: check on physical device before shipping.*
- **Chunk 1 (two-file change):** Partial implementation (class names in component but no media query, or vice versa) would produce broken/leaking animations. *Mitigation: single commit for both files.*

### Codebase degradation signals

- `ManageView.tsx` at 655 lines — largest component; watch for further growth.
- `SECTION_LABEL` string duplicated independently in six files — infrastructure debt, not addressed this sprint.
- `FIELD_LABEL` in ManageView (line 57) uses `text-stone-500 dark:text-stone-400` — asymmetric; dark value is worse than light. Latent drift, out of scope.

### Decision log

| Topic | Discussion | Decision |
|---|---|---|
| BlossomIcon size in DayDetail | Default `size={20}` taller than surrounding `text-sm`; `size={16}` matches inline context | `size={16}` |
| Archived numeric unit colour (line 370, `text-stone-300`) | `text-stone-400` borderline at 2.4:1 (fails AA); `text-stone-500` passes at 4.6:1 | `text-stone-500` |

### Scope adjustments from Architecture review

No scope changes. Two implementation decisions confirmed: BlossomIcon `size={16}`; archived numeric unit target `text-stone-500`.

---

## Parallel Review Mediation

**Reviewed:** 2026-03-06

### Conflicts resolved

| Topic | UX position | Arch position | Decision |
|---|---|---|---|
| BlossomIcon size in DayDetail | `size={16}` — matches inline `text-sm` read-only context | `size={16}` — default `size={20}` causes baseline misalignment | `size={16}` |
| Archived numeric unit colour (line 370) | No position | `text-stone-500` (passes AA at 4.6:1) | `text-stone-500` |

No other conflicts. UX and Architecture perspectives were fully aligned across all scope items.

### Final scope after review

- Chunk 1: globals.css reduced-motion guard for DayDetail backdrop + sheet (semantic class approach; single commit with DayDetail.tsx)
- Chunk 5: BlossomIcon (filled, `size={16}`) replacing Unicode ♥ in DayDetail joy review
- Chunk 6 (partial): `font-medium` on four DayDetail section label `h3` elements
- Chunk 7: ManageView `SECTION_LABEL` constant — `text-stone-400 → text-stone-500`, add `font-medium`
- Chunk 8: SettingsView three section labels — `text-stone-400 → text-stone-500 dark:text-stone-500`, add `font-medium` (Reset label also gains dark variant)
- Chunk 9: stone-400/300 violations — ManageView lines 282, 464 → `text-stone-500`; ManageView line 370 → `text-stone-500`; SettingsView line 335 → `text-stone-500`
- Chunk 10: ManageView header `mb-2 → mb-6`; archived label dark variants `dark:text-stone-600 → dark:text-stone-500`
- Chunk 11: CheckInForm five section labels gain `font-medium`; Habits + Numbers `mb-1 → mb-3`
- Chunk 12: HelpView `SECTION_LABEL` gains `font-medium`; HelpView `BODY` gains `font-light`; HistoryView frequency toggle gains `font-medium`
