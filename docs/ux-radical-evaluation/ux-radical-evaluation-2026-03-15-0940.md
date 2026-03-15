# UX Evaluation Report

**Date and time:** 2026-03-15 09:40
**Area reviewed:** History page — CalendarHeatmap + FrequencyList, including assessment of the "Ma" Seasonal Tapestry proposal
**Designer:** UX Radical Evaluation
**Prior evaluations:** 2026-03-14-0840 (Manage bold redesign), 2026-03-14-2130 (Settings). Neither covers History. No archiving required.

---

## Scope

The full History page — the calendar heatmap, the month/year navigation, the Frequency section and its period selector and list — evaluated against the live deployed state and the code in `CalendarHeatmap.tsx` and `FrequencyList.tsx`. The "Ma" Seasonal Tapestry feature proposal (`docs/clarity-feature-explorer/proposed-features-2026-03-09-1545.md`) is reviewed as a potential design direction and assessed against both the existing implementation problems and the Calma spec.

---

## What's working

**The two-axis sunset palette is genuinely thoughtful.** Dusk blue (hsl 210) for structural habit completion, warm ember (hsl 23) for moments and joy, blended proportionally when both signals are present. This is Calma's "two-axis blend" principle applied correctly. It's non-arbitrary: the color communicates something specific and meaningful.

**The month navigation animation is well-executed.** The directional slide (custom + variants pattern, not inline functions) correctly reverses when going backward. The month heading crossfade is clean at 120ms. The `AnimatePresence` handling is correct. This is one of the better interaction details in the app.

**The FREQUENCY toggle is correctly styled.** `text-xs font-medium uppercase tracking-widest text-stone-500` — all six parts of the section label, applied to a collapsible toggle. This is the right pattern.

**The calendar-to-frequency-list filter interaction is a genuinely clever idea.** Tapping a habit in the list highlights matching days in the calendar and dims the rest. The bidirectional connection between the two sections of the page makes the History page more than a list — it makes it a tool for seeing patterns. The one-time hint dismiss is implemented correctly too.

**The bar animation in FrequencyList is well-done.** `scaleX` from 0 with `transformOrigin: "left"` follows the CLAUDE.md animation rules correctly — no width animation, no reflow.

**The scroll-preservation on Frequency collapse is handled correctly.** Synchronous `window.scrollTo` before the state update that collapses the section — the CLAUDE.md pattern for this exact problem, applied correctly.

---

## What needs attention

### 1. The cell boxes make it look like GitHub

**What:** Every calendar day renders as a 44×44px filled square — `h-11 w-11 rounded-md` with `bg-stone-200 dark:bg-stone-800` for empty days and a sunset-blend color for active ones. This is, structurally, GitHub's contribution graph: a grid of colored squares where intensity communicates activity.

**Where:** `CalendarHeatmap.tsx:330–354` — the cell `<button>` render.

**Why it matters:** The user named this directly: "the calendar is a bit too similar to Github's one." Even with the sunset blend (which is genuinely different from GitHub's green), the first impression is a developer activity chart. Clarity is a personal reflection tool. It should not visually reference a code contribution tracking product. The association is wrong for the audience, the purpose, and the emotional register.

**Calma alignment:** Calma says typography is the primary design material. Colored boxes are the opposite — they reduce language to pure area and saturation, which is data dashboard territory. The current calendar uses color as its primary encoding on a grid of opaque cells. That's not Calma. It's infographic.

Also: the cells use `rounded-md` — Calma's `rounded-xl` is the minimum for inline/compact controls. `rounded-md` makes the cells feel sharper and more grid-like, reinforcing the GitHub aesthetic.

---

### 2. The frequency bar is too constrained to communicate relative difference

**What:** `FrequencyList.tsx:133, 153–166` — the bar is `h-0.5` (2px tall) and capped at 38% max width (`Math.round((item.count / maxCount) * 38)`). A bar that can only reach 38% of the row width — and is only 2px tall — is too compressed to communicate the relative differences between habits clearly.

**Where:** `FrequencyList.tsx` — the `barWidth` calculation and the bar element.

**Why it matters:** The bar is the right encoding for a reflection tool — it communicates rhythm and relative proportion without anchoring to a goal number. But at 2px height and 38% max width, it barely registers. Two habits with meaningfully different rhythms (one done every day, one done once a week) look almost identical in bar length. The encoding is correct in principle; it's just too quiet to do its job.

**Calma alignment:** The bar as a qualitative signal — not a numeric count — is fully aligned with Clarity's philosophy. Approximate relative comparison serves reflection; precise counts risk creating implicit targets. The fix is to make the bar more expressive, not to add numbers.

---

### 3. The period selector uses weight alone as its active signal

**What:** `HistoryView.tsx:136–149` — `font-medium text-stone-900` is the only active state signal for the period buttons (Month / 3 Months / Always). Inactive: `text-stone-500`. No enclosure, no shape.

**Where:** The period selector row inside the Frequency section.

**Why it matters:** This is the same affordance problem flagged in `ux-radical-evaluation-2026-03-14-2130.md` for the Settings Theme toggle (S1). Typographic weight alone is the weakest possible affordance signal for a selection control. A user scanning the section cannot immediately see which period is active. Note that the Settings report already recommends a segmented pill (S1) — the same solution applies here.

**Calma alignment:** The Calma spec's "chip / tag variant" — "a pill-shaped chip communicates selection state through amber fill when selected; transparent background with stone border at rest" — describes this use case. The current implementation does not follow it.

---

### 4. The year row adds visual noise for most users

**What:** `CalendarHeatmap.tsx:220–241` — the year navigation row (`< 2026 >`) renders unconditionally above the month row. This means every History view has two rows of navigation controls, even for users who have data only within a single year.

**Where:** The top of the `CalendarHeatmap` component.

**Why it matters:** A user who started Clarity in January 2026 will never have data in 2025. The year selector is visually present but functionally irrelevant for their entire first year of use. Two navigation rows on a compact mobile view create a navigation hierarchy that isn't earned yet.

**Calma alignment:** "Every omission should serve calm, not emptiness." Omitting the year row until it's needed serves calm — it removes a control that hasn't been earned by the user's data span. This aligns with Calma's principle that the interface should contain only what is necessary for the current moment.

---

## Proposals

### H1 — Date-as-weight: remove cell boxes, let typography carry the data

**What to change:** Remove the filled cell backgrounds entirely. Each day is its date number — nothing else. The number's weight, opacity, and color carry the activity signal. The selected day gets a subtle `rounded-full` circle behind it, not a filled square. Tappable area stays 44×44px — the hit target doesn't change.

**Activity encoding:**

| State | Weight | Color (light) | Color (dark) |
|---|---|---|---|
| No entry | light | stone-300 | stone-600 |
| Low activity (< 50%) | normal | stone-500 | stone-400 |
| High activity (≥ 50%) | medium | stone-700 | stone-300 |
| Joy present (any) | medium | amber-600 | amber-500 |
| Future | — | stone-300, opacity-40 | stone-600, opacity-40 |

When both high activity and joy are present, amber wins — joy is the emotional peak, it should be visible. The dusk blue / warm ember two-axis blend is retired from the calendar cells. It served a thoughtful purpose but the cell box format makes it look like GitHub regardless of the hue. Amber for joy is more legible, more specific, and more aligned with how Clarity uses amber throughout.

**Selected state:** A small `rounded-full bg-stone-100 dark:bg-stone-800` circle (same size as the touch target, slightly inset via padding) replaces the current `ring-2 ring-stone-500` selected indicator.

**Cell render direction:**

```tsx
<button
  onClick={() => !isFuture && onDayClick(dateStr)}
  disabled={isFuture}
  aria-label={dateStr}
  aria-pressed={isSelected}
  className={[
    "flex h-11 w-11 items-center justify-center transition-colors",
    isFuture ? "cursor-default" : "cursor-pointer",
  ].filter(Boolean).join(" ")}
>
  <span
    className={[
      "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
      isSelected ? "bg-stone-100 dark:bg-stone-800" : "",
      isFuture ? "opacity-30" : "",
      /* weight + color from activity level — see mapping table above */
    ].filter(Boolean).join(" ")}
    style={{ fontWeight: cellWeight, color: cellColor }}
  >
    {dayNum}
  </span>
</button>
```

The activity level (and therefore `cellWeight` and `cellColor`) is computed from the same `computeCellColor` logic, but instead of producing an HSL background, it maps to a weight/color pair.

**Calma note:** This is Calma's typographic primacy principle applied to a data visualization — type as the primary material, no decorative surface. The amber accent for joy follows Calma's semantic color rule: amber signals emotional weight. `rounded-full` for the selected state matches Calma's pill/chip shape vocabulary. The cell `h-8 w-8 rounded-full` inner circle is Calma `rounded-full` (pill/tag scale) rather than `rounded-md`.

**On the Ma Tapestry proposal:** This proposal implements the philosophical core of the Tapestry's "Typographic Rhythm" direction — type carries data, no colored boxes, amber for joy — in the simplest possible form. It does NOT implement the 5-style system (Typographic Rhythm / Weave / Petals / Mist / Field). That system is over-engineered for what is, at root, a binary problem: "does this look like GitHub?" and "does it feel considered?" H1 answers both without requiring the user to choose from five visualization modes. The Weave, Petals, Mist, and Field directions are interesting design provocations that belong in the feature explorer backlog, not a sprint.

**Mockup:** [View mockup](./mockup-2026-03-15-0940.html#h1-date-weight)

**Effort estimate:** Medium. Changes the cell render in `CalendarHeatmap.tsx` — replaces `bg-stone-200 dark:bg-stone-800 rounded-md` logic with a weight/color mapping. No changes to grid structure, navigation, filter logic, or parent components. The `computeCellColor` function can be replaced with a `computeCellStyle` function that returns `{ weight, color }` instead of an HSL string.

---

### H2 — Collapse the year row until it's earned

**What to change:** Only render the year navigation row when the user's earliest entry is more than 11 months ago. Derive this from `entries` — sort and take the first date. If `entries.length === 0` or the earliest entry is within 11 months, hide the year row entirely.

**Direction:**

```tsx
// In CalendarHeatmap, derive from props:
const hasMultiYearData = (() => {
  if (!entries.length) return false;
  const earliest = entries.map(e => e.date).sort()[0];
  const earliestYear = parseInt(earliest.split("-")[0], 10);
  return currentYear - earliestYear >= 1;
})();

// Conditionally render:
{hasMultiYearData && (
  <div className="mb-1 flex items-center justify-center gap-8">
    {/* year row */}
  </div>
)}
```

When the year row is absent, the month navigation moves up slightly. The layout gains breathing room above the month heading. When the year row appears (after ~12 months of data), it slides in without surprise — the user has been using the app long enough to expect it.

**Calma note:** This is Calma's "controls that only become relevant at a specific state may appear contextually" principle. The year selector is only relevant when data spans multiple years. Its absence when irrelevant is not confusing — it's calm.

**Mockup:** [View mockup](./mockup-2026-03-15-0940.html#h2-year-row)

**Effort estimate:** Low. One conditional render wrapping the existing year row JSX. The `entries` prop is already available in `CalendarHeatmap`.

---

### H3 — Frequency bar: taller and full-width

**What to change:** Remove the 38% max-width cap and increase the bar height from `h-0.5` (2px) to `h-1` (4px). Let the top item's bar run to the full row width (100%), with all other bars proportional to it. This makes relative differences between habits legible at a glance without adding any numeric data.

**Direction — two changes in `FrequencyList.tsx`:**

```tsx
// Line 133 — remove the *38 cap:
const barWidth = `${Math.round((item.count / maxCount) * 100)}%`;

// Line 153 — increase bar height:
<div className="mt-1.5 h-1 w-full rounded-full">
```

That's it. No other changes. The `scaleX` animation, `transformOrigin`, and color treatment all stay identical.

**Why not add the count number:** A precise count creates an implicit target. A user who sees "22" inevitably thinks about "25 next month." The bar communicates rhythm and relative proportion — the right framing for a reflection tool — without anchoring to a goal. Approximate comparison is a feature, not a limitation. This aligns with the explicit rejection of BJ Fogg's extrinsic motivation loops documented in `docs/calm-research.md`.

**Calma note:** No Calma rules touched. The bar's qualitative encoding is consistent with Calma's philosophy that this is a tool for feeling patterns, not measuring them. Making it more expressive is a craft improvement, not a philosophical shift.

**Mockup:** [View mockup](./mockup-2026-03-15-0940.html#h3-bar-refinement)

**Effort estimate:** Low. Two one-line changes in `FrequencyList.tsx`. No logic changes, no new state, no component changes.

---

### H4 — Period selector: enclosed pill group

**What to change:** Replace the floating text buttons with an enclosed segmented pill control — the same pattern recommended in `ux-radical-evaluation-2026-03-14-2130.md` (S1) for the Settings Theme toggle. The active period gets a filled stone indicator; inactive periods use transparent background with muted text.

**Direction:**

```tsx
<div className="mt-5 mb-6 flex justify-center">
  <div className="inline-flex rounded-full border border-stone-200 dark:border-stone-700 p-0.5">
    {(["month", "3m", "always"] as Period[]).map((p, i) => (
      <button
        key={p}
        type="button"
        onClick={() => handlePeriodChange(p)}
        className={`rounded-full px-3 py-1 text-xs uppercase tracking-widest transition-colors ${
          period === p
            ? "bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900"
            : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
        }`}
      >
        {p === "month" ? "Month" : p === "3m" ? "3 Months" : "Always"}
      </button>
    ))}
  </div>
</div>
```

The `·` separators between options are removed — the enclosure makes them unnecessary. The `handlePeriodChange` logic in `HistoryView.tsx` is unchanged.

**Calma note:** Direct application of the Calma "chip / tag variant" at the selection control level — an enclosed pill group where the active option uses the primary button token. This makes the selected period unmistakable. The dots-as-separators pattern (a design quirk from an earlier sprint) disappears — its purpose was to suggest separation between choices that now have an explicit container.

Note: this matches the S1 proposal for the Settings Theme toggle. If both ship in the same sprint, the two segmented pills should look identical — one source of truth for the component would be ideal.

**Mockup:** [View mockup](./mockup-2026-03-15-0940.html#h4-period-pill)

**Effort estimate:** Low. Changes the period selector div in `HistoryView.tsx:135–150`. No logic changes.

---

## Sprint recommendations

| Priority | Proposal | File(s) | Effort | Rationale |
|---|---|---|---|---|
| 1 | H1 — Date-as-weight calendar | `CalendarHeatmap.tsx` | Medium | Resolves the core GitHub resemblance problem. The most visible change on the page. Should be the centrepiece of any History sprint. |
| 2 | H3 — Frequency bar: taller + full-width | `FrequencyList.tsx` | Low | Two one-line changes that make relative differences legible. Trivial to ship alongside H1. |
| 3 | H4 — Period selector pill group | `HistoryView.tsx` | Low | Fixes an affordance gap flagged across two reports now. Can share a sprint with the Settings S1 Theme toggle — same pattern, same effort level. |
| 4 | H2 — Conditional year row | `CalendarHeatmap.tsx` | Low | Low urgency — most users won't have multi-year data yet. Worth doing before the one-year anniversary of any user's first entry. Can be bundled with H1 since both touch `CalendarHeatmap.tsx`. |

H1 and H2 both touch `CalendarHeatmap.tsx` and should be batched in the same pass.

H3 touches `FrequencyList.tsx` and H4 touches `HistoryView.tsx` — both trivial, appropriate for the same polish sprint.

---

## On the Ma Seasonal Tapestry proposal

The proposal is philosophically well-aimed. Its core argument — that colored squares make Clarity look like a developer productivity tool, and that typographic encoding would feel more personal and reflective — is correct, and H1 above implements exactly that in its simplest form.

The full 5-style system (Typographic Rhythm / Weave / Petals / Mist / Field) should not be implemented as specified. The reasons:

1. **User choice creates decision cost.** Presenting five visualization styles requires the user to evaluate and select one. Calma doesn't do configurability for its own sake — every option adds cognitive friction that needs to be justified. Five styles for the same data is not justified.

2. **Dynamic CSS classes break Tailwind's purge.** The Typographic Rhythm style requires per-cell `tracking-*` and `font-*` classes generated at runtime. Tailwind v4 can handle this via inline CSS, but it's a constraint worth naming. The Weave and Field styles would require inline SVG or Canvas rendering, which is significantly more complex.

3. **The philosophical goal is achievable with one style.** H1 does what the proposal wants — type carries data, no colored boxes, amber for joy — without asking the user to become a designer. The five-style system treats the visualization as a feature to be explored. H1 treats it as a quiet, considered design decision.

The Weave, Petals, Mist, and Field directions are genuinely interesting. They belong in the feature explorer backlog for a future sprint where the exploration is the point — perhaps a "seasonal themes" sprint that gives users a way to choose their visual personality. That's a different product bet than fixing the GitHub resemblance, and it shouldn't block the fix.

---

## Open questions

- **H1 and the sunset blend:** The two-axis blend (dusk blue / warm ember) was a considered decision in the current implementation. H1 retires it from the calendar cells in favor of stone-weight + amber-for-joy. The philosophical trade-off is: the blend communicates "structural habits vs. emotional moments" as a split signal; H1 collapses that to "anything active vs. joy." This is a simplification. If the distinction between habit completion and joy/moments matters to the user's reading of their history, H1 loses information. Worth discussing before implementing.

- **H4 and HistoryView's `handlePeriodChange` debounce:** The 120ms `setTimeout` in `handlePeriodChange` (`HistoryView.tsx:53–57`) creates a brief `isUpdating` state that fades the frequency list. This pattern should survive the H4 change unchanged — the pill group calls the same handler.

- **Frequency section when empty:** Currently the `{entries.length > 0 &&}` guard prevents the Frequency section from rendering with no data. But when there IS data and a specific month is viewed that has no entries, the frequency list shows "Nothing logged in this period." The Frequency toggle still appears in this state, which makes the section feel like a dead end. Consider whether the toggle should be hidden when the current period has no data — or whether the empty state message is sufficient.
