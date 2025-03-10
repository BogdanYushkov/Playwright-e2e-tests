const {test,expect} = require("@playwright/test")

test("Test Valid Login", async ({page}) => {
    await page.goto("https://www.saucedemo.com")

    const login = await page.waitForSelector("#user-name")
    const password = await page.waitForSelector("#password")
    await login.fill("standard_user")
    await password.fill("secret_sauce")
    await page.click("#login-button")

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html") // User is redirected to the inventory page
    await expect(page.locator("div.inventory_list")).toHaveCount(1) // Products and cart are displayed
})