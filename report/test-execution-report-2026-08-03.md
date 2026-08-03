# Playwright Test Execution Report

**Project:** Playwright Automation — TechStore + Mini Shop
**Applications under test:**
- TechStore (Session 3) — https://seminar-shop-automation.onrender.com
- Mini Shop (Session 1) — https://seminar-shop-login.onrender.com

**Command:** `npx playwright test`
**Date:** 2026-08-03

## Environment

| Item | Value |
|------|-------|
| Playwright | 1.61.1 |
| Node.js | v24.18.0 |
| OS | Windows 11 Pro 10.0.26200 |
| Browsers | Chromium, Firefox, WebKit |
| Workers | 6 |
| Retries | 0 (local) |
| Reporter | list + HTML (`playwright-report/`) |
| Test timeout | 90s |
| Expect timeout | 15s |
| Navigation timeout | 120s (absorbs Render free-tier cold starts) |

## Test Suites

| Suite | File | Application | Projects |
|-------|------|-------------|----------|
| TechStore — Add product to cart | `tests/techstore/add-to-cart.spec.ts` | TechStore | techstore-chromium / -firefox / -webkit |
| Mini Shop — Add Product to Cart | `tests/cart.spec.ts` | Mini Shop | chromium / firefox / webkit |
| Mini Shop — Login | `tests/login.spec.ts` | Mini Shop | chromium / firefox / webkit |
| Flaky-test refactor demo | `tests/flaky.spec.ts` | Mini Shop | chromium / firefox / webkit |
| Playwright docs smoke | `tests/example.spec.ts` | playwright.dev | chromium / firefox / webkit |

## Test Cases — TechStore, Add Product to Cart

User story: *as a customer I want to add a product to my shopping cart, so that I can purchase it later.*

| # | ID | Type | Test Case | Chromium | Firefox | WebKit |
|---|----|------|-----------|----------|---------|--------|
| 1 | TC-01 | Positive | Shop lists every product with an enabled add-to-cart button | ✅ Pass | ✅ Pass | ✅ Pass |
| 2 | TC-02 | Negative | Cart is empty before anything is added | ✅ Pass | ✅ Pass | ✅ Pass |
| 3 | TC-03 | Positive | Adding one product creates a single cart line | ✅ Pass | ✅ Pass | ✅ Pass |
| 4 | TC-04 | Positive | Adding the same product twice increments its quantity | ✅ Pass | ✅ Pass | ✅ Pass |
| 5 | TC-05 | Positive | Adding three different products creates three cart lines | ✅ Pass | ✅ Pass | ✅ Pass |
| 6 | TC-06 | Positive | Badge increments on every add | ✅ Pass | ✅ Pass | ✅ Pass |
| 7 | TC-07 | Positive | Total is recalculated for mixed quantities | ✅ Pass | ✅ Pass | ✅ Pass |
| 8 | TC-08 | Boundary | Cheapest and most expensive products total correctly | ✅ Pass | ✅ Pass | ✅ Pass |
| 9 | TC-09 | Boundary | The whole catalogue can be added to the cart | ✅ Pass | ✅ Pass | ✅ Pass |
| 10 | TC-10 | Edge | Repeated adds accumulate with no quantity cap | ✅ Pass | ✅ Pass | ✅ Pass |
| 11 | TC-11 | Positive | Increasing the quantity inside the cart updates badge and totals | ✅ Pass | ✅ Pass | ✅ Pass |
| 12 | TC-12 | Edge | Navigating between shop and cart preserves the cart | ✅ Pass | ✅ Pass | ✅ Pass |
| 13 | TC-13 | Edge | Returning to the shop to add the same product again updates the line | ✅ Pass | ✅ Pass | ✅ Pass |
| 14 | TC-14 | Edge | Reloading the page clears the cart | ✅ Pass | ✅ Pass | ✅ Pass |
| 15 | TC-15 | Positive | Checkout becomes available once the cart is not empty | ✅ Pass | ✅ Pass | ✅ Pass |

## Test Cases — Mini Shop, Login (refactored to Page Object Model)

| # | ID | Type | Test Case | Chromium | Firefox | WebKit |
|---|----|------|-----------|----------|---------|--------|
| 1 | — | Positive | Logs in successfully with valid credentials | ✅ Pass | ✅ Pass | ✅ Pass |
| 2 | — | Negative | Fails to log in with invalid credentials | ✅ Pass | ✅ Pass | ✅ Pass |
| 3 | N-01 | Negative | Rejects an empty form | ✅ Pass | ✅ Pass | ✅ Pass |
| 4 | N-02 | Negative | Rejects a username with no password | ✅ Pass | ✅ Pass | ✅ Pass |
| 5 | N-03 | Negative | Rejects a password with no username | ✅ Pass | ✅ Pass | ✅ Pass |
| 6 | N-04 | Negative | Rejects a valid username with the wrong password | ✅ Pass | ✅ Pass | ✅ Pass |
| 7 | N-05 | Negative | Rejects an unknown username with a valid password | ✅ Pass | ✅ Pass | ✅ Pass |
| 8 | N-06 | Negative | Treats whitespace-only input as filled, not blank | ✅ Pass | ✅ Pass | ✅ Pass |
| 9 | N-07 | Negative | Rejects a username in the wrong letter case | ✅ Pass | ✅ Pass | ✅ Pass |
| 10 | N-08 | Negative | Rejects a username padded with spaces | ✅ Pass | ✅ Pass | ✅ Pass |
| 11 | E-01 | Edge | Submits the form with the Enter key | ✅ Pass | ✅ Pass | ✅ Pass |
| 12 | E-02 | Edge | Recovers and logs in after a failed attempt | ✅ Pass | ✅ Pass | ✅ Pass |

The two original scenarios keep all six of their assertions unchanged from before
the refactor; only the locators moved into `pages/LoginPage.ts`. Cases N-01 to E-02
were added afterwards to cover the previously untested "missing credentials"
validation branch.

> Detailed login report — steps, page-object locators, per-test timings and
> residual risks: [`report/login-report.md`](login-report.md).

## Test Cases — Mini Shop, Add Product to Cart (pre-existing)

| # | ID | Test Case | Chromium | Firefox | WebKit |
|---|----|-----------|----------|---------|--------|
| 1 | TC-02 | Adds a single product to an empty cart | ✅ Pass | ✅ Pass | ✅ Pass |
| 2 | TC-09 | Total recalculates with mixed quantities | ✅ Pass | ✅ Pass | ✅ Pass |
| 3 | TC-15 | Cannot add to cart when not authenticated | ✅ Pass | ✅ Pass | ✅ Pass |
| 4 | TC-06 | Adds multiple different products as separate lines | ✅ Pass | ✅ Pass | ✅ Pass |
| 5 | TC-08 | Cart badge increments on each add | ✅ Pass | ✅ Pass | ✅ Pass |
| 6 | TC-04 | Adding the same product twice increments the quantity | ✅ Pass | ✅ Pass | ✅ Pass |
| 7 | TC-17 | Empty cart shows the empty-state message | ✅ Pass | ✅ Pass | ✅ Pass |
| 8 | TC-22 | Rapid repeated adds accumulate with no cap | ✅ Pass | ✅ Pass | ✅ Pass |
| 9 | TC-23 | Removing a line item updates the cart | ✅ Pass | ✅ Pass | ✅ Pass |
| 10 | TC-25 | Removing the only item returns cart to empty state | ✅ Pass | ✅ Pass | ✅ Pass |
| 11 | TC-26 | Removing one of several items recalculates the total | ✅ Pass | ✅ Pass | ✅ Pass |
| 12 | TC-27 | Reloading the page clears the cart | ✅ Pass | ✅ Pass | ✅ Pass |
| 13 | TC-28 | Logging out clears the cart | ✅ Pass | ✅ Pass | ✅ Pass |

## Other Suites

| # | File | Test Case | Chromium | Firefox | WebKit |
|---|------|-----------|----------|---------|--------|
| 1 | `flaky.spec.ts` | Shows the confirmation message after submitting | ⏭ Skipped | ⏭ Skipped | ⏭ Skipped |
| 2 | `flaky.spec.ts` | Refactored pattern applied to Mini Shop login | ✅ Pass | ✅ Pass | ✅ Pass |
| 3 | `example.spec.ts` | Has title | ✅ Pass | ✅ Pass | ✅ Pass |
| 4 | `example.spec.ts` | Get started link | ✅ Pass | ✅ Pass | ✅ Pass |

The skipped test is marked `test.skip` by design — it demonstrates a locator
refactoring pattern and has no target application, so it can never pass.
See `tests/flaky.spec.ts:26`.

## Pass/Fail Summary

| Metric | Count |
|--------|-------|
| Total tests | 132 |
| Passed | 129 |
| Failed | 0 |
| Skipped (by design) | 3 |
| Flaky | 0 |
| Retries consumed | 0 |
| **Pass rate (excluding skips)** | **100%** |

### By Project

| Project | Application | Tests | Passed | Failed | Skipped |
|---------|-------------|-------|--------|--------|---------|
| techstore-chromium | TechStore | 15 | 15 | 0 | 0 |
| techstore-firefox | TechStore | 15 | 15 | 0 | 0 |
| techstore-webkit | TechStore | 15 | 15 | 0 | 0 |
| chromium | Mini Shop | 29 | 28 | 0 | 1 |
| firefox | Mini Shop | 29 | 28 | 0 | 1 |
| webkit | Mini Shop | 29 | 28 | 0 | 1 |
| **Total** | | **132** | **129** | **0** | **3** |

### By Suite

| Suite | Tests | Passed | Failed | Skipped |
|-------|-------|--------|--------|---------|
| TechStore — Add product to cart | 45 | 45 | 0 | 0 |
| Mini Shop — Add Product to Cart | 39 | 39 | 0 | 0 |
| Mini Shop — Login | 36 | 36 | 0 | 0 |
| Flaky-test refactor demo | 6 | 3 | 0 | 3 |
| Playwright docs smoke | 6 | 6 | 0 | 0 |

## Execution Time

| Run | Scope | Result | Duration |
|-----|-------|--------|----------|
| 1 | `--project=techstore-chromium` | 15 passed | 16.7s |
| 2 | `--project=techstore-firefox --project=techstore-webkit` | 30 passed | 40.9s |
| 3 | All three techstore projects | 45 passed | 46.4s |
| 4 | `--project=techstore-chromium --repeat-each=3` | 45 passed | 24.8s |
| 5 | `npx playwright test` (full suite, before login cases added) | 99 passed, 3 skipped | 2.4m |
| 6 | `tests/login.spec.ts --repeat-each=2` | 12 passed | 15.8s |
| 7 | `tests/login.spec.ts` (12 cases × 3 browsers) | 36 passed | 37.0s |
| 8 | **`npx playwright test` (full suite, final)** | **129 passed, 3 skipped** | **2.5m** |

Run 8 is the authoritative full-suite result. Runs 4 and 6 are stability checks:
repeating the TechStore suite three times and the login suite twice produced no
flaky results.

Per-test times dropped from ~10s to ~2-3s once the Render free-tier instances
were warm; the raised `navigationTimeout` absorbs the initial cold start without
any fixed sleep.

## Observations and Residual Risks

Not test failures, but findings worth tracking:

1. **`POST /api/checkout` accepts invalid line items (TechStore).** An unknown
   product id (`{id: 999}`) and a zero quantity (`{qty: 0}`) both return HTTP 200
   with `total: 0` instead of a validation error. Not covered by the add-to-cart
   story; should be raised as a defect against checkout.
2. **`orderId` is a shared, server-side counter.** Observed ORD-1001 → ORD-1005
   across runs, so it is nondeterministic under parallel execution. Any future
   checkout test must assert the pattern `/^ORD-\d+$/`, never a literal id.
3. **`getByLabel()` cannot be used on either application.** The `<label>`
   elements have no `for` attribute and the inputs have no `id`, so
   `getByLabel()` returns 0 matches. Tests use `getByRole('textbox', { name })`
   via the placeholder-derived accessible name. This is an accessibility gap in
   both apps, not only a testing inconvenience.
4. **No cart persistence.** Both apps hold the cart in memory only; reload
   clears it (TechStore TC-14, Mini Shop TC-27). Documented as current behaviour.
5. **Pre-existing TypeScript config gap.** The project has no `tsconfig.json`, so
   `process.env` in `playwright.config.ts` reports `Cannot find name 'process'`
   in the IDE. It does not affect execution — Playwright transpiles the config
   itself — and predates this work.

## Result

✅ **All 129 executable tests passed across all six projects. 0 failures, 0 flaky,
0 retries.** The 3 skipped tests are skipped by design. The new TechStore
add-to-cart suite, and the Mini Shop login suite after its Page-Object refactor
and negative-coverage extension, are all green on Chromium, Firefox and WebKit,
and remain green on repeat runs.
