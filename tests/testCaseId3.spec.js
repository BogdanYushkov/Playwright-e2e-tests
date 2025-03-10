const {test,expect} = require("@playwright/test")

test("Test login with invalid login", async ({page}) => {
    await page.goto("https://www.saucedemo.com")

    const login = await page.waitForSelector("#user-name")
    const password = await page.waitForSelector("#password")
    await login.fill("standarD_user")
    await password.fill("secret_sauce")
    await page.click("#login-button")

    await expect(page.locator('#password')).toHaveClass('input_error form_input error'); // "X" icons are displayed on the "Login" and "Password" fields, this fields are highlighted with red. 
    await expect(page.locator('[data-test="error"]')).toBeVisible(); // "Epic sadface: Username and password do not match any user in this service" error message are displayed
})