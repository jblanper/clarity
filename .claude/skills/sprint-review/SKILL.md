---
name: sprint-review
description: Run UX/UI and Architecture reviews in parallel as background agents, then mediate conflicts as Product Owner and update the sprint brief.
disable-model-invocation: true
allowed-tools: Read, Glob, Edit, Agent, Task
---

# Sprint Parallel Review — UX/UI + Architecture

Run the UX/UI and Architecture reviews simultaneously as background agents,
then facilitate a mediation session with the user as Product Owner.

**Trade-off vs. running individually:** `/sprint-review` runs UX and Arch in
analysis-only mode (no discussion phase) and adds a mediation step. Running
`/sprint-ux` then `/sprint-arch` separately gives a full discussion phase per
review. Choose `/sprint-review` when you want speed; choose individually when
you want depth.

## Setup

1. Find the current sprint brief:
   - List `docs/sprints/sprint-[0-9][0-9]-brief.md`, sort, take the latest
   - If none exists, stop: "No sprint brief found. Run `/sprint-brief` first."

2. Announce what is about to happen:
   > "I'm running the UX/UI and Architecture reviews in parallel for Sprint N.
   > This will take a moment — both reviewers will read the brief and the
   > codebase simultaneously. I'll present their findings together and we'll
   > work through any conflicts."

## Phase 1 — Parallel reviews

Spawn two background agents simultaneously using the trimmed inline prompts below.
Do not pass the full sprint-ux or sprint-arch SKILL.md files — those contain
interactive discussion and brief-update phases that must not run here.

**UX/UI Agent** — use this prompt verbatim, substituting the actual brief path:

> You are a senior UX/UI designer reviewing a sprint brief.
> Do not engage in discussion. Do not update the brief. Return only the written analysis as your response.
>
> 1. Read the brief file at `[path to current brief]`.
> 2. Read: `CLAUDE.md`, `docs/calma-design-language.md`, any components in `components/` relevant to the proposed scope, and any existing audit files in `docs/audits/` (audit-colour.md, audit-typography.md, audit-interaction.md, audit-microcopy.md).
> 3. Produce a written analysis covering these sections in order:
>    - **Calma fit** — does the scope feel consistent with Clarity's calm, typographic, non-gamified identity? Flag anything that risks adding visual noise, urgency, or dashboard energy.
>    - **User flow** — walk through the user journey for each proposed feature; flag ambiguous flows or new navigation patterns not established in the current architecture.
>    - **Component and pattern reuse** — which existing components apply; what would be new; what risks diverging from the design system?
>    - **Interaction and motion** — describe any new interactions or animations; flag anything requiring non-trivial Framer Motion work.
>    - **Audit relevance** — which of colour/typography/interaction/microcopy should run during sprint-validate?
>    - **Concerns and open questions** — anything uncertain or needing an answer before design is considered done.

**Architecture Agent** — use this prompt verbatim, substituting the actual brief path:

> You are a senior fullstack architect reviewing a sprint brief.
> Do not engage in discussion. Do not update the brief. Return only the written analysis as your response.
>
> 1. Read the brief file at `[path to current brief]`.
> 2. Read: `CLAUDE.md`, `docs/calma-design-language.md`, all files in `components/`, `lib/`, `types/`, and `app/` relevant to the proposed scope, and `docs/audits/audit-arch.md` if it exists.
> 3. Produce a written analysis covering these sections in order:
>    - **Technical feasibility** — for each scope item: straightforward, non-trivial, or risky?
>    - **Data model impact** — any new localStorage keys, type changes, or migration paths needed?
>    - **Static export constraints** — any dynamic routes, server-side logic, or incompatible dependencies?
>    - **Codebase degradation signals** — large components, pattern drift from CLAUDE.md, missing tests, coupling issues.
>    - **Implementation order and risks** — safest order; what could go wrong; how to catch it early.
>    - **Concerns and open questions** — anything needing an answer before implementation can begin safely.

Wait for both agents to complete.

## Phase 2 — Present findings

Present both analyses to the user in a structured way:

```
## UX/UI Review findings
[UX agent output]

---

## Architecture Review findings
[Arch agent output]
```

Then identify any conflicts between the two reviews — places where the UX recommendation
and the architecture assessment pull in different directions. Present these explicitly:

> "There are N points where the UX and Architecture perspectives conflict.
> Let me walk through each one so we can decide together."

For each conflict:
- State what UX recommends and why
- State what Arch recommends and why
- Ask the user for their call

## Phase 3 — Mediated discussion

Facilitate the discussion as Product Owner. Your job is to help the user make
decisions, not to impose them. For each open point:
- Present the trade-off clearly
- Offer your PO view if it would help
- Record the decision

Continue until all conflicts and open questions are resolved.

## Phase 4 — Update the brief

Once all decisions are made, append both review sections to the brief
(using the same format as `/sprint-ux` and `/sprint-arch`), plus the
mediation summary defined in `fragment.md` in this skill's directory.

Update the brief's **Status** field to `reviewed`.

Confirm the update and tell the user the next step:
> "Brief updated with both reviews and mediation decisions. Run `/sprint-plan`
> to produce the final sprint document."
