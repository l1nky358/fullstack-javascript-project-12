const { test, expect } = require('@playwright/test');

test('простой тест', async ({ page }) => {
  console.log('✅ Тест запущен');
  expect(true).toBeTruthy();
});