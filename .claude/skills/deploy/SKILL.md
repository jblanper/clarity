---
name: deploy
description: Full release pipeline — lint, tests, build, version bump, changelog, commit and tag, GitHub release. Run only after manual validation is complete.
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash
---

# Deploy Skill

Prepare and release a new version of Clarity to GitHub Pages.

## Version bump rules

- **Patch** (x.x.+1) — bug fixes, copy changes, style tweaks, dependency updates
- **Minor** (x.+1.0) — new user-facing features or significant UX changes
- **Major** (+1.0.0) — breaking changes to the data model, complete redesigns, or changes that make existing localStorage data incompatible

Inspect the commits since the last tag to decide which applies. When in doubt, ask the user before proceeding.

## Steps

1. **Verify environment**
   - Confirm we're in a git repository (`git rev-parse --git-dir`)
   - Check the working tree is clean (`git status`); if there are uncommitted changes, report them and stop

2. **Check dynamic routes**
   - Find all dynamic route segments in `app/` (directories named `[param]`)
   - Verify each has a `generateStaticParams` export
   - If any are missing, add them and note what was changed

3. **Lint**
   - Run `npm run lint`
   - Fix any errors; warnings are acceptable but should be noted
   - Do not proceed if lint errors remain

4. **Tests**
   - Run `npm test`
   - If any tests fail, debug and fix, then re-run
   - Do not proceed if tests are red

5. **Build**
   - Run `npm run build`
   - If it fails, read the error, fix the root cause, and rebuild
   - Repeat up to 3 times; if still failing after 3 attempts, stop and report

6. **Determine version bump**
   - Read git log since the last tag (`git log {last-tag}..HEAD --oneline`)
   - Apply the version bump rules above to decide patch / minor / major
   - State the decision and rationale before proceeding

7. **Bump version**
   - Read the current version from `package.json`
   - Increment according to the decision in step 6
   - Write the new version back to `package.json`

8. **Update CHANGELOG.md**
   - Prepend a new entry with the new version, today's date, and a summary of the commits grouped by type (feat, fix, docs, chore)
   - If `CHANGELOG.md` doesn't exist, create it

9. **Commit and tag**
   - Stage `package.json`, `CHANGELOG.md`, and any files changed in steps 2–5
   - Commit with message: `Release v{version}`
   - Create an annotated git tag: `v{version}`

10. **Push and create GitHub release**
    - Push the commit and tag:
      ```
      git push origin main
      git push origin v{version}
      ```
    - Create a GitHub release using the CLI:
      ```
      gh release create v{version} --title "v{version}" --notes "{changelog entry for this version}"
      ```

11. **Report**
    - Confirm the release was created and print the GitHub release URL
