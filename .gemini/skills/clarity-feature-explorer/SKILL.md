---
name: clarity-feature-explorer
description: Analyze the Clarity app's design language and current state to suggest bold, minimalist features. Use when you need to brainstorm new capabilities for Clarity OR refine existing proposals (Zen, Solarpunk, local-first).
---

# Clarity Feature Explorer

Acts as a strategic partner for Clarity, identifying "bold" opportunities for growth that deepen self-reflection without adding digital clutter.

## Core Mandates

1.  **Anti-Gamification:** No streaks, points, badges, or "reminders." Success is "reflection," not "consistency."
2.  **Privacy & Sovereignty:** No cloud sync or third-party APIs. Data stays in `localStorage`.
3.  **Typographic Primacy:** Features must be built from words, weight, and whitespace. Avoid icons.
4.  **Intentional Friction:** Prioritize depth over speed. Ask the user to wait, think, or re-read.
5.  **Analog Inspiration:** Look to physical journals and Zen practices for high-touch, low-tech features.

## Bold Research Workflow

When asked to explore features, you must first determine the entry point by discussing with the user whether they want to **(A) Brainstorm new features** or **(B) Refine a previous proposal.**

### **Branch A: Brainstorming from Scratch**
Follow the iterative process below. **Crucial:** You must conduct a discussion with the user and seek their approval and feedback before proceeding to each subsequent step.

#### 1. External Research & Brainstorming
- Use `google_web_search` and `web_fetch` to find principles of "Calm Technology," "Solarpunk" (specifically 100 Rabbits), and "Zen Philosophy."
- Propose 3-5 features to the user in the chat. Each must include:
    - **The "Bold" Pitch:** Why it's unique.
    - **Calma Alignment:** How it follows mandates.
    - **Visual Description:** Typographic details.
    - **Boldness Score:** (1-10).
- **WAIT for user feedback and approval.**

#### 2. Feature Reporting
- Once the initial ideas are approved, create a report in `docs/clarity-feature-explorer/proposed-features-YYYY-MM-DD-HHMM.md`.
- Include a timestamp in both the filename and the report content.
- **Mandate:** Always include a dedicated section or bullet point in the report that explicitly links to and describes any existing or future mockups for each feature.
- Leave out the implementation blueprint for this initial report.
- **WAIT for user approval.**

#### 3. Technical Deep-Dive
- Provide a technical deep-dive for the approved features in the chat.
- After user approval, append this deep-dive to the report created in Step 2.
- **WAIT for user approval.**

#### 4. Mockup Generation
- If the user wants mockups, create them as HTML files using Tailwind CSS in `docs/clarity-feature-explorer/mockup-[feature-name].html`.
- Use the project's "Stone" color palette and typographic hierarchy.
- **Mandate:** Immediately update the report created in Step 2 to include direct Markdown links to these new mockup files.
- **WAIT for user feedback.**

#### 5. Final Blueprint
- Briefly outline the React/Next.js implementation steps, focusing on `lib/storage.ts` and `types/entry.ts`.

### **Branch B: Refinement of Previous Proposal**
1.  **Locate:** Use `glob` or `list_directory` to find existing reports in `docs/clarity-feature-explorer/`.
2.  **Analyze:** Read the selected report and associated mockups.
3.  **Discussion:** Ask the user what specific aspect needs refinement (e.g., "The visual language," "Technical feasibility," "Zen alignment").
4.  **Iterate:** Propose alternative visual directions or technical implementations, then jump to the appropriate step in Branch A (e.g., Step 3 for Deep-Dive or Step 4 for Mockup Generation).
5.  **Update:** Ensure any final refinements, including new mockups, are captured in an updated or new report with a current timestamp and explicit links to all visual assets.

## Example Triggers

- "I want to add a way for users to see their progress over the year."
- "How can we make the reflection part of the check-in more meaningful?"
- "Give me 3 bold ideas for the next version of Clarity."
- "Let's refine the 'Ma' Tapestry feature from the previous report."

## References
- See `references/calm-research.md` for principles and analog patterns.
