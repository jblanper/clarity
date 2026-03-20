# Debug report — scroll-behavior: smooth warning in Chrome console

**Date:** 2026-03-20
**Class:** console warning
**Status:** Fixed

## Bug

Chrome console showed a Next.js warning on every page load:

```
Detected `scroll-behavior: smooth` on the `<html>` element. To disable smooth scrolling
during route transitions, add `data-scroll-behavior="smooth"` to your <html> element.
```

## Reproduction steps

1. Run `npm run dev`
2. Open `http://localhost:3000` in Chrome with DevTools → Console open
3. Observed: warning fires on initial page load

## Root cause

`globals.css` sets `scroll-behavior: smooth` on the `html` element (line 32). Next.js's
router detects this at mount time and warns that it will interfere with its own scroll
management during route transitions — unless the developer signals the intent explicitly
via the `data-scroll-behavior="smooth"` attribute on the `<html>` tag.

`app/layout.tsx` had no such attribute:
```tsx
<html lang="en" suppressHydrationWarning>
```

## Fix

Added `data-scroll-behavior="smooth"` to the `<html>` tag in `app/layout.tsx`:

```tsx
<html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
```

This tells Next.js that smooth scrolling is intentional, so it suppresses the warning
and handles disabling smooth scroll during its own route transitions.

## CLAUDE.md update

Not needed — standard Next.js attribute, self-explanatory.
