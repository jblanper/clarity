---
name: update-claude-md
description: Use this skill when the user asks to update CLAUDE.md based on the current session, review what was learned this session, sync CLAUDE.md with session findings, or run an end-of-session CLAUDE.md update.
disable-model-invocation: true
allowed-tools: Read, Edit
---

# Update CLAUDE.md

Review our conversation and the current state of the codebase, then update CLAUDE.md to reflect what you learned.

Specifically, look for:

1. **Corrections I made to your output** — anything you got wrong that I had to fix or redirect. Add the rule that would have prevented it.

2. **Assumptions you made that turned out to be wrong** — patterns you inferred that didn't match how this project actually works.

3. **Decisions we made during this session** — architectural choices, naming conventions, approaches we settled on, and any changes to the data model, localStorage keys, navigation patterns, or routing behaviour. Encode them as rules, not just descriptions.

4. **Gotchas you discovered** — anything in the codebase that surprised you or that a fresh Claude instance would likely get wrong.

5. **Sections that are now stale** — anything in the current CLAUDE.md that contradicts what we did today.

Rules for updating:
- Write instructions, not descriptions. "Never use X" not "X is not used here."
- Add rules to the most relevant existing section. Only create a new section if nothing fits.
- Do not remove existing rules unless they are factually wrong — append and refine.
- Keep the voice consistent with the existing document.
- Update the `Last reviewed` date at the top.

Before making changes, show me a summary of what you found and what you plan to change. Wait for my approval before editing the file.
