# Playwright Test Execution Report — Login

**Project:** Mini Shop — Playwright Automation
**Application under test:** https://seminar-shop-login.onrender.com
**Command:** `npx playwright test tests/login.spec.ts`
**Date:** 2026-08-03
**Scope:** Login suite only — see also `report/test-execution-report-2026-08-03.md`

## Change log

| Date | Change |
|------|--------|
| 2026-08-03 | Suite refactored to the Page Object Model (`pages/LoginPage.ts`) |
| 2026-08-03 | Negative coverage extended from 1 to 8 cases, plus 2 edge cases (2 → 12 scenarios) |

## Environment

| Item | Value |
|------|-------|
| Playwright | 1.61.1 |
| Node.js | v24.18.0 |
| OS | Windows 11 Pro 10.0.26200 |
| Browsers | Chromium, Firefox, WebKit |
| Projects | chromium / firefox / webkit |
| Workers | 6 |
| Retries | 0 (local) |
| Test timeout | 90s |
| Expect timeout | 15s |
| Navigation timeout | 120s (absorbs Render free-tier cold starts) |

## Test Suite

| Suite | Spec | Page Object | Test data | Browsers |
|-------|------|-------------|-----------|----------|
| Mini Shop — Login | `tests/login.spec.ts` | `pages/LoginPage.ts` | `fixtures/mini-shop-data.ts` | Chromium, Firefox, WebKit |

## Application behaviour under test

`POST /api/login` returns exactly two distinct error messages. Which one appears
is decided solely by whether both fields are non-empty — blank fields never reach
the credential comparison. Both branches are now covered.

| Message | Trigger |
|---------|---------|
| `Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.` | Either field left blank |
| `Tên đăng nhập hoặc mật khẩu không đúng.` | Both filled, but not matching the account |

## Test Data

| Account | Username | Password | Expected outcome |
|---------|----------|----------|------------------|
| Valid (sample account) | `standard_user` | `secret_sauce` | Login succeeds |

The application has **exactly one** account — the one printed on the form itself.
There is no `locked_out_user` or `problem_user`; scenarios borrowed from other
demo shops would pass for the wrong reason and were deliberately excluded.

## Test Cases

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

### Coverage by equivalence class

| Class | Cases | Expected result |
|-------|-------|-----------------|
| Valid credentials | #1, E-01, E-02 (retry) | Logged in — greeting, logout link, product grid |
| Missing credentials | N-01, N-02, N-03 | `Vui lòng nhập đầy đủ…`, stays on the form |
| Wrong credentials | #2, N-04, N-05, N-06, N-07, N-08 | `… không đúng.`, stays on the form |

### Design technique applied

| Technique | Where |
|-----------|-------|
| Equivalence partitioning | Missing vs wrong credentials; valid vs unknown username |
| Boundary value analysis | N-01 (0 characters), N-06 / N-08 (whitespace at the edges) |
| Decision table | N-02 / N-03 — the two single-blank-field combinations |
| State transition | E-02 — error state → successful login |

## Behaviour documented by the new cases

These three cases exist to pin down behaviour that is easy to "fix" by accident:

| Case | Documented behaviour |
|------|----------------------|
| N-06 | The app does **not** trim input — `"   "` counts as filled and falls through to the credential check |
| N-07 | The username is **case-sensitive** — `STANDARD_USER` is rejected |
| N-08 | Surrounding whitespace is **not** stripped — `"  standard_user  "` is rejected |

If someone later adds trimming or case-insensitive matching, these tests fail
immediately rather than the change slipping through unnoticed.

## Page Object — `pages/LoginPage.ts`

| Member | Locator strategy |
|--------|------------------|
| `usernameInput` | `getByRole('textbox', { name: 'standard_user', exact: true })` |
| `passwordInput` | `getByRole('textbox', { name: '••••••••', exact: true })` |
| `loginButton` | `getByRole('button', { name: 'Đăng nhập' })` |
| `featuredProductsHeading` | `getByRole('heading', { name: 'Sản phẩm nổi bật' })` |
| `errorMessage` | `getByTestId('error-message')` — the banner regardless of message |
| `invalidCredentialsError` | `getByText('Tên đăng nhập hoặc mật khẩu không đúng.')` |
| `logoutLink` | `getByText('Đăng xuất')` |
| `greeting(username)` | `getByText('Xin chào, ' + username)` — parameterised |

| Method | Purpose |
|--------|---------|
| `goto()` | Opens `baseURL` and waits for the form (auto-waiting locator, no sleep) |
| `login(username, password)` | Fills both fields and submits |
| `fillCredentials(username, password)` | Fills both fields without submitting |
| `submit()` | Clicks the login button |
| `submitWithEnter()` | Submits with the Enter key (used by E-01) |

Compliance with `CLAUDE.md`: TypeScript, Page Object Model, one page per file,
role-based locators where the DOM allows, no XPath, no `waitForTimeout()`, all
assertions via `expect()`, one scenario per test.

## Pass/Fail Summary

| Metric | Count |
|--------|-------|
| Total tests (12 cases × 3 browsers) | 36 |
| Passed | 36 |
| Failed | 0 |
| Skipped | 0 |
| Flaky | 0 |
| Retries consumed | 0 |
| **Pass rate** | **100%** |

### By Browser

| Browser | Tests | Passed | Failed |
|---------|-------|--------|--------|
| Chromium | 12 | 12 | 0 |
| Firefox | 12 | 12 | 0 |
| WebKit | 12 | 12 | 0 |

### By Type

| Type | Cases | Tests | Passed |
|------|-------|-------|--------|
| Positive | 1 | 3 | 3 |
| Negative | 9 | 27 | 27 |
| Edge | 2 | 6 | 6 |

## Execution Time

Suite run: `npx playwright test tests/login.spec.ts` — **36 passed in 37.0s**, 6 workers.

| ID | Test Case | Chromium | Firefox | WebKit |
|----|-----------|----------|---------|--------|
| — | Logs in successfully with valid credentials | 2.5s | 6.9s | 4.4s |
| — | Fails to log in with invalid credentials | 2.5s | 6.5s | 4.1s |
| N-01 | Rejects an empty form | 2.7s | 6.0s | 3.4s |
| N-02 | Rejects a username with no password | 2.6s | 8.0s | 3.1s |
| N-03 | Rejects a password with no username | 2.5s | 8.2s | 3.8s |
| N-04 | Rejects a valid username with the wrong password | 2.5s | 7.6s | 3.8s |
| N-05 | Rejects an unknown username with a valid password | 1.7s | 4.6s | 3.5s |
| N-06 | Treats whitespace-only input as filled, not blank | 2.1s | 3.8s | 3.2s |
| N-07 | Rejects a username in the wrong letter case | 2.1s | 4.8s | 2.8s |
| N-08 | Rejects a username padded with spaces | 1.5s | 4.2s | 3.3s |
| E-01 | Submits the form with the Enter key | 1.8s | 4.2s | 3.0s |
| E-02 | Recovers and logs in after a failed attempt | 2.1s | 5.5s | 4.0s |

Within the full-suite run (`npx playwright test`, 132 tests) the login suite also
passed 36/36.

## Observations and Residual Risks

1. **`getByLabel()` cannot be used on this application.** Verified against the
   live DOM: the two `<label>` elements have no `for` attribute and the inputs
   have no `id`, so `getByLabel('Tên đăng nhập')` and `getByLabel('Mật khẩu')`
   both return 0 matches. The placeholder supplies each field's accessible name,
   so `getByRole('textbox', { name })` is used instead. This is an accessibility
   gap in the application, not only a testing inconvenience.
2. **The app authenticates by username, not email.** There is no email field, so
   the reusable method is `login(username, password)`.
3. **The generic error message is correct security behaviour.** Wrong username
   and wrong password produce the identical message, so the form does not reveal
   which field was at fault. N-04 and N-05 lock this in.
4. **Injection-style input was checked manually, not automated.** `' OR 1=1 --`,
   `<script>alert(1)</script>` and a 500-character string were all rejected with
   the standard message, with no crash and no script execution. They fall in the
   same equivalence class as N-04, so automating them would add runtime without
   adding coverage. Revisit if the login backend ever gains real persistence.
5. **Login logic is still duplicated in `tests/cart.spec.ts`.** That spec has its
   own local `login()` helper (`tests/cart.spec.ts:13`). Folding it into
   `LoginPage` would remove the duplication but requires touching that file's
   assertions. Recommended follow-up.
6. **`tests/flaky.spec.ts:36` overlaps with N-01.** That file is a demonstration
   of a before/after locator refactor, kept for teaching value; a comment now
   marks N-01 as the canonical empty-form test. Delete the demo if the
   duplication is unwanted.
7. **Still not covered.** Password field masking (`type="password"`), session
   persistence across reload, logout returning to the form (partially covered by
   `cart.spec.ts` TC-28), rate limiting / brute-force protection (the app has
   none), and token handling — `POST /api/login` returns `{"token":"demo-token"}`
   which the UI ignores entirely.

## Result

✅ **All 36 login tests passed** on Chromium, Firefox and WebKit. No failures,
skips, flaky results or retries. Negative coverage grew from 1 case to 9, both
server-side validation branches are now exercised, and three previously
undocumented behaviours (no trimming, case sensitivity, no whitespace stripping)
are pinned down by tests.
