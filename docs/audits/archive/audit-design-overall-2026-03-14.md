# Design Audit — Overall Coherence
## Clarity × Calma

Generated: 2026-03-10 10:35
Scope: All pages, all components, first-use and experienced-user perspectives.
Reference: docs/calma-design-language.md, prior audits in docs/.
Archived previous report → docs/audits/archive/audit-design-overall-2026-03-10.md

Sprint 8 / Sprint 9 context: The prior audit (2026-03-07) identified 16 findings across all severity levels. 15 of the 16 have been resolved in the intervening sprints. This audit reflects the current codebase.

---

## Preamble

Clarity is, at this point, a genuinely coherent product. The Calma identity is no longer something being applied to the app — it has been absorbed by it. Reading through the components in sequence, the vocabulary is consistent, the typography hierarchy lands, the motion restraint holds, and the writing register is almost uniformly human. The most jarring violations from prior cycles — the "Boolean"/"Numeric" picker, the Edit-link-as-footnote, the anonymous "← back" button — are gone. What remains is a thin layer of finish work, not a coherence problem. One structural issue stands out from the others: the add-moment flow in CheckInForm still presents three touch targets that fall well below 44px. This is the only remaining action item that carries real risk to mobile users.

---

## 1. Page-by-Page Design Review

### Today (CheckInForm)

The Today page reads as a considered daily ritual. The section arc — Habits, By the numbers, Moments, Joy, Reflection — feels natural in sequence: structural, quantitative, spontaneous, emotional, open. The Joy section still earns its place through its conditional appearance; revealing it only after at least one boolean habit is marked done makes the factual/emotional separation tangible without comment. The reflection textarea is now `text-sm font-light` — it feels like a writing space, not a form field. "Day captured" remains the best two-word sequence in the app.

What isn't working:

Three touch targets in the add-moment flow remain below 44px. The "＋ New moment" dashed button (`py-2` ≈ 32px, line 361), the inline "Add" confirm button (`py-2` ≈ 32px, line 395), and the dismiss "✕" button (no sizing, line 403) all fail the Calma touch-target floor. The ✕ is the most severe — roughly 20px tall and close to the Add button, creating a real mis-tap risk. This is the only unresolved action item from the prior audit cycle.

The "＋ New moment" dashed button still uses the fullwidth plus sign `＋` (line 361) while ManageView uses the standard `+` for its equivalent "Add habit" and "Add moment" buttons. The difference is imperceptible to most users but is a small inconsistency in the add-item vocabulary.

### History (HistoryView + CalendarHeatmap + FrequencyList)

History is the strongest page in the app. The two-axis colour system continues to be the most visually distinctive feature of any habit tracker — personal, legible, emotionally honest. The filter integration between the calendar and the frequency list is sophisticated without being explained; it is discoverable through the one-time hint and then simply works. The scroll-lock-before-collapse behaviour prevents the main interaction jarring point for experienced users.

The empty state was added since the last audit and represents a genuine improvement. A first-time user who opens History now sees "Your days will appear here once you start logging." rather than nothing.

What isn't working:

The empty state message appears after the Frequency section divider — below the toggle button, after the calendar grid. On a phone, a first-time user sees the calendar of blank cells, the "Frequency" section label, and must then scroll past all of that to reach the orientation message. The message is reassuring when found, but its placement separates it from the blank calendar it is meant to explain. Moving it to immediately after the calendar (between the heatmap and the section divider) would connect it to the surface it describes.

The CalendarHeatmap month crossfade (line 260, `duration: 0.12`) now meets the 120ms floor. Year-nav buttons now have `min-h-[44px]`. The FrequencyList bar animation now uses `scaleX` correctly. These were all resolved since the prior audit.

The inactive period selector buttons in FrequencyList (lines 129, 134, 139) still use `text-stone-400 dark:text-stone-500`. In light mode, stone-400 at 2.4:1 fails WCAG AA. These are deferred from the prior cycle; they carry slightly elevated risk since they appear on a page that experienced users visit often.

### Settings (SettingsView)

Settings is now the cleanest utility page in the app. The back button correctly names its destination — "← Today" or "← History" — making it the only page in the app that also resolved the anonymous-back-button problem. All section labels now carry `font-medium`. The export description lost its "JSON" jargon and reads naturally. Import success copy ("X days added. Y days were already in your history and weren't changed.") is specific and human. The export error ("Couldn't download the backup — try again.") is calm and direct.

No significant concerns.

### Manage (ManageView)

ManageView continues to be the most improved page since the first audit. The habit type picker now reads "Yes / No" and "Number" — plain language that belongs in a personal tool, not a spreadsheet field. The joyByDefault toggle uses "Brings joy by default" / "Joy is marked separately" in the add form, and "Brings joy by default" / "Tap to mark as joyful by default" in the edit section. The add-form copy is factual; the edit copy is instructional. Both are appropriate to their context.

The inline label field is now "Increment" in both the edit and add forms. The Jump to Moments anchor uses `text-stone-600 dark:text-stone-500` with `transition-colors`. No WCAG failures remain on this page.

One observation: the joyByDefault inline toggle button in the active-habits list (line 278, `className="self-start text-left transition-colors"`) has no `active:opacity-70`. It is the only interactive element in the list section without press-state feedback. The button is in the deferred touch-targets batch — its size is small — but the missing active-state feedback means pressing it provides no physical acknowledgment.

### Help (HelpView)

Help remains the best-written page in the app. The writing is accurate, unhurried, and never condescending. "Completion and joy are different things, and keeping them apart lets you see the difference over time" is the sharpest articulation of the app's central design choice, and it belongs here. The Calma section — acknowledging the design system to curious users — is a considered touch. Section labels and body text follow the canonical patterns.

No significant concerns.

### DayDetail (review sheet)

DayDetail is now well-resolved. The date heading uses `text-base font-light tracking-widest` — correctly framed as a sheet header, not a page title. The Edit link uses `text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500 transition-colors hover:text-stone-800 dark:hover:text-stone-300` — it reads as a navigation action, not a footnote. The scroll lock, the sticky close button, the BlossomIcon for joy display, and the "Nothing here yet" empty state are all correctly executed.

One minor observation: the Moments section in DayDetail uses `mb-3` for its section heading while Habits, By the numbers, and Reflection sections all use `mb-2`. The three-pixel difference is imperceptible in practice, but it is inconsistent.

---

## 2. Cross-Page Consistency

- **Header pattern** — `flex items-start justify-between` is correct in CheckInForm (today and edit), SettingsView, and HelpView. HistoryView (line 63) and ManageView (line 239) use `flex items-center justify-between`. Neither has a subtitle below the h1, so the visual difference is negligible at current type sizes. Still inconsistent with the CLAUDE.md specification. **Low.**
- **Section labels** — canonical pattern (`text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`) is now correct across all pages. ✅
- **Empty states** — DayDetail ("Nothing here yet"), FrequencyList ("Nothing logged in this period"), History ("Your days will appear here once you start logging.") — consistent in tone and register. The History empty state is misplaced structurally (see §1). **Medium.**
- **Joy symbol** — BlossomIcon used consistently in CheckInForm (joy section), DayDetail (habit list), ManageView (joyByDefault toggle), and HelpView (illustration). ✅
- **Interactive vocabulary** — "Edit", "Archive", "Restore", "Save", "Add", "Cancel" consistent across ManageView, DayDetail, and CheckInForm. ✅
- **Transition-colors** — universal across primary interactive elements. ManageView joyByDefault button (line 278) has `transition-colors` but no `active:` state. **Low.**
- **Inactive period selector at stone-400** — FrequencyList lines 129/134/139 still fail WCAG AA in light mode. Deferred from prior cycle. **Low–Medium.**

---

## 3. Emotional Identity

Clarity's emotional identity — calm, factual, non-gamifying — is successfully maintained across the full app.

Working well:
- No streaks, scores, progress bars, or completion percentages anywhere. ✅
- "Day captured" is the most affirming the app ever gets. ✅
- The Joy section's conditional appearance makes the factual/emotional separation tangible. ✅
- Amber for archive, amber for joy, amber for reset — the semantic weight of amber is consistent throughout. ✅
- The ManageView habit type picker ("Yes / No" / "Number") now matches the human register of the rest of the product. ✅
- Import copy ("Y days were already in your history and weren't changed.") treats historical data as personal, not transactional. ✅

What contradicts the identity:
- Nothing significant remains. The corrections in prior sprints removed the most visible identity breaks.

---

## 4. Information Architecture

The two-level navigation (BottomNav for Today/History; text back-links for utility pages) is clear and consistent. All pages name their navigation destinations explicitly.

Working well:
- BottomNav correctly absent on Settings, Manage, Help, and Edit. ✅
- Settings back button now reads "← Today" or "← History" — the app's navigation contract is fully honoured. ✅
- DayDetail → Edit → `/history?open=[date]` → DayDetail auto-reopens: the redirect chain is smooth. ✅
- DayDetail Edit link is now styled as navigation, not footnote. ✅
- Help links back to Settings. Manage links back to Settings. Both correct. ✅

Concerns:
- History empty state placement: the "Your days will appear here" message appears below the Frequency section, disconnected from the calendar that occasioned it. This is a structural issue, not a navigation issue, but it affects the first-time user journey through the History page. A user's natural path is Today → History, and on History they encounter the blank calendar before finding any orientation.

---

## 5. Summary & Most Important Observation

**Most important observation:** The add-moment flow in `CheckInForm.tsx` still presents three touch targets below the 44px minimum: the "＋ New moment" dashed trigger button (line 361, `py-2` ≈ 32px), the inline "Add" confirm button (line 395, `py-2` ≈ 32px), and the dismiss "✕" (line 403, no sizing, ≈ 20px). The ✕ is the most critical — it is 20px tall, positioned immediately adjacent to the Add button, and carries no label. On a real mobile device, dismissing the add-moment flow requires hitting a target roughly the size of a lowercase letter. Adding `min-h-[44px] flex items-center justify-center` to each of the three elements and wrapping the ✕ in a properly sized container — without changing any visual appearance — would close this gap.

Findings by severity: **0 critical · 0 high · 2 medium · 4 low**

Severity reference: **High** = breaks page coherence or significantly contradicts Calma identity · **Medium** = noticeable inconsistency or user-facing risk · **Low** = minor polish item

| # | Page | Finding | Severity |
|---|---|---|---|
| 1 | CheckInForm | Add-moment flow: 3 touch targets below 44px | Medium |
| 2 | History | Empty state placed after Frequency section, disconnected from calendar | Medium |
| 3 | CalendarHeatmap / FrequencyList | Inactive period selector `text-stone-400` fails WCAG AA in light mode | Low |
| 4 | HistoryView / ManageView | Header uses `items-center` instead of spec-required `items-start` | Low |
| 5 | ManageView | joyByDefault inline button missing `active:opacity-70` | Low |
| 6 | DayDetail | Moments section heading uses `mb-3`; all other section headings use `mb-2` | Low |
