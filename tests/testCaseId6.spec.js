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

test("Test Sorting  'Name (A to Z)'", async ({ browser }) => {
    const context = await browser.newContext({ storageState: "temp-auth.json" });
    const page = await context.newPage();

    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.click(".product_sort_container")
    await page.selectOption(".product_sort_container", { value: "az" });

    const itemLinks = await page.locator(".inventory_item_label a");

    const itemNames = await itemLinks.allTextContents();

    const sortedNames = await [...itemNames].sort();

    expect(itemNames).toEqual(sortedNames);  // All products was sorted due choosed sorting 'Name (A to Z)'

})


test("Test Sorting 'Name (Z to A)'", async ({ browser }) => {
    const context = await browser.newContext({ storageState: "temp-auth.json" });
    const page = await context.newPage();

    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.click(".product_sort_container"); 
    await page.selectOption('.product_sort_container', { value: 'za' });  

    const itemLinks = await page.locator(".inventory_item_label a");

    const itemNames = await itemLinks.allTextContents();

    const sortedNames = [...itemNames].sort().reverse();

    expect(itemNames).toEqual(sortedNames);  // All products was sorted due choosed sorting 'Name (Z to A)'
});



test("Test Sorting 'Price (low to high)'", async ({ browser }) => {
    const context = await browser.newContext({ storageState: "temp-auth.json" });
    const page = await context.newPage();

    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.click(".product_sort_container"); 
    await page.selectOption(".product_sort_container", { value: "lohi" });  

    const itemLinks = await page.locator(".inventory_item_price")

    const itemPrices = await itemLinks.allTextContents();

    const numericPrices = await itemPrices.map(price => Number(price.replace("$", "")));

    const sortedPrices = await [...numericPrices].sort((a, b) => a - b);

    await expect(numericPrices).toEqual(sortedPrices); // All products was sorted due choosed sorting 'Price (low to high)'

});

test("Test Sorting 'Price (high to low)'", async ({ browser }) => {
    const context = await browser.newContext({ storageState: "temp-auth.json" });
    const page = await context.newPage();

    await page.goto("https://www.saucedemo.com/inventory.html");
    await page.click(".product_sort_container"); 
    await page.selectOption(".product_sort_container", { value: "hilo" });  

    const itemLinks = await page.locator(".inventory_item_price");

    const itemPrices = await itemLinks.allTextContents();

    const numericPrices = itemPrices.map(price => Number(price.replace("$", "")));

    const sortedPrices = [...numericPrices].sort((a, b) => b - a);

    await expect(numericPrices).toEqual(sortedPrices); // All products was sorted due choosed sorting 'Price (high to low)'
});
