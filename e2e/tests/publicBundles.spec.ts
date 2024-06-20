import { Page, test } from '@playwright/test';
import {
  bundleNamePublic,
  ciBundleStates,
  deleteAllExpiredBundles,
  getToBundleDetailEc,
  getToBundleDetailPsp,
  validateBundle,
} from '../bundleUtils';
import { BundleTypes, changeToEcUser, changeToPspUser, checkReturnHomepage, goToStart, login } from '../e2eUtils';

test.setTimeout(100000);
test.describe('Public bundles flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;
  // eslint-disable-next-line functional/no-let
  let jwt: string;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await login(page);
    jwt = await page.evaluate(async () => localStorage.token);
    await goToStart(page);
  });
  test.afterAll(async () => {
    await deleteAllExpiredBundles(bundleNamePublic, BundleTypes.PUBLIC);
  });
  test('PSP creates public bundle', async () => {
    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('create-bundle-button').click();
    await page.getByLabel('Su richiesta').check();
    await page.getByTestId('name-test').click();
    await page.getByTestId('name-test').fill(bundleNamePublic);
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
    await validateBundle(bundleNamePublic, BundleTypes.PUBLIC, jwt);
  });

  test('EC activates public bundle', async () => {
    await changeToEcUser(page);
    await activatePublicBundle(page);
  });

  test('EC delete subscription request', async () => {
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();
    await getToBundleDetailEc(page, bundleNamePublic, ciBundleStates.REQUESTED);
    await page.getByTestId('delete-request-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC activates public bundle 2nd time', async () => {
    await activatePublicBundle(page);
  });

  test('PSP reject EC`s subscription request', async () => {
    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();
    await getToBundleDetailPsp(page, bundleNamePublic, true);
    await page.getByTestId('request-detail-button').click();
    await page.getByTestId('request-reject-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC activates public bundle 3rd time', async () => {
    await changeToEcUser(page);
    await activatePublicBundle(page);
  });

  test('PSP accept EC`s subscription request', async () => {
    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();
    await getToBundleDetailPsp(page, bundleNamePublic, true);
    await page.getByTestId('request-detail-button').click();
    await page.getByTestId('request-accept-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC de-activates public bundle', async () => {
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();
    await getToBundleDetailEc(page, bundleNamePublic, ciBundleStates.ENABLED);
    await page.getByTestId('deactivate-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('PSP deletes public bundle', async () => {
    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();
    await getToBundleDetailPsp(page, bundleNamePublic, true);
    await page.getByTestId('delete-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });
});

async function activatePublicBundle(page: Page) {
  await page.getByTestId('commission-bundles-test').click();
  await page.getByTestId('tab-public').click();
  await getToBundleDetailEc(page, bundleNamePublic, ciBundleStates.AVAILABLE);
  await page.getByTestId('activate-button').click();
  await page.getByLabel('Importo a tuo carico').click();
  await page.getByLabel('Importo a tuo carico').fill('40');
  await page
    .locator('div')
    .filter({ hasText: /^Conferma$/ })
    .click();
  await page.getByLabel('Importo a tuo carico').click();
  await page.getByLabel('Importo a tuo carico').fill('4');
  await page.getByTestId('open-modal-button-test').click();
  await page.getByTestId('confirm-button-test').click();
  await checkReturnHomepage(page);
}
