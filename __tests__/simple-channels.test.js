const { test, expect } = require('@playwright/test');

test('channels should be visible after login', async ({ page }) => {
  await page.goto('/signup');
  
  await page.fill('[name="username"]', 'testuser');
  await page.fill('[name="password"]', 'test123');
  await page.fill('[name="confirmPassword"]', 'test123');
  
  await page.click('button[type="submit"]');
  
  await page.waitForURL('**/');
  
  await page.waitForTimeout(2000);
  
  const channelButton = page.getByRole('button', { name: 'general' });
  
  await channelButton.waitFor({ timeout: 10000 });

  await expect(channelButton).toBeVisible();
  
  const buttons = await page.getByRole('button').count();
  console.log(`Total buttons: ${buttons}`);
  
  const channelButtons = await page.getByRole('button', { name: /general|random|tech/ }).count();
  console.log(`Channel buttons: ${channelButtons}`);
  
  expect(channelButtons).toBeGreaterThan(0);
});
