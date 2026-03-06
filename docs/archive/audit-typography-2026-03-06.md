# Typography & Spacing Audit — Clarity × Calma

**Date:** 2026-03-03
**Scope:** All component and page files
**Reference:** `docs/calma-design-language.md` (source of truth)

---

## Summary

Four **critical** accessibility failures (stone-400 as light-mode text), a systemic gap where `font-medium` is absent from virtually every section label, two vertical-rhythm outliers, and several missing explicit text sizes on body elements. No `font-bold` or `font-semibold` found anywhere — that constraint is clean.

Severity key: **Critical** = WCAG AA failure or outright spec contradiction · **High** = systemic gap · **Medium** = missing detail · **Low** = minor inconsistency

---

## 1. Type Scale Consistency

### 1.1 — `font-medium` missing from almost every section label

Calma specifies section labels as `xs / medium / widest / uppercase`. The `CLAUDE.md` summary omits `font-medium` from its shorthand, which appears to have propagated into the codebase. The design doc is the source of truth.

| Component | Line(s) | Current | Expected | Severity |
|---|---|---|---|---|
| `CheckInForm.tsx` | 280, 308, 338, 433, 473 | `text-xs uppercase tracking-widest text-stone-500` | + `font-medium` | High |
| `HelpView.tsx` | `SECTION_LABEL` const (l.7) | missing `font-medium` | + `font-medium` | High |
| `ManageView.tsx` | `SECTION_LABEL` const (l.59) | missing `font-medium` | + `font-medium` | Critical (see §2) |
| `SettingsView.tsx` | 121, 136, 169, 293, 308 | missing `font-medium` on all five section labels | + `font-medium` | High / Critical (see §2) |
| `DayDetail.tsx` | 173, 193, 213, 232 | `text-xs uppercase tracking-widest text-stone-500` on all `h3` section labels | + `font-medium` | High |
| `HistoryView.tsx` | 93 | Frequency toggle button styled as a section label — no `font-medium` | + `font-medium` | Medium |

The section label is the single most repeated typographic element. Missing `font-medium` flattens its weight relative to subsection text, eroding the chapter-marker rhythm that Calma depends on.

---

### 1.2 — Page titles: consistent and correct

All `h1` page titles across `CheckInForm`, `ManageView`, `SettingsView`, `HelpView`, and `HistoryView` correctly apply `text-xl font-light tracking-widest text-stone-800 dark:text-stone-200`. No issues.

---

### 1.3 — Section headings: DayDetail date heading oversized

| Component | Line | Current | Expected | Severity |
|---|---|---|---|---|
| `DayDetail.tsx` | 160 | `text-lg font-light tracking-wide text-stone-800` | `text-base font-light tracking-widest` | Medium |

The Calma scale defines section headings as `base / light / widest`. The DayDetail date heading (`h2`) uses `text-lg` (one step larger) and `tracking-wide` (one step narrower). Since this is a bottom sheet header — not a page title — it should map to the section heading role, not a hybrid between section heading and page title.

---

### 1.4 — CalendarHeatmap year display: wrong size for uppercase+widest element

| Component | Line | Current | Expected | Severity |
|---|---|---|---|---|
| `CalendarHeatmap.tsx` | 230 | `text-sm uppercase tracking-widest text-stone-500` | `text-xs uppercase tracking-widest text-stone-500` | Low |

Every other `uppercase tracking-widest` element in the app uses `text-xs`. The year display uses `text-sm`, which inflates it slightly above the section label family it visually belongs to.

---

### 1.5 — Body/item labels: missing explicit `text-sm`

| Component | Line | Current | Expected | Severity |
|---|---|---|---|---|
| `HabitToggle.tsx` | 24 | `text-stone-700 dark:text-stone-300` (no size) | `text-sm text-stone-700 dark:text-stone-300` | Medium |
| `NumberStepper.tsx` | 63 | `text-stone-700 dark:text-stone-300` (no size) | `text-sm text-stone-700 dark:text-stone-300` | Medium |

Both labels are wrapped in `py-3.5` rows alongside other `text-sm` siblings and will visually inherit correctly, but the absence of an explicit declaration makes the role ambiguous and fragile to future container changes.

---

### 1.6 — Reflective / long-form text: missing `font-light`

| Component | Line | Current | Expected | Severity |
|---|---|---|---|---|
| `CheckInForm.tsx` | 483 | `text-stone-700 dark:text-stone-300` (no size, no weight) | `text-sm font-light text-stone-700` | Medium |
| `HelpView.tsx` | `BODY` const (l.10) | `text-sm leading-relaxed text-stone-700` | `text-sm font-light leading-relaxed text-stone-700` | Medium |

The Calma scale defines reflective/long-form text as `sm / light`. `DayDetail.tsx:235` applies this correctly (`text-sm font-light leading-relaxed`). The reflection textarea and all HelpView body copy should match.

---

### 1.7 — Section label margin inconsistency within CheckInForm

| Component | Lines | Current | Expected | Severity |
|---|---|---|---|---|
| `CheckInForm.tsx` | 280, 308 | `mb-1` (Habits, By the numbers) | `mb-3` (to match Moments, Joy, Reflection) | Low |

Five section labels in the same component — three use `mb-3`, two use `mb-1`. The tighter margin makes the Habits and Numbers sections feel compressed relative to the bottom half of the form.

---

## 2. Section Label Hierarchy Violations

### 2.1 — `text-stone-400` used as section label text in light mode (WCAG AA failure)

Stone-400 (#a8a29e) produces a contrast ratio of **2.4:1** against the light background (#fafaf9), well below the WCAG AA minimum of 4.5:1. The Calma spec explicitly prohibits this: "Never use it as text in light mode."

| Component | Line | Current | Expected | Severity |
|---|---|---|---|---|
| `ManageView.tsx` | 59 (`SECTION_LABEL` const) | `text-stone-400 dark:text-stone-500` | `text-stone-500 dark:text-stone-500` | **Critical** |
| `SettingsView.tsx` | 121 | `text-stone-400 dark:text-stone-500` ("Manage" label) | `text-stone-500 dark:text-stone-500` | **Critical** |
| `SettingsView.tsx` | 293 | `text-stone-400 dark:text-stone-500` ("Help" label) | `text-stone-500 dark:text-stone-500` | **Critical** |
| `SettingsView.tsx` | 308 | `text-stone-400` (no dark variant on "Reset" `h3`) | `text-stone-500 dark:text-stone-500` | **Critical** |

Note the Reset heading at line 308 also omits the dark variant entirely, leaving a near-invisible grey on a dark background.

Because `ManageView.tsx` applies the wrong color via a shared constant, it affects both the Habits section label (l.262) and the Moments section label (l.520) — two section labels via one fix.

### 2.2 — Contrast: section labels vs body text in ManageView

When section labels use `stone-400` and body labels use `stone-700`, the section label is *lower contrast than the content it titles*. This inverts the intended hierarchy: the chapter marker is visually quieter than the items it organises.

---

## 3. Vertical Rhythm

### 3.1 — ManageView header: `mb-2` is a clear rhythm outlier

| Component | Line | Current | Expected | Severity |
|---|---|---|---|---|
| `ManageView.tsx` | 238 | `header mb-2` | `header mb-6` (or `mb-10`) | High |

Every other page uses generous header spacing:
- `CheckInForm` — `mb-10`
- `SettingsView` — `mb-10`
- `HelpView` — `mb-10`
- `HistoryView` — `mb-6`
- **ManageView** — **`mb-2`** ← outlier

The jump link div below (`mb-10`) provides some visual breathing room, but the 8px gap between the "Manage" heading and the jump link is noticeably cramped. A reader arriving on the page is presented with the title and jump link pressed together.

### 3.2 — SettingsView section spacing: `mb-8` vs surrounding `mb-10`

All sections in SettingsView use `mb-8` (32px). All sections in CheckInForm use `mb-10` (40px). The difference (8px) is unlikely to be noticed at a glance, but it means pages feel slightly different in density without a deliberate reason. The Calma base section gap is 2.5rem (40px). Low severity because SettingsView compensates with explicit border dividers between sections.

| Component | Lines | Current | Notes | Severity |
|---|---|---|---|---|
| `SettingsView.tsx` | 119, 135, 168, 291, 307 | `mb-8` on all sections | Consistent but 8px below Calma baseline; dividers compensate | Low |

---

## 4. Font Weight Consistency

**No instances of `font-bold` or `font-semibold` found anywhere in the codebase.** ✅

All `font-medium` instances are enumerated below for review:

| Component | Line | Context | Assessment |
|---|---|---|---|
| `HistoryView.tsx` | 113, 118, 123 | Active period selector button ("Month · 3 Months · Always") | **Intentional** — selection indicator pattern; matches `stone-900/100` active state |
| `SettingsView.tsx` | 145, 156 | Active theme button ("Light / Dark") | **Intentional** — selection indicator |
| `SettingsView.tsx` | 248 | Import success count ("12 entries imported") | **Borderline** — using font-medium for inline numeric callout within body text. The count could stand on color (`stone-800`) alone per Calma's "hierarchy by size and colour" principle, but this is minimal emphasis |
| `BottomNav.tsx` | 33 | Active nav tab | **Intentional** — matches navigation active state convention |
| `DayDetail.tsx` | 199 | Numeric habit value (the number itself) | **Borderline** — font-medium used to distinguish the number from its label and unit. Could rely on size+color alone, but `font-medium` is the lightest weight emphasis and the data context is reasonable |

The active-state `font-medium` pattern is consistent across the app. The two "borderline" cases do not violate the spirit of Calma but should be noted.

---

## 5. Line Length

**All page-level containers consistently apply `max-w-md` (448px).** ✅

Verified across:
- `CheckInForm.tsx:248` — `mx-auto max-w-md px-5`
- `ManageView.tsx:235` — `mx-auto max-w-md px-5`
- `SettingsView.tsx:101` — `mx-auto max-w-md px-5`
- `HelpView.tsx:14` — `mx-auto max-w-md px-5`
- `HistoryView.tsx:59` — `mx-auto max-w-md px-5`
- `DayDetail.tsx:157` — `mx-auto max-w-md px-6` (sheet content)
- `BottomNav.tsx:24` — `mx-auto flex h-14 max-w-md`

No full-width text blocks found.

---

## Consolidated Findings by Severity

### Critical (fix immediately — accessibility failures)

| ID | Component | Line | Current | Expected |
|---|---|---|---|---|
| C1 | `ManageView.tsx` | 59 | `SECTION_LABEL` uses `text-stone-400` | `text-stone-500` |
| C2 | `SettingsView.tsx` | 121 | "Manage" label `text-stone-400` | `text-stone-500` |
| C3 | `SettingsView.tsx` | 293 | "Help" label `text-stone-400` | `text-stone-500` |
| C4 | `SettingsView.tsx` | 308 | "Reset" `h3` `text-stone-400` (no dark) | `text-stone-500 dark:text-stone-500` |

### High (systemic spec gaps)

| ID | Component | Line | Current | Expected |
|---|---|---|---|---|
| H1 | `CheckInForm.tsx` | 280, 308, 338, 433, 473 | Section labels missing `font-medium` | + `font-medium` |
| H2 | `HelpView.tsx` | `SECTION_LABEL` const | Missing `font-medium` | + `font-medium` |
| H3 | `ManageView.tsx` | `SECTION_LABEL` const | Missing `font-medium` | + `font-medium` |
| H4 | `SettingsView.tsx` | 121, 136, 169, 293, 308 | All five section labels missing `font-medium` | + `font-medium` |
| H5 | `DayDetail.tsx` | 173, 193, 213, 232 | Four `h3` section labels missing `font-medium` | + `font-medium` |
| H6 | `ManageView.tsx` | 238 | Header `mb-2` vs every other page `mb-6`–`mb-10` | `mb-6` minimum |

### Medium (missing role declarations)

| ID | Component | Line | Current | Expected |
|---|---|---|---|---|
| M1 | `HabitToggle.tsx` | 24 | Label — no `text-sm` | `text-sm` |
| M2 | `NumberStepper.tsx` | 63 | Label — no `text-sm` | `text-sm` |
| M3 | `CheckInForm.tsx` | 483 | Reflection textarea — no size or weight | `text-sm font-light` |
| M4 | `HelpView.tsx` | `BODY` const | Missing `font-light` | `text-sm font-light leading-relaxed` |
| M5 | `DayDetail.tsx` | 160 | Date heading `text-lg tracking-wide` | `text-base tracking-widest` |
| M6 | `HistoryView.tsx` | 93 | Frequency toggle — section-label pattern without `font-medium` | + `font-medium` |

### Low (minor inconsistencies)

| ID | Component | Line | Current | Expected |
|---|---|---|---|---|
| L1 | `CheckInForm.tsx` | 280, 308 | Section label `mb-1` (vs `mb-3` on 338, 433, 473) | `mb-3` for consistency |
| L2 | `CalendarHeatmap.tsx` | 230 | Year display `text-sm uppercase tracking-widest` | `text-xs uppercase tracking-widest` |
| L3 | `SettingsView.tsx` | all sections | `mb-8` spacing (vs Calma baseline `2.5rem`) | Low impact given dividers |
| L4 | `DayDetail.tsx` | 199 | Numeric value `font-medium` | Borderline — acceptable |
| L5 | `SettingsView.tsx` | 248 | Import count `font-medium` | Borderline — acceptable |

---

## Suggested Priority Order

1. **Fix C1–C4** — four stone-400 color violations. Three are grouped in `SettingsView.tsx`; C1 is a single constant in `ManageView.tsx`. Fast wins.
2. **Fix H1–H5** — add `font-medium` to every section label. Most are already centralized as constants or follow a clear pattern. A search/replace across repeated inline styles may suffice.
3. **Fix H6** — change ManageView header from `mb-2` to `mb-6`.
4. **Fix M1–M4** — add explicit `text-sm` to HabitToggle and NumberStepper; add `font-light` to CheckInForm textarea and HelpView body constant.
5. **Consider M5** — resize DayDetail date heading to `text-base tracking-widest` (this changes the visual feel of the sheet, review in context).
6. **L1–L2** are cosmetic and can be addressed opportunistically.
