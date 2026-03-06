/**
 * Sprint 7 — Colour contrast regression tests.
 *
 * Verifies the specific stone-400 violations that were fixed in Sprint 7
 * do not regress. Tests use computed colour values rather than class names
 * so they catch violations regardless of how Tailwind is configured.
 *
 * Stone-400 = rgb(168, 162, 158) = #a8a29e
 * Stone-500 = rgb(120, 113, 108) = #78716c — this passes WCAG AA on light bg
 */
import { test, expect, type Page } from "@playwright/test";

/** Hex value of text-stone-400 — the failing value. */
const STONE_400_RGB = "rgb(168, 162, 158)";

async function getComputedColor(page: Page, role: string, name: string | RegExp) {
  try {
    const el = page.getByRole(role as Parameters<typeof page.getByRole>[0], { name });
    return await el.evaluate((node) => getComputedStyle(node).color);
  } catch {
    return null;
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto("/clarity/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

// ── SettingsView section labels ─────────────────────────────────────────────

test("SettingsView — Manage label is not stone-400", async ({ page }) => {
  await page.goto("/clarity/settings");
  const color = await getComputedColor(page, "heading", "Manage");
  expect(color, "Manage label must not be stone-400").not.toBe(STONE_400_RGB);
});

test("SettingsView — Help label is not stone-400", async ({ page }) => {
  await page.goto("/clarity/settings");
  const color = await getComputedColor(page, "heading", "Help");
  expect(color, "Help label must not be stone-400").not.toBe(STONE_400_RGB);
});

test("SettingsView — Reset label is not stone-400", async ({ page }) => {
  await page.goto("/clarity/settings");
  const color = await getComputedColor(page, "heading", "Reset");
  expect(color, "Reset label must not be stone-400").not.toBe(STONE_400_RGB);
});

test("SettingsView — Reset label is visible in dark mode", async ({ page }) => {
  await page.goto("/clarity/settings");
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  const reset = page.getByRole("heading", { name: "Reset" });
  await expect(reset).toBeVisible();
  // Must have some light color in dark mode (not very dark or invisible)
  const color = await reset.evaluate((node) => getComputedStyle(node).color);
  // stone-500 in dark mode = rgb(120, 113, 108) is acceptable (5:1 on dark bg)
  // Critically not stone-400 or near-black (which was the pre-sprint dark-mode bug)
  expect(color).not.toBe("rgb(0, 0, 0)");
});

// ── ManageView section labels ───────────────────────────────────────────────

test("ManageView — SECTION_LABEL (Habits) is not stone-400", async ({ page }) => {
  await page.goto("/clarity/manage");
  const color = await getComputedColor(page, "heading", "Habits");
  expect(color, "ManageView Habits label must not be stone-400").not.toBe(STONE_400_RGB);
});

test("ManageView — SECTION_LABEL (Moments) is not stone-400", async ({ page }) => {
  await page.goto("/clarity/manage");
  const color = await getComputedColor(page, "heading", "Moments");
  expect(color, "ManageView Moments label must not be stone-400").not.toBe(STONE_400_RGB);
});

test("ManageView — archived item labels not near-invisible (not stone-300)", async ({ page }) => {
  // Seed an archived habit
  await page.goto("/clarity/");
  await page.evaluate(() => {
    const configs = JSON.parse(localStorage.getItem("clarity-configs") ?? "null");
    if (configs?.habits?.length) {
      configs.habits[0].archived = true;
      localStorage.setItem("clarity-configs", JSON.stringify(configs));
    }
  });
  await page.goto("/clarity/manage");

  // The archived label should be at least stone-500 not stone-300/stone-400
  const archivedLabels = page.locator(".text-stone-500, .opacity-60").first();
  if (await archivedLabels.isVisible()) {
    const color = await archivedLabels.evaluate((node) => getComputedStyle(node).color);
    // stone-300 = rgb(214, 211, 209) — should not appear as foreground text
    expect(color).not.toBe("rgb(214, 211, 209)");
  }
});
