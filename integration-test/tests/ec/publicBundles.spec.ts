import { Page, test, expect } from '@playwright/test';
import {
  bundleNamePublic,
  deleteAllExpiredBundles,
  getToBundleDetail,
  getToInActivationBundleDetail,
  validateBundle,
  waitForBundleDetail
} from '../utils/bundleUtils';
import {
  BundleTypes,
  changeToEcUser,
  changeToPspUser,
  checkReturnHomepage,
} from '../utils/e2eUtils';

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
      console.error('Error occurred:', error);
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
    // Test bundle type
    await page.getByLabel('Su richiesta').check();
    // Test name
    await page.getByTestId('name-test').click();
    await page.getByTestId('name-test').fill(bundleNamePublic);
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

      // Test flag onUs
      await expect(page.getByRole('checkbox', { name: 'onUs' })).toBeVisible();
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

      // Test broker
      await page.getByLabel('Codice intermediario').click();
      await page.getByRole('option', { name: 'PSP DEMO DIRECT' }).click();
      // Test channels
      await page.getByLabel('Codice canale').click();
      await page.getByRole('option', { name: '99999000011_03' }).click();

      // Test flag cart
      const cartCheckboxLabel = 'Gestione carrello di pagamenti';
      await expect(page.getByRole('checkbox', { name: cartCheckboxLabel })).toBeVisible();
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

  test('Validate bundle', async () => {
    console.log('🚀 STARTING TEST: Validate bundle');
    const validated = await validateBundle(bundleNamePublic, BundleTypes.PUBLIC);
    expect(validated, `bundle "${bundleNamePublic}" could not be validated (see logs above)`).toBe(true);
  });

  const navigateToPublicBundles = async (page: Page): Promise<void> => {
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();
  };

  const handleDeactivateAction = async (page: Page): Promise<void> => {
    await expect(page.getByTestId('deactivate-button'), 'deactivate button not found').toBeVisible({
      timeout: 5000
    });
    await page.getByTestId('deactivate-button').click();

    await expect(page.getByTestId('confirm-button-test')).toBeVisible({ timeout: 5000 });
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  };

  const handleEcBundleActions = async (
    page: Page,
    action: 'activate' | 'deactivate',
    attempt?: string
  ): Promise<void> => {
    console.log(`🚀 STARTING TEST: EC ${action}s public bundle${attempt ? ' ' + attempt : ''}`);

    await navigateToPublicBundles(page);

    const expectedTestId = action === 'activate' ? 'activate-button' : 'deactivate-button';
    const bundleFound = await waitForBundleDetail(page, bundleNamePublic, 'tab-public', expectedTestId);
    expect(bundleFound, `bundle "${bundleNamePublic}" (with ${expectedTestId} available) not found`).toBe(true);

    if (action === 'activate') {
      await activatePublicBundle(page);
    } else {
      await handleDeactivateAction(page);
    }
  };

  test('EC activates public bundle', async () => {
    await handleEcBundleActions(page, 'activate');
  });

  test('EC delete subscription request', async () => {
    console.log('🚀 STARTING TEST: EC delete subscription request');
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();

    const bundleFound = await getToBundleDetail(page, bundleNamePublic);
    expect(bundleFound, `bundle "${bundleNamePublic}" not found`).toBe(true);

    await expect(
      page.getByTestId('delete-request-button'),
      'no subscription request to delete'
    ).toBeVisible({ timeout: 5000 });
    await page.getByTestId('delete-request-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC activates public bundle 2nd time', async () => {
    await handleEcBundleActions(page, 'activate', '2nd time');
  });

  /* eslint-disable-next-line sonarjs/cognitive-complexity */
  test('PSP reject EC`s subscription request', async () => {
    console.log('🚀 STARTING TEST: PSP rejects EC`s subscription request');

    await test.step('Navigate to public bundles as PSP user', async () => {
      const openDrawer = await page.getByTestId('padded-drawer').count() > 0;
      if (openDrawer) {
        try {
          await page.keyboard.press('Escape');
          await page.waitForTimeout(1000);
        } catch (error) {
          console.error('Error handling open drawer:', error);
        }
      }

      await changeToPspUser(page);
      await page.getByTestId('commission-bundles-test').click();
      await page.getByTestId('tab-public').click();
    });

    const bundleFound = await test.step('Check if bundle exists', async () =>
      await getToBundleDetail(page, bundleNamePublic)
    );
    expect(bundleFound, `bundle "${bundleNamePublic}" not found`).toBe(true);

    await test.step('Reject the subscription request', async () => {
      const detailButton = page.getByTestId('request-detail-button').first();
      await expect(detailButton, 'no subscription request to reject').toBeVisible({
        timeout: 10000
      });
      await detailButton.click();

      await expect(page.getByTestId('request-reject-button')).toBeVisible({ timeout: 10000 });
      await page.getByTestId('request-reject-button').click();

      await expect(page.getByTestId('confirm-button-test')).toBeVisible({ timeout: 10000 });
      await page.getByTestId('confirm-button-test').click();
      await checkReturnHomepage(page);
    });
  });

  test('EC activates public bundle 3rd time', async () => {
    await handleEcBundleActions(page, 'activate', '3rd time');
  });

  test('EC deactivates public bundle', async () => {
    await handleEcBundleActions(page, 'deactivate');
  });

  test('PSP deletes public bundle', async () => {
    console.log('🚀 STARTING TEST: PSP deletes public bundle');
    await changeToPspUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();

    const bundleFound = await getToInActivationBundleDetail(page, bundleNamePublic);
    expect(bundleFound, `bundle "${bundleNamePublic}" not found among the "In attivazione" ones`).toBe(true);

    await expect(page.getByTestId('delete-button'), 'delete button not found').toBeVisible({
      timeout: 5000
    });
    await page.getByTestId('delete-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });
});

async function activatePublicBundle(page: Page): Promise<void> {
  const openDrawer = (await page.getByTestId('padded-drawer').count()) > 0;
  if (openDrawer) {
    await page.keyboard.press('Escape').catch((error) => console.error('Error occurred:', error));
    await page.waitForTimeout(1000);
  }

  await expect(page.getByTestId('activate-button'), 'activate button not found').toBeVisible({
    timeout: 10000
  });
  await page.getByTestId('activate-button').click();

  const paymentInput = page.getByLabel('Importo a tuo carico');
  await expect(paymentInput).toBeVisible({ timeout: 10000 });
  await paymentInput.click();
  await paymentInput.fill('40');

  const confirmButton = page.locator('div').filter({ hasText: /^Conferma$/ });
  await expect(confirmButton).toBeVisible({ timeout: 10000 });
  await confirmButton.click();

  // the first amount is rejected by the form, retry with a valid one
  if ((await paymentInput.count()) > 0) {
    await paymentInput.click();
    await paymentInput.fill('4');
  }

  await expect(page.getByTestId('open-modal-button-test')).toBeVisible({ timeout: 10000 });
  await page.getByTestId('open-modal-button-test').click();

  await expect(page.getByTestId('confirm-button-test')).toBeVisible({ timeout: 10000 });
  await page.getByTestId('confirm-button-test').click();

  await checkReturnHomepage(page);
}
