import { test, Page } from '@playwright/test';
import { add } from 'date-fns';
import {
  changeToEcUser,
  checkReturnHomepage,
  selectDatePickerDate,
  selectDigitalClockTime,
} from './utils/e2eUtils';

test.setTimeout(100000);
test.describe.serial('Station Maintenances flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: stationMaintenances.spec.ts');
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  /* eslint-disable-next-line sonarjs/cognitive-complexity */
  test('EC creates new station maintenance', async () => {
    console.log('🚀 STARTING TEST: EC creates new station maintenance');
    await changeToEcUser(page);
    await page.getByTestId('station-maintenances-test').click();
    await page.getByRole('button', { name: 'Nuova manutenzione' }).click();
    await page.getByRole('combobox', { name: 'Cerca stazione' }).click();
    await page.getByRole('option', { name: '99999000013_01' }).click();

    const startDate = add(new Date(), { days: 5 });
    const endDate = add(new Date(), { days: 6 });

    const timeButtons = page.locator('button[aria-label^="Choose time"]');
    const dateButtons = page.locator('button[aria-label^="Choose date"]');

    // "Dalle ore" then "Alle ore"
    await timeButtons.nth(0).click();
    await selectDigitalClockTime(page);
    await timeButtons.nth(1).click();
    await selectDigitalClockTime(page);

    // start date then end date
    await dateButtons.nth(0).click();
    await selectDatePickerDate(page, startDate);
    await dateButtons.nth(1).click();
    await selectDatePickerDate(page, endDate);

    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC modify station maintenance', async ({ page }) => {
    console.log('🚀 STARTING TEST: EC modify station maintenance');
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
    await page.locator('button[aria-label^="Choose time"]').nth(0).click();
    await selectDigitalClockTime(page);
    await page.waitForTimeout(1000);
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC opens station maintenance details', async ({ page }) => {
    console.log('🚀 STARTING TEST: EC opens station maintenance details');
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
    console.log('🚀 STARTING TEST: EC deletes station maintenance');
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