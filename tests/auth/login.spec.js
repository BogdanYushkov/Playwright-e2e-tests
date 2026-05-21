const { test } = require("../../fixtures/test");
const {
    applyLabels,
    step,
    FEATURE,
    STORY,
    SEVERITY,
    TAG,
} = require("../../fixtures/allure");
const { USERS, ERROR_MESSAGES } = require("../../fixtures/data");

test.describe("Authentication | Sign in", { tag: [TAG.auth, TAG.regression] }, () => {
    test.beforeEach(async ({ loginPage }) => {
        applyLabels({
            feature: FEATURE.auth,
            story: STORY.signIn,
            suite: "Authentication",
            subSuite: "Sign in",
        });
        await step("Open the sign-in page", () => loginPage.open());
    });

    test(
        "User can sign in with valid credentials",
        { tag: [TAG.smoke, TAG.sanity] },
        async ({ loginPage, inventoryPage }) => {
            applyLabels({
                severity: SEVERITY.blocker,
                description: "Verifies the happy-path sign-in for a standard user.",
            });
            await step("Submit valid credentials", () => loginPage.login(USERS.standard));
            await step("Land on the products catalogue", () => inventoryPage.expectLoaded(6));
        },
    );

    test(
        "Sign-in is blocked when the password is wrong",
        async ({ loginPage }) => {
            applyLabels({ severity: SEVERITY.critical });
            await step("Submit a valid username with the wrong password", () =>
                loginPage.login({
                    username: USERS.standard.username,
                    password: "wrong_password",
                }),
            );
            await step("See the credentials error message", () =>
                loginPage.expectErrorMessage(ERROR_MESSAGES.invalidCredentials),
            );
            await step("Both inputs are highlighted in red", () =>
                loginPage.expectInputsHighlighted(),
            );
        },
    );

    test(
        "Sign-in is blocked for an unknown username",
        async ({ loginPage }) => {
            applyLabels({ severity: SEVERITY.critical });
            await step("Submit an unknown username", () =>
                loginPage.login({
                    username: "unknown_user",
                    password: USERS.standard.password,
                }),
            );
            await step("See the credentials error message", () =>
                loginPage.expectErrorMessage(ERROR_MESSAGES.invalidCredentials),
            );
            await step("Both inputs are highlighted in red", () =>
                loginPage.expectInputsHighlighted(),
            );
        },
    );
});
