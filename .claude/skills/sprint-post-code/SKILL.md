---
name: sprint-post-code
description: Post-code orchestrator — runs arch-review as a quality gate, then validate and QA in parallel, then appends a consolidated summary to the sprint doc.
disable-model-invocation: true
allowed-tools: Read, Glob, Write, Edit, Bash, Agent
---

# Sprint Post-Code

Orchestrate all post-coding validation in one command:
1. Architecture review as a blocking gate (main session — needs user interaction)
2. Validate + QA in parallel (background agents) if the gate passes
3. Consolidated summary appended to the sprint doc

---

## Setup

Perform all four reads in parallel:
- List `docs/sprints/sprint-[0-9][0-9].md`, sort, take the latest with status `active` — read it in full (you need the sprint number and any "Audits to run" list used by the validate agent)
- Read `.claude/skills/sprint-validate/SKILL.md` in full
- Read `.claude/skills/sprint-qa/SKILL.md` in full
- Read `.claude/skills/sprint-arch-review/SKILL.md` in full (used in Phase 1)

If no active sprint is found, stop:
> "No active sprint found. Run `/sprint-plan` to start one."

---

## Phase 1 — Architecture gate (blocking, main session)

Read `.claude/skills/sprint-arch-review/SKILL.md` in full and follow its
instructions directly in the main session — do not spawn a sub-agent.
Arch-review must run in-session because its Phase 3 (discussion) is
interactive: the user responds to findings before the review is finalised.

After the discussion is complete and the arch-review section has been
appended to the sprint doc, determine the gate result:

**If arch-review found must-fix issues:**
- Print:
  > "Architecture gate failed — must-fix issues found. Resolve them and
  > re-run `/sprint-post-code`, or run `/sprint-validate` and `/sprint-qa`
  > manually once the issues are fixed."
- Stop. Do not proceed to Phase 2.

**If re-running after a partial failure:** arch-review runs from scratch — that
is expected and correct. The previous arch-review section in the sprint doc will
be overwritten when the new one is appended.

**If no must-fix issues:**
- Continue to Phase 2.

---

## Phase 2 — Parallel validation (background agents)

Spawn two agents simultaneously using the `Agent` tool, passing the full
content of each skill file (read during Setup) as that agent's task prompt:

- **Agent A** — sprint-validate instructions as prompt
- **Agent B** — sprint-qa instructions as prompt

Note: `sprint-qa` starts a dev server on port 3000. `sprint-validate` does
not use the dev server. No port conflict.

Wait for both agents to complete before proceeding to Phase 3.

If an agent produces no output or errors, note the failure in the consolidated
summary and flag it as a blocker in the recommended next action — do not
silently skip it.

---

## Phase 3 — Consolidated summary

Read the sprint doc to extract the sections appended by arch-review,
validate, and QA.

Append the section defined in `fragment.md` in this skill's directory to the
sprint doc, filled in from those sections:

- **Architecture gate** — PASS, or FAIL + must-fix list (gate passed to reach
  here, so this will be PASS unless the user re-ran after a partial failure)
- **Validation** — regression count and audit summary table from the Validation
  section
- **QA** — regression suite count and smoke result from the QA section
- **Recommended next action** — one of:
  - "Proceed to `/calma-sync` → `/deploy`" if no blockers
  - "Fix [N] blockers first: [list]" if there are failures

Print:
> "Post-code complete. Summary appended to the sprint doc.
> [Recommended next action]"
