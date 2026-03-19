const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './__tests__',
  timeout: 120000,
  workers: 1,
  use: {
    baseURL: 'http://localhost:5173',
  },
  webServer: [
    {
      command: 'node test-server-simple.js',
      port: 5001,
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'cd frontend && npm run dev',
      port: 5173,
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});