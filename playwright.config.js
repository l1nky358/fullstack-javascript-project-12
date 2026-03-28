module.exports = {
  webServer: {
    command: 'npm start',
    port: 5001,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  use: {
    baseURL: 'http://localhost:5001',
  },
};