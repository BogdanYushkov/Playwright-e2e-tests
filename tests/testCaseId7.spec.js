const { test, expect } = require("@playwright/test");

test.beforeAll(async ({ browser }) => { // User is logged into account
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://www.saucedemo.com");
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await page.waitForURL("https://www.saucedemo.com/inventory.html");

    await context.storageState({ path: "temp-auth.json" });
    await context.close();
});

test("Test Footer Links", async ({ browser }) => {
    const context = await browser.newContext({ storageState: "temp-auth.json" });
    const page = await context.newPage();

    await page.goto("https://www.saucedemo.com/inventory.html");

    await page.waitForSelector('[data-test="social-twitter"]', { state: 'visible' });

    const [newTabTwitter] = await Promise.all([
        context.waitForEvent('page'), 
        page.click('[data-test="social-twitter"]') 
    ]);

    await newTabTwitter.waitForLoadState();

    expect(newTabTwitter.url()).toBe('https://x.com/saucelabs'); // Twitter of the company is opened on the new tab

    await newTabTwitter.close();

    await page.waitForLoadState('load');

    expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');

    const [newTabFacebook] = await Promise.all([
        context.waitForEvent('page'), 
        page.click('[data-test="social-facebook"]') 
    ]);

    await newTabFacebook.waitForLoadState();

    expect(newTabFacebook.url()).toBe('https://www.facebook.com/saucelabs'); // Facebook of the company is opened on the new tab

    await newTabFacebook.close();

    await page.waitForLoadState('load');

    expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');

    const [newTabLinkedin] = await Promise.all([
        context.waitForEvent('page'), 
        page.click('[data-test="social-linkedin"]') 
    ]);

    await newTabLinkedin.waitForLoadState();

    expect(newTabLinkedin.url()).toBe('https://www.linkedin.com/company/sauce-labs/'); // Linkedinof the company is opened on the new tab

    await newTabLinkedin.close();

    await page.waitForLoadState('load');

    expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');
});
