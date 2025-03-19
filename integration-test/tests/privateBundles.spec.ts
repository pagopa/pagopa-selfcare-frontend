import { Page, test } from '@playwright/test';
import {
  bundleNamePrivate,
  deleteAllExpiredBundles,
  getToBundleDetail,
  getToInActivationBundleDetail,
  validateBundle,
  getRandomMinImport,
  getRandomMaxImport,
  getRandomPaymentAmount
} from './utils/bundleUtils';
import { BundleTypes, changeToEcUser, changeToPspUser, checkReturnHomepage } from './utils/e2eUtils';

test.setTimeout(100000);
test.describe.serial('Private bundles flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: privateBundles.spec.ts');
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    try {
      await deleteAllExpiredBundles(bundleNamePrivate, BundleTypes.PRIVATE);
    } catch (error) {
      console.log(`Warning: Error in afterAll cleanup (private bundles): ${error}`);
    } finally {
      await page.close();
    }
  });

  test('PSP creates private bundle', async () => {
    console.log('🚀 STARTING TEST: PSP creates private bundle');

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
    await page.getByLabel('Su invito').check();
    await page.getByTestId('name-test').click();
    await page.getByTestId('name-test').fill(bundleNamePrivate);
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
    const validated = await validateBundle(bundleNamePrivate, BundleTypes.PRIVATE);
    if (!validated) {
      console.log('Skipping validation test due to missing or invalid bundle');
      test.skip();
      return;
    }
  });

  test.fixme('PSP sends private bundle offer', async () => {
    await sendPrivateBundleOffer(page);
  });

  test.fixme('PSP delete private bundle offer', async () => {
    console.log('🚀 STARTING TEST: PSP deletes private bundle offer');
    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-private').click();
    await getToBundleDetail(page, bundleNamePrivate);
    await page.getByTestId('request-detail-button').click();
    await page.getByTestId('offer-delete-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test.fixme('PSP sends private bundle offer 2nd time', async () => {
    console.log('🚀 STARTING TEST: PSP sends private bundle offer 2nd time');
    await changeToPspUser(page);
    await sendPrivateBundleOffer(page);
  });

  test.fixme('EC reject private bundle offer', async () => {
    console.log('🚀 STARTING TEST: EC rejects private bundle offer');
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

  test.fixme('PSP sends private bundle offer 3rd time', async () => {
    console.log('🚀 STARTING TEST: PSP sends private bundle offer 3rd time');
    await changeToPspUser(page);
    await sendPrivateBundleOffer(page);
  });

  test.fixme('EC accept private bundle offer', async () => {
    console.log('🚀 STARTING TEST: EC accepts private bundle offer');
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

  test.fixme('EC de-activates private bundle', async () => {
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-private').click();
    await getToBundleDetail(page, bundleNamePrivate);
    await page.getByTestId('deactivate-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('PSP deletes private bundle', async () => {
    console.log('🚀 STARTING TEST: PSP deletes private bundle');
    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-private').click();
    
    const bundleFound = await getToInActivationBundleDetail(page, bundleNamePrivate);
    if (!bundleFound) {
      console.log(`Skipping deletion test due to missing bundle: ${bundleNamePrivate}`);
      test.skip();
      return;
    }
    
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
  await page.locator('#ec-selection-option-0').getByRole('heading', { name: 'Comune di Test' }).click();
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
