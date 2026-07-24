# Playwright Test Execution Report

**Project:** Mini Shop — Playwright Automation
**Application under test:** https://seminar-shop-login.onrender.com
**Command:** `npx playwright test tests/cart.spec.ts --reporter=html`
**Date:** 2026-07-20

## Test Suite

| Suite | File | Browsers |
|-------|------|----------|
| Mini Shop — Add Product to Cart | `tests/cart.spec.ts` | Chromium, Firefox, WebKit |

## Test Cases

| # | ID(s) | Type | Test Case | Chromium | Firefox | WebKit |
|---|-------|------|-----------|----------|---------|--------|
| 1 | TC-02 / TC-03 | Positive | Adds a single product to an empty cart | ✅ Pass | ✅ Pass | ✅ Pass |
| 2 | TC-09 | Positive | Total recalculates with mixed quantities | ✅ Pass | ✅ Pass | ✅ Pass |
| 3 | TC-15 | Negative | Cannot add to cart when not authenticated | ✅ Pass | ✅ Pass | ✅ Pass |
| 4 | TC-06 | Positive | Adds multiple different products as separate lines | ✅ Pass | ✅ Pass | ✅ Pass |
| 5 | TC-08 | Positive | Cart badge increments on each add | ✅ Pass | ✅ Pass | ✅ Pass |
| 6 | TC-17 | Negative | Empty cart shows the empty-state message | ✅ Pass | ✅ Pass | ✅ Pass |
| 7 | TC-22 | Edge | Rapid repeated adds accumulate with no cap | ✅ Pass | ✅ Pass | ✅ Pass |
| 8 | TC-23 | Edge | Removing a line item updates the cart | ✅ Pass | ✅ Pass | ✅ Pass |
| 9 | TC-25 | Edge | Removing the only item returns cart to empty state | ✅ Pass | ✅ Pass | ✅ Pass |
| 10 | TC-27 | Edge | Reloading the page clears the cart | ✅ Pass | ✅ Pass | ✅ Pass |

## Pass/Fail Summary

| Metric | Count |
|--------|-------|
| Total tests (10 cases × 3 browsers) | 30 |
| Passed | 30 |
| Failed | 0 |
| Skipped | 0 |
| Flaky | 0 |
| **Pass rate** | **100%** |

### By Browser

| Browser | Tests | Passed | Failed |
|---------|-------|--------|--------|
| Chromium | 10 | 10 | 0 |
| Firefox | 10 | 10 | 0 |
| WebKit | 10 | 10 | 0 |

## Execution Time

| Metric | Value |
|--------|-------|
| Total duration | 31.2s |
| Workers | 6 |
| Reporter | HTML (`playwright-report/`) |

## Result

✅ **All 30 tests passed.** No failures, skips, or flaky results detected across all three browsers.