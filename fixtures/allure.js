/**
 * Allure helpers — single place for labels, severity vocabulary and
 * readable step wrappers. Importing constants instead of free-form
 * strings keeps the report taxonomy consistent across the suite.
 *
 * Usage:
 *   const { applyLabels, step, FEATURE, STORY, SEVERITY, TAG } =
 *     require("../../fixtures/allure");
 *
 *   test.beforeEach(() => applyLabels({
 *     feature: FEATURE.auth,
 *     story:   STORY.signIn,
 *     suite:   "Authentication",
 *   }));
 *
 *   test("...", async () => {
 *     applyLabels({ severity: SEVERITY.blocker, tags: [TAG.smoke] });
 *     await step("Open the sign-in page", () => loginPage.open());
 *   });
 */
const { allure } = require("allure-playwright");

const EPIC = {
    storefront: "E-Commerce Storefront",
};

const FEATURE = {
    auth: "Authentication",
    inventory: "Inventory",
    cart: "Cart",
    checkout: "Checkout",
};

const STORY = {
    signIn: "Sign in",
    signOut: "Sign out",
    sortProducts: "Sort products",
    footerLinks: "Footer social links",
    cartPersistence: "Cart persistence",
    purchase: "Complete purchase",
    emptyCartGuard: "Empty-cart checkout guard",
};

const SEVERITY = {
    blocker: "blocker",
    critical: "critical",
    normal: "normal",
    minor: "minor",
    trivial: "trivial",
};

const TAG = {
    // Execution scopes
    smoke: "@smoke",
    sanity: "@sanity",
    regression: "@regression",
    // Status
    knownBug: "@known-bug",
    // Functional areas
    auth: "@auth",
    inventory: "@inventory",
    cart: "@cart",
    checkout: "@checkout",
    ui: "@ui",
};

const OWNER = "Bogdan Yushkov";

/**
 * Attach Allure metadata to the current test. Safe to call multiple
 * times — every call is additive, so split common labels into a
 * `beforeEach` and keep per-test severity/tags in the test body.
 */
function applyLabels({
    epic = EPIC.storefront,
    feature,
    story,
    severity,
    parentSuite,
    suite,
    subSuite,
    owner = OWNER,
    tags = [],
    description,
} = {}) {
    if (epic) allure.epic(epic);
    if (feature) allure.feature(feature);
    if (story) allure.story(story);
    if (severity) allure.severity(severity);
    if (parentSuite) allure.parentSuite(parentSuite);
    if (suite) allure.suite(suite);
    if (subSuite) allure.subSuite(subSuite);
    if (owner) allure.owner(owner);
    if (description) allure.description(description);
    for (const tag of tags) allure.tag(tag);
}

/** Thin wrapper around `allure.step` so specs read like a checklist. */
const step = (name, body) => allure.step(name, body);

module.exports = {
    applyLabels,
    step,
    allure,
    EPIC,
    FEATURE,
    STORY,
    SEVERITY,
    TAG,
    OWNER,
};
