# Playwright E2E Test Suite

End-to-end UI test automation for [saucedemo.com](https://www.saucedemo.com) built with **Playwright**, **JavaScript**, the **Page Object Model**, custom **Playwright fixtures**, and **Allure** reporting. The suite runs in **GitHub Actions** on every push and pull request, with the Allure report published to **GitHub Pages**.

This repository is part of my QA Automation portfolio and demonstrates how to build a maintainable, cross-browser E2E suite that follows current Playwright best practices.

[![Playwright Tests](https://github.com/BogdanYushkov/Playwright-e2e-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/BogdanYushkov/Playwright-e2e-tests/actions/workflows/playwright.yml)

**Live Allure report:** https://bogdanyushkov.github.io/Playwright-e2e-tests/

---

## Tech stack

| Area | Tool |
| --- | --- |
| Test runner | Playwright Test (`@playwright/test`) |
| Language | JavaScript (Node.js 20) |
| Architecture | Page Object Model + custom fixtures + global setup |
| Reporting | Allure Report + Playwright HTML report |
| CI/CD | GitHub Actions (with Playwright-browser caching) |
| Report hosting | GitHub Pages (`gh-pages` branch, history preserved) |
| Browsers | Chromium, Firefox, WebKit |

---

## Architecture highlights

- **Page Object Model.** Every page (Login, Inventory, Cart, Checkout, HeaderMenu) is encapsulated in a class under `pages/`. Selectors and interaction logic live there; specs only describe behaviour.
- **Custom Playwright fixtures.** `fixtures/test.js` extends `@playwright/test` so every spec receives ready-to-use Page Object instances:
  ```js
  test('User can complete a purchase end-to-end', async ({ inventoryPage, cartPage, checkoutPage }) => { ... });
  ```
- **Global setup with `storageState`.** `global-setup.js` authenticates once at suite startup and saves the browser state to `.auth/user.json`. Authenticated specs reuse it through the `*-auth` projects in `playwright.config.js`, eliminating per-test UI logins.
- **Two project tiers per browser.** `*-auth` projects start each spec already signed in. `*-noauth` projects start from a clean state and own the login/logout specs.
- **Test data isolation.** `fixtures/data.js` is a single source of truth for users, products, checkout info and URLs.
- **`data-test` as the primary locator.** `playwright.config.js` sets `testIdAttribute: 'data-test'` so `page.getByTestId(...)` works with saucedemo's attributes — the most stable selector strategy.
- **Allure metadata helper.** `fixtures/allure.js` centralises the report taxonomy (Epic / Feature / Story / Severity / Suite / Tags) and exposes `applyLabels()` and `step()` so specs stay clean.

---

## Allure report taxonomy

Tests are organised so a recruiter or non-technical reviewer can navigate the report without reading any code.

```
Epic                ── "E-Commerce Storefront"
└── Feature         ── Authentication | Inventory | Cart | Checkout
    └── Story       ── Sign in | Sign out | Sort products | Cart persistence | Complete purchase | ...
        └── Test    ── business-readable title
            └── Step── named allure.step(...) blocks
```

Additional axes for filtering and navigation:

| Axis | Values |
| --- | --- |
| **Severity** | `blocker` (login, full checkout), `critical` (negative auth, cart persistence), `normal` (sorting, empty-cart guard), `minor` (footer links) |
| **Tags** | `@smoke`, `@sanity`, `@regression`, `@known-bug`, `@auth`, `@inventory`, `@cart`, `@checkout`, `@ui` |
| **Parameters** | `Browser` (chromium / firefox / webkit), `Auth state` (Authenticated / Unauthenticated) — attached automatically by `fixtures/test.js` |
| **Categories** | Known application bugs, Product defects, Test infrastructure, Flaky tests (configured in `playwright.config.js`) |

Filter examples:

```bash
npx playwright test --grep @smoke              # 4 critical-path tests
npx playwright test --grep "@auth|@cart"       # focused regression
npx playwright test --grep-invert @known-bug   # skip known bugs
```

---

## Project structure

```
.
├── .github/workflows/playwright.yml   GitHub Actions pipeline (with browser cache)
├── fixtures/
│   ├── allure.js                      Epic/Feature/Story/Severity vocabulary + helpers
│   ├── data.js                        Users, products, URLs, expected texts
│   └── test.js                        Custom test extended with POM fixtures + Browser params
├── pages/
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── HeaderMenu.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/
│   ├── auth/
│   │   ├── login.spec.js              valid + 2 negative login cases
│   │   └── logout.spec.js
│   ├── inventory/
│   │   ├── sorting.spec.js            4 sort options
│   │   └── footer-links.spec.js       href / target verification (no third-party nav)
│   ├── cart/
│   │   └── cart-persistence.spec.js   item survives logout / re-login
│   └── checkout/
│       ├── valid-checkout.spec.js     full happy path
│       └── empty-cart-checkout.spec.js  documents a known app bug via test.fail()
├── global-setup.js                    one-time authentication
├── playwright.config.js               projects, baseURL, testIdAttribute, allure options
└── package.json
```

---

## Test coverage

| Area | Spec | Cases | Severity |
| --- | --- | --- | --- |
| Authentication | `tests/auth/login.spec.js` | User can sign in / blocked by wrong password / blocked for unknown username | blocker, critical |
| Authentication | `tests/auth/logout.spec.js` | User can sign out and return to the sign-in screen | critical |
| Inventory | `tests/inventory/sorting.spec.js` | Sort A→Z, Z→A, cheapest→expensive, expensive→cheapest | normal |
| Inventory | `tests/inventory/footer-links.spec.js` | Twitter, Facebook, LinkedIn footer-link contracts | minor |
| Cart | `tests/cart/cart-persistence.spec.js` | Cart contents preserved after sign-out and sign-in | critical |
| Checkout | `tests/checkout/valid-checkout.spec.js` | User can complete a purchase end-to-end | blocker |
| Checkout | `tests/checkout/empty-cart-checkout.spec.js` | Empty-cart checkout guard — known bug (`test.fail()`) | normal |

**14 unique cases × 3 browsers = 42 tests in CI.**

---

## Running locally

### Prerequisites

- Node.js 20+
- (Optional, for Allure reports) Allure CLI: `npm install -g allure-commandline`

### Install

```bash
npm ci
npx playwright install --with-deps
```

### Run tests

```bash
# All browsers, all tests
npm test

# Single browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Interactive UI mode
npm run test:ui

# Single spec
npx playwright test tests/auth/login.spec.js

# Filter by Allure/Playwright tag
npx playwright test --grep @smoke
```

### View reports

```bash
# Allure (rich report with history, severity filters, parameter axes)
npm run allure:serve

# Playwright built-in HTML
npm run report
```

---

## Continuous Integration

`.github/workflows/playwright.yml` runs on every push or pull request to `main` and on manual dispatch:

1. Checks out the repository.
2. Sets up Node.js 20 with npm cache.
3. Runs `npm ci`.
4. **Caches `~/.cache/ms-playwright`** keyed on the Playwright version resolved from `package-lock.json` — subsequent runs skip the ~500 MB browser download and only install apt system deps (~1 min vs. ~11 min).
5. Executes the full suite across Chromium, Firefox and WebKit.
6. Restores Allure history from the previous run via the `gh-pages` branch.
7. Generates the Allure report (with the categories defined in `playwright.config.js`).
8. Publishes the report to GitHub Pages.
9. Uploads the Playwright HTML report as a workflow artifact.

The latest report is therefore always available as a live web page: <https://bogdanyushkov.github.io/Playwright-e2e-tests/>.

---

## Notes for reviewers

- saucedemo is a public demo application by Sauce Labs; the credentials in `fixtures/data.js` (`standard_user` / `secret_sauce`) are not secrets.
- `.auth/`, `node_modules/`, `allure-results/`, `allure-report/`, `playwright-report/` and `test-results/` are excluded from version control.
- The `empty-cart-checkout` spec is intentionally marked `test.fail()` — it documents an actual bug in saucedemo (the app lets the user proceed to `/checkout-step-one.html` with an empty cart). The annotation keeps the suite green while still flagging a future regression if the bug is fixed.
