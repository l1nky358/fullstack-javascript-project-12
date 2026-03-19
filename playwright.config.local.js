const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './__tests__',
  timeout: 0,
  workers: 1,
  use: {
    baseURL: 'http://localhost:5173',
  },
  webServer: {
    command: 'node test-server-simple.js',
    port: 5001,
    timeout: 0,
    reuseExistingServer: !process.env.CI,
  },
});