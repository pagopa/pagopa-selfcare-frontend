import { Page, test } from '@playwright/test';
import { changeToEcUser, checkReturnHomepage } from './utils/e2eUtils';

test.setTimeout(100000);
test.describe('Channel flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;
  let channelId: string;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({ storageState: undefined });
  });

  test.afterAll(async () => {
    // TODO delete channel
    await page.close();
  });

  test('EC creates channel', async () => {
    await changeToEcUser(page);
    await page.getByTestId('channels-test').click();
    await page.getByTestId('create-channel').click();
    await page.waitForTimeout(2000);
    channelId = await page.getByTestId('channel-code-test').inputValue();
    await page.getByTestId('target-union-test').click();
    await page.getByTestId('target-union-test').fill('http://test.it:80/');
    await page.getByRole('option', { name: 'Bancomat Pay - BPAY' }).click();
    await page.getByRole('button', { name: 'Conferma' }).click();
    await page.getByTestId('confirm-button-modal-test').click();
    await checkReturnHomepage(page);
  });

  test('Pagopa Operator request edit', async () => {
    await changeToEcUser(page, true);
    await page.getByTestId('channels-test').click();
    await page.getByTestId('tab-toBeValidated').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(channelId);
    await page.waitForTimeout(1000);
    await page.getByLabel('more').click();
    await page.getByRole('link', { name: 'Gestisci canale' }).click();
    await page.getByTestId('request-edit-button').click();
    await page.getByTestId('requestInput').click();
    await page.getByTestId('requestInput').fill('Edit');
    await page.getByTestId('confirm-and-send-button').click();
    await page.waitForTimeout(1000);
    await page.getByTestId('back-btn-test').click();
    await checkReturnHomepage(page);
  });

  test('EC modify channel', async () => {
    await changeToEcUser(page);
    await page.getByTestId('channels-test').click();
    await page.getByTestId('tab-toBeValidated').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(channelId);
    await page.waitForTimeout(1000);
    await page.getByLabel('more').click();
    await page.getByRole('link', { name: 'Gestisci canale' }).click();
    await page.getByRole('link', { name: 'Modifica' }).click();
    await page.getByTestId('target-union-test').click();
    await page.getByTestId('target-union-test').press('ArrowRight');
    await page.getByTestId('target-union-test').fill('http://test.it:81/');
    await page.getByRole('button', { name: 'Conferma' }).click();
    await page.getByTestId('confirm-button-modal-test').click();
    await checkReturnHomepage(page);
  });

  test('Pagopa Operator approves channel', async () => {
    await changeToEcUser(page, true);
    await page.getByTestId('channels-test').click();
    await page.getByTestId('tab-toBeValidated').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(channelId);
    await page.waitForTimeout(1000);
    await page.getByLabel('more').click();
    await page.getByRole('link', { name: 'Gestisci canale' }).click();
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
    await page.getByTestId('search-input').fill(channelId);
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
    await page.getByTestId('search-input').fill(channelId);
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
