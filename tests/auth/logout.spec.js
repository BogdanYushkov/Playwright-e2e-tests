const { test, expect } = require("../../fixtures/test");
const {
    applyLabels,
    step,
    FEATURE,
    STORY,
    SEVERITY,
    TAG,
} = require("../../fixtures/allure");
const { USERS } = require("../../fixtures/data");

test.describe("Authentication | Sign out", { tag: [TAG.auth, TAG.regression] }, () => {
    test.beforeEach(() => {
        applyLabels({
            feature: FEATURE.auth,
            story: STORY.signOut,
            suite: "Authentication",
            subSuite: "Sign out",
        });
    });

    test(
        "User can sign out and return to the sign-in screen",
        { tag: [TAG.smoke] },
        async ({ page, loginPage, inventoryPage, headerMenu }) => {
            applyLabels({ severity: SEVERITY.critical });

            await step("Sign in as the standard user", async () => {
                await loginPage.open();
                await loginPage.login(USERS.standard);
                await inventoryPage.expectLoaded();
            });

            await step("Open the burger menu and sign out", async () => {
                await headerMenu.openMenu();
                await expect(headerMenu.menuLinks).toHaveCount(4);
                await headerMenu.logoutLink.click();
            });

            await step("Land back on the sign-in screen with empty inputs", async () => {
                await expect(page).toHaveURL("https://www.saucedemo.com/");
                await loginPage.expectInputsEmpty();
                await expect(loginPage.loginButton).toBeVisible();
            });
        },
    );
});
