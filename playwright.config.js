module.exports = {
  webServer: {
    command: 'node test-server.js',
    port: 5001,
    timeout: 60000,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  use: {
    baseURL: 'http://localhost:5001',
  },
};
