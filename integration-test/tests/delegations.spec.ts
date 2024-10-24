import { Page, test } from '@playwright/test';
import { changeToEcUser, checkReturnHomepage } from './utils/e2eUtils';

const STATION_ID = '99999000013_02';
const ecName = 'EC Signed Direct';
const segregationCode = '40';

test.setTimeout(100000);
test.describe('Delegations flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({ storageState: undefined });
    await changeToEcUser(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Associate station to EC', async () => {
    await page.getByTestId('stations-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(STATION_ID);
    await page.waitForTimeout(2000);
    await page.getByLabel('more').click();
    await page.getByRole('link', { name: 'Gestisci EC' }).click();
    await page.getByRole('link', { name: 'Associa EC' }).click();
    await page.getByLabel('Cerca EC').click();
    await page.getByTestId('ec-selection-id-test').getByLabel('Cerca EC').fill('EC');
    await page.getByRole('option', { name: ecName }).click();
    await page.getByRole('combobox', { name: '​', exact: true }).click();
    await page.getByRole('option', { name: segregationCode }).click();
    await page.getByTestId('confirm-btn-test').click();
    await checkReturnHomepage(page);
  });

  test('Test delegations page & details', async () => {
    await page.getByTestId('delegations-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(ecName);
    await page.getByTestId('button-search').click();
    await page.waitForTimeout(2000);
    await page.getByTestId('column-go-to-delegation-detail').click();
  });

  test('Disassociate station', async () => {
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(STATION_ID);
    await page.getByTestId('button-search').click();
    await page.waitForTimeout(2000);
    await page.getByTestId('column-station-detail-button').click();
    await page.getByTestId('station-detail-disassociate-station-button').click();
    await page.getByTestId('cancel-button-test').click();
    await page.getByTestId('column-station-detail-button').click();
    await page.getByTestId('station-detail-disassociate-station-button').click();
    await page.getByTestId('confirm-button-test').click();
    await page.getByTestId('exit-btn-test').click();
    await checkReturnHomepage(page);
  });
});
