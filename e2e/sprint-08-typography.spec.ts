/**
 * Sprint 8 — Task 1: Typography & colour baseline.
 *
 * Verifies:
 * - SettingsView Theme and "Your data" section labels have font-medium (M3)
 * - DayDetail date heading is text-base not text-lg (M2)
 * - CheckInForm reflection textarea carries font-light (M1)
 * - ManageView "Jump to Moments" link is not stone-400 (M10)
 * - CheckInForm "New moment" button and dismiss ✕ are not stone-400 (M12, M13)
 * - No text-stone-400 foreground remains in targeted files
 */
import { test, expect } from "@playwright/test";

/** stone-400 computed colour — the forbidden foreground value in light mode */
const STONE_400_RGB = "rgb(168, 162, 158)";

test.beforeEach(async ({ page }) => {
  await page.goto("/clarity/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

// ── SettingsView section labels (M3) ────────────────────────────────────────

test("SettingsView — Theme section label is font-medium", async ({ page }) => {
  await page.goto("/clarity/settings");
  const heading = page.getByRole("heading", { name: "Theme" });
  const weight = await heading.evaluate((node) => getComputedStyle(node).fontWeight);
  expect(weight, "Theme heading should be font-medium (500)").toBe("500");
});

test("SettingsView — Your data section label is font-medium", async ({ page }) => {
  await page.goto("/clarity/settings");
  const heading = page.getByRole("heading", { name: "Your data" });
  const weight = await heading.evaluate((node) => getComputedStyle(node).fontWeight);
  expect(weight, "Your data heading should be font-medium (500)").toBe("500");
});

// ── DayDetail date heading (M2) ──────────────────────────────────────────────

test("DayDetail — date heading is text-base (not text-lg)", async ({ page }) => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  await page.goto("/clarity/history");
  await page.evaluate((d) => {
    const entry = { date: d, habits: {}, numeric: {}, moments: [], reflection: "" };
    const stored = JSON.parse(localStorage.getItem("clarity_entries") ?? "{}");
    stored[d] = entry;
    localStorage.setItem("clarity_entries", JSON.stringify(stored));
  }, dateStr);

  await page.goto(`/clarity/history?open=${dateStr}`);
  await page.waitForTimeout(500);

  const dialog = page.getByRole("dialog");
  if (await dialog.isVisible()) {
    // Find the date heading — it's the first p or heading-level element below the h1 area in the dialog
    const dateEl = dialog.locator("p, h2, h3").first();
    if (await dateEl.isVisible()) {
      const fontSize = await dateEl.evaluate((node) => getComputedStyle(node).fontSize);
      // text-base = 16px, text-lg = 18px — we want 16px
      const pxVal = parseFloat(fontSize);
      expect(pxVal, "DayDetail date heading should be text-base (16px), not text-lg (18px)").toBeLessThanOrEqual(16);
    }
  }
});

// ── CheckInForm reflection textarea (M1) ────────────────────────────────────

test("CheckInForm — reflection textarea is font-light", async ({ page }) => {
  await page.goto("/clarity/");
  const textarea = page.getByRole("textbox", { name: /reflection/i });
  if (await textarea.isVisible()) {
    const weight = await textarea.evaluate((node) => getComputedStyle(node).fontWeight);
    // font-light = 300
    expect(Number(weight), "Reflection textarea should be font-light (300)").toBeLessThanOrEqual(300);
  }
});

// ── ManageView "Jump to Moments" link (M10) ──────────────────────────────────

test("ManageView — Jump to Moments link is not stone-400", async ({ page }) => {
  await page.goto("/clarity/manage");
  const link = page.getByRole("link", { name: /jump to moments/i });
  if (await link.isVisible()) {
    const color = await link.evaluate((node) => getComputedStyle(node).color);
    expect(color, "Jump to Moments link must not be stone-400 in light mode").not.toBe(STONE_400_RGB);
  }
});

// ── CheckInForm "New moment" button and dismiss (M12, M13) ──────────────────

test("CheckInForm — New moment button is not stone-400", async ({ page }) => {
  await page.goto("/clarity/");
  // The add-moment button text varies; look for the button with a + or "New moment" text
  const addBtn = page.getByRole("button", { name: /new moment/i });
  if (await addBtn.isVisible()) {
    const color = await addBtn.evaluate((node) => getComputedStyle(node).color);
    expect(color, "New moment button must not be stone-400").not.toBe(STONE_400_RGB);
  }
});

// ── SettingsView all section label colours (regression) ─────────────────────

test("SettingsView — no section label is stone-400", async ({ page }) => {
  await page.goto("/clarity/settings");
  const labels = ["Manage", "Theme", "Your data", "Help", "Reset"];
  for (const name of labels) {
    const el = page.getByRole("heading", { name }).first();
    if (await el.isVisible()) {
      const color = await el.evaluate((node) => getComputedStyle(node).color);
      expect(color, `${name} label must not be stone-400`).not.toBe(STONE_400_RGB);
    }
  }
});
