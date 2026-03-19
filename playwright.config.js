const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './__tests__',
  timeout: 30000,
  workers: 1,
  use: {
    baseURL: 'http://localhost:5173',
  },
  webServer: {
    command: 'node test-server-simple.js',
    port: 5001,
    timeout: 30000,
    reuseExistingServer: !process.env.CI,
  },
});