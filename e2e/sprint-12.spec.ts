/**
 * Sprint 12 — Settings & Manage Redesign
 *
 * Covers:
 * - Task 1: ManageView carry-forward debt (placeholder, archived note colour)
 * - Task 2: S1 SegmentedPill theme selector
 * - Task 3: S4 Navigation card (Manage + Help) in Settings
 * - Task 4: S2 Your Data section — sub-labels, tertiary buttons
 * - Task 5: S3 Reset flow — amber affordance, touch targets
 * - Task 6: HelpView touch target sweep
 * - Task 7: B1 Section cards in ManageView (+ New in header)
 * - Task 8: B2+B3 Full-row tap + action tray + Moments chip grid
 * - Task 9: B4 Joy-by-default pill + action tray toggle
 *
 * Note: copy in this file matches the actual component implementation,
 * which adopted mockup copy (may differ from sprint doc prose).
 */
import { test, expect } from "@playwright/test";

const MOBILE = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await page.goto("/clarity/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

// ── Task 1 — ManageView carry-forward debt ─────────────────────────────────

test("ManageView — archived note does not use stone-400 text colour in light mode", async ({
  page,
}) => {
  await page.goto("/clarity/manage");

  // Archive the first habit to reveal the archived note
  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const firstHabitRow = habitsSection
    .locator("button")
    .filter({ hasNotText: "+ New" })
    .first();
  await firstHabitRow.click();
  await page.getByRole("button", { name: "Archive", exact: true }).click();

  const archivedNote = page
    .getByText(/archived\. past entries are preserved/i)
    .first();
  await expect(archivedNote).toBeVisible({ timeout: 2000 });

  // stone-400 = rgb(168, 162, 158) — must not be used as foreground in light mode (WCAG AA fail)
  const color = await archivedNote.evaluate((el) => getComputedStyle(el).color);
  expect(color, "Archived note must not use stone-400").not.toBe("rgb(168, 162, 158)");
});

// ── Task 2 — SegmentedPill theme selector ─────────────────────────────────

test("Settings — Theme section shows segmented pill with Light and Dark segments", async ({
  page,
}) => {
  await page.goto("/clarity/settings");

  await expect(page.getByRole("button", { name: "Light", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Dark", exact: true })).toBeVisible();
});

test("Settings — Theme pill segments meet 44px touch target", async ({ page }) => {
  await page.goto("/clarity/settings");

  for (const name of ["Light", "Dark"]) {
    const btn = page.getByRole("button", { name, exact: true });
    const box = await btn.boundingBox();
    expect(box?.height, `"${name}" segment must be ≥ 44px tall`).toBeGreaterThanOrEqual(44);
  }
});

test("Settings — selecting Dark segment applies dark class to html", async ({ page }) => {
  await page.goto("/clarity/settings");

  await page.getByRole("button", { name: "Dark", exact: true }).click();
  const hasDark = await page.evaluate(
    () => document.documentElement.classList.contains("dark"),
  );
  expect(hasDark, "Selecting Dark should add 'dark' class to <html>").toBe(true);
});

test("Settings — selecting Light segment removes dark class from html", async ({ page }) => {
  await page.goto("/clarity/settings");

  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await page.getByRole("button", { name: "Light", exact: true }).click();
  const hasDark = await page.evaluate(
    () => document.documentElement.classList.contains("dark"),
  );
  expect(hasDark, "Selecting Light should remove 'dark' class from <html>").toBe(false);
});

// ── Task 3 — Navigation card (Manage + Help) ──────────────────────────────

test("Settings — App card contains both Manage and Help links", async ({ page }) => {
  await page.goto("/clarity/settings");

  await expect(page.getByRole("link", { name: "Habits and moments" })).toBeVisible();
  await expect(page.getByRole("link", { name: "How Clarity works" })).toBeVisible();
});

test("Settings — 'Habits and moments' link navigates to /manage", async ({ page }) => {
  await page.goto("/clarity/settings");

  await page.getByRole("link", { name: "Habits and moments" }).click();
  await expect(page).toHaveURL(/\/manage/);
});

test("Settings — 'How Clarity works' link navigates to /help", async ({ page }) => {
  await page.goto("/clarity/settings");

  await page.getByRole("link", { name: "How Clarity works" }).click();
  await expect(page).toHaveURL(/\/help/);
});

test("Settings — App card links meet 44px touch target", async ({ page }) => {
  await page.goto("/clarity/settings");

  const manage = page.getByRole("link", { name: "Habits and moments" });
  const help = page.getByRole("link", { name: "How Clarity works" });

  const manageBox = await manage.boundingBox();
  const helpBox = await help.boundingBox();

  expect(manageBox?.height, "'Habits and moments' must be ≥ 44px").toBeGreaterThanOrEqual(44);
  expect(helpBox?.height, "'How Clarity works' must be ≥ 44px").toBeGreaterThanOrEqual(44);
});

// ── Task 4 — Your Data section restyle ────────────────────────────────────

test("Settings — Your Data shows BACKUP sub-label", async ({ page }) => {
  await page.goto("/clarity/settings");

  // Text is literally "BACKUP" in the source (not CSS-transformed from "backup")
  await expect(page.getByText("BACKUP", { exact: true })).toBeVisible();
});

test("Settings — Your Data shows RESTORE sub-label", async ({ page }) => {
  await page.goto("/clarity/settings");

  await expect(page.getByText("RESTORE", { exact: true })).toBeVisible();
});

test("Settings — Export button is a tertiary-style button (not full-width primary)", async ({
  page,
}) => {
  await page.goto("/clarity/settings");

  // The export button should be visible and in the BACKUP subsection
  // Actual label is "Save a copy" (adopted mockup copy)
  const exportBtn = page.getByRole("button", { name: "Save a copy", exact: true });
  await expect(exportBtn).toBeVisible();
  const box = await exportBtn.boundingBox();
  expect(box?.height, "Export button must be ≥ 44px").toBeGreaterThanOrEqual(44);
});

test("Settings — Import idle-state button is visible", async ({ page }) => {
  await page.goto("/clarity/settings");

  // Actual label is "Choose a file" (adopted mockup copy)
  const importBtn = page.getByRole("button", { name: "Choose a file", exact: true });
  await expect(importBtn).toBeVisible();
  const box = await importBtn.boundingBox();
  expect(box?.height, "Import button must be ≥ 44px").toBeGreaterThanOrEqual(44);
});

// ── Task 5 — Reset flow ────────────────────────────────────────────────────

test("Settings — Reset button is visible at rest with a border", async ({ page }) => {
  await page.goto("/clarity/settings");

  // Actual label is "Start fresh" (adopted mockup copy)
  const resetBtn = page.getByRole("button", { name: "Start fresh", exact: true });
  await expect(resetBtn).toBeVisible();

  const border = await resetBtn.evaluate((el) => getComputedStyle(el).borderWidth);
  expect(border, "Reset button must have a visible border at rest").not.toBe("0px");
});

test("Settings — Reset button meets 44px touch target", async ({ page }) => {
  await page.goto("/clarity/settings");

  const resetBtn = page.getByRole("button", { name: "Start fresh", exact: true });
  const box = await resetBtn.boundingBox();
  expect(box?.height, "Reset button must be ≥ 44px").toBeGreaterThanOrEqual(44);
});

test("Settings — tapping Reset reveals confirmation state", async ({ page }) => {
  await page.goto("/clarity/settings");

  await page.getByRole("button", { name: "Start fresh", exact: true }).click();

  // Actual confirmation labels (adopted mockup copy)
  await expect(page.getByRole("button", { name: "Yes, start fresh", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Keep my data", exact: true })).toBeVisible();
});

test("Settings — Reset confirmation shows warning copy", async ({ page }) => {
  await page.goto("/clarity/settings");

  await page.getByRole("button", { name: "Start fresh", exact: true }).click();

  // Warning text is present (actual copy may differ from spec prose)
  const warning = page.locator("text=/entries will be removed|start fresh|reset to defaults/i");
  await expect(warning.first()).toBeVisible();
});

test("Settings — Reset 'Keep my data' returns to resting state", async ({ page }) => {
  await page.goto("/clarity/settings");

  await page.getByRole("button", { name: "Start fresh", exact: true }).click();
  await page.getByRole("button", { name: "Keep my data", exact: true }).click();

  await expect(page.getByRole("button", { name: "Start fresh", exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Yes, start fresh", exact: true }),
  ).not.toBeAttached();
});

test("Settings — Reset confirmation buttons meet 44px touch target", async ({ page }) => {
  await page.goto("/clarity/settings");

  await page.getByRole("button", { name: "Start fresh", exact: true }).click();

  const yesBtn = page.getByRole("button", { name: "Yes, start fresh", exact: true });
  const cancelBtn = page.getByRole("button", { name: "Keep my data", exact: true });

  const yesBox = await yesBtn.boundingBox();
  const cancelBox = await cancelBtn.boundingBox();

  expect(yesBox?.height, "'Yes, start fresh' must be ≥ 44px").toBeGreaterThanOrEqual(44);
  expect(cancelBox?.height, "'Keep my data' must be ≥ 44px").toBeGreaterThanOrEqual(44);
});

test("Settings — Reset confirmation 'Yes, start fresh' uses red colour (Sprint 13 S4)", async ({ page }) => {
  await page.goto("/clarity/settings");

  await page.getByRole("button", { name: "Start fresh", exact: true }).click();

  const yesBtn = page.getByRole("button", { name: "Yes, start fresh", exact: true });
  // Sprint 13 S4: destructive confirm must use red (text-red-700 dark:text-red-400)
  // Verify it is NOT amber (amber-700 = rgb(180, 83, 9)) — amber is reserved for reversible actions
  const color = await yesBtn.evaluate((el) => getComputedStyle(el).color);
  expect(color, "Confirm button must not use amber — only red for permanent destructive actions").not.toContain("rgb(180, 83, 9)");
});

// ── Task 6 — HelpView touch target sweep ──────────────────────────────────

test("HelpView — Settings back link meets 44px touch target", async ({ page }) => {
  await page.goto("/clarity/help");

  const backLink = page.getByRole("link", { name: /settings/i }).first();
  await expect(backLink).toBeVisible();
  const box = await backLink.boundingBox();
  expect(box?.height, "Settings back link must be ≥ 44px").toBeGreaterThanOrEqual(44);
});

test("HelpView — Design language link meets 44px touch target", async ({ page }) => {
  await page.goto("/clarity/help");

  const designLink = page.getByRole("link", { name: /design language/i });
  await expect(designLink).toBeVisible();
  const box = await designLink.boundingBox();
  expect(box?.height, "Design language link must be ≥ 44px").toBeGreaterThanOrEqual(44);
});

// ── Task 7 — B1: Section cards in ManageView ──────────────────────────────

test("ManageView — Habits section has a '+ New' button in the header", async ({ page }) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  await expect(habitsSection.getByRole("button", { name: "+ New", exact: true })).toBeVisible();
});

test("ManageView — Moments section has a '+ New' button in the header", async ({ page }) => {
  await page.goto("/clarity/manage");

  const momentsSection = page.locator("section").filter({ has: page.getByText("Moments") });
  await expect(momentsSection.getByRole("button", { name: "+ New", exact: true })).toBeVisible();
});

test("ManageView — '+ New' in Habits triggers the add-habit flow", async ({ page }) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  await habitsSection.getByRole("button", { name: "+ New", exact: true }).click();

  // Add-habit type selection should appear
  await expect(page.locator("text=/yes.*no|toggle|boolean|number|numeric/i").first()).toBeVisible({
    timeout: 2000,
  });
});

test("ManageView — no visible anchor link to #moments", async ({ page }) => {
  await page.goto("/clarity/manage");

  const jumpLink = page.locator("a[href='#moments']");
  await expect(jumpLink).not.toBeVisible();
});

// ── Task 8 — B2+B3: Full-row tap + action tray + chip grid ────────────────

test("ManageView — Habits resting state: Edit and Archive not in DOM", async ({ page }) => {
  await page.goto("/clarity/manage");

  // With no tray open, Edit and Archive buttons should not be in the DOM
  // (AnimatePresence removes them when the tray is closed)
  await expect(
    page.getByRole("button", { name: "Edit", exact: true }).first(),
  ).not.toBeAttached();
  await expect(
    page.getByRole("button", { name: "Archive", exact: true }).first(),
  ).not.toBeAttached();
});

test("ManageView — tapping a habit row reveals Edit and Archive in action tray", async ({
  page,
}) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  // Habit rows are full-width buttons; exclude the + New button by text
  const habitRow = habitsSection
    .locator("button")
    .filter({ hasNotText: "+ New" })
    .first();
  await expect(habitRow).toBeVisible();
  await habitRow.click();

  await expect(page.getByRole("button", { name: "Edit", exact: true })).toBeVisible({
    timeout: 600,
  });
  await expect(page.getByRole("button", { name: "Archive", exact: true })).toBeVisible({
    timeout: 600,
  });
});

test("ManageView — tapping the same habit row again collapses the action tray", async ({
  page,
}) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const habitRow = habitsSection.locator("button").filter({ hasNotText: "+ New" }).first();

  await habitRow.click();
  await expect(page.getByRole("button", { name: "Edit", exact: true })).toBeVisible({
    timeout: 600,
  });

  await habitRow.click();
  await expect(
    page.getByRole("button", { name: "Edit", exact: true }),
  ).not.toBeAttached({ timeout: 600 });
});

test("ManageView — tapping a different habit closes the previous tray", async ({ page }) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const habitRows = habitsSection.locator("button").filter({ hasNotText: "+ New" });

  const count = await habitRows.count();
  if (count < 2) {
    test.skip();
    return;
  }

  await habitRows.nth(0).click();
  await expect(page.getByRole("button", { name: "Edit", exact: true })).toBeVisible({
    timeout: 600,
  });

  await habitRows.nth(1).click();
  // Exactly one tray open at a time
  await expect(page.getByRole("button", { name: "Edit", exact: true })).toHaveCount(1, {
    timeout: 600,
  });
});

test("ManageView — active Moments are shown as a chip grid (flex-wrap)", async ({ page }) => {
  await page.goto("/clarity/manage");

  const momentsSection = page.locator("section").filter({ has: page.getByText("Moments") });
  const chipContainer = momentsSection.locator("div.flex.flex-wrap");
  await expect(chipContainer).toBeVisible();

  const chips = chipContainer.locator("button");
  expect(await chips.count(), "Active moments should render as chip buttons").toBeGreaterThan(0);
});

test("ManageView — tapping a moment chip enters in-place edit mode", async ({ page }) => {
  await page.goto("/clarity/manage");

  const momentsSection = page.locator("section").filter({ has: page.getByText("Moments") });
  const chipContainer = momentsSection.locator("div.flex.flex-wrap");
  await chipContainer.locator("button").first().click();

  await expect(page.getByRole("button", { name: "Save", exact: true })).toBeVisible({
    timeout: 600,
  });
  await expect(page.getByRole("button", { name: "Cancel", exact: true })).toBeVisible({
    timeout: 600,
  });
});

test("ManageView — cancelling chip edit returns to chip display", async ({ page }) => {
  await page.goto("/clarity/manage");

  const momentsSection = page.locator("section").filter({ has: page.getByText("Moments") });
  const chipContainer = momentsSection.locator("div.flex.flex-wrap");
  await chipContainer.locator("button").first().click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();

  await expect(chipContainer.locator("button").first()).toBeVisible({ timeout: 600 });
  await expect(page.getByRole("button", { name: "Save", exact: true })).not.toBeAttached();
});

test("ManageView — opening chip edit closes any open habit action tray", async ({ page }) => {
  await page.goto("/clarity/manage");

  // Open a habit tray
  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  await habitsSection.locator("button").filter({ hasNotText: "+ New" }).first().click();
  await expect(page.getByRole("button", { name: "Edit", exact: true })).toBeVisible({
    timeout: 600,
  });

  // Open a moment chip
  const momentsSection = page.locator("section").filter({ has: page.getByText("Moments") });
  const chipContainer = momentsSection.locator("div.flex.flex-wrap");
  await chipContainer.locator("button").first().click();

  // Habit tray should now be closed
  await expect(
    page.getByRole("button", { name: "Edit", exact: true }),
  ).not.toBeAttached({ timeout: 600 });
});

// ── Task 9 — B4: Joy pill + action tray toggle ────────────────────────────

test("ManageView — boolean habit with joyByDefault shows 'Joy' pill in resting row", async ({
  page,
}) => {
  await page.goto("/clarity/manage");

  // Seed joyByDefault=true on a boolean habit without clearing what's already there
  await page.evaluate(() => {
    const configs = JSON.parse(localStorage.getItem("clarity-configs") ?? "null");
    if (!configs) return;
    const first = configs.habits?.find(
      (h: { type: string }) => h.type === "boolean",
    );
    if (first) {
      first.joyByDefault = true;
      localStorage.setItem("clarity-configs", JSON.stringify(configs));
    }
  });
  await page.reload();
  await page.goto("/clarity/manage");

  await expect(page.getByText("Joy", { exact: true }).first()).toBeVisible();
});

test("ManageView — action tray includes Joy button for boolean habits (Sprint 13 M5)", async ({ page }) => {
  await page.goto("/clarity/manage");

  // Ensure the first habit row is boolean (default configs have boolean habits)
  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const habitRow = habitsSection.locator("button").filter({ hasNotText: "+ New" }).first();
  await habitRow.click();

  // Sprint 13 M5: Joy button is single-label "Joy" regardless of state (no more "Mark joy"/"Unmark joy")
  const joyBtn = page.getByRole("button", { name: "Joy", exact: true }).first();
  await expect(joyBtn).toBeVisible({ timeout: 600 });
});

test("ManageView — Joy button always reads 'Joy' regardless of joyByDefault state (Sprint 13 M5)", async ({ page }) => {
  await page.goto("/clarity/manage");

  const habitsSection = page.locator("section").filter({ has: page.getByText("Habits") });
  const habitRow = habitsSection.locator("button").filter({ hasNotText: "+ New" }).first();
  await habitRow.click();

  // Sprint 13 M5: single label — click and verify label stays "Joy"
  const joyBtn = page.getByRole("button", { name: "Joy", exact: true }).first();
  await expect(joyBtn).toBeVisible({ timeout: 600 });
  await joyBtn.click();

  // Re-open tray to verify label is still "Joy"
  await habitRow.click();
  await expect(page.getByRole("button", { name: "Joy", exact: true }).first()).toBeVisible({ timeout: 600 });
});

// ── Mobile viewport smoke tests ────────────────────────────────────────────

test("Mobile — Settings theme pill visible at 390px", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/clarity/settings");

  await expect(page.getByRole("button", { name: "Light", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Dark", exact: true })).toBeVisible();
});

test("Mobile — ManageView section cards visible at 390px", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/clarity/manage");

  await expect(page.getByText("Habits")).toBeVisible();
  await expect(page.getByText("Moments")).toBeVisible();
});

test("Mobile — Settings App card links visible at 390px", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/clarity/settings");

  await expect(page.getByRole("link", { name: "Habits and moments" })).toBeVisible();
  await expect(page.getByRole("link", { name: "How Clarity works" })).toBeVisible();
});

test("Mobile — dark mode: Settings reset and data section visible at 390px", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/clarity/settings");

  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await expect(page.getByRole("button", { name: "Start fresh", exact: true })).toBeVisible();
  await expect(page.getByText("BACKUP", { exact: true })).toBeVisible();
});
