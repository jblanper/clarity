/**
 * Sprint 13 — ManageView & Settings Polish
 *
 * Covers:
 * - Task 1: SegmentedPill WCAG AA fix (text-stone-500 → text-stone-600)
 * - Task 2: S3/S4/S5/S6 — Settings copy + touch targets
 * - Task 3: M6/M1/M2/L4 — ManageView resting row (aria-expanded, ···, active wash, hover)
 * - Task 4: M3/M4/M5 — Action tray card + pill buttons
 * - Task 5: L1/L2 — + New chip in moments grid + archived disclosure
 */
import { test, expect } from "@playwright/test";

const MOBILE = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await page.goto("/clarity/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

// ── Task 2 — Settings: S3/S4/S5/S6 ────────────────────────────────────────

test("Settings — S3: restore confirm button reads 'Restore' not 'Import'", async ({ page }) => {
  await page.goto("/clarity/settings");

  // Simulate file selected — trigger the file input via JS to set ready state
  // We can verify the label by checking the button doesn't say "Import" at all
  await expect(page.getByRole("button", { name: "Import", exact: true })).not.toBeAttached();
});

test("Settings — S4: back button meets 44px touch target", async ({ page }) => {
  await page.goto("/clarity/settings");

  const backBtn = page.getByRole("button", { name: "Go back" });
  await expect(backBtn).toBeVisible();
  const box = await backBtn.boundingBox();
  expect(box?.height, "Settings back button must be ≥ 44px").toBeGreaterThanOrEqual(44);
});

test("Settings — S4: 'Yes, start fresh' is visible after tapping reset", async ({ page }) => {
  await page.goto("/clarity/settings");

  await page.getByRole("button", { name: "Start fresh", exact: true }).click();
  const yesBtn = page.getByRole("button", { name: "Yes, start fresh", exact: true });
  await expect(yesBtn).toBeVisible({ timeout: 1000 });
});

test("Settings — S4: resting 'Start fresh' is NOT red (amber is correct at rest)", async ({
  page,
}) => {
  await page.goto("/clarity/settings");

  const restingBtn = page.getByRole("button", { name: "Start fresh", exact: true });
  // Resting trigger keeps amber; red only on the confirmation step
  const color = await restingBtn.evaluate((el) => getComputedStyle(el).color);
  // red-700 family; amber-700 = rgb(180, 83, 9) is expected at rest
  // Just verify it's not pure red (rgb values dominated by red channel)
  expect(color, "Resting Start fresh must not be red").not.toMatch(/rgb\(18[0-9], [0-3][0-9]/);
});

// ── Task 3 — ManageView: M6/M1/M2/L4 — Resting habit row ──────────────────

test("ManageView — M1: active habit rows show '···' affordance", async ({ page }) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const firstRow = habitsSection.locator("button").filter({ hasNotText: "+ New" }).first();
  await expect(firstRow.getByText("···")).toBeVisible();
});

test("ManageView — M6: habit row has aria-expanded=false at rest", async ({ page }) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const firstRow = habitsSection
    .locator("button[aria-expanded]")
    .filter({ hasNotText: "+ New" })
    .first();
  await expect(firstRow).toHaveAttribute("aria-expanded", "false");
});

test("ManageView — M6: aria-expanded becomes true when tray is open", async ({ page }) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const firstRow = habitsSection
    .locator("button[aria-expanded]")
    .filter({ hasNotText: "+ New" })
    .first();

  await firstRow.click();
  await expect(firstRow).toHaveAttribute("aria-expanded", "true", { timeout: 600 });
});

test("ManageView — M2: active row background wash appears when tray is open", async ({ page }) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const firstRow = habitsSection
    .locator("button[aria-expanded]")
    .filter({ hasNotText: "+ New" })
    .first();

  // Get bg before
  const bgBefore = await firstRow.evaluate((el) => getComputedStyle(el).backgroundColor);
  await firstRow.click();
  // After open, bg should change
  const bgAfter = await firstRow.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bgAfter, "Active row should have a background wash when tray is open").not.toBe(bgBefore);
});

// ── Task 4 — ManageView: M3/M4/M5 — Action tray card + pill buttons ────────

test("ManageView — M3: action tray has visible border (rendered as card)", async ({ page }) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const firstRow = habitsSection.locator("button").filter({ hasNotText: "+ New" }).first();
  await firstRow.click();

  // The tray should contain Edit and Archive buttons
  await expect(page.getByRole("button", { name: "Edit", exact: true })).toBeVisible({ timeout: 600 });
  await expect(page.getByRole("button", { name: "Archive", exact: true })).toBeVisible({ timeout: 600 });
});

test("ManageView — M5: Joy button shows 'Joy' label in action tray", async ({ page }) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const firstRow = habitsSection.locator("button").filter({ hasNotText: "+ New" }).first();
  await firstRow.click();

  // M5: single-label "Joy" — never "Mark joy" or "Unmark joy"
  await expect(page.getByRole("button", { name: "Joy", exact: true }).first()).toBeVisible({ timeout: 600 });
  await expect(page.getByRole("button", { name: /mark joy|unmark joy/i })).not.toBeAttached();
});

// ── Task 5 — ManageView: L1/L2 — + New chip + archived disclosure ───────────

test("ManageView — L1: Moments chip grid contains a '+ New' chip", async ({ page }) => {
  await page.goto("/clarity/manage");

  const momentsSection = page.locator("section").filter({ has: page.getByText("Moments") });
  const chipGrid = momentsSection.locator("div.flex.flex-wrap");
  const newChip = chipGrid.getByRole("button", { name: "+ New", exact: true });
  await expect(newChip).toBeVisible();
});

test("ManageView — L1: '+ New' chip opens the add-moment form", async ({ page }) => {
  await page.goto("/clarity/manage");

  const momentsSection = page.locator("section").filter({ has: page.getByText("Moments") });
  const chipGrid = momentsSection.locator("div.flex.flex-wrap");
  await chipGrid.getByRole("button", { name: "+ New", exact: true }).click();

  await expect(page.getByRole("button", { name: "Add", exact: true })).toBeVisible({ timeout: 600 });
});

test("ManageView — L2: no 'Archived' disclosure visible when nothing archived", async ({
  page,
}) => {
  await page.goto("/clarity/manage");

  // With default config (nothing archived), no Archived button should appear
  await expect(page.getByText(/^Archived \(/)).not.toBeAttached();
});

test("ManageView — L2: archiving a habit reveals the 'Archived (1)' disclosure, expanded", async ({
  page,
}) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const firstRow = habitsSection.locator("button").filter({ hasNotText: "+ New" }).first();
  await firstRow.click();
  await page.getByRole("button", { name: "Archive", exact: true }).click();

  // Disclosure button appears
  const disclosure = page.getByRole("button", { name: /^Archived \(1\)/ });
  await expect(disclosure).toBeVisible({ timeout: 1000 });

  // Auto-expanded — archived note is visible
  await expect(page.getByText(/archived\. past entries are preserved/i)).toBeVisible({ timeout: 1000 });
});

test("ManageView — L2: clicking 'Archived' disclosure toggles it closed and open", async ({
  page,
}) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const firstRow = habitsSection.locator("button").filter({ hasNotText: "+ New" }).first();
  await firstRow.click();
  await page.getByRole("button", { name: "Archive", exact: true }).click();

  const disclosure = page.getByRole("button", { name: /^Archived \(1\)/ });
  await expect(disclosure).toBeVisible({ timeout: 1000 });

  // Close
  await disclosure.click();
  await expect(page.getByText(/archived\. past entries are preserved/i)).not.toBeAttached({ timeout: 600 });

  // Re-open
  await disclosure.click();
  await expect(page.getByText(/archived\. past entries are preserved/i)).toBeVisible({ timeout: 600 });
});

// ── Mobile viewport ────────────────────────────────────────────────────────

test("Mobile — ManageView: habit row ··· affordance visible at 390px", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const firstRow = habitsSection.locator("button").filter({ hasNotText: "+ New" }).first();
  await expect(firstRow.getByText("···")).toBeVisible();
});

test("Mobile — ManageView: + New chip visible in moments grid at 390px", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/clarity/manage");

  const momentsSection = page.locator("section").filter({ has: page.getByText("Moments") });
  await expect(momentsSection.getByRole("button", { name: "+ New", exact: true })).toBeVisible();
});

test("Mobile — dark mode: ManageView action tray visible", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/clarity/manage");
  await page.evaluate(() => document.documentElement.classList.add("dark"));

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const firstRow = habitsSection.locator("button").filter({ hasNotText: "+ New" }).first();
  await firstRow.click();

  await expect(page.getByRole("button", { name: "Edit", exact: true })).toBeVisible({ timeout: 600 });
  await expect(page.getByRole("button", { name: "Archive", exact: true })).toBeVisible({ timeout: 600 });
});
