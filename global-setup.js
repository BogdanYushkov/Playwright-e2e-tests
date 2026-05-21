/**
 * Runs once before the test suite. Authenticates as the standard user
 * via the UI and stores the browser storageState in .auth/user.json so
 * authenticated specs can skip the login step.
 *
 * Wired into playwright.config.js via the `globalSetup` option.
 */
const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { USERS, URLS } = require("./fixtures/data");

const AUTH_DIR = path.join(__dirname, ".auth");
const STORAGE_STATE = path.join(AUTH_DIR, "user.json");

module.exports = async (config) => {
    fs.mkdirSync(AUTH_DIR, { recursive: true });

    const baseURL = config.projects[0].use.baseURL;
    const browser = await chromium.launch();
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();

    await page.goto(URLS.login);
    await page.locator("#user-name").fill(USERS.standard.username);
    await page.locator("#password").fill(USERS.standard.password);
    await page.locator("#login-button").click();
    await page.waitForURL(/\/inventory\.html$/);

    await context.storageState({ path: STORAGE_STATE });
    await browser.close();
};

module.exports.STORAGE_STATE = STORAGE_STATE;
