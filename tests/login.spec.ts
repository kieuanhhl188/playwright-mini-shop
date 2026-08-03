import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LOGIN_ERRORS, VALID_CREDENTIALS } from '../fixtures/mini-shop-data';

test.describe('Mini Shop — Login', () => {
  test('logs in successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Arrange: open the login page
    await loginPage.goto(); // Uses the configured baseURL

    // Act: enter valid credentials and submit
    await loginPage.login('standard_user', 'secret_sauce');

    // Assert: user is logged in
    // 1) Greeting for the logged-in user is shown
    await expect(loginPage.greeting('standard_user')).toBeVisible();
    // 2) Logout control is available
    await expect(loginPage.logoutLink).toBeVisible();
    // 3) The shop content (product list) is rendered
    await expect(loginPage.featuredProductsHeading).toBeVisible();
  });

  test('fails to log in with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Arrange: open the login page
    await loginPage.goto(); // Uses the configured baseURL

    // Act: enter invalid credentials and submit
    await loginPage.login('invalid_user', 'wrong_password');

    // Assert: login is rejected
    // 1) Error message is shown
    await expect(loginPage.invalidCredentialsError).toBeVisible();
    // 2) User stays on the login form (login button still present)
    await expect(loginPage.loginButton).toBeVisible();
    // 3) User is NOT logged in (no greeting)
    await expect(loginPage.greeting('invalid_user')).toHaveCount(0);
  });

  /**
   * Blank fields never reach the credential check, so they produce a different
   * message from wrong credentials. This whole branch was previously untested
   * in this file.
   */
  test.describe('Missing credentials', () => {
    test('N-01 rejects an empty form', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      // Act: submit without typing anything.
      await loginPage.submit();

      await expect(loginPage.errorMessage).toHaveText(
        LOGIN_ERRORS.MISSING_CREDENTIALS
      );
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.featuredProductsHeading).toHaveCount(0);
    });

    test('N-02 rejects a username with no password', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      await loginPage.login(VALID_CREDENTIALS.username, '');

      await expect(loginPage.errorMessage).toHaveText(
        LOGIN_ERRORS.MISSING_CREDENTIALS
      );
      await expect(loginPage.featuredProductsHeading).toHaveCount(0);
    });

    test('N-03 rejects a password with no username', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      await loginPage.login('', VALID_CREDENTIALS.password);

      await expect(loginPage.errorMessage).toHaveText(
        LOGIN_ERRORS.MISSING_CREDENTIALS
      );
      await expect(loginPage.featuredProductsHeading).toHaveCount(0);
    });
  });

  /**
   * Both fields filled but not matching the single valid account. Every case
   * here returns the same generic message — the app deliberately does not
   * reveal which field was wrong.
   */
  test.describe('Wrong credentials', () => {
    test('N-04 rejects a valid username with the wrong password', async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      await loginPage.login(VALID_CREDENTIALS.username, 'wrong_password');

      await expect(loginPage.errorMessage).toHaveText(
        LOGIN_ERRORS.INVALID_CREDENTIALS
      );
      await expect(loginPage.featuredProductsHeading).toHaveCount(0);
    });

    test('N-05 rejects an unknown username with a valid password', async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      await loginPage.login('nobody', VALID_CREDENTIALS.password);

      await expect(loginPage.errorMessage).toHaveText(
        LOGIN_ERRORS.INVALID_CREDENTIALS
      );
      await expect(loginPage.featuredProductsHeading).toHaveCount(0);
    });

    test('N-06 treats whitespace-only input as filled, not blank', async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      await loginPage.login('   ', '   ');

      // Documents that the app does not trim: spaces satisfy the "filled"
      // check and fall through to the credential comparison.
      await expect(loginPage.errorMessage).toHaveText(
        LOGIN_ERRORS.INVALID_CREDENTIALS
      );
      await expect(loginPage.featuredProductsHeading).toHaveCount(0);
    });

    test('N-07 rejects a username in the wrong letter case', async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      // Documents that the username is case-sensitive.
      await loginPage.login(
        VALID_CREDENTIALS.username.toUpperCase(),
        VALID_CREDENTIALS.password
      );

      await expect(loginPage.errorMessage).toHaveText(
        LOGIN_ERRORS.INVALID_CREDENTIALS
      );
      await expect(loginPage.featuredProductsHeading).toHaveCount(0);
    });

    test('N-08 rejects a username padded with spaces', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      // Documents that surrounding whitespace is not stripped.
      await loginPage.login(
        `  ${VALID_CREDENTIALS.username}  `,
        VALID_CREDENTIALS.password
      );

      await expect(loginPage.errorMessage).toHaveText(
        LOGIN_ERRORS.INVALID_CREDENTIALS
      );
      await expect(loginPage.featuredProductsHeading).toHaveCount(0);
    });
  });

  test.describe('Edge cases', () => {
    test('E-01 submits the form with the Enter key', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      await loginPage.fillCredentials(
        VALID_CREDENTIALS.username,
        VALID_CREDENTIALS.password
      );
      await loginPage.submitWithEnter();

      await expect(
        loginPage.greeting(VALID_CREDENTIALS.username)
      ).toBeVisible();
      await expect(loginPage.featuredProductsHeading).toBeVisible();
    });

    test('E-02 recovers and logs in after a failed attempt', async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      // Arrange: fail once so the error banner is showing.
      await loginPage.login(VALID_CREDENTIALS.username, 'wrong_password');
      await expect(loginPage.errorMessage).toHaveText(
        LOGIN_ERRORS.INVALID_CREDENTIALS
      );

      // Act: retry with the correct password.
      await loginPage.login(
        VALID_CREDENTIALS.username,
        VALID_CREDENTIALS.password
      );

      // Assert: the stale error is cleared and the user gets in.
      await expect(loginPage.errorMessage).toHaveCount(0);
      await expect(
        loginPage.greeting(VALID_CREDENTIALS.username)
      ).toBeVisible();
      await expect(loginPage.featuredProductsHeading).toBeVisible();
    });
  });
});
