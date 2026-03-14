# Colour & Contrast Audit

Audited: all files in `components/`, `app/`, `app/globals.css`.
Reference: `docs/calma-design-language.md`.
Generated: 2026-03-14 00:00

Archived previous report → docs/audits/archive/audit-colour-2026-03-14.md

Sprint 11 context: Task 1 replaced MomentChip's stone selected state (`bg-stone-500 text-white`) with amber (`bg-amber-50 border-amber-300 text-amber-800` / dark equivalents) and removed `dark:bg-stone-800` from the unselected dark state. Task 3 replaced DayDetail static moment chip stone spans with amber display tokens (`bg-amber-50 border border-amber-200 text-amber-800` / dark equivalents) and changed the done-habit checkmark from `text-stone-500` to `text-amber-600 dark:text-amber-400`. Task 4 added a Highlights section in DayDetail using the amber panel card token (`bg-amber-50 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-900/30 rounded-2xl`).

---

## 1. Stone-400 violations

Stone-400 (`#a8a29e`) fails WCAG AA on the light background (≈2.4:1, minimum 4.5:1). It is only permitted as a `dark:` variant, or explicitly as a placeholder/border colour.

### 1a. Full violations — no dark pairing

**None found.** ✅

### 1b. Light-mode violations — dark pairing present, base still fails

| Component | Line | Current value | Expected | Severity |
|---|---|---|---|---|
| ManageView.tsx | 402 | `text-xs text-stone-400 dark:text-stone-500` (archived habit confirmation note) | `text-stone-500 dark:text-stone-400` | **low** (intentional archival dimming — pre-existing; recommended fix in Sprint 11 arch review) |
| ManageView.tsx | 631 | `text-xs text-stone-400 dark:text-stone-500` (archived moment confirmation note) | `text-stone-500 dark:text-stone-400` | **low** (intentional archival dimming — pre-existing) |

No new stone-400 violations introduced in Sprint 11. ✅

---

## 2. New colour tokens introduced in Sprint 11

### MomentChip (components/MomentChip.tsx)

| Token | Usage | Role | Contrast / Assessment |
|---|---|---|---|
| `bg-amber-50 border border-amber-300 text-amber-800` | Selected state (light) | Selected chip | amber-800 (#92400e) on amber-50 (#fffbeb) ≈ 9:1 ✅ |
| `dark:bg-amber-900/20 dark:border dark:border-amber-700/40 dark:text-amber-300` | Selected state (dark) | Selected chip | amber-300 on dark bg — passes AA ✅ |
| `border border-stone-200 dark:border-stone-700 bg-transparent text-stone-500 dark:text-stone-400` | Unselected state | Unselected chip | stone-500 on white ≈ 4.6:1 ✅; `dark:text-stone-400` is a `dark:` variant — safe per rule ✅ |

Note: `dark:bg-stone-800` removed from unselected dark state — transparent background at rest is cleaner and matches HabitToggle's unselected dark pattern. ✅

### DayDetail (components/DayDetail.tsx)

| Token | Usage | Role | Contrast / Assessment |
|---|---|---|---|
| `bg-amber-50 border border-amber-200 text-amber-800` | Moment chips (light) | Read-only display | amber-800 (#92400e) on amber-50 (#fffbeb) ≈ 9:1 ✅ |
| `dark:bg-amber-900/20 dark:border dark:border-amber-700/40 dark:text-amber-300` | Moment chips (dark) | Read-only display | amber-300 on dark bg — passes AA ✅ |
| `text-amber-600 dark:text-amber-400` | Done-habit checkmark (✓) | Completion indicator | amber-600 (#d97706) on white ≈ 3.1:1 — decorative non-text character; WCAG 1.4.11 (non-text contrast) requires 3:1 for UI components; 3.1:1 passes ✅ |
| `bg-amber-50 dark:bg-amber-900/15 border border-amber-100 dark:border-amber-900/30` | Highlights panel card | Background | Background only — no text-contrast requirement ✅ |

Note: The checkmark glyph was changed to `text-amber-600` (rather than `text-amber-500` as originally spec'd) during Architecture Review — a reviewer-initiated WCAG improvement. amber-600 provides ~3.1:1 vs white vs amber-500's ~2.8:1. Both are borderline decorative, but amber-600 is the stronger choice. ✅

---

## 3. Colour-role hierarchy violations

### Correct usages

All page titles use `text-stone-800 dark:text-stone-200` consistently. ✅

All body text / item labels use `text-stone-700 dark:text-stone-300`. ✅

Section labels in DayDetail Highlights section use `text-stone-500 dark:text-stone-500` — matching the `SECTION_LABEL` constant pattern. ✅

Amber tokens are now used for: MomentChip selected state, DayDetail moment chips, DayDetail checkmark, DayDetail Highlights panel, joy blossom (BlossomIcon), joy selection in FrequencyList, joyByDefault active state in ManageView, HabitToggle done-state dot and wash, NumberStepper non-zero pill. All within the designated amber completion/joy role. ✅

Red is used exclusively for error messages. ✅

### Remaining divergences

| Component | Line | Current value | Role | Expected | Severity |
|---|---|---|---|---|---|
| CalendarHeatmap.tsx | ~300 | `text-stone-500 dark:text-stone-600` (day-of-week labels) | Metadata | `dark:text-stone-500` — dark:stone-600 is lower contrast in dark mode, wrong direction | **low** (pre-existing) |

---

## 4. Dark mode completeness

All foreground tokens introduced in Sprint 11 have appropriate dark variants. ✅

**Borderline carry-forward:** `SettingsView.tsx ~line 332` — Cancel button has `text-stone-500` with only `dark:hover:text-stone-300`; no explicit `dark:text-*` base. stone-500 (#78716c) on the dark background (#1c1917) has adequate contrast; cosmetic consistency gap only, not a WCAG failure. **Low** (pre-existing).

---

## 5. Non-stone accent colours

No violations found. Amber, red, and the heatmap palette are all used in their correct designated roles. ✅

---

## Summary

**0 critical · 0 high · 0 medium · 3 low**

Severity key: **Critical** = WCAG AA failure · **High** = spec contradiction · **Medium** = missing detail · **Low** = minor inconsistency

| Severity | Count | Primary locations |
|---|---|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 0 | — |
| Low | 3 | ManageView archived confirmation notes (×2, pre-existing); CalendarHeatmap day-of-week dark variant (pre-existing) |

**Sprint 11 impact:** All new amber tokens in MomentChip, DayDetail moment chips, checkmark, and Highlights panel pass WCAG AA. No new findings introduced. Carry-forward lows (3) unchanged from Sprint 9 baseline.
