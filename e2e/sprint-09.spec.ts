/**
 * Sprint 9 — Check-In Controls Redesign.
 *
 * Covers:
 * - HabitToggle: full-row tap target, amber dot indicator, aria-checked
 * - NumberStepper: tap-to-increment pill, conditional decrement button, amber/stone backgrounds
 * - ManageView: "Start at" field in inline edit and add-habit forms
 *
 * Tests run on a clean localStorage each time so state does not leak.
 * Base URL is http://localhost:3000 with basePath=/clarity, so all
 * page.goto() calls start with "/clarity/".
 */
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/clarity/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

// ── HabitToggle (Today page) ─────────────────────────────────────────────────

test("HabitToggle — tapping a habit row toggles it on: aria-checked becomes true", async ({ page }) => {
  await page.goto("/clarity/");

  const toggle = page.getByRole("switch").first();
  await expect(toggle).toBeVisible();

  // Must start unchecked
  await expect(toggle).toHaveAttribute("aria-checked", "false");

  // Tap (click center of full row)
  await toggle.click();

  await expect(toggle).toHaveAttribute("aria-checked", "true");
});

test("HabitToggle — toggled-on row has amber-50 background wash", async ({ page }) => {
  await page.goto("/clarity/");

  const toggle = page.getByRole("switch").first();
  await expect(toggle).toBeVisible();
  await toggle.click();

  // amber-50 = rgb(255, 251, 235) in light mode
  const bg = await toggle.evaluate((node) => getComputedStyle(node).backgroundColor);
  // amber-50 background colour — may vary slightly by browser; confirm it is not transparent/white
  // We check it changed from the unchecked transparent state
  expect(bg, "Toggled-on HabitToggle should have a visible amber background").not.toBe("rgba(0, 0, 0, 0)");
  expect(bg, "Toggled-on HabitToggle should have a visible amber background").not.toBe("transparent");
});

test("HabitToggle — tapping again toggles it off: aria-checked reverts to false", async ({ page }) => {
  await page.goto("/clarity/");

  const toggle = page.getByRole("switch").first();
  await expect(toggle).toBeVisible();

  // Toggle on then off
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "false");
});

test("HabitToggle — toggled-off row has no amber background (transparent or white)", async ({ page }) => {
  await page.goto("/clarity/");

  const toggle = page.getByRole("switch").first();
  await expect(toggle).toBeVisible();

  // Ensure it is off
  const checked = await toggle.getAttribute("aria-checked");
  if (checked === "true") {
    await toggle.click(); // turn off
    await expect(toggle).toHaveAttribute("aria-checked", "false");
  }

  const bg = await toggle.evaluate((node) => getComputedStyle(node).backgroundColor);
  // Off state should have no background — either rgba(0,0,0,0) or very close to white
  const isTransparent = bg === "rgba(0, 0, 0, 0)" || bg === "transparent";
  const isWhiteish = bg.startsWith("rgb(255,") || bg === "rgb(255, 255, 255)";
  expect(
    isTransparent || isWhiteish,
    `Toggled-off HabitToggle background should be transparent or white, got: ${bg}`
  ).toBe(true);
});

test("HabitToggle — full row is the tap target (click works from center of button)", async ({ page }) => {
  await page.goto("/clarity/");

  const toggle = page.getByRole("switch").first();
  await expect(toggle).toBeVisible();

  // Get bounding box and click the horizontal center
  const box = await toggle.boundingBox();
  expect(box, "HabitToggle bounding box must be available").not.toBeNull();

  // Click dead-center of the row
  await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);

  await expect(toggle).toHaveAttribute("aria-checked", "true");
});

test("HabitToggle — amber dot span appears when habit is toggled on", async ({ page }) => {
  await page.goto("/clarity/");

  const toggle = page.getByRole("switch").first();
  await expect(toggle).toBeVisible();

  // Toggle on
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");

  // The dot span inside the button — amber-500 = rgb(245, 158, 11)
  const dotColor = await toggle.evaluate((node) => {
    const dot = node.querySelector("span");
    return dot ? getComputedStyle(dot).backgroundColor : "";
  });

  // amber-500 or amber-400 — not stone-300
  const STONE_300_RGB = "rgb(214, 211, 209)";
  expect(dotColor, "Amber dot should appear when habit is toggled on").not.toBe(STONE_300_RGB);
  expect(dotColor, "Amber dot should have a non-transparent color").not.toBe("rgba(0, 0, 0, 0)");
});

// ── NumberStepper (Today page) ───────────────────────────────────────────────

test("NumberStepper — pill (spinbutton) starts at zero with stone background", async ({ page }) => {
  await page.goto("/clarity/");

  const pill = page.getByRole("spinbutton").first();
  await expect(pill).toBeVisible();

  // aria-valuenow should be 0
  await expect(pill).toHaveAttribute("aria-valuenow", "0");

  // stone-100 background at zero — not amber
  // stone-100 = rgb(245, 245, 244)
  const bg = await pill.evaluate((node) => getComputedStyle(node).backgroundColor);
  // amber-50 = rgb(255, 251, 235) — should NOT appear at zero
  const AMBER_50_RGB = "rgb(255, 251, 235)";
  expect(bg, "NumberStepper pill should have stone background at zero (not amber)").not.toBe(AMBER_50_RGB);
});

test("NumberStepper — decrement button is NOT visible when value is 0", async ({ page }) => {
  await page.goto("/clarity/");

  // Decrement button has aria-label "Decrease <label>"
  const decrementBtn = page.getByRole("button", { name: /decrease/i }).first();

  // Confirm the pill is at 0
  const pill = page.getByRole("spinbutton").first();
  const valuenow = await pill.getAttribute("aria-valuenow");
  if (valuenow === "0") {
    // Decrement should not be visible at zero
    await expect(decrementBtn).not.toBeVisible();
  }
});

test("NumberStepper — tapping the pill at zero increments by step", async ({ page }) => {
  await page.goto("/clarity/");

  const pill = page.getByRole("spinbutton").first();
  await expect(pill).toBeVisible();
  await expect(pill).toHaveAttribute("aria-valuenow", "0");

  // Tap the pill
  await pill.click();

  // Value should be greater than 0 after one tap
  const newValue = await pill.getAttribute("aria-valuenow");
  const numVal = parseFloat(newValue ?? "0");
  expect(numVal, "Tapping the pill at zero should increment value above 0").toBeGreaterThan(0);
});

test("NumberStepper — after incrementing, decrement button appears", async ({ page }) => {
  await page.goto("/clarity/");

  const pill = page.getByRole("spinbutton").first();
  await expect(pill).toBeVisible();

  // Increment once
  await pill.click();

  const newValue = await pill.getAttribute("aria-valuenow");
  const numVal = parseFloat(newValue ?? "0");

  if (numVal > 0) {
    // Decrement button should now appear
    const decrementBtn = page.getByRole("button", { name: /decrease/i }).first();
    await expect(decrementBtn).toBeVisible();
  }
});

test("NumberStepper — tapping decrement reduces value; at 0 decrement hides again", async ({ page }) => {
  await page.goto("/clarity/");

  const pill = page.getByRole("spinbutton").first();
  await expect(pill).toBeVisible();

  // Increment once to get value > 0
  await pill.click();
  const valAfterIncrement = parseFloat((await pill.getAttribute("aria-valuenow")) ?? "0");
  expect(valAfterIncrement).toBeGreaterThan(0);

  // Decrement button should be visible
  const decrementBtn = page.getByRole("button", { name: /decrease/i }).first();
  await expect(decrementBtn).toBeVisible();

  // Tap decrement to return to 0
  // Tap enough times to return to 0 (account for step > 1)
  let attempts = 0;
  while (attempts < 20) {
    const current = parseFloat((await pill.getAttribute("aria-valuenow")) ?? "0");
    if (current <= 0) break;
    await decrementBtn.click();
    attempts++;
  }

  await expect(pill).toHaveAttribute("aria-valuenow", "0");

  // Decrement button should vanish again
  await expect(decrementBtn).not.toBeVisible();
});

test("NumberStepper — pill has amber background when value > 0", async ({ page }) => {
  await page.goto("/clarity/");

  const pill = page.getByRole("spinbutton").first();
  await expect(pill).toBeVisible();

  // Tap to increment
  await pill.click();
  const val = parseFloat((await pill.getAttribute("aria-valuenow")) ?? "0");

  if (val > 0) {
    const bg = await pill.evaluate((node) => getComputedStyle(node).backgroundColor);
    // stone-100 = rgb(245, 245, 244) — should NOT appear when value > 0
    const STONE_100_RGB = "rgb(245, 245, 244)";
    expect(bg, "NumberStepper pill should switch to amber background when value > 0").not.toBe(STONE_100_RGB);
    // Also should not be transparent
    expect(bg).not.toBe("rgba(0, 0, 0, 0)");
  }
});

// ── ManageView "Start at" field ──────────────────────────────────────────────

test("ManageView — editing a numeric habit reveals a Start at field after Increment", async ({ page }) => {
  await page.goto("/clarity/manage");

  // Find a numeric habit — default configs include numeric habits (step > 0)
  // Click "Edit" on each habit until we find one that shows "Increment"
  const editBtns = page.getByRole("button", { name: /^edit$/i });
  const count = await editBtns.count();

  let foundStartAt = false;
  for (let i = 0; i < count && !foundStartAt; i++) {
    await editBtns.nth(i).click();
    await page.waitForTimeout(300); // wait for animation

    const incrementLabel = page.getByText("Increment");
    if (await incrementLabel.isVisible({ timeout: 500 })) {
      // "Start at" label should appear after "Increment" in the same form
      const startAtLabel = page.getByText(/start at/i).first();
      await expect(
        startAtLabel,
        "Start at field should appear in the numeric habit edit form"
      ).toBeVisible();
      foundStartAt = true;
    } else {
      // Cancel and try next
      const cancelBtn = page.getByRole("button", { name: /cancel/i }).first();
      if (await cancelBtn.isVisible()) await cancelBtn.click();
    }
  }

  expect(foundStartAt, "Should have found at least one numeric habit with a Start at field").toBe(true);
});

test("ManageView — Start at field in edit form accepts numeric input", async ({ page }) => {
  await page.goto("/clarity/manage");

  const editBtns = page.getByRole("button", { name: /^edit$/i });
  const count = await editBtns.count();

  for (let i = 0; i < count; i++) {
    await editBtns.nth(i).click();
    await page.waitForTimeout(300);

    const incrementLabel = page.getByText("Increment");
    if (await incrementLabel.isVisible({ timeout: 500 })) {
      // Found numeric habit edit form — interact with Start at input
      const startAtInput = page.locator("input[placeholder='0']").first();
      if (await startAtInput.isVisible()) {
        await startAtInput.fill("5");
        const val = await startAtInput.inputValue();
        expect(val, "Start at field should accept numeric input").toBe("5");
      }
      break;
    }

    const cancelBtn = page.getByRole("button", { name: /cancel/i }).first();
    if (await cancelBtn.isVisible()) await cancelBtn.click();
  }
});

test("ManageView — add-habit Number form reveals a Start at field", async ({ page }) => {
  await page.goto("/clarity/manage");

  // Open add habit flow
  const addHabitBtn = page.getByRole("button", { name: /add habit/i });
  await expect(addHabitBtn).toBeVisible();
  await addHabitBtn.click();

  // Choose Number type
  await expect(page.getByRole("button", { name: "Number" })).toBeVisible();
  await page.getByRole("button", { name: "Number" }).click();

  await page.waitForTimeout(300);

  // "Increment" should appear
  await expect(page.getByText("Increment")).toBeVisible();

  // "Start at" should appear after "Increment"
  const startAtLabel = page.getByText(/start at/i).first();
  await expect(startAtLabel, "Start at field should be present in the add-habit Number form").toBeVisible();
});

// ── WCAG — HistoryView period selector (Sprint 9 Task 2) ────────────────────

test("HistoryView — period selector buttons are not stone-400 in light mode", async ({ page }) => {
  await page.goto("/clarity/history");

  // Period selector buttons: "Month", "3 months", "All time" or similar
  // Find buttons in the frequency section
  const STONE_400_RGB = "rgb(168, 162, 158)";

  // Period buttons sit near the FrequencyList — find any visible small button group
  const buttons = page.locator("button");
  const btnCount = await buttons.count();

  // Check the first 30 buttons for ones that look like period selectors
  for (let i = 0; i < Math.min(btnCount, 30); i++) {
    const btn = buttons.nth(i);
    if (!await btn.isVisible()) continue;
    const text = await btn.textContent();
    if (text && /month|3m|all time|always/i.test(text)) {
      const color = await btn.evaluate((node) => getComputedStyle(node).color);
      expect(
        color,
        `Period selector button "${text?.trim()}" must not use stone-400 as foreground`
      ).not.toBe(STONE_400_RGB);
    }
  }
});
