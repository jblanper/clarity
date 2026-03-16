# Bug: Horizontal Line Flash on Navigation to Today / Edit

**Status:** Fixed
**Affected pages:** `/` (Today), `/edit?date=…`
**Trigger:** Client-side navigation from `/history` or `/settings`
**Condition:** Only reproducible when the user has at least one user-created habit (not in DEFAULT_CONFIGS) **and** at least one boolean habit already checked for today

---

## Symptom

A thin horizontal line (~3px tall, full viewport width) flashes for a fraction of a second when navigating to the Today or Edit page. The user describes it as appearing "below Journaling" (between the 4th and 5th habit rows in their setup).

---

## Root Cause Analysis

### Why the line appears

The Highlights / Joy `m.section` in `CheckInForm.tsx` uses a Framer Motion `height: 0 → "auto"` enter animation:

```tsx
<m.section
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  ...
  style={{ overflow: "hidden" }}
>
  <h2>Highlights</h2>
  <div className="rounded-2xl bg-stone-50 border border-stone-100 ...">
```

At `height: 3px` with `overflow: hidden`, only the very top edge of the inner `<div>` is visible. That inner div has `border: 1px solid stone-100` and `bg-stone-50` — creating a visible 1px amber-framed strip. This is the "line."

### Why it only happens with 5+ habits

`AnimatePresence initial={false}` suppresses enter animations only for children **present at AnimatePresence's first mount**. The Highlights section is absent on the first render (because `fields` initialises to `emptyFields`). It appears later, after `useEffect` loads the saved entry, so Framer Motion treats it as a new entry and fires the enter animation.

With the user's setup, DEFAULT_CONFIGS has 4 boolean habits + 4 numeric habits (Sleep, Water, Screen time, Coffee). The user has 5 boolean habits + only 2 numeric (Screen time and Coffee are archived). After the configs transition:

- By the Numbers section **shrinks** from 4 rows → 2 rows (~112px shorter)
- Habits section **grows** by 1 row (~44px taller)
- Net: the Moments section and everything below moves **up ~68px**

This pulls the Highlights section **into the visible viewport**. With the default configs (4 boolean + 4 numeric), the Highlights section is off-screen; with the user's actual configs it sits in the middle of the screen — explaining why the user sees the sliver "below Journaling" (it's visually near that area on their device).

---

## Attempts

### Attempt 1 — `useLayoutEffect` to load configs/entry before paint
**Session:** Previous session
**Idea:** Use `useLayoutEffect` instead of `useEffect` to load the entry synchronously before the browser paints, so `fields` is populated by first paint and the Highlights section is present at AnimatePresence's first mount.
**Result:** Did not fix the bug. `useLayoutEffect` fires before paint but after React commits. The section still mounted after AnimatePresence's first render, so the enter animation still fired. Also introduced `react-hooks/set-state-in-effect` lint errors.

### Attempt 2 — `initialized` gate state
**Session:** Previous session
**Idea:** Track `initialized` state; render the Highlights section only after `initialized = true` (which is set after data loads). The idea was to prevent AnimatePresence from seeing the section until after it had committed the loaded data.
**Result:** Playwright frame-by-frame confirmed no sliver (section jumped to 182px immediately). But the user reported the line was still visible on their real device, suggesting either a timing difference or a second cause not captured in headless Playwright.

### Attempt 3 — `useRef` + reading ref during render
**Session:** Current session
**Idea:** Set `highlightsSkipEnter = useRef(false)` to true in the entry-loading effect before `startTransition`, then read it as `initial={highlightsSkipEnter.current ? false : { height: 0, opacity: 0 }}` during render.
**Why reverted:** ESLint rule `react-hooks/refs` (from `eslint-config-next`) disallows reading `ref.current` during render — it causes unpredictable behaviour in concurrent React.

### Attempt 4 — `skipHighlightsEnter` state
**Session:** Previous session
**Idea:** Use state instead of a ref. Batch `setSkipHighlightsEnter(true)` and `setFields(formFields)` in the same `startTransition` so they commit together. When the Highlights section first mounts, `skipHighlightsEnter = true` → `initial={false}` → no sliver. A separate effect resets it to `false` after the section first appears, so user-triggered appearances still animate.
**Result:** Passes lint, tests, build. User reports still not fixed — the Highlights animation was only *one* source.

### Attempt 5 — `initial={false}` on Highlights + `transition-[background-color]` on HabitToggle (fix)
**Session:** Current session
**Root cause discovered:** The original analysis (Open Question #1) was correct — there was a **second cause** unrelated to the Highlights section. Tailwind v4's `divide-y` uses `border-bottom` on children. When configs load from localStorage, Journaling moves from being the **last child** (4 of 4 defaults, `borderBottom: 0px`, `borderBottomColor: currentColor` = dark) to a **middle child** (3 of 5, `borderBottom: 1px`, `borderBottomColor: stone-100` = light). HabitToggle's `transition-colors` class transitions `border-color` (included in Tailwind's `transition-colors` property list), animating the border from dark → light over 150ms. This dark 1px line below Journaling is the "sliver" the user saw.

**Fix (two parts):**
1. `CheckInForm.tsx`: Set `initial={false}` unconditionally on the Highlights `m.section` — removes the enter animation entirely, eliminating the first sliver source. Deleted all `skipHighlightsEnter` state logic.
2. `HabitToggle.tsx`: Replaced `transition-colors` with `transition-[background-color] duration-150` — only transitions background-color (for the amber wash), excluding `border-color` from transitioning. The divide-y border now applies instantly.

**Verification:** Playwright frame-by-frame capture confirmed Journaling's `borderBottomColor` jumps immediately to `stone-100` on the frame where configs change, with zero intermediate transition frames.

---

## Files

- `components/CheckInForm.tsx` — Joy / Highlights section, entry-loading `useEffect`
- `components/HabitToggle.tsx` — `transition-[background-color]` on the full-row `<button>`
