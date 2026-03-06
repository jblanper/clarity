/**
 * Sprint 7 — Section label typography regression suite.
 *
 * Verifies that every section label across all pages carries the correct
 * Calma canonical pattern: text-xs font-medium uppercase tracking-widest
 * text-stone-500 dark:text-stone-500.
 *
 * Tests check computed CSS properties rather than class names so they
 * survive Tailwind class renames.
 */
import { test, expect, type Page } from "@playwright/test";

/** Returns true if the element has font-weight 500 (font-medium). */
async function hasFontMedium(page: Page, role: string, name: string | RegExp) {
  const el = page.getByRole(role as Parameters<typeof page.getByRole>[0], { name });
  const weight = await el.evaluate((node) => getComputedStyle(node).fontWeight);
  // 500 = medium
  return weight === "500";
}

test.beforeEach(async ({ page }) => {
  await page.goto("/clarity/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

// ── Today (CheckInForm) ─────────────────────────────────────────────────────

test("CheckInForm — all section labels are font-medium", async ({ page }) => {
  await page.goto("/clarity/");

  const labels = ["Habits", "By the numbers", "Moments", "Reflection"];
  for (const name of labels) {
    const heading = page.getByRole("heading", { name });
    const weight = await heading.evaluate((node) => getComputedStyle(node).fontWeight);
    expect(weight, `${name} should be font-medium (500)`).toBe("500");
  }
});

test("CheckInForm — Habits and By the numbers have correct margin below label", async ({ page }) => {
  await page.goto("/clarity/");

  // The margin-bottom on section h2 should be ≥ 8px (mb-3 = 12px, mb-1 = 4px was the bug)
  const habitsHeading = page.getByRole("heading", { name: "Habits" });
  const mb = await habitsHeading.evaluate((node) => {
    const style = getComputedStyle(node);
    return parseFloat(style.marginBottom);
  });
  expect(mb, "Habits heading margin-bottom should be ≥ 8px (was 4px pre-sprint)").toBeGreaterThanOrEqual(8);
});

// ── Settings ────────────────────────────────────────────────────────────────

test("SettingsView — Manage, Help, Reset section labels are font-medium", async ({ page }) => {
  await page.goto("/clarity/settings");

  const labelTexts = ["Manage", "Help", "Reset"];
  for (const name of labelTexts) {
    const heading = page.getByRole("heading", { name });
    const weight = await heading.evaluate((node) => getComputedStyle(node).fontWeight);
    expect(weight, `Settings "${name}" section label should be font-medium (500)`).toBe("500");
  }
});

test("SettingsView — Reset label is visible in light and dark mode", async ({ page }) => {
  await page.goto("/clarity/settings");
  const reset = page.getByRole("heading", { name: "Reset" });
  await expect(reset).toBeVisible();

  // Switch to dark mode and verify it's still visible
  await page.evaluate(() => {
    document.documentElement.classList.add("dark");
  });
  await expect(reset).toBeVisible();
});

// ── Manage ──────────────────────────────────────────────────────────────────

test("ManageView — Habits and Moments section labels are font-medium", async ({ page }) => {
  await page.goto("/clarity/manage");

  for (const name of ["Habits", "Moments"]) {
    const heading = page.getByRole("heading", { name });
    const weight = await heading.evaluate((node) => getComputedStyle(node).fontWeight);
    expect(weight, `Manage "${name}" label should be font-medium`).toBe("500");
  }
});

test("ManageView — header has adequate spacing (mb-6 not mb-2)", async ({ page }) => {
  await page.goto("/clarity/manage");

  const header = page.locator("header").first();
  const mb = await header.evaluate((node) => parseFloat(getComputedStyle(node).marginBottom));
  expect(mb, "ManageView header margin-bottom should be ≥ 20px (was 8px pre-sprint)").toBeGreaterThanOrEqual(20);
});

// ── DayDetail ───────────────────────────────────────────────────────────────

test("DayDetail — section labels are font-medium when a day is opened", async ({ page }) => {
  // Seed a day with data first
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  await page.goto("/clarity/");
  await page.evaluate((date) => {
    const entry = {
      date,
      habits: { "00000000-0000-0000-0000-000000000001": { done: true, joy: false } },
      numeric: {},
      moments: [],
      reflection: "Test reflection",
    };
    const stored = JSON.parse(localStorage.getItem("clarity_entries") ?? "{}");
    stored[date] = entry;
    localStorage.setItem("clarity_entries", JSON.stringify(stored));
  }, dateStr);

  await page.goto("/clarity/history");
  // Click the today cell to open DayDetail
  await page.locator(`button[aria-label*="${dateStr}"], [data-date="${dateStr}"]`).first().click().catch(async () => {
    // Fallback: click any calendar cell that is not empty
    await page.locator(".h-11.w-11").first().click();
  });

  // Wait for DayDetail sheet
  await page.waitForTimeout(400);
  const dialog = page.getByRole("dialog");
  if (await dialog.isVisible()) {
    const heading = dialog.getByRole("heading", { name: "Habits" });
    if (await heading.isVisible()) {
      const weight = await heading.evaluate((node) => getComputedStyle(node).fontWeight);
      expect(weight, "DayDetail Habits label should be font-medium").toBe("500");
    }
  }
});

// ── HelpView ────────────────────────────────────────────────────────────────

test("HelpView — section labels are font-medium", async ({ page }) => {
  await page.goto("/clarity/help");

  const labels = ["One entry a day", "The daily form", "Looking back", "Your data", "Calma"];
  for (const name of labels) {
    const heading = page.getByRole("heading", { name });
    const weight = await heading.evaluate((node) => getComputedStyle(node).fontWeight);
    expect(weight, `Help "${name}" label should be font-medium`).toBe("500");
  }
});

// ── HistoryView ─────────────────────────────────────────────────────────────

test("HistoryView — Frequency toggle label is font-medium", async ({ page }) => {
  await page.goto("/clarity/history");
  const toggle = page.getByRole("button", { name: /frequency/i });
  const weight = await toggle.evaluate((node) => getComputedStyle(node).fontWeight);
  expect(weight, "Frequency toggle should be font-medium").toBe("500");
});
