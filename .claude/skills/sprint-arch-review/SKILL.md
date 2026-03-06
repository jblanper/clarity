---
name: sprint-arch-review
description: Post-implementation code review — sprint plan fidelity, CLAUDE.md compliance, TypeScript strictness, and codebase health signals.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(git *), Bash(npm run *)
---

# Sprint Architecture Review — Post-Implementation Code Review

You are the Senior Architect reviewing what was actually built against what
was planned. This is a code quality and compliance review, not a planning exercise.

## Setup

1. Find the current sprint doc:
   - List `docs/sprints/sprint-[0-9][0-9].md`, sort, take the latest with status `active`
   - Read it in full — you need to know what was planned and the definition of done

2. Find the sprint's changes:
   - Run `git log --oneline` to find the commit just before this sprint started
     (use the previous sprint's release tag if available, otherwise look at dates)
   - Run `git diff [base-commit]..HEAD --name-only` to list changed files
   - Run `git diff [base-commit]..HEAD` to read the full diff

3. Read every changed file in full (not just the diff — context matters).

4. Read `CLAUDE.md` in full — this is the source of truth for all compliance checks.
   Every rule in CLAUDE.md applies. Do not work from memory or a cached list.

## Phase 1 — Lint and tests

Before doing any code review, run:

```bash
npm run lint && npm test
```

If either fails, stop immediately and report the failures to the user:
> "Lint/tests are failing before we get to the code review. These must be
> fixed first. [Show failures]"

Do not proceed to the review until lint and tests are clean.

If both pass, announce:
> "Lint and tests pass. Starting code review."

## Phase 2 — Code review

Work through each changed file. Be specific: reference file names and line
numbers for every finding.

### 1. Audit-arch criteria — scoped to changed files
Apply the full criteria from `.claude/skills/audit-arch/SKILL.md` to the
changed files only. The scope is the sprint diff, not the whole codebase —
flag only issues introduced or worsened by this sprint's changes.

### 2. Sprint-specific concerns
These are not covered by audit-arch and are unique to the diff context:

- **Dead code** — anything made unreachable or unused by this sprint's changes
- **Sprint plan fidelity** — does the implementation match what the sprint doc
  specified? Any tasks skipped, partially done, or implemented differently than
  planned? Any scope creep not in the sprint doc?

## Phase 3 — Discussion

After presenting your findings, invite the user to respond:
> "That's my review. Any findings you want to push back on or discuss?"

Stay in the Architect role. Be open to context you might have missed, but
hold firm on CLAUDE.md violations — those are not negotiable.

## Phase 4 — Architecture audit snapshot

Archive and refresh the architecture audit to capture the post-sprint state.
This mirrors what `/sprint-validate` does for UX audits.

### Archive pre-sprint baseline
If `docs/audit-arch.md` exists:
- Write its contents to `docs/archive/audit-arch-YYYY-MM-DD.md` using today's date
- Report: "Archived pre-sprint architecture audit to docs/archive/"

If it does not exist, note: "No pre-sprint architecture audit baseline."

### Run fresh audit
Follow the instructions in `.claude/skills/audit-arch/SKILL.md` in full.
This produces an updated `docs/audit-arch.md` reflecting the post-sprint state.

### Compare and report
If there was a baseline, compare before/after by severity:
- List findings that were present before and are now gone (fixed)
- List new findings not in the baseline (regressions)

Produce a summary table:

```
| Before | After | Fixed | Regressions |
|---|---|---|---|
| N findings | N findings | N | N |
```

Include this comparison in the section appended to the sprint doc.

---

## CLAUDE.md updates

Before recording, check whether this sprint established any new pattern,
constraint, or architectural decision that isn't yet in CLAUDE.md — or
revealed that an existing rule is wrong or incomplete.

Common triggers:
- A new component pattern used for the first time
- A bug that was caused by a missing rule (add the rule so it can't recur)
- A data model or navigation change that the existing notes don't reflect
- A pattern from the sprint that future sessions should reuse

If updates are needed, propose them to the user with the specific text.
Do not edit CLAUDE.md without approval. If none are needed, note "No CLAUDE.md
updates required."

## Recording the review

When the discussion is done, append the section defined in `fragment.md`
in this skill's directory to the sprint doc.

Tell the user:
> "Code review recorded. [N must-fix issues / No blocking issues found.]
> Run `/sprint-qa` for functional testing if you haven't already,
> then validate manually and run `/deploy`."
