const { defineConfig } = require("@playwright/test");
const path = require("path");

const STORAGE_STATE = path.join(__dirname, ".auth", "user.json");

module.exports = defineConfig({
    testDir: "./tests",
    timeout: 30_000,
    expect: { timeout: 5_000 },
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    globalSetup: require.resolve("./global-setup"),
    reporter: [
        [
            "allure-playwright",
            {
                resultsDir: "allure-results",
                detail: false,
                suiteTitle: false,
                environmentInfo: {
                    Application: "saucedemo.com",
                    Framework: "Playwright Test",
                    Language: "JavaScript (Node 20)",
                    Reporting: "Allure Report",
                    CI: process.env.CI ? "GitHub Actions" : "local",
                },
                categories: [
                    {
                        name: "Known application bugs",
                        matchedStatuses: ["failed", "broken"],
                        messageRegex: "(?i).*known.?bug.*",
                    },
                    { name: "Product defects", matchedStatuses: ["failed"] },
                    { name: "Test infrastructure", matchedStatuses: ["broken"] },
                    {
                        name: "Flaky tests",
                        matchedStatuses: ["passed"],
                        flaky: true,
                    },
                ],
            },
        ],
        ["html", { open: "never" }],
        ["list"],
    ],
    use: {
        baseURL: "https://www.saucedemo.com",
        // saucedemo uses `data-test` (not `data-testid`) so we tell
        // Playwright to recognise it as the test-id attribute.
        testIdAttribute: "data-test",
        headless: true,
        viewport: { width: 1280, height: 720 },
        actionTimeout: 10_000,
        ignoreHTTPSErrors: true,
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "on-first-retry",
    },
    projects: [
        // Authenticated specs reuse the storage state produced by global-setup.
        {
            name: "chromium-auth",
            testMatch: /.*\/(inventory|cart|checkout)\/.*\.spec\.js/,
            use: {
                browserName: "chromium",
                storageState: STORAGE_STATE,
            },
        },
        // Auth flows (login, logout) start with a clean session.
        {
            name: "chromium-noauth",
            testMatch: /.*\/auth\/.*\.spec\.js/,
            use: {
                browserName: "chromium",
                storageState: { cookies: [], origins: [] },
            },
        },
        {
            name: "firefox-auth",
            testMatch: /.*\/(inventory|cart|checkout)\/.*\.spec\.js/,
            use: {
                browserName: "firefox",
                storageState: STORAGE_STATE,
            },
        },
        {
            name: "firefox-noauth",
            testMatch: /.*\/auth\/.*\.spec\.js/,
            use: {
                browserName: "firefox",
                storageState: { cookies: [], origins: [] },
            },
        },
        {
            name: "webkit-auth",
            testMatch: /.*\/(inventory|cart|checkout)\/.*\.spec\.js/,
            use: {
                browserName: "webkit",
                storageState: STORAGE_STATE,
            },
        },
        {
            name: "webkit-noauth",
            testMatch: /.*\/auth\/.*\.spec\.js/,
            use: {
                browserName: "webkit",
                storageState: { cookies: [], origins: [] },
            },
        },
    ],
});
