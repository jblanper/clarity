---
name: debug
description: Structured debugging session for Clarity — reproduce, isolate, fix, and document any bug. Always produces a report saved to docs/debug/ with a datetime-stamped filename.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Debug

Structured debugging for a specific bug or unexpected behaviour in Clarity.

Usage: `/debug [brief description of the bug]`

If no description is provided, ask: "What behaviour are you seeing and what did you expect?"

---

## Workflow checklist

Copy this checklist into your response and check off each phase as you complete it. Do not stop until all phases are marked done.

```
Debug progress:
- [ ] Phase 1 — Understand (classify, locate, check CLAUDE.md)
- [ ] Phase 2 — Reproduce (dev server, reproduction steps)
- [ ] Phase 3 — Isolate (hypothesis, verify, quote offending code)
- [ ] Phase 4 — Fix (edit, lint/test/build, scope check)
- [ ] Phase 5 — Document (console summary + report file)
- [ ] Phase 6 — Stop dev server
```

---

## Phase 1 — Understand

Before touching any code, gather facts.

1. **State the bug clearly** — write a one-sentence description:
   > "When [trigger], [component] does [actual behaviour] instead of [expected behaviour]."

2. **Classify the bug:**
   - `runtime` — crash, error, or exception at runtime
   - `ui` — wrong visual output (layout, colour, animation, text)
   - `logic` — wrong data, wrong calculation, wrong state transition
   - `navigation` — wrong route, back-stack issue, URL mismatch
   - `storage` — localStorage read/write gone wrong, stale data, UUID mismatch
   - `animation` — jank, snap, wrong timing, wrong exit/enter sequence

3. **Locate the relevant code.** For each classification:
   - `runtime/logic/storage` — search `lib/`, `types/`, and the component mentioned
   - `ui/animation` — search `components/` for the affected component
   - `navigation` — check `app/` pages, `BottomNav.tsx`, and `SettingsView.tsx`

   Use Grep and Glob. Read only the files that are plausibly involved. Do not read
   the full codebase speculatively.

4. **Check CLAUDE.md for prior art.** Grep CLAUDE.md for the component name and
   for the bug class. Prior incidents are documented in the implementation notes.
   If a known pattern applies, cite it in the report.

---

## Phase 2 — Reproduce

Establish a minimal reproduction path: the smallest sequence of steps that
reliably triggers the bug.

1. Start the dev server if not already running:
   ```bash
   npm run dev &
   ```
   Wait for it to respond on `http://localhost:3000`.

2. Walk through the reproduction steps, noting:
   - What state must exist first (e.g. specific localStorage data, a particular config)
   - The exact user action that triggers the bug
   - What the app does vs. what it should do

3. Record the reproduction steps as a numbered list. If the bug cannot be reproduced
   reliably, note that explicitly and proceed with static analysis only.

---

## Phase 3 — Isolate

Narrow to the exact cause before writing any fix.

1. **Read the relevant code** — the component, the utility, or the route identified
   in Phase 1.

2. **Form a hypothesis** — state what you believe the root cause is. Be specific:
   name the file, the function or JSX block, and the mechanism that causes the
   wrong behaviour.

3. **Verify the hypothesis** — confirm by reading the exact line(s) responsible.
   Quote the offending code in the report.

4. **List what you tried** — if any hypothesis was ruled out, record it so future
   debugging does not retread the same ground.

---

## Phase 4 — Fix

Apply the minimal fix. Do not refactor surrounding code.

1. Edit only the files the bug touches. If a fix requires touching more than
   3 files, pause and explain why before proceeding.

2. After fixing, run:
   ```bash
   npm run lint && npm test && npm run build
   ```
   All three must pass before the fix is considered complete. If any fail, resolve
   the failure before proceeding.

3. Verify the fix resolves the reproduction path from Phase 2.

4. **Scope check** — consider whether the same root cause could exist elsewhere in
   the codebase. Search broadly for the pattern (not a specific list of known
   issues) and report any additional instances found. Fix them if safe; flag
   them if uncertain.

---

## Phase 5 — Document

Always produce a report, even if the bug was not reproducible or not fixed.

### Console summary

Print this block to the terminal before writing the report file:

```
── Debug session ────────────────────────────────────────────
Bug:        [one-sentence description]
Class:      [runtime | ui | logic | navigation | storage | animation]
Status:     [Fixed | Partially fixed | Not reproducible | Needs more info]
Files changed: [list, or "None"]
Root cause: [one sentence]
─────────────────────────────────────────────────────────────
```

### Report file

Run `date '+%Y-%m-%d_%H-%M'` to get the datetime stamp for the filename.

Save the report to a **new file**:
```
docs/debug/YYYY-MM-DD_HH-MM_[slug].md
```
where `[slug]` is a 2–4 word kebab-case description of the bug
(e.g. `exit-animation-snap`, `date-offset-mismatch`, `bottomnav-jump`).

Create `docs/debug/` if it does not exist.

The report file contents:

```markdown
# Debug report — [Brief bug title]

**Date:** YYYY-MM-DD HH:MM
**Class:** [runtime | ui | logic | navigation | storage | animation]
**Status:** [Fixed | Partially fixed | Not reproducible | Needs more info]

## Bug

[One-sentence description: "When X, Y does Z instead of W."]

## Reproduction steps

1. [Step]
2. [Step]
3. [Observed: … / Expected: …]

## Root cause

[Exact explanation. Quote the offending code.]

## What was tried

- [Hypothesis ruled out and why, or "N/A — root cause identified immediately"]

## Fix

[What was changed and why. Reference the file and line numbers.
If not fixed, explain what information is still needed.]

## Scope check

[Were any additional instances of the same root cause pattern found elsewhere?
What was searched and what was the result.]

## CLAUDE.md update

[Updated — rule added: "…" / Not needed — existing rule covers this / Already documented]
```

If **CLAUDE.md update** is needed, update `CLAUDE.md` immediately in the
relevant component notes or coding standards section. Do not leave it as a
"should do" — update it now.

---

## Phase 6 — Stop the dev server

```bash
kill $(lsof -ti:3000) 2>/dev/null || true
```

---

Tell the user:
> "Debug session complete. Status: [Fixed / Not reproducible / Needs more info].
>
> Report saved to docs/debug/YYYY-MM-DD_HH-MM_[slug].md.
> [If CLAUDE.md was updated]: CLAUDE.md updated with the new rule.
> [If further action needed]: Next step: [specific action]."
