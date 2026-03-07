---
name: audit-arch
description: Audit all components, pages, and lib utilities for CLAUDE.md pattern compliance, TypeScript strictness, test coverage, component structure, and static export constraints. Outputs docs/audits/audit-arch.md.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write
---

# Audit — Architecture & Code Health

Audit all source files against the rules in `CLAUDE.md`. This is a static
snapshot of codebase health — no code is changed.

## Before starting

Read `CLAUDE.md` in full. It is the complete rulebook; every rule documented
there is in scope. Do not work from memory.

## Scope

Read every file in `components/`, `app/`, `lib/`, and `types/`.

## What to check

### 1. CLAUDE.md compliance

Check every file against every rule in `CLAUDE.md` — coding standards, data
model rules, navigation architecture, component constraints, and anything else
documented there. Flag any instance where the code diverges from the spec.

Give particular attention to the areas most prone to drift:
- Coding standards (button types, section label pattern, colour roles)
- Navigation architecture (back navigation, Settings pattern, query params)
- Data model conventions (localStorage access, config API, key names)
- Static export constraints (dynamic routes, forbidden hooks, date construction)
- Motion patterns (LazyMotion usage, exit animation rules, reduced motion)

### 2. TypeScript strictness

Search for type-safety violations:
- `: any` explicit annotations
- `as any` unsafe casts
- Type assertions `as Foo` that could hide runtime type mismatches

Flag by where the violation occurs: data model types and `lib/` utilities are
higher severity than component code.

### 3. Test coverage

Read all non-test files in `lib/`. For each exported function or class, check
whether a corresponding test exists in `lib/*.test.ts`. Flag any exported
function with no test coverage at all, and any test file that is missing cases
for exported members it should cover.

### 4. Component structure signals

Flag structural concerns that will make the codebase harder to maintain:
- Components that have grown large enough that logic should move to `lib/`
- Business logic (data manipulation, localStorage access) living in components
  instead of utilities
- Duplicated inline logic across multiple components that warrants extraction

### 5. Static export constraints

Clarity is a static Next.js export. Any feature that would break the build or
require a server runtime is a critical finding. Check for dynamic routes without
`generateStaticParams`, and any server-runtime assumptions in the codebase.

## Output

Write results to `docs/audits/audit-arch.md`. Overwrite if it already exists.

Use the structure in `template.md` in this skill's directory.

Severity key: **Critical** = data loss risk or build-breaking constraint violation
· **High** = CLAUDE.md rule violation · **Medium** = structural signal worth
addressing · **Low** = minor deviation
