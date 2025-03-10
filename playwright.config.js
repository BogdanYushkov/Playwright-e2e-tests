const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    video: 'on-first-retry',
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    baseURL: 'https://www.saucedemo.com',
  },
  projects: [
    {
      name: 'Chromium',
      use: { 
        browserName: 'chromium', 
      },
    },
    {
      name: 'Firefox',
      use: { 
        browserName: 'firefox', 
      },
    },
    {
      name: 'WebKit',
      use: { 
        browserName: 'webkit', 
      },
    },
  ],
  reporter: [
    ['allure-playwright'],
    ['dot'],
  ],
  expect: {
    timeout: 5000,
  },
  retries: 2,
  workers: 2,
});
