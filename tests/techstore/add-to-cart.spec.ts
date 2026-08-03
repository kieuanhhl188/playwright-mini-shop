/**
 * User story: as a customer I want to add a product to my shopping cart,
 * so that I can purchase it later.
 *
 * Covers TC-01 … TC-15 of the approved add-to-cart automation plan.
 * Removing items, quantity decrement and checkout belong to other stories and
 * are deliberately not exercised here.
 *
 * The cart lives in React state only, so each test's fresh browser context is
 * all the isolation needed — there is no teardown.
 */
import { test, expect } from '../../fixtures/techstore';
import {
  ALL_PRODUCTS,
  CHEAPEST_PRODUCT,
  MOST_EXPENSIVE_PRODUCT,
  PRODUCTS,
  expectedCartCount,
  expectedLineTotal,
  expectedTotal,
  formatVnd,
  type CartLine,
} from '../../fixtures/test-data';

test.describe('TechStore — Add product to cart', () => {
  test('TC-01 shop lists every product with an enabled add-to-cart button', async ({
    shopPage,
  }) => {
    await shopPage.goto();

    await expect(shopPage.heading).toBeVisible();
    await expect(shopPage.productCards).toHaveCount(ALL_PRODUCTS.length);

    for (const product of ALL_PRODUCTS) {
      await expect(shopPage.productCard(product)).toContainText(product.name);
      await expect(shopPage.productCard(product)).toContainText(
        formatVnd(product.price)
      );
      await expect(shopPage.addButton(product)).toBeEnabled();
    }
  });

  test('TC-02 cart is empty before anything is added', async ({
    shopPage,
    cartPage,
  }) => {
    await shopPage.goto();

    // No badge is rendered at all while the cart is empty.
    await shopPage.header.expectCartCount(0);

    await cartPage.open();

    await expect(cartPage.emptyMessage).toBeVisible();
    await expect(cartPage.lineItems).toHaveCount(0);
    // Total and checkout are removed from the DOM, not merely hidden.
    await expect(cartPage.total).toHaveCount(0);
    await expect(cartPage.checkoutButton).toHaveCount(0);
  });

  test('TC-03 adding one product creates a single cart line', async ({
    shopPage,
    cartPage,
  }) => {
    const product = PRODUCTS.KEYBOARD;
    const lines: CartLine[] = [{ product, qty: 1 }];

    await shopPage.goto();

    await shopPage.addProductToCart(product);

    await shopPage.header.expectCartCount(1);

    await cartPage.open();

    await expect(cartPage.lineItems).toHaveCount(1);
    await expect(cartPage.lineItem(product)).toContainText(product.name);
    await expect(cartPage.quantityOf(product)).toHaveText('1');
    await expect(cartPage.lineItem(product)).toContainText(
      expectedLineTotal(product, 1)
    );
    await expect(cartPage.total).toHaveText(expectedTotal(lines));
  });

  test('TC-04 adding the same product twice increments its quantity', async ({
    shopPage,
    cartPage,
  }) => {
    const product = PRODUCTS.KEYBOARD;
    const lines: CartLine[] = [{ product, qty: 2 }];

    await shopPage.goto();

    await shopPage.addProductToCart(product, 2);

    await shopPage.header.expectCartCount(2);

    await cartPage.open();

    // One line with quantity 2 — not two lines of the same product.
    await expect(cartPage.lineItems).toHaveCount(1);
    await expect(cartPage.quantityOf(product)).toHaveText('2');
    await expect(cartPage.lineItem(product)).toContainText(
      expectedLineTotal(product, 2)
    );
    await expect(cartPage.total).toHaveText(expectedTotal(lines));
  });

  test('TC-05 adding three different products creates three cart lines', async ({
    shopPage,
    cartPage,
  }) => {
    const chosen = [PRODUCTS.KEYBOARD, PRODUCTS.MOUSE, PRODUCTS.HEADPHONES];
    const lines: CartLine[] = chosen.map((product) => ({ product, qty: 1 }));

    await shopPage.goto();

    await shopPage.addProducts(chosen);

    await shopPage.header.expectCartCount(chosen.length);

    await cartPage.open();

    await expect(cartPage.lineItems).toHaveCount(chosen.length);
    for (const product of chosen) {
      await expect(cartPage.lineItem(product)).toContainText(product.name);
      await expect(cartPage.quantityOf(product)).toHaveText('1');
    }
    // Products that were not added must not appear.
    await expect(cartPage.lineItem(PRODUCTS.MONITOR)).toHaveCount(0);
    await expect(cartPage.total).toHaveText(expectedTotal(lines));
  });

  test('TC-06 badge increments on every add', async ({ shopPage }) => {
    const product = PRODUCTS.HEADPHONES;

    await shopPage.goto();

    for (const expectedCount of [1, 2, 3]) {
      await shopPage.addProductToCart(product);
      await shopPage.header.expectCartCount(expectedCount);
    }
  });

  test('TC-07 total is recalculated for mixed quantities', async ({
    shopPage,
    cartPage,
  }) => {
    const lines: CartLine[] = [
      { product: PRODUCTS.KEYBOARD, qty: 2 },
      { product: PRODUCTS.HEADPHONES, qty: 1 },
    ];

    await shopPage.goto();

    for (const { product, qty } of lines) {
      await shopPage.addProductToCart(product, qty);
    }

    await shopPage.header.expectCartCount(expectedCartCount(lines));

    await cartPage.open();

    await expect(cartPage.lineItems).toHaveCount(lines.length);
    for (const { product, qty } of lines) {
      await expect(cartPage.quantityOf(product)).toHaveText(String(qty));
      await expect(cartPage.lineItem(product)).toContainText(
        expectedLineTotal(product, qty)
      );
    }
    // 2 × 1.290.000 + 890.000 = 3.470.000₫
    await expect(cartPage.total).toHaveText(expectedTotal(lines));
  });

  test('TC-08 cheapest and most expensive products total correctly', async ({
    shopPage,
    cartPage,
  }) => {
    const lines: CartLine[] = [
      { product: CHEAPEST_PRODUCT, qty: 1 },
      { product: MOST_EXPENSIVE_PRODUCT, qty: 1 },
    ];

    await shopPage.goto();

    await shopPage.addProducts([CHEAPEST_PRODUCT, MOST_EXPENSIVE_PRODUCT]);

    await cartPage.open();

    await expect(cartPage.lineItem(CHEAPEST_PRODUCT)).toContainText(
      expectedLineTotal(CHEAPEST_PRODUCT, 1)
    );
    await expect(cartPage.lineItem(MOST_EXPENSIVE_PRODUCT)).toContainText(
      expectedLineTotal(MOST_EXPENSIVE_PRODUCT, 1)
    );
    await expect(cartPage.total).toHaveText(expectedTotal(lines));
  });

  test('TC-09 the whole catalogue can be added to the cart', async ({
    shopPage,
    cartPage,
  }) => {
    const lines: CartLine[] = ALL_PRODUCTS.map((product) => ({
      product,
      qty: 1,
    }));

    await shopPage.goto();

    await shopPage.addProducts(ALL_PRODUCTS);

    await shopPage.header.expectCartCount(ALL_PRODUCTS.length);

    await cartPage.open();

    await expect(cartPage.lineItems).toHaveCount(ALL_PRODUCTS.length);
    await expect(cartPage.total).toHaveText(expectedTotal(lines));
  });

  test('TC-10 repeated adds accumulate with no quantity cap', async ({
    shopPage,
    cartPage,
  }) => {
    const product = CHEAPEST_PRODUCT;
    const qty = 10;

    await shopPage.goto();

    await shopPage.addProductToCart(product, qty);

    await shopPage.header.expectCartCount(qty);

    await cartPage.open();

    await expect(cartPage.lineItems).toHaveCount(1);
    await expect(cartPage.quantityOf(product)).toHaveText(String(qty));
    await expect(cartPage.total).toHaveText(expectedTotal([{ product, qty }]));
  });

  test('TC-11 increasing the quantity inside the cart updates badge and totals', async ({
    shopPage,
    cartPage,
  }) => {
    const product = PRODUCTS.MOUSE;

    await shopPage.goto();
    await shopPage.addProductToCart(product);
    await cartPage.open();
    await expect(cartPage.quantityOf(product)).toHaveText('1');

    await cartPage.increaseQuantity(product, 2);

    await expect(cartPage.quantityOf(product)).toHaveText('3');
    await shopPage.header.expectCartCount(3);
    await expect(cartPage.lineItems).toHaveCount(1);
    await expect(cartPage.lineItem(product)).toContainText(
      expectedLineTotal(product, 3)
    );
    await expect(cartPage.total).toHaveText(
      expectedTotal([{ product, qty: 3 }])
    );
  });

  test('TC-12 navigating between shop and cart preserves the cart', async ({
    shopPage,
    cartPage,
  }) => {
    const product = PRODUCTS.WEBCAM;

    await shopPage.goto();
    await shopPage.addProductToCart(product);

    // Bounce between the two views a few times.
    for (let i = 0; i < 3; i++) {
      await cartPage.open();
      await expect(cartPage.lineItem(product)).toBeVisible();

      await shopPage.header.goToShop();
      await expect(shopPage.heading).toBeVisible();
    }

    await shopPage.header.expectCartCount(1);

    await cartPage.open();

    await expect(cartPage.lineItems).toHaveCount(1);
    await expect(cartPage.quantityOf(product)).toHaveText('1');
    await expect(cartPage.total).toHaveText(
      expectedTotal([{ product, qty: 1 }])
    );
  });

  test('TC-13 returning to the shop to add the same product again updates the line', async ({
    shopPage,
    cartPage,
  }) => {
    const product = PRODUCTS.HEADPHONES;

    await shopPage.goto();
    await shopPage.addProductToCart(product);
    await cartPage.open();
    await expect(cartPage.quantityOf(product)).toHaveText('1');

    await shopPage.header.goToShop();
    await shopPage.addProductToCart(product);

    await cartPage.open();

    await expect(cartPage.lineItems).toHaveCount(1);
    await expect(cartPage.quantityOf(product)).toHaveText('2');
    await expect(cartPage.total).toHaveText(
      expectedTotal([{ product, qty: 2 }])
    );
  });

  test('TC-14 reloading the page clears the cart', async ({
    page,
    shopPage,
    cartPage,
  }) => {
    await shopPage.goto();
    await shopPage.addProductToCart(PRODUCTS.KEYBOARD);
    await shopPage.header.expectCartCount(1);

    // The cart is in-memory React state; nothing is persisted.
    await page.reload();
    await shopPage.waitUntilReady();

    await shopPage.header.expectCartCount(0);

    await cartPage.open();

    await expect(cartPage.emptyMessage).toBeVisible();
    await expect(cartPage.lineItems).toHaveCount(0);
  });

  test('TC-15 checkout becomes available once the cart is not empty', async ({
    shopPage,
    cartPage,
  }) => {
    await shopPage.goto();
    await cartPage.open();

    // Nothing to pay for yet, so the control does not exist.
    await expect(cartPage.checkoutButton).toHaveCount(0);

    await shopPage.header.goToShop();
    await shopPage.addProductToCart(PRODUCTS.MONITOR);
    await cartPage.open();

    await expect(cartPage.checkoutButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeEnabled();
  });
});
