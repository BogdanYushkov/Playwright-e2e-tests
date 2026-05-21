const { test, expect } = require("../../fixtures/test");
const {
    applyLabels,
    step,
    FEATURE,
    STORY,
    SEVERITY,
    TAG,
} = require("../../fixtures/allure");
const { PRODUCTS, CHECKOUT_INFO } = require("../../fixtures/data");

test.describe("Checkout | Happy path", { tag: [TAG.checkout, TAG.regression] }, () => {
    test.beforeEach(() => {
        applyLabels({
            feature: FEATURE.checkout,
            story: STORY.purchase,
            suite: "Checkout",
            subSuite: "Happy path",
        });
    });

    test(
        "User can complete a purchase end-to-end",
        { tag: [TAG.smoke, TAG.sanity] },
        async ({ inventoryPage, cartPage, checkoutPage, headerMenu }) => {
            applyLabels({
                severity: SEVERITY.blocker,
                description:
                    "Full revenue path: browse → add to cart → checkout → confirmation → return to catalogue.",
            });

            const expectedPrice = await step(
                "Open the catalogue and capture the product price",
                async () => {
                    await inventoryPage.open();
                    await inventoryPage.expectLoaded();
                    return inventoryPage.getPriceFor(PRODUCTS.backpack.name);
                },
            );

            await step(`Add '${PRODUCTS.backpack.name}' to the cart`, async () => {
                await inventoryPage.addProductToCart(PRODUCTS.backpack.id);
                await headerMenu.expectCartBadge(1);
            });

            await step("Cart shows exactly one matching line item at the expected price", async () => {
                await headerMenu.openCart();
                await cartPage.expectLoaded();
                await cartPage.expectItemCount(1);
                await cartPage.expectItem(PRODUCTS.backpack.name);
                await expect(cartPage.itemPrices).toHaveText(expectedPrice);
            });

            await step("Fill in customer information", async () => {
                await cartPage.startCheckout();
                await checkoutPage.expectStepOne();
                await checkoutPage.fillCustomerInfo(CHECKOUT_INFO);
            });

            await step("Order overview keeps the same price", async () => {
                await checkoutPage.expectStepTwo();
                await expect(checkoutPage.itemPrices).toHaveText(expectedPrice);
            });

            await step("Finish the order and see the confirmation screen", async () => {
                await checkoutPage.finish();
                await checkoutPage.expectComplete();
            });

            await step("Return to the catalogue with an empty cart", async () => {
                await checkoutPage.goBackToProducts();
                await inventoryPage.expectLoaded();
                await headerMenu.expectCartBadge(0);
            });
        },
    );
});
