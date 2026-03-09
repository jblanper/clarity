# Clarity: Proposed Bold Features
Date: 2026-03-09 15:45

## Feature 1: The "Kanso" Reflection Prompt (Zen-Inspired)
**The Bold Pitch:** Instead of a static "Reflection" box, Clarity presents a single, handwritten-style prompt that changes based on the day's recorded "Joy." If no joy was recorded, it asks a "Wabi-Sabi" question about finding beauty in a difficult moment.

*   **Calma Alignment:** Deepens reflection without adding tracking metrics. It uses intentional friction—the user must engage with the question before saving.
*   **Visual Description:** A single line of `stone-500` text in `xs` (Section Label style) appearing above the textarea. The textarea background is a subtle `stone-50` panel with a `2xl` radius.
*   **Mockup:** [mockup-kanso-prompt.html](mockup-kanso-prompt.html)
*   **Boldness Score:** 6/10 — It shifts the app from a "tracker" to a "guided journal" without adding complexity.

## Feature 2: The "Migration" Ceremony (100 Rabbits/BuJo Inspired)
**The Bold Pitch:** At the start of a new week, Clarity shows a "Migration" screen. Any habits that weren't completed at least 3 times in the previous week are shown in faded text. The user must *manually re-type* the habit's name to keep it active for the new week. If they don't, the habit is automatically archived.

*   **Calma Alignment:** Replaces automated notifications with "Intentional Friction." It forces the user to confront their actual priorities rather than letting a list of "failed" habits grow indefinitely.
*   **Visual Description:** A full-page view with high `Ma` (whitespace). Typography is `light` weight. The re-typing interaction uses a simple, unstyled input that matches the `reflective body` type.
*   **Mockup:** [mockup-migration-ceremony.html](mockup-migration-ceremony.html)
*   **Boldness Score:** 9/10 — It actively encourages "quitting" habits that aren't serving the user, which is the opposite of traditional engagement-focused apps.

## Feature 3: The "Ma" Seasonal Tapestry (Solarpunk/Ecosystem Inspired)
**The Bold Pitch:** Replaces the standard "Calendar Heatmap" with a "Seasonal Tapestry." The tapestry doesn't use squares or intensity colors. Instead, it uses varying typographic tracking and weights. A "busy" month has tighter tracking and bolder weights; a "calm" month is wider and lighter. The "accent" color (Amber) appears only for days marked with "Joy."

*   **Calma Alignment:** Uses "Typographic Primacy" to visualize data. It feels like an analog weaving or a garden's density rather than a corporate dashboard.
*   **Mockups:** 
    - [mockup-full-month-explorations.html](mockup-full-month-explorations.html) (Full Month Grid)
    - [mockup-tapestry-explorations.html](mockup-tapestry-explorations.html) (5 Visual Directions)
*   **Visual Description:** A grid-based visualization where each day's activity density (habits, moments, reflection length) determines its visual weight. It replaces the traditional heatmap with a choice of five "Tapestry" styles:
    1.  **Typographic Rhythm:** Font weight, character tracking, and size create a dense or spacious month.
    2.  **The Weave:** Variable-width vertical threads create a physical, structural feeling.
    3.  **The Petals:** Organic, blooming circles that vary in scale and border-weight.
    4.  **The Mist:** Atmospheric opacity and blur levels create an ethereal, transient history.
    5.  **The Field:** Typographic cross-hatching (/, \, |) creates a hand-drawn, textured landscape.
*   **Boldness Score:** 8/10 — It challenges the user to "feel" their history rather than "measure" it.

### Visual Explorations (February 2026 Case Study)
Full-month mockups have been generated in `docs/clarity-feature-explorer/mockup-full-month-explorations.html` showing:
- **Harvest Cycles:** High-density clusters using bold weights or thick threads.
- **Winter Cycles:** Spacious regions using faint mists or light typography.
- **Flowers of Joy:** Amber accents (Amber-500) integrated into the tapestry to highlight emotional peaks.

### Philosophy: Purpose, Intent, and Value
*   **The Purpose: "Feeling" instead of "Counting"** — A tapestry is a piece of fabric where the weaver's tension changes. In Clarity, your "tension" is how much you engage with your day. A "dense" day (bold weight) vs. a "spacious" day (light weight) reveals the rhythm between fullness and quietness.
*   **The Intent: Honoring the "Ma" (Negative Space)** — In Zen philosophy, *Ma* is the space between notes. In the Tapestry, a "missed" day isn't a "gap" in a streak; it's Ma. It's the space where you were simply living without the need to record it. Wider tracking for these days gives them breathing room.
*   **The Value: Seasonal Awareness** — The Tapestry reveals your "Seasons": a Winter of rest (light and wide) vs. a Harvest of growth (dense and bold). Amber dots (Joy) are the "flowers" in this garden—highlights that catch the eye when you look back.

## Technical Deep-Dive

### 1. The "Kanso" Reflection Prompt
*   **Prompt Engine:** Create `lib/prompts.ts` containing arrays of prompts categorized by context (e.g., `joyful`, `challenging`, `neutral`).
*   **State Integration:** In `CheckInForm.tsx`, derive the current prompt state based on `fields.habits` (any `joy: true`?) and `fields.moments`.
*   **Persistence:** The prompt itself doesn't need to be saved in the `HabitEntry`, as it's a transient trigger. However, `types/entry.ts` could be extended to include `promptId` if we want to track which question was answered.
*   **UI:** Use `motion/react` for a subtle fade-in of the prompt when the "Joy" state changes.

### 2. The "Migration" Ceremony
*   **Session Management:** Store a `lastMigrationDate` in `localStorage` (via `lib/habitConfig.ts`). On app load, check if the current date is in a new week (ISO week number comparison).
*   **Filtering Logic:** Iterate through the last 7 entries (from `lib/storage.ts`). Count occurrences of each habit. Identify "underperforming" habits (count < 3).
*   **Interception View:** Create `app/migrate/page.tsx`. If a migration is due, redirect the user here from the Home page (`/`).
*   **Manual Re-entry:** Use a controlled input where the `value` must exactly match the habit's label. On success, update the habit's `lastMigrated` timestamp in `AppConfigs`.

### 3. The "Ma" Seasonal Tapestry
*   **Data Transformation:** Create a utility `getTapestryData(year)` in `lib/storage.ts` that returns a matrix of daily activity scores (not just boolean, but a density score based on habits + moments + reflection length).
*   **Visual Mapping:** Use the activity score to map to CSS classes:
    *   Low: `tracking-widest font-light opacity-40`
    *   High: `tracking-tighter font-medium opacity-100`
*   **Performance:** Since this is a static view, calculate the grid once and render using a simple map. Use CSS Grid for the layout to maintain consistent "Ma" spacing.
*   **Interactive Layer:** Hovering over a dot shows a typographic tooltip (e.g., `xs uppercase tracking-widest`) with the date and key "Moments."
