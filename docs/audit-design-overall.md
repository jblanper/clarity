# Design Audit — Overall Coherence
## Clarity × Calma

**Date:** 2026-03-03
**Scope:** All pages, all components, first-use and experienced-user perspectives.
**Reference:** `docs/calma-design-language.md`, prior audits in `docs/`.

---

## Preamble

This audit asks a different question than the four that came before it. Color values, touch targets, and copy tone can be measured against a spec; coherence cannot. The question here is whether Clarity, read as a whole, feels like a single considered thing — closer to a handwritten notebook than a productivity dashboard. In most places, it does. The design system holds. The pages feel like they share DNA. But there are moments where the seams show, and one moment in particular where the app contradicts its own emotional identity.

---

## 1. Page-by-Page Design Review

### Today

The Today page is the heart of the product and its strongest design expression. The header follows the established pattern precisely: "Today" in light type on the left, the date subtitle directly beneath it, and "Settings" in the uppercase tracking-widest style top-right. The date subtitle gives the page a journal-like quality — you're not logging into a dashboard, you're writing an entry for a specific day. The form hierarchy is clear to a first-time user: habits are factual (toggle on or off), numbers are measurements, moments are felt things, reflection is free text. A new user can navigate all four sections without instruction.

The page breathes generously in its lower half — Moments, Joy, and Reflection each have `mb-3` section label margins and `mb-10` section gaps. The upper half (Habits and By the Numbers) is noticeably tighter: section labels carry `mb-1` instead of `mb-3`, creating a subtle two-register feel within the same form. The top half feels like a checklist; the bottom half feels like a journal. This spacing asymmetry is the most felt inconsistency on the page, and the fix is two characters.

Nothing on this page feels like a productivity tool. The "Save" → "Saving…" → "Day captured" transition is handled with exactly the right restraint. The Joy section's animated appearance — arriving when at least one habit is done — is one of the page's most considered moments. It earns its place.

### History

The History page shifts the register from input to reflection, and the shift is appropriate. The heatmap is the app's signature visual — the only non-typographic element with genuine expressive range — and it occupies most of the viewport. The month navigation is clean; the year/month selector pairing makes navigation feel spatial without requiring instruction.

The page breathes well above the heatmap but the area below the calendar — the Frequency section — can feel like an afterthought. The collapse toggle is correctly understated, but the period selector ("Month · 3 Months · Always") sits inside the collapsed section, invisible until the user opens it. A first-time user may never discover that the list is period-adjustable. The toggle's label "Frequency" is also the most analytical word on an otherwise human-language page — it's correct but slightly clinical against "Habits", "Moments", and "Reflection" above it.

The page would benefit from a more prominent empty-state in its first-ever view: the blank gray calendar grid with nothing to tap communicates nothing about what the page will become once there's data. The app's most visually distinctive feature is invisible until data exists.

### Settings

Settings is appropriately quiet — a utility page that knows its role. The header follows the established pattern (title left, "← back" right), and the back navigation uses sessionStorage correctly to return the user to where they came from. The section structure is clear, and the dividers between sections give the page a measured, unhurried pace that matches the Calma base section rhythm better than most other pages.

The import/export flow is among the most carefully handled state sequences in the app: four states (idle, ready, success, error), each with its own calm, specific copy. The error panel with its `red-50` background and `red-700` text is the most visually prominent feedback in the entire app — it stands out because it should.

One textural inconsistency: three section labels ("Manage", "Help", "Reset") use `text-stone-400` where the canonical pattern requires `text-stone-500`. This is documented in the color audit and is invisible to most users, but it means those section labels have lower contrast than the body text they title — an inverted hierarchy that quietly undermines the page's structure.

### Manage

Manage is the most clinically-feeling page in the app. This is partly structural: it must support a multi-step add-habit flow and inline editing, which requires more state management than any other page. But the clinical register is also a product of word choice. When a user clicks "+ Add habit", they are asked to choose between "Boolean" and "Numeric." These are the most technical words in the entire product. Every other label is human-language: "Habits", "Moments", "Reflection", "Archive", "Restore". The word "Boolean" has no place in a handwritten notebook.

The header's `mb-2` gap — documented in the typography audit — creates a noticeably cramped opening that the rest of the page doesn't recover from cleanly. The jump link "Jump to Moments ↓" is the only in-page anchor link in the product; it reads slightly utilitarian and suggests the page may be too long rather than offering a considered shortcut.

The section's inline edit forms are well-executed: the animated reveal is tight, the Save/Cancel actions are clear, and the `rounded-2xl` container is consistent with the rest of the system. The amber "Archive" buttons (signaling reversibility, not destruction) are semantically correct per Calma. The page works — it just hasn't received the same tonal consideration as the pages the user visits daily.

### Edit Day

Edit Day is CheckInForm with a date prop, and the shared component means this page is as close to the Today page as it could be. The header makes the difference clear: the day name ("Monday") as the primary title and the full date ("24 February 2026") as the subtitle give the page a distinctly archival quality — you're revisiting a specific moment, not the present. The "← history" link follows the established navigation pattern exactly.

There is one small friction point for an experienced user returning to edit an old entry: the save button always reads "Save" until tapped, regardless of whether any changes were made. There is no visual indication that the form is in edit mode versus create mode beyond the header change. An experienced user will understand; a new one might be uncertain whether pressing "Save" on an unchanged form will create a duplicate.

### Help

Help is the most carefully written page in the product, and that writing quality is its primary design asset. The sections — One entry a day, The daily form, Looking back, Your data, Calma — follow a logical progression from concept to practice to philosophy. The prose is consistently warm, specific, and written at exactly the right reading level for someone encountering the app for the first time.

The BlossomIcon pair (empty and filled) shown inline in "The daily form" section is the only visual illustration in the entire app outside of the calendar, and it earns its place: seeing the two states side by side communicates more clearly than any description could that joy and completion are different things with different visual representations. The page follows the established header pattern, breathing well, with appropriate dividers between sections. It is the most coherent page in the product.

---

## 2. Navigation Coherence

The app's navigation architecture is simple and confident: two primary tabs in a fixed bottom nav (Today, History), two secondary pages accessible from Settings (Manage, Help), and one in-context page accessible from History (Edit Day). This hierarchy matches the frequency of use almost exactly. Today and History are visited daily; Settings is visited occasionally; Manage and Help are visited rarely. The structure does not elevate anything that should be quiet, or bury anything that should be accessible.

Back navigation is consistent across all secondary pages: a "← back" or "← [Page]" link in the top-right, rendered in the `text-xs uppercase tracking-widest text-stone-600` style. The pattern is applied correctly in SettingsView, ManageView, HelpView, and Edit mode within CheckInForm. There are no dead ends — every page has a clear path back to the main navigation.

The only back-navigation friction is conceptual: Settings back-navigation uses sessionStorage to remember the originating page, but the back link always reads "← back" regardless of destination. A user who navigated to Settings from History will see "← back" that goes to History; a user who came from Today will see the same "← back" that goes to Today. The link text is correct but generic — "← Today" or "← History" would make the destination explicit and reduce uncertainty.

The DayDetail bottom sheet opens and closes smoothly, and the edit link at the bottom of the sheet navigates cleanly to Edit Day with the date pre-filled. However, the "Edit" link inside DayDetail does not follow the established navigation link pattern. It renders as `text-sm text-stone-500 underline-offset-4 hover:underline` — a hyperlink style, not the `uppercase tracking-widest` navigation style used everywhere else. This means the one action available within DayDetail (editing the entry) reads as a subordinate text link rather than a navigation action, and it can be missed.

---

## 3. Visual Consistency Across Components

The app is remarkably consistent in its component vocabulary. Border radius follows the Calma hierarchy: `rounded-2xl` on buttons and containers, `rounded-full` on chips and compact controls, `rounded-md` on calendar cells. Border color is consistently `stone-200 / dark:stone-700` on inputs and `stone-100 / dark:stone-800` on dividers throughout. The `divide-y divide-stone-100 dark:divide-stone-800` pattern for habit rows in CheckInForm and the explicit `border-t` dividers in SettingsView and HelpView serve different structural purposes and are applied consistently within their contexts.

HabitToggle, NumberStepper, and MomentChip form the core interactive row family and are visually coherent. They share the same vertical rhythm (`py-3.5` rows), the same text color for labels (`stone-700 dark:stone-300`), and the same general proportion. They feel related without being identical — the toggle is binary, the stepper has input controls, the chip is a pill. The family is working well.

There is one visible inconsistency in this family: text inputs appear in two different shapes within the product. In ManageView, inputs use `rounded-xl` (the Calma compact-control radius). In CheckInForm's inline add-moment form, the input uses `rounded-full` — the pill radius, matching the chip family around it. The context justifies the difference (one is a standalone form field, the other sits among chips), but it creates a small perceptual gap for users who have seen both.

The most clearly mismatched component is the joy representation in DayDetail. In CheckInForm, joy is shown through the custom `BlossomIcon` — five amber petals, amber center, a handcrafted SVG that is the most distinctive visual element in the product. In DayDetail, where a user reviews what they logged, joy is shown as the Unicode character `♥` in `text-amber-500`. The BlossomIcon was designed specifically to communicate that joy and completion are different, that they require different symbols. Replacing it with a generic heart in the review surface undermines that distinction at the exact moment the user is reflecting on their logged data.

---

## 4. Emotional Register by Page

| Page | Current register | Appropriate? |
|---|---|---|
| Today | Calm, personal, slightly anticipatory | Yes — the form invites rather than demands |
| History | Reflective, slightly analytical | Mostly — the heatmap's data-visualization quality is intentional, but "Frequency" as a label tips toward clinical |
| Settings | Quietly functional | Yes — utility pages should not be warm |
| Manage | Clinical, somewhat technical | **Mismatched** — the "Boolean / Numeric" vocabulary breaks the notebook register |
| Edit Day | Personal, archival | Yes — the day-name title gives it a diary quality |
| Help | Warm, explanatory, unhurried | Yes — the best-written page in the product |

Manage is the only page where the emotional register is clearly mismatched to its purpose. The page exists to help users shape their personal practice — to add a new habit they want to track, to rename a moment that no longer fits, to retire something they've grown past. These are reflective, personal acts. The technical vocabulary ("Boolean", "Numeric", "Archive") treats them as data management tasks.

---

## 5. The First-Use Experience

A new user opening the app for the first time lands on Today with four boolean habits, four numeric habits, and four moments already waiting. This is the right call: a blank form with no defaults would feel like a broken experience, while a pre-filled form is immediately functional. The user understands what to do without reading any documentation. They toggle a habit, add a moment, write a reflection, tap Save. The form transitions through "Saving…" → "Day captured" and redirects to History.

This is a good on-ramp. But History on first-ever load is ambiguous. The calendar shows this month with all past days as muted gray cells and one or zero colored cell (the one just saved). There is no copy explaining what the colors mean, no empty-state message suggesting the user come back tomorrow, no indicator that the frequency section exists below. A user who closes the app after their first check-in and returns a week later will find the calendar accumulating colored cells — but the meaning of those colors (cool = habits done, warm = joy and moments) is never surfaced on the page itself. It requires a trip to Help, which requires Settings, which requires two additional taps from either primary tab.

The app is never confusing. It is simply silent where a few words could build trust. "Each day finds its color as you log" or similar one-line copy beneath the empty calendar would orient a new user without cluttering the experienced-user view (it could be shown only when entries are absent or sparse).

---

## 6. The Experienced-User Experience

After three months of daily use, the app holds up better than most in its category. The Today form becomes a ritual rather than a chore — its fixed structure is a feature, not a limitation. You don't need to remember what to fill in; it's always the same form. The constraint creates calm.

The History page genuinely rewards returning. The heatmap accumulates texture; months become visually distinctive. The Frequency section, once discovered, reveals patterns the user wouldn't have noticed themselves ("I've gone on a long walk 19 times in three months"). The filter functionality — tapping a frequency item to highlight matching days in the calendar — is one of the most thoughtful features in the product. It turns the heatmap from a display into an investigation tool.

What the experienced user eventually bumps against: the app doesn't speak back. It holds everything but offers nothing proactively. The reflection textarea has used the same placeholder for months: "Anything about today worth remembering?" The question is good, but a year in it reads like wallpaper. The Frequency list shows counts but not trends — a user cannot see whether their walking habit is more or less common this month than last. None of this is a failure; it reflects a deliberate philosophy. But the boundary between "calm and personal" and "holding data that could say more" is worth revisiting.

The one feature that genuinely becomes friction at high usage: the Joy section in CheckInForm must animate in fresh every session after at least one habit is toggled. For an experienced user who always marks the same two habits as joyful, this is a small repetition. The feature earns its place for new and occasional users; it may become slightly mechanical after many months. There is no path to "remember my joy preferences from yesterday" that would fit the app's model without compromising the intentional separation of factual (done) and emotional (joy) tracking.

---

## 7. The One Thing

The app's single most important design observation is this: **when a user opens DayDetail to review a day where they marked joy, the BlossomIcon — the app's most distinctive visual element — is absent. A Unicode `♥` appears in its place.** The BlossomIcon was designed to communicate a specific distinction: that joy and completion are different enough to require a different symbol. DayDetail is the surface where the user reflects on what they logged. It is the most important review moment in the entire product. Using a generic heart character in place of the blossom at this moment undermines the very distinction the icon was created to draw.

This is symptomatic of a broader gap: several features — particularly the Joy section and the heatmap color system — make conceptual promises that the app's visual language supports on the input side but doesn't fully carry through to the review side. Fixing the DayDetail joy symbol from `♥` to `BlossomIcon` would close the most visible of these gaps.

---

## Appendix: Supporting Observations (Not Primary Issues)

These observations are real but secondary to the findings above.

- **ManageView "Boolean" / "Numeric"** — the most technically-worded moment in the product, in a page that exists for personal habit management. Consider "Yes/No habit" and "Counted habit" or similar plain-language alternatives.
- **DayDetail "Edit" link** — does not follow the `uppercase tracking-widest` navigation pattern used by every other nav action in the app. Renders as a hover-underline hyperlink rather than a typographic navigation element.
- **History empty state** — the heatmap's meaning (cool = habits, warm = joy/moments) is never explained on the page itself. First-time users must navigate to Help to understand the color system.
- **CheckInForm section label margins** — Habits and By the Numbers use `mb-1`; Moments, Joy, and Reflection use `mb-3`. The top half of the form feels compressed relative to the bottom half. Two characters to fix.

---

> **The single most important observation, restated:**
>
> DayDetail — the app's primary review surface — does not use the BlossomIcon to represent joy. It substitutes a plain Unicode ♥ character. The BlossomIcon exists precisely to communicate that joy and completion are different things; replacing it with a generic heart at the moment of reflection is the clearest way the app's visual language contradicts its own design intent. Fix this first.
