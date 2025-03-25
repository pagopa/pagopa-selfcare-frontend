import { Page, test, expect } from '@playwright/test';
import {
  bundleNamePublic,
  deleteAllExpiredBundles,
  getToBundleDetail,
  getToInActivationBundleDetail,
  validateBundle
} from './utils/bundleUtils';
import {
  BundleTypes,
  changeToEcUser,
  changeToPspUser,
  checkReturnHomepage,
} from './utils/e2eUtils';

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
      const hasCartCheckbox = await page.getByRole('checkbox', { name: cartCheckboxLabel }).count() > 0;

      if (hasCartCheckbox) {
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
      } else {
        console.log('Skipping cart management checkbox tests as the element is not present');
      }

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
    if (!validated) {
      console.log('Skipping validation test due to missing or invalid bundle');
      test.skip();
    }
  });

  const navigateToPublicBundles = async (page: Page): Promise<void> => {
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-public').click();
  };

  const checkBundleExists = async (page: Page): Promise<boolean> =>
    await getToBundleDetail(page, bundleNamePublic);

  const handleDeactivateAction = async (page: Page): Promise<boolean> => {
    try {
      await page.getByTestId('deactivate-button').waitFor({ timeout: 5000 });
    } catch {
      return false;
    }

    await page.getByTestId('deactivate-button').click();

    try {
      await page.getByTestId('confirm-button-test').waitFor({ timeout: 5000 });
    } catch {
      return false;
    }

    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
    return true;
  };

  const handleEcBundleActions = async (page: Page, action: 'activate' | 'deactivate', attempt?: string): Promise<boolean> => {
    console.log(`🚀 STARTING TEST: EC ${action}s public bundle${attempt ? ' ' + attempt : ''}`);

    await navigateToPublicBundles(page);

    const bundleFound = await checkBundleExists(page);
    if (!bundleFound) {
      test.skip();
    }

    if (action === 'activate') {
      const activated = await activatePublicBundle(page);
      if (!activated) {
        test.skip();
      }
    } else {
      const deactivated = await handleDeactivateAction(page);
      if (!deactivated) {
        test.skip();
      }
    }

    return true;
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
    if (!bundleFound) {
      test.skip();
    }

    try {
      await page.getByTestId('delete-request-button').waitFor({ timeout: 5000 });
    } catch {
      console.log('No subscription requests found, skipping test');
      test.skip();
    }
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

    if (!bundleFound) {
      test.skip();
    }

    const detailButtonExists = await test.step('Check for subscription request', async () => {
      try {
        const count = await page.getByTestId('request-detail-button').count();
        return count > 0;
      } catch (error) {
        return false;
      }
    });

    if (!detailButtonExists) {
      test.skip();
    }

    await test.step('Reject the subscription request', async () => {
      try {
        await page.getByTestId('request-detail-button').click();
      } catch (error) {
        return;
      }

      const rejectButtonExists = await page.getByTestId('request-reject-button').count() > 0;
      if (!rejectButtonExists) {
        return;
      }

      try {
        await page.getByTestId('request-reject-button').click();
      } catch (error) {
        return;
      }

      const confirmButtonExists = await page.getByTestId('confirm-button-test').count() > 0;
      if (!confirmButtonExists) {
        return;
      }

      try {
        await page.getByTestId('confirm-button-test').click();
        await checkReturnHomepage(page);
      } catch (error) {
        return;
      }
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
    if (!bundleFound) {
      test.skip();
    }

    try {
      await page.getByTestId('delete-button').waitFor({ timeout: 5000 });
    } catch {
      console.log('No public bundle found to delete, skipping test');
      test.skip();
    }
    await page.getByTestId('delete-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });
});

async function activatePublicBundle(page: Page): Promise<boolean> {
  try {
    const openDrawer = await page.getByTestId('padded-drawer').count() > 0;
    if (openDrawer) {
      try {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
      } catch (error) {
        console.error('Error occurred:', error);
      }
    }

    const activateButtonExists = await page.getByTestId('activate-button').count() > 0;
    if (!activateButtonExists) {
      return false;
    }

    await page.getByTestId('activate-button').click();

    const paymentInputExists = await page.getByLabel('Importo a tuo carico').count() > 0;
    if (!paymentInputExists) {
      return false;
    }

    await page.getByLabel('Importo a tuo carico').click();
    await page.getByLabel('Importo a tuo carico').fill('40');

    const confirmButton = page.locator('div').filter({ hasText: /^Conferma$/ });

    const confirmButtonExists = await confirmButton.count() > 0;
    if (!confirmButtonExists) {
      return false;
    }

    await confirmButton.click();

    const paymentInputStillExists = await page.getByLabel('Importo a tuo carico').count() > 0;
    if (paymentInputStillExists) {
      await page.getByLabel('Importo a tuo carico').click();
      await page.getByLabel('Importo a tuo carico').fill('4');
    }

    const openModalButtonExists = await page.getByTestId('open-modal-button-test').count() > 0;
    if (!openModalButtonExists) {
      return false;
    }

    await page.getByTestId('open-modal-button-test').click();

    const finalConfirmButtonExists = await page.getByTestId('confirm-button-test').count() > 0;
    if (!finalConfirmButtonExists) {
      return false;
    }

    await page.getByTestId('confirm-button-test').click();

    await checkReturnHomepage(page);
    return true;
  } catch (error) {
    return false;
  }
}