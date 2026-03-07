# Playwright in audit-interaction — Design Rationale

**Date:** 2026-03-07
**Status:** Proposed — not yet implemented

---

## Decision

Add a live-check section to `/audit-interaction` backed by the Playwright MCP.
Do **not** add Playwright to any other audit skill.

## Why audit-interaction and not the others

| Skill | Playwright useful? | Reason |
|---|---|---|
| `audit-design-overall` | No | Coherence review is answered by reading components and the Calma spec; screenshots add friction without new signal |
| `audit-colour` | Maybe | Contrast ratios can be computed from Tailwind classes against the known palette; no real rendering needed |
| `audit-typography` | No | Font size, weight, and tracking are class-level facts |
| `audit-microcopy` | No | Pure text review |
| `audit-interaction` | **Yes** | Animation timing, rendered element dimensions, and runtime state cannot be verified from source |

## What Playwright would verify that static analysis cannot

### 1. Touch target sizes
`min-h-[44px]` can be overridden by flex shrink, conflicting `h-*` utilities, or parent constraints. Static analysis confirms the class is present; Playwright measures the actual computed `getBoundingClientRect().height` and flags anything below 44 px.

### 2. Exit animation snap (live confirmation)
The rule — elements with `exit={{ height: 0 }}` must also zero any `py-*`/`pb-*`/`mb-*` in `exit` — is subtle. Code reading can flag missing props, but triggering the collapse and taking a mid-animation screenshot confirms whether a visible snap actually occurs in the rendered output.

### 3. Scroll lock
Open DayDetail, then evaluate `document.body.style.overflow` and attempt a scroll. Verifies the `useLayoutEffect` guard works at runtime, not just that the hook is used in source.

### 4. Reduced motion suppression
Call `emulateMedia({ reducedMotion: "reduce" })`, trigger the DayDetail open and Joy section reveal, and verify both complete instantly. `MotionConfig reducedMotion="user"` is easy to break with a motion component placed outside `MotionProvider`.

## Proposed SKILL.md changes

### allowed-tools addition

```
mcp__plugin_playwright_playwright__browser_navigate
mcp__plugin_playwright_playwright__browser_evaluate
mcp__plugin_playwright_playwright__browser_take_screenshot
mcp__plugin_playwright_playwright__browser_snapshot
```

### New Section 6 (append to SKILL.md)

```markdown
### 6. Live checks (requires app running on localhost:3000)

Use Playwright only for what static analysis cannot verify.
If the app is not running, skip this section and note it in the report.

- **Touch targets** — navigate to Today and Settings. For every button,
  toggle, chip, and nav item, evaluate `getBoundingClientRect().height`.
  Flag any element below 44 px.

- **Scroll lock** — open a DayDetail sheet. Evaluate
  `document.body.style.overflow`. Attempt a scroll and verify
  `window.scrollY` does not change.

- **Exit snap** — trigger a collapse with an exit animation (FrequencyList,
  Joy section). Take a screenshot mid-animation. Flag any visible gap caused
  by unzeroed padding.

- **Reduced motion** — call `emulateMedia({ reducedMotion: "reduce" })`.
  Trigger the DayDetail open and Joy section reveal. Verify both complete
  instantly (no transition visible).
```

### New Section 6 in template.md

```markdown
## 6. Live checks (Playwright)

*Skip with note if app was not running.*

### Touch targets
| Element | Page | Rendered height | Pass/Fail |

### Scroll lock
[Pass or flag — body overflow value and scroll attempt result]

### Exit snap
[Pass or flag — screenshot reference if snap observed]

### Reduced motion
[Pass or flag — animation behaviour under prefers-reduced-motion: reduce]
```

## Constraint to resolve before implementing

`disable-model-invocation: true` means the skill runs inline without a sub-agent.
Playwright checks are stateful and sequential. This is compatible with inline
execution as long as the skill is not parallelised. If the skill is ever split
into a sub-agent, the flag must be removed and the Playwright allowed-tools
moved to the agent definition instead.
