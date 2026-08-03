/**
 * TechStore catalogue and money helpers.
 *
 * Expected totals are always *computed* from this catalogue via `expectedTotal()`
 * so a price change needs a single edit here instead of hunting hard-coded
 * currency strings across the specs.
 */

export type Product = {
  readonly id: number;
  readonly name: string;
  readonly price: number;
};

export type CartLine = {
  readonly product: Product;
  readonly qty: number;
};

/** The six products served by `GET /api/products`. */
export const PRODUCTS = {
  KEYBOARD: { id: 1, name: 'Bàn phím cơ', price: 1_290_000 },
  MOUSE: { id: 2, name: 'Chuột không dây', price: 450_000 },
  HEADPHONES: { id: 3, name: 'Tai nghe', price: 890_000 },
  WEBCAM: { id: 4, name: 'Webcam HD', price: 720_000 },
  MONITOR: { id: 5, name: 'Màn hình 27"', price: 4_590_000 },
  DESK_LAMP: { id: 6, name: 'Đèn LED bàn', price: 260_000 },
} as const satisfies Record<string, Product>;

/** Whole catalogue, in the order the shop renders it. */
export const ALL_PRODUCTS: readonly Product[] = Object.values(PRODUCTS);

/** Cheapest / most expensive products — used for boundary-value scenarios. */
export const CHEAPEST_PRODUCT: Product = PRODUCTS.DESK_LAMP;
export const MOST_EXPENSIVE_PRODUCT: Product = PRODUCTS.MONITOR;

/**
 * Formats an amount exactly the way the app does
 * (`n.toLocaleString('vi-VN') + '₫'`), e.g. 1290000 -> "1.290.000₫".
 */
export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}₫`;
}

/** Formatted grand total for a set of cart lines. */
export function expectedTotal(lines: readonly CartLine[]): string {
  return formatVnd(
    lines.reduce((sum, line) => sum + line.product.price * line.qty, 0)
  );
}

/** Formatted total for a single cart line (price × qty). */
export function expectedLineTotal(product: Product, qty: number): string {
  return formatVnd(product.price * qty);
}

/** Sum of quantities — i.e. the number the header badge should show. */
export function expectedCartCount(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.qty, 0);
}
