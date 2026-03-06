# Microcopy & Tone Audit

Audited files: `CheckInForm`, `SettingsView`, `ManageView`, `HelpView`, `DayDetail`, `HistoryView`, `FrequencyList`, `BottomNav`, `CalendarHeatmap`, `lib/transferData.ts`, `app/layout.tsx`.

---

## 1. Tone Violations

### Technical language

| Location | Current copy | Issue |
|---|---|---|
| `SettingsView.tsx:175–177` | "Download all your habit entries as a JSON backup file." | "JSON" is developer jargon. Users don't need to know the format. |
| `transferData.ts:111` | "The file is not valid JSON. Please choose a habits-backup.json file." | "valid JSON" is technical. Referencing the internal filename `habits-backup.json` assumes the user hasn't renamed it. |
| `transferData.ts:115–118` | "Unrecognised file format. Only files exported from Clarity are supported." | "Unrecognised file format" is a system-speak phrase. |
| `transferData.ts:122–124` | "No valid entries found in the file." | "valid entries" is technical — sounds like a database log. |
| `transferData.ts:167, 178` | "Failed to read the file." | "Failed" is alarming and gives the user nothing to act on. |
| `ManageView.tsx:416–425` | "Boolean" / "Numeric" (habit type selector) | Both terms are developer jargon. "Boolean" especially is opaque to non-technical users. |
| `ManageView.tsx:483` | Field label: "Step" (numeric habit) | "Step" is unexplained. The user needs to guess this means the increment size. |

### Vague / generic

| Location | Current copy | Issue |
|---|---|---|
| `SettingsView.tsx:186–188` | "Something went wrong. Please try again." (export error) | Vague. Tells the user nothing about what happened or what to try. |
| `SettingsView.tsx:79–81` | "Something went wrong. Please try again." (import fallback) | Same. The specific error from `transferData.ts` is already more useful — this fallback should mirror that tone. |

### Flat / functional phrasing

| Location | Current copy | Issue |
|---|---|---|
| `ManageView.tsx:465` | "♡ Does not bring joy by default" | States the absence like a property sheet entry. Reads like a config flag, not a human observation. |
| `CheckInForm.tsx:190` | "Please enter a name." | The "Please" here functions as a warning tone rather than warmth. |
| `CheckInForm.tsx:197` | "A moment with that name already exists." | Clinical. Sounds like a database constraint error. |

---

## 2. Empty State Audit

| Location | Current copy | Assessment |
|---|---|---|
| `DayDetail.tsx:165` | "Nothing here yet" | ✓ Inviting. Feels like an open door, not an accusation. |
| `FrequencyList.tsx:110–112` | "Nothing logged in this period" | ✓ Neutral and accurate. Appropriate for a data view. |
| `HistoryView` / `CalendarHeatmap` | *(no message)* | **Missing empty state.** When a new user visits History, they see a grid of pale grey cells with no explanation. No copy orients them. A first-time visitor may not realise that cells fill in as they log. |

**Suggested addition** (History page, shown only when `entries.length === 0`):
> "Your days will appear here once you start logging."

---

## 3. Confirmation and Feedback Messages

| Location | Current copy | Assessment |
|---|---|---|
| `CheckInForm.tsx:500` | "Day captured" | ✓ Perfect. Brief, human, not a system message. |
| `CheckInForm.tsx:498` | "Saving..." | ✓ Acceptable in-progress state. |
| `ManageView.tsx:379, 589` | "Archived. Past entries are preserved." | ✓ Good. Calm and reassuring — addresses the implicit anxiety that archiving destroys history. |
| `SettingsView.tsx:248–259` | "{n} entries imported." / "{n} entries already existed and were kept." | **Flag.** "entries imported" reads like a system log. The second line is accurate but its phrasing ("already existed") echoes database language. Suggested: "{n} days added." / "{n} days were already in your history and weren't changed." |

---

## 4. Error Message Audit

All errors should follow the pattern: calm, specific, tells the user what to do next. The established model from CLAUDE.md: *"That file doesn't look right — try exporting a fresh backup."*

| Location | Current copy | Issue | Suggested revision |
|---|---|---|---|
| `transferData.ts:111` | "The file is not valid JSON. Please choose a habits-backup.json file." | Technical ("valid JSON"); assumes the filename. | "That doesn't look like a backup file — try exporting a fresh one from Settings." |
| `transferData.ts:115–118` | "Unrecognised file format. Only files exported from Clarity are supported." | "Unrecognised file format" is system-speak. | "That file doesn't look right — only backups exported from Clarity will work." |
| `transferData.ts:122–124` | "No valid entries found in the file." | "valid entries" is technical. | "The file didn't contain any entries we could read — try exporting a fresh backup." |
| `transferData.ts:167, 178` | "Failed to read the file." | "Failed" is alarming; gives no path forward. | "Something stopped us from reading that file — try again." |
| `SettingsView.tsx:186–188` | "Something went wrong. Please try again." (export) | Vague; no action. | "Couldn't download the backup — try again." |
| `SettingsView.tsx:79–81` | "Something went wrong. Please try again." (import fallback) | Generic fallback when the thrown error already has good copy. Should re-throw the specific message rather than replacing it. | *(Use the error message from `transferData.ts` directly)* |
| `CheckInForm.tsx:190` | "Please enter a name." | Functional but fine in context. | "Give this moment a name." |
| `CheckInForm.tsx:197` | "A moment with that name already exists." | Slightly clinical. | "You've already got a moment called that." |

---

## 5. Placeholder Text

| Location | Current copy | Assessment |
|---|---|---|
| `CheckInForm.tsx:481` | "Anything about today worth remembering?" | ✓ Excellent. Warm, open, non-directive. |
| `ManageView.tsx:448` | "e.g. Stretching" / "e.g. Running" | ✓ Good. Concrete examples without instructing. |
| `ManageView.tsx:477` | "e.g. km, pages, cups" | ✓ Good. |
| `ManageView.tsx:622` | "e.g. Long walk" | ✓ Good. |
| `CheckInForm.tsx:392` | "Moment name" | **Flag.** Functional, not inviting. Feels like a form field label that leaked into the placeholder. Suggested: "e.g. Morning light" or simply "name it". |

---

## 6. Consistency Check

### Terminology

| Concept | Usage across app | Status |
|---|---|---|
| "Moments" | Section labels, add button, jump link, settings link, HelpView, FrequencyList | ✓ Consistent |
| "Habits" | Section labels, add button, settings link | ✓ Consistent |
| "Reflection" | Section label in CheckInForm and DayDetail | ✓ Consistent |
| "Archive" / "Restore" | ManageView action buttons, HelpView description | ✓ Consistent. "delete" appears only in the factory-reset confirmation — intentionally so for a destructive action. |
| "History" | BottomNav tab, back link on edit page, page heading | ✓ Consistent |

### Navigation items

| Nav element | Text | Notes |
|---|---|---|
| BottomNav tab 1 | "Today" | ✓ Matches the `<h1>` on the Today page |
| BottomNav tab 2 | "History" | ✓ Matches the `<h1>` on the History page |
| Today → Settings link | "Settings" | ✓ |
| History → Settings link | "Settings" | ✓ |
| Settings → back | "← back" | Source uses lowercase; rendered as uppercase via CSS — visual result is consistent |
| Manage → back | "← Settings" | Source uses title case; rendered as uppercase via CSS — visual result is consistent |
| Help → back | "← Settings" | ✓ |
| Edit → back | "← history" | Source uses lowercase; rendered as uppercase via CSS — visual result is consistent |

Visual rendering is consistent across all nav links due to the `uppercase` CSS class. Source casing inconsistency is cosmetic only.

### Habit type labels (ManageView add flow)

| Current | Issue |
|---|---|
| "Boolean" | Developer jargon. A user adding their first custom habit may not know what this means. |
| "Numeric" | Less opaque than "Boolean", but "Number" would be more natural. |

**Suggested revision** for the "What kind of habit?" prompt:
- "Boolean" → "Done / not done" (or "Yes / no")
- "Numeric" → "A number"

This is the only place in the app where a user sees these terms — they do not appear in the daily form, history, or settings.

---

## Summary of Priority Fixes

**High** — These appear in error flows that users will hit:

1. `transferData.ts:111, 115, 122` — Replace technical error messages with the calm/specific pattern from CLAUDE.md.
2. `transferData.ts:167, 178` — "Failed to read the file." → "Something stopped us from reading that file — try again."
3. `SettingsView.tsx:186–188` — Export error needs a specific message, not the generic fallback.
4. `SettingsView.tsx:175–177` — Remove "JSON" from the export description.

**Medium** — Visible in normal use:

5. `ManageView.tsx:416–425` — Replace "Boolean"/"Numeric" with plain-language equivalents.
6. `SettingsView.tsx:248–259` — Import success copy reads like a system log; soften it.
7. `CheckInForm.tsx:392` — Placeholder "Moment name" → something warmer.
8. `ManageView.tsx:465` — "Does not bring joy by default" → warmer phrasing.
9. `ManageView.tsx:483` — "Step" field label → "Increment" or add a hint.

**Low** — Edge cases or polish:

10. `HistoryView` — Add a first-use empty state when `entries.length === 0`.
11. `CheckInForm.tsx:197` — "A moment with that name already exists." → "You've already got a moment called that."
