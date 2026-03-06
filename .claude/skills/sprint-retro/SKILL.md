---
name: sprint-retro
description: Facilitate a short sprint retrospective via four guided questions, then record the findings in the sprint document.
disable-model-invocation: true
allowed-tools: Read, Glob, Edit
---

# Sprint Retrospective

Facilitate a short retrospective for the completed sprint and record it in
the sprint document.

## Setup

1. Find the most recently completed sprint doc:
   - List `docs/sprints/sprint-[0-9][0-9].md`, sort, take the latest
   - Read the full document, including all tasks and the Definition of Done checklist
   - Also read the brief (`sprint-NN-brief.md`) to recall what was planned vs. what shipped

2. Announce:
   > "Let's run the Sprint N retrospective. This should be short — 10 minutes
   > of honest reflection. I'll ask you four questions."

## Discussion

Ask these four questions one at a time. Wait for the user's answer before
asking the next. Add your own observations after each answer — you've read
the sprint doc and can offer a perspective the user might have missed.

**Question 1 — What went well?**
What worked smoothly? What are you proud of in this sprint?

**Question 2 — What was harder than expected?**
Any tasks that took longer, required more passes, or surfaced unexpected problems?

**Question 3 — What should we do differently?**
Process, planning, tooling, or skill improvements that would make the next
sprint go better.

**Question 4 — Planning accuracy**
Looking at the brief: were the scope, effort estimates, and task ordering accurate?
What would you change about how the sprint was planned?

After all four questions, offer 1–2 observations of your own that the user
didn't mention — things visible in the commit history or task list that are
worth noting.

## Recording the retrospective

Append the section defined in `fragment.md` in this skill's directory
to the sprint doc, replacing the placeholder comment.

## Closing

After writing, tell the user:
> "Retrospective recorded. The process improvements above will be useful
> context when we run `/sprint-brief` for Sprint N+1.
>
> Ready to start planning the next sprint whenever you are."
