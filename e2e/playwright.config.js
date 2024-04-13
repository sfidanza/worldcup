import { devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  testDir: './tests',
  timeout: 30 * 1000, // Maximum time one test can run for
  expect: {
    timeout: 5000 // Maximum time expect() should wait for the condition to be met
  },
  fullyParallel: true, // Run all tests in parallel
  forbidOnly: !!process.env.CI, // Fail the CI build if test.only is found in source code
  retries: 1,
  workers: 3,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { host: '0.0.0.0' }]],
 
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: 0, // Maximum time each action such as `click()` can take. Defaults to 0 (no limit).

    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'https://worldcup.dagobah-online.com', // production
    baseURL: 'http://host.docker.internal:8090', // local dev

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },

    /* Test against mobile viewports. */
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};

export default config;
