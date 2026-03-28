module.exports = {
  webServer: {
    command: 'node test-server.js',
    port: 5001,
    timeout: 120000,
    reuseExistingServer: true,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      PORT: '5001',
      NODE_ENV: 'test',
    },
  },
  use: {
    baseURL: 'http://localhost:5001',
  },
};
