import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4321';
const useExternal = Boolean(process.env.PLAYWRIGHT_BASE_URL);

const config = defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  timeout: 30_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
  },
});

if (process.env.CI) {
  config.workers = 1;
}

if (!useExternal) {
  config.webServer = {
    command: 'npm run preview -- --host 127.0.0.1 --port 4321',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  };
}

export default config;
