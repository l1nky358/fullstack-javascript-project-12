const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './__tests__',
  timeout: 80000,
  workers: 1,
  use: {
    baseURL: 'http://localhost:5173',
  },
  webServer: [
    {
      command: 'node test-server-simple.js',
      port: 5001,
      timeout: 80000,
      reuseExistingServer: !process.env.CI,
      stdio: 'inherit',
    },
    {
      command: 'cd frontend && npm run dev',
      port: 5173,
      timeout: 80000,
      reuseExistingServer: !process.env.CI,
      stdio: 'inherit',
    },
  ],
});