---
name: calma-sync
description: Post-sprint review of whether sprint changes require updates to the Calma design language spec and its HTML counterpart. Run after sprint-validate, before sprint-retro.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Bash(git *)
---

# Calma Sync — Post-Sprint Design Language Review

Review whether the sprint's changes require an update to the Calma design
language specification. This runs after validation and before the retrospective.

`docs/calma-design-language.md` is the single source of truth for all design
decisions. `public/calma-design-language.html` is its published counterpart and
must be kept in sync with it.

## Setup

1. Find the current sprint doc:
   - List `docs/sprints/sprint-[0-9][0-9].md`, sort, take the latest with status `active`
   - Read it in full

2. Read `docs/calma-design-language.md` in full.

3. Find the sprint's changes:
   - Run `git diff [sprint-base-commit]..HEAD --name-only` to list changed files
   - Read every changed component and page file

4. Announce:
   > "Reviewing Sprint N changes against the Calma design language spec."

## Review

Examine the sprint's changes against the existing Calma spec and look for:

### 1. New patterns not documented
Did the sprint introduce a UI pattern, component behaviour, colour use,
spacing value, animation, or interaction that isn't described in the Calma spec?
These should be documented so future work builds on them consistently.

### 2. Changed patterns
Did the sprint intentionally change something currently documented?
For example: a revised motion duration, a new section label variant, a new
colour role. The spec should reflect reality.

### 3. Contradictions
Does anything built in the sprint contradict the current Calma spec?
This is either a compliance issue (should have been caught by the arch review)
or a deliberate design evolution (the spec needs updating).

### 4. Spec gaps exposed by the sprint
Did implementing this sprint reveal that the Calma spec is underspecified in
an area? Note these even if the sprint didn't change anything — they are open
design decisions that could cause inconsistency in future work.

## Discussion

Present your findings:
> "I found [N items / nothing] that may require a Calma spec update.
> Let me walk through them."

For each finding, propose the specific text to add or change in the spec.
Do not update either file without the user's approval of each proposed change.

If there is nothing to update:
> "No Calma spec changes needed for this sprint."

## Updating the spec

For each approved change:

1. **Update `docs/calma-design-language.md`** with the agreed text.

2. **Sync `public/calma-design-language.html`** — find the corresponding section
   in the HTML file and update it to match the markdown change. The HTML file
   is a styled published version of the same content; its structure mirrors
   the markdown sections. Update the content, not the styling.

3. **Check CLAUDE.md's Tailwind implementation tokens** — if a Calma change
   affects a colour role, button style, or section label pattern, the tokens
   in CLAUDE.md's `## Design` section may need updating too. Propose any
   changes; do not edit without approval.

After all changes are made, show a summary of what was updated across all files.

## Recording

Append the section defined in `fragment.md` in this skill's directory
to the sprint doc.

Tell the user:
> "Calma sync complete. Run `/sprint-retro` to close out the sprint."
