import { test, expect } from '@playwright/test';

const BASE_URL = 'https://seminar-shop-login.onrender.com/';

test.describe('Mini Shop — Login', () => {
  test('logs in successfully with valid credentials', async ({ page }) => {
    // Arrange: open the login page
    await page.goto(BASE_URL);

    // Act: enter valid credentials and submit
    await page.getByPlaceholder('standard_user').fill('standard_user');
    await page.getByPlaceholder('••••••••').fill('secret_sauce');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // Assert: user is logged in
    // 1) Greeting for the logged-in user is shown
    await expect(page.getByText('Xin chào, standard_user')).toBeVisible();
    // 2) Logout control is available
    await expect(page.getByText('Đăng xuất')).toBeVisible();
    // 3) The shop content (product list) is rendered
    await expect(
      page.getByRole('heading', { name: 'Sản phẩm nổi bật' })
    ).toBeVisible();
  });

  test('fails to log in with invalid credentials', async ({ page }) => {
    // Arrange: open the login page
    await page.goto(BASE_URL);

    // Act: enter invalid credentials and submit
    await page.getByPlaceholder('standard_user').fill('invalid_user');
    await page.getByPlaceholder('••••••••').fill('wrong_password');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // Assert: login is rejected
    // 1) Error message is shown
    await expect(
      page.getByText('Tên đăng nhập hoặc mật khẩu không đúng.')
    ).toBeVisible();
    // 2) User stays on the login form (login button still present)
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();
    // 3) User is NOT logged in (no greeting)
    await expect(page.getByText('Xin chào, invalid_user')).toHaveCount(0);
  });
});