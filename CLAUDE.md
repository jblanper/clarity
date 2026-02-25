# Clarity — Coding Standards

## Code Quality
- Write clean, readable code with meaningful variable and function names.
- Avoid magic numbers — use named constants instead.
- Keep functions small and focused on a single responsibility.

## TypeScript
- Use strict typing throughout.
- No `any` types.
- Define interfaces for all data structures.

## Component Structure
- Keep components small and reusable.
- Separate UI components from logic.
- Store data helper functions in `lib/` or `utils/`.

## Comments
- Add a short comment to any function that isn't immediately obvious.
- No need to comment every line.

## Error Handling
- Handle edge cases gracefully — for example, if localStorage is unavailable or an imported JSON file is malformed, show a user-friendly message rather than crashing.

## Testing
- For each utility function (`saveEntry`, `getEntry`, `getAllEntries`, `export`, `import`), write a simple unit test using Jest.
- UI testing is not required for now.

## Mobile-First
- All components should be designed for small screens first.
- No horizontal scrolling.
