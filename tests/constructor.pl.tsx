import { test, expect } from '@playwright/test';

test.describe('Интеграционные тесты конструктора бургера', () => {

  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });
    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/orders',
      update: false
    });

    await page.context().addCookies([
      { name: 'accessToken', value: 'mock-access-token', url: 'http://localhost:4000' }
    ]);

    await page.goto('http://localhost:4000/', { waitUntil: 'networkidle', timeout: 30000 });

    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
  });

  test('Добавление булки и начинки в конструктор', async ({ page }) => {
    await page.waitForTimeout(3000);
    const addButtons = page.getByRole('button', { name: 'Добавить' });
    await addButtons.first().click();
    await expect(page.getByText('(верх)')).toBeVisible({ timeout: 5000 });
  });

  test('Открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.waitForTimeout(3000);

    const ingredientLink = page.locator('[data-testid="ingredients-content"] a').first();
    await ingredientLink.click();

    await page.waitForTimeout(3000);

    const modalTitle = page.locator('h2:has-text("Краторная булка"), h3:has-text("Краторная булка"), h2:has-text("Флюоресцентная"), h3:has-text("Флюоресцентная")').first();
    await expect(modalTitle).toBeVisible({ timeout: 10000 });

    const titleText = await modalTitle.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText!.length).toBeGreaterThan(0);

    await page.locator('button[aria-label="Закрыть"]').click();
    await page.waitForTimeout(1000);
    await expect(modalTitle).not.toBeVisible({ timeout: 5000 });
  });

  test('Оформление заказа', async ({ page }) => {
    await page.waitForTimeout(3000);
    const addButtons = page.getByRole('button', { name: 'Добавить' });
    await addButtons.first().click();
    await addButtons.nth(1).click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('12345')).toBeVisible({ timeout: 5000 });

    await expect(page.getByText('(верх)')).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText('(низ)')).not.toBeVisible({ timeout: 5000 });

    await page.locator('button[aria-label="Закрыть"]').click();
    await expect(page.locator('[data-testid="modal-overlay"]')).not.toBeVisible();
  });
});
