import { expect, type Locator, type Page } from '@playwright/test';

/**
 * The TechStore top bar, present in every view.
 *
 * The app is a single-page React app with no routing (`/cart` returns a 404),
 * so these two buttons are the only way to move between views.
 */
export class HeaderComponent {
  /** "Sản phẩm" — returns to the product grid. */
  readonly shopButton: Locator;
  /** "🛒 Giỏ" — opens the cart. Its accessible name grows to "🛒 Giỏ 3" once
   *  items are added, so it is matched by substring rather than exactly. */
  readonly cartButton: Locator;
  /** Quantity badge. Not rendered at all while the cart is empty. */
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.shopButton = page.getByRole('button', { name: 'Sản phẩm' });
    this.cartButton = page.getByRole('button', { name: '🛒 Giỏ' });
    this.cartBadge = page.getByTestId('cart-count');
  }

  async goToShop(): Promise<void> {
    await this.shopButton.click();
  }

  async openCart(): Promise<void> {
    await this.cartButton.click();
  }

  /**
   * Asserts the badge for a given number of items.
   *
   * Encapsulates the app's quirk that an empty cart renders *no* badge element
   * rather than a badge reading "0", so no spec has to remember it.
   */
  async expectCartCount(expected: number): Promise<void> {
    if (expected === 0) {
      await expect(this.cartBadge).toHaveCount(0);
      return;
    }
    await expect(this.cartBadge).toHaveText(String(expected));
  }
}
