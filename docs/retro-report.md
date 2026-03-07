# Retrospective Report

**Generated:** 2026-03-06
**Sprints analysed:** Sprint 1 – Sprint 7

---

## Recurring problems (address these)

### 1. Design constraints encoded reactively, not proactively — Sprints 1, 2, 3, 4, 5, 6

Every sprint from 1 through 6 contains a lesson that amounts to: "this rule should have been in CLAUDE.md from the start." The stone-400 foreground rule (Sprint 2), the `type="button"` rule (Sprint 3), the static export constraint (Sprint 4), the `font-medium` on section labels (Sprint 5 style guide, Sprint 6 Calma spec, Sprint 7 systematic fix). In each case the constraint was known but not written down, and the omission caused a recurring violation across multiple components over multiple sprints. The systematic audit cycle in Sprint 7 is the first time the codebase was scanned for accumulated drift rather than patched case-by-case.

**Suggested fix:** After any sprint that establishes a new pattern — even a small one — ask explicitly: "Is this encoded in CLAUDE.md?" before closing the sprint. The Calma sync step now formalises this for design patterns; the same discipline is needed for implementation patterns.

---

### 2. Bugs requiring a second pass — Sprints 2, 3, 4, 5, 6

- Sprint 2: `useEffect` scroll lock occasionally left behind — not caught until Sprint 5
- Sprint 3: `router.back()` broke when Settings opened from History — required second pass
- Sprint 4: Dynamic route static export failure discovered at build time, not dev
- Sprint 5: Exit animation snap caught post-release (v2.1.2 → v2.1.3); calendar direction bug required a second pass
- Sprint 6: Animation bugs in both v2.1.2 → v2.1.3

The pattern is consistent: bugs that require a specific interaction sequence (scroll lock during fast navigation, nav from two different entry points, exit animation on a collapsing element) or a build step (static export) are not caught by typing or linting. They need an explicit trigger.

**Suggested fix:** Sprint 7's approach — a named manual checklist in the QA Results section — is the right mechanism. The checklist should expand to cover the specific trigger sequences that have burned the project before: scroll lock (open DayDetail → navigate away mid-animation), exit animations (open and close every collapsible), and back-nav from both Today and History contexts.

---

### 3. Interaction-layer issues invisible to static analysis — Sprints 5, 6, 7

Animation snap, scroll jump, layout shift, and touch-target sizing are not caught by TypeScript, ESLint, or Jest. Sprint 6's animation bugs, Sprint 7's FrequencyList scroll issues — all required manual scrolling on a real page. The Playwright suite added in Sprint 7 helps with functional correctness but cannot validate perceived smoothness or scroll behaviour.

**Suggested fix:** Formalise a short "motion and scroll" manual pass as a named checklist item in every sprint that touches animation or layout. Sprint 7's QA manual checklist is a good model. The items should be specific: "scroll to bottom of history page, open FrequencyList, collapse it — observe scroll position."

---

### 4. Sprint scope calibration — Sprints 5 (too large), 7 (too small)

Sprint 5 ran two days and three releases — explicitly noted as "should have been split." Sprint 7 was the opposite: a conservative scope that left 3 HIGH severity interaction issues and 8 medium findings on the table that could have been absorbed. Both errors have the same root cause: scope was set without a clear severity-tier target. Sprint 7's audit had already classified everything by severity; the brief just didn't pull in everything at the same tier.

**Suggested fix:** For audit-driven sprints, aim to clear a full severity tier (all HIGH, or all critical+high) rather than a subset. This gives a natural stopping rule and prevents arbitrary scope cuts. Document the tier target in the brief.

---

### 5. No review intensity tiers — Sprint 7

The full planning pipeline (brief → UX → arch → parallel review → plan) was applied to Sprint 7, which was six targeted CSS class fixes with no UX decisions and no data model changes. The overhead was disproportionate. This was noted in the Sprint 7 retrospective but has not yet been acted on (the decision tree doesn't exist yet).

**Suggested fix:** Implement a three-tier decision tree before Sprint 8:
- **Tier 1 — Full pipeline:** new features, data model changes, new navigation, significant UX patterns
- **Tier 2 — Arch-only review:** bug fixes, accessibility corrections, tooling, animation polish
- **Tier 3 — No review:** docs-only, copy changes, chore commits

---

## Recurring wins (protect these)

### 1. Narrow scope + clear brief → fast, clean results

Noted in Sprint 1 and borne out in every subsequent sprint. When the brief is specific enough to code from, implementation is fast and accurate. Sprint 7's task-level implementation notes (exact line numbers, exact class changes, exact decision rationale) produced zero ambiguity during coding and fully faithful plan execution.

### 2. Zero regressions across all sprints

Explicitly noted in Sprints 5, 6, and 7 validation results. The combination of TypeScript strict mode, Jest unit tests, and careful task scoping has prevented any sprint from introducing new bugs into previously working features. This is a strong track record worth protecting — do not trade it for speed.

### 3. CLAUDE.md as a living contract

When rules are encoded in CLAUDE.md immediately after they're established, they prevent recurrence. The `type="button"` rule (Sprint 3), the static export constraint (Sprint 4), the stone-400 accessibility rule, and the Tailwind implementation tokens are all examples of constraints that, once written down, were never violated again in subsequent components. The challenge is writing them down promptly.

### 4. Data model correctness from Sprint 4 onwards

The v2.0 data model (done/joy as separate fields, UUID-keyed, sparse records, archived-safe) was established in Sprint 4 and has required no changes since. Sprint 5's Joy section, Sprint 7's BlossomIcon work, and the full audit cycle all slotted into it without friction. Getting the model right once saved multiple refactors.

### 5. GitHub Actions deployment — zero maintenance since Sprint 4

The workflow has never needed a fix across seven sprints and multiple major changes. The static export approach is stable. The `/deploy` skill now encapsulates the full release pipeline.

---

## Planning accuracy

**Sprints 1–6** had no formal planning pipeline. Scope was set informally, and several sprints had post-hoc regrets about what was in or out (Sprint 1: no History page; Sprint 5: too large).

**Sprint 7** was the first to use the full planning pipeline and produced the most accurate sprint doc to date. Task breakdowns were specific to the line number. UX and arch reviews both caught implementation decisions (BlossomIcon size, archived numeric unit colour) that would otherwise have been ambiguous mid-coding. The arch review caught an actual WCAG violation during implementation rather than at validation. Plan fidelity was recorded as "fully faithful."

One accuracy failure: a claim in the Sprint 7 implementation notes that two SettingsView labels were "already correct" proved false — the validation audit found they were not. This was a verification failure, not a planning failure, but it produced a deferred finding that should have been caught.

**Trend:** Improving sharply since the formal pipeline was introduced, but the pipeline has only one sprint of history. The scope calibration error (too conservative) is the main planning issue to address.

---

## Promised improvements not yet acted on

| Sprint | Improvement | Status |
|---|---|---|
| Sprint 2 | Encode design constraints in CLAUDE.md immediately when established | **Partially acted on** — CLAUDE.md improved over time, but the pattern of reactive encoding persisted through Sprint 6. Sprint 7's audit cycle is the first systematic catch. |
| Sprint 3 | Verify multi-entry-point flows before shipping nav changes | **Not explicitly acted on** — no named checklist item for this exists in the QA or deploy skills yet. |
| Sprint 4 | Run `npm run build` after any route change | **Acted on** — now in CLAUDE.md and enforced by the PostToolUse hook. |
| Sprint 5 | Keep a running notes file during multi-session sprints | **Not acted on** — no evidence in subsequent sprints. Low priority given Sprint 6 and 7 were single-session. |
| Sprint 6 | Manual animation review pass as part of release checklist | **Acted on** — now part of the `/deploy` skill and QA manual checklist. |
| Sprint 7 | Review intensity decision tree | **Not yet acted on** — new, first sprint to name it. |
| Sprint 7 | Verify "already correct" claims before writing sprint tasks | **Not yet acted on** — new. |
| Sprint 7 | Evaluate `.claude/agents/` to de-duplicate skill role definitions | **Not yet acted on** — under evaluation. |
| Sprint 7 | Playwright smoke run at start of manual testing | **Not yet acted on** — new. |

---

## Codebase health trend

**Improving significantly** after Sprint 7's audit-and-fix cycle.

| Audit | Pre-Sprint-7 | Post-Sprint-7 | Trend |
|---|---|---|---|
| Colour (WCAG) | 11 high · 7 medium · 3 low | 0 high · 4 medium · 4 low | Major improvement |
| Typography | 4 critical · 6 high · 6 medium · 5 low | 0 critical · 0 high · 6 medium · 4 low | Critical/high cleared |
| Interaction | 3 high · 9 medium · 5 low | 3 high · 7 medium · 5 low | Unchanged (deferred) |
| Microcopy | 4 high · 5 medium · 2 low | 4 high · 5 medium · 2 low | Unchanged (deferred) |

**Remaining debt by priority:**

- **Interaction (3 HIGH):** HabitToggle 28px touch target, NumberStepper 32px touch targets, Joy blossom `active:scale-90` — these are user-visible quality issues that affect core daily interactions. Should be Sprint 8 scope.
- **Typography (6 medium):** SettingsView Theme/Your data `font-medium` (missed from Sprint 7 scope), HabitToggle/NumberStepper `text-sm`, reflection textarea `text-sm font-light`, DayDetail date heading size — addressable in the same sprint as touch targets.
- **Microcopy (4 high):** Error messages in `transferData.ts` and `SettingsView.tsx` — warrants a dedicated copy sprint or standalone task.
- **Structural debt:** `ManageView.tsx` at 655 lines (watch threshold), `SECTION_LABEL` constant duplicated across 6 component files, ManageView joy-icon toggle still using Unicode hearts.

---

## Recommended actions

**1. Implement the review intensity decision tree before Sprint 8 brief** — define the three tiers (full pipeline / arch-only / no review) in a short reference in CLAUDE.md or a skill note. Apply Tier 2 to Sprint 8 if it stays an audit/polish sprint.

**2. Sprint 8: target the 3 HIGH interaction findings** — HabitToggle, NumberStepper, and joy blossom touch targets have been deferred twice. They are the highest-severity open findings and affect the most-used interactions in the app. Pair with the remaining typography mediums (SettingsView labels, reflection textarea, DayDetail date heading) to clear both tiers in one sprint.

**3. Add CLAUDE.md note on scroll-position management before collapse** — the `window.scrollTo({ top, behavior: "auto" })` pattern (synchronous, before state update) discovered in Sprint 7 is a non-obvious implementation requirement. It is not yet documented in CLAUDE.md. Add it alongside the existing DayDetail scroll lock note.

**4. Evaluate `.claude/agents/` for Sprint 9 or later** — the design document (`docs/claude-code-optimizer/agents-design.md`) is sound. The Priority 1 pair (`ux-designer` + `architect`) would give the highest ROI. Key discipline: agents must not duplicate content from CLAUDE.md or `calma-design-language.md`. Do not implement during a feature sprint — this is tooling work that deserves its own slot.

**5. Add multi-entry-point nav check to the QA manual checklist** — "open Settings from Today, use back nav; open Settings from History, use back nav; verify both return to the correct page." This is the class of bug that burned Sprint 3 and has no automated coverage.

**6. Scope audit-driven sprints by severity tier, not by chunk count** — when the audit triage has classified findings, the brief should state the target tier ("clear all HIGH interaction findings") rather than picking a subset by chunk number. This prevents the under-scoping failure of Sprint 7.

**7. Plan a dedicated microcopy sprint** — error messages in `transferData.ts` and `SettingsView.tsx` are 4 HIGH severity findings that have been deferred through two sprints. Copy changes don't need UX or arch review — this is a Tier 3 sprint (no review, no pipeline overhead). Short and completable in one session.
