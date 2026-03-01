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

**Accessibility rule:** stone-400 (#a8a29e) fails WCAG AA on the light background — 2.4:1 ratio, well below the 4.5:1 minimum. Never use it as text in light mode. stone-500 (#78716c) is the minimum safe value at ~4.6:1. stone-400 is safe only as a `dark:` variant, where it reaches ~7:1 on the charcoal background.

### Color roles — surface

| Role            | Light      | Dark         |
|-----------------|------------|--------------|
| Page background | background | (token)      |
| Card / input    | white      | stone-900    |
| Subtle panel    | stone-50   | stone-800/50 |
| Error panel     | red-50     | red-950/20   |

### Color roles — border

| Role            | Light     | Dark       |
|-----------------|-----------|------------|
| Card, input     | stone-200 | stone-700  |
| Section divider | stone-100 | stone-800  |
| Error           | red-100   | red-900/30 |

### Semantic color rules

- **Amber** signals: accent actions, joy, selection, reversible operations.
- **Red** signals: errors and permanent destructive actions only.
- **Never use red for reversible actions.** Amber communicates "significant but recoverable." Red communicates "gone."

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

- Every interactive element transitions its colors on hover and active. No exceptions. Motion is subtle — color shifts only, no movement.
- Hover always shifts darker in light mode, lighter in dark mode.
- Disabled elements are dimmed (40–50% opacity), never hidden. Absence without explanation is confusing.
- Touch targets are minimum 44×44px on all tappable elements.

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

### Examples

| Avoid | Prefer |
|-------|--------|
| You missed this day | Nothing here yet |
| Saved successfully! | Day captured |
| Appearance Settings | Theme |
| Invalid file format detected | That file doesn't look right — try exporting a fresh backup |

---

## What this system is not

- It is not a productivity tool aesthetic. No bright primary colors, no progress bars, no streak counters.
- It is not minimal for minimalism's sake. Every omission should serve calm, not emptiness.
- It is not icon-driven. Text navigates. Words are trusted.
