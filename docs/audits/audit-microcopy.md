# Microcopy & Tone Audit

Audited files: `CheckInForm`, `SettingsView`, `ManageView`, `HelpView`, `DayDetail`, `HistoryView`, `FrequencyList`, `BottomNav`, `CalendarHeatmap`, `lib/transferData.ts`, `app/layout.tsx`.
Date: 2026-03-06.

Sprint 7 context: no microcopy changes in this sprint. All findings carry forward from the 2026-03-03 baseline.

---

## 1. Tone Violations

### Technical language

| Location | Current copy | Issue |
|---|---|---|
| `SettingsView.tsx:175–177` | "Download all your habit entries as a JSON backup file." | "JSON" is developer jargon. Users don't need to know the format. |
| `transferData.ts:111` | "The file is not valid JSON. Please choose a habits-backup.json file." | "valid JSON" is technical; referencing the filename assumes the user hasn't renamed it. |
| `transferData.ts:115–118` | "Unrecognised file format. Only files exported from Clarity are supported." | "Unrecognised file format" is system-speak. |
| `transferData.ts:122–124` | "No valid entries found in the file." | "valid entries" is technical — sounds like a database log. |
| `transferData.ts:167, 178` | "Failed to read the file." | "Failed" is alarming; gives the user no path forward. |
| `ManageView.tsx:416–425` | "Boolean" / "Numeric" (habit type selector) | Both terms are developer jargon; "Boolean" especially is opaque to non-technical users. |
| `ManageView.tsx:483` | Field label: "Step" (numeric habit) | "Step" is unexplained — the user must guess it means increment size. |

### Vague / generic

| Location | Current copy | Issue |
|---|---|---|
| `SettingsView.tsx:186–188` | "Something went wrong. Please try again." (export error) | Vague. Tells the user nothing about what happened or what to try. |
| `SettingsView.tsx:79–81` | "Something went wrong. Please try again." (import fallback) | The specific error from `transferData.ts` is already better — this fallback swallows the useful message. |

### Flat / functional phrasing

| Location | Current copy | Issue |
|---|---|---|
| `ManageView.tsx:465` | "♡ Does not bring joy by default" | States the absence like a property sheet entry; reads like a config flag. |
| `CheckInForm.tsx:190` | "Please enter a name." | The "Please" functions as a warning tone rather than warmth. |
| `CheckInForm.tsx:197` | "A moment with that name already exists." | Clinical; sounds like a database constraint error. |

---

## 2. Empty State Audit

| Location | Current copy | Assessment |
|---|---|---|
| `DayDetail.tsx:165` | "Nothing here yet" | ✅ Inviting. Feels like an open door, not an accusation. |
| `FrequencyList.tsx:110–112` | "Nothing logged in this period" | ✅ Neutral and accurate. |
| `HistoryView` / `CalendarHeatmap` | *(no message)* | **Missing.** New users see a grid of pale grey cells with no explanation. No copy orients them to what the calendar will look like once they start logging. |

**Suggested addition** (History page, shown only when `entries.length === 0`):
> "Your days will appear here once you start logging."

---

## 3. Confirmation and Feedback Messages

| Location | Current copy | Assessment |
|---|---|---|
| `CheckInForm.tsx:500` | "Day captured" | ✅ Perfect. Brief, human. |
| `CheckInForm.tsx:498` | "Saving..." | ✅ Acceptable in-progress state. |
| `ManageView.tsx:379, 589` | "Archived. Past entries are preserved." | ✅ Calm and reassuring. |
| `SettingsView.tsx:248–259` | "{n} entries imported." / "{n} entries already existed and were kept." | **Flag.** "entries imported" reads like a system log. "already existed" echoes database language. Suggested: "{n} days added." / "{n} days were already in your history and weren't changed." |

---

## 4. Error Message Audit

All errors should follow the pattern: calm, specific, tells the user what to do next.

| Location | Current copy | Issue | Suggested revision |
|---|---|---|---|
| `transferData.ts:111` | "The file is not valid JSON. Please choose a habits-backup.json file." | Technical; assumes the filename. | "That doesn't look like a backup file — try exporting a fresh one from Settings." |
| `transferData.ts:115–118` | "Unrecognised file format. Only files exported from Clarity are supported." | System-speak. | "That file doesn't look right — only backups exported from Clarity will work." |
| `transferData.ts:122–124` | "No valid entries found in the file." | "valid entries" is technical. | "The file didn't contain any entries we could read — try exporting a fresh backup." |
| `transferData.ts:167, 178` | "Failed to read the file." | "Failed" is alarming; no action path. | "Something stopped us from reading that file — try again." |
| `SettingsView.tsx:186–188` | "Something went wrong. Please try again." (export) | Vague; no action. | "Couldn't download the backup — try again." |
| `SettingsView.tsx:79–81` | "Something went wrong. Please try again." (import fallback) | Swallows the specific message from `transferData.ts`. | *(Use the thrown error message directly)* |
| `CheckInForm.tsx:190` | "Please enter a name." | Functional but cold. | "Give this moment a name." |
| `CheckInForm.tsx:197` | "A moment with that name already exists." | Clinical. | "You've already got a moment called that." |

---

## 5. Placeholder Text

| Location | Current copy | Assessment |
|---|---|---|
| `CheckInForm.tsx:481` | "Anything about today worth remembering?" | ✅ Excellent. Warm, open, non-directive. |
| `ManageView.tsx:448` | "e.g. Stretching" / "e.g. Running" | ✅ Good. |
| `ManageView.tsx:477` | "e.g. km, pages, cups" | ✅ Good. |
| `ManageView.tsx:622` | "e.g. Long walk" | ✅ Good. |
| `CheckInForm.tsx:392` | "Moment name" | **Flag.** Functional, not inviting — a form-field label that leaked into the placeholder. Suggested: "e.g. Morning light" |

---

## 6. Consistency Check

All terminology (Moments, Habits, Reflection, Archive/Restore, History) is internally consistent. ✅

Navigation items render consistently via CSS `uppercase` class across all pages. ✅

---

## Summary of Priority Fixes

**High** — error flows users will hit:
1. `transferData.ts:111, 115, 122` — Replace technical error messages with the calm/specific pattern.
2. `transferData.ts:167, 178` — "Failed to read the file." → "Something stopped us from reading that file — try again."
3. `SettingsView.tsx:186–188` — Export error: specific message, not the generic fallback.
4. `SettingsView.tsx:175–177` — Remove "JSON" from the export description.

**Medium** — visible in normal use:
5. `ManageView.tsx:416–425` — Replace "Boolean"/"Numeric" with plain-language equivalents.
6. `SettingsView.tsx:248–259` — Import success copy reads like a system log; soften it.
7. `CheckInForm.tsx:392` — Placeholder "Moment name" → "e.g. Morning light".
8. `ManageView.tsx:465` — "Does not bring joy by default" → warmer phrasing.
9. `ManageView.tsx:483` — "Step" field label → "Increment" or add an inline hint.

**Low** — edge cases or polish:
10. `HistoryView` — Add a first-use empty state when `entries.length === 0`.
11. `CheckInForm.tsx:197` — "A moment with that name already exists." → "You've already got a moment called that."

---

## Summary

**4 high · 5 medium · 2 low**

No changes from the pre-sprint baseline. No regressions. No improvements — microcopy was outside Sprint 7 scope.
