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

    const firstIngredientCard = page.locator('li').first();
    const ingredientName = (await firstIngredientCard.locator('p.text_type_main-default').textContent())?.trim();

    await firstIngredientCard.locator('a').click();

    await expect(page.locator('#modals').getByText(ingredientName!, { exact: true })).toBeVisible({ timeout: 10000 });

    await page.locator('button[aria-label="Закрыть"]').click();

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible({ timeout: 5000 });
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
