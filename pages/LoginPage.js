const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const { URLS } = require("../fixtures/data");

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.usernameInput = page.locator("#user-name");
        this.passwordInput = page.locator("#password");
        this.loginButton = page.locator("#login-button");
        this.errorMessage = page.getByTestId("error");
    }

    async open() {
        await this.goto(URLS.login);
    }

    /**
     * Fill the form and submit. Does not assert success — caller decides
     * whether to expect a successful redirect or an error.
     */
    async login({ username, password }) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async expectErrorMessage(text) {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(text);
    }

    async expectInputsHighlighted() {
        await expect(this.usernameInput).toHaveClass(/error/);
        await expect(this.passwordInput).toHaveClass(/error/);
    }

    async expectInputsEmpty() {
        await expect(this.usernameInput).toHaveValue("");
        await expect(this.passwordInput).toHaveValue("");
    }
}

module.exports = { LoginPage };
