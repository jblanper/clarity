# Claude Code: Automation Patterns

## 1. Script-Based Automation
Offloading complex logic from LLM instructions to scripts reduces "Context Tax" and increases determinism.

| Pattern | Goal | Implementation |
|---|---|---|
| **The /batch Command** | Large-scale refactors. | Use for multiple independent units of work. |
| **Verification Loops** | Ensure correctness. | Always include automated tests or linting in scripts. |
| **Dynamic Context** | Context injection. | Use `!command` in `SKILL.md` to run scripts for dynamic data. |

## 2. Shared Utilities
- Create a `scripts/` directory within skills for common tasks (e.g., Markdown parsing, filesystem navigation).
- Reuse these utilities across multiple skills to ensure consistency.

## 3. Best Practices
- **Deterministic Output**: Scripts should provide structured output (e.g., JSON or consistent tables).
- **Graceful Failure**: Always handle errors in scripts and provide clear feedback to the agent.
- **Verification**: Always provide Claude with a way to verify its work (e.g., `npm run test`).
