import {defineConfig, devices} from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 1 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Global timeout per test (single place, instead of per-file test.setTimeout). */
    timeout: 120000,
    expect: {
        timeout: 15000,
    },
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [['list'], ['html', {open: 'never'}]],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'https://dev.selfcare.pagopa.it/dashboard',
        // storageState: 'state.json',
        /*
         * Cap individual actions/navigations so a missing element fails fast with a
         * clear locator error instead of burning the whole test timeout.
         */
        actionTimeout: 20000,
        navigationTimeout: 45000,
        /* Always keep artifacts for failed tests so we can debug from the report. */
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    /* Configure projects for major browsers */
    projects: [
        {
            name: 'firefox',
            use: {...devices['Desktop Firefox']}
        },
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']}
        },
        {
            name: 'webkit',
            use: {...devices['Desktop Safari']}
        }
    ]
});
