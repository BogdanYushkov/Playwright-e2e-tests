const { test, expect } = require("../../fixtures/test");
const {
    applyLabels,
    step,
    FEATURE,
    STORY,
    SEVERITY,
    TAG,
} = require("../../fixtures/allure");

/**
 * Known application bug: saucedemo lets the user proceed to checkout
 * with an empty cart and shows no "Cart is empty" message.
 *
 * The test below describes the expected behaviour. It is annotated with
 * `test.fail()` so the suite stays green while the bug exists, and will
 * automatically flag a regression the day saucedemo fixes it.
 */
test.describe("Checkout | Validation", { tag: [TAG.checkout, TAG.regression] }, () => {
    test.beforeEach(() => {
        applyLabels({
            feature: FEATURE.checkout,
            story: STORY.emptyCartGuard,
            suite: "Checkout",
            subSuite: "Validation",
        });
    });

    test.fail(
        "Checkout from an empty cart is blocked (known bug)",
        { tag: [TAG.knownBug] },
        async ({ cartPage }) => {
            applyLabels({
                severity: SEVERITY.normal,
                description:
                    "Expected: stay on the cart page with a 'cart is empty' error. " +
                    "Actual: navigation to /checkout-step-one.html succeeds silently. " +
                    "Tracked as a known application bug — kept failing intentionally " +
                    "to flag regressions when the app is fixed.",
            });

            await step("Open an empty cart", async () => {
                await cartPage.open();
                await cartPage.expectLoaded();
                await cartPage.expectItemCount(0);
            });

            await step("Attempt to start checkout", () => cartPage.startCheckout());

            await step("Expect to remain on the cart with an empty-cart error", async () => {
                await cartPage.expectLoaded();
                await expect(cartPage.page.getByTestId("error")).toContainText(/cart is empty/i);
            });
        },
    );
});
