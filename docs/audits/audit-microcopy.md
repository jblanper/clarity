# Microcopy & Tone Audit

Audited files: `CheckInForm.tsx`, `SettingsView.tsx`, `ManageView.tsx`, `HelpView.tsx`, `DayDetail.tsx`, `HistoryView.tsx`, `FrequencyList.tsx`, `BottomNav.tsx`, `CalendarHeatmap.tsx`, `lib/transferData.ts`, `app/layout.tsx`.
Date: 2026-03-13.

Sprint 9 context: Task 5 added "Start at" field labels and `placeholder="0"` to both ManageView numeric habit forms. No other user-facing strings were added or changed in Sprint 9. The HabitToggle redesign (Task 3) and NumberStepper redesign (Task 4) retained existing `aria-label` patterns without introducing new copy.

---

## 1. Tone Violations

### Technical language

**None found.** All technical terms from prior sprints remain resolved. ✅

### Vague / generic

**None found.** ✅

### Flat / functional phrasing

| Location | Current copy | Issue | Severity |
|---|---|---|---|
| `CheckInForm.tsx:190` | "Please enter a name." | The "Please" reads as a warning tone rather than warmth. | Low (pre-existing) |
| `CheckInForm.tsx:197` | "A moment with that name already exists." | Clinical; sounds like a database constraint error. | Low (pre-existing) |

---

## 2. New Sprint 9 Copy — "Start at" field

### Field label

| Location | Current copy | Assessment |
|---|---|---|
| `ManageView.tsx:349` (inline edit) | `Start at · ${editingHabit.unit}` or `"Start at"` when no unit | ✅ Correct Calma dot-separator usage. Dynamic unit suffix is informative without being verbose. |
| `ManageView.tsx:522` (add-habit form) | `Start at · ${addHabit.unit}` or `"Start at"` when no unit | ✅ Same pattern — consistent between both form paths. |

The Calma dot separator (`·`) is used here as a secondary qualifier, consistent with the established pattern (e.g. `text-xs uppercase tracking-widest` uses `·` in ManageView section dividers). ✅

### Placeholder text

| Location | Current copy | Sprint plan specified | Assessment |
|---|---|---|---|
| `ManageView.tsx:355` (inline edit) | `placeholder="0"` | `placeholder="Optional"` | **Low deviation** — `"0"` is technically accurate (field defaults to 0 if blank) but `"Optional"` would better communicate that the field is skippable. Noted in Architecture Review as M1. |
| `ManageView.tsx:528` (add-habit form) | `placeholder="0"` | `placeholder="Optional"` | **Low deviation** — same issue as above. |

The `"0"` placeholder is not harmful (it matches the implicit default), but it may mislead users into thinking they must enter a value. "Optional" would be clearer. This is a low-severity deviation from the sprint plan spec.

---

## 3. Empty State Audit

| Location | Current copy | Assessment |
|---|---|---|
| `DayDetail.tsx:166` | "Nothing here yet" | ✅ Inviting. |
| `FrequencyList.tsx:110–112` | "Nothing logged in this period" | ✅ Neutral and accurate. |
| `HistoryView.tsx:161–164` | "Your days will appear here once you start logging." | ✅ Fixed in Sprint 8. |

---

## 4. Confirmation and Feedback Messages

| Location | Current copy | Assessment |
|---|---|---|
| `CheckInForm.tsx:503` | "Day captured" | ✅ Perfect. Brief, human. |
| `CheckInForm.tsx:501` | "Saving..." | ✅ Acceptable in-progress state. |
| `ManageView.tsx:403, 632` | "Archived. Past entries are preserved." | ✅ Calm and reassuring. |
| `SettingsView.tsx:248–254` | "{n} days added." / "{n} days were already in your history and weren't changed." | ✅ Fixed in Sprint 8. |

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
| `CheckInForm.tsx:190` | "Please enter a name." | Low — functional but cold. |
| `CheckInForm.tsx:197` | "A moment with that name already exists." | Low — clinical. |

---

## 6. Placeholder Text

| Location | Current copy | Assessment |
|---|---|---|
| `CheckInForm.tsx:484` | "Anything about today worth remembering?" | ✅ Warm, open, non-directive. |
| `CheckInForm.tsx:394` | "e.g. Morning light" | ✅ Fixed in Sprint 8. |
| `ManageView.tsx:472` | "e.g. Stretching" / "e.g. Running" | ✅ Good. |
| `ManageView.tsx:501` | "e.g. km, pages, cups" | ✅ Good. |
| `ManageView.tsx:666` | "e.g. Long walk" | ✅ Good. |
| `ManageView.tsx:355, 528` | `"0"` (Start at fields, both forms) | Low — see §2 above. Sprint plan specified `"Optional"`. |

---

## 7. ARIA Labels — Sprint 9 components

| Element | Location | Label | Assessment |
|---|---|---|---|
| HabitToggle full-row button | HabitToggle.tsx:27 | `aria-label={label}` — resolves to the habit label string (e.g. "Morning walk") | ✅ Accurate. Combined with `role="switch"` and `aria-checked`, screen readers announce "Morning walk, switch, on/off". |
| NumberStepper pill button | NumberStepper.tsx:65 | `aria-label={label}` — resolves to the habit label (e.g. "Sleep") | ✅ Accurate for the control context. `role="spinbutton"` and `aria-valuenow` provide the value. |
| NumberStepper decrement button | NumberStepper.tsx:53 | `` aria-label={`Decrease ${label}`} `` — e.g. "Decrease Sleep" | ✅ Clear, actionable. |

---

## 8. Joy by Default Copy

| Location | Current copy | Assessment |
|---|---|---|
| `ManageView.tsx:288` (active habits list) | "Brings joy by default" / "Tap to mark as joyful by default" | ✅ Clear and inviting. |
| `ManageView.tsx:490` (add-habit form) | "Brings joy by default" / "Joy is marked separately" | ✅ Fixed in Sprint 8. |

---

## 9. Consistency Check

All terminology (Moments, Habits, Reflection, Archive/Restore, History, Start at) is internally consistent. ✅

"Start at" is used verbatim in both ManageView forms and in the NumberStepper's `startAt` prop documentation. ✅

Navigation items render consistently via CSS `uppercase` class across all pages. ✅

Save flow states: idle → "Save" → "Saving..." → "Day captured". ✅

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

Sprint 9 introduced 1 new low finding (ManageView "Start at" placeholder `"0"` vs sprint-plan-specified `"Optional"`, in both form paths). The 2 pre-existing low findings (CheckInForm inline validation messages) carry forward. No new medium or high findings.
