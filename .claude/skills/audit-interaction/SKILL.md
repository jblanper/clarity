# Audit — Interaction & Motion

Audit all interactive elements and animations for compliance with the Calma
interaction principles and the Motion library implementation patterns in CLAUDE.md.

## Before starting

Read `CLAUDE.md` and `docs/calma-design-language.md` in full.
Pay particular attention to the "Subtle interactions" bullet and the
"Motion animations" and "Exit animation snap" notes in CLAUDE.md.

## Scope

Read every file in `components/` and `app/`.

## What to check

### 1. Transition completeness
Every interactive element must carry `transition-colors` (or equivalent) so
state changes animate. Check all buttons, links, toggles, chips, and nav items.
Produce two sub-tables: Passing and Missing.

### 2. Motion library usage
For every use of `motion/react` (`m.*`, `AnimatePresence`, `LazyMotion`, etc.):

- **Duration** — all animations must be ≤ 320 ms. Flag any `duration` above this.
- **Easing** — enters should use ease-out; exits should use ease-in. Flag mismatches.
- **Height reveals** — must use `animate={{ height: "auto" }}` with
  `style={{ overflow: "hidden" }}`. Flag any height animation that doesn't follow this.
- **Directional slides** — must use named `variants` + `custom` prop on both
  `AnimatePresence` and `m.*`. Inline function syntax on `initial`/`exit` is
  NOT called with `custom` and must not be used. Flag any instance of this pattern.
- **Exit snap** — when `exit={{ height: 0 }}` is on an element with padding or
  margin via className, those must also be animated to 0 in `exit`. Flag any
  element where `py-*`, `pt-*`, `pb-*`, or `mb-*` is not zeroed in exit.
- **MotionProvider** — `LazyMotion + domAnimation + MotionConfig reducedMotion="user"`
  must wrap the app. Verify this is in place and not duplicated.

### 3. Reduced motion
`MotionConfig reducedMotion="user"` in `MotionProvider` handles this globally.
Flag any animation that bypasses `MotionProvider` (e.g., raw CSS `@keyframes`
without a `prefers-reduced-motion` media query).

### 4. CSS vs Motion boundary
- **CSS transitions** are correct for: hover/active state colour changes, simple
  opacity changes on static elements
- **Motion library** is required for: enter/exit animations, height reveals,
  directional slides, anything involving layout changes

Flag any place where Motion is used where CSS would suffice, or where CSS is
used for something that requires Motion.

### 5. Scroll lock
`DayDetail` must use `useLayoutEffect` (not `useEffect`) for
`document.body.style.overflow = "hidden"`. Flag if `useEffect` is used instead.

## Output

Write the results to `docs/audit-interaction.md`. Overwrite if it already exists.

Structure the file as:

```
# Interaction & Motion Audit

Calma principles reviewed against every interactive element and animation.
Severity: High (breaks experience or accessibility) · Medium (noticeable deviation)
· Low (polish/consistency)

---

## 1. Transition completeness

### Passing
| Element | File | Classes |

### Missing
| Element | File | Issue | Severity |

## 2. Motion library usage

### Duration violations
### Easing violations
### Height reveal violations
### Directional slide violations
### Exit snap violations
### MotionProvider

## 3. Reduced motion
## 4. CSS vs Motion boundary violations
## 5. Scroll lock

---

## Summary
N high · N medium · N low
```
