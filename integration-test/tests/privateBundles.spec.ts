import {Page, test} from '@playwright/test';
import {
  bundleNamePrivate,
  deleteAllExpiredBundles,
  getToBundleDetail,
  validateBundle
} from './utils/bundleUtils';
import {BundleTypes, changeToEcUser, changeToPspUser, checkReturnHomepage} from './utils/e2eUtils';

test.setTimeout(100000);
test.describe('Private bundles flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await deleteAllExpiredBundles(bundleNamePrivate, BundleTypes.PRIVATE);
    await page.close();
  });

  test('PSP creates private bundle', async () => {
    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('create-bundle-button').click();
    await page.getByLabel('Su invito').check();
    await page.getByTestId('name-test').click();
    await page.getByTestId('name-test').fill(bundleNamePrivate);
    await page.getByTestId('description-test').click();
    await page.getByTestId('description-test').fill('desc');
    await page.getByLabel('Tipo di pagamento').click();
    await page.getByRole('option', { name: 'xiao - REMOVEME' }).click();
    await page.getByLabel('Touchpoint').click();
    await page.getByRole('option', { name: 'Touchpoint' }).click();
    await page.getByTestId('min-import-test').click();
    await page.getByTestId('min-import-test').fill('50000');
    await page.getByTestId('max-import-test').click();
    await page.getByTestId('max-import-test').fill('100000');
    await page.getByTestId('payment-amount-test').click();
    await page.getByTestId('payment-amount-test').fill('5');
    await page.getByLabel('Codice intermediario').click();
    await page.getByLabel('Close').click();
    await page.getByLabel('Codice intermediario').click();
    await page.getByRole('option', { name: 'PSP DEMO DIRECT' }).click();
    await page.getByLabel('Codice canale').click();
    await page.getByRole('option', { name: '99999000011_01' }).click();
    await page.getByTestId('open-modal-button-test').click();
    await page.getByTestId('open-taxonomies-drawer').click();
    await page.getByRole('heading', { name: 'AGENZIE FISCALI' }).click();
    await page.getByRole('heading', { name: 'AGENZIA DELLE ENTRATE (AdE)' }).click();
    await page
      .locator(
        '.MuiBox-root > .MuiFormControlLabel-root > .MuiButtonBase-root > .PrivateSwitchBase-input'
      )
      .first()
      .check();
    await page
      .locator(
        'div:nth-child(7) > .MuiFormControlLabel-root > .MuiButtonBase-root > .PrivateSwitchBase-input'
      )
      .check();
    await page.getByTestId('taxonomies-add-button-test').click();
    await page.getByTestId('delete-all-taxonomies-by-group').click();
    await page.getByTestId('confirm-button-test').click();
    await page.getByTestId('open-taxonomies-drawer').click();
    await page
      .getByTestId('padded-drawer')
      .locator('div')
      .filter({ hasText: 'AGENZIE FISCALI' })
      .nth(4)
      .click();
    await page.getByRole('heading', { name: 'AGENZIA DELLE ENTRATE (AdE)' }).click();
    await page
      .locator(
        '.MuiBox-root > .MuiFormControlLabel-root > .MuiButtonBase-root > .PrivateSwitchBase-input'
      )
      .first()
      .check();
    await page
      .locator(
        'div:nth-child(7) > .MuiFormControlLabel-root > .MuiButtonBase-root > .PrivateSwitchBase-input'
      )
      .check();
    await page.getByTestId('taxonomies-add-button-test').click();
    await page.getByTestId('open-modal-button-test').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('Validate bundle', async () => {
    await validateBundle(bundleNamePrivate, BundleTypes.PRIVATE);
  });

  test('PSP sends private bundle offer', async () => {
    await sendPrivateBundleOffer(page);
  });

  test('PSP delete private bundle offer', async () => {
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-private').click();
    await getToBundleDetail(page, bundleNamePrivate);
    await page.getByTestId('request-detail-button').click();
    await page.getByTestId('offer-delete-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('PSP sends private bundle offer 2nd time', async () => {
    await sendPrivateBundleOffer(page);
  });

  test('EC reject private bundle offer', async () => {
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-private').click();
    await page.getByLabel('Attivi').click();
    await page.getByRole('option', { name: 'Disponibili' }).click();
    await page.waitForTimeout(2000);
    await getToBundleDetail(page, bundleNamePrivate);
    await page.getByTestId('reject-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('PSP sends private bundle offer 3rd time', async () => {
    await changeToPspUser(page);
    await sendPrivateBundleOffer(page);
  });

  test('EC accept private bundle offer', async () => {
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-private').click();
    await page.getByLabel('Attivi').click();
    await page.getByRole('option', { name: 'Disponibili' }).click();
    await page.waitForTimeout(2000);
    await getToBundleDetail(page, bundleNamePrivate);
    await page.getByTestId('activate-button').click();
    await page.getByTestId('payment-amount-test').nth(0).click();
    await page.getByTestId('payment-amount-test').nth(0).fill('40');
    await page
      .locator('div')
      .filter({ hasText: /^Conferma$/ })
      .click();
    await page.getByTestId('payment-amount-test').nth(0).click();
    await page.getByTestId('payment-amount-test').nth(0).fill('4');
    await page.getByTestId('open-modal-button-test').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC de-activates private bundle', async () => {
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-private').click();
    await getToBundleDetail(page, bundleNamePrivate);
    await page.getByTestId('deactivate-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('PSP deletes private bundle', async () => {
    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-private').click();
    await getToBundleDetail(page, bundleNamePrivate);
    await page.getByTestId('delete-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });
});

async function sendPrivateBundleOffer(page: Page) {
  await page.getByTestId('commission-bundles-test').click();
  await page.getByTestId('tab-private').click();
  await getToBundleDetail(page, bundleNamePrivate);
  await page.getByRole('link', { name: 'Invita enti' }).click();
  await page.getByLabel('Cerca EC').click();
  await page.getByTestId('ec-selection-id-test').getByLabel('Cerca EC').fill('EC DEMO');
  await page.getByRole('option', { name: 'EC DEMO DIRECT' }).click();
  await page.getByTestId('add-recipients-button').click();
  await page.getByLabel('Cerca EC').click();
  await page.getByTestId('ec-selection-id-test').getByLabel('Cerca EC').fill('Comune');
  await page.getByRole('heading', { name: 'Comune di Test' }).click();
  await page.getByTestId('remove-selected-ec-btn-id-test').nth(1).click();
  await page.getByTestId('open-modal-button-test').click();
  await page.getByTestId('confirm-button-test').click();
  await page.getByTestId('request-detail-button').click();
  await page.getByTestId('offer-delete-button').click();
  await page.getByTestId('confirm-button-test').click();
  await page.getByRole('link', { name: 'Invita enti' }).click();
  await page.getByLabel('Cerca EC').click();
  await page.getByTestId('ec-selection-id-test').getByLabel('Cerca EC').fill('EC DEMO');
  await page.getByRole('option', { name: 'EC DEMO DIRECT' }).click();
  await page.getByTestId('open-modal-button-test').click();
  await page.getByTestId('confirm-button-test').click();
  await checkReturnHomepage(page);
}
