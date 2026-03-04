# Sprint Kickoff — Session Start Standup

Orient yourself at the start of a coding session mid-sprint. Read what's done,
what's pending, and tell the user exactly what to work on next.

## Setup

1. Find the current sprint doc:
   - List `docs/sprints/sprint-[0-9][0-9].md`, sort, take the latest with status `active`
   - If none is `active`, report: "No active sprint found. Run `/sprint-plan` to start one."
   - Read it in full.

2. Check git status:
   ```bash
   git status --short
   git log --oneline -10
   ```

3. Announce:
   > "Sprint N — [Sprint Theme]. Here's where we stand."

---

## Status report

### Completed tasks
List every task from the sprint doc whose Definition of Done has been met,
based on reading the task list. Mark each with ✓.

If you cannot determine completion from the sprint doc alone, use git log to
infer — look for commits that mention the task by name or file.

### Pending tasks
List every task not yet complete. For each, note:
- Any blockers stated in the sprint doc
- Dependencies on other tasks (e.g. "requires data model task first")

### Uncommitted or unstaged changes
If `git status` shows modified or untracked files relevant to the sprint,
list them and note which task they likely belong to.

---

## What to work on next

Recommend the next 1–2 tasks in priority order. Apply this ordering:

1. **Unblock first** — if any in-progress task has uncommitted work, finish it
2. **Dependencies** — respect the ordering from the sprint doc (data model → shared
   components → page-specific → copy)
3. **Highest value** — if multiple tasks are unblocked and independent, prefer the
   one that touches the most critical user flow

For each recommended task, state:
- What it is (task name from sprint doc)
- Why now (dependency order, unfinished work, or priority)
- The specific files likely to be touched (from the sprint doc's "Files" field)
- The Definition of Done so the user knows when they're finished

---

## Reminders

If the sprint doc contains a "Must fix before deploy" list from a previous
arch review, surface it here if any items are still outstanding.

If the sprint is more than halfway through its estimated date range and fewer
than half the tasks are done, flag it:
> "Sprint is behind pace — consider discussing scope with `/sprint-plan`."

End with:
> "Ready to code. Let me know when you're done with a task and I'll update the status."
