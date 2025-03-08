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

test("Test Checkout without products", async ({ browser }) => {
    const context = await browser.newContext({ storageState: "temp-auth.json" });
    const page = await context.newPage();

    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.click("#shopping_cart_container")
    
    const cartListLocator = page.locator('.cart_list');


    const childElements = await cartListLocator.locator('> div');

    const childCount = await childElements.count();


    await page.waitForURL("https://www.saucedemo.com/cart.html") // Cart page is displayed
    await expect(childCount).toBeLessThanOrEqual(2); // products are not displayed

    await page.click("#checkout")
 
    const checkoutInfoLocator = page.locator('.checkout_info');
    const textContent = await checkoutInfoLocator.textContent();

    expect(textContent).toContain('Cart is empty'); // error message "Cart is empty" are displayed
    // This text will be failed    
})