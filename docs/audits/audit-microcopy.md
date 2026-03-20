# Microcopy & Tone Audit

Generated: 2026-03-20 14:03

Archive already created → docs/audits/archive/audit-microcopy-2026-03-20.md

Audited files: `components/CheckInForm.tsx`, `components/DayDetail.tsx`, `components/ManageView.tsx`, `components/SettingsView.tsx`, `components/HelpView.tsx`, `components/FrequencyList.tsx`, `components/CalendarHeatmap.tsx`, `components/HistoryView.tsx`, `components/BottomNav.tsx`, `components/HabitToggle.tsx`, `components/NumberStepper.tsx`, `components/MomentChip.tsx`, `components/BlossomIcon.tsx`, `components/MotionProvider.tsx`, `components/SegmentedPill.tsx`, `components/Chevron.tsx`, `app/page.tsx`, `app/history/page.tsx`, `app/edit/page.tsx`, `app/settings/page.tsx`, `app/manage/page.tsx`, `app/help/page.tsx`, `lib/transferData.ts`

---

## Sprint 15 baseline verification

The following items were listed as fixed in Sprint 15. Verification against actual source files:

| Item | Status | Notes |
|---|---|---|
| SettingsView `BACKUP` → `Backup` | **FIXED** | Section label renders `Backup` in correct casing |
| SettingsView `RESTORE` → `Restore` | **FIXED** | Section label and button both read `Restore` |
| SettingsView `"Something went wrong…"` → `"That didn't work — try a different file."` | **FIXED** | Fallback in `handleImport` catch block confirmed |
| CheckInForm `"Please enter a name."` → softer copy | **FIXED** | Now `"A name helps you recognise this later."` |
| CheckInForm `"A moment with that name already exists."` → softer copy | **FIXED** | Now `"You already have a moment with that name."` |
| ManageView `"What kind of habit?"` → `"Choose a type."` | **FIXED** | Reads `"Choose a type."` |
| ManageView `Increment` → `Step` | **FIXED** | Field label reads `Step` in both add and edit forms |
| ManageView "Start at" helper text | **FIXED** | `"First tap jumps here; further taps add one step."` present in both add and edit forms |

All Sprint 15 baseline items confirmed applied.

---

## 1. Tone violations

### Technical language

| Location | Current copy | Issue |
|---|---|---|
| `lib/transferData.ts` — parse validation error | `"No recognisable entries were found in that file."` | "recognisable entries" is mildly technical — users don't think of their data as "entries". Medium severity. |
| `ManageView` — add/edit habit field label | `Step` | Technically correct but has no helper text unlike "Start at". Ambiguous to first-time users. Low severity. |
| `ManageView` — add/edit habit field label | `Joy by default` | "by default" echoes a config-key naming pattern rather than plain human language. Low severity. |

### Vague / generic

No instances of "Something went wrong. Please try again." or equivalents remain. All previously flagged cases are confirmed fixed.

| Location | Current copy | Issue |
|---|---|---|
| `SettingsView` — export error | `"Couldn't download the backup — try again."` | Calm and specific enough, but "try again" gives no direction (browser setting? connection?). Low severity. |

### Accusatory or guilt-inducing

No violations found. All empty states are inviting:

- `HistoryView`: `"Your days will appear here once you start logging."` — Pass.
- `DayDetail` (no entry): `"Nothing here yet"` — Pass.
- `FrequencyList` (empty period): `"Nothing logged in this period"` — Pass.

### Exclamation marks / ALL CAPS

| Location | Current copy | Issue |
|---|---|---|
| Exclamation marks | None found across all files | Pass |
| ALL CAPS | All uppercase strings are section labels using the `tracking-widest` pattern | Pass — compliant with the documented exception |

---

## 2. Flat or functional phrasing (lower severity)

| Location | Current copy | Suggested direction |
|---|---|---|
| `ManageView` — field label (habit + moment forms) | `Label` | `"Name"` would feel more personal in a tool about daily life; "label" echoes database terminology |
| `ManageView` — add habit field label | `Joy by default` | `"Joyful by default"` or `"Always marks joy"` reads more human; current phrasing echoes a config key name |
| `ManageView` — `Step` field | No helper text | A one-liner hint like `"How much each tap adds"` would close the gap left by the removal of "Increment" and match the pattern set by the "Start at" helper |
| `CheckInForm` section label vs. `DayDetail` section label | `Numbers` (form) vs. `By the numbers` (detail) | Minor inconsistency — the form header and the detail review section use different labels for the same data; aligning them would be cleaner |
| `SettingsView` — restore success (skipped count) | `"{N} days were already in your history and weren't changed."` | Slightly wordy; `"{N} already in your history — left unchanged."` is lighter. Low priority. |
| `ManageView` — add habit type chooser buttons | `Yes / No` and `Number` | Clear and human — Pass. (Previous audit flagged `Boolean` and `Numeric`; those are gone.) |
| `CalendarHeatmap` — legend | `no activity` · `active` · `joy` | Intentionally terse to match the typographic weight-encoding; Pass. |
| `FrequencyList` — filter hint | `"Tap any item to filter the calendar"` | Clear and actionable — Pass. |
| `HelpView` — outbound link | `Design language ›` | Correct use of the documented `›` exception for outbound links — Pass. |

---

## 3. Save / confirmation copy

**CheckInForm — new entry mode**

| State | Copy |
|---|---|
| idle | `Capture` |
| saving | `Capturing…` |
| confirmed | `Day captured` |

**CheckInForm — edit mode**

| State | Copy |
|---|---|
| idle | `Save` |
| saving | `Saving…` |
| confirmed | `Saved` |

All three states present in both modes. Confirmed state is brief, unobtrusive (no modal, no fanfare). Tone is calm and human. **Pass.**

---

## Suggested rewrites

For every medium-severity finding, a suggested replacement:

| Location | Current | Suggested |
|---|---|---|
| `lib/transferData.ts` — parse validation error | `"No recognisable entries were found in that file."` | `"No entries were found in that file — it may be empty or from a different app."` |

---

## Summary

0 high · 2 medium · 6 low

**Medium**
1. `lib/transferData.ts` — `"No recognisable entries were found in that file."` uses technical phrasing ("recognisable entries").
2. `ManageView` — `Joy by default` field label echoes a config key rather than plain human language.

**Low**
1. `ManageView` — `Label` field label across habit and moment forms — `"Name"` would feel more personal.
2. `ManageView` — `Step` field has no helper text; unlike "Start at", the unit and meaning are left implicit.
3. `CheckInForm` / `DayDetail` — section label inconsistency: form uses `"Numbers"`, detail uses `"By the numbers"`.
4. `SettingsView` — export error `"try again"` gives no direction on what to try.
5. `SettingsView` — restore success skipped-days note is slightly verbose.
6. `SettingsView` — export error copy is otherwise calm and acceptable; no change strictly required.
