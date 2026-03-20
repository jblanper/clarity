# Microcopy & Tone Audit

Generated: 2026-03-17 11:07

Audited files: `components/CheckInForm.tsx`, `components/DayDetail.tsx`, `components/ManageView.tsx`, `components/SettingsView.tsx`, `components/HelpView.tsx`, `components/FrequencyList.tsx`, `components/CalendarHeatmap.tsx`, `components/HistoryView.tsx`, `components/BottomNav.tsx`, `components/HabitToggle.tsx`, `components/NumberStepper.tsx`, `components/MomentChip.tsx`, `app/page.tsx`, `app/history/page.tsx`, `app/edit/page.tsx`, `lib/transferData.ts`

---

## 1. Tone violations

### Technical language

| Location | Current copy | Issue |
|---|---|---|
| `ManageView.tsx` L353 | Field label `Increment` | "Increment" is a developer term. A user configuring a numeric habit thinks about how much the value changes per tap, not an "increment". Medium severity. |
| `ManageView.tsx` L366–367 | Field label `Start at · [unit]` | "Start at" with no helper text gives no actionable context for new users. The concept of a first-tap jump value is not self-evident from the label alone. Low severity. |

### Vague / generic

| Location | Current copy | Issue |
|---|---|---|
| `SettingsView.tsx` L84 | `"Something went wrong. Please try again."` | Classic generic error — directly violates the Calma spec example. This is the catch-all fallback when `err` is not an `Error` instance. The code path exists and could surface to users in unexpected error conditions. Medium severity. |
| `CheckInForm.tsx` L191 | `"Please enter a name."` | Mildly imperative. Functional but cold. Low severity. |
| `CheckInForm.tsx` L198 | `"A moment with that name already exists."` | Technically correct but clinical. Low severity. |

### Accusatory or guilt-inducing

No accusatory copy found. All empty states are correctly inviting:

- `DayDetail.tsx` L166: "Nothing here yet" — correct
- `HistoryView.tsx` L97: "Your days will appear here once you start logging." — correct
- `FrequencyList.tsx` L110: "Nothing logged in this period" — correct

### Exclamation marks / ALL CAPS

| Location | Current copy | Issue |
|---|---|---|
| `SettingsView.tsx` L172 | `<p ...>BACKUP</p>` | ALL CAPS in raw source markup inside a plain `<p>` tag. Every other section label in the codebase uses sentence-case source copy and relies on CSS `text-transform: uppercase` via the `uppercase` class. These two strings are the only instances of literal ALL CAPS in JSX text content. High severity. |
| `SettingsView.tsx` L192 | `<p ...>RESTORE</p>` | Same violation — ALL CAPS literal text in a `<p>` tag. High severity. |

No exclamation marks found anywhere in the codebase.

---

## 2. Flat or functional phrasing (lower severity)

| Location | Current copy | Suggested direction |
|---|---|---|
| `ManageView.tsx` L277 | `"What kind of habit?"` | Acceptable. Slightly transactional; "What should this habit track?" would add more context, but current version is not a violation. |
| `ManageView.tsx` L353 | `Increment` field label | "Each tap adds" or "Step size" would be more discoverable for a non-technical user. |
| `ManageView.tsx` L366 | `Start at · [unit]` | A placeholder such as "Optional — first tap jumps here" would clarify the field's purpose. Currently has `placeholder="Optional"` which tells the user nothing about the concept. |
| `CheckInForm.tsx` L191 | `"Please enter a name."` | "A name is needed to add this moment." — warmer and more specific. |
| `CheckInForm.tsx` L198 | `"A moment with that name already exists."` | "You already have a moment called that." — more conversational. |

Items that are working well and need no change:
- `CheckInForm.tsx` reflection placeholder: "Anything about today worth remembering?" — evocative and open
- `CheckInForm.tsx` new moment placeholder: "e.g. Morning light" — human and evocative
- `ManageView.tsx` habit label placeholders: "e.g. Stretching" / "e.g. Running" — good examples
- `ManageView.tsx` unit placeholder: "e.g. km, pages, cups" — useful range of examples
- `ManageView.tsx` moment add placeholder: "e.g. Long walk" — good
- `SettingsView.tsx` restore description: "Load a backup file. Days you've already logged won't change." — reassuring and specific
- `SettingsView.tsx` success message: `"{n} days added."` / `"{n} days were already in your history and weren't changed."` — clear
- `ManageView.tsx` archive confirmation: "Archived. Past entries are preserved." — calm and reassuring

---

## 3. Save / confirmation copy

**Pass.** The save flow in `CheckInForm.tsx` correctly implements all three states:

| State | New entry | Edit mode |
|---|---|---|
| Idle | `"Capture"` | `"Save"` |
| In-progress | `"Capturing…"` | `"Saving…"` |
| Confirmed | `"Day captured"` | `"Saved"` |

All states match the Calma spec example table exactly. No modal, no celebration, no urgency. The confirmed state uses a muted stone background. Fully compliant.

---

## Suggested rewrites

For every high-severity and medium-severity finding, a suggested replacement:

| Location | Current | Suggested |
|---|---|---|
| `SettingsView.tsx` L172 | `BACKUP` (literal ALL CAPS in `<p>` source) | Change to `Backup` in source — CSS `uppercase` class handles the visual rendering. Matches the pattern of every other section label in the app. |
| `SettingsView.tsx` L192 | `RESTORE` (literal ALL CAPS in `<p>` source) | Change to `Restore` in source — same fix. |
| `SettingsView.tsx` L84 | `"Something went wrong. Please try again."` | `"That didn't work — try a different file."` — specific, calm, tells the user what to try next. |
| `ManageView.tsx` L353 | `Increment` field label | `"Step"` with a helper note, or `"Each tap adds"` — avoids developer terminology. |

---

## Summary

2 high · 2 medium · 5 low

**High (2):**
- `BACKUP` and `RESTORE` labels in `SettingsView.tsx` L172 and L192 are ALL CAPS in raw JSX source text inside `<p>` tags, violating the Calma rule "no all-caps except the section label pattern". Every other section label in the codebase uses sentence-case source copy and relies on CSS `text-transform: uppercase`. These two strings are the sole inconsistency and should use `Backup` / `Restore` in source.

**Medium (2):**
- Generic fallback error `"Something went wrong. Please try again."` in `SettingsView.tsx` L84 — a code path that could surface to users in unexpected conditions.
- `Increment` field label in `ManageView.tsx` L353 — developer terminology exposed to users configuring habits.

**Low (5):**
- `Start at · [unit]` field label has no helper context about the first-tap jump behaviour
- `"Please enter a name."` moment add validation — mildly imperative
- `"A moment with that name already exists."` — functional but clinical
- `What kind of habit?` type picker intro — slightly transactional
- `Start at` placeholder `"Optional"` tells the user nothing about the concept
