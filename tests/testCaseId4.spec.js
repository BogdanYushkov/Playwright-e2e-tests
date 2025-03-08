const { test, expect } = require("@playwright/test");

test.beforeAll(async ({ browser }) => { // User is on the logined into account
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

test("Test Logout", async ({ browser }) => {
    const context = await browser.newContext({ storageState: "temp-auth.json" });
    const page = await context.newPage();

    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.click("#react-burger-menu-btn");

    const links = await page.locator('div nav a');
    await expect(links).toHaveCount(4) // 4 items are displayed

    await page.click("#logout_sidebar_link");
    await expect(page).toHaveURL("https://www.saucedemo.com") // User is redirecred to the "Login" page

    await expect(page.locator("#user-name")).toHaveText(""); // "Username" field is empty
    await expect(page.locator("#password")).toHaveText(""); // "Password" field is empty
})