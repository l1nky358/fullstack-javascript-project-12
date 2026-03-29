import { defineConfig } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:5001';

export default defineConfig({
  testDir: './tests',
  retries: 1,
  timeout: 30000,
  use: {
    baseURL: baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run start',
    port: 5001,
    timeout: 300000, 
    reuseExistingServer: false,
  },
});