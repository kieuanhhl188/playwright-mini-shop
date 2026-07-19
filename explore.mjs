import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto('https://seminar-shop-login.onrender.com/');
await page.getByPlaceholder('standard_user').fill('standard_user');
await page.locator('input[type="password"]').fill('secret_sauce');
await page.getByRole('button', { name: 'Đăng nhập' }).click();
await page.waitForTimeout(2500);

console.log('===== PAGE TITLE =====');
console.log(await page.title());

console.log('\n===== VISIBLE TEXT (body innerText) =====');
console.log(await page.evaluate(() => document.body.innerText));

console.log('\n===== BUTTONS =====');
const buttons = await page.$$eval('button', els => els.map(e => ({ text: e.innerText.trim(), disabled: e.disabled, cls: e.className })));
console.log(JSON.stringify(buttons, null, 2));

console.log('\n===== INPUTS / SELECTS =====');
const inputs = await page.$$eval('input,select', els => els.map(e => ({ tag: e.tagName, type: e.type, value: e.value, min: e.min, max: e.max, ph: e.placeholder })));
console.log(JSON.stringify(inputs, null, 2));

console.log('\n===== PRODUCT CARDS (best-effort structural dump) =====');
const html = await page.evaluate(() => {
  // Grab the main region html, trimmed
  const main = document.querySelector('main') || document.body;
  return main.innerHTML;
});
console.log(html.slice(0, 6000));

await browser.close();