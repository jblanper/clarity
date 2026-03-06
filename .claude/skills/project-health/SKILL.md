---
name: project-health
description: Between-sprint housekeeping — security audit, outdated dependencies, test suite health, and docs integrity check.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash(npm *), Bash(npx *)
---

# Project Health — Periodic Housekeeping

Run a full health check across security, dependencies, tests, and documentation.
Use this between sprints or whenever the project feels like it needs a reset.

## Setup

Announce:
> "Running project health check. This covers security, dependencies, tests,
> and docs integrity."

---

## Phase 1 — Security

```bash
npm audit --audit-level=moderate
```

Report:
- Number of vulnerabilities by severity (critical, high, moderate)
- Package names and brief description for critical/high findings
- Whether `npm audit fix` would resolve them automatically or requires manual work

If no vulnerabilities: "No known vulnerabilities."

---

## Phase 2 — Dependency freshness

```bash
npm outdated
```

For each outdated package, categorise:
- **Major version behind** — likely breaking changes; flag explicitly
- **Minor/patch behind** — generally safe to update; list as a group

Do not run `npm update` or `npm install` without the user's approval.
Summarise: "N packages outdated. M have major version updates available."

---

## Phase 3 — Test suite

Run the full test suite:
```bash
npm run lint && npm test
```

Report pass/fail counts. For any failures, show the test name and error.

If `e2e/` contains Playwright test files, run them:
```bash
npx playwright test e2e/
```

Report pass/fail counts. For any failures, show the spec file and failing assertion.

If `e2e/` is empty or missing: "No Playwright tests yet — run `/sprint-qa` to build the suite."

---

## Phase 4 — Documentation integrity

Check that `docs/` references are not stale.

### Referenced components
Scan all files in `docs/` for mentions of component names (e.g. `CheckInForm`,
`HabitToggle`, `DayDetail`). For each component name found, verify it still
exists in `components/`. Flag any that don't.

### Referenced files and paths
Scan all files in `docs/` for file path references (e.g. `lib/storage.ts`,
`app/history/`). Flag any that no longer exist.

### CLAUDE.md implementation tokens
Cross-check the Tailwind token classes in the `## Design` section of `CLAUDE.md`
against actual usage in `components/`. Flag if any token pattern (e.g. the section
label six-class string) does not appear in any component — it may have drifted.

### Calma spec / HTML sync
Check whether `docs/calma-design-language.md` and `public/calma-design-language.html`
are in sync at a high level (same section headings present in both). Flag any
section that appears in one but not the other.

---

## Summary

Present findings as a table:

| Area | Status | Issues |
|---|---|---|
| Security | ✓ clean / ⚠ N issues | [summary] |
| Dependencies | ✓ up to date / ⚠ N outdated | [summary] |
| Lint + unit tests | ✓ pass / ✗ N failures | [summary] |
| Playwright e2e | ✓ pass / ✗ N failures / — none yet | [summary] |
| Docs integrity | ✓ clean / ⚠ N stale refs | [summary] |
| Calma spec sync | ✓ in sync / ⚠ sections differ | [summary] |

Then state the recommended next action:
- If critical/high security issues: "Address security issues before the next sprint."
- If major dep updates: "Review major version updates — check changelogs before upgrading."
- If test failures: "Fix test failures before starting new sprint work."
- If docs stale: "Update docs — stale references mislead future sessions."
- If all clean: "Project is healthy. Ready for the next sprint."
