const { test, expect } = require('@playwright/test');

test('Server is running', async ({ request }) => {
  const response = await request.get('http://localhost:5001/health');
  expect(response.status()).toBe(200);
});