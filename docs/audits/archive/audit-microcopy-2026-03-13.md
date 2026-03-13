# Microcopy & Tone Audit

Audited files: `CheckInForm.tsx`, `SettingsView.tsx`, `ManageView.tsx`, `HelpView.tsx`, `DayDetail.tsx`, `HistoryView.tsx`, `FrequencyList.tsx`, `BottomNav.tsx`, `CalendarHeatmap.tsx`, `lib/transferData.ts`, `app/layout.tsx`.
Date: 2026-03-08.

Sprint 8 context: Task 5 replaced all technical error messages in transferData.ts, replaced "Boolean"/"Numeric" with "Yes / No"/"Number" in ManageView, renamed both "Step" labels to "Increment", updated CheckInForm moment placeholder, updated import success copy, updated export description, and updated export error message. Task 3 replaced "Does not bring joy by default" with "Joy is marked separately" in the ManageView add-habit form. Task 6 added History empty state.

---

## 1. Tone Violations

### Technical language

**None found.** All technical terms from the pre-sprint baseline have been resolved:

| Location | Previous | Current | Status |
|---|---|---|---|
| `SettingsView.tsx:175–177` | "Download all your habit entries as a JSON backup file." | "Download a backup of all your entries." | ✅ Fixed |
| `transferData.ts:111` | "The file is not valid JSON. Please choose a habits-backup.json file." | "That file doesn't look right — try exporting a fresh backup." | ✅ Fixed |
| `transferData.ts:115–118` | "Unrecognised file format. Only files exported from Clarity are supported." | "This doesn't look like a Clarity backup — try exporting a fresh one." | ✅ Fixed |
| `transferData.ts:122–124` | "No valid entries found in the file." | "No recognisable entries were found in that file." | ✅ Fixed |
| `transferData.ts:167, 178` | "Failed to read the file." | "Couldn't read that file — try a different one." | ✅ Fixed |
| `ManageView.tsx:417` | "Boolean" (habit type selector) | "Yes / No" | ✅ Fixed |
| `ManageView.tsx:423` | "Numeric" (habit type selector) | "Number" | ✅ Fixed |
| `ManageView.tsx:332, 486` | "Step" field label (inline edit + add-habit form) | "Increment" | ✅ Fixed |

### Vague / generic

**None found.** Both generic error messages have been resolved:

| Location | Previous | Current | Status |
|---|---|---|---|
| `SettingsView.tsx:185–188` | "Something went wrong. Please try again." (export error) | "Couldn't download the backup — try again." | ✅ Fixed |
| `SettingsView.tsx:79–81` | "Something went wrong. Please try again." (import fallback) | Uses `err.message` from `transferData.ts` directly when `err instanceof Error` | ✅ Fixed |

### Flat / functional phrasing

| Location | Current copy | Issue |
|---|---|---|
| `CheckInForm.tsx:190` | "Please enter a name." | The "Please" functions as a warning tone rather than warmth. Low priority. |
| `CheckInForm.tsx:197` | "A moment with that name already exists." | Clinical; sounds like a database constraint error. Low priority. |

---

## 2. Empty State Audit

| Location | Current copy | Assessment |
|---|---|---|
| `DayDetail.tsx:166` | "Nothing here yet" | ✅ Inviting. Feels like an open door, not an accusation. |
| `FrequencyList.tsx:110–112` | "Nothing logged in this period" | ✅ Neutral and accurate. |
| `HistoryView.tsx:161–164` | "Your days will appear here once you start logging." | ✅ Fixed in Sprint 8. Appears below calendar when `entries.length === 0`. |

---

## 3. Confirmation and Feedback Messages

| Location | Current copy | Assessment |
|---|---|---|
| `CheckInForm.tsx:499` | "Day captured" | ✅ Perfect. Brief, human. |
| `CheckInForm.tsx:498` | "Saving..." | ✅ Acceptable in-progress state. |
| `ManageView.tsx:379, 589` | "Archived. Past entries are preserved." | ✅ Calm and reassuring. |
| `SettingsView.tsx:248–254` | "{n} days added." / "{n} days were already in your history and weren't changed." | ✅ Fixed in Sprint 8. |

---

## 4. Error Message Audit

All errors follow the pattern: calm, specific, tells the user what to do next.

| Location | Current copy | Assessment |
|---|---|---|
| `transferData.ts:111` | "That file doesn't look right — try exporting a fresh backup." | ✅ Calm, specific, actionable |
| `transferData.ts:115–118` | "This doesn't look like a Clarity backup — try exporting a fresh one." | ✅ Calm, specific, actionable |
| `transferData.ts:122–124` | "No recognisable entries were found in that file." | ✅ Accurate, not alarming |
| `transferData.ts:167, 178` | "Couldn't read that file — try a different one." | ✅ Calm, actionable |
| `SettingsView.tsx:185–188` | "Couldn't download the backup — try again." | ✅ Specific, calm |
| `CheckInForm.tsx:190` | "Please enter a name." | Low — functional but cold. "Give this moment a name." would be warmer. |
| `CheckInForm.tsx:197` | "A moment with that name already exists." | Low — clinical. "You've already got a moment called that." would be warmer. |

---

## 5. Placeholder Text

| Location | Current copy | Assessment |
|---|---|---|
| `CheckInForm.tsx:481` | "Anything about today worth remembering?" | ✅ Excellent. Warm, open, non-directive. |
| `CheckInForm.tsx:392` | "e.g. Morning light" | ✅ Fixed in Sprint 8 — was "Moment name". |
| `ManageView.tsx:450` | "e.g. Stretching" / "e.g. Running" | ✅ Good. |
| `ManageView.tsx:479` | "e.g. km, pages, cups" | ✅ Good. |
| `ManageView.tsx:625` | "e.g. Long walk" | ✅ Good. |

---

## 6. Joy by default copy

| Location | Current copy | Assessment |
|---|---|---|
| `ManageView.tsx:285` (active habits list) | "Brings joy by default" / "Tap to mark as joyful by default" | ✅ Clear and inviting — active/inactive states both appropriate |
| `ManageView.tsx:468` (add-habit form) | "Brings joy by default" / "Joy is marked separately" | ✅ Fixed in Sprint 8 — inactive state updated from "Does not bring joy by default" |

---

## 7. Consistency Check

All terminology (Moments, Habits, Reflection, Archive/Restore, History) is internally consistent. ✅

Navigation items render consistently via CSS `uppercase` class across all pages. ✅

Save flow states: idle → "Save" (primary button) → "Saving..." → "Day captured". ✅

---

## Suggested rewrites for remaining low-severity items

| Location | Current | Suggested |
|---|---|---|
| `CheckInForm.tsx:190` | "Please enter a name." | "Give this moment a name." |
| `CheckInForm.tsx:197` | "A moment with that name already exists." | "You've already got a moment called that." |

---

## Summary

**0 high · 0 medium · 2 low**

Sprint 8 resolved all 4 high and all 5 medium findings from the pre-sprint baseline. The 2 remaining low findings (CheckInForm inline validation messages) are edge cases encountered only on error paths and carry forward for a future polish pass.
