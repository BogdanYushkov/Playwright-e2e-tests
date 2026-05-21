const { test } = require("../../fixtures/test");
const {
    applyLabels,
    step,
    FEATURE,
    STORY,
    SEVERITY,
    TAG,
} = require("../../fixtures/allure");
const { USERS, PRODUCTS } = require("../../fixtures/data");

test.describe("Cart | Persistence", { tag: [TAG.cart, TAG.regression] }, () => {
    test.beforeEach(() => {
        applyLabels({
            feature: FEATURE.cart,
            story: STORY.cartPersistence,
            suite: "Cart",
            subSuite: "Persistence",
        });
    });

    test(
        "Cart contents are preserved after sign-out and sign-in",
        { tag: [TAG.smoke] },
        async ({ loginPage, inventoryPage, cartPage, headerMenu }) => {
            applyLabels({
                severity: SEVERITY.critical,
                description:
                    "A shopper expects items they added to remain in the cart after returning to the store.",
            });

            await step("Open the products catalogue", async () => {
                await inventoryPage.open();
                await inventoryPage.expectLoaded();
            });

            await step(`Add '${PRODUCTS.backpack.name}' to the cart`, async () => {
                await inventoryPage.addProductToCart(PRODUCTS.backpack.id);
                await headerMenu.expectCartBadge(1);
            });

            await step("Sign out", async () => {
                await headerMenu.logout();
                await loginPage.expectInputsEmpty();
            });

            await step("Sign back in as the same user", async () => {
                await loginPage.login(USERS.standard);
                await inventoryPage.expectLoaded();
                await headerMenu.expectCartBadge(1);
            });

            await step("Cart still holds the original item", async () => {
                await headerMenu.openCart();
                await cartPage.expectLoaded();
                await cartPage.expectItemCount(1);
                await cartPage.expectItem(PRODUCTS.backpack.name);
            });
        },
    );
});
