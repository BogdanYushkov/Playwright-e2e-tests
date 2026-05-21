/**
 * Custom Playwright test extended with Page Object fixtures and
 * automatic Allure parameters so the report groups runs by browser
 * and auth-state without per-spec boilerplate.
 *
 * Usage:
 *   const { test, expect } = require('../../fixtures/test');
 *   test('...', async ({ loginPage, inventoryPage }) => { ... });
 *
 * Authenticated specs use the `*-auth` projects (storageState from
 * global-setup.js). Auth flows use the `*-noauth` projects.
 */
const base = require("@playwright/test");
const { allure } = require("allure-playwright");
const { LoginPage } = require("../pages/LoginPage");
const { InventoryPage } = require("../pages/InventoryPage");
const { CartPage } = require("../pages/CartPage");
const { CheckoutPage } = require("../pages/CheckoutPage");
const { HeaderMenu } = require("../pages/HeaderMenu");

const test = base.test.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    headerMenu: async ({ page }, use) => {
        await use(new HeaderMenu(page));
    },
});

// Auto-attach Browser + Auth-state as Allure parameters so the report
// presents a clean per-browser breakdown without per-test wiring.
test.beforeEach(async ({}, testInfo) => {
    const [browser, tier] = testInfo.project.name.split("-");
    allure.parameter("Browser", browser);
    allure.parameter("Auth state", tier === "auth" ? "Authenticated" : "Unauthenticated");
});

module.exports = { test, expect: base.expect };
