module.exports = {
  timeout: 60000,
  
  webServer: {
    command: 'npm start',
    port: 5001,
    timeout: 120000,
    reuseExistingServer: true,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      NODE_ENV: 'test',
      PORT: '5001',
    },
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