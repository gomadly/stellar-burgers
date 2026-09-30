import { test, expect } from '@playwright/test';

const mockIngredients = {
  success: true,
  data: [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44, fat: 26, carbohydrates: 85, calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420, fat: 142, carbohydrates: 242, calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ]
};

const mockUser = { success: true, user: { email: 'test@test.ru', name: 'Test User' } };

const mockOrder = {
  success: true,
  name: 'Флюоресцентный люминесцентный бургер',
  order: {
    _id: '123',
    number: 12345,
    name: 'Флюоресцентный люминесцентный бургер',
    status: 'done',
    createdAt: '2023-01-01T10:00:00.000Z',
    updatedAt: '2023-01-01T10:00:00.000Z',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
  }
};

test.describe('Интеграционные тесты конструктора бургера', () => {

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/ingredients', route => route.fulfill({ json: mockIngredients }));
    await page.route('**/api/auth/user', route => route.fulfill({ json: mockUser }));
    await page.route('**/api/orders', route => route.fulfill({ json: mockOrder }));

    await page.goto('/');

    await expect(page.getByText('Соберите бургер')).toBeVisible({ timeout: 10000 });

    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.context().addCookies([
      { name: 'accessToken', value: 'mock-access-token', url: 'http://localhost:4000' }
    ]);

    await page.reload();

    await expect(page.getByText('Соберите бургер')).toBeVisible({ timeout: 10000 });
  });

  test('Добавление булки и начинки в конструктор', async ({ page }) => {
    const addButtons = page.getByRole('button', { name: 'Добавить' });
    await addButtons.first().click();

    await expect(page.getByText('(верх)')).toBeVisible();
    await expect(page.getByText('(низ)')).toBeVisible();
  });

    test('Открытие и закрытие модального окна ингредиента', async ({ page }) => {
    const ingredientLink = page.locator('[data-testid="ingredients-content"] a').first();
    await ingredientLink.click();

    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible({ timeout: 5000 });

    await page.locator('button[aria-label="Закрыть"]').click();
    await expect(page.locator('[data-testid="modal-overlay"]')).not.toBeVisible();
  });

  test('Оформление заказа', async ({ page }) => {
    const addButtons = page.getByRole('button', { name: 'Добавить' });
    await addButtons.first().click();
    await addButtons.nth(1).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByTestId('order-number')).toBeVisible();
    await expect(page.getByTestId('order-number')).toContainText('12345');

    await page.locator('button[aria-label="Закрыть"]').click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
