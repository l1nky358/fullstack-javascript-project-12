module.exports = {
  timeout: 180000,

  webServer: {
    command: 'npm start',
    port: 5001,
    timeout: 180000,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      NODE_ENV: 'test',
      PORT: '5001',
    },
  },

  expect: {
    timeout: 20000,
  },

  use: {
    baseURL: 'http://localhost:5001',
    actionTimeout: 15000,
    navigationTimeout: 60000,
  },
};
