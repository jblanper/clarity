# Claude Code: CLAUDE.md Guide

## 1. Role of CLAUDE.md
`CLAUDE.md` is the primary "onboarding manual" for Claude. It is injected into every session.

## 2. Best Practices
- **Conciseness**: Keep it under 150 lines. Large `CLAUDE.md` files waste tokens and may be ignored.
- **Reference Over Inclusion**: Instead of listing all rules, link to external files (e.g., `[Coding standards](docs/style-guide.md)`).
- **Core Sections**:
    - **Tech Stack**: Specify languages, frameworks, package managers (e.g., "Uses pnpm").
    - **Project Map**: Brief overview of the directory structure.
    - **Verification**: Exact commands for `npm test`, `ruff check`, etc.
    - **Architecture**: High-level design principles.

## 3. Progressive Disclosure
- Use skills for complex workflows instead of overloading `CLAUDE.md`.
- Ensure CLAUDE.md points to available slash commands (skills) for specialized tasks.

## 4. Maintenance
- Regularly prune outdated instructions to avoid conflicting "Context Tax."
- Move project-specific knowledge (e.g., "How to fix bug X") to persistent memory or temporary `docs/` files once resolved.
