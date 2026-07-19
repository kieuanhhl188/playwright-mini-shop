import { test, expect } from '@playwright/test';

test('shows the confirmation message after submitting', async ({ page }) => {
  // Refactored: user-facing locators + web-first assertions, no fixed waits.
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('status')).toBeVisible();
});

/*
 * await page.waitForTimeout(3000);
 * await page.locator('//div[2]/button[1]').click();
 * const ok = await page.locator('.msg').nth(0).isVisible();
 * expect(ok).toBe(true);
 * 
 * Why this version is more stable:
 * 1. Removed `waitForTimeout(3000)` — `.click()` and `expect().toBeVisible()`
 *    auto-wait and retry, so no arbitrary sleeps that flake when the app is slow.
 * 2. Replaced brittle positional XPath (`//div[2]/button[1]`) and CSS `.nth(0)`
 *    with intent-based locators that survive DOM/layout changes.
 * 3. Swapped the one-shot `isVisible()` boolean check for the web-first
 *    `expect(locator).toBeVisible()`, which polls until visible instead of
 *    reading the DOM at a single instant.
 */