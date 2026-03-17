# Design Audit — Overall Coherence
## Clarity × Calma

Generated: 2026-03-17 11:07
Scope: All pages, all components, first-use and experienced-user perspectives.
Reference: docs/calma-design-language.md, prior audits in docs/.

---

## Preamble

Clarity is remarkably coherent for a project of its scope. The Calma identity — warm stone tones, generous whitespace, typographic hierarchy, no gamification — holds across every page. The specific audits reveal only one unresolved critical issue (ManageView moment chip contrast, pre-existing) and a handful of low-severity polish items. The overall design review finds the greatest gap not in any individual violation but in a structural asymmetry: the Today page, the app's primary surface and the one users see daily, is underweight relative to the richer, more considered pages that surround it.

---

## 1. Page-by-Page Design Review

### Today (CheckInForm)

The Today page is the most-used surface in the app, yet it is the thinnest in terms of visual identity. The form structure is correct — section labels, habit list, moments chips, reflection textarea, Capture button — and the spacing register is consistent with the rest of the app. What is missing is any sense of occasion. A first-time user arriving here sees a list of habits to check off and a reflection box. Nothing in the page communicates why this matters or invites engagement. The "How Clarity works" link at the bottom is functionally fine but it sits below the fold on most phones and will never be seen after the first week.

The Highlights (Joy) section that appears when habits are checked is one of the most successful moments in the form. It arrives at the right time, uses the amber panel treatment correctly, and creates a genuine emotional pause between task-completion and reflection. This is the page at its best.

The "By the numbers" section label is the only section label in the app that is not a single clean noun. "Habits", "Moments", "Reflection" — then "By the numbers". The phrase is conversational and was probably chosen to feel human, but it is the longest label by far and slightly disrupts the quiet typographic rhythm. Medium.

The form's empty state (all checkboxes unchecked, no moments selected, blank reflection) is not handled specially — the form simply looks unfilled, which is correct. There is no guilt-inducing indicator, no empty-state message, no prompt. This is right.

Edit mode (same CheckInForm, date prop set) works well. The day-name primary title and date subtitle is a thoughtful touch — it signals clearly that you are editing a past day without labelling the page with a technical "Edit" header. The "← history" back link is correct and clear.

### History (HistoryView + CalendarHeatmap)

The History page is the strongest page in the app from a design perspective. The typographic calendar (font weight as data channel, amber for joy/moments) is a genuinely distinctive implementation of the Calma two-axis blend principle — it feels like an art direction decision, not a component default.

The month navigation is well-considered. The month heading crossfade, the slide animation on month change, the conditional year row — all feel earned. The disabled state on the "next" arrow when at current month is correctly communicated via `opacity-30`.

The SegmentedPill period selector sits in the Frequency section and is well-placed. Its inactive segments use `text-stone-600` on `bg-stone-100` (≈5.9:1), meeting the elevated-background contrast threshold.

The Frequency section is collapsed by default — the right call. The section label styled as a toggle button with a rotating chevron follows the Calma pattern. The scroll-anchor preservation on collapse is a thoughtful polish detail.

The empty state ("Your days will appear here once you start logging.") is placed below the calendar, which shows even for first-time users. Correct — the calendar communicates the spatial metaphor before there is any data.

### Settings (SettingsView)

Settings is clean and confident. The navigation card for "Habits and moments" and "How Clarity works" uses the Calma nav-card pattern correctly. The SegmentedPill theme switcher is a natural fit for a binary choice.

The BACKUP / RESTORE sub-section labels inside "Your data" are uppercase and tracking-widest, matching the section label register. Their use of literal "BACKUP" and "RESTORE" strings (not CSS `text-transform`) was accepted in the microcopy audit. The decision is defensible but slightly jarring against the rest of the copy register, which never uses all-caps. Low.

The Reset section's amber tertiary button ("Start fresh") and the two-step confirmation flow (amber → red confirm + neutral cancel) is one of the best-executed flows in the app. The button hierarchy at the confirmation step — red inline text for the destructive confirm, stone-500 for the safe cancel — is clear without being alarming.

One structural observation: Settings uses `mb-8` section spacing where other pages use `mb-10`. This is a pre-existing Low finding in the typography audit. The difference is subtle but creates a slightly more compressed feel on Settings compared to Today and History.

The back navigation reads "← Today" or "← History" based on `sessionStorage`. Fully Calma-compliant. Users who arrive from Today see "← Today"; users from History see "← History".

### Manage (ManageView)

Manage is the most complex page and holds up well. The action tray pattern (tap row → tray reveals below with Edit / Archive / Joy) is the considered solution for a list that needed secondary actions without nav-card rows. The amber "Joy" pill badge on `joyByDefault` habits is exactly the attribute-badge pattern from the Calma spec. The `mode="wait"` AnimatePresence tray → edit form transition is smooth.

The Moments chip grid uses the correct idiom for a short list of named tags. The muted `bg-stone-100 text-stone-600` edit-target state (the chip dims when its edit form is open) is the correct spatial anchor pattern per spec — but the colour audit flags the current build has `text-stone-400` instead of `text-stone-600` on the editing chip, failing WCAG AA on `bg-stone-100`. This is the only remaining critical finding in the codebase.

The "Manage" page title is the weakest title in the app. Every other page title is a noun that names what the user sees ("Today", "History", "Settings", "Help"). "Manage" is a verb — it names what the user does, not what the page contains. A more natural title would be "Habits & Moments". Medium — it contradicts the Calma principle that labels should name destinations, not actions.

The archived-items disclosure pattern (collapsed by default, auto-expands on archive) is excellent. The confirmation note "Archived. Past entries are preserved." appears inline without a toast or modal — correct Calma treatment.

One minor inconsistency: the Habits section header row has a `+ New` button inline on the right, but the Moments section header has only the section label — the `+ New` chip is inside the chip grid itself. The asymmetry is functional but produces different internal layouts for the two section headers. Low.

### Help (HelpView)

Help is the quietest and most content-driven page. The `font-light leading-relaxed` body copy class is used correctly throughout. Section dividers use the hairline border pattern consistently. Section labels are correct on all instances.

The blossom icon pair (outlined / filled) in "The daily form" section is a genuine delight — it teaches the joy interaction visually in context. This is the Calma two-state symbol principle working exactly as intended.

The "Design language" link uses `<Chevron direction="right" />` after the label text. This is directionally consistent with Settings nav-card rows and contextually correct, but it is the opposite arrow convention from the header back-links (which lead with the chevron). Low — users will understand the affordance.

The Help page header uses `items-start` (matching Today and Edit) while History and Manage use `items-center`. Minor header alignment inconsistency. Low.

### Edit (app/edit/page.tsx + CheckInForm in edit mode)

The Edit page is correctly implemented as a thin shell wrapping CheckInForm with a date prop. The render-nothing-until-date pattern prevents a flash of today-mode. The edit-mode header (day name + date subtitle) is distinct from today-mode without being jarring.

The `pb-12` bottom padding in edit mode (vs `pb-28` in today-mode) is correct — edit mode has no BottomNav, so it does not need extra clearance. This detail was handled correctly.

---

## 2. Cross-Page Consistency

- **Header pattern (title left, nav right)** — Consistent across all pages. Minor: Today/Edit/Help use `items-start`; History/Manage use `items-center`. The difference is imperceptible in practice but is unintentional. **Low.**

- **Section label pattern** — Fully consistent. All six required classes present on every instance (confirmed by typography audit). No issues.

- **Back-link text** — Fully Calma-compliant. Every back link names the destination: "← Today", "← History", "← Settings". No generic "← back" anywhere.

- **Section spacing** — Settings uses `mb-8`; all other pages use `mb-10`. Consistent within each page, asymmetric across the app. **Low.**

- **Primary button style** — All instances use `bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900` with correct hover/active variants. Consistent.

- **Empty states** — Three empty states: DayDetail "Nothing here yet", FrequencyList "Nothing logged in this period", HistoryView "Your days will appear here once you start logging." All are inviting and non-accusatory. Consistent tone.

- **Divider pattern** — Settings and Help use the hairline border divider between sections. Today and Manage use spacing alone. This asymmetry is intentional (Settings and Help have more distinct thematic breaks) — not an error. **Low** (worth documenting as intentional).

- **Nav card pattern** — Used correctly in Settings only, where two navigation destinations are grouped. Not applied elsewhere.

---

## 3. Emotional Identity

Overall the emotional identity is sound. No gamification, no streaks, no progress bars, no score. The app feels like a notebook, not a dashboard.

**What holds:**

The Joy / Highlights architecture is the app's strongest emotional design decision. Separating completion (a habit was done) from joy (it also felt good) is a philosophical statement expressed through interaction design. The blossom icon, the amber treatment, and the Highlights section in DayDetail all do emotional work correctly.

The save confirmation ("Day captured") is one of the best pieces of microcopy in the app. "Captured" implies preservation and care, not task completion. It is exactly Calma.

The absence of streak counters, points, level-ups, or encouragement messages is notable and correct. Nothing congratulates or rewards. The app simply accepts the record.

**Where it could slip:**

The FrequencyList bar graph is the most productivity-tool-like element in the app. A sorted descending list with proportional bars is a dashboard element — it communicates performance, ranking, and comparison. In the context of Clarity this is appropriate (users want to see which habits they do most), and the neutral stone/amber palette prevents it from feeling competitive. But if this feature grows (trend lines, comparisons), it would start to feel like analytics. The current implementation is acceptable; naming it a risk for future work. **Low.**

The NumberStepper displays a bare `0` in a rounded pill on an empty day. Zero feels slightly more loaded than an unchecked boolean toggle — it looks like a score waiting to be filled. This is inherent to the component type and not a fixable design problem, but worth naming in the context of emotional identity. **Medium (design observation — no code fix implied).**

The HistoryView empty-state experience is well-handled. A first-time user sees a complete calendar of the current month, all dates at `font-light` ghost weight. The text below reinforces it. No emotional pressure.

---

## 4. Information Architecture

**Navigation structure:**

The BottomNav / text-back-link split is well-reasoned. Two primary destinations (Today, History) are always reachable via the bottom bar. Secondary destinations (Settings, Manage, Help) are reachable from the top-right of the pages that need them, with named back links to the caller. Clear and consistent.

**First-time user path:**

A first-time user lands on Today. They see a list of habits, moments chips, a reflection box, and a Capture button. Nothing explains what any of this is. The "How Clarity works" link at the bottom of the form is the entry point to Help, but it is positioned below the Capture button — below the fold on most phones. A first-time user who taps "Capture" without reading Help will enter an empty entry and be redirected to History. They may never discover that joy-marking, moments, and reflection are distinct intentional features — the app will be used as a basic checklist.

This is a **Medium** finding. The help link exists and is in the right visual register (small, quiet, non-intrusive). Its position below the Capture button is the problem — it requires the user to scroll past the primary action to see it.

**DayDetail flow:**

The DayDetail sheet triggered by tapping a calendar day is seamless. The sheet has an ✕ close button and "Edit this day" tertiary link. After editing, the user redirects to `/history?open=[date]`, which auto-opens the DayDetail and cleans the URL. The round-trip is well-engineered.

**Settings → Manage back link:**

Manage uses "← Settings" (a `<Link href="/settings">`). If a user navigates directly to `/manage` (e.g. bookmarked), the back link goes to Settings, which defaults to "← Today" with no `sessionStorage` entry. A direct-to-Manage user ends up on Today after two back taps — reasonable behaviour.

**Dead ends:**

None found. Every non-primary page has a back link. No page is unreachable from the main flow.

**BottomNav tap targets:**

The BottomNav links rely on the `h-14` container for vertical hit area rather than declaring `min-h-[44px]` on the link elements themselves. In practice the 56px container provides sufficient target height. Pre-existing Low.

---

## 5. Summary & Most Important Observation

**Most important observation:** The Today page — the app's primary surface, opened every day — lacks any discoverable on-ramp for a first-time user, and the single help link ("How Clarity works") is buried below the Capture button where it will not be seen after the first session. The fix is not to add marketing copy or a welcome screen — both would contradict Calma. The fix is to reposition the help link above the Capture button, or surface it in the header area (for example, as a second quiet link alongside "Settings" in the top-right). Every other page in the app is either self-explanatory or has obvious help navigation reachable within one tap. Only Today leaves a first-time user to discover joy-marking, moments as a distinct input type, and the reflection field's intent by chance. A user who taps through the checklist and hits "Capture" without exploring has missed the app's entire emotional identity — and the one link that explains it is positioned as an afterthought below the action they just completed.

Findings by severity: 1 critical (pre-existing, ManageView moment chip contrast) · 3 medium · 6 low
