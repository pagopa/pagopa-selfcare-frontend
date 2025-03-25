import { Page, test, expect } from '@playwright/test';
import {
  bundleNameGlobal,
  deleteAllExpiredBundles,
  getToInActivationBundleDetail,
} from './utils/bundleUtils';
import { BundleTypes, changeToEcUser, changeToPspUser, checkReturnHomepage } from './utils/e2eUtils';

test.setTimeout(100000);
test.describe.serial('Global bundles flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: globalBundles.spec.ts');
    page = await browser.newPage({ storageState: undefined });
  });

  test.afterAll(async () => {
    try {
      await deleteAllExpiredBundles(bundleNameGlobal, BundleTypes.GLOBAL);
    } catch (error) {
      console.log(`Warning: Error in afterAll cleanup (global bundles): ${error}`);
    } finally {
      await page.close();
    }
  });

  test('PSP creates global bundle', async () => {
    console.log('🚀 STARTING TEST: PSP creates global bundle');

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
    // Test bundle type
    await page.getByLabel('Per tutti').check();
    // Test name
    await page.getByTestId('name-test').click();
    await page.getByTestId('name-test').fill(bundleNameGlobal);
    // Test description
    await page.getByTestId('description-test').click();
    await page.getByTestId('description-test').fill('desc');

    // eslint-disable-next-line functional/no-let
    let currentPaymentOptionIndex = 0;
    // eslint-disable-next-line functional/no-let
    let success = false;
    // eslint-disable-next-line functional/no-let
    let firstAttempt = true;
    // eslint-disable-next-line functional/no-let
    let skipTaxonomy = false;

    while (currentPaymentOptionIndex < paymentOptions.length && !success) {
      // Test payment type
      await page.getByLabel('Tipo di pagamento').click();
      await page.getByRole('option', { name: paymentOptions[currentPaymentOptionIndex] }).click();
      // Test touchpoint
      await page.getByLabel('Touchpoint').click();
      await page.getByRole('option', { name: 'Touchpoint' }).click();
      // Test min import
      await page.getByTestId('min-import-test').click();
      await page.getByTestId('min-import-test').fill('50000');
      // Test max import
      await page.getByTestId('max-import-test').click();
      await page.getByTestId('max-import-test').fill('100000');
      // Test payment amount
      await page.getByTestId('payment-amount-test').click();
      await page.getByTestId('payment-amount-test').fill('5');

      const hasOnUsCheckbox = await page.getByRole('checkbox', { name: 'onUs' }).count() > 0;
      if (hasOnUsCheckbox) {
        expect(page.getByRole('checkbox', { name: 'onUs' })).not.toBeChecked();
        expect(page.getByRole('checkbox', { name: 'onUs' })).toBeDisabled();

        await page.getByLabel('Tipo di pagamento').click();
        await page.getByRole('option', { name: 'Carta di pagamento - CP' }).click();

        expect(page.getByRole('checkbox', { name: 'onUs' })).not.toBeDisabled();
        await page.getByRole('checkbox', { name: 'onUs' }).check();
        expect(page.getByRole('checkbox', { name: 'onUs' })).toBeChecked();

        await page.getByLabel('Tipo di pagamento').click();
        await page.getByRole('option', { name: paymentOptions[currentPaymentOptionIndex] }).click();
        expect(page.getByRole('checkbox', { name: 'onUs' })).not.toBeChecked();
        expect(page.getByRole('checkbox', { name: 'onUs' })).toBeDisabled();
      } else {
        console.log('Skipping onUs checkbox tests as the element is not present');
      }

      // Test broker
      await page.getByLabel('Codice intermediario').click();
      await page.getByRole('option', { name: 'PSP DEMO DIRECT' }).click();
      // Test channels
      await page.getByLabel('Codice canale').click();
      await page.getByRole('option', { name: '99999000011_03' }).click();

      // Test flag cart
      const cartCheckboxLabel = 'Gestione carrello di pagamenti';
      expect(page.getByRole('checkbox', { name: cartCheckboxLabel })).not.toBeChecked();
      expect(page.getByRole('checkbox', { name: cartCheckboxLabel })).toBeDisabled();

      await page.getByLabel('Codice canale').fill('99999000011_01');
      await page.getByRole('option', { name: '99999000011_01' }).click();
      expect(page.getByRole('checkbox', { name: cartCheckboxLabel })).not.toBeDisabled();
      await page.getByRole('checkbox', { name: cartCheckboxLabel }).check();
      expect(page.getByRole('checkbox', { name: cartCheckboxLabel })).toBeChecked();

      await page.getByLabel('Codice canale').fill('99999000011_03');
      await page.getByRole('option', { name: '99999000011_03' }).click();
      expect(page.getByRole('checkbox', { name: cartCheckboxLabel })).not.toBeChecked();
      expect(page.getByRole('checkbox', { name: cartCheckboxLabel })).toBeDisabled();

      if (firstAttempt) {
        // Test taxonomies
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

  test('PSP edits global bundle', async () => {
    console.log('🚀 STARTING TEST: PSP edits global bundle');
    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await getToInActivationBundleDetail(page, bundleNameGlobal);
    await page.getByTestId('modify-button').click();
    await page.getByTestId('max-import-test').click();
    await page.getByTestId('max-import-test').click();
    await page.getByTestId('max-import-test').fill('55000');
    await page
      .locator('div')
      .filter({
        hasText: 'EsciPacchetti commissioni/Modifica pacchettoModifica il pacchetto commissioniL’',
      })
      .nth(3)
      .click();
    await page.getByTestId('open-modal-button-test').click();
    await page.getByTestId('open-modal-button-test').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC goes to global bundle detail', async () => {
    console.log('🚀 STARTING TEST: EC goes to global bundle detail');
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(bundleNameGlobal);
    await page.waitForTimeout(2000);
    await page.getByLabel('Gestisci pacchetto').first().click();
    await page.getByTestId('exit-btn-test').click();
  });

  test('PSP deletes global bundle', async () => {
    console.log('🚀 STARTING TEST: PSP deletes global bundle');
    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await getToInActivationBundleDetail(page, bundleNameGlobal);
    await page.getByTestId('delete-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });
});
