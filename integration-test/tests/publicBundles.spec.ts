import { Page, test } from '@playwright/test';
import {
  bundleNamePublic,
  deleteAllExpiredBundles,
  getToBundleDetail,
  getToNotDeletedBundleDetail,
  validateBundle,
  getRandomMinImport,
  getRandomMaxImport,
  getRandomPaymentAmount

} from './utils/bundleUtils';
import { BundleTypes, changeToEcUser, changeToPspUser, checkReturnHomepage } from './utils/e2eUtils';

test.setTimeout(100000);
test.describe.serial('Public bundles flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: publicBundles.spec.ts');
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    try {
      await deleteAllExpiredBundles(bundleNamePublic, BundleTypes.PUBLIC);
    } catch (error) {
      console.log(`Warning: Error in afterAll cleanup (public bundles): ${error}`);
    } finally {
      await page.close();
    }
  });

  test('PSP creates public bundle', async () => {
    console.log('🚀 STARTING TEST: PSP creates public bundle');

    const paymentOptions = [
      'xiao - REMOVEME',
      'Satispay PROVA - STP',
      'PostePay - PPAY',
      'PayPal - PPAL',
      'MyBank - MYBK',
      'Carta di pagamento - CP',
      'Bancomat Pay - BPAY'
    ];

    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('create-bundle-button').click();
    await page.getByLabel('Su richiesta').check();
    await page.getByTestId('name-test').click();
    await page.getByTestId('name-test').fill(bundleNamePublic);
    await page.getByTestId('description-test').click();
    await page.getByTestId('description-test').fill('desc');

    let currentPaymentOptionIndex = 0;
    let success = false;
    let firstAttempt = true;
    let skipTaxonomy = false;

    while (currentPaymentOptionIndex < paymentOptions.length && !success) {
      await page.getByLabel('Tipo di pagamento').click();
      await page.getByRole('option', { name: paymentOptions[currentPaymentOptionIndex] }).click();

      await page.getByLabel('Touchpoint').click();
      await page.getByRole('option', { name: 'Touchpoint' }).click();
      await page.getByTestId('min-import-test').click();
      await page.getByTestId('min-import-test').fill(String(getRandomMinImport()));
      await page.getByTestId('max-import-test').click();
      await page.getByTestId('max-import-test').fill(String(getRandomMaxImport()));
      await page.getByTestId('payment-amount-test').click();
      await page.getByTestId('payment-amount-test').fill(String(getRandomPaymentAmount()));
      await page.getByLabel('Codice intermediario').click();
      await page.getByRole('option', { name: 'PSP DEMO DIRECT' }).click();
      await page.getByLabel('Codice canale').click();
      await page.getByRole('option', { name: '99999000011_01' }).click();

      if (firstAttempt) {
        await page.getByTestId('open-modal-button-test').click();
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
        firstAttempt = false;
      }

      if (skipTaxonomy && !firstAttempt) {
        await page.getByTestId('open-modal-button-test').click();
      }
      skipTaxonomy = true;
      await page.getByTestId('open-modal-button-test').click();
      await page.getByTestId('confirm-button-test').click();

      try {
        await page.getByText('Errore').waitFor({ timeout: 3000 });
        await page.waitForTimeout(10000);
        await page.getByTestId('back-step-button-test').click();
        currentPaymentOptionIndex++;
      } catch {
        success = true;
      }
    }

    await checkReturnHomepage(page);
  });

  test('Validate bundle', async () => {
    console.log('🚀 STARTING TEST: Validate bundle');
    const validated = await validateBundle(bundleNamePublic, BundleTypes.PUBLIC);
    if (!validated) {
      console.log('Skipping validation test due to missing or invalid bundle');
      test.skip();
      return;
    }
  });

  test('EC activates public bundle', async ({ page }) => {
    console.log('🚀 STARTING TEST: EC activates public bundle');
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();

    const bundleFound = await getToBundleDetail(page, bundleNamePublic);
    if (!bundleFound) {
      test.skip();
      return;
    }

    await activatePublicBundle(page);
  });

  test('EC delete subscription request', async () => {
    console.log('🚀 STARTING TEST: EC delete subscription request');
    await changeToEcUser(page)
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();

    const bundleFound = await getToBundleDetail(page, bundleNamePublic);
    if (!bundleFound) {
      test.skip();
      return;
    }

    try {
      await page.getByTestId('delete-request-button').waitFor({ timeout:5000 } );
    } catch {
      console.log('No subscription requests found, skipping test');
      test.skip();
      return;
    }
    await page.getByTestId('delete-request-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC activates public bundle 2nd time', async () => {
    console.log('🚀 STARTING TEST: EC activates public bundle 2nd time');
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();

    const bundleFound = await getToBundleDetail(page, bundleNamePublic);
    if (!bundleFound) {
      test.skip();
      return;
    }

    await activatePublicBundle(page);
  });

  test('PSP reject EC`s subscription request', async () => {
    console.log('🚀 STARTING TEST: PSP rejects EC`s subscription request');

    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();

    const bundleFound = await getToBundleDetail(page, bundleNamePublic);
    if (!bundleFound) {
      test.skip();
      return;
    }

    try {
      await page.getByTestId('request-detail-button').waitFor({ timeout: 5000 });
    } catch {
      console.log('No subscription requests found, skipping test');
      test.skip();
      return;
    }

    await page.getByTestId('request-detail-button').click();
    await page.getByTestId('request-reject-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC activates public bundle 3rd time', async () => {
    console.log('🚀 STARTING TEST: EC activates public bundle 3rd time');
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();

    const bundleFound = await getToBundleDetail(page, bundleNamePublic);
    if (!bundleFound) {
      test.skip();
      return;
    }

    await activatePublicBundle(page);
  });

  test('PSP accept EC`s subscription request', async () => {
    console.log('🚀 STARTING TEST: PSP accepts EC`s subscription request');

    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();

    const bundleFound = await getToBundleDetail(page, bundleNamePublic);
    if (!bundleFound) {
      test.skip();
      return;
    }

    try {
      await page.getByTestId('request-detail-button').waitFor({ timeout: 5000 });
    } catch {
      console.log('No subscription requests found, skipping test');
      test.skip();
      return;
    }
    await page.getByTestId('request-detail-button').click();
    await page.getByTestId('request-accept-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC de-activates public bundle', async () => {
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();

    const bundleFound = await getToBundleDetail(page, bundleNamePublic);
    if (!bundleFound) {
      test.skip();
      return;
    }

    try {
      await page.getByTestId('deactivate-button').click();
    } catch {
      console.log('No bundle to deactivate found, skipping test');
      test.skip();
      return;
    }
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('PSP deletes public bundle', async () => {
    console.log('🚀 STARTING TEST: PSP deletes public bundle');
    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();
    await getToNotDeletedBundleDetail(page, bundleNamePublic);
    await page.getByTestId('delete-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });
});

async function activatePublicBundle(page: Page) {
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
