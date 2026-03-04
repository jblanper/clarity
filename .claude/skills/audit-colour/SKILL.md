# Audit — Colour & Contrast

Audit all components and pages for colour and contrast compliance against
the Calma design language and WCAG AA.

## Before starting

Read `CLAUDE.md` and `docs/calma-design-language.md` in full.

## Scope

Read every file in `components/` and `app/`, plus `app/globals.css`.

## What to check

### 1. Stone-400 violations
`text-stone-400` (`#a8a29e`) fails WCAG AA on the light background (≈2.4:1,
minimum 4.5:1). It is only permitted as a `dark:` variant, or explicitly as a
placeholder or border colour (never as foreground text in light mode).

Flag every instance as one of:
- **Full violation** — `text-stone-400` with no dark pairing at all
- **Light-mode violation** — `text-stone-400` paired with a `dark:` variant;
  the dark pairing is correct but the base still fails

### 2. Colour-role hierarchy
Verify the colour-role hierarchy from CLAUDE.md is followed:
- Primary text: `text-stone-800` / `text-stone-900`
- Body / labels: `text-stone-700`
- Nav links, arrows: `text-stone-600` (hover: `stone-800`)
- Section labels, timestamps: `text-stone-500`
- Errors: `text-red-700 dark:text-red-400`

Flag any element whose role doesn't match its assigned colour.

### 3. Dark mode completeness
Every foreground colour token must have a `dark:` counterpart unless the
element is intentionally identical in both modes. Flag any missing `dark:`
variants on text, background, or border utilities that carry semantic meaning.

### 4. Non-stone accent colours
Clarity uses a stone-only palette. Flag any bright or saturated colour used
for text or backgrounds that isn't part of the stone scale, red (errors only),
amber (archive action only in ManageView), or the heatmap palette.

## Output

Write the results to `docs/audit-colour.md`. Overwrite if it already exists.

Structure the file as:

```
# Colour & Contrast Audit

Audited: [list of files read]
Reference: docs/calma-design-language.md
Date: [today]

---

## 1. Stone-400 violations

### 1a. Full violations — no dark pairing
| Component | Line | Current value | Expected | Severity |

### 1b. Light-mode violations — dark pairing present, base still fails
| Component | Line | Current value | Expected | Severity |

## 2. Colour-role hierarchy violations
| Component | Line | Element / role | Current colour | Expected colour | Severity |

## 3. Missing dark mode variants
| Component | Line | Current | Missing dark variant | Severity |

## 4. Non-stone accent colours
| Component | Line | Value | Notes | Severity |

## Summary
N critical · N high · N medium · N low
```

Severity key: **Critical** = WCAG AA failure · **High** = spec contradiction
· **Medium** = missing detail · **Low** = minor inconsistency
