import { Page, test } from '@playwright/test';
import { changeToPspUser, checkReturnHomepage } from './utils/e2eUtils';

const endpoint = 'https://test.it:80/';

test.setTimeout(100000);
test.describe('Channel flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;
  const channelId: string = "99999000011_20";

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({ storageState: undefined });
  });

  test.afterAll(async () => {
    // TODO delete channel
    await page.close();
  });

  // test('PSP creates channel', async () => {
  //   await changeToPspUser(page);
  //   await page.getByTestId('channels-test').click();
  //   await page.getByTestId('create-channel').click();
  //   await page.waitForTimeout(2000);
  //   channelId = await page.getByTestId('channel-code-test').inputValue();
  //   await page.getByTestId('target-union-test').click();
  //   await page.getByTestId('target-union-test').fill(endpoint);
  //   await page.getByRole('option', { name: 'Bancomat Pay - BPAY' }).click();
  //   await page.getByRole('button', { name: 'Conferma' }).click();
  //   await page.getByTestId('confirm-button-modal-test').click();
  //   await checkReturnHomepage(page);
  // });
  test('PSP modifies already existing channel', async () => {
      await changeToPspUser(page);
      await page.getByTestId('channels-test').click();
      await page.getByTestId('search-input').click();
      await page.getByTestId('search-input').fill(channelId);
      await page.waitForTimeout(1000);
      await page.getByLabel('more').click();
      await page.getByRole('link', { name: 'Gestisci canale' }).click();
      await page.getByRole('link', { name: 'Modifica' }).click();
      await page.getByTestId('target-union-test').click();
      await page.getByTestId('target-union-test').press('ArrowRight');
      await page.getByTestId('target-union-test').fill('https://test.it:81/modify');
      await page.getByRole('button', { name: 'Conferma' }).click();
      await page.getByTestId('confirm-button-modal-test').click();
      await checkReturnHomepage(page);
  });

  test('Pagopa Operator request edit', async () => {
    await changeToPspUser(page, true);
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
    await page.getByTestId('back-button-test').click();
    await checkReturnHomepage(page);
  });

  test('PSP modify channel', async () => {
    await changeToPspUser(page);
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
    await page.getByTestId('target-union-test').fill('https://test.it:81/');
    await page.getByRole('button', { name: 'Conferma' }).click();
    await page.getByTestId('confirm-button-modal-test').click();
    await checkReturnHomepage(page);
  });

  test('Pagopa Operator approves channel', async () => {
    await changeToPspUser(page, true);
    await page.getByTestId('channels-test').click();
    await page.getByTestId('tab-toBeValidated').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(channelId);
    await page.waitForTimeout(1000);
    await page.getByLabel('more').click();
    await page.getByRole('link', { name: 'Gestisci canale' }).click();
    await page.getByRole('link', { name: 'Approva e valida' }).click();
    await page.getByTestId('password-test').fill('password');
    await page.getByRole('button', { name: 'Conferma' }).click();
    await page.getByTestId('confirm-button-modal-test').click();
    await page.waitForTimeout(1000);
    await page.getByTestId('back-button-test').click();
    await checkReturnHomepage(page);
  });

  test('PSP associate another PSP to Channel', async () => {
    await changeToPspUser(page);
    await page.getByTestId('channels-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(channelId);
    await page.waitForTimeout(1000);
    await page.getByLabel('more').click();
    await page.getByRole('link', { name: 'Gestisci PSP' }).click();
    await page.getByRole('link', { name: 'Associa PSP' }).first().click();
    await page.waitForTimeout(1000);
    await page.getByTestId('psp-selection-search').click();
    await page.keyboard.insertText("PSP DEMO");
    await page.getByTestId('PartyItemContainer: PSP DEMO DIRECT').getByRole('button', { name: 'PSP DEMO DIRECT' }).click();
    await page.getByTestId('confirm-btn-test').click();
    await checkReturnHomepage(page);
  });

  test('PSP dissociate another PSP from Channel', async () => {
    await changeToPspUser(page);
    await page.getByTestId('channels-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(channelId);
    await page.waitForTimeout(1000);
    await page.getByLabel('more').click();
    await page.getByRole('link', { name: 'Gestisci PSP' }).click();
    await page.waitForTimeout(1000);
    await page.getByTestId('dissociate-99999000011').click();
    await page.getByRole('button', { name: 'Dissocia PSP' }).click();
    await checkReturnHomepage(page);
  });
});
