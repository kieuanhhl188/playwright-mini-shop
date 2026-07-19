import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const log = (...a) => console.log(...a);

await page.goto('https://seminar-shop-login.onrender.com/');
await page.getByPlaceholder('standard_user').fill('standard_user');
await page.locator('input[type="password"]').fill('secret_sauce');
await page.getByRole('button', { name: 'Đăng nhập' }).click();
await page.waitForSelector('[data-testid="product-1"]');

const badge = async () => (await page.locator('[data-testid="cart-count"]').count()) ? await page.locator('[data-testid="cart-count"]').innerText() : '(no badge)';
const addBtn = id => page.locator(`[data-testid="add-to-cart-${id}"]`);

log('Initial badge:', await badge());

// Add product 1 once
await addBtn(1).click();
log('After 1x add p1 — badge:', await badge(), '| btn text:', await addBtn(1).innerText());

// Add product 1 again (increment)
await addBtn(1).click();
log('After 2x add p1 — badge:', await badge(), '| btn text:', await addBtn(1).innerText());

// Add product 3
await addBtn(3).click();
log('After add p3 — badge:', await badge());

// Open cart
await page.locator('[data-testid="cart-button"]').click();
await page.waitForTimeout(500);
log('Cart drawer text:\n' + await page.locator('[data-testid="cart-drawer"]').innerText());
log('Cart total:', await page.locator('[data-testid="cart-total"]').innerText());

// Remove product 1
await page.locator('[data-testid="remove-1"]').click();
await page.waitForTimeout(300);
log('After remove p1 — badge:', await badge());
log('Drawer text:\n' + await page.locator('[data-testid="cart-drawer"]').innerText());

// Close drawer via backdrop
await page.locator('.drawer-bg').click({ position: { x: 5, y: 5 } });
await page.waitForTimeout(300);
log('Drawer open class after backdrop click:', await page.locator('[data-testid="cart-drawer"]').getAttribute('class'));

// Reload -> check persistence
await page.reload();
await page.waitForTimeout(2000);
log('After RELOAD — is login shown?', await page.locator('[data-testid="login-button"]').count() > 0);
log('After RELOAD — badge:', await badge().catch(()=>'err'));

await browser.close();