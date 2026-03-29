module.exports = {
  testDir: './__tests__',
  testMatch: '**/*.test.js',
  timeout: 60000,
  
  webServer: {
    command: 'node test-server.js',
    port: 5001,
    timeout: 120000,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      PORT: '5001',
      NODE_ENV: 'test',
    },
  },
  
  use: {
    baseURL: 'http://localhost:5001',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
};