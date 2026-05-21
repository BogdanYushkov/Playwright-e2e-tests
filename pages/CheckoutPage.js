const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");

class CheckoutPage extends BasePage {
    constructor(page) {
        super(page);

        // Step one: customer info
        this.firstNameInput = page.locator("#first-name");
        this.lastNameInput = page.locator("#last-name");
        this.postalCodeInput = page.locator("#postal-code");
        this.continueButton = page.locator("#continue");
        this.cancelButton = page.locator("#cancel");

        // Step two: overview
        this.finishButton = page.locator("#finish");
        this.summaryItems = page.locator(".cart_item");
        this.itemPrices = page.locator(".inventory_item_price");
        this.totalLabel = page.locator(".summary_total_label");

        // Step three: complete
        this.completeHeader = page.locator(".complete-header");
        this.backHomeButton = page.locator("#back-to-products");
    }

    async fillCustomerInfo({ firstName, lastName, postalCode }) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }

    async finish() {
        await this.finishButton.click();
    }

    async expectStepOne() {
        await this.expectUrl(/\/checkout-step-one\.html$/);
    }

    async expectStepTwo() {
        await this.expectUrl(/\/checkout-step-two\.html$/);
    }

    async expectComplete() {
        await this.expectUrl(/\/checkout-complete\.html$/);
        await expect(this.completeHeader).toHaveText("Thank you for your order!");
    }

    async goBackToProducts() {
        await this.backHomeButton.click();
    }
}

module.exports = { CheckoutPage };
