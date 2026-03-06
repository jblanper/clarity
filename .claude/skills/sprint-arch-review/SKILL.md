---
name: sprint-arch-review
description: Post-implementation code review — sprint plan fidelity, CLAUDE.md compliance, TypeScript strictness, and codebase health signals.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Bash(git *), Bash(npm run *)
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

Work through each changed file against the following areas. Be specific:
reference file names and line numbers for every finding.

### 1. CLAUDE.md compliance
Check every changed file against every rule in CLAUDE.md — coding standards,
data model rules, navigation architecture, motion patterns, component constraints,
and anything else documented there. CLAUDE.md is the complete rulebook; if it's
in there, it applies.

### 2. TypeScript strictness
- No `any` types introduced
- All new data structures have interfaces
- No type assertions (`as Foo`) that could hide runtime errors

### 3. Test coverage
- Any new function in `lib/` must have a corresponding test in `lib/*.test.ts`
- Existing tests must still pass (already verified in Phase 1)

### 4. Codebase degradation signals
- **Component size** — any component that grew significantly this sprint and would
  benefit from extraction
- **Pattern drift** — new patterns that diverge from established conventions without
  a clear reason
- **Coupling** — new dependencies between components that should be independent
- **Dead code** — anything made unreachable or unused by this sprint's changes

### 5. Sprint plan fidelity
- Does the implementation match what the sprint doc specified?
- Any tasks skipped, partially done, or implemented differently than planned?
- Any scope creep — things built that weren't in the sprint doc?

## Phase 3 — Discussion

After presenting your findings, invite the user to respond:
> "That's my review. Any findings you want to push back on or discuss?"

Stay in the Architect role. Be open to context you might have missed, but
hold firm on CLAUDE.md violations — those are not negotiable.

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
