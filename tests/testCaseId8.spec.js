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

test("Test Valid Checkout", async ({ browser }) => {
    const context = await browser.newContext({ storageState: "temp-auth.json" });
    const page = await context.newPage();
    const expectedPrice = "$29.99";

    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.click("#add-to-cart-sauce-labs-backpack")

    await expect(page.locator('span.shopping_cart_badge')).toHaveText('1'); // Number near the cart at the top right increase by 1

    await page.click("#shopping_cart_container")

    const priceElement = await page.locator('.inventory_item_price');
    const priceText = await priceElement.textContent();

    await page.click("#checkout")

    await page.locator('#first-name').click();
    await page.locator('#first-name').fill('Bogdan');

    await page.locator('#last-name').click();
    await page.locator('#last-name').fill('QA');
    

    await page.locator('#postal-code').click();
    await page.locator('#postal-code').fill('02011');

    const continueButton = await page.locator("#continue");
    await expect(continueButton).toBeVisible(); 
    await continueButton.click();

    await page.waitForURL('https://www.saucedemo.com/checkout-step-two.html'); 
    await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html"); // User is redirected to the "Overview" page
    
    await expect(priceText).toBe(expectedPrice); // Total price = price of products from step 1

    await page.click("#finish")

    await page.waitForURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html"); // User is redirected to the "Checkout Complete" page

    const headerLocator = page.locator('.complete-header');
    await expect(headerLocator).toHaveText('Thank you for your order!'); // "Thank you for your order!" message are displayed

    await page.click("#back-to-products")

    await page.waitForURL('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html"); // User is redirected to the inventory page

    const cartBadge = await page.locator('.shopping_cart_link .shopping_cart_badge');
    const badgeCount = await cartBadge.count();
    await expect(badgeCount).toBe(0); // Cart is empty
})