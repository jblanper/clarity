# Audit — Typography & Spacing

Audit all components and pages for type scale, weight, spacing, and rhythm
compliance against the Calma design language.

## Before starting

Read `CLAUDE.md` and `docs/calma-design-language.md` in full.

## Scope

Read every file in `components/` and `app/`.

## What to check

### 1. Section label pattern
The canonical section label pattern is:
`text-xs font-medium uppercase tracking-widest text-stone-500 dark:text-stone-500`

All six parts are required. Flag any section label missing any part,
particularly `font-medium` (commonly omitted) and `dark:text-stone-500`.
Check both inline class strings and shared `SECTION_LABEL` constants — if the
constant is wrong, note that it propagates to every usage site.

### 2. Type scale consistency
- No `font-bold` or `font-semibold` should appear anywhere (Calma prohibits these)
- `font-medium` is reserved for section labels and navigation emphasis only
- Body text should be unstyled (inheriting `font-normal`)
- Headings use size alone for hierarchy, not weight

Flag any deviation.

### 3. Touch target sizing
All interactive elements must meet `min-h-[44px]` (Calma minimum touch target).
Check buttons, toggles, chips, and nav links. Flag any element visibly below
this threshold (don't flag elements with explicit padding that achieves it
through another route — reason it out).

### 4. Vertical rhythm and spacing
- Section-to-section gaps should be consistent across the form (e.g., `mb-10`
  between sections)
- Section label margins should be consistent (e.g., `mb-3`)
- Flag asymmetries where the same visual element uses different spacing values
  in different parts of the same page

### 5. Max width and layout constraints
- Content columns should be `max-w-md`
- No horizontal scrolling should be possible
- Flag any missing `max-w-md` or elements that could overflow on narrow viewports

## Output

Write the results to `docs/audit-typography.md`. Overwrite if it already exists.

Structure the file as:

```
# Typography & Spacing Audit

Date: [today]
Scope: All component and page files
Reference: docs/calma-design-language.md

---

## Summary
[2–3 sentence overview of the most significant findings]

Severity key: Critical = WCAG AA failure or outright spec contradiction
· High = systemic gap · Medium = missing detail · Low = minor inconsistency

---

## 1. Section label pattern
| Component | Line(s) | Current | Expected | Severity |

## 2. Type scale — weight violations
| Component | Line | Value | Issue | Severity |

## 3. Touch target violations
| Component | Line | Element | Issue | Severity |

## 4. Vertical rhythm inconsistencies
| Component | Lines | Issue | Severity |

## 5. Max width / layout issues
| Component | Line | Issue | Severity |

## Summary counts
N critical · N high · N medium · N low
```
