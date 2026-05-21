/**
 * BasePage — common helpers shared by all Page Objects.
 */
class BasePage {
    /** @param {import('@playwright/test').Page} page */
    constructor(page) {
        this.page = page;
    }

    async goto(path = "/") {
        await this.page.goto(path);
    }

    async expectUrl(pattern) {
        const { expect } = require("@playwright/test");
        await expect(this.page).toHaveURL(pattern);
    }
}

module.exports = { BasePage };
