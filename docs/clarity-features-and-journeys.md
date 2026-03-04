# Clarity — Application Feature & User Journey Report

## Executive Summary
Clarity is a minimal, privacy-focused daily habit tracker built on the "Calma" design philosophy. Unlike traditional productivity tools that rely on gamification, streaks, and anxiety-inducing notifications, Clarity focuses on honest self-reflection and long-term consistency. It is a local-first web application, ensuring 100% data privacy with no server-side storage.

## Core Features

### 1. Daily Check-in (Home)
The primary interface is a distraction-free form designed for end-of-day reflection.
- **Boolean Habits:** Simple toggles for "done" / "not done".
- **Joy Tracking:** Completed habits can be marked as "joyful," adding a layer of qualitative data beyond simple completion.
- **Numeric Habits:** Tracking for quantifiable goals (e.g., "Water: 5 cups", "Sleep: 7.5 hrs") with custom units and step values.
- **Moments:** A tag-based system to capture daily highlights (e.g., "Good meal", "Nature"). Users can create new moments inline.
- **Reflection:** A text area for journaling thoughts.
- **Smart Defaults:** The interface adapts to "Edit Mode" when accessing past dates.

### 2. History & Visualization
A powerful retrospective view that emphasizes patterns over streaks.
- **Calendar Heatmap:** A custom-built visualization that blends colors based on habit completion (Blue/Stone) and joy/moments (Amber). It avoids the "green square" pressure of GitHub-style graphs.
- **Interactive Filtering:** Tapping a specific habit or moment filters the entire heatmap to show only that item's history.
- **Frequency Analysis:** Statistical breakdown of habit consistency over configurable periods (Month, 3 Months, All Time).
- **Day Detail View:** A read-only slide-over sheet to review past entries without entering full edit mode.

### 3. System Configuration (Manage)
Complete control over the tracking model without losing historical data.
- **Custom Habits:** Create boolean or numeric habits.
- **Archiving:** Habits and moments can be archived rather than deleted, preserving historical data while decluttering the daily view.
- **Joy Configuration:** Habits can be set to "Joy by default" (e.g., "Meditation" might always be joyful when done).

### 4. Data & Settings
- **Privacy First:** All data lives in `localStorage`.
- **Backup & Restore:** Full JSON export/import functionality for data portability.
- **Theming:** First-class Dark Mode support (Stone/Charcoal palette).
- **Factory Reset:** Option to wipe all data and return to a clean slate.

---

## User Journeys

### Journey 1: The Daily Reflection (Happy Path)
**Persona:** Alex, a user seeking a calm end-of-day ritual.

1.  **Open:** Alex opens Clarity on their phone. The date defaults to "Today".
2.  **Track:**
    *   Toggles "Exercise" to **Done**.
    *   Toggles "Reading" to **Done** and taps the flower icon to mark it as **Joyful**.
    *   Increments "Water" to 6 cups.
3.  **Capture:** Selects "Time in nature" from Moments. Realizes they also cooked a great dinner, so they tap "+ New moment", types "Cooking", and adds it instantly.
4.  **Reflect:** In the reflection box, Alex types: *"Felt more energetic today after the run."*
5.  **Save:** Taps "Save". The button transitions to "Day captured", and the app gently redirects to the History view.

### Journey 2: Reviewing Patterns
**Persona:** Sam, analyzing their month.

1.  **Navigate:** Sam taps "History" (or lands there after saving).
2.  **Scan:** They see the heatmap. Some days are blue (productive), some are amber (joyful), most are a blend.
3.  **Filter:** Sam wonders, *"How often have I actually been running?"* They tap "Frequency" to open the stats list, then tap "Running".
4.  **Visualize:** The heatmap updates. Only days with "Running" checked are lit up. Sam sees they run mostly on Tuesdays and Thursdays.
5.  **Detail:** They tap a specific bright cell from last week. A sheet slides up showing that on that day, they also had "Good sleep" and a "Creative breakthrough" moment, revealing a correlation.

### Journey 3: Adapting the System
**Persona:** Jordan, whose routine is changing.

1.  **Intent:** Jordan is stopping "Coffee" tracking and starting "Meditation".
2.  **Access:** From the Home or History page, Jordan taps "Settings" -> "Habits and moments".
3.  **Archive:** Finds "Coffee" (Numeric) and taps "Archive". It vanishes from the active list but remains in history.
4.  **Create:** Taps "+ Add habit".
    *   Selects "Boolean".
    *   Names it "Meditation".
    *   Sets "Joy by default" to true (because they love it).
    *   Taps "Add".
5.  **Verify:** Jordan returns to the Home screen. "Meditation" is now at the top of the list, ready for tonight.

### Journey 4: Data Safety & Migration
**Persona:** Casey, switching to a new phone.

1.  **Export:** On the old phone, Casey goes to "Settings".
2.  **Backup:** Scrolls to "Your data" and taps "Export backup". A `clarity_backup_[date].json` file is saved to their device.
3.  **Transfer:** Casey sends this file to their new phone.
4.  **Import:** On the new phone, Casey opens Clarity, goes to "Settings", and taps "Choose file".
5.  **Restore:** Selects the JSON file. The app confirms: *"342 entries imported"*.
6.  **Success:** Casey goes to "History" and sees their entire year's grid instantly populated.

---

## Technical Specifications
- **Stack:** Next.js 16 (App Router), React 19, TypeScript.
- **Styling:** Tailwind CSS v4, Framer Motion for fluid transitions.
- **Storage:** Client-side `localStorage` (Offline capable).
- **Design System:** Custom "Calma" language (Typography-driven, Stone/Amber palette).
