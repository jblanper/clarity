# UX Evaluation Report

**Date and time:** 2026-03-15 14:30
**Area reviewed:** Post-Sprint 12 — full implementation review of Manage and Settings redesigns
**Designer:** UX Radical Evaluation
**Prior evaluations:** 2026-03-14-0840 (Manage bold redesign), 2026-03-14-2130 (Settings). This report is a retrospective on what was built from those two reports — what landed, what deviated, and what remains.

---

## Scope

Sprint 12 implemented B1–B4 (Manage) and S1–S4 (Settings) from the two prior evaluation reports. This report reviews every implemented item against the original designs, assesses where development diverged and why, gives a judgment on each divergence, and consolidates everything still outstanding into a single actionable list.

---

## What's working

**The Manage page structural improvement is real.** Section cards, full-row tap, and the chip grid for moments are all in place. The page went from a dense form with sixteen persistent action links to a quiet inventory where you tap to reveal what you can do. That core idea landed correctly. The reduction in visual noise at rest is significant.

**SegmentedPill is a clean, reusable component.** The active state (white-on-stone-100 with shadow) is readable and well-executed. The component is correctly generic and ready for reuse in the History period selector (H4).

**The Settings restructure is coherent.** Theme, App (Manage + Help), Your Data, and Reset now read in the right order with the right visual weight hierarchy. The App card combining both nav links is actually better than the original S4 proposal, which only wrapped Manage.

**Reset copy is a meaningful improvement.** "Start fresh" / "Keep my data" is warmer and more human than "Reset to factory defaults" / "Cancel". These words matter at the moment of hesitation.

**Your Data section is substantially better.** BACKUP / RESTORE sub-labels, tertiary buttons, and plain copy ("Save a copy", "Choose a file", "Load a backup file. Days you've already logged won't change.") — this section now reads as part of a thoughtful product rather than a utility panel.

---

## What was implemented and my assessment

### B1 — Section cards

**What was built:** Section cards for Habits and Moments using `rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-4 py-4`. `+ New` in the card header. `space-y-0.5` between rows.

**Deviations from spec:**
- Card surface token: spec used `bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800` (subtle muted panel). Implementation uses `bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700` (prominent white card).
- Row separators: spec used `divide-y divide-stone-100 dark:divide-stone-800`. Implementation uses `space-y-0.5`.

**My assessment:** The white card is more prominent than the spec intended. The spec explicitly chose the "subtle panel" surface token to keep the cards quiet — a container that organises without calling attention to itself. `bg-white` in light mode makes the card read as a raised surface, which is fine for a form card (like the inline edit form) but heavier than needed for a section boundary. That said, this is a minor deviation and not harmful. The `space-y-0.5` separator is functionally equivalent to `divide-y` for the current density of rows. **No action required, but worth aligning to `bg-stone-50 dark:bg-stone-800/50` in a future polish pass if the page starts feeling too form-like.**

---

### B2 — Full-row tap with action tray

**What was built:** Full-row `<button>` tap target, `AnimatePresence` height reveal, Edit / Archive / Joy toggle text buttons in the tray (`flex gap-4 pb-3`).

**Deviations from spec — significant:**

| | Spec (mockup) | Implementation |
|---|---|---|
| Resting row affordance | `···` right-side indicator in `text-stone-300` | Nothing — no affordance |
| Active row highlight | `font-medium` label + light background wash | No visual change on tap |
| Tray container | `tray-card` (bordered rounded card) | Bare `flex gap-4 pb-3` |
| Tray buttons | Bordered pill buttons (`rounded-xl border px-3 min-h-[40px]`) | Bare `text-xs hover:underline` text |
| Button copy | "Edit label" | "Edit" |

**My assessment — I disagree with three of these deviations:**

**The missing `···` affordance is the most consequential problem on the page right now.** There is no visual signal whatsoever that a habit row is tappable. The full-row tap model only works if the user discovers it — and there is nothing inviting discovery. A new user opening the Manage page sees a list of habit names with no interactive signal. The `···` indicator in `text-stone-300 dark:text-stone-600` is deliberately quiet — it doesn't compete with the label — but it's present enough to suggest "there's something here". Without it, the page's interaction model is invisible.

**The bare text tray buttons are wrong for touch.** On a touch device there is no hover state, so `hover:underline` is meaningless. The buttons are plain undecorated text — they look like labels, not actions. The mockup specified bordered pill buttons precisely because pills have affordance on mobile: they have a shape, they look tappable. Three bare text links in a row is a regression to the pre-Sprint 12 style the redesign was supposed to replace.

**The missing active row highlight is a feedback gap.** When the user taps a row, nothing changes visually on the row itself — only the tray appears below. A light background wash and font-medium on the label (both from the mockup) would confirm "this row is selected" and visually connect the tray to the row that triggered it. Without it, the tray appears to float.

**I have no objection to "Edit" vs "Edit label"** — shorter is fine at this size. Minor.

---

### B3 — Moments chip grid

**What was built:** `flex flex-wrap gap-2` chip grid. Tapping a chip immediately replaces it with an inline input + Save/Cancel/Archive in the grid. `+ New` moved to card header.

**Deviations from spec:**

| | Spec (mockup) | Implementation |
|---|---|---|
| Chip tap → | Selected state + tray card below grid | Chip immediately becomes text input in grid |
| `+ New` location | Dashed ghost chip at end of grid | Card header button |
| Edit zone | Below grid, grid stays intact | Inside grid, interrupts layout |

**My assessment — the inline edit model is functionally fine but has a meaningful UX cost:**

The mockup's tray-below-grid model keeps the chip grid visually stable at all times. You always see all your moments. The edit action happens in a declared zone below. The implementation replaces the chip with an input, which causes the grid to reflow when you tap — moments shift position, the grid visually destabilises. For a page about calm and intentionality, a grid that reorganises itself when you tap is a minor but real friction point.

**That said, the inline edit is simpler to implement and not broken.** I wouldn't call this a must-fix. If the grid reflow bothers users in practice, the tray model from the mockup is the path back. For now it's an acceptable simplification with a known cost.

**The `+ New` dashed chip in the grid is worth reconsidering.** The dashed chip was a spatial anchor — it told you where new moments would appear and invited a tap from within the grid itself. Moving `+ New` to the card header requires the user to look away from the grid to add something to it. Not broken, but the in-grid affordance was better. **Low priority, but worth restoring in a polish pass.**

---

### B4 — Joy pill + tray toggle

**What was built:** Amber `Joy` pill in resting row (boolean habits with `joyByDefault: true`). `Mark joy` / `Unmark joy` text buttons in the tray using `BlossomIcon filled={h.joyByDefault}` icon.

**Deviations from spec:**

| | Spec (design decisions) | Implementation |
|---|---|---|
| Pill label | `✿ Joyful` | `Joy` |
| Tray toggle label | Single: `✿ Joyful` (style carries state) | Two: `Mark joy` / `Unmark joy` |
| Tray toggle style | Bordered pill (neutral = off, amber fill = on) | Bare text with BlossomIcon |

**My assessment:** The design decision section of the 0840 report explicitly resolved `✿ Joyful` as the single label with visual style carrying the toggle state. This was a considered decision — "Neutral border = off. Amber fill = on. The visual state carries the meaning — no copy change, no second line." The implementation discarded this decision and used two labels instead.

**I think the original design was better.** `✿ Joyful` — and even the plain `Joy` — describes the habit as a quality. "Mark joy" and "Unmark joy" describe an action on a system concept. They're more clinical. "Joy" on the pill is fine (shorter is acceptable), but the tray button should follow the same single-label principle: one pill, visual state carries meaning. The `BlossomIcon filled/unfilled` in the current implementation does carry some visual state — but it's subtle and paired with two different text labels, which partially undercuts the elegance.

**Recommendation: restore the single-label pill button in the tray.** Use `BlossomIcon filled={h.joyByDefault}` + `Joy` as the single label. Bordered pill when off, amber fill when on. This recovers the design decision without reintroducing `✿`.

---

### S1 — Theme segmented pill

**What was built:** `SegmentedPill` component with `bg-white dark:bg-stone-900 font-medium shadow-sm` active state, on a `bg-stone-100 dark:bg-stone-800` container.

**Deviation:** Spec proposed `bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900` active fill (primary button token). Implementation uses raised white segment.

**My assessment:** The raised white segment is the iOS-native segmented control pattern. It reads immediately as a selection control on mobile and doesn't require any mental model. The stone-800 fill from the spec would have used the primary button token, which communicates more intent than needed for a display preference. **The implementation is arguably better than the spec here.** The one issue — inactive `text-stone-500` on `bg-stone-100` ≈ 3.7:1, fails AA — should be raised to `text-stone-600`. This is a one-class fix.

---

### S2 — Your Data sub-labels, tertiary buttons, copy

**What was built:** BACKUP / RESTORE sub-labels (missing `dark:text-stone-500`), tertiary `TERTIARY_BTN` constant used throughout, plain-language copy. Confirm button still reads "Import".

**Assessment:**
- The BACKUP/RESTORE dark variant is a must-fix regression — WCAG AA fail in dark mode.
- "Import" not "Restore" on the confirm button breaks the verbal thread RESTORE → "Choose a file" → **Restore**. The word should run through the whole flow. This is a one-word change. **Should be fixed.**

---

### S3 — Reset

**What was built:** Amber-bordered resting button, "Start fresh" / "Keep my data" copy, confirmation text, all amber throughout (no red). Mediation decision documented.

**My assessment — I maintain my original position:** The confirmation button ("Yes, start fresh") is the terminal destructive step. The user is about to lose everything. Amber communicates "significant but recoverable." Factory reset is not recoverable. The Calma semantic color rule is explicit: "Red signals permanent destructive actions only." This is a permanent destructive action.

The mediation decision to keep amber is understandable — the product has a calm register and red feels jarring. But there is a middle path: red does not have to mean alarming. `text-red-700 dark:text-red-400` on a plain text button is the same size and weight as the current amber text button. The red is a signal, not a design statement. A quiet red is still calm. **I recommend revisiting this. The confirmation step should be red.**

---

### S4 — Navigation card

**What was built:** Theme → App card (Manage + Help) → Your Data → Reset. Both links in a single card with a divider between them.

**Assessment:** Better than the spec proposal. The original S4 only wrapped Manage. Combining Manage and Help into an "App" section is the correct read of these two links — they're both navigational, they both go to configuration subpages, they belong together. **No action required.**

---

## What is still missing

### Manage — must address

| | Issue | What to build |
|---|---|---|
| M1 | `···` tap affordance on resting rows | `<span className="text-stone-300 dark:text-stone-600 text-xs flex-shrink-0">···</span>` right side of every active habit row |
| M2 | Active row highlight on tap | `font-medium text-stone-800 dark:text-stone-100` on label when `actionTrayId === h.id`, light background wash on the row |
| M3 | Tray as a card container | Wrap action tray content in a bordered rounded card instead of bare flex |
| M4 | Tray buttons as bordered pills | Replace `hover:underline` text with `rounded-xl border px-3 min-h-[44px]` pill buttons; amber border for Archive, amber fill for Joyful-on |
| M5 | Joy tray button: single-label pill | `BlossomIcon + "Joy"`, bordered when off / amber fill when on — not two labels |
| M6 | `aria-expanded` on habit row button | Screen reader has no affordance for the action tray |

### Settings — must address

| | Issue | What to build |
|---|---|---|
| S1 | BACKUP/RESTORE missing `dark:text-stone-500` | Add `dark:text-stone-500` to both `<p>` sub-labels at SettingsView:172,192 |
| S2 | SegmentedPill inactive contrast | `text-stone-500` → `text-stone-600` on inactive segments |
| S3 | Confirm button "Import" → "Restore" | One-word change in the `ready` state button label |
| S4 | Reset confirmation should escalate to red | `text-amber-700` → `text-red-700 dark:text-red-400` on the "Yes, start fresh" button only |
| S5 | SettingsView back button no `min-h-[44px]` | Add `flex min-h-[44px] items-center` |
| S6 | Remove-file ✕ button no `min-h-[44px]` | Add `min-h-[44px]` |

### History — not yet started

| | Proposal | Effort |
|---|---|---|
| H1 | Date-as-weight calendar (replace GitHub-style colored squares) | Medium |
| H2 | Conditional year row | Low |
| H3 | Frequency bar taller + full-width | Low |
| H4 | Period selector enclosed pill group | Low |

### Manage — lower priority

| | Issue | What to build |
|---|---|---|
| L1 | `+ New` dashed ghost chip inside moments grid | Restore the in-grid affordance; remove or keep header `+ New` as secondary |
| L2 | Archived items collapsed disclosure | "Show archived (n)" toggle at bottom of card; collapsed by default |
| L3 | Newly added habit feedback | Brief amber background wash on the new row for ~800ms |
| L4 | Habit row missing `transition-colors` / hover wash | `hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors` on the full-row tap button |

### Export feedback (open question from 2130 eval)

No inline success state after a successful backup export. After `handleExport()` succeeds the button returns silently to idle. A brief inline "Backup saved" confirmation in `text-xs text-stone-500` would close this feedback loop. Low effort, low urgency — but it has been flagged in two evaluation cycles without being addressed.

---

## Sprint recommendations

### Sprint 13 — Manage polish (high confidence, all low effort)

M1–M4 (tray affordance, active highlight, card container, pill buttons) should be batched in a single pass — they're all in the same JSX block in ManageView. M5 (joy single-label) and M6 (aria-expanded) can ship in the same commit.

S1–S3 (dark variant, SegmentedPill contrast, Import→Restore) are one-line fixes each and should be done before deploy. S4 (red confirmation) is a one-class change and the right call — recommend revisiting the mediation decision.

### Sprint 14 — History redesign

H1 is the centrepiece and should have its own sprint. H2, H3, H4 are low-effort and can batch alongside H1 since H2 and H1 both touch `CalendarHeatmap.tsx`.

---

## Open questions

- **Red on the reset confirmation:** The mediation decision kept amber throughout the reset flow. My recommendation is to revisit — specifically for the "Yes, start fresh" confirmation button only, not the resting "Start fresh" button. The question for the product owner: is the calm register more important than semantic correctness at the moment of permanent data loss?

- **Archived items in cards:** With multiple habits archived, the Habits card grows and archived rows sit below active rows with no visual separation. The 0840 eval raised this as a future consideration. At what threshold does this need addressing — 2 archived items? 5?

- **B3 chip grid reflow:** The current inline-edit model causes visual reflow when a chip is tapped. Acceptable now; worth monitoring if it becomes a friction point in practice.
