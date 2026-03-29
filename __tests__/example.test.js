describe('Проверка API чата', () => {
  
  it('GET /api/channels должен возвращать список каналов', async ({ page }) => {
    
    const response = await page.request.get('http://localhost:5001/api/channels');
    
    const data = await response.json();

    expect(response.status()).toBe(200);

    expect(Array.isArray(data)).toBe(true);

    expect(data.length).toBeGreaterThan(0);

    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('name');
  });
});