# Clarity — Style Guide

Clarity's design language is calm and typographic. The UI is almost entirely text-based —
no icons, no gamification, no bright accent colours. Every decision should reinforce the
feeling of a quiet, considered tool.

---

## 1. Design Tokens

CSS custom properties defined in `app/globals.css`, bridged into Tailwind via `@theme inline`.

| Token | Tailwind class | Light | Dark |
|---|---|---|---|
| `--background` | `bg-background` | `#fafaf9` (warm white) | `#1c1917` (warm charcoal) |
| `--foreground` | `text-foreground` | `#1c1917` | `#fafaf9` |
| `--muted` | `text-muted` | `#78716c` | `#a8a29e` |
| `--border` | `border-border` | `#e7e5e4` | `#292524` |
| `--accent` | `text-accent` | `#a8a29e` | `#57534e` |

**Dark mode** is class-based, not system-preference. The `.dark` class is toggled on `<html>`.
Use Tailwind's `dark:` prefix for all dark variants. Never rely on `prefers-color-scheme`.

---

## 2. Typography

All headings use `font-light` and `tracking-widest`. Nothing feels heavy.

### Scale

| Role | Classes | Used in |
|---|---|---|
| Page title | `text-xl font-light tracking-widest text-stone-800 dark:text-stone-200` | All page headers |
| Month heading | `text-base font-light tracking-widest text-stone-600 dark:text-stone-400` | CalendarHeatmap |
| Sheet date heading | `text-lg font-light tracking-wide text-stone-800 dark:text-stone-200` | DayDetail |
| Section label | `text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500` | All sections |
| Body / descriptions | `text-sm text-stone-500 dark:text-stone-400` | Settings helper text |
| Item labels | `text-stone-700 dark:text-stone-300` | Habit names, form labels |
| Small metadata | `text-xs text-stone-400 dark:text-stone-500` | Timestamps, archive notes |
| Error messages | `text-xs text-red-700 dark:text-red-400` (inline) / `text-sm` (page-level) | Validation, export errors |
| Reflection body | `text-sm font-light leading-relaxed text-stone-700 dark:text-stone-300` | DayDetail |

### Section labels

The section label pattern is the single most consistent element in the app. Use it for
every new section heading without exception:

```tsx
<h2 className="mb-3 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
  Section name
</h2>
```

The bottom margin varies by context: `mb-1` when the first child has its own top padding
(habit rows), `mb-3` for most sections, `mb-4` in Settings.

---

## 3. Color Roles

Use colors by **role**, not by shade. The role tells you why a color is used.

### Text

| Role | Light | Dark |
|---|---|---|
| Page titles, strong emphasis | `text-stone-800` | `dark:text-stone-200` |
| Body text, item labels | `text-stone-700` | `dark:text-stone-300` |
| Navigation links, arrows | `text-stone-600` | `dark:text-stone-500` |
| Section labels, descriptions | `text-stone-500` | `dark:text-stone-400` or `dark:text-stone-500` |
| Metadata, timestamps, archived | `text-stone-400` | `dark:text-stone-500` |
| Active nav tab, selected option | `text-stone-900` | `dark:text-stone-100` |
| Joy / moments indicator | `text-amber-500` | `dark:text-amber-400` |
| Archive / reversible action | `text-amber-700` | `dark:text-amber-500` |
| Error | `text-red-700` | `dark:text-red-400` |

> **Never use `text-stone-400` as body text in light mode.** It has a 2.4:1 contrast ratio
> against the background — well below the WCAG AA minimum of 4.5:1. It is only safe as a
> `dark:` variant, where it reaches ~7:1 on the dark background.

### Backgrounds

| Role | Light | Dark |
|---|---|---|
| Page background | `bg-background` | (token resolves automatically) |
| Input / card surface | `bg-white` | `dark:bg-stone-900` |
| Subtle panel (inline forms) | `bg-stone-50` | `dark:bg-stone-800/50` |
| Status panels (success, file ready) | `bg-stone-50` | `dark:bg-stone-800` |
| Error panel | `bg-red-50` | `dark:bg-red-950/20` |
| Empty calendar cell | `bg-stone-200` | `dark:bg-stone-800` |
| Toggle track — on | `bg-stone-500` | `dark:bg-stone-300` |
| Toggle track — off | `bg-stone-300` | `dark:bg-stone-600` |

### Borders

| Role | Light | Dark |
|---|---|---|
| Standard card / input border | `border-stone-200` | `dark:border-stone-700` |
| Text input border | `border-stone-300` | `dark:border-stone-700` |
| List dividers | `divide-stone-100` | `dark:divide-stone-800` |
| Section separators (`<hr>`-style) | `border-stone-100` | `dark:border-stone-800` |
| Error panel border | `border-red-100` | `dark:border-red-900/30` |
| Dashed "add" button | `border-dashed border-stone-300` | `dark:border-stone-600` |

---

## 4. Layout & Spacing

### Page container

Every page uses the same container:

```tsx
<div className="mx-auto max-w-md px-5 pt-10 pb-12">
```

- `max-w-md` (448px) — universal mobile-first width boundary
- `px-5` (20px) — standard horizontal gutter
- `pt-10` — top breathing room
- `pb-12` — standard bottom padding; use `pb-28` on pages where BottomNav is visible

### Page header

Every page header follows the same flex pattern:

```tsx
<header className="mb-10 flex items-start justify-between">
  <h1 className="text-xl font-light tracking-widest text-stone-800 dark:text-stone-200">
    Page title
  </h1>
  <button
    type="button"
    className="mt-2 text-xs uppercase tracking-widest text-stone-600 dark:text-stone-500
               transition-colors hover:text-stone-800 dark:hover:text-stone-300"
  >
    <Chevron direction="left" /> back
  </button>
</header>
```

Title on the left, nav link top-right. The `mt-2` on the link aligns it to the title baseline.

### Section rhythm

```tsx
<section className="mb-10">
  <h2 className="mb-3 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500">
    Section name
  </h2>
  {/* content */}
</section>
```

Sections are separated by `mb-10`. Use a border divider (`border-t border-stone-100 dark:border-stone-800 mb-10`) between major Settings groups.

### Common gap values

| Context | Class |
|---|---|
| Moment chip grid | `flex flex-wrap gap-2` |
| Calendar grid | `gap-1.5` |
| Header button groups | `flex gap-5` or `flex gap-6` |
| Stepper controls | `flex items-center gap-2` |
| Toggle + heart button | `flex items-center gap-3` |

---

## 5. Button Variants

**All `<button>` elements that are not form submits must have `type="button"`.**
HTML defaults to `type="submit"`, which will trigger form submission inside any `<form>`.

### Primary (full-width)

```tsx
<button
  type="submit"
  className="w-full rounded-2xl py-4 text-sm tracking-widest transition-colors
    bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900
    hover:bg-stone-700 dark:hover:bg-stone-300
    active:bg-stone-900 dark:active:bg-stone-100"
>
  Save
</button>
```

### Secondary / outline (full-width)

```tsx
<button
  type="button"
  className="w-full rounded-2xl border border-stone-200 dark:border-stone-700
    bg-white dark:bg-stone-900 py-4 text-sm tracking-widest
    text-stone-700 dark:text-stone-300 transition-colors
    hover:border-stone-300 dark:hover:border-stone-600
    hover:bg-stone-50 dark:hover:bg-stone-800
    active:bg-stone-100 dark:active:bg-stone-800"
>
  Export backup
</button>
```

### Compact primary (inline forms)

```tsx
<button
  type="button"
  className="rounded-xl bg-stone-800 dark:bg-stone-200 px-4 py-2
    text-xs text-white dark:text-stone-900 transition-colors
    hover:bg-stone-700 dark:hover:bg-stone-300 disabled:opacity-40"
>
  Save
</button>
```

### Text / ghost action (Edit, Restore)

```tsx
<button
  type="button"
  className="text-xs text-stone-500 dark:text-stone-400
    underline-offset-2 hover:underline transition-colors"
>
  Edit
</button>
```

### Archive / reversible action (amber)

```tsx
<button
  type="button"
  className="text-xs text-amber-700 dark:text-amber-500
    underline-offset-2 hover:underline transition-colors"
>
  Archive
</button>
```

Use amber — not red — for reversible destructive actions. Red implies permanent deletion.

### Navigation link (header)

```tsx
<button
  type="button"
  className="mt-2 text-xs uppercase tracking-widest
    text-stone-600 dark:text-stone-500 transition-colors
    hover:text-stone-800 dark:hover:text-stone-300"
>
  <Chevron direction="left" /> back
</button>
```

### Dashed "add" ghost (chip style)

```tsx
<button
  type="button"
  className="rounded-full border border-dashed border-stone-300 dark:border-stone-600
    bg-transparent px-4 py-2 text-sm text-stone-400 dark:text-stone-500 transition-colors
    hover:border-stone-400 dark:hover:border-stone-500
    hover:text-stone-500 dark:hover:text-stone-400"
>
  ＋ New moment
</button>
```

---

## 6. Form Elements

### Textarea

```tsx
<textarea
  className="w-full resize-none rounded-2xl
    border border-stone-300 dark:border-stone-700
    bg-white dark:bg-stone-900 px-4 py-3
    text-stone-700 dark:text-stone-300
    placeholder-stone-400 dark:placeholder-stone-600
    focus:border-stone-500 dark:focus:border-stone-500 focus:outline-none"
/>
```

### Text input (full-width, rectangular)

```tsx
<input
  type="text"
  className="w-full rounded-xl
    border border-stone-200 dark:border-stone-700
    bg-white dark:bg-stone-900 px-3 py-2 text-sm
    text-stone-800 dark:text-stone-200
    placeholder:text-stone-400 dark:placeholder:text-stone-600
    focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600"
/>
```

### Text input (pill, inline)

```tsx
<input
  type="text"
  className="flex-1 rounded-full
    border border-stone-300 dark:border-stone-700
    bg-white dark:bg-stone-900 px-4 py-2 text-sm
    text-stone-700 dark:text-stone-300
    placeholder-stone-400 dark:placeholder-stone-600
    focus:border-stone-500 dark:focus:border-stone-500 focus:outline-none"
/>
```

### Inline form panel

Wrap inline editors in a consistent panel:

```tsx
<div className="mb-2 rounded-2xl border border-stone-200 dark:border-stone-700
  bg-stone-50 dark:bg-stone-800/50 px-4 py-4 space-y-3">
  {/* fields and actions */}
</div>
```

---

## 7. Interactive States

Apply `transition-colors` to every interactive element. No other transitions except
`duration-300` on the bottom sheet slide and `duration-500` on the save button color wash.

| State | Pattern |
|---|---|
| Hover (links, nav) | `hover:text-stone-800 dark:hover:text-stone-300` |
| Hover (text actions) | `hover:underline` |
| Hover (amber actions) | `hover:text-amber-900 dark:hover:text-amber-300` |
| Active (primary button) | `active:bg-stone-900 dark:active:bg-stone-100` |
| Active (secondary button) | `active:bg-stone-100 dark:active:bg-stone-800` |
| Disabled (controls) | `disabled:opacity-30` |
| Disabled (form save) | `disabled:opacity-40` |
| Non-interactive display | `pointer-events-none opacity-40` (wrapper div) |
| Future dates (calendar) | `cursor-default opacity-25` |
| Focus (inputs) | `focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600` |
| Focus (textarea) | `focus:outline-none focus:border-stone-500 dark:focus:border-stone-500` |
| Selected (chip) | `bg-stone-500 dark:bg-stone-300 text-white dark:text-stone-900` |
| Selected (calendar cell) | `ring-2 ring-stone-500 dark:ring-stone-500` |
| Active (nav tab) | `font-medium text-stone-900 dark:text-stone-100` |

---

## 8. Border Radius

| Element type | Radius |
|---|---|
| Full-width page buttons, textarea, panels | `rounded-2xl` |
| Compact inline buttons, text inputs | `rounded-xl` |
| Pills (chips, stepper buttons, toggle, inputs) | `rounded-full` |
| Bottom sheet (top corners only) | `rounded-t-3xl` |
| Calendar cells | `rounded-md` |

---

## 9. Touch Targets

Minimum 44×44px on all interactive elements:

```tsx
className="min-h-[44px] min-w-[44px] flex items-center justify-center"
```

Calendar navigation arrows use `min-h-[44px]` with `flex items-center` to stretch the
tap area without changing the visual arrow size.

---

## 10. The Chevron Component

All navigation arrows use `<Chevron>` (`components/Chevron.tsx`) — never unicode `←` `→`.

```tsx
<Chevron direction="left" />   // ← back
<Chevron direction="right" />  // forward →
```

The component is `1em × 1em` and inherits color via `currentColor`, so it automatically
matches the surrounding text color. It applies `opacity-50 dark:opacity-100` by default
to keep the arrow visually recessed in light mode.

---

## 11. Rules for New UI

When adding a new page or component, follow these rules:

1. **Page container** — always `mx-auto max-w-md px-5 pt-10 pb-12` (or `pb-28` with BottomNav).
2. **Page header** — `flex items-start justify-between` with `h1` left, nav link top-right.
3. **Section label** — `text-xs uppercase tracking-widest text-stone-500 dark:text-stone-500`, always.
4. **No `text-stone-400` as body text in light mode** — fails WCAG AA. Fine as `dark:` variant only.
5. **All non-submit buttons** — must have `type="button"`. No exceptions inside a `<form>`.
6. **`transition-colors` on every interactive element** — no hover without it.
7. **Hover shifts darker** — `hover:text-stone-800` for text links; `hover:bg-stone-700` for buttons.
8. **Disabled ≠ hidden** — use `disabled:opacity-30` or `opacity-40`. Never hide disabled elements.
9. **Touch targets** — enforce `min-h-[44px]` on anything tappable.
10. **No inline transforms via Tailwind** — Tailwind v4 CSS variable composition can break `translate-x-*`. Use inline `style={{ transform: "..." }}` for animated transforms.
11. **Amber for reversible actions, never red** — red implies permanent deletion.
12. **Borders**: `rounded-2xl` for page-level elements, `rounded-xl` for compact inline, `rounded-full` for pills.
