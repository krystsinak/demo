import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const defaultEnv = process.env.ENV || 'qa';

dotenv.config({
  path: `./env/.env.${defaultEnv}`
});

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 3 : 3,
  reporter: [['allure-playwright']],
  timeout: 40 * 1000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: process.env.URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ]
})