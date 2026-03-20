# Design Language — Calma

A calm, typographic design system for personal tools. The aesthetic sits closer to a handwritten notebook than a productivity dashboard. No gamification, no urgency, no decoration for its own sake.

---

## Philosophy

Every decision should pass one test: does this feel considered and human, or does it feel like software? Prefer the former. White space is not empty — it is calm. Typography is the primary design material. Color is used sparingly and always semantically.

---

## Palette

Built on the stone scale — warm off-whites and near-blacks rather than cold greys or pure blacks. Feels like paper and ink, not a screen.

A single warm accent (amber) carries all emotional and action weight. Red is reserved for errors only.

### Base tokens

| Token      | Light   | Dark    | Purpose                      |
|------------|---------|---------|------------------------------|
| background | #fafaf9 | #1c1917 | Warm white / warm charcoal   |
| foreground | #1c1917 | #fafaf9 | Primary text                 |
| muted      | #78716c | #a8a29e | Secondary text, descriptions |
| border     | #e7e5e4 | #292524 | Dividers, input borders      |
| accent     | #a8a29e | #57534e | Tertiary, metadata           |

Dark mode is always user-selected, never system-inferred. Respect the user's deliberate choice of mood.

### Color roles — text

| Role                         | Light     | Dark          |
|------------------------------|-----------|---------------|
| Page titles, strong emphasis | stone-800 | stone-200     |
| Body text, item labels       | stone-700 | stone-300     |
| Navigation, secondary links  | stone-600 | stone-500     |
| Section labels, descriptions | stone-500 | stone-400/500 |
| Metadata, timestamps         | stone-500 | stone-400     |
| Active / selected            | stone-900 | stone-100     |
| Accent / joy / selection     | amber-700 | amber-500     |
| Error                        | red-700   | red-400       |

**Accessibility rule:** stone-400 (#a8a29e) fails WCAG AA on the light background — 2.4:1 ratio, well below the 4.5:1 minimum. Never use it as text in light mode. stone-500 (#78716c) is the minimum safe value at ~4.6:1. stone-400 is safe only in dark mode, where it reaches ~7:1 on the charcoal background.

When text appears on an elevated component background (e.g. `bg-stone-100` control tracks, `bg-stone-50` panels), re-check contrast independently — the page-background ratio does not transfer. On `bg-stone-100`, `text-stone-500` fails AA; use `text-stone-600` as the minimum.

### Color roles — surface

| Role            | Light      | Dark         |
|-----------------|------------|--------------|
| Page background | background | (token)      |
| Card / input    | white      | stone-900    |
| Subtle panel    | stone-50   | stone-800/50 |
| Completion wash | amber-50   | amber-900/15 |
| Error panel     | red-50     | red-950/20   |

### Color roles — border

| Role            | Light     | Dark       |
|-----------------|-----------|------------|
| Card, input     | stone-200 | stone-700  |
| Section divider | stone-100 | stone-800  |
| Error           | red-100   | red-900/30 |

### Semantic color rules

- **Amber** signals: accent actions, joy, selection, reversible operations, and row-level completion. A full-row amber wash marks a checked-off item without urgency.
- **Red** signals: errors and permanent destructive actions only.
- **Never use red for reversible actions.** Amber communicates "significant but recoverable." Red communicates "gone."

### Two-axis blend

When a view carries two kinds of meaning at once — one structural, one felt — give each its own color. Cool tones hold presence and completion. Warm tones hold feeling and spontaneity. Where both signals appear together, the colors meet in proportion: neither overwhelms.

The poles are Dusk Blue and Warm Ember.

---

## Typography

A single typeface throughout. Nothing competes. The hierarchy is expressed through size and weight — never by pushing subordinate text below the contrast minimum.

### Scale

| Role            | Size | Weight | Tracking | Color (light) | Notes                     |
|-----------------|------|--------|----------|---------------|---------------------------|
| Page title      | xl   | light  | widest   | stone-800     | Every page header         |
| Section heading | base | light  | widest   | stone-600     | Contextual sub-headings   |
| Section label   | xs   | medium | widest   | stone-500     | Uppercase, always — primary chapter marker |
| Subsection label| xs   | normal | wide     | stone-500     | Uppercase — subordinate to section label   |
| Body            | sm   | normal | normal   | stone-700     | Item labels, descriptions |
| Metadata        | xs   | normal | normal   | stone-500     | Timestamps, helper text   |
| Reflective body | sm   | light  | normal   | stone-700     | Long-form reading content |

### Typography hierarchy

Section labels and subsection labels share the same typographic family but must be clearly distinct. The section label is the chapter — it gets more weight and slightly more size. The subsection label is the note within the chapter — it steps back through lighter weight and reduced opacity, never through contrast failure.

The hierarchy is maintained by **size and weight**, not by color contrast reduction. Both must pass WCAG AA.

### The section label

The single most consistent typographic element. Every section of every page uses it without exception. Uppercase, widest tracking, stone-500. It creates a visual rhythm that unifies the whole system.

---

## Spacing & Layout

### Rhythm

Sections breathe. Use generous vertical space between sections — cramped layouts feel anxious. The base section gap is 2.5rem. Major thematic breaks use a hairline border divider with equal padding either side.

### Page structure

Every page follows the same three-part structure:

1. **Header** — title left, navigation right. Balanced, never crowded.
2. **Sections** — each with a section label and consistent vertical gap between them.
3. **Footer action** — primary action at the bottom with ample clearance from the navigation bar.

### Mobile-first

Max content width: 448px. Horizontal padding: 20px. This keeps lines short and readable on any phone without feeling cramped on larger screens.

---

## Interaction

### Principles

- Every interactive element transitions its colors on hover and active. No exceptions. Color transitions are subtle — one step along the scale. Spatial motion is reserved for layout changes.
- Hover always shifts darker in light mode, lighter in dark mode. Nav links (`stone-600` at rest → `stone-800` on hover) use a deliberate two-step jump rather than a smooth `stone-700` intermediate. This provides clear affordance at hover without adding weight at rest. This is a documented pattern, not a contrast inconsistency.
- Disabled elements are dimmed (40–50% opacity), never hidden. Absence without explanation is confusing. This rule applies to controls that exist but are temporarily unavailable. Controls that only become relevant at a specific state — where their absence is itself informative — may appear contextually. An affordance that disappears when its action is meaningless is clearer than one that persists in a dimmed, unclearable state.
- Touch targets are minimum 44×44px on all tappable elements.

### Button hierarchy

Three levels of visual weight organise actions by importance.

- **Primary** — filled background, maximum visual weight. For the single most important action per screen.
- **Secondary** — outlined, white or card-surface background, medium weight. For alternative actions alongside the primary.
- **Tertiary** — transparent at rest, border, small text, subtle hover wash. For low-hierarchy contextual actions within a detail view. Never competes with primary or secondary.

A tertiary button may use amber border and text when the action is significant but recoverable — one that merits the user's attention without implying irreversibility. Use this amber tertiary sparingly; it should remain the exception on any screen.

### Segmented control

For mutually exclusive choices presented inline (e.g. theme, period), use a segmented pill track: a rounded-full container with a subtle filled background and border, with each segment as a rounded-full button. The active segment lifts to the page-surface background with a shadow and medium-weight text. Inactive segments use muted stone text with a one-step hover shift. All segments must meet the 44 × 44 px touch target.

### Section header action button

When a management section contains a user-editable list, expose the primary list action (e.g. "add new item") as a right-aligned text button in the section header row — not inside the list or chip grid. The button sits on the same baseline as the section label and uses `text-xs` text with the section label's stone color (`text-stone-500 dark:text-stone-400`) and a one-step hover shift. The `+ New` label is minimal and non-possessive. The button is hidden while its form is open, since the open form is a sufficient affordance. This pattern establishes a consistent grammar: section label on the left, section action on the right.

### Navigation card

When a settings or overview surface exposes two or more navigation destinations, group them in a rounded card with a card-surface background and card border, divided by hairline separators between rows. Each row is a full-width link meeting the 44 px touch target, with the destination label on the left and a right-pointing chevron on the right. Rows respond to hover with a subtle surface wash.

### Contextual action tray

When a list row exposes secondary actions (edit, archive, configure), group them in a contextual bordered card that appears below the row on tap. The card uses `rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50` and contains pill-shaped action buttons in a wrapping flex row. The tray enters and exits with a height reveal (220 ms ease-out), with padding animated to zero on exit to prevent snap. The parent row receives a stone wash and label font-weight boost while the tray is open, distinguishing it from the hover state. Only one tray may be open at a time.

### States

| State    | Principle                                                                |
|----------|--------------------------------------------------------------------------|
| Hover    | Shift one step darker/lighter along the stone scale                      |
| Active   | Shift two steps — stronger feedback on press                             |
| Disabled | 30–40% opacity reduction, no pointer events                              |
| Focus    | Subtle ring in stone, no harsh outline                                   |
| Selected | Stone-900/100 for neutral selection, amber for accent/emotional selection |
| Error    | Red text and border, calm copy — never alarming                          |

### Symbols and two-state icons

When a symbol needs to communicate two states — resting and active — use an outlined form for the default and a filled amber form for the selected state. The transition should feel considered, not mechanical.

- **Resting:** outlined stroke in stone-400/500, present but undemanding
- **Active:** filled in amber-400/500, with a warm centre highlight if the shape allows
- The choice of symbol should carry meaning relevant to the context — avoid generic icon library defaults

This pattern works with any simple shape: circles, leaves, petals, sparks. The system does not prescribe a specific symbol — only the two-state principle.

In read-only review contexts, the filled state may be used as a static display indicator — no press state, no animation, no button wrapper. The filled amber form communicates a marked state without implying interactivity.

**Status dot variant:** When the indicator is small (≤12 px) or where an outlined form would be too delicate to read, use a filled dot that shifts color: stone-300/600 at rest, amber-500/400 when active. The dot is always filled — the color alone carries the state change. Place it at the label's leading edge so it reads as an attribute of the row, not a standalone icon.

**Chip / tag variant:** A pill-shaped chip communicates selection state through amber fill when selected; transparent background with stone border at rest. In interactive contexts chips carry standard touch-target height and a color transition. In read-only review contexts — no press handler, no hover — reduce padding by one step to signal static display. Never use a disabled treatment for read-only chips; reduced padding is the signal.

This fill-vs-border state signaling also applies to verb-labeled toggle buttons, where the label remains constant and only the visual treatment changes. When the active state is amber-filled, the button reads immediately without relying on text change — the filled form replaces a "selected / not selected" textual label.

**Chip active-edit state:** When a chip in a grid is the target of an adjacent inline edit form, the chip remains visible at its original grid position with a muted appearance (stone-100 background, stone-600 text) — not hidden, not interactive. This treatment distinguishes the active target from both the resting chip and a disabled chip. The muted chip creates a spatial anchor between the chip's position and the edit form below it.

**Inline edit card (chip context):** When editing an item from a chip grid, the edit form appears as a bordered card below the grid — not as an in-grid replacement that disrupts the layout. The chip being edited remains in the grid in its muted "active target" state, establishing a visible spatial link between the chip and the form. The form enters and exits via height-reveal animation. This pattern preserves the chip grid's shape during editing and avoids reflow.

**Attribute badge variant:** When a list row carries a persistent configuration attribute (e.g. "Joy" for joy-by-default), surface it as a small amber pill placed inline after the item label. The badge is non-interactive — it communicates a state, not an action. Do not apply hover or press styles; the action that changes the state lives elsewhere (e.g. in an action tray).

**Tap affordance indicator:** When a list row is entirely tappable but has no obvious interactive affordance (no chevron, no toggle), a small decorative `···` marker at the trailing edge signals interactivity. It uses `text-stone-500 dark:text-stone-500` — the lowest safe contrast threshold — present but undemanding. WCAG AA applies regardless of semantic role at text-xs size, so stone-500 is the floor. It is positioned with `ml-auto` to always trail any inline badges. It should not appear on rows that are not interactive.

---

## Motion

Motion in Calma is restrained. It confirms actions and clarifies spatial relationships — it does not entertain or celebrate.

### Principles

- Motion reveals or removes. It does not decorate.
- Entering elements ease out — they arrive unhurried. Exiting elements ease in — they leave quickly, without ceremony.
- Directional motion follows spatial logic.
- Elements that change in place fade — they do not move.
- Transitions are short. Nothing should last long enough to feel like waiting.
- Reduced motion is a first-class constraint, not a fallback.

Motion that draws attention to itself has already failed.

### Active press states

Active press states use opacity dimming, not scale transforms. Scale creates a spatial jolt that contradicts the in-place, calm nature of Calma interactions. The "two steps" of active feedback is felt through opacity or color — never through movement.

### Collapsible sections

When a section's collapse would cause a scroll-position jump (because the page shrinks above the viewport), use a two-phase exit: fade opacity to zero first, then collapse height after a short delay. The layout shift happens while content is already invisible, so no jump is perceived. The total exit duration should remain well under 320 ms.

### Height-reveal wrappers

The element being animated from `height: 0 → auto` must not carry vertical padding that is part of its content height. Padding belongs on a non-animated inner wrapper. When Framer Motion measures the target height, any inline `paddingTop/paddingBottom` set to `0` in the `initial` state are included in the measurement; if the wrapper also has class-based `py-*` padding, those conflict and cause a snap at animation end. The solution is to separate concerns: the animated element carries only border and background; all spacing lives inside it on a plain wrapper element.

### Mutually exclusive state transitions

When a single UI slot alternates between two distinct animated components (e.g. an action tray and an inline edit form), use a single `AnimatePresence` with `mode="wait"` so the exiting element completes its exit before the entering element begins. Overlapping entry/exit animations in the same spatial slot create competing visual movement that reads as jank.

---

## Shape

Border radius follows a simple hierarchy based on element scale:

| Scale                               | Radius |
|-------------------------------------|--------|
| Page-level (buttons, panels, cards) | 2xl    |
| Inline / compact controls           | xl     |
| Pills (chips, toggles, tags)        | full   |

Consistency here is more important than the specific values. The system should feel rounded and approachable — never boxy, never so round it feels playful.

---

## Writing & Microcopy

Words are design material. They should feel as considered as any visual element.

- **Empty states** — inviting, never accusatory. *"Nothing here yet"* not *"You haven't done anything."*
- **Confirmations** — brief and human. Avoid clinical words like *"Success"* or *"Completed."*
- **Destructive actions** — calm and specific. Give the user confidence, not anxiety.
- **No exclamation marks.** No all-caps except the section label pattern.
- **Labels** — plain and human. *"Theme"* not *"Appearance Settings."*
- **Navigation labels** — reflect the user's actual destination, not a generic direction. `← Today` or `← History` rather than `← back`. A label that names where you're going is more trustworthy than one that names only the direction.
- **HelpView `›` exception** — the "Design language" link in HelpView deliberately uses a trailing `›` (not the back-link `←` convention). The link opens an external URL in a new tab; `←` implies back-navigation within the app. `›` is semantically correct for an outbound link. This is a deliberate exception to the back-link convention.

### Examples

| Avoid | Prefer |
|-------|--------|
| You missed this day | Nothing here yet |
| Saved successfully! | Day captured |
| Save (new entry) | Capture / Capturing… / Day captured |
| Save (edit) | Save / Saving… / Saved |
| Appearance Settings | Theme |
| Invalid file format detected | That file doesn't look right — try exporting a fresh backup |
| ← back | ← Today / ← History |

---

## What this system is not

- It is not a productivity tool aesthetic. No bright primary colors, no progress bars, no streak counters.
- It is not minimal for minimalism's sake. Every omission should serve calm, not emptiness.
- It is not icon-driven. Text navigates. Words are trusted.
