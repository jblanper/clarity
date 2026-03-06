# Colour & Contrast Audit

Audited: all files in `components/`, `app/globals.css`.
Reference: `docs/calma-design-language.md`.
Date: 2026-03-03.

---

## 1. Stone-400 violations

Stone-400 (`#a8a29e`) fails WCAG AA on the light background (≈2.4:1, minimum 4.5:1). It is only permitted as a `dark:` variant, or explicitly as a placeholder / border colour.

### 1a. Full violations — no dark pairing

| Component | Line | Current value | Expected | Severity |
|---|---|---|---|---|
| SettingsView.tsx | 308 | `text-stone-400` | `text-stone-500 dark:text-stone-500` | **high** |
| SettingsView.tsx | 335 | `text-stone-400` (cancel button; has `dark:hover:` only, no dark base) | `text-stone-500 dark:text-stone-400` | **high** |
| ManageView.tsx | 282 | `text-stone-400` (false branch of joyByDefault conditional; no dark) | `text-stone-500 dark:text-stone-400` | **high** |
| ManageView.tsx | 464 | `text-stone-400` (same pattern in add-habit form; no dark) | `text-stone-500 dark:text-stone-400` | **high** |

### 1b. Light-mode violations — dark pairing present, base still fails

These have a correct dark mode but the light-mode value is below AA. The fix is to raise the base to stone-500.

| Component | Line | Current value | Expected | Severity |
|---|---|---|---|---|
| SettingsView.tsx | 120 | `text-stone-400 dark:text-stone-500` | `text-stone-500 dark:text-stone-500` | **high** |
| SettingsView.tsx | 292 | `text-stone-400 dark:text-stone-500` | `text-stone-500 dark:text-stone-500` | **high** |
| ManageView.tsx | ~60 | `SECTION_LABEL = "… text-stone-400 dark:text-stone-500"` | `text-stone-500 dark:text-stone-500` | **high** (propagates to every section label in ManageView) |
| ManageView.tsx | 254 | `text-stone-400 dark:text-stone-500` ("Jump to Moments" link) | `text-stone-600 dark:text-stone-500` | **medium** |
| ManageView.tsx | 273 | `text-stone-400 dark:text-stone-500` (numeric unit label) | `text-stone-500 dark:text-stone-400` | **medium** |
| ManageView.tsx | 378 | `text-stone-400 dark:text-stone-500` (archived confirmation note) | `text-stone-500 dark:text-stone-400` | **low** (archival dimming is intentional; see §2) |
| ManageView.tsx | 587 | `text-stone-400 dark:text-stone-500` (archived moment confirmation) | `text-stone-500 dark:text-stone-400` | **low** |
| CheckInForm.tsx | 364 | `text-stone-400 dark:text-stone-500` (new-moment ghost button) | keep if treated as placeholder; else `text-stone-500 dark:text-stone-400` | **medium** |
| CheckInForm.tsx | 405 | `text-stone-400 dark:text-stone-500` (dismiss button) | `text-stone-500 dark:text-stone-400` | **medium** |

### 1c. Adjacent violation — stone-300

| Component | Line | Current value | Issue | Severity |
|---|---|---|---|---|
| ManageView.tsx | 370 | `text-stone-300 dark:text-stone-700` (archived numeric unit) | stone-300 is far below AA in light mode; stone-700 in dark is also very low contrast | **high** |

---

## 2. Colour role consistency

### Correct usages

All page titles use `text-stone-800 dark:text-stone-200` consistently across HistoryView, CheckInForm, ManageView, SettingsView, HelpView.

All body text / item labels use `text-stone-700 dark:text-stone-300` consistently in CheckInForm, DayDetail, FrequencyList, HabitToggle, NumberStepper.

Amber is used exclusively for: joy blossom (BlossomIcon), joy selection in FrequencyList, joyByDefault active state in ManageView, reset action in SettingsView. All correct.

Red is used exclusively for: error messages in SettingsView (export/import) and CheckInForm (moment validation). Correct.

### Divergences

| Component | Line | Current value | Role | Expected | Severity |
|---|---|---|---|---|---|
| ManageView.tsx | ~60 | `SECTION_LABEL` uses stone-400 base | Section labels | stone-500 dark:stone-500 | **high** |
| SettingsView.tsx | 120, 292, 308 | Section labels use stone-400 base | Section labels | stone-500 dark:stone-500 | **high** |
| ManageView.tsx | 254 | `text-stone-400` for "Jump to Moments" nav anchor | Navigation link | stone-600 dark:stone-500 | **medium** |
| CalendarHeatmap.tsx | 300 | `text-stone-500 dark:text-stone-600` (day-of-week labels) | Metadata | stone-500 dark:stone-400 — dark:stone-600 is darker in dark mode, wrong direction | **low** |
| ManageView.tsx | 368, 581 | `text-stone-400 dark:text-stone-600` (archived labels) | Archived state | Archived items have no defined role in Calma. dark:stone-600 gives very low contrast in dark mode — consider dark:stone-500 | **medium** |
| DayDetail.tsx | 182 | `text-amber-500 dark:text-amber-400` (joy symbol) | Joy / accent | Amber usage is correct semantically. amber-500 on light background may be low-contrast for small text — consider amber-600 in light mode | **low** |

---

## 3. Dark mode completeness

Components with light-mode text colours that have no dark mode equivalent:

| Component | Line | Class | Missing | Severity |
|---|---|---|---|---|
| SettingsView.tsx | 308 | `text-stone-400` (Reset section label) | `dark:text-stone-500` | **high** |
| SettingsView.tsx | 335 | `text-stone-400` (cancel button base) | `dark:text-stone-500` or `dark:text-stone-400` | **high** |
| ManageView.tsx | 282 | `text-stone-400` (joyByDefault false branch) | `dark:text-stone-500` | **high** |
| ManageView.tsx | 464 | `text-stone-400` (add-form joyByDefault false) | `dark:text-stone-500` | **high** |

All other components pair light-mode text colours with dark variants correctly.

---

## 4. Section label pattern consistency

Canonical pattern: `text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500`

| Component | Line | Label text | Current value | Deviation | Severity |
|---|---|---|---|---|---|
| ManageView.tsx | ~60 | SECTION_LABEL const (Habits, Moments) | `text-stone-400 dark:text-stone-500` | stone-400 instead of stone-500 | **high** |
| SettingsView.tsx | 120 | Manage | `text-stone-400 dark:text-stone-500` | stone-400 instead of stone-500 | **high** |
| SettingsView.tsx | 292 | Help | `text-stone-400 dark:text-stone-500` | stone-400 instead of stone-500 | **high** |
| SettingsView.tsx | 308 | Reset | `text-stone-400` | stone-400 instead of stone-500; missing dark | **high** |
| CalendarHeatmap.tsx | 230 | year label | `text-sm uppercase tracking-widest text-stone-500 dark:text-stone-500` | text-sm instead of text-xs | **medium** (intentional — year sits in nav chrome, not page content) |
| CalendarHeatmap.tsx | 300 | day-of-week labels | `text-xs uppercase tracking-widest text-stone-500 dark:text-stone-600` | dark:stone-600 instead of dark:stone-500 | **low** |

All other section labels — in CheckInForm, DayDetail, HelpView, HistoryView — match the canonical pattern exactly.

---

## Summary

| Severity | Count | Primary locations |
|---|---|---|
| High | 11 | ManageView SECTION_LABEL, SettingsView labels, 4× missing dark pairings, stone-300 text |
| Medium | 7 | ManageView nav link, archived labels in dark, CalendarHeatmap year size, CheckInForm ghost buttons |
| Low | 3 | CalendarHeatmap day-of-week dark, archived confirm notes, joy symbol contrast |

**Biggest single fix:** changing `SECTION_LABEL` in ManageView from `text-stone-400` to `text-stone-500` corrects stone-400 violations across all section labels in that file at once.

**Second biggest:** correcting the three SettingsView section labels (Manage, Help, Reset) to `text-stone-500 dark:text-stone-500`.
