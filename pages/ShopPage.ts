import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { type Product } from '../fixtures/test-data';

/**
 * The product grid — the entry point of the app ("shop" view).
 *
 * Products are fetched from `/api/products` after the first render, so
 * `goto()` waits for the grid to be populated before returning.
 */
export class ShopPage extends BasePage {
  readonly heading: Locator;
  /** Every product card currently rendered. */
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', {
      name: 'Thiết bị công nghệ',
      level: 2,
    });
    this.productCards = page.getByTestId(/^product-\d+$/);
  }

  /** Opens the app at the configured `baseURL` and waits until it is usable. */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitUntilReady();
  }

  /**
   * Waits until the shop view has rendered its products. Also used after a
   * reload. Auto-waiting locators only — no fixed delays.
   */
  async waitUntilReady(): Promise<void> {
    await this.heading.waitFor();
    await this.productCards.first().waitFor();
  }

  /** The card for a product — the scope for its name, price and add button. */
  productCard(product: Product): Locator {
    return this.page.getByTestId(`product-${product.id}`);
  }

  /**
   * The "Thêm vào giỏ" button of a product.
   *
   * All six buttons share the same accessible name, so the role locator is
   * scoped to the product's own card to keep it unambiguous.
   */
  addButton(product: Product): Locator {
    return this.productCard(product).getByRole('button', {
      name: 'Thêm vào giỏ',
      exact: true,
    });
  }

  /** Adds a product to the cart, optionally several times in a row. */
  async addProductToCart(product: Product, times = 1): Promise<void> {
    const button = this.addButton(product);
    for (let i = 0; i < times; i++) {
      await button.click();
    }
  }

  /** Adds one of each given product, in order. */
  async addProducts(products: readonly Product[]): Promise<void> {
    for (const product of products) {
      await this.addProductToCart(product);
    }
  }
}
