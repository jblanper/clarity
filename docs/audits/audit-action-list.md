# Audit Action List

Generated: 2026-03-17 11:27
Source audits: audit-colour.md · audit-typography.md · audit-interaction.md · audit-microcopy.md · audit-design-overall.md

Archive note: Archived previous action list → `docs/audits/archive/audit-action-list-2026-03-17.md`

---

## Critical

### Moment chip editing-state WCAG AA contrast failure

Source: audit-colour.md · audit-design-overall.md (confirmed by 2 audits)
File: `ManageView.tsx` (line 628)

What to fix:
The editing/selected moment chip uses `bg-stone-100 text-stone-400 dark:text-stone-600`. `text-stone-400` (#a8a29e) on `bg-stone-100` (#f5f5f4) yields ≈2.9:1 contrast — below the WCAG AA minimum of 4.5:1. Per CLAUDE.md, on elevated `bg-stone-100` backgrounds, `text-stone-500` also fails; `text-stone-600` is the minimum. Change `text-stone-400` to `text-stone-600` at line 628. The dark variant (`dark:text-stone-600`) is correct and does not need changing.

---

## High

### BACKUP / RESTORE labels use literal ALL CAPS in JSX source

Source: audit-microcopy.md
File: `SettingsView.tsx` (lines 172, 192)

What to fix:
The two `<p>` elements at lines 172 and 192 contain the literal strings `BACKUP` and `RESTORE` in their source text. Every other section label in the codebase uses sentence-case source copy and relies on the CSS `uppercase` class to produce the visual ALL CAPS appearance. These two strings are the sole exception. Change the source text from `BACKUP` to `Backup` and from `RESTORE` to `Restore` — the `uppercase` class already present on both elements will continue to render them as uppercase visually. No other changes are required.

---

### "How Clarity works" help link is positioned below the Capture button

Source: audit-design-overall.md (single most important observation)
File: `CheckInForm.tsx`

What to fix:
The help link ("How Clarity works") currently sits below the Capture button in today-mode layout, placing it below the fold on most phones. A first-time user who taps through the checklist and hits "Capture" will never see it, missing joy-marking, moments, and the reflection field&apos;s intent. Move the help link above the Capture button (or into the header alongside the Settings link) so it is visible before the primary action. The link itself is correctly styled in the quiet tertiary register — only its vertical position needs to change. Do not add the link in edit mode where it would be irrelevant.

---

## Medium

### Generic fallback error copy in restore flow

Source: audit-microcopy.md
File: `SettingsView.tsx` (line 84)

What to fix:
The catch-all error fallback reads `"Something went wrong. Please try again."` — a textbook generic error that the Calma spec explicitly calls out as a violation. This code path surfaces when `err` is not an `Error` instance during data restore. Change the string to `"That didn&apos;t work — try a different file."` — this is specific to the restore context, calm in register, and tells the user the one actionable next step. One line change in the catch block at line 84.

---

### "Increment" is developer terminology in the habit edit form

Source: audit-microcopy.md
File: `ManageView.tsx` (line 353)

What to fix:
The field label `Increment` is exposed to users configuring a numeric habit. "Increment" is a programming term — a user thinks about how much their count changes per tap, not an "increment". Change the label to `"Step"` (e.g. `Step · [unit]`), which is short, universally understood, and consistent with the numeric stepper concept. One line change at line 353.

---

### "By the numbers" section label breaks the noun-only rhythm

Source: audit-design-overall.md
File: `CheckInForm.tsx`

What to fix:
Every section label in the app is a single clean noun: "Habits", "Moments", "Reflection", "Highlights". "By the numbers" is a multi-word phrase and the longest label by a large margin, disrupting the quiet typographic rhythm of the form. Change it to `"Numbers"` to match the noun-only pattern. This is a one-line JSX text change in the section label for the numeric habits block in `CheckInForm.tsx`.

---

### "Manage" page title is a verb, not a destination noun

Source: audit-design-overall.md
File: `ManageView.tsx`

What to fix:
Every other page title names what the user sees: "Today", "History", "Settings", "Help". "Manage" names what the user does — a verb — which contradicts the Calma principle that labels should name destinations. Change the `<h1>` page title in `ManageView.tsx` to `"Habits & Moments"`, which names the page&apos;s actual contents. The Settings navigation card already reads "Habits and moments" (no change needed there), so this aligns the two. One line change to the `<h1>` in `ManageView.tsx`.

---

## Deferred

Low findings and non-trivial Medium findings deferred to a polish pass. One line each.

**From audit-colour:**
- `CalendarHeatmap.tsx` day-of-week row — `dark:text-stone-600` dark variant should be `dark:text-stone-500` (pre-existing) · audit-colour

**From audit-typography:**
- `ManageView.tsx:406,677` — Archived disclosure toggles have `py-1` only, no `min-h-[44px]` (pre-existing) · audit-typography, audit-interaction
- `CalendarHeatmap.tsx` year row — `text-sm uppercase tracking-widest` (spec calls for `text-xs`) (pre-existing, applies when year row is shown) · audit-typography
- `SettingsView.tsx` — Uses `mb-8` section spacing; rest of app uses `mb-10` (pre-existing) · audit-typography, audit-design-overall
- `DayDetail.tsx:~200` — Numeric habit value `font-medium` — borderline but acceptable (pre-existing) · audit-typography
- `NumberStepper.tsx:66` — Pill button value lacks explicit `text-sm` class (pre-existing Sprint 9) · audit-typography

**From audit-interaction:**
- Medium: Two-step hover jump `stone-600 → stone-800` on nav links not documented in Calma spec — docs-only update, no code change · audit-interaction
- `NumberStepper.tsx` — No `onKeyDown` arrow-key increment/decrement · audit-interaction
- `NumberStepper.tsx` — No `aria-valuemax` when `max !== Infinity` · audit-interaction
- `CalendarHeatmap.tsx` — `opacity-25` on filtered/future cells; could raise to `opacity-30` for marginally better legibility · audit-interaction
- `FrequencyList.tsx` — `invisible` chevron used for layout spacing; should be `opacity-0` (invisible elements remain in accessibility tree) · audit-interaction
- `BottomNav.tsx` — Inactive tabs have `transition-colors` but no hover colour — transition fires over nothing · audit-interaction
- `SettingsView.tsx:227` — Remove-file "✕" button has `hover:text-stone-700` but no `transition-colors` · audit-interaction
- `ManageView.tsx` exit animations — Use framework default easing rather than explicit `easeIn` · audit-interaction

**From audit-microcopy:**
- `ManageView.tsx` `Start at · [unit]` field — no helper text explaining the first-tap jump concept; placeholder says only "Optional" · audit-microcopy
- `CheckInForm.tsx:191` — `"Please enter a name."` validation — mildly imperative · audit-microcopy
- `CheckInForm.tsx:198` — `"A moment with that name already exists."` — functional but clinical · audit-microcopy
- `ManageView.tsx:277` — `"What kind of habit?"` type-picker intro — slightly transactional · audit-microcopy

**From audit-design-overall (non-trivial Medium):**
- `ManageView.tsx` — Moments section `+ New` chip is inside the chip grid; Habits section `+ New` is inline in the section header — asymmetric layout between two parallel sections · audit-design-overall
- `HelpView.tsx` — Header uses `items-start`; History and Manage use `items-center` — minor alignment inconsistency across pages · audit-design-overall
- `HelpView.tsx` — "Design language" link uses trailing `›` chevron; all back-links lead with `←` — opposite arrow convention within the same register · audit-design-overall

---

## Design intent to carry forward

- **FrequencyList analytics risk** — The sorted descending bar graph is the most dashboard-like element in the app. Current neutral stone/amber palette prevents a competitive feel. If trend lines, comparisons, or time-period breakdowns are ever added, re-evaluate against Calma&apos;s no-gamification principle before building.
- **NumberStepper zero state** — A bare `0` in a rounded pill reads as a score waiting to be filled, which is slightly more loaded than an unchecked boolean toggle. This is inherent to the numeric habit type and not fixable without changing the component paradigm; worth naming if the emotional identity is ever revisited.
- **Today page visual identity** — The Today page is the thinnest in terms of visual presence relative to the richer History and Settings pages. No fix is implied now, but if a future sprint addresses first-time user experience, Today is the surface most in need of a sense of occasion.
- **Divider asymmetry (intentional)** — Settings and Help use hairline `border-b` dividers between sections; Today and Manage use spacing alone. This asymmetry is intentional — Settings/Help have thematically distinct sub-sections; the others flow continuously. Document this as a design decision rather than a violation if the Calma spec is ever formalised further.

---

## Summary

| # | Title | File | Severity | Source |
|---|-------|------|----------|--------|
| 1 | Moment chip editing-state WCAG AA contrast failure | `ManageView.tsx:628` | Critical | audit-colour, audit-design-overall |
| 2 | BACKUP / RESTORE literal ALL CAPS in JSX source | `SettingsView.tsx:172,192` | High | audit-microcopy |
| 3 | "How Clarity works" help link below Capture button | `CheckInForm.tsx` | High | audit-design-overall |
| 4 | Generic fallback error copy in restore flow | `SettingsView.tsx:84` | Medium | audit-microcopy |
| 5 | "Increment" developer-terminology field label | `ManageView.tsx:353` | Medium | audit-microcopy |
| 6 | "By the numbers" section label breaks noun rhythm | `CheckInForm.tsx` | Medium | audit-design-overall |
| 7 | "Manage" page title is a verb, not a destination | `ManageView.tsx` | Medium | audit-design-overall |

Critical: 1 · High: 2 · Medium: 4 · Deferred: 21 · Design intent notes: 4
