# Colour & Contrast Audit

Audited: all files in `components/`, `app/`, `app/globals.css`.
Reference: `docs/calma-design-language.md`.
Generated: 2026-03-17 10:42

Archive note: Pre-sprint snapshot preserved as `docs/audits/archive/audit-colour-2026-03-17.md`. Sprint 13 baseline: 0 critical · 0 high · 0 medium · 1 low.

Sprint 14 context: CalendarHeatmap refactored to typographic date-as-weight calendar (font weight + amber). FrequencyList bar refinement. SegmentedPill period selector in HistoryView. Conditional year row.

---

## 1. Stone-400 violations

Stone-400 (`#a8a29e`) fails WCAG AA on the light background (≈2.4:1, minimum 4.5:1). It is only permitted as a `dark:` variant, or explicitly as a placeholder/border colour.

### 1a. Full violations — no dark pairing

**None found.** ✅

### 1b. Light-mode violations — dark pairing present, base still fails

| Component | Line | Current value | Context | Severity |
|---|---|---|---|---|
| `ManageView.tsx` | 628 | `bg-stone-100 text-stone-400 dark:text-stone-600` | Moment chip in editing state (selected/disabled appearance) | **Critical** |

`text-stone-400` (#a8a29e) on `bg-stone-100` (#f5f5f4): contrast ≈ 2.9:1 — fails WCAG AA (4.5:1 required). Per CLAUDE.md: on elevated backgrounds (`bg-stone-100`), `text-stone-500` also fails — use `text-stone-600` minimum.

**Fix:** `text-stone-400` → `text-stone-600` at line 628.

### Permitted stone-400 uses

| Component | Line | Value | Reason |
|---|---|---|---|
| `ManageView.tsx` | 436 | `text-stone-400 dark:text-stone-600` | `···` tap affordance — decorative non-text element, exempt from 4.5:1 text contrast ✅ |
| Various constants | — | `placeholder:text-stone-400` | Placeholder text — input placeholders exempt ✅ |
| All constants | — | `dark:text-stone-400` | Dark-mode only variant ✅ |

---

## 2. Colour-role hierarchy violations

| Component | Line | Current value | Role | Expected | Severity |
|---|---|---|---|---|---|
| `ManageView.tsx` | 628 | `text-stone-400` on `bg-stone-100` | Dimmed chip state | `text-stone-600` | **Critical** (same as §1b) |

All other colour-role assignments are correct: page titles `text-stone-800 dark:text-stone-200` ✅, body labels `text-stone-700` ✅, section labels `text-stone-500` ✅, nav links `text-stone-600` ✅, errors `text-red-700 dark:text-red-400` ✅.

---

## 3. Sprint 14 new colours — dark mode completeness

All new Sprint 14 colour tokens have correct dark variants:

| Token | Usage | Dark variant | Status |
|---|---|---|---|
| `text-amber-600` | Calendar amber (joy/moments) | `dark:text-amber-400` | ✅ |
| `text-stone-300` | Calendar ghost day | `dark:text-stone-700` | ✅ |
| `text-stone-700` | Calendar active day | `dark:text-stone-300` | ✅ |
| `bg-stone-100` | Selected day circle | `dark:bg-stone-800` | ✅ |
| Legend sample glyphs | font-light/bold on stone/amber | All have dark variants | ✅ |

---

## 4. Sprint 14 refactor validation

**CalendarHeatmap (typographic date-as-weight):**
- Ghost days: `text-stone-300 dark:text-stone-700` — stone-300 on white ≈ 2.1:1 intentional (ghost/faded state for days with no data). ✅ by design
- Active days: `text-stone-700 dark:text-stone-300` — stone-700 on white ≈ 8.9:1 ✅
- Amber days: `text-amber-600 dark:text-amber-400` — amber-600 on white ≈ 3.3:1 — **note:** amber-600 is below 4.5:1 threshold on white. However, this is used exclusively for date numbers in the calendar grid (large, decorative data channel), consistent with the prior heatmap palette treatment. Carried forward as an accepted design decision (same as previous sprint baseline).
- Selected day circle: `bg-stone-100 dark:bg-stone-800` behind date number — non-text background ✅
- Future days: `opacity-30` on top of ghost weight — purely decorative ✅
- Two-axis HSL blend fully removed ✅

**FrequencyList bar colours:** unchanged from Sprint 13 — `bg-stone-300 dark:bg-stone-600` / `bg-amber-400 dark:bg-amber-500` ✅

**SegmentedPill period selector (HistoryView):** inactive `text-stone-600 dark:text-stone-400` on `bg-stone-100` ≈ 5.9:1 ✅ (carries the Sprint 13 fix forward correctly)

---

## 5. Non-stone accent colours

No violations found. Amber confined to joy/moments, archive actions, and reset buttons per spec. Red used only for destructive actions and error messages. ✅

---

## Carry-forward from Sprint 13

| ID | Component | Line | Issue | Severity |
|---|---|---|---|---|
| L1 | `CalendarHeatmap.tsx` | day-of-week row | `text-stone-500 dark:text-stone-600` — dark variant uses `stone-600` instead of expected `stone-500` | **Low** (pre-existing) |

---

## Summary

**1 critical · 0 high · 0 medium · 1 low**

Severity key: **Critical** = WCAG AA failure · **High** = spec contradiction · **Medium** = missing detail · **Low** = minor inconsistency

| Severity | Count | Location |
|---|---|---|
| Critical | 1 | ManageView.tsx:628 — moment chip edit state `text-stone-400` on `bg-stone-100` (≈2.9:1) — **regression, must fix before deploy** |
| High | 0 | — |
| Medium | 0 | — |
| Low | 1 | CalendarHeatmap day-of-week dark variant (pre-existing) |

**Sprint 14 regression:** ManageView moment chip editing state uses `text-stone-400` on `bg-stone-100`. This violates WCAG AA. Fix: `text-stone-400` → `text-stone-600` at ManageView.tsx:628.
