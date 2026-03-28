module.exports = {
  timeout: 60000,
  
  webServer: {
    command: 'npm start',
    port: 5001,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  
  expect: {
    timeout: 10000,
  },
  
  use: {
    baseURL: 'http://localhost:5001',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
};