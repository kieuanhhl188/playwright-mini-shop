import { test as base } from '@playwright/test';
import { ShopPage } from '../pages/ShopPage';
import { CartPage } from '../pages/CartPage';

type TechStoreFixtures = {
  shopPage: ShopPage;
  cartPage: CartPage;
};

/**
 * `test` with ready-constructed page objects, so specs never repeat
 * `new ShopPage(page)`. Both fixtures share the same `page`, and therefore the
 * same header and in-memory cart.
 */
export const test = base.extend<TechStoreFixtures>({
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';
