import { expect, test } from '@playwright/test';

const bunName = 'Краторная булка N-200i';
const mainName = 'Биокотлета из марсианской Магнолии';

test.describe('Burger constructor', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/constructor.har', {
      url: '**/api/**',
      notFound: 'abort',
    });
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token; path=/';
    });
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Добавить' }).first()).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Тестовый пользователь' })
    ).toBeVisible();
  });

  test('adds a bun and a filling from the ingredient list', async ({ page }) => {
    await page
      .getByRole('listitem')
      .filter({ hasText: bunName })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .getByRole('listitem')
      .filter({ hasText: mainName })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(page.getByTestId('constructor-bun-1')).toContainText(bunName);
    await expect(page.getByTestId('constructor-bun-2')).toContainText(bunName);
    await expect(page.getByTestId('constructor-ingredients')).toContainText(mainName);
  });

  test('opens the selected ingredient details and closes them with the close button', async ({
    page,
  }) => {
    await page.getByRole('link', { name: new RegExp(bunName) }).click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: bunName })).toBeVisible();
    await expect(page.getByText('420', { exact: true })).toBeVisible();
    await expect(page.getByText('80', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeHidden();
  });

  test('closes ingredient details when the overlay is clicked', async ({ page }) => {
    await page.getByRole('link', { name: new RegExp(bunName) }).click();
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeHidden();
  });

  test('creates an order, clears the constructor and closes the order modal', async ({
    page,
  }) => {
    await page
      .getByRole('listitem')
      .filter({ hasText: bunName })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .getByRole('listitem')
      .filter({ hasText: mainName })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByTestId('order-number')).toHaveText('12345');
    await expect(page.getByTestId('constructor-bun-1')).toHaveCount(0);
    await expect(page.getByTestId('constructor-bun-2')).toHaveCount(0);
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Выберите начинку'
    );

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByTestId('order-number')).toBeHidden();
  });
});
