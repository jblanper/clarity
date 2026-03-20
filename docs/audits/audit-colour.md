# Colour & Contrast Audit

Audited: all files in `components/`, `app/`, `app/globals.css`.
Reference: `docs/calma-design-language.md`.
Generated: 2026-03-20 12:41

Archive note: Archived previous report → docs/audits/archive/audit-colour-2026-03-20.md. Sprint 14 baseline: 1 critical · 0 high · 0 medium · 1 low.

Sprint 15 context: All colour audit debt items closed. ManageView moment chip editing state WCAG fix applied (`text-stone-400` → `text-stone-600`). CalendarHeatmap day-of-week dark variant corrected (`dark:text-stone-600` → `dark:text-stone-500`). CalendarHeatmap filtered cells raised from `opacity-25` to `opacity-30`. No new colour tokens introduced.

---

## 1. Stone-400 violations

Stone-400 (`#a8a29e`) fails WCAG AA on the light background (≈2.4:1, minimum 4.5:1). It is only permitted as a `dark:` variant, or explicitly as a placeholder/border colour.

### 1a. Full violations — no dark pairing

**None found.** ✅

### 1b. Light-mode violations — dark pairing present, base still fails

**None found.** ✅

The Sprint 14 regression (`ManageView.tsx` line 628 `text-stone-400` on `bg-stone-100`) has been fixed. Current code reads `text-stone-600 dark:text-stone-600`. Contrast on `bg-stone-100` is now ~5.6:1 — passes WCAG AA. ✅

### Permitted stone-400 uses

| Component | Line | Value | Reason |
|---|---|---|---|
| `ManageView.tsx` | 437 | `text-stone-500 dark:text-stone-500` | `···` tap affordance — decorative non-text element, exempt from 4.5:1 text contrast ✅ |
| Various | — | `placeholder:text-stone-400` | Placeholder text — input placeholders exempt from foreground contrast rule ✅ |
| All constants | — | `dark:text-stone-400` | Dark-mode only variant ✅ |

Note: The tap affordance dots (`···`) at ManageView line 437 are classified as decorative non-text elements per the Calma spec ("Tap affordance indicator") and are not subject to the 4.5:1 text contrast rule.

---

## 2. Colour-role hierarchy violations

**None found.** ✅

All colour-role assignments correct across all components:
- Page titles: `text-stone-800 dark:text-stone-200` ✅
- Body labels: `text-stone-700 dark:text-stone-300` ✅
- Section labels: `text-stone-500 dark:text-stone-500` ✅
- Nav links: `text-stone-600 dark:text-stone-500`, hover `stone-800 dark:stone-300` ✅
- Errors: `text-red-700 dark:text-red-400` ✅
- ManageView moment chip editing state: `text-stone-600 dark:text-stone-600` on `bg-stone-100 dark:bg-stone-800` ✅ (fixed Sprint 15)

---

## 3. Dark mode completeness

All foreground colour tokens have correct `dark:` counterparts. Sprint 15 changes verified:

| Token | Light | Dark | Status |
|---|---|---|---|
| CalendarHeatmap day-of-week labels | `text-stone-500` | `dark:text-stone-500` | ✅ (corrected from `dark:text-stone-600`) |
| ManageView chip editing state | `text-stone-600` | `dark:text-stone-600` | ✅ (fixed from `text-stone-400`) |
| BottomNav inactive tab hover | `hover:text-stone-700` | `dark:hover:text-stone-200` | ✅ |
| NumberStepper pill value (zero state) | `text-stone-600` | `dark:text-stone-400` | ✅ |
| NumberStepper pill value (active state) | `text-amber-800` | `dark:text-amber-300` | ✅ |

No missing dark variants found. ✅

---

## 4. Non-stone accent colours

No violations. Amber confined to joy/moments, archive actions, and reset buttons per spec. Red used only for destructive actions and error messages. ✅

---

## Summary

**0 critical · 0 high · 0 medium · 0 low**

Severity key: **Critical** = WCAG AA failure · **High** = spec contradiction · **Medium** = missing detail · **Low** = minor inconsistency

Sprint 15 closed all remaining colour findings:
- Critical closed: ManageView chip editing `text-stone-400` → `text-stone-600` on `bg-stone-100` ✅
- Low closed: CalendarHeatmap day-of-week `dark:text-stone-600` → `dark:text-stone-500` ✅

Zero open colour findings entering Sprint 16.
