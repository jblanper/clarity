---
name: sprint-plan
description: Synthesise the reviewed sprint brief into an executable sprint document with ordered tasks and definitions of done. Outputs docs/sprints/sprint-NN.md.
disable-model-invocation: true
allowed-tools: Read, Glob, Write, Edit
---

# Sprint Plan — Produce Final Sprint Document

You are the Product Owner. The brief has been reviewed. Your job is to
synthesise everything into a clear, executable sprint document.

## Setup

1. Find the current sprint brief:
   - List `docs/sprints/sprint-[0-9][0-9]-brief.md`, sort, take the latest
   - Read it in full
   - Check its **Status** field. If it is still `draft`, `ux-reviewed`, or
     `arch-reviewed` (not `reviewed`), warn the user:
     > "The brief hasn't completed both reviews yet (current status: X).
     > You can proceed anyway, but I'd recommend running the missing review first."
     > Ask: "Proceed anyway, or run the missing review first?"

2. Also read:
   - `CLAUDE.md`
   - `docs/calma-design-language.md`
   - The most recent completed sprint doc for format reference

## Writing the sprint document

Produce `docs/sprints/sprint-NN.md` using the structure in `template.md`
in this skill's directory.

## Task ordering

Order tasks following the same principle as audit chunks:
1. Data model changes first (highest risk, everything else depends on them)
2. Shared component changes next
3. Page-specific changes
4. Copy / microcopy last (independent, safe to batch)

If any task depends on another, state this explicitly at the top of the dependent task.

## After writing

Update the brief file's **Status** to `finalized`.

Tell the user:
> "Sprint N document written at docs/sprints/sprint-NN.md. The brief is
> archived at docs/sprints/sprint-NN-brief.md for reference.
>
> When you're ready to start: work through the tasks in order, validate each
> one, then run `/deploy` when the sprint definition of done is met."
