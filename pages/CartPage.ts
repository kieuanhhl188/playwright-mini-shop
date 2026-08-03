import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { type Product } from '../fixtures/test-data';

/**
 * The cart view.
 *
 * Reached only through the header (the app has no routing), so `open()` clicks
 * the header button and waits for the panel instead of navigating by URL.
 *
 * Note: `cart-total` and the "Thanh toán" button are *absent* from the DOM
 * while the cart is empty — assert with `toHaveCount(0)`, not `toBeHidden()`.
 */
export class CartPage extends BasePage {
  readonly panel: Locator;
  readonly heading: Locator;
  readonly emptyMessage: Locator;
  /** Every cart line currently rendered. */
  readonly lineItems: Locator;
  readonly total: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.panel = page.getByTestId('cart-panel');
    this.heading = page.getByRole('heading', { name: 'Giỏ hàng', level: 2 });
    this.emptyMessage = page.getByText('Giỏ hàng trống. Hãy thêm sản phẩm.');
    this.lineItems = page.getByTestId(/^cart-item-\d+$/);
    this.total = page.getByTestId('cart-total');
    this.checkoutButton = page.getByRole('button', { name: 'Thanh toán' });
  }

  /** Opens the cart from the header and waits for the panel to render. */
  async open(): Promise<void> {
    await this.header.openCart();
    await this.panel.waitFor();
  }

  /** The cart line for a product — the scope for its quantity and controls. */
  lineItem(product: Product): Locator {
    return this.page.getByTestId(`cart-item-${product.id}`);
  }

  /** The quantity displayed on a product's line. */
  quantityOf(product: Product): Locator {
    return this.page.getByTestId(`qty-${product.id}`);
  }

  /** The "+" control on a product's line. */
  increaseButton(product: Product): Locator {
    return this.lineItem(product).getByRole('button', { name: '+', exact: true });
  }

  /** Increases a line's quantity, optionally several times in a row. */
  async increaseQuantity(product: Product, times = 1): Promise<void> {
    const button = this.increaseButton(product);
    for (let i = 0; i < times; i++) {
      await button.click();
    }
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
