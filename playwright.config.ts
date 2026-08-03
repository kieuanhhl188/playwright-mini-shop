import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/** TechStore (Session 3) — the app under test in tests/techstore. No login. */
const TECHSTORE_URL = 'https://seminar-shop-automation.onrender.com';
/** Mini Shop — the older login app the pre-existing specs target. */
const MINI_SHOP_URL = 'https://seminar-shop-login.onrender.com';

/** Splits the two suites, which run against different applications. */
const TECHSTORE_TESTS = /tests[\\/]techstore[\\/].*\.spec\.ts$/;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Both apps are hosted on Render's free tier, which cold-starts (30s+) on the
   * first request of a run. Generous timeouts absorb that instead of sleeps. */
  timeout: 90_000,
  expect: { timeout: 15_000 },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. Overridden per
     * project — see TECHSTORE_URL below. */
    baseURL: MINI_SHOP_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    navigationTimeout: 120_000,
  },

  /* Configure projects for major browsers */
  projects: [
    /* TechStore suite — tests/techstore/**. */
    {
      name: 'techstore-chromium',
      testMatch: TECHSTORE_TESTS,
      use: { ...devices['Desktop Chrome'], baseURL: TECHSTORE_URL },
    },

    {
      name: 'techstore-firefox',
      testMatch: TECHSTORE_TESTS,
      use: { ...devices['Desktop Firefox'], baseURL: TECHSTORE_URL },
    },

    {
      name: 'techstore-webkit',
      testMatch: TECHSTORE_TESTS,
      use: { ...devices['Desktop Safari'], baseURL: TECHSTORE_URL },
    },

    /* Mini Shop suite — the pre-existing specs, unchanged. */
    {
      name: 'chromium',
      testIgnore: TECHSTORE_TESTS,
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      testIgnore: TECHSTORE_TESTS,
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      testIgnore: TECHSTORE_TESTS,
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
