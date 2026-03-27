module.exports = {
  webServer: {
    command: 'npm start',
    port: 5001,
    timeout: 60000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5001',
  },
};
