# UX Evaluation Report

**Date and time:** 2026-03-14 21:30
**Area reviewed:** Settings page — full view (Manage, Theme, Your Data, Help, Reset)
**Designer:** UX Radical Evaluation
**Prior evaluations:** 2026-03-13-2015 (CheckInForm), 2026-03-14-0840 (Manage bold redesign), 2026-03-14-1317 (DayDetail). None cover Settings. No archiving required.

---

## Scope

The Settings page in full — every section, both light and dark modes, and the reset confirmation state. Evaluated against the current design direction established across the prior three evaluation cycles: amber as the completion/selection language, section cards as the structural container pattern (per the Manage redesign B1), and the broader push toward a quieter, more intentional visual hierarchy.

---

## What's working

The **section label treatment** is textbook. Every section — MANAGE, THEME, YOUR DATA, HELP, RESET — uses the correct pattern without exception. The page has the right rhythmic structure.

The **hairline dividers** are doing their job. The `border-stone-100 dark:border-stone-800` dividers create section boundaries without adding visual weight. For a settings page that is mostly navigational, this is the right structural tool.

The **navigation links** ("Habits and moments", "How Clarity works") are well-considered. Text left, chevron right, `py-2` for touch target clearance, stone-700 body weight — they read as navigation without demanding attention. The chevron color stepping back to stone-500 while the label stays stone-700 is a small but correct choice.

The **dark mode rendering** is genuinely good. The surface shifts to the warm charcoal, the dividers recede correctly, and the Export/Import buttons maintain their proportional weight without going harsh.

The **reset confirmation copy** — "This will delete all entries and restore default habits and moments." — is calm, specific, and non-alarming. That's exactly the right register. The two-tap pattern is the right interaction choice for a destructive action.

---

## What needs attention

### 1. The Theme toggle has no affordance — it's two words, not a control

**What:** The Theme section shows "Light" and "Dark" as two text buttons sitting next to each other with `gap-6` between them. The active state is `font-medium text-stone-900 dark:text-stone-100`; the inactive state is `text-stone-500 dark:text-stone-400`. There is no container, no enclosure, no indicator shape — just typographic weight and color to distinguish selected from unselected.

**Where:** `SettingsView.tsx:139–163`, the `flex gap-6` div in the Theme section.

**Why it matters:** A user encountering this for the first time sees two words. They don't know if these are the current states being reported, or two options they can choose between. They have to tap one to discover it's interactive. The inactive text (`text-stone-500`) sits right at the WCAG AA minimum — fine for a label, but as the main affordance signal for an interactive control it's doing too much work. Meanwhile every other selection pattern in the app signals "selected" through amber or a filled shape — this control does neither. It signals through weight and contrast alone, which is the weakest possible affordance signal.

In dark mode the problem is slightly worse: inactive Dark before clicking reads as `text-stone-400` (muted) and active Light reads as `text-stone-100` (bright). Without a container, the two words look like a label-value pair ("Light | **Dark**") rather than a segmented choice.

**Calma alignment:** The Calma spec's "chip / tag variant" describes exactly this use case — "A pill-shaped chip communicates selection state through amber fill when selected; transparent background with stone border at rest." The theme toggle is a two-option selection; it should use an enclosure that makes the selection state unmistakable. The current implementation does not follow this pattern.

---

### 2. "Export backup" and "Choose file" are full-width secondary buttons — but they're initiating lightweight actions

**What:** Both the Export and Import initiating actions use `w-full rounded-2xl border py-4 text-sm tracking-widest` — the same full-width treatment used for the Import confirm button (which is the actual primary action after choosing a file). All three buttons in the Your Data section have identical visual weight.

**Where:** `SettingsView.tsx:178–217`.

**Why it matters:** The button weight hierarchy on this page assigns the same importance to "here is a file, import it" (legitimate primary action) and "open the file picker" (low-stakes initiation). The full-width `py-4` buttons feel like calls to action when they're really just triggers for system dialogs. This is particularly apparent in light mode where both Export and Import sit as large white cards with stone-200 borders — the section looks like a form demanding completion rather than a utility page with occasional actions.

There's also a structural issue: Export and Import are two distinct operations sitting in the same section with no internal hierarchy. The description paragraphs above each button are the only way to distinguish them. A user scanning the page reads descriptions before buttons — the scanning order is wrong.

**Calma alignment:** The Calma button hierarchy spec distinguishes between primary (single most important action per screen), secondary (alternative), and tertiary (low-hierarchy contextual). Export and Import initiation are neither primary nor secondary in the full-page context — they're contextual utilities. The full-width `py-4` secondary treatment overstates their importance.

---

### 3. Reset uses amber for a permanently destructive action — and the confirmation doesn't escalate

**What:** "Reset to factory defaults" is `text-amber-700 dark:text-amber-500`. After tapping, the confirmation "Yes, reset everything" is also `text-amber-700 dark:text-amber-500`. Same color throughout both stages of a two-tap flow that ends in permanent data deletion.

**Where:** `SettingsView.tsx:312–325` (initial), `SettingsView.tsx:325–334` (confirmation).

**Why it matters:** The Calma semantic color rules are unambiguous: "Amber communicates 'significant but recoverable.' Red communicates 'gone.'" Factory reset is irreversible. There is no recovery path after confirming. Amber is the wrong register for the confirmation action, which is the terminal destructive step.

The first tap — the nudge — in amber is defensible as a low-prominence entry point. You could argue the entire reset flow is amber because a backup was presumably made before resetting. But that's a post-hoc justification for a rule violation. The confirmation button — "Yes, reset everything" — is the moment the user is about to lose everything. It should not look identical to the initial amber link that invited them here.

The two-tap pattern was designed to create an escalation moment. The visual design currently flattens that escalation. Both steps look the same. The user gets no feedback from the interface that they have crossed into a more serious zone.

**Calma alignment:** Direct violation of the semantic color rule. "Red signals: errors and permanent destructive actions only." Factory reset is a permanent destructive action.

---

### 4. The Settings page and the Manage page are structurally diverging

**What:** The Manage page (per the B1 proposal in the 2026-03-14-0840 report) is being redesigned around section cards — `rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800`. The Settings page uses bare hairline dividers. These pages share a navigation hierarchy (Settings → Manage) and are visited sequentially by any user who wants to configure their habits. They should feel like they belong together.

**Where:** The page-level structure of `SettingsView.tsx`.

**Why it matters:** When B1 ships on the Manage page, the structural contrast between the two pages will be jarring. Settings: sparse, bare, text-over-white. Manage: contained, card-organized. A user tapping "Habits and moments" will experience a visual shift that reads as a different app rather than a deeper layer of the same one. The Settings page should adopt at least a compatible structural vocabulary before the Manage redesign ships.

**Calma alignment:** No specific Calma rule, but this is a consistency principle: related pages in the same navigation tree should share structural language. The section card pattern is now part of the established Clarity vocabulary.

---

## Proposals

### S1 — Theme section: segmented pill control

**What to change:** Replace the two bare text buttons with a segmented pill control enclosed in a `rounded-full` container. The active option gets a filled indicator using the primary button token.

**Direction:**

```tsx
<div className="inline-flex rounded-full border border-stone-200 dark:border-stone-700 p-0.5">
  <button
    type="button"
    onClick={() => handleThemeChange("light")}
    className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
      currentTheme === "light"
        ? "bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900"
        : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
    }`}
  >
    Light
  </button>
  <button
    type="button"
    onClick={() => handleThemeChange("dark")}
    className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
      currentTheme === "dark"
        ? "bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900"
        : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
    }`}
  >
    Dark
  </button>
</div>
```

The enclosure makes the control self-explanatory. The filled active state uses the primary button token — the same `bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900` that signals "selected / confirmed" throughout the app. Two states, unmistakable, no reading required.

**Calma note:** This applies the Calma "chip / tag variant" at the selection control level. No Calma rules broken — the filled stone rather than amber is appropriate here because theme is a structural setting, not an emotional selection. Amber is reserved for habit completion and joy. Stone-filled selection is the correct register for preference controls.

**Mockup:** [View mockup](./mockup-2026-03-14-2130.html#s1-theme-toggle)

**Effort estimate:** Low. The `flex gap-6` container and both buttons in `SettingsView.tsx:139–163` are replaced. No logic changes.

---

### S2 — Your Data section: sub-labels, tertiary buttons, and human copy

**What to change:** Add subsection labels "BACKUP" and "RESTORE" above the respective description+button blocks. Reduce both initiating action buttons from full-width `py-4` secondary buttons to the Calma tertiary button token. Update all copy — descriptions and button labels — to plain, human language. The Restore confirm button (when a file is ready) retains primary weight and is renamed from "Import" to "Restore" to tie back to the subsection label.

**Direction:**

```tsx
{/* Export subsection */}
<div className="mb-6">
  <h3 className="mb-3 text-xs font-normal uppercase tracking-wide text-stone-500 dark:text-stone-500">
    Backup
  </h3>
  <p className="mb-3 text-sm text-stone-500 dark:text-stone-400">
    Keep a copy of your entries on your device.
  </p>
  <button
    type="button"
    onClick={handleExport}
    className="inline-flex items-center rounded-xl border border-stone-200 dark:border-stone-700 px-4 py-2 text-xs text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
  >
    Save a copy
  </button>
</div>

{/* Import subsection */}
<div>
  <h3 className="mb-3 text-xs font-normal uppercase tracking-wide text-stone-500 dark:text-stone-500">
    Restore
  </h3>
  <p className="mb-3 text-sm text-stone-500 dark:text-stone-400">
    Load a backup file. Days you&apos;ve already logged won&apos;t change.
  </p>
  {importStatus.kind === "idle" && (
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      className="inline-flex items-center rounded-xl border border-stone-200 dark:border-stone-700 px-4 py-2 text-xs text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
    >
      Choose a file
    </button>
  )}
  {importStatus.kind === "ready" && (
    /* file pill + primary confirm button */
    <button
      type="button"
      onClick={handleImport}
      className="w-full rounded-2xl bg-stone-800 dark:bg-stone-200 py-4 text-sm tracking-widest text-white dark:text-stone-900 ..."
    >
      Restore
    </button>
  )}
  {/* ... success / error states unchanged ... */}
</div>
```

**Copy changes summary:**
| Before | After |
|---|---|
| "Download a backup of all your entries." | "Keep a copy of your entries on your device." |
| "Export backup" | "Save a copy" |
| "Restore entries from a backup file. Dates that already have an entry will not be overwritten." | "Load a backup file. Days you've already logged won't change." |
| "Choose file" | "Choose a file" |
| "Import" (primary confirm) | "Restore" |

**Calma note:** The subsection label (`text-xs font-normal uppercase tracking-wide`) is the correct Calma subsection label token. "Export backup" and "Choose file" read as system language. "Save a copy" and "Choose a file" are plain and specific without being vague. "Restore" on the confirm button ties the action back to the subsection label — the word runs through the whole flow: RESTORE → Choose a file → Restore.

**Mockup:** [View mockup](./mockup-2026-03-14-2130.html#s2-your-data)

**Effort estimate:** Low–Medium. Sub-label JSX is additive. Button class and label changes in Export and Import idle states. The confirm button in the `ready` state is a label change only. The `success` and `error` states are unchanged.

---

### S3 — Reset: button affordance, human copy, and red confirmation

**What to change:** Three changes in one pass — (1) the bare amber text link becomes a proper tertiary button with an amber border, giving it affordance without urgency; (2) copy shifts from technical to plain throughout; (3) the confirmation action escalates to red.

**Direction:**

```tsx
{/* Initial state — amber bordered button */}
{!resetConfirming ? (
  <button
    type="button"
    onClick={() => setResetConfirming(true)}
    className="inline-flex items-center rounded-xl border border-amber-200 dark:border-amber-700/40 px-4 py-2 text-xs text-amber-700 dark:text-amber-500 transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/20"
  >
    Start fresh
  </button>
) : (
  <div className="space-y-3">
    <p className="text-xs text-stone-500 dark:text-stone-400">
      Your entries will be removed and habits reset to defaults.
    </p>
    <div className="flex gap-5">
      <button
        type="button"
        onClick={handleReset}
        className="text-sm text-red-700 dark:text-red-400 transition-colors hover:text-red-900 dark:hover:text-red-300"
      >
        Yes, start fresh
      </button>
      <button
        type="button"
        onClick={() => setResetConfirming(false)}
        className="text-sm text-stone-500 transition-colors hover:text-stone-600 dark:hover:text-stone-300"
      >
        Keep my data
      </button>
    </div>
  </div>
)}
```

**Copy changes summary:**
| Before | After |
|---|---|
| "Reset to factory defaults" | "Start fresh" |
| "This will delete all entries and restore default habits and moments." | "Your entries will be removed and habits reset to defaults." |
| "Yes, reset everything" | "Yes, start fresh" |
| "Cancel" | "Keep my data" |

The visual result is a three-stage escalation: amber bordered button (invitation) → confirmation with calmer copy → red terminal action. "Keep my data" on the cancel path is more specific than "Cancel" — it names what you're protecting, which is reassuring at the moment of hesitation.

**Calma note:** The initial button uses the amber tertiary token — `border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-500` — which signals "significant but recoverable." The confirmation button uses `text-red-700 dark:text-red-400`, the Calma error/destructive color. This is a spec compliance fix: "Red signals permanent destructive actions only." "Start fresh" removes the technical jargon ("factory defaults") while remaining specific about consequence when paired with the confirmation text.

**Mockup:** [View mockup](./mockup-2026-03-14-2130.html#s3-reset-escalation)

**Effort estimate:** Low. Button class and label in `SettingsView.tsx:309–315`. Confirmation text and action label in `SettingsView.tsx:317–334`. Cancel label in `SettingsView.tsx:329`.

---

### S4 — Align Manage entry point with the section card vocabulary

**What to change:** Wrap the Manage navigation link in a card container — the same `rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800` that the Manage page itself will use. Move the "MANAGE" section label inside the card header. This creates a visual echo between the Settings entry point and the Manage page it opens.

**Direction:**

```tsx
<section className="mb-8">
  <div className="rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 px-4 pt-4 pb-3">
    <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500">
      Manage
    </h2>
    <Link
      href="/manage"
      className="flex items-center justify-between min-h-[44px] text-sm text-stone-700 dark:text-stone-300 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
    >
      <span>Habits and moments</span>
      <span className="text-stone-400 dark:text-stone-500"><Chevron direction="right" /></span>
    </Link>
  </div>
</section>
```

The card surface signals "there's content structure here" rather than just a bare navigation row. When the Manage page itself opens with the same card treatment, the visual continuity will be immediate.

**Calma note:** Direct application of the "subtle panel" surface token from Calma (`stone-50 / stone-800/50`) and the section divider border token (`stone-100 / stone-800`). This is the same pattern used in the Manage redesign B1 proposal. No new patterns introduced.

**Mockup:** [View mockup](./mockup-2026-03-14-2130.html#s4-manage-card)

**Effort estimate:** Low. A wrapper div is added around the Manage section; the section label moves inside the card. One structural change in `SettingsView.tsx:119–130`.

---

## Sprint recommendations

| Priority | Proposal | File | Effort | Rationale |
|---|---|---|---|---|
| 1 | S3 — Reset button + copy + red confirmation | `SettingsView.tsx` | Low | Closes the Calma semantic color violation, gives the action proper affordance, and removes technical jargon in one pass. All changes are co-located in the Reset section. |
| 2 | S1 — Theme segmented pill control | `SettingsView.tsx` | Low | Fixes the clearest affordance gap on the page. A first-time user cannot tell the Theme control is interactive without tapping it. |
| 3 | S2 — Your Data sub-labels + tertiary buttons + copy | `SettingsView.tsx` | Low–Med | Adds scanability, correctly weights initiating vs. primary actions, and humanises the section copy throughout. Warrants its own QA pass across all Restore states (idle, ready, success, error). |
| 4 | S4 — Manage entry card | `SettingsView.tsx` | Low | Best shipped alongside the Manage B1 card structure. Low urgency on its own; high value in context. Extend to Help section at the same time. |

S1 and S3 can be batched in the same commit. S2 is the most involved and warrants its own pass for QA across all Restore states (idle, ready, success, error).

---

## Open questions

- **Help section structure:** "How Clarity works" is a single navigation link under its own section label — structurally identical to Manage. If S4's card treatment is applied to Manage, the same treatment should be applied to Help for consistency. This is trivially low effort and can be batched with S4.

- **Export feedback state:** The current Export implementation has an `exportStatus === "error"` state but no success feedback. After a successful export the button returns immediately to idle — the user has to look at their Downloads folder to confirm it worked. A brief inline confirmation ("Backup saved") would close this feedback loop without adding UI complexity. Not blocking, but worth noting as a future UX improvement once the structural changes ship.

- **"Choose file" label:** This is generic system language — it describes the browser's file picker, not the action the user is taking. "Restore from backup" or simply "Choose backup file" would be more specific. This is a one-word change that could accompany S2.

- **S4 and the divider structure:** If S4 ships, the `border-t` divider that currently separates Manage from Theme would sit between a card (Manage) and bare text (Theme). The visual rhythm would need adjusting — either the divider comes out and spacing alone separates the sections, or the Theme section also gets a card. Worth deciding before implementing S4.
