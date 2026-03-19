const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './__tests__',
  timeout: 60000,
  workers: 1,
  use: {
    baseURL: 'http://localhost:5173',
  },
});