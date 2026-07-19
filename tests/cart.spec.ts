import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'https://seminar-shop-login.onrender.com/';

/**
 * Logs in with the sample account and waits until the shop is rendered.
 * Uses only user-facing locators.
 */
async function login(page: Page): Promise<void> {
  await page.goto(BASE_URL);
  await page.getByPlaceholder('standard_user').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  // Shop is ready once the greeting and product heading are visible.
  await expect(page.getByText('Xin chào, standard_user')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Sản phẩm nổi bật' })
  ).toBeVisible();
}

test.describe('Mini Shop — Add Product to Cart', () => {
  test('Positive: adds a single product to an empty cart', async ({ page }) => {
    await login(page);

    // Act: add "Áo thun Basic" (product 1) once.
    await page.getByTestId('add-to-cart-1').click();

    // Assert: badge count and button label update.
    await expect(page.getByTestId('cart-count')).toHaveText('1');
    await expect(page.getByTestId('add-to-cart-1')).toHaveText('Trong giỏ (1)');

    // Act: open the cart drawer.
    await page.getByTestId('cart-button').click();

    // Assert: the product line and correct total are shown.
    await expect(page.getByTestId('cart-item-1')).toBeVisible();
    await expect(page.getByTestId('cart-total')).toHaveText('199.000₫');
  });

  test('Positive: total recalculates with mixed quantities', async ({ page }) => {
    await login(page);

    // Act: add "Áo thun Basic" (199.000₫) twice and "Giày Sneaker" (899.000₫) once.
    await page.getByTestId('add-to-cart-1').click();
    await page.getByTestId('add-to-cart-1').click();
    await page.getByTestId('add-to-cart-3').click();

    // Assert: badge reflects the sum of all quantities (2 + 1 = 3).
    await expect(page.getByTestId('cart-count')).toHaveText('3');

    // Act: open the cart drawer.
    await page.getByTestId('cart-button').click();

    // Assert: exactly two distinct line items exist...
    await expect(page.getByTestId(/^cart-item-/)).toHaveCount(2);
    // ...and the grand total is 2×199.000 + 899.000 = 1.297.000₫.
    await expect(page.getByTestId('cart-total')).toHaveText('1.297.000₫');
  });

  test('Negative: cannot add to cart when not authenticated', async ({ page }) => {
    // Arrange: open the app without logging in.
    await page.goto(BASE_URL);

    // Assert: the login form is presented instead of the shop.
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();

    // Assert: no product add buttons and no cart control are reachable.
    await expect(page.getByTestId(/^add-to-cart-/)).toHaveCount(0);
    await expect(page.getByTestId('cart-button')).toHaveCount(0);
  });

  test('TC-06 Positive: adds multiple different products as separate lines', async ({ page }) => {
    await login(page);

    // Act: add Quần Jeans (2), Giày Sneaker (3) and Mũ lưỡi trai (4) once each.
    await page.getByTestId('add-to-cart-2').click();
    await page.getByTestId('add-to-cart-3').click();
    await page.getByTestId('add-to-cart-4').click();

    // Assert: badge equals the number of products added.
    await expect(page.getByTestId('cart-count')).toHaveText('3');

    // Act: open the cart drawer.
    await page.getByTestId('cart-button').click();

    // Assert: three distinct line items and the summed total.
    await expect(page.getByTestId(/^cart-item-/)).toHaveCount(3);
    // 499.000 + 899.000 + 149.000 = 1.547.000₫
    await expect(page.getByTestId('cart-total')).toHaveText('1.547.000₫');
  });

  test('TC-08 Positive: cart badge increments on each add', async ({ page }) => {
    await login(page);

    // Act + Assert: adding the same product updates the badge after every click.
    await page.getByTestId('add-to-cart-1').click();
    await expect(page.getByTestId('cart-count')).toHaveText('1');

    await page.getByTestId('add-to-cart-1').click();
    await expect(page.getByTestId('cart-count')).toHaveText('2');

    await page.getByTestId('add-to-cart-1').click();
    await expect(page.getByTestId('cart-count')).toHaveText('3');

    // Button reflects the accumulated quantity.
    await expect(page.getByTestId('add-to-cart-1')).toHaveText('Trong giỏ (3)');
  });

  test('TC-17 Negative: empty cart shows the empty-state message', async ({ page }) => {
    await login(page);

    // Act: open the cart without adding anything.
    await page.getByTestId('cart-button').click();

    // Assert: empty-state message is shown and no total is rendered.
    await expect(page.getByText('Giỏ hàng trống')).toBeVisible();
    await expect(page.getByTestId('cart-total')).toHaveCount(0);
    // No badge exists while the cart is empty.
    await expect(page.getByTestId('cart-count')).toHaveCount(0);
  });

  test('TC-22 Edge: rapid repeated adds accumulate with no cap', async ({ page }) => {
    await login(page);

    // Act: add "Kính râm" (6) ten times.
    for (let i = 0; i < 10; i++) {
      await page.getByTestId('add-to-cart-6').click();
    }

    // Assert: quantity reaches exactly 10 (no stock/max cap).
    await expect(page.getByTestId('cart-count')).toHaveText('10');
    await expect(page.getByTestId('add-to-cart-6')).toHaveText('Trong giỏ (10)');

    // Act: open the cart and verify the computed total.
    await page.getByTestId('cart-button').click();
    // 320.000 × 10 = 3.200.000₫
    await expect(page.getByTestId('cart-total')).toHaveText('3.200.000₫');
  });

  test('TC-23 Edge: removing a line item updates the cart', async ({ page }) => {
    await login(page);

    // Arrange: add "Balo du lịch" (5) and open the cart.
    await page.getByTestId('add-to-cart-5').click();
    await page.getByTestId('cart-button').click();
    await expect(page.getByTestId('cart-item-5')).toBeVisible();

    // Act: remove the line item.
    await page.getByTestId('remove-5').click();

    // Assert: line item is gone and the product button reverts.
    await expect(page.getByTestId('cart-item-5')).toHaveCount(0);
    await expect(page.getByTestId('add-to-cart-5')).toHaveText('Thêm vào giỏ');
    // Badge disappears once nothing remains.
    await expect(page.getByTestId('cart-count')).toHaveCount(0);
  });

  test('TC-25 Edge: removing the only item returns cart to empty state', async ({ page }) => {
    await login(page);

    // Arrange: add exactly one product and open the cart.
    await page.getByTestId('add-to-cart-1').click();
    await page.getByTestId('cart-button').click();
    await expect(page.getByTestId('cart-item-1')).toBeVisible();

    // Act: remove it.
    await page.getByTestId('remove-1').click();

    // Assert: empty-state message returns and the total row is removed.
    await expect(page.getByText('Giỏ hàng trống')).toBeVisible();
    await expect(page.getByTestId('cart-total')).toHaveCount(0);
  });

  test('TC-27 Edge: reloading the page clears the cart', async ({ page }) => {
    await login(page);

    // Arrange: add a product.
    await page.getByTestId('add-to-cart-1').click();
    await expect(page.getByTestId('cart-count')).toHaveText('1');

    // Act: reload the page — the in-memory session/cart is not persisted.
    await page.reload();

    // Assert: the login form is shown again (session ended).
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();

    // Act: log back in.
    await login(page);

    // Assert: the cart is empty after re-login.
    await expect(page.getByTestId('cart-count')).toHaveCount(0);
    await page.getByTestId('cart-button').click();
    await expect(page.getByText('Giỏ hàng trống')).toBeVisible();
  });
});