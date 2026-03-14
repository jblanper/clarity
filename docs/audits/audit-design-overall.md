# Design Audit — Overall Coherence
## Clarity × Calma

Generated: 2026-03-14 09:55
Archived previous report → docs/audits/archive/audit-design-overall-2026-03-14.md
Scope: All pages, all components, first-use and experienced-user perspectives.
Reference: docs/calma-design-language.md, prior audits in docs/audits/.
Sprint context: Post-Sprint 9. Controls redesign (HabitToggle full-row, NumberStepper pill), touch-target sweep, colour clean-up, microcopy polish all landed.

---

## Preamble

Clarity reads as a single considered thing at the component level — the typography discipline, colour restraint, and animation register are consistent and well-executed. Three sprints of systematic auditing have eliminated the most visible inconsistencies. What remains are structural gaps at the page-composition level: how sections relate to each other when content is absent, whether navigation targets align to the same grid across pages, and whether two date representations in the same flow speak the same language. None of these breaks the experience; some will quietly undermine the "handwritten notebook" identity over time.

---

## 1. Page-by-Page Design Review

### Today (CheckInForm)

The strongest page in the app. The form flows top to bottom without visible seams: Habits → By the numbers → Moments → Highlights → Reflection → Save. Each section breathes independently. The HabitToggle's amber row wash and dot indicator are the most successful Sprint 9 additions — they turn a boolean action into a moment of warmth without any ceremony. The NumberStepper pill is clean and unambiguous; the `startAt` jump behaviour is invisible and correct.

The Highlights section (done habits + joy marking) emerging conditionally between Moments and Reflection is an elegant structural choice — it appears only when relevant and disappears without a trace. The label rename from "Joy" to "Highlights" reads as slightly broader; "Joy" was more precise about what the section was doing. Worth watching whether it creates confusion in user testing, but not a violation.

Two small roughnesses: the `＋ New moment` button uses a fullwidth glyph (U+FF0B) while ManageView's add actions use ASCII `+`. And the "Please enter a name." / "A moment with that name already exists." error messages remain low-warmth — tracked in the microcopy audit with suggested rewrites.

The save button's three-state feedback (Save → Saving... → Day captured) is the best confirmation flow in the app.

### History (HistoryView)

The heatmap is visually distinctive and on-brand. The two-axis colour blend (cool for completion, warm for joy and moments) is subtle enough that users do not need to decode it consciously — they just feel the difference between days. The selected-day ring and the DayDetail bottom-sheet pattern work well together.

The Frequency section is a later addition and it shows. The toggle button (correctly styled as a section label) opens a sub-page inside the History page — conceptually useful but structurally awkward when entries are empty. On first use, a new user sees: all-grey calendar → divider → "Frequency" toggle → (below the toggle) "Your days will appear here once you start logging." Two empty-state signals appear in sequence, with the page-level empty state appearing *after* a toggleable section that implies data might exist. **This is the most important structural issue in the current codebase.** (See Section 5.)

The period selector (Month · 3 Months · Always) is well-positioned above the FrequencyList. The inactive dot separator in `text-stone-300` is appropriately quiet. The header uses `flex items-center` instead of the documented `flex items-start` — visually harmless on this single-line header but a deviation from the standard. (See Section 2.)

### Settings (SettingsView)

Settings is the most functionally dense page and the one with the weakest touch-target compliance — a pre-existing gap tracked in the interaction audit (back button, theme picker, various bare-text controls). These gaps are noted here because they represent the largest discrepancy between the care given to the main form controls (HabitToggle, NumberStepper, MomentChip — all ≥44px) and the utility pages.

The page structure is sound: divider-separated sections, consistent section-label pattern, calm destructive-action flow (Reset uses amber and a confirmation step — correct). The dynamic back button label ("← Today" / "← History") is the best navigation microcopy in the app.

The theme picker — two `text-sm` text buttons with no touch target or visual affordance beyond `font-medium` on the active state — is the most under-designed element on the page. It functions, but it looks like a temporary choice.

### Manage (ManageView)

The most complex page and the most internally consistent one. The mutual-exclusion rule on inline editors (only one open at a time) prevents the page from becoming chaotic. The two-step add-habit flow (type picker → form) is acceptably discoverable. Archive confirmation copy ("Archived. Past entries are preserved.") is exactly right — calm, specific, reassuring.

The "Jump to Moments" anchor is a useful affordance. The dot-separator pattern in "Start at · km" is a good re-use of the established Calma vocabulary.

The header uses `flex items-center` — same deviation as HistoryView. There is also no explicit `border-t` divider between the Habits and Moments sections (unlike SettingsView). When the Habits list is long (many archived items), the visual jump to Moments can feel abrupt.

### Help (HelpView)

The strongest writing in the app. "There is no score to beat, no streak to protect, nothing to catch up on" is a design statement as much as copy. The blossom icon pair as a visual example (empty / filled) is elegant. The `border-t` dividers between sections give the page the feel of a printed pamphlet — exactly right for the analog register.

Touch-target gaps on the back link and design-language link are pre-existing mediums from the interaction audit.

### Edit (CheckInForm in edit mode)

Functionally identical to Today with a different header: weekday name as the `<h1>`, full date as a `<p>` subtitle, `← history` link top-right. The structural pattern is correct. The edit-mode save redirects to `/history?open=[date]` which auto-reopens DayDetail — a smooth round-trip.

No new issues beyond those noted for Today.

### DayDetail

The bottom-sheet pattern is well-executed: smooth slide-up, backdrop dismiss, sticky close button, scroll-locked body. The content hierarchy inside the sheet is clear: date heading → checked habits → numbers → moments → reflection → edit link.

Two observations at the component level:

The done-habit indicator is a plain Unicode `✓` at `text-stone-500`. The HabitToggle introduced an amber dot for done state in Sprint 9. These two views — the active form and the read-only review — now use different visual vocabularies for the same concept (a completed boolean habit). A small amber dot (`h-2 w-2 rounded-full bg-amber-500`) instead of the `✓` would connect the two surfaces without adding weight.

The date heading uses a custom European format: "Monday, 25 February 2026" (day before month, year included). The Today page's date subtitle uses `toLocaleDateString("en-US", ...)` producing "Tuesday, February 25" (month before day, no year). The two most visible date displays in the app speak different orderings. Standardising on the European day-first format with year across both surfaces would remove a subtle dissonance.

---

## 2. Cross-Page Consistency

- **Header vertical alignment** — `flex items-start` on Today, Settings, Help; `flex items-center` on History, Manage. CLAUDE.md documents `flex items-start justify-between` as the standard. Visually harmless on single-line headers but a documented deviation. **Medium.**

- **Add-action glyph** — `＋ New moment` (fullwidth U+FF0B) on CheckInForm; `+ Add habit` / `+ Add moment` (ASCII U+002B) on ManageView. Minor but inconsistent across the two places users add items. **Low.**

- **Date formats** — Today subtitle uses US locale order ("February 25"); DayDetail heading uses European order ("25 February 2026") with year. **Low.**

- **Section spacing** — `mb-10` between sections on Today; `mb-8` on Settings (with explicit `border-t` dividers compensating); no explicit divider between Habits and Moments on Manage. Internally consistent within each page but varies across pages. **Low** (pre-existing).

- **Section labels** — correct and consistent across all pages. The canonical six-part pattern holds everywhere. ✅

- **Page titles** — `text-xl font-light tracking-widest text-stone-800 dark:text-stone-200` consistent on all pages. ✅

- **Nav link pattern** — `text-xs uppercase tracking-widest text-stone-600` consistent everywhere. ✅

- **Empty states** — "Nothing here yet" (DayDetail), "Nothing logged in this period" (FrequencyList), "Your days will appear here once you start logging." (HistoryView). All are inviting and non-accusatory in tone. Structural placement issue on HistoryView noted in Section 5. ✅ on tone.

---

## 3. Emotional Identity

Clarity holds its calm identity well. There is no streak counter, no score, no progress bar. Amber signals feeling, not achievement. Red appears only on errors. The app does not reward or punish — it records.

Potential friction points:

- The NumberStepper's amber pill when non-zero could read as a gamified score. In context, the amber is consistent with the system-wide active/positive accent, and the pill increments without celebration or fanfare. The emotional framing remains observational. ✅

- The FrequencyList shows counts and relative bar lengths. The bars are relative to each other — not to a target — the section is hidden by default and requires deliberate action to open. The interaction remains exploratory rather than evaluative. ✅

- The "Highlights" section label (renamed from "Joy" in Sprint 9) is broader and less specific. "Joy" was a more precise emotional category; "Highlights" suggests summary or best-of. The rename is unlikely to cause confusion but slightly dilutes the factual/emotional split (Habits = fact, Joy = feeling) that the form intentionally maintains. Low severity — monitor.

- The Manage page is necessarily complex. The complexity is contained well — it does not leak onto the main form. ✅

---

## 4. Information Architecture

**BottomNav** — two tabs (Today, History), always visible on primary pages, hidden on all secondary pages. Clear and correct. The active state (`font-medium text-stone-900`) is distinguishable but subtle — correct for a text-only two-tab system. Inactive tabs have `transition-colors` applied but no hover colour target defined — the transition fires on nothing. Add `hover:text-stone-700 dark:hover:text-stone-300`. **Low** (pre-existing).

**Settings back** — the sessionStorage pattern (`"settings-back": "/" | "/history"`) is invisible to users and works correctly. The dynamic label ("← Today" / "← History") is the most user-trusting navigation copy in the app. ✅

**Manage and Help back** — both link to `← Settings` as static links. Correct — these pages are always entered from Settings. ✅

**DayDetail → Edit → History** — the round-trip (DayDetail open → tap Edit → save → redirect to `/history?open=date` → DayDetail reopens → URL cleaned) is invisible and correct. The DayDetail "Edit" link is `text-xs uppercase tracking-widest` — consistent with the nav-link pattern but visually the lightest element on the sheet. It sits below all content and could be missed on content-heavy days. The copy "Edit" is correctly specific. **Low.**

**First-use HistoryView** — a new user arriving on History sees an all-grey heatmap, a Frequency toggle, and an empty-state message at the bottom of the page. The empty-state message appears *after* the Frequency section, so users encounter a toggleable UI element before the explanation. Tapping "Frequency" reveals a second empty message ("Nothing logged in this period"). **Medium** — see Section 5.

No dead ends found. Every secondary page has a clear path back. ✅

---

## 5. Summary & Most Important Observation

**Most important observation:** HistoryView's empty state is structurally mispositioned. When `entries.length === 0`, the page renders: (1) all-grey calendar, (2) a section divider and "Frequency" toggle button, (3) the empty-state message below the toggle. A first-time user encounters a toggleable UI section — implying data exists — before seeing the explanation that nothing has been logged yet. Expanding "Frequency" produces a second empty message ("Nothing logged in this period") that overlaps with the first. The fix is two-part: conditionally suppress the Frequency section entirely when `entries.length === 0` (a toggle with nothing to toggle is misleading), and move the empty-state message to immediately below the heatmap so it reads as the calendar's own empty state. This is a single-component change (`HistoryView.tsx`) that removes the most structurally confusing moment in the app for new users.

---

Findings by severity: **0 high · 2 medium · 4 low**

| ID | Severity | Location | Finding |
|---|---|---|---|
| M1 | Medium | HistoryView | Empty-state message positioned after Frequency toggle; Frequency toggle visible when entries are empty — creates two competing empty-state signals |
| M2 | Medium | HistoryView, ManageView | Header uses `flex items-center` instead of documented `flex items-start justify-between` |
| L1 | Low | DayDetail | Done-habit indicator is Unicode `✓` at stone-500; HabitToggle uses amber dot — different vocabularies for the same concept across form and review |
| L2 | Low | CheckInForm, ManageView | Add-action glyph inconsistency: `＋` (fullwidth U+FF0B) in CheckInForm vs `+` (ASCII U+002B) in ManageView |
| L3 | Low | DayDetail, CheckInForm | Date format inconsistency: European day-first with year in DayDetail vs US month-first without year in Today subtitle |
| L4 | Low | BottomNav | `transition-colors` on inactive tabs with no hover target defined — transition fires on nothing (pre-existing) |
