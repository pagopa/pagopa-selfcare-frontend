import { test, Page } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page
    .getByLabel('Privacy', { exact: true })
    .locator('div')
    .filter({ hasText: 'Questo sito utilizza cookies' })
    .nth(1)
    .click();
  await page.getByRole('button', { name: 'Chiudi' }).click();
  await page.getByRole('button', { name: 'Accedi' }).click();
  await page.getByTestId('commission-bundles-test').click();
  await page.getByTestId('search-input').click();
  await page.getByTestId('search-input').fill('Integration test globali');
  await page.waitForTimeout(2000);
  await page.getByLabel('Gestisci pacchetto').first().click();
  await page.getByTestId('exit-btn-test').click();
});
