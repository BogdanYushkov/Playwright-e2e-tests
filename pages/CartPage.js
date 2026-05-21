const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const { URLS } = require("../fixtures/data");

class CartPage extends BasePage {
    constructor(page) {
        super(page);
        this.items = page.locator(".cart_item");
        this.itemNames = page.locator(".inventory_item_name");
        this.itemPrices = page.locator(".inventory_item_price");
        this.checkoutButton = page.locator("#checkout");
        this.continueShoppingButton = page.locator("#continue-shopping");
    }

    async open() {
        await this.goto(URLS.cart);
    }

    async expectLoaded() {
        await this.expectUrl(/\/cart\.html$/);
    }

    async expectItemCount(count) {
        await expect(this.items).toHaveCount(count);
    }

    async expectItem(name) {
        await expect(this.itemNames).toContainText(name);
    }

    async startCheckout() {
        await this.checkoutButton.click();
    }
}

module.exports = { CartPage };
