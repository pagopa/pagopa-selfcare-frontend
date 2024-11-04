import { Page, test } from '@playwright/test';
import { changeToEcUser, checkReturnHomepage } from './utils/e2eUtils';

test.setTimeout(100000);
test.describe('Station flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;
  const stationId: string = "99999000013_20";

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({ storageState: undefined });
  });

  test.afterAll(async () => {
    // TODO delete station
    await page.close();
  });

  // test('EC creates async station', async () => {
  //   await changeToEcUser(page);
  //   await page.getByTestId('stations-test').click();
  //   await page.getByTestId('create-station').click();
  //   await page.waitForTimeout(2000);
  //   stationId = await page.getByTestId('station-code-test').inputValue();
  //   await page.getByTestId('confirm-button-test').click();
  //   await page.getByTestId('confirm-button-modal-test').click();
  //   await checkReturnHomepage(page);
  // });
  test('EC modify already existing station from sync to async', async () => {
    await changeToEcUser(page);
    await page.getByTestId('stations-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(stationId);
    await page.waitForTimeout(1000);
    await page.getByLabel('more').click();
    await page.getByRole('link', { name: 'Gestisci stazione' }).click();
    await page.getByTestId('edit-button').click();
    await page.getByLabel('AsincronaGestito da PagoPA').check();
    await page.getByTestId('confirm-button-test').click();
    await page.getByTestId('confirm-button-modal-test').click();
    await checkReturnHomepage(page);
  });

  test('Pagopa Operator request edit', async () => {
    await changeToEcUser(page, true);
    await page.getByTestId('stations-test').click();
    await page.getByTestId('tab-toBeValidated').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(stationId);
    await page.waitForTimeout(1000);
    await page.getByLabel('more').click();
    await page.getByRole('link', { name: 'Gestisci stazione' }).click();
    await page.getByTestId('request-edit-button').click();
    await page.getByTestId('requestInput').click();
    await page.getByTestId('requestInput').fill('Edit');
    await page.getByTestId('confirm-and-send-button').click();
    await page.waitForTimeout(1000);
    await page.getByTestId('back-btn-test').click();
    await checkReturnHomepage(page);
  });

  test('EC modify station from async to sync', async () => {
    await changeToEcUser(page);
    await page.getByTestId('stations-test').click();
    await page.getByTestId('tab-toBeValidated').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(stationId);
    await page.waitForTimeout(1000);
    await page.getByLabel('more').click();
    await page.getByRole('link', { name: 'Gestisci stazione' }).click();
    await page.getByTestId('edit-button').click();
    await page.getByLabel('SincronaGestito da EC/PT').check();
    await page.getByTestId('targetConcat-test').click();
    await page.getByTestId('targetConcat-test').click();
    await page.getByTestId('targetConcat-test').fill('test');
    await page.getByTestId('redirectConcat-test').click();
    await page.getByTestId('targetConcat-test').click();
    await page.getByTestId('targetConcat-test').fill('https://test.it');
    await page.getByTestId('redirectConcat-test').click();
    await page.getByTestId('redirectConcat-test').fill('https://test.it');
    await page.getByTestId('targetPofConcat-test').click();
    await page.getByTestId('targetPofConcat-test').click();
    await page.getByTestId('targetPofConcat-test').fill('https://test.it');
    await page.getByTestId('restEndpoint-test').click();
    await page.getByTestId('restEndpoint-test').fill('https://restendpoint.it');
    await page.locator('#odpService').check();
    await page.getByTestId('confirm-button-test').click();
    await page.getByTestId('confirm-button-modal-test').click();
    await checkReturnHomepage(page);
  });

  test('Pagopa Operator approves station', async () => {
    await changeToEcUser(page, true);
    await page.getByTestId('stations-test').click();
    await page.getByTestId('tab-toBeValidated').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(stationId);
    await page.waitForTimeout(1000);
    await page.getByLabel('more').click();
    await page.getByRole('link', { name: 'Gestisci stazione' }).click();
    await page.getByTestId('edit-button').click();
    await page.getByTestId('password-test').fill('password');
    await page.getByTestId('radio-button-newConn').getByLabel('Nuova connettività').click();
    await page.getByLabel('Seleziona').click();
    await page.getByRole('option', { name: 'FORWARDER01 - https://api.dev' }).click();
    await page.getByTestId('confirm-button-test').click();
    await page.getByTestId('confirm-button-modal-test').click();
    await page.waitForTimeout(1000);
    await page.getByTestId('back-btn-test').click();
    await checkReturnHomepage(page);
  });

  test('EC associate another EC to Station', async () => {
    await changeToEcUser(page);
    await page.getByTestId('stations-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(stationId);
    await page.waitForTimeout(1000);
    await page.getByLabel('more').click();
    await page.getByRole('link', { name: 'Gestisci EC' }).click();
    await page.getByRole('link', { name: 'Associa EC' }).first().click();
    await page.getByLabel('Cerca EC').click();
    await page.getByRole('option', { name: 'EC Signed Direct' }).click();
    await page.getByRole('combobox', { name: '​', exact: true }).click();
    await page.getByRole('option', { name: '01' }).click();
    await page.getByTestId('confirm-btn-test').click();
    await checkReturnHomepage(page);
  });

  test('EC dissociate another EC from station', async () => {
    await changeToEcUser(page);
    await page.getByTestId('stations-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(stationId);
    await page.waitForTimeout(1000);
    await page.getByLabel('more').click();
    await page.getByRole('link', { name: 'Gestisci EC' }).click();
    await page.waitForTimeout(1000);
    await page.getByLabel('more').click();
    await page.getByTestId('dissociate-action').click();
    await page.getByTestId('confirm-button-modal-test').click();
    await checkReturnHomepage(page);
  });
});
