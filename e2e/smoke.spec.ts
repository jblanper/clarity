/**
 * Smoke tests — always-present baseline.
 * Verifies core page loads, navigation, and save flow without
 * depending on localStorage state (each test starts clean).
 */
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Clear localStorage between tests so state doesn't leak
  await page.goto("/clarity/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("Today page loads and renders the check-in form", async ({ page }) => {
  await page.goto("/clarity/");
  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Habits" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "By the numbers" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Moments" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Reflection" })).toBeVisible();
});

test("BottomNav is visible on Today and History pages", async ({ page }) => {
  await page.goto("/clarity/");
  await expect(page.getByRole("navigation")).toBeVisible();
  await expect(page.getByRole("link", { name: "Today" })).toBeVisible();
  await expect(page.getByRole("link", { name: "History" })).toBeVisible();

  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByRole("heading", { name: "History" })).toBeVisible();
  await expect(page.getByRole("navigation")).toBeVisible();
});

test("Settings page opens from Today and back navigation returns", async ({ page }) => {
  await page.goto("/clarity/");
  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  // BottomNav hidden on settings
  await expect(page.getByRole("navigation")).not.toBeVisible();
  // Back button returns to Today
  await page.getByRole("button", { name: "Go back" }).click();
  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
});

test("Settings page back-nav from History returns to History", async ({ page }) => {
  await page.goto("/clarity/history");
  // Set sessionStorage so settings knows to return here
  await page.evaluate(() => sessionStorage.setItem("settings-back", "/history"));
  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await page.getByRole("button", { name: "Go back" }).click();
  await expect(page.getByRole("heading", { name: "History" })).toBeVisible();
});

test("Theme toggle persists across reload", async ({ page }) => {
  await page.goto("/clarity/settings");
  await page.getByRole("button", { name: "Dark" }).click();
  // Wait for dark class to be applied to confirm the button worked
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
  // Verify localStorage was set (the persistence mechanism)
  const theme = await page.evaluate(() => localStorage.getItem("clarity-theme"));
  expect(theme).toBe("dark");
  // Reload and verify the preference survives a page load
  await page.reload();
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  const themeAfterReload = await page.evaluate(() => localStorage.getItem("clarity-theme"));
  expect(themeAfterReload).toBe("dark");
  // Reset to light
  await page.getByRole("button", { name: "Light" }).click();
});

test("Save flow: toggle a habit, save, see confirmation", async ({ page }) => {
  await page.goto("/clarity/");
  // Toggle the first habit switch (aria role="switch")
  const firstSwitch = page.getByRole("switch").first();
  await firstSwitch.click();
  await expect(firstSwitch).toHaveAttribute("aria-checked", "true");

  const saveButton = page.getByRole("button", { name: "Save" });
  await saveButton.click();
  // Should show "Saving..." then "Day captured"
  await expect(page.getByRole("button", { name: /Day captured/i })).toBeVisible({ timeout: 3000 });
});
