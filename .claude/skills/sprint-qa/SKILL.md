---
name: sprint-qa
description: Run the Playwright regression suite, write new tests for this sprint's features, and produce a manual checklist for what automation cannot cover.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Sprint QA

Run the existing Playwright regression suite, write new tests for this sprint's
features, then produce a manual checklist for what automation can't cover.

Test files live in `e2e/`. Tests target user-visible behaviour (text, labels,
interactions) — never internal DOM structure — so they survive component refactors.

## Setup

1. Find the current sprint doc:
   - List `docs/sprints/sprint-[0-9][0-9].md`, sort, take the latest with status `active`
   - Read it in full — the task list and validation steps are the test specification

2. Check whether `e2e/` exists and contains any test files.

3. Start the dev server:
   ```bash
   npm run dev &
   ```
   Wait for it to be ready (poll `http://localhost:3000` until it responds).
   If it fails to start after 30 seconds, report the error and stop.

4. Announce:
   > "Dev server running at localhost:3000. Starting QA for Sprint N."

---

## Phase 1 — Run existing regression suite

If `e2e/` contains test files, run them:
```bash
npx playwright test e2e/
```

For each failure:
- Report the test name, the action that failed, and expected vs actual behaviour
- Determine whether the failure is a **regression** (the sprint broke existing
  behaviour) or a **stale test** (the feature intentionally changed)
- Regressions must be fixed before proceeding
- Stale tests must be updated to reflect the new intended behaviour before proceeding

Do not proceed to Phase 2 until all failures are resolved.

If no `e2e/` tests exist yet, note "No regression suite yet — building from scratch."

---

## Phase 2 — Write new tests for this sprint

For each task in the sprint doc, write Playwright tests covering:

**Happy path** — the primary user flow works end to end
**Edge cases** — at least one per task: empty state, single item, maximum items,
archived items, or whatever is most relevant to the feature
**Dark mode** — toggle `.dark` class on `<html>` and re-run key assertions
**Mobile viewport** — run at 390px width; this is a mobile-first app

### Test writing rules
- Target text content, ARIA roles, and user-visible labels — not class names or
  element IDs that change with refactors
- Use `page.getByRole()`, `page.getByText()`, `page.getByLabel()` in preference
  to `page.locator('.some-class')`
- Each test file covers one page or one feature area
- File naming: `e2e/[page-or-feature].spec.ts`

### Always-present smoke tests (create if not already in e2e/)
If these don't exist yet, create `e2e/smoke.spec.ts`:
- Today page loads and renders the check-in form
- Save flow completes: fill a habit, click Save, see confirmation
- BottomNav switches between Today and History
- Settings page opens and back navigation returns to the correct page
- Theme toggle persists across page reload
- Export produces a downloadable file

Run new tests immediately after writing them to confirm they pass.

---

## Phase 3 — Review and update stale tests

Before finishing, read through all test files in `e2e/` and flag any test that:
- Tests a feature that no longer exists
- Asserts behaviour that has intentionally changed this sprint
- Uses class names or internal selectors that are now broken

Update or delete stale tests. Record what was changed and why.

---

## Phase 4 — Manual checklist

Produce a checklist for things Playwright cannot reliably validate, using the
manual checks structure in `fragment.md` in this skill's directory.
Derive sprint-specific items from the sprint doc's validation steps.

---

## Phase 5 — Stop the dev server

```bash
kill $(lsof -ti:3000) 2>/dev/null || true
```

---

## Recording results

Append the section defined in `fragment.md` in this skill's directory
to the sprint doc.

Tell the user:
> "QA complete. Regression suite: N tests. [N failures to fix / All passing.]
>
> Please work through the manual checklist above before running `/deploy`."
