module.exports = {
  testDir: './__tests__',
  testMatch: '**/*.test.js',
  timeout: 60000,
  
  webServer: {
    command: 'npm start',
    port: 5001,
    timeout: 120000,
    reuseExistingServer: true,
  },
  
  use: {
    baseURL: 'http://localhost:5001',
  },
};