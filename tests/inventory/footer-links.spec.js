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
 * Verify the social link contracts (href + target). Navigating to the
 * external sites is intentionally avoided — it makes the test depend on
 * third-party availability and is a frequent source of CI flakiness.
 */
test.describe(
    "Inventory | Footer social links",
    { tag: [TAG.inventory, TAG.ui, TAG.regression] },
    () => {
        const links = [
            {
                name: "Twitter",
                locator: "twitterLink",
                href: /(x|twitter)\.com\/saucelabs/,
            },
            {
                name: "Facebook",
                locator: "facebookLink",
                href: /facebook\.com\/saucelabs/,
            },
            {
                name: "LinkedIn",
                locator: "linkedinLink",
                href: /linkedin\.com\/company\/sauce-labs/,
            },
        ];

        test.beforeEach(async ({ inventoryPage }) => {
            applyLabels({
                feature: FEATURE.inventory,
                story: STORY.footerLinks,
                severity: SEVERITY.minor,
                suite: "Inventory",
                subSuite: "Footer social links",
            });
            await step("Open the products catalogue", async () => {
                await inventoryPage.open();
                await inventoryPage.expectLoaded();
            });
        });

        for (const { name, locator, href } of links) {
            test(`${name} footer link points to Sauce Labs`, async ({ inventoryPage }) => {
                const link = inventoryPage[locator];
                await step(`${name} link is visible`, () => expect(link).toBeVisible());
                await step(`${name} href targets Sauce Labs`, () =>
                    expect(link).toHaveAttribute("href", href),
                );
                await step(`${name} opens in a new tab`, () =>
                    expect(link).toHaveAttribute("target", "_blank"),
                );
            });
        }
    },
);
