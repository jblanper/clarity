---
name: audit-microcopy
description: Audit all user-facing text for tone violations, technical language, vague messages, and Calma microcopy compliance. Outputs docs/audits/audit-microcopy.md.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write
---

# Audit — Microcopy & Tone

Audit all user-facing text for compliance with Clarity's voice and the
Calma microcopy principles.

## Before starting

Read `CLAUDE.md` (especially the "Microcopy & Tone" section) and
`docs/calma-design-language.md` in full.

## Scope

Read every file in `components/`, `app/`, and `lib/transferData.ts`.
Focus on string literals, template literals, and any text visible to the user.

## What to check

### 1. Technical language
Flag any string that uses developer or system terminology a non-technical user
would not understand. Common violations:
- Format names: "JSON", "CSV"
- Internal filenames referenced in error messages
- Database/system metaphors: "valid entries", "unrecognised format"
- Developer type names: "Boolean", "Numeric" as user-facing labels
- Unexplained technical terms: "Step" without context

### 2. Vague or unhelpful messages
Flag any error or status message that gives the user no actionable information.
- "Something went wrong. Please try again." is always a violation
- Error messages must be calm, specific, and tell the user what to try

### 3. Accusatory or guilt-inducing copy
Flag any string that implies the user failed, missed something, or is behind.
- Empty state messages must be inviting, never guilt-inducing
- "You missed this day" ❌ / "Nothing logged for this day yet" ✅

### 4. Tone violations
Flag any string that is:
- Clinical or cold where a human voice is expected
- Uses an exclamation mark (prohibited)
- Uses ALL CAPS outside the `tracking-widest` section label pattern
- Overly formal or corporate ("Appearance Settings" vs "Theme")

### 5. Flat or functional phrasing
Flag labels and prompts that are technically correct but miss an opportunity
to feel considered. These are lower severity — note them but don't over-index
on them relative to the violations above.

### 6. Save / confirmation copy
The save flow states are `idle → saving → confirmed`. Verify:
- "Saving…" appears as the in-progress state
- The confirmed state is brief and unobtrusive (no modal, no fanfare)
- The confirmed message fits the calm, human tone

## Output

Write the results to `docs/audits/audit-microcopy.md`. Overwrite if it already exists.

Use the structure in `template.md` in this skill's directory.
