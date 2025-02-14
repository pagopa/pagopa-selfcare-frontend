import { test, Page } from '@playwright/test';
import { changeToEcUser, checkReturnHomepage } from './utils/e2eUtils';

test.setTimeout(100000);
test.describe('Station Maintenances flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('EC creates new station maintenance', async () => {
    await changeToEcUser(page);
    await page.getByTestId('station-maintenances-test').click();
    await page.getByRole('button', { name: 'Nuova manutenzione' }).click();
    await page.getByRole('combobox', { name: 'Cerca stazione' }).click();
    await page.getByRole('option', { name: '99999000013_01' }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Dalle ore$/ })
      .getByLabel('Choose time')
      .click();
    await page.locator('.MuiClock-squareMask').click();
    await page.locator('.MuiClock-squareMask').click();
    await page.getByRole('button', { name: 'Choose time', exact: true }).click();
    await page.locator('.MuiClock-squareMask').click();
    await page.locator('.MuiClock-squareMask').click();
    await page
      .locator('div')
      .filter({ hasText: /^Alle oreAlle oreDel giornoDel giorno$/ })
      .getByLabel('Choose date, selected date is Feb 6,')
      .click();
    await page.getByRole('gridcell', { name: '7', exact: true }).click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC modify station maintenance', async ({ page }) => {
    await changeToEcUser(page);
    await page.getByTestId('station-maintenances-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill('99999000013_01');
    await page.getByRole('combobox', { name: 'Stato manutenzione Tutti' }).click();
    await page.getByRole('option', { name: 'In programma' }).click();
    await page.getByTestId('button-search').click();
    await page.waitForTimeout(2000);
    await page.getByRole('menuitem', { name: 'more' }).click();
    await page.getByTestId('edit-action').click();
    await page.getByRole('button', { name: 'Choose date, selected date is Feb 7,' }).click();
    await page.getByRole('gridcell', { name: '8', exact: true }).click();
    await page
      .locator('div')
      .filter({ hasText: /^Dalle ore$/ })
      .getByLabel('Choose time')
      .click();
    await page.locator('.MuiClock-squareMask').click();
    await page.locator('.MuiClock-squareMask').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC opens station maintenance details', async ({ page }) => {
    await changeToEcUser(page);
    await page.getByTestId('station-maintenances-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill('99999000013_01');
    await page.getByRole('combobox', { name: 'Stato manutenzione Tutti' }).click();
    await page.getByRole('option', { name: 'In programma' }).click();
    await page.getByTestId('button-search').click();
    await page.waitForTimeout(2000);
    await page.getByRole('menuitem', { name: 'more' }).click();
    await page.getByTestId('detail-action').click();
    await page.getByTestId('back-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC deletes station maintenance', async ({ page }) => {
    await changeToEcUser(page);
    await page.getByTestId('station-maintenances-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill('99999000013_01');
    await page.getByRole('combobox', { name: 'Stato manutenzione Tutti' }).click();
    await page.getByRole('option', { name: 'In programma' }).click();
    await page.getByTestId('button-search').click();
    await page.waitForTimeout(2000);
    await page.getByRole('menuitem', { name: 'more' }).click();
    await page.getByTestId('delete-action').click();
    await page.getByRole('button', { name: 'Conferma' }).click();
    await checkReturnHomepage(page);
  });
});
