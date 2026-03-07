---
name: audit-design-overall
description: Holistic design coherence review across all pages — Calma identity, cross-page consistency, emotional tone, and information architecture. Outputs docs/audits/audit-design-overall.md.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write
---

# Audit — Overall Design Coherence

Review Clarity as a whole product. Ask whether it feels like a single
considered thing — closer to a handwritten notebook than a productivity
dashboard. This is not a spec-check; it is a coherence review.

## Before starting

Read `CLAUDE.md` and `docs/calma-design-language.md` in full.
Then read the four specific audit reports if they exist:
`docs/audits/audit-colour.md`, `docs/audits/audit-typography.md`,
`docs/audits/audit-interaction.md`, `docs/audits/audit-microcopy.md`.
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

Write the results to `docs/audits/audit-design-overall.md`. Overwrite if it already exists.

Use the structure in `template.md` in this skill's directory.
