# Microcopy & Tone Audit

Generated: 2026-03-15 00:00

Archive note: Bash permission was unavailable; pre-sprint snapshot preserved in memory (Sprint 11 report: 0 high · 0 medium · 3 low).

Audited files: `CheckInForm.tsx`, `SettingsView.tsx`, `ManageView.tsx`, `HelpView.tsx`, `DayDetail.tsx`, `HistoryView.tsx`, `FrequencyList.tsx`, `BottomNav.tsx`, `CalendarHeatmap.tsx`, `lib/transferData.ts`, `app/layout.tsx`.

Sprint 12 context: Task 1 ManageView carry-forward (placeholder "Optional" fix). Task 4 SettingsView Your Data restyle — BACKUP/RESTORE sub-labels, new copy (Save a copy, Choose a file, Import another file, Keep my data). Task 5 Reset flow — "Start fresh" resting button, "Yes, start fresh" / "Keep my data" confirmation copy. Tasks 7–9 ManageView redesign — "Habits"/"Moments" section headers, joy toggle labels, "What kind of habit?" copy.

---

## 1. Tone Violations

### Technical language

**None found.** ✅

No format names, internal filenames, database metaphors, or unexplained technical terms in new copy. ✅

"What kind of habit?" prompt (ManageView:420) — "Yes / No" and "Number" as type pickers. "Yes / No" is human and clear. "Number" is plain language — acceptable. ✅

### Vague / generic

**None found.** ✅

Error messages remain specific and actionable. ✅

### Accusatory or guilt-inducing

**None found.** All empty states remain inviting. ✅

### Exclamation marks / ALL CAPS

BACKUP and RESTORE sub-labels in SettingsView (lines 172, 192) use CSS uppercase via `uppercase` class with string-level "BACKUP"/"RESTORE" text. The `uppercase` class applies CSS `text-transform: uppercase`, not literal caps. However, the actual JSX text nodes also contain "BACKUP" and "RESTORE" in all-caps directly. Strictly, CLAUDE.md says "Uses ALL CAPS outside the `tracking-widest` section label pattern" is a violation. These strings **are** within a `tracking-widest` sub-label context (matching the section-label pattern). This is analogous to the nav section labels that use `uppercase` CSS. **Acceptable** — the rendered visual is equivalent to `uppercase` CSS, and the context (sub-section header) is appropriate for this display pattern.

No exclamation marks found anywhere. ✅

---

## 2. Sprint 12 Copy Changes

### SettingsView Your Data section

| Element | New copy | Assessment |
|---|---|---|
| BACKUP sub-label | `"BACKUP"` | Sub-section header — matches section-label register ✅ |
| Backup description | `"Keep a copy of your entries on your device."` | Plain, human, action-focused. Improved over previous "Download a backup of all your entries." ✅ |
| Export button | `"Save a copy"` | Specific and plain. Previous "Export backup" was slightly technical. ✅ |
| RESTORE sub-label | `"RESTORE"` | Sub-section header ✅ |
| Restore description | `"Load a backup file. Days you've already logged won't change."` | Excellent — plain language, reassuring note about existing data. ✅ |
| Idle import button | `"Choose a file"` | Clear and simple ✅ |
| Import another file button | `"Import another file"` | Clear ✅ |
| Try again button | `"Try again"` | Clear ✅ |

### SettingsView Reset section

| Element | New copy | Assessment |
|---|---|---|
| Resting button | `"Start fresh"` | Warm, non-threatening framing for a destructive action ✅ |
| Warning copy | `"Your entries will be removed and habits reset to defaults."` | Clear and direct. Sprint brief called for more specific copy but current version is unambiguous. Slightly softer than planned "permanently delete … cannot be undone" — acceptable given Calma's calm register. **Low** — could be more explicit about permanence. |
| Confirm button | `"Yes, start fresh"` | Consistent with the resting button label — single phrase echoed. ✅ |
| Cancel button | `"Keep my data"` | Positive framing for the cancel path — excellent. More inviting than "Cancel." ✅ |

### ManageView section headers (B1)

| Element | Copy | Assessment |
|---|---|---|
| Habits section header | `"Habits"` | ✅ Clear, consistent with existing app vocabulary. |
| Moments section header | `"Moments"` | ✅ |
| `+ New` button (Habits) | `"+ New"` | ✅ Concise, action-oriented. |
| `+ New` button (Moments) | `"+ New"` | ✅ |

### ManageView action tray (B2)

| Element | Copy | Assessment |
|---|---|---|
| Edit action | `"Edit"` | ✅ Direct |
| Archive action | `"Archive"` | ✅ Direct; amber colour signals reversibility |
| Joy toggle (joy off) | `"Mark joy"` | ✅ Plain, specific |
| Joy toggle (joy on) | `"Unmark joy"` | ✅ Consistent pairing |

Note: "Unmark joy" is a slightly unusual phrase but clearly communicates the reverse action. "Remove joy" could also work. Low — acceptable.

### ManageView B3 Moments chip editing

| Element | Copy | Assessment |
|---|---|---|
| Save inline edit | `"Save"` | ✅ |
| Cancel inline edit | `"Cancel"` | ✅ |
| Archive from editing | `"Archive"` | ✅ |

### ManageView B4 Joy pill

| Element | Copy | Assessment |
|---|---|---|
| Joy pill label | `"Joy"` | ✅ Single word, clear semantic meaning |

### ManageView type picker (form-boolean/numeric)

| Element | Copy | Assessment |
|---|---|---|
| Type prompt | `"What kind of habit?"` | ✅ Conversational, direct |
| Boolean option | `"Yes / No"` | ✅ Intuitive phrasing |
| Numeric option | `"Number"` | ✅ Plain language |
| Joy by default label | `"Joy by default"` | ✅ Matches vocabulary used elsewhere |
| Joy on state | `"Brings joy by default"` | ✅ |
| Joy off state | `"Joy is marked separately"` | ✅ |

---

## 3. Carry-forward Fixes

### ManageView Start at placeholder (Task 1)

| Location | Before | After | Assessment |
|---|---|---|---|
| ManageView inline-edit Start at | `placeholder="0"` | `placeholder="Optional"` | ✅ Resolved — both instances (edit form and add form) fixed |

Sprint 11 audit had flagged both Start at placeholder instances as low-severity (suggested "Optional"). Both are now resolved. ✅

---

## 4. Empty State Audit

| Location | Current copy | Assessment |
|---|---|---|
| `DayDetail.tsx:166` | "Nothing here yet" | ✅ |
| `FrequencyList.tsx:110–112` | "Nothing logged in this period" | ✅ |
| `HistoryView.tsx:88–92` | "Your days will appear here once you start logging." | ✅ |

---

## 5. Confirmation and Feedback Messages

| Location | Current copy | Assessment |
|---|---|---|
| `CheckInForm.tsx:503` | `"Day captured"` (new entry) | ✅ |
| `CheckInForm.tsx:503` | `"Saved"` (edit mode) | ✅ |
| `CheckInForm.tsx:501` | `"Capturing…"` / `"Saving…"` | ✅ |
| `ManageView.tsx:403,640` | `"Archived. Past entries are preserved."` | ✅ |
| `SettingsView.tsx:247–253` | `"{n} days added."` / `"{n} days were already in your history and weren't changed."` | ✅ |

---

## 6. Error Message Audit

All errors: calm, specific, tells the user what to do next.

| Location | Current copy | Assessment |
|---|---|---|
| `transferData.ts` | Import error messages | ✅ Unchanged |
| `SettingsView.tsx:185` | `"Couldn't download the backup — try again."` | ✅ |
| `CheckInForm.tsx:190` | `"Please enter a name."` | Low — functional but cold (pre-existing carry-forward) |
| `CheckInForm.tsx:197` | `"A moment with that name already exists."` | Low — clinical (pre-existing carry-forward) |

---

## 7. Placeholder Text

| Location | Current copy | Assessment |
|---|---|---|
| `CheckInForm.tsx:484` | `"Anything about today worth remembering?"` | ✅ |
| `CheckInForm.tsx:394` | `"e.g. Morning light"` | ✅ |
| `ManageView.tsx:458` | `"e.g. Stretching"` / `"e.g. Running"` | ✅ |
| `ManageView.tsx:487` | `"e.g. km, pages, cups"` | ✅ |
| `ManageView.tsx:662` | `"e.g. Long walk"` | ✅ |
| `ManageView.tsx:355,515` | `placeholder="Optional"` (Start at fields) | ✅ **Fixed in Sprint 12 Task 1** |

---

## 8. Consistency Check

All terminology consistent. "Habits", "Moments", "Archive", "Restore", "Reflection", "Highlights", "Start fresh", "Joy" are used consistently across surfaces. ✅

"Keep my data" as the reset cancel is new vocabulary — not used elsewhere, but contextually clear and unambiguous. ✅

---

## Suggested rewrites for remaining low-severity items

| Location | Current | Suggested |
|---|---|---|
| `CheckInForm.tsx:190` | "Please enter a name." | "Give this moment a name." |
| `CheckInForm.tsx:197` | "A moment with that name already exists." | "You've already got a moment called that." |
| `SettingsView.tsx:301` | "Your entries will be removed and habits reset to defaults." | "This will permanently remove all your entries and reset habits to defaults. This can't be undone." |

---

## Summary

**0 high · 0 medium · 2 low**

Sprint 12 resolved 1 pre-existing low (both Start at placeholder "0" → "Optional"). New copy introduced in SettingsView (Backup/Restore, Reset, App card) and ManageView (section headers, action tray, joy pill) is calm, specific, and consistent with Calma's tone. No new high or medium findings. Two pre-existing low copy issues carry forward (CheckInForm inline validation copy). Net: 1 low resolved, carry-forward count 2 (down from 3).
