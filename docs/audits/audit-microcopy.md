# Microcopy & Tone Audit

Generated: 2026-03-14 00:00

Archived previous report → docs/audits/archive/audit-microcopy-2026-03-14.md

Audited files: `CheckInForm.tsx`, `SettingsView.tsx`, `ManageView.tsx`, `HelpView.tsx`, `DayDetail.tsx`, `HistoryView.tsx`, `FrequencyList.tsx`, `BottomNav.tsx`, `CalendarHeatmap.tsx`, `lib/transferData.ts`, `app/layout.tsx`.

Sprint 11 context: Task 2 branched save-button labels on `isEditMode` — new entries now use `"Capture"` / `"Capturing…"` / `"Day captured"`; edit path retains `"Save"` / `"Saving…"` / `"Saved"`. Task 4 replaced the `EDIT` section-label link with `"Edit this day"` tertiary button in DayDetail. No other user-facing strings were changed.

---

## 1. Tone Violations

### Technical language

**None found.** ✅

### Vague / generic

**None found.** ✅

### Accusatory or guilt-inducing

**None found.** All empty-state messages remain inviting. ✅

### Exclamation marks / ALL CAPS

**None found.** Navigation items use CSS `uppercase` class, not string-level ALL CAPS. ✅

### Flat / functional phrasing

| Location | Current copy | Issue | Severity |
|---|---|---|---|
| `CheckInForm.tsx:190` | "Please enter a name." | The "Please" reads as a warning tone rather than warmth. | Low (pre-existing) |
| `CheckInForm.tsx:197` | "A moment with that name already exists." | Clinical; sounds like a database constraint error. | Low (pre-existing) |

---

## 2. Sprint 11 Copy Changes

### Save button labels (CheckInForm.tsx:500–504)

| Path | idle | saving | confirmed | Assessment |
|---|---|---|---|---|
| New entry | `"Capture"` | `"Capturing…"` | `"Day captured"` | ✅ Excellent. Single root verb `capture` carries through all three states. Human and analogue in register. Consistent with Calma tone. |
| Edit mode | `"Save"` | `"Saving…"` | `"Saved"` | ✅ Appropriate for edit context — precise, brief, no false ceremony. |

The branching is correctly implemented via `isEditMode`. ✅

### "Edit this day" link (DayDetail.tsx:265–267)

| Previous | Current | Assessment |
|---|---|---|
| `"Edit"` (section-label-styled uppercase link) | `"Edit this day"` (tertiary button) | ✅ More specific and action-oriented. Lowercase reads as a considered phrase, not a heading. Matches Calma's human register. |

---

## 3. Empty State Audit

| Location | Current copy | Assessment |
|---|---|---|
| `DayDetail.tsx:166` | "Nothing here yet" | ✅ Inviting, not accusatory. |
| `FrequencyList.tsx:110–112` | "Nothing logged in this period" | ✅ Neutral and accurate. |
| `HistoryView.tsx:88–92` | "Your days will appear here once you start logging." | ✅ Now correctly positioned below the heatmap (Sprint 11 Task 5 fix). |

---

## 4. Confirmation and Feedback Messages

| Location | Current copy | Assessment |
|---|---|---|
| `CheckInForm.tsx:503` | `"Day captured"` (new entry) | ✅ Perfect. Brief, human. |
| `CheckInForm.tsx:503` | `"Saved"` (edit mode) | ✅ Appropriate. |
| `CheckInForm.tsx:501` | `"Capturing…"` (new entry saving) | ✅ In-progress state consistent with the root verb. |
| `CheckInForm.tsx:501` | `"Saving…"` (edit mode saving) | ✅ Unchanged from Sprint 9. |
| `ManageView.tsx:403, 632` | "Archived. Past entries are preserved." | ✅ Calm and reassuring. |
| `SettingsView.tsx:248–254` | "{n} days added." / "{n} days were already in your history and weren't changed." | ✅ |

---

## 5. Error Message Audit

All errors follow the pattern: calm, specific, tells the user what to do next.

| Location | Current copy | Assessment |
|---|---|---|
| `transferData.ts:111` | "That file doesn't look right — try exporting a fresh backup." | ✅ |
| `transferData.ts:115–118` | "This doesn't look like a Clarity backup — try exporting a fresh one." | ✅ |
| `transferData.ts:122–124` | "No recognisable entries were found in that file." | ✅ |
| `transferData.ts:167, 178` | "Couldn't read that file — try a different one." | ✅ |
| `SettingsView.tsx:185–188` | "Couldn't download the backup — try again." | ✅ |
| `CheckInForm.tsx:190` | "Please enter a name." | Low — functional but cold. Pre-existing. |
| `CheckInForm.tsx:197` | "A moment with that name already exists." | Low — clinical. Pre-existing. |

---

## 6. Placeholder Text

| Location | Current copy | Assessment |
|---|---|---|
| `CheckInForm.tsx:484` | "Anything about today worth remembering?" | ✅ Warm, open, non-directive. |
| `CheckInForm.tsx:394` | "e.g. Morning light" | ✅ |
| `ManageView.tsx:472` | "e.g. Stretching" / "e.g. Running" | ✅ |
| `ManageView.tsx:501` | "e.g. km, pages, cups" | ✅ |
| `ManageView.tsx:666` | "e.g. Long walk" | ✅ |
| `ManageView.tsx:355, 528` | `"0"` (Start at fields, both forms) | Low — Sprint plan specified `"Optional"`. Pre-existing carry-forward. |

---

## 7. ARIA Labels

| Element | Location | Label | Assessment |
|---|---|---|---|
| HabitToggle full-row button | HabitToggle.tsx:27 | `aria-label={label}` | ✅ |
| NumberStepper pill button | NumberStepper.tsx:65 | `aria-label={label}` | ✅ |
| NumberStepper decrement button | NumberStepper.tsx:53 | `` aria-label={`Decrease ${label}`} `` | ✅ |
| MomentChip | MomentChip.tsx:14 | `aria-pressed={selected}` | ✅ State communicated to screen readers. |
| DayDetail close button | DayDetail.tsx:149 | `aria-label="Close"` | ✅ |
| DayDetail dialog | DayDetail.tsx:126 | `aria-label={\`Details for ${date}\`}` | ✅ Specific. |

---

## 8. Consistency Check

All terminology (Moments, Habits, Reflection, Archive/Restore, History, Start at, Highlights) is internally consistent. ✅

"Highlights" is now used in both CheckInForm (Joy section heading) and DayDetail (joy-marked habits display). The same word for the same concept across both surfaces. ✅

New entry save flow: idle → `"Capture"` → `"Capturing…"` → `"Day captured"`. Single root verb. ✅

Edit mode save flow: idle → `"Save"` → `"Saving…"` → `"Saved"`. ✅

"Edit this day" vs earlier "Edit" label: the expanded phrase is more deliberate and contextually specific. ✅

---

## Suggested rewrites for remaining low-severity items

| Location | Current | Suggested |
|---|---|---|
| `CheckInForm.tsx:190` | "Please enter a name." | "Give this moment a name." |
| `CheckInForm.tsx:197` | "A moment with that name already exists." | "You've already got a moment called that." |
| `ManageView.tsx:355, 528` | `placeholder="0"` (Start at fields) | `placeholder="Optional"` |

---

## Summary

**0 high · 0 medium · 3 low**

Sprint 11 introduced no new findings. The "Capture" label branching is a net improvement — unifies the three-state progression around a single root verb and strengthens Calma's human, analogue register. The "Edit this day" label upgrade is a minor improvement. Carry-forward lows (3) unchanged from Sprint 9 baseline.
