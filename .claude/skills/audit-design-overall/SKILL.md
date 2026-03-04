# Audit — Overall Design Coherence

Review Clarity as a whole product. Ask whether it feels like a single
considered thing — closer to a handwritten notebook than a productivity
dashboard. This is not a spec-check; it is a coherence review.

## Before starting

Read `CLAUDE.md` and `docs/calma-design-language.md` in full.
Then read the four specific audit reports if they exist:
`docs/audit-colour.md`, `docs/audit-typography.md`,
`docs/audit-interaction.md`, `docs/audit-microcopy.md`.
Use these to understand known violations so you can assess their
design-level impact, not to repeat their findings.

## Scope

Read every file in `components/` and `app/`. Consider the full user journey
for each page: first-time use, everyday use, and edge cases
(empty state, error state, archiving).

## What to review

### 1. Page-by-page design review

For each page (Today, History, Settings, Manage, Help, Edit):
- Does it feel coherent with the rest of the app?
- Does the visual hierarchy guide the user without instruction?
- Are there moments where the page contradicts the Calma identity?
- Note what is working as well as what isn't — the audit should be honest
  in both directions

### 2. Cross-page consistency

- Do pages share the same header pattern (title left, nav link top-right)?
- Is the spacing register consistent across pages?
- Do empty states across all pages share the same inviting tone?
- Are section labels visually identical across pages?

### 3. Emotional identity

Clarity's emotional identity: calm, human, factual logging without
gamification or pressure. Flag any moment that contradicts this:
- Elements that feel like productivity tool UI
- Interactions that reward or punish
- Visual density that creates anxiety rather than calm

### 4. Information architecture

- Is the nav architecture (BottomNav / text back-links) clear and consistent?
- Can a first-time user navigate the full app without confusion?
- Are there dead ends or unexpected back-navigation behaviours?

### 5. The one most important observation

Close Section 5 (or add a Section 7 if the structure warrants it) with a
clearly labelled paragraph:

**Most important observation:** [One finding that, if fixed, would do the
most to improve the felt quality of the app. Be specific — name the
component, the pattern, and what the fix would be.]

This finding will be used by the triage skill to prioritise the implementation
plan, so it must be concrete and actionable.

## Output

Write the results to `docs/audit-design-overall.md`. Overwrite if it already exists.

Structure the file as:

```
# Design Audit — Overall Coherence
## Clarity × Calma

Date: [today]
Scope: All pages, all components, first-use and experienced-user perspectives.
Reference: docs/calma-design-language.md, prior audits in docs/.

---

## Preamble
[2–3 sentences: overall verdict. What holds, what doesn't.]

---

## 1. Page-by-Page Design Review
[One subsection per page. Prose, not tables. Both strengths and issues.]

## 2. Cross-Page Consistency
[Findings as a bulleted list. High / Medium / Low per item.]

## 3. Emotional Identity
[Findings. Flag anything that feels like a productivity tool, not a journal.]

## 4. Information Architecture
[Findings.]

## 5. Summary & Most Important Observation

**Most important observation:** [Concrete, named, actionable.]

Findings by severity: N high · N medium · N low
```
