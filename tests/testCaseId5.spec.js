const { test, expect } = require("@playwright/test");

test.beforeAll(async ({ browser }) => { // User is logged into account
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://www.saucedemo.com");
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await page.waitForURL("https://www.saucedemo.com/inventory.html");

    await context.storageState({ path: "temp-auth.json" });
    await context.close();
});

test("Test Saving the card after logout", async ({ browser }) => {
    const context = await browser.newContext({ storageState: "temp-auth.json" });
    const page = await context.newPage();

    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.click("#add-to-cart-sauce-labs-backpack")

    await expect(page.locator("span.shopping_cart_badge")).toHaveText("1"); // Number near the cart at the top right increase by 1

    await page.click("#react-burger-menu-btn");
    const links = await page.locator("div nav a");
    await expect(links).toHaveCount(4) // 4 items are displayed

    await page.click("#logout_sidebar_link");
    await expect(page).toHaveURL("https://www.saucedemo.com") // User is redirecred to the "Login" page

    await expect(page.locator("#user-name")).toHaveText(""); // "Username" field is empty
    await expect(page.locator("#password")).toHaveText(""); // "Password" field is empty

    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");

    await page.click("#login-button");
    await page.waitForURL("https://www.saucedemo.com/inventory.html"); // User is redirected to the inventory page

    await page.click("#shopping_cart_container")

    await expect(page.locator(".inventory_item_name")).toHaveText("Sauce Labs Backpack") // Product are the same as was added at step 1
})