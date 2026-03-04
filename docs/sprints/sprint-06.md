# Sprint 6 — Motion Library & Calma Design Language

**Dates:** 2026-03-01 – 2026-03-03
**Releases:** v2.1.2, v2.1.3, v2.1.4

---

## What was built

### History page animations (v2.1.2)
- **Calendar slide** — month navigation slides left/right with a crossfade heading; implemented with CSS transitions before the Motion library was adopted
- **Frequency section** — expands and collapses smoothly using a `grid-template-rows` transition (no max-height dead zone); frequency chevron rotates on open/close
- **Period change feedback** — heatmap and frequency list briefly dim when switching time periods; frequency bars grow from zero on change
- **Chevron component extended** — all four directions via a single SVG with CSS rotation; optional `size` prop
- **Favicon** — replaced default Next.js favicon with a minimal amber dot SVG
- **CLAUDE.md and README** — updated to reflect frequency list, calendar filter, inline moment creation, and localStorage key count

### Motion library adoption (v2.1.3)
- **`motion/react` adopted** — replaced all custom CSS/`setTimeout` animation orchestration with `LazyMotion + domAnimation` (~17 KB); all height reveals, directional slides, and exit animations use `AnimatePresence` and `m.*`
- **`MotionProvider`** — new component wrapping `LazyMotion`, `domAnimation`, and `MotionConfig reducedMotion="user"`; centralises reduced-motion support
- **Exit animation snap fix** — resolved a visual snap at the end of close animations in ManageView and CheckInForm; root cause: `box-sizing: border-box` does not collapse `py-*` padding when `height: 0`; padding and margin now animate to zero in sync with height
- **Calendar direction fix** — fixed a stale-closure bug where reversing navigation direction (← then →) caused the exit animation to slide the wrong way; resolved by using named `variants` with the `custom` prop on `AnimatePresence` so the current direction is forwarded to the exiting element at animation time

### Design language documentation (v2.1.4)
- **Calma design language** — full HTML specification (`docs/calma-design-language.md` and `docs/project-vision.html`) covering palette, typography, spacing, interaction principles, microcopy, and the emotional identity of the app
- **CLAUDE.md** — updated to reference Calma as the source of truth for all design decisions

---

## Retrospective

### What went well
- The Motion library adoption was clean — replacing ad-hoc CSS/setTimeout orchestration with a declarative API simplified the code and made animations easier to reason about
- The exit animation snap bug, once understood (border-box + padding), had a clear and general fix that could be applied consistently
- Formalising the design language into a named system (Calma) was valuable — it gave the design rules a home and a name that could be referenced in code reviews, CLAUDE.md, and audits

### What could have been better
- The stale-closure bug in calendar direction was a subtle React/animation interaction that required a second pass to fully resolve; the `variants + custom` pattern should have been the first approach for any directional animation
- The exit animation snap and the calendar direction bug were both caught after release (v2.1.2) and fixed in v2.1.3; more thorough animation testing before release would have caught them
- The Calma design language document was written to describe the app as it exists, but the `font-medium` gap in the section label pattern was not caught during its authoring — it remained uncorrected in CLAUDE.md and the codebase until a systematic audit

### Lessons
Animation bugs are hard to catch with standard linting or type-checking. A manual animation review pass (open the app, trigger every animated transition, check enter and exit) should be part of the release checklist for any sprint that touches motion. This is now part of the `/deploy` skill.
