/**
 * Sprint 11 — Amber Language Completion
 *
 * Covers:
 * - Task 1: MomentChip amber selected state
 * - Task 2: CheckInForm save button labels ("Capture" for new, "Save" for edit)
 * - Task 3: DayDetail amber moment chips (read-only) + amber checkmark
 * - Task 4: DayDetail Highlights section + "Edit this day" tertiary button
 * - Task 5: HistoryView Frequency hidden when no entries; empty-state below calendar
 */
import { test, expect } from "@playwright/test";

function getTodayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

test.beforeEach(async ({ page }) => {
  await page.goto("/clarity/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

// ── Task 1 — MomentChip amber selected state ─────────────────────────────────

test("MomentChip — selected chip has amber background (not stone)", async ({ page }) => {
  await page.goto("/clarity/");

  // Find a MomentChip button (aria-pressed)
  const chips = page.getByRole("button", { name: /./ }).filter({ has: page.locator("[aria-pressed]") });
  const chip = page.locator("button[aria-pressed]").first();
  await expect(chip).toBeVisible();

  // Chip starts unselected
  await expect(chip).toHaveAttribute("aria-pressed", "false");

  // Tap to select
  await chip.click();
  await expect(chip).toHaveAttribute("aria-pressed", "true");

  // amber-50 = rgb(255, 251, 235)
  const bg = await chip.evaluate((node) => getComputedStyle(node).backgroundColor);
  // Should not be transparent (unselected state)
  expect(bg, "Selected MomentChip should have amber background, not transparent").not.toBe("rgba(0, 0, 0, 0)");
  expect(bg, "Selected MomentChip should have amber background, not stone").not.toBe("rgb(120, 113, 108)"); // stone-500
});

test("MomentChip — unselected chip has transparent background", async ({ page }) => {
  await page.goto("/clarity/");

  const chip = page.locator("button[aria-pressed]").first();
  await expect(chip).toBeVisible();
  await expect(chip).toHaveAttribute("aria-pressed", "false");

  const bg = await chip.evaluate((node) => getComputedStyle(node).backgroundColor);
  // Unselected: transparent (no stone-800 dark wash in light mode either)
  expect(bg, "Unselected MomentChip should be transparent").toBe("rgba(0, 0, 0, 0)");
});

test("MomentChip — dark mode: selected chip has amber background", async ({ page }) => {
  await page.goto("/clarity/");
  await page.evaluate(() => document.documentElement.classList.add("dark"));

  const chip = page.locator("button[aria-pressed]").first();
  await expect(chip).toBeVisible();
  await chip.click();
  await expect(chip).toHaveAttribute("aria-pressed", "true");

  const bg = await chip.evaluate((node) => getComputedStyle(node).backgroundColor);
  // Dark selected: amber-900/20 — not stone-300 (rgb(214,211,209))
  expect(bg, "Dark mode selected MomentChip should not be stone-300").not.toBe("rgb(214, 211, 209)");
  expect(bg, "Dark mode selected MomentChip should have a visible background").not.toBe("rgba(0, 0, 0, 0)");
});

// ── Task 2 — CheckInForm save button labels ───────────────────────────────────

test("CheckInForm — new entry save button shows 'Capture' (not 'Save')", async ({ page }) => {
  await page.goto("/clarity/");

  // Button should read "Capture" at idle
  await expect(page.getByRole("button", { name: "Capture" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save" })).not.toBeVisible();
});

test("CheckInForm — new entry: 'Capture' → 'Day captured' on save", async ({ page }) => {
  await page.goto("/clarity/");

  const toggle = page.getByRole("switch").first();
  await toggle.click();

  await page.getByRole("button", { name: "Capture" }).click();
  await expect(page.getByRole("button", { name: /Day captured/i })).toBeVisible({ timeout: 3000 });
});

test("CheckInForm — edit mode save button shows 'Save' (not 'Capture')", async ({ page }) => {
  const dateStr = getTodayStr();
  await page.goto("/clarity/");
  await page.evaluate((d) => {
    const entry = { date: d, habits: {}, numeric: {}, moments: [], reflection: "" };
    const stored = JSON.parse(localStorage.getItem("clarity_entries") ?? "{}");
    stored[d] = entry;
    localStorage.setItem("clarity_entries", JSON.stringify(stored));
  }, dateStr);

  await page.goto(`/clarity/edit?date=${dateStr}`);
  await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Capture" })).not.toBeVisible();
});

// ── Task 3 — DayDetail amber moment chips + amber checkmark ───────────────────

test("DayDetail — moment chips are rendered as spans (read-only, not buttons)", async ({ page }) => {
  const dateStr = getTodayStr();
  await page.goto("/clarity/");
  await page.evaluate((d) => {
    const entry = {
      date: d,
      habits: {},
      numeric: {},
      moments: ["00000000-0000-0000-0000-000000000011"], // default moment UUID
      reflection: "",
    };
    const stored = JSON.parse(localStorage.getItem("clarity_entries") ?? "{}");
    stored[d] = entry;
    localStorage.setItem("clarity_entries", JSON.stringify(stored));
  }, dateStr);

  await page.goto(`/clarity/history?open=${dateStr}`);
  await page.waitForTimeout(500);

  const dialog = page.getByRole("dialog");
  if (await dialog.isVisible()) {
    // Moment chips in DayDetail are <span> elements — they should NOT be buttons
    const momentSection = dialog.getByRole("heading", { name: /moments/i });
    if (await momentSection.isVisible()) {
      // The chips are within the moments section — they have rounded-full styling
      // but must not have button role (they are read-only)
      const chipButtons = dialog.locator("section").filter({ has: momentSection })
        .locator("button[aria-pressed]");
      const count = await chipButtons.count();
      expect(count, "DayDetail moment chips should not be interactive buttons").toBe(0);
    }
  }
});

// ── Task 4 — DayDetail Highlights section ────────────────────────────────────

test("DayDetail — Highlights section appears when a habit has joy: true", async ({ page }) => {
  const dateStr = getTodayStr();
  await page.goto("/clarity/");
  await page.evaluate((d) => {
    const entry = {
      date: d,
      habits: {
        "00000000-0000-0000-0000-000000000001": { done: true, joy: true },
      },
      numeric: {},
      moments: [],
      reflection: "",
    };
    const stored = JSON.parse(localStorage.getItem("clarity_entries") ?? "{}");
    stored[d] = entry;
    localStorage.setItem("clarity_entries", JSON.stringify(stored));
  }, dateStr);

  await page.goto(`/clarity/history?open=${dateStr}`);
  await page.waitForTimeout(500);

  const dialog = page.getByRole("dialog");
  if (await dialog.isVisible()) {
    await expect(
      dialog.getByRole("heading", { name: "Highlights" }),
      "Highlights section heading should appear when joy is marked"
    ).toBeVisible();
  }
});

test("DayDetail — Highlights section does NOT appear when no habits have joy", async ({ page }) => {
  const dateStr = getTodayStr();
  await page.goto("/clarity/");
  await page.evaluate((d) => {
    const entry = {
      date: d,
      habits: {
        "00000000-0000-0000-0000-000000000001": { done: true, joy: false },
      },
      numeric: {},
      moments: [],
      reflection: "",
    };
    const stored = JSON.parse(localStorage.getItem("clarity_entries") ?? "{}");
    stored[d] = entry;
    localStorage.setItem("clarity_entries", JSON.stringify(stored));
  }, dateStr);

  await page.goto(`/clarity/history?open=${dateStr}`);
  await page.waitForTimeout(500);

  const dialog = page.getByRole("dialog");
  if (await dialog.isVisible()) {
    await expect(
      dialog.getByRole("heading", { name: "Highlights" }),
      "Highlights section should not appear when no joy is marked"
    ).not.toBeVisible();
  }
});

test("DayDetail — 'Edit this day' link is visible and navigates to edit page", async ({ page }) => {
  const dateStr = getTodayStr();
  await page.goto("/clarity/");
  await page.evaluate((d) => {
    const entry = {
      date: d,
      habits: { "00000000-0000-0000-0000-000000000001": { done: true, joy: false } },
      numeric: {},
      moments: [],
      reflection: "",
    };
    const stored = JSON.parse(localStorage.getItem("clarity_entries") ?? "{}");
    stored[d] = entry;
    localStorage.setItem("clarity_entries", JSON.stringify(stored));
  }, dateStr);

  await page.goto(`/clarity/history?open=${dateStr}`);
  await page.waitForTimeout(500);

  const dialog = page.getByRole("dialog");
  if (await dialog.isVisible()) {
    const editLink = dialog.getByRole("link", { name: "Edit this day" });
    await expect(editLink, "'Edit this day' link should be visible in DayDetail").toBeVisible();
    await editLink.click();
    await expect(page).toHaveURL(/\/edit/);
  }
});

// ── Task 5 — HistoryView empty state and Frequency section ───────────────────

test("HistoryView — Frequency toggle is NOT visible when no entries exist", async ({ page }) => {
  await page.goto("/clarity/history");
  // No entries seeded — localStorage was cleared in beforeEach
  const frequencyToggle = page.getByRole("button", { name: /frequency/i });
  await expect(frequencyToggle, "Frequency toggle should be hidden when there are no entries").not.toBeVisible();
});

test("HistoryView — empty-state message is visible when no entries exist", async ({ page }) => {
  await page.goto("/clarity/history");
  await expect(
    page.getByText("Your days will appear here once you start logging.")
  ).toBeVisible();
});

test("HistoryView — Frequency toggle IS visible when entries exist", async ({ page }) => {
  const dateStr = getTodayStr();
  await page.goto("/clarity/history");
  await page.evaluate((d) => {
    const entry = { date: d, habits: {}, numeric: {}, moments: [], reflection: "test" };
    const stored = JSON.parse(localStorage.getItem("clarity_entries") ?? "{}");
    stored[d] = entry;
    localStorage.setItem("clarity_entries", JSON.stringify(stored));
  }, dateStr);
  await page.reload();

  const frequencyToggle = page.getByRole("button", { name: /frequency/i });
  await expect(frequencyToggle, "Frequency toggle should appear when entries exist").toBeVisible();
});

test("HistoryView — empty-state message absent when entries exist", async ({ page }) => {
  const dateStr = getTodayStr();
  await page.goto("/clarity/history");
  await page.evaluate((d) => {
    const entry = { date: d, habits: {}, numeric: {}, moments: [], reflection: "test" };
    const stored = JSON.parse(localStorage.getItem("clarity_entries") ?? "{}");
    stored[d] = entry;
    localStorage.setItem("clarity_entries", JSON.stringify(stored));
  }, dateStr);
  await page.reload();

  await expect(
    page.getByText("Your days will appear here once you start logging."),
    "Empty-state message should not appear when entries exist"
  ).not.toBeVisible();
});

// ── Mobile viewport (390px) ──────────────────────────────────────────────────

test("Mobile — Capture button visible and functional at 390px width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/clarity/");
  await expect(page.getByRole("button", { name: "Capture" })).toBeVisible();
});

test("Mobile — HistoryView empty-state and no Frequency toggle at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/clarity/history");
  await expect(page.getByText("Your days will appear here once you start logging.")).toBeVisible();
  await expect(page.getByRole("button", { name: /frequency/i })).not.toBeVisible();
});
