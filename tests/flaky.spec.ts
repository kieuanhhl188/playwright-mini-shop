import { test, expect } from '@playwright/test';

/*
 * This file demonstrates a "before → after" refactor of a flaky test.
 *
 * Original (flaky) version:
 *   await page.waitForTimeout(3000);
 *   await page.locator('//div[2]/button[1]').click();
 *   const ok = await page.locator('.msg').nth(0).isVisible();
 *   expect(ok).toBe(true);
 *
 * Why the refactored version is more stable:
 * 1. Removed `waitForTimeout(3000)` — `.click()` and `expect().toBeVisible()`
 *    auto-wait and retry, so no arbitrary sleeps that flake when the app is slow.
 * 2. Replaced brittle positional XPath (`//div[2]/button[1]`) and CSS `.nth(0)`
 *    with intent-based locators that survive DOM/layout changes.
 * 3. Swapped the one-shot `isVisible()` boolean check for the web-first
 *    `expect(locator).toBeVisible()`, which polls until visible instead of
 *    reading the DOM at a single instant.
 */

// Skipped: this is a pattern demonstration only — there is no real target
// application with a generic "Submit" button, and the test never navigates
// anywhere (no page.goto), so it can never pass. In a real project you would
// add `await page.goto('<app-url>')` as the first step.
test.skip('shows the confirmation message after submitting', async ({ page }) => {
  // Demonstration of the refactored pattern — skipped because there is no real
  // target application. In a real project, add: await page.goto('<app-url>');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('status')).toBeVisible();
});

// The same best practices applied to a real, runnable target (Mini Shop).
// Submitting the login form empty triggers the app's validation error, which
// we assert with a semantic, web-first visibility check.
//
// Note: this file exists to demonstrate the refactoring pattern. The empty-form
// scenario itself is now covered properly by N-01 in tests/login.spec.ts, via
// the LoginPage page object — treat that as the canonical test, not this one.
test('refactored pattern applied to Mini Shop login', async ({ page }) => {
  await page.goto('/'); // Uses the configured baseURL

  // Instead of a brittle positional XPath such as `//form/button[1]`,
  // use a semantic role locator.
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  // Instead of a one-shot boolean:
  //   const ok = await page.locator('.error').isVisible();
  //   expect(ok).toBe(true);
  // use the auto-retrying web-first assertion.
  await expect(
    page.getByText('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.')
  ).toBeVisible();
});
