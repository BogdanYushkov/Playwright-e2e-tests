const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const { URLS } = require("../fixtures/data");

class InventoryPage extends BasePage {
    constructor(page) {
        super(page);
        this.inventoryList = page.locator(".inventory_list");
        this.items = page.locator(".inventory_item");
        this.itemNames = page.locator(".inventory_item_name");
        this.itemPrices = page.locator(".inventory_item_price");
        this.sortDropdown = page.locator(".product_sort_container");

        // Footer social links
        this.twitterLink = page.getByTestId("social-twitter");
        this.facebookLink = page.getByTestId("social-facebook");
        this.linkedinLink = page.getByTestId("social-linkedin");
    }

    async open() {
        await this.goto(URLS.inventory);
    }

    async expectLoaded(expectedItemCount = 6) {
        await this.expectUrl(/\/inventory\.html$/);
        await expect(this.inventoryList).toBeVisible();
        await expect(this.items).toHaveCount(expectedItemCount);
    }

    addToCartButton(productId) {
        return this.page.locator(`#add-to-cart-${productId}`);
    }

    removeFromCartButton(productId) {
        return this.page.locator(`#remove-${productId}`);
    }

    async addProductToCart(productId) {
        await this.addToCartButton(productId).click();
    }

    async sortBy(value) {
        await this.sortDropdown.selectOption(value);
    }

    async getItemNames() {
        return this.itemNames.allTextContents();
    }

    async getItemPrices() {
        const texts = await this.itemPrices.allTextContents();
        return texts.map((t) => Number(t.replace("$", "")));
    }

    /** Returns the displayed price text for a product card, e.g. "$29.99" */
    async getPriceFor(productName) {
        return this.items
            .filter({ hasText: productName })
            .locator(".inventory_item_price")
            .innerText();
    }
}

module.exports = { InventoryPage };
