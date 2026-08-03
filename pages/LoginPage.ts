import { type Locator, type Page } from '@playwright/test';

/**
 * Mini Shop login screen (https://seminar-shop-login.onrender.com).
 *
 * Locator note: the form's `<label>` elements have no `for` attribute and the
 * inputs have no `id`, so `getByLabel()` matches nothing on this app. The
 * placeholder supplies each field's accessible name instead, which keeps the
 * role-based locators below working.
 */

/** Password placeholder (eight U+2022 bullets) — also its accessible name. */
const PASSWORD_PLACEHOLDER = '••••••••';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  /** Shown when the credentials are rejected. */
  readonly invalidCredentialsError: Locator;
  /**
   * The form's error banner, whatever message it currently carries. Preferred
   * over matching message text — assert the text with `toHaveText()` instead.
   */
  readonly errorMessage: Locator;

  /* Successful-login indicators. The app swaps the form for the shop in place,
   * so these live here alongside the flow that produces them. */
  readonly logoutLink: Locator;
  readonly featuredProductsHeading: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByRole('textbox', {
      name: 'standard_user',
      exact: true,
    });
    this.passwordInput = page.getByRole('textbox', {
      name: PASSWORD_PLACEHOLDER,
      exact: true,
    });
    this.loginButton = page.getByRole('button', { name: 'Đăng nhập' });
    this.invalidCredentialsError = page.getByText(
      'Tên đăng nhập hoặc mật khẩu không đúng.'
    );
    this.errorMessage = page.getByTestId('error-message');
    this.logoutLink = page.getByText('Đăng xuất');
    this.featuredProductsHeading = page.getByRole('heading', {
      name: 'Sản phẩm nổi bật',
    });
  }

  /** Opens the app at the configured `baseURL` and waits for the form. */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.loginButton.waitFor();
  }

  /**
   * Fills the credentials and submits the form.
   *
   * The Mini Shop authenticates by username (e.g. `standard_user`), not by
   * email address, so the first parameter is named accordingly.
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillCredentials(username, password);
    await this.submit();
  }

  /** Fills both fields without submitting. */
  async fillCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  /** Submits the form with the Enter key instead of clicking the button. */
  async submitWithEnter(): Promise<void> {
    await this.passwordInput.press('Enter');
  }

  /** Greeting shown to a logged-in user, e.g. "Xin chào, standard_user". */
  greeting(username: string): Locator {
    return this.page.getByText(`Xin chào, ${username}`);
  }
}
