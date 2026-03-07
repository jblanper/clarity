# Interaction & Motion Audit

Calma principles reviewed against every interactive element and animation in the codebase.
Severity: **High** (breaks experience or accessibility) · **Medium** (noticeable deviation) · **Low** (polish/consistency)

---

## 1. Transition Completeness

All interactive elements must carry `transition-colors` (or equivalent) so state changes animate.

### Passing

| Element | File | Classes |
|---|---|---|
| HabitToggle switch | HabitToggle.tsx:34 | `transition-colors duration-200` |
| HabitToggle thumb | HabitToggle.tsx:41 | `transition-all duration-200` |
| MomentChip | MomentChip.tsx:15 | `transition-colors` |
| NumberStepper ± buttons | NumberStepper.tsx:73,96 | `transition-colors` |
| "New moment" / "Add" / "✕" buttons | CheckInForm.tsx:364,398,405 | `transition-colors` |
| Joy blossom button | CheckInForm.tsx:456 | `transition-transform` (see §4) |
| Save button | CheckInForm.tsx:491 | `transition-colors duration-500` |
| Back / Settings / History links | CheckInForm.tsx:263,271 | `transition-colors` |
| BottomNav tabs | BottomNav.tsx:31 | `transition-colors` |
| DayDetail close button | DayDetail.tsx:149 | `transition-colors` |
| DayDetail edit link | DayDetail.tsx:247 | `transition-colors` |
| CalendarHeatmap nav buttons | CalendarHeatmap.tsx:226,237,248,271 | `transition-colors` |
| Calendar day cells | CalendarHeatmap.tsx:337 | `transition-colors` |
| HistoryView Settings link | HistoryView.tsx:69 | `transition-colors` |
| Frequency toggle button | HistoryView.tsx:93 | `transition-colors` |
| Period selector buttons | HistoryView.tsx:113–124 | `transition-colors` |
| FrequencyList rows | FrequencyList.tsx:142 | `transition-colors` |
| SettingsView back/manage/theme/data buttons | SettingsView.tsx:112,125,143,154,181,213,237,264,279 | `transition-colors` |
| ManageView header link + action/archive/save/cancel buttons | ManageView.tsx:244,289,292,345,353 | `transition-colors` via constants |
| HelpView back link + design-language link | HelpView.tsx:23,105 | `transition-colors` |

### Failing

| Component | Line | Description | Severity |
|---|---|---|---|
| SettingsView | 229 | Remove-file "✕" button has `hover:text-stone-700` but no `transition-colors`. Color change is instant. | Low |
| ManageView | 254 | "Jump to Moments" anchor has `hover:underline` but no `transition-colors`. Not a colour change, and no transition class. | Low |
| ManageView | 413 | "Boolean" type-picker button has `hover:underline` but no `transition-colors`. | Low |
| ManageView | 419 | "Numeric" type-picker button has `hover:underline` but no `transition-colors`. | Low |
| BottomNav | 31 | Inactive tabs carry `transition-colors` but define no hover colour variant, so the transition fires over nothing on desktop. | Low |

---

## 2. Hover State Correctness

Hover should shift colour **one step** along the stone scale. No size, shadow, or transform changes (except the frequency chevron rotation and translate-based animations).

### Violations

| Component | Line | Description | Severity |
|---|---|---|---|
| CheckInForm — joy blossom button | 456 | `active:scale-90` applies a **scale transform** on press. Scale is explicitly outside Calma (translate-only transforms). Active state should use `opacity` or a colour shift, not a geometric transformation. | High |
| CheckInForm / SettingsView / HelpView nav links | 263, 271, 112, 125, 297, 23, 105 | Pattern `text-stone-600 hover:text-stone-800` skips stone-700, jumping **two steps** darker. CLAUDE.md specifies this as the intended nav-link hover, but it deviates from the one-step Calma rule. Recommend settling on stone-700 or explicitly codifying the two-step exception. | Medium |
| ManageView — "Cancel" reset button | 335 | `text-stone-400 hover:text-stone-600` — two steps in light mode. | Low |
| SettingsView "Manage" section label | 120 | `text-stone-400` used in light mode without dark: qualification. CLAUDE.md states stone-400 is **never permitted** in light mode outside a `dark:` variant. Not interactive, but sets a wrong colour precedent. | Medium |
| SettingsView "Help" section label | 292 | Same as above — `text-stone-400` in light mode. | Medium |
| SettingsView "Reset" section label | 308 | `text-stone-400` with no dark: variant at all. | Medium |

---

## 3. Touch Target Compliance

Minimum 44 × 44 px for every tappable element. Check for `min-h-[44px]` / `min-w-[44px]`.

### Passing

| Element | File | Enforced by |
|---|---|---|
| Joy blossom button | CheckInForm.tsx:456 | `min-h-[44px] min-w-[44px]` |
| DayDetail close button | DayDetail.tsx:149 | `min-h-[44px] min-w-[44px]` |
| CalendarHeatmap month nav buttons | CalendarHeatmap.tsx:248,271 | `min-h-[44px]` |
| Calendar day cells | CalendarHeatmap.tsx:337 | `h-11 w-11` (44 × 44 px) |
| Frequency toggle button | HistoryView.tsx:93 | `min-h-[44px]` |
| FrequencyList rows | FrequencyList.tsx:142 | `min-h-[44px]` |
| Full-width form buttons | SettingsView.tsx:181,213,237,264,279 | `py-4 w-full` |

### Failing

| Component | Line | Element | Actual size | Severity |
|---|---|---|---|---|
| HabitToggle | 34 | Toggle switch button | `h-7 w-12` = **28 × 48 px** — height is 16 px short | High |
| NumberStepper | 73, 96 | Decrement / Increment buttons | `h-8 w-8` = **32 × 32 px** — both dimensions short | High |
| MomentChip | 11 | Chip button | `py-2` = **~32 px** tall | Medium |
| CheckInForm | 361 | "New moment" dashed button | `py-2` = **~32 px** tall | Medium |
| CheckInForm | 395 | Inline "Add" button (add-moment flow) | `py-2` = **~32 px** tall | Medium |
| CheckInForm | 403 | Inline dismiss "✕" button | No height constraint — approx. **20–24 px** | Medium |
| CalendarHeatmap | 223, 234 | Year prev / next buttons | No `min-h`; icon ≈ **20 px** tall | Medium |
| SettingsView | 110 | Back button | `text-xs` only, no min-h | Medium |
| SettingsView | 142, 153 | Light / Dark theme buttons | `text-sm` only, no min-h | Medium |
| SettingsView | 226 | Remove-file "✕" button | No min-h | Medium |
| SettingsView | 125 | "Habits and moments" manage link | `py-2` only | Medium |
| SettingsView | 297 | "How Clarity works" help link | `py-2` only | Medium |
| SettingsView | 313 | "Reset to factory defaults" button | `text-sm` only | Medium |
| SettingsView | 327, 335 | Confirm / Cancel reset buttons | `text-sm` only | Medium |
| ManageView | 244 | Header "Settings" back link | `text-xs` only | Medium |
| ManageView | 254 | "Jump to Moments" anchor | `text-xs` only | Medium |
| ManageView | 278 | Joy-by-default toggle button | No min-h | Medium |
| ManageView | 289, 292 | "Edit" / "Archive" action buttons | `text-xs` only | Medium |
| ManageView | 345, 353 | Inline form Save / Cancel buttons | `py-2` for Save, bare text for Cancel | Medium |
| ManageView | 388 | "+ Add habit" text button | `text-sm` only | Medium |
| ManageView | 413, 419 | "Boolean" / "Numeric" type picker buttons | `text-sm` only | Medium |
| ManageView | 597 | "+ Add moment" text button | `text-sm` only | Medium |
| HelpView | 21 | "Settings" back link | `mt-2 text-xs` only | Medium |
| HelpView | 102 | "Design language" external link | `text-xs` only | Medium |

---

## 4. Animation Audit

### CSS transitions (globals.css + Tailwind utilities)

| Element | File | Property | Duration | Reduced-motion guard | Within 120–320 ms | Allowed property | Severity |
|---|---|---|---|---|---|---|---|
| `.frequency-chevron` | globals.css:43 | `transform` (rotation) | 200 ms | ✓ `@media` in globals.css | ✓ | ✓ rotation OK (chevron-only exception) | Pass |
| `.heatmap-grid / .frequency-list` opacity pulse | globals.css:48 | `opacity` | 120 ms | ✓ `@media` in globals.css | ✓ | ✓ | Pass |
| DayDetail backdrop | DayDetail.tsx:131 | `opacity` via `transition-opacity` | 300 ms | ✗ **No CSS `@media` guard** (Motion lib guard does not cover plain-div CSS transitions) | ✓ | ✓ | Medium |
| DayDetail bottom sheet | DayDetail.tsx:141 | `transform` (translateY) via `transition-transform` | 300 ms | ✗ **No CSS `@media` guard** | ✓ | ✓ translate ✓ | Medium |
| HabitToggle thumb | HabitToggle.tsx:41 | positional `left` via `transition-all` | 200 ms | ✗ No guard; also `transition-all` is overly broad | ✓ | ✓ | Low |

**Note on DayDetail:** `MotionConfig reducedMotion="user"` in `MotionProvider` suppresses Motion library animations, but `DayDetail` uses plain CSS transitions (`transition-opacity`, `transition-transform`) on `<div>` elements — these are **not** governed by `MotionConfig` and will still run when the user has requested reduced motion.

### Motion (JS) animations

| Element | File | Lines | Properties | Duration | Reduced-motion | Severity |
|---|---|---|---|---|---|---|
| Add-moment reveal | CheckInForm.tsx | 373–376 | height + opacity | 220 ms ease-out | ✓ via MotionProvider | Pass |
| Joy section reveal/exit | CheckInForm.tsx | 424–430 | height + opacity | 280 ms ease-out | ✓ | Pass |
| Joy row enter/exit | CheckInForm.tsx | 441–446 | opacity | 160 ms | ✓ | Pass |
| Month heading crossfade | CalendarHeatmap.tsx | 255–264 | opacity | **110 ms** | ✓ | **Medium** (below 120 ms floor) |
| Calendar grid slide | CalendarHeatmap.tsx | 283–291 | x-translate + opacity | 220 ms ease-out | ✓ | Pass |
| Frequency section reveal | HistoryView.tsx | 101–106 | height + opacity | 280 ms ease-out | ✓ | Pass |
| FrequencyList hint exit | FrequencyList.tsx | 118–121 | opacity + height | 300 ms | ✓ | Pass |
| FrequencyList bar grow | FrequencyList.tsx | 155–163 | **width** `0% → barWidth` | 250 ms ease-out | ✓ | **Medium** — `width` is not an allowed property (only opacity, translate, height/max-height) |
| ManageView inline form reveals | ManageView.tsx | 301–307, 401–408, 434–441, 608–615 | height + opacity | 220 ms ease-out | ✓ | Pass |
| Joy blossom button (CSS) | CheckInForm.tsx | 456 | `active:scale-90` (CSS class) | immediate | ✗ No guard | **High** — scale transform is explicitly excluded from Calma |

### Summary of animation violations

| Component | Line | Issue | Severity |
|---|---|---|---|
| CheckInForm — joy blossom | 456 | `active:scale-90` — scale transform, forbidden by Calma | High |
| DayDetail — backdrop | 131 | `transition-opacity` on plain `<div>` has no `prefers-reduced-motion` guard | Medium |
| DayDetail — sheet | 141 | `transition-transform` on plain `<div>` has no `prefers-reduced-motion` guard | Medium |
| CalendarHeatmap — month crossfade | 257 | `duration: 0.11` (110 ms) is below the 120 ms floor | Medium |
| FrequencyList — bar | 163 | Animates `width` — only opacity, translate, and height are permitted | Medium |
| HabitToggle — thumb | 41 | `transition-all` is overly broad; only the `left` offset changes | Low |

---

## 5. Disabled State Audit

Disabled elements must be dimmed at 30–40 % opacity. They must never be hidden with `hidden`, `display: none`, or `visibility: hidden`.

### Passing

| Element | File | Mechanism |
|---|---|---|
| NumberStepper ± buttons when at min/max | NumberStepper.tsx:73,96 | `disabled:opacity-30` (30 %) ✓ |
| CalendarHeatmap year/month nav at boundary | CalendarHeatmap.tsx:226,237,271 | `disabled:opacity-30` ✓ |
| ManageView Save buttons when label empty | ManageView.tsx:345,500 | `disabled:opacity-40` ✓ |

### Failing

| Component | Line | Element | Issue | Severity |
|---|---|---|---|---|
| CalendarHeatmap | 341 | Future day cells | `opacity-25` (25 %) — one point below the 30 % floor | Low |
| CalendarHeatmap | 347 | Filter-dimmed cells | Inline `opacity: 0.25` (25 %) — same issue | Low |
| FrequencyList | 148 | Inactive-filter chevron indicator | `invisible` (Tailwind = `visibility: hidden`) used on the visual-state indicator. The element is not a control, but `visibility: hidden` is applied — this occupies space but is invisible with no opacity-based approach. | Low |

---

## Prioritised Fix List

### High (fix immediately)
1. **CheckInForm joy blossom button — `active:scale-90`** (`CheckInForm.tsx:456`): Replace with `active:opacity-70` or a colour shift. Scale is forbidden.
2. **HabitToggle touch target — `h-7`** (`HabitToggle.tsx:34`): The toggle button is 28 px tall. Wrap in a transparent hit-area or switch to `min-h-[44px]` padding strategy.
3. **NumberStepper ± buttons — `h-8 w-8`** (`NumberStepper.tsx:73,96`): Buttons are 32 × 32 px. Need `min-h-[44px] min-w-[44px]` with padding/flex centring to keep the visual circle smaller.

### Medium (fix before next release)
4. **DayDetail CSS transitions — no reduced-motion guard** (`DayDetail.tsx:131,141`): Add a `prefers-reduced-motion` CSS media query to globals.css for `.day-detail-backdrop` and `.day-detail-sheet`, or migrate to Motion `m.*` components so `MotionConfig` governs them.
5. **MomentChip touch target** (`MomentChip.tsx:11`): Add `min-h-[44px]` and adjust padding so the visual pill stays compact.
6. **CalendarHeatmap year-nav buttons** (`CalendarHeatmap.tsx:223,234`): Add `min-h-[44px]` (matching the month-nav buttons on lines 248/271).
7. **FrequencyList bar animation uses `width`** (`FrequencyList.tsx:163`): Swap to `scaleX` transform with `transform-origin: left` to stay within allowed properties.
8. **Month heading crossfade — 110 ms** (`CalendarHeatmap.tsx:257`): Raise `duration` to `0.12` to meet the 120 ms floor.
9. **SettingsView section labels `text-stone-400` in light mode** (`SettingsView.tsx:120,292,308`): Replace with `text-stone-500` per the CLAUDE.md colour-role hierarchy.
10. **Two-step hover jumps on nav links** (multiple files): Either codify `stone-600 → stone-800` as an explicit Calma nav-link exception in the design language doc, or regularise to `stone-700`.
11. **Missing `transition-colors`** (`SettingsView.tsx:229`, `ManageView.tsx:254,413,419`): Add `transition-colors` to each.

### Low (polish pass)
12. **CalendarHeatmap opacity-25 for future/dimmed cells**: Raise to `opacity-30` to stay within the 30–40 % disabled range.
13. **FrequencyList inactive chevron**: Replace `invisible` with `opacity-0` to keep the same layout-stable approach but use opacity instead of `visibility: hidden`.
14. **HabitToggle thumb `transition-all`**: Narrow to `transition-[left]` to avoid animating unintended properties.
15. **BottomNav inactive tabs**: Add `hover:text-stone-700 dark:hover:text-stone-300` so `transition-colors` has something to animate on desktop.
16. All **Medium-severity touch targets** in Settings/Manage/Help where bare `text-xs` / `text-sm` labels are the entire hit area.
