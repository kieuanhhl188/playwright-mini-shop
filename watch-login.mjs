import { chromium, expect } from '@playwright/test';

// Headed Chrome with slow motion so each action is visible
const browser = await chromium.launch({ headless: false, slowMo: 1200 });
const page = await browser.newPage();

await page.goto('https://seminar-shop-login.onrender.com/');

await page.getByPlaceholder('standard_user').fill('standard_user');
await page.locator('input[type="password"]').fill('secret_sauce');
await page.getByRole('button', { name: 'Đăng nhập' }).click();

await expect(page.getByText('Xin chào, standard_user')).toBeVisible();
await expect(page.getByText('Đăng xuất')).toBeVisible();
await expect(page.getByRole('heading', { name: 'Sản phẩm nổi bật' })).toBeVisible();

console.log('✅ Login successful — pausing 6s so you can see the result...');
await page.waitForTimeout(6000);

await browser.close();
console.log('Done.');