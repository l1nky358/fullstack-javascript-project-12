const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './__tests__',
  timeout: 0,
  expect: {
    timeout: 0,
  },
  workers: 1,
  use: {
    baseURL: 'http://localhost:5173',
    actionTimeout: 0,
    navigationTimeout: 0,
    launchOptions: {
      timeout: 0,
    },
  },
  webServer: [
    {
      command: 'node test-server-simple.js',
      port: 5001,
      timeout: 0,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'cd frontend && npm run dev',
      port: 5173,
      timeout: 0,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
});