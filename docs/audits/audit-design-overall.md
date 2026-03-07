# Design Audit — Overall Coherence
## Clarity × Calma

Date: 2026-03-07
Scope: All pages, all components, first-use and experienced-user perspectives.
Reference: docs/calma-design-language.md, prior audits in docs/.

Sprint 7 context: section-label `font-medium` gaps resolved across CheckInForm, DayDetail, ManageView, SettingsView (three labels), HelpView, HistoryView. ManageView header spacing fixed. DayDetail BlossomIcon now correctly used for joy display — the previous most-important observation is resolved. Colour audit high and critical findings resolved.

---

## Preamble

Clarity reads as a product made with genuine care. The Calma identity — warm stone palette, restrained typography, unhurried motion — is deeply embedded in the codebase. The core ritual (logging a day, reviewing history) is coherent and human. The save sequence alone ("Saving…" → "Day captured") shows that someone thought carefully about what this tool should feel like. Sprint 7 resolved the most systemic typography and colour gaps, and the app now passes most of its own design language requirements. Two concentrations of roughness remain: the Manage page, whose vocabulary breaks from the human register maintained everywhere else; and the DayDetail sheet, whose primary action is presented so quietly it nearly disappears.

---

## 1. Page-by-Page Design Review

### Today (CheckInForm)

Today holds up well under daily repetition. The section progression — Habits, By the numbers, Moments, then the animated Joy section, then Reflection — traces a natural arc from structural to personal. The Joy section appearing only after at least one habit is marked done is a genuinely considered design choice: the emotional question arrives only when there is something to reflect on. The save button's progression from "Save" to "Saving..." to "Day captured" is the best writing in the app — "captured" earns its meaning in a way "saved" never would. The Reflection placeholder ("Anything about today worth remembering?") is open, warm, and correctly unhurried.

What isn't working:

The reflection textarea (`CheckInForm.tsx:484`) is missing `text-sm font-light`. Calma specifies reflective body text as `sm / light`, and DayDetail renders the same text with `text-sm font-light leading-relaxed`. The form that creates the entry and the sheet that reviews it should give the same words the same weight. The inconsistency is felt as a slight mismatch — the writing space feels more clinical than the reading space.

The joy blossom button (`CheckInForm.tsx:456`) uses `active:scale-90`. Scale transforms are explicitly forbidden by Calma; the correct active feedback here is an opacity shift (`active:opacity-70`). The current implementation creates a press animation that belongs to a different aesthetic.

Three touch targets in the add-moment flow are below 44px: the "New moment" dashed button (~32px), the inline "Add" button (~32px), and the dismiss "✕" (~20px). The ✕ is particularly small and positioned close to the Add button, creating a real mis-tap risk on mobile.

The inline add-moment input placeholder reads "Moment name" (`CheckInForm.tsx:392`). This is the only placeholder in the app that reads as a form-field label rather than an invitation. ManageView uses example-based placeholders throughout ("e.g. Stretching", "e.g. Long walk"). "e.g. Morning light" would match the established pattern.

### History (HistoryView + CalendarHeatmap + FrequencyList)

History is the most visually distinctive page in the app. The two-axis colour system — dusk blue for habits, warm ember for joy and moments — creates a personal reading surface that no other habit tracker produces. The integration between the calendar, the collapsible frequency list, and the filter system is sophisticated and coherent. The scroll-lock-before-collapse behaviour prevents the most common interaction jarring point (page shrinking while scrolled). The one-time filter hint ("Tap any item to filter the calendar") and its quiet disappear on first use are correctly executed.

What isn't working:

There is no empty state. A first-time user who opens History sees a grid of pale, unlabelled cells and nothing else. The colour logic is explained in Help, but Help is reached through Settings — a new user following the natural path (Today → History) arrives at the page with no orientation. A single, calm line under the calendar — visible only when no entries exist — would orient without cluttering.

The CalendarHeatmap year-nav buttons (`CalendarHeatmap.tsx:222, 234`) have no `min-h` constraint. The month-nav buttons directly below them have `min-h-[44px]`. The inconsistency is visible within the same component — the year buttons feel tappable because the month buttons do, but they are approximately 20px tall.

The FrequencyList bar animation (`FrequencyList.tsx:161–163`) animates `width` from 0% to target. Calma permits only opacity, translate, and height/max-height for Motion animations. The fix is a `scaleX` transform with `transform-origin: left` at the full target width — the same visual result without a layout-affecting animation.

The month heading crossfade duration is 0.11 (110ms), below the 120ms Calma floor.

### Settings (SettingsView)

Settings does what it needs to do and no more. The section structure (Manage → Theme → Your data → Help → Reset) is logical. The import/export flows handle multiple states (idle, ready, success, error) with calm, styled panels. The Reset action correctly uses amber, not red. "This will delete all entries and restore default habits and moments." is specific without being alarming.

What isn't working:

The back button reads "← back" (`SettingsView.tsx:114`). It is the only navigation element in the entire app that does not name its destination. Every other nav link is explicit: "← history", "← Settings", "Today", "History". The anonymous "← back" breaks this pattern. The sessionStorage value that determines the destination is already read on mount; displaying "← Today" or "← History" is a one-line change.

Two section labels — Theme (line 136) and "Your data" (line 169) — are still missing `font-medium`. These were not in Sprint 7's scope and are the last remaining section-label failures in the codebase.

The export description (line 175) reads "Download all your habit entries as a JSON backup file." The word "JSON" is developer vocabulary that surfaces unnecessarily for a personal tool. "Download a backup of all your entries" says the same thing without the jargon.

The import success messages ("entries imported" / "entries already existed and were kept") read as database output. The export error ("Something went wrong. Please try again.") is the most generic possible message. Neither reflects the quality of writing found on Today or in Help.

### Manage (ManageView)

Manage is the most functionally complex page and the implementation is good: inline editors, mutual exclusion of open forms, archive/restore with reassurance copy. The SECTION_LABEL constant is now correct. Header spacing matches other pages. Amber for archive (reversible), standard text for restore — semantically right. "Archived. Past entries are preserved." is calm and reassuring.

The problem is vocabulary. ManageView is the only page that asks a user to decide between "Boolean" and "Numeric" (`ManageView.tsx:417, 424`). These words belong to a developer tool. "Boolean" is entirely opaque to non-technical users. Every other choice in the product uses plain human language. This is the single most visible place where that care was not applied, and it surfaces at the exact moment a user is extending the app — the moment that should feel most personal.

The "♡ Does not bring joy by default" copy (line 465) has the same problem at smaller scale. The affirmative case ("♥ Brings joy by default") is warm; the negative reads as a configuration property. "♡ Joy is marked separately" would match the register of its counterpart.

The "Step" label on the numeric form (line 483) is unexplained. "Increment" is more readable; a brief hint ("The amount added each tap") would remove any ambiguity.

The "Jump to Moments" anchor (line 254) uses `text-stone-400` in light mode, failing WCAG AA. This anchor and the Boolean/Numeric type-picker buttons also lack `transition-colors`.

### Help (HelpView)

Help is the best-written page in the app. The four sections explain the product accurately without condescension. "Completion and joy are different things, and keeping them apart lets you see the difference over time" is a precise and human articulation of the app's central design choice. The Calma section — acknowledging the design system to curious users — is appropriate without being self-indulgent. Section labels and body text follow the full canonical patterns after Sprint 7 fixes.

No significant concerns.

### DayDetail (review sheet)

DayDetail is where the daily ritual concludes. The sheet architecture is correct. The section structure, the "Nothing here yet" empty state, the BlossomIcon for joy display, and the body scroll lock are all well-executed. The close button (sticky, top-right, adequate touch target) is always reachable as the sheet scrolls.

The date heading (line 161) uses `text-lg tracking-wide` instead of `text-base tracking-widest`. The heading sits in a compact bottom sheet — `text-lg` sizes it as a page title, not a sheet header. `text-base tracking-widest` would align it with the Calma section-heading scale.

The Edit link (lines 246–251) is styled with `text-sm text-stone-500 dark:text-stone-400 ... hover:underline` — the weakest visual treatment in the app: no uppercase, no widest tracking, no navigation emphasis. It reads as a footnote. This is the primary action in the sheet, the one thing a user does from DayDetail when they want to change their entry. Every other navigation action in the codebase uses the `text-xs uppercase tracking-widest` pattern. The hierarchy inversion here is the sharpest in the app.

---

## 2. Cross-Page Consistency

- **Header pattern** — all pages apply title-left, nav-right consistently. One anomaly: SettingsView back button reads "← back" rather than naming its destination. **Medium.**
- **Section labels** — canonical pattern applied across ManageView, CheckInForm, DayDetail, HelpView, HistoryView, SettingsView Manage/Help/Reset. Two SettingsView labels (Theme, Your data) still missing `font-medium`. **Medium.**
- **Empty states** — DayDetail ("Nothing here yet") and FrequencyList ("Nothing logged in this period") are consistent in tone. History heatmap has no empty state for first-time users. **High.**
- **Joy symbol** — BlossomIcon used consistently in CheckInForm (joy section), DayDetail (habit list), and HelpView (illustration). Coherent. ✅
- **Interactive vocabulary** — "Edit", "Archive", "Restore", "Save", "Cancel" are consistent across ManageView and DayDetail. Only Manage's "Boolean"/"Numeric" breaks from the human register. **High.**
- **Spacing register** — `mb-10` between form sections throughout CheckInForm, `mb-6` in DayDetail sections, `mb-8` in SettingsView. Consistent within each context. **Low.**
- **Transition-colors** — nearly universal. Missing on ManageView Jump to Moments anchor, Boolean/Numeric type-picker buttons, DayDetail Edit link. **Low.**

---

## 3. Emotional Identity

Clarity's core identity — calm, factual, non-gamifying — is successfully maintained across most of the app.

Working well:
- No streaks, scores, or progress bars anywhere. ✅
- No reward or punishment animations. ✅
- "Day captured" is the most affirming the app ever gets — appropriate, never effusive. ✅
- The Joy section's delayed appearance makes the factual/emotional separation tangible without explaining it. ✅
- Archive uses amber, never red — correct semantic weight for a reversible action. ✅

What contradicts the identity:
- "Boolean" and "Numeric" in ManageView are the most prominent vocabulary that doesn't belong to this product. They make habit creation feel like configuring a spreadsheet field, not choosing a personal practice.
- "Does not bring joy by default" reads as a property flag, not a human observation.
- Import success copy ("entries imported", "already existed and were kept") and the export error ("Something went wrong. Please try again.") introduce the register of a system log and a generic web form. The app earns trust with calm, specific language elsewhere; these passages break that contract.
- The reflection textarea missing `font-light` makes the writing space feel slightly more transactional than the reading space — the opposite of what the Reflection section is for.

---

## 4. Information Architecture

The two-level navigation (BottomNav for Today/History; text back-links for utility pages) is clear and consistent. The DayDetail sheet-from-History pattern is spatially natural. The redirect chain (DayDetail → Edit → `/history?open=[date]` → DayDetail auto-opens) is clean.

Working well:
- BottomNav correctly absent on Settings, Manage, Help, Edit. ✅
- Page headers share a consistent structure across all six pages. ✅
- DayDetail close button is sticky and always reachable as content scrolls. ✅
- Settings back destination preserved via sessionStorage and correctly resolved on mount. ✅

Concerns:
- The DayDetail Edit link does not read as the primary action. A user who wants to correct their day must find a small grey underline link among section content. The `uppercase tracking-widest` pattern used everywhere else would give it the correct visual weight.
- The SettingsView back button doesn't name its destination. This is the only place in the navigation where the user has to remember where they came from rather than read it.

---

## 5. Summary & Most Important Observation

**Most important observation:** The "Edit" link in `DayDetail.tsx` (lines 246–251) is the primary action on the primary review surface — the one thing a user does from the day-detail sheet when they want to change something they logged. It is styled with `text-sm text-stone-500 dark:text-stone-400 ... hover:underline`: no uppercase, no widest tracking, no hover colour shift — the weakest visual treatment in the app. Every other navigation action in the codebase uses the `text-xs uppercase tracking-widest` pattern. The fix is a single class string change: replace the current styling with `text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300`. This would make the primary action in the most-visited review screen readable as an action rather than a footnote, and closes the sharpest hierarchy inversion in the app.

Findings by severity: **3 high · 9 medium · 4 low**

Severity reference: **High** = breaks page coherence or significantly contradicts Calma identity · **Medium** = noticeable inconsistency or missing detail · **Low** = minor polish item

| # | Page | Finding | Severity |
|---|---|---|---|
| 1 | History | No empty state — first-time users have no orientation | High |
| 2 | ManageView | "Boolean"/"Numeric" vocabulary breaks the human register | High |
| 3 | DayDetail | Edit link styled as footnote, not as primary navigation | High |
| 4 | CheckInForm | Reflection textarea missing `text-sm font-light` | Medium |
| 5 | CheckInForm | Joy blossom `active:scale-90` — scale forbidden by Calma | Medium |
| 6 | CheckInForm | Three add-moment touch targets below 44px | Medium |
| 7 | CheckInForm | "Moment name" placeholder — not example-based | Medium |
| 8 | SettingsView | Back button reads "← back" — destination unnamed | Medium |
| 9 | SettingsView | Theme + "Your data" section labels missing `font-medium` | Medium |
| 10 | SettingsView | Export/import microcopy: generic or log-like language | Medium |
| 11 | ManageView | "Does not bring joy by default" reads as config flag | Medium |
| 12 | DayDetail | Date heading `text-lg tracking-wide` vs `text-base tracking-widest` | Medium |
| 13 | CalendarHeatmap | Year-nav buttons no `min-h` (inconsistent with month-nav) | Low |
| 14 | FrequencyList | Bar animation animates `width` (layout-affecting, Calma-forbidden) | Low |
| 15 | CalendarHeatmap | Month crossfade 110ms — below 120ms floor | Low |
| 16 | ManageView | Jump to Moments `text-stone-400` + missing `transition-colors` | Low |
