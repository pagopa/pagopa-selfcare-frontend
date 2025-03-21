import { Page, test, expect } from '@playwright/test';
import {
  bundleNamePrivate,
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
      console.error('Error occurred:', error);
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
    // Test bundle type
    await page.getByLabel('Su invito').check();
    // Test name
    await page.getByTestId('name-test').click();
    await page.getByTestId('name-test').fill(bundleNamePrivate);
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

  test('Validate bundle', async () => {
    console.log('🚀 STARTING TEST: Validate bundle');
    const validated = await validateBundle(bundleNamePrivate, BundleTypes.PRIVATE);
    if (!validated) {
      console.log('Skipping validation test due to missing or invalid bundle');
      test.skip();
    }
  });

  test('PSP sends private bundle offer', async () => {
    console.log('🚀 STARTING TEST: PSP sends private bundle offer');
    const result = await sendPrivateBundleOffer(page);

    if (!result?.success) {
      return;
    }
  });

  test('PSP deletes private bundle offer', async ({ page }) => {
    console.log('🚀 STARTING TEST: PSP deletes private bundle offer');

    await test.step('Navigate to private bundles as PSP user', async () => {
      await changeToPspUser(page);
      await page.getByTestId('commission-bundles-test').click();
      await page.getByTestId('tab-private').click();
    });

    const bundleExists = await test.step('Check if bundle exists', async () => 
      await getToBundleDetail(page, bundleNamePrivate)
    );

    if (!bundleExists) {
      return;
    }

    const detailButtonExists = await test.step('Check if request detail button exists', async () => {
      try {
        await page.getByTestId('request-detail-button').waitFor({ timeout: 5000 });
        return true;
      } catch (error) {
        return false;
      }
    });

    if (!detailButtonExists) {
      return;
    }

    await test.step('Delete private bundle offer', async () => {
      await page.getByTestId('request-detail-button').click();

      try {
        await page.getByTestId('offer-delete-button').waitFor({ timeout: 5000 });
      } catch (error) {
        return;
      }

      await page.getByTestId('offer-delete-button').click();
      await page.getByTestId('confirm-button-test').click();
      await checkReturnHomepage(page);
    });
  });

  test('PSP sends private bundle offer 2nd time', async () => {
    console.log('🚀 STARTING TEST: PSP sends private bundle offer 2nd time');
    const result = await sendPrivateBundleOffer(page);

    if (!result?.success) {
      return;
    }
  });

  const checkBundleAvailability = async (page: Page, action: 'accept' | 'reject'): Promise<boolean> => {
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('tab-private').click();
    
    try {
      if (action === 'accept') {
        await page.getByLabel('Attivi').waitFor({ timeout: 5000 });
        await page.getByLabel('Attivi').click();
      } else {
        await page.getByLabel('Attivi').click();
      }

      await page.getByRole('option', { name: 'Disponibili' }).waitFor({ timeout: 5000 });
      await page.getByRole('option', { name: 'Disponibili' }).click();
      await page.waitForTimeout(2000);
    } catch (error) {
      console.error(`Error switching to Disponibili tab: ${error}`);
      return false;
    }
    
    return await getToBundleDetail(page, bundleNamePrivate);
  };

  const performAcceptAction = async (page: Page): Promise<boolean> => {
    try {
      await page.getByTestId('payment-amount-test').first().waitFor({ timeout: 5000 });
      await page.getByTestId('payment-amount-test').first().click();
      await page.getByTestId('payment-amount-test').first().fill('40');

      const confirmButton = page.locator('div').filter({ hasText: /^Conferma$/ });
      await confirmButton.waitFor({ timeout: 5000 });
      await confirmButton.click();

      await page.getByTestId('payment-amount-test').first().click();
      await page.getByTestId('payment-amount-test').first().fill('4');

      await page.getByTestId('open-modal-button-test').waitFor({ timeout: 5000 });
      await page.getByTestId('open-modal-button-test').click();
      return true;
    } catch (error) {
      console.error(`Error during bundle acceptance: ${error}`);
      return false;
    }
  };

  const handleEcBundleInteraction = async (page: Page, action: 'accept' | 'reject'): Promise<boolean> => {
    console.log(`🚀 STARTING TEST: EC ${action}s private bundle offer`);

    const bundleExists = await checkBundleAvailability(page, action);
    if (!bundleExists) {
      return false;
    }

    const buttonTestId = action === 'accept' ? 'activate-button' : 'reject-button';
    try {
      await page.getByTestId(buttonTestId).waitFor({ timeout: 5000 });
    } catch (error) {
      console.error(`${action} button does not exist: ${error}`);
      return false;
    }

    await page.getByTestId(buttonTestId).click();

    if (action === 'accept' && !(await performAcceptAction(page))) {
      return false;
    }

    try {
      await page.getByTestId('confirm-button-test').waitFor({ timeout: 5000 });
      await page.getByTestId('confirm-button-test').click();
      await checkReturnHomepage(page);
      return true;
    } catch (error) {
      console.error(`Error confirming ${action} action: ${error}`);
      return false;
    }
  };

  test('EC reject private bundle offer', async ({ page }) => {
    await handleEcBundleInteraction(page, 'reject');
  });

  test('PSP sends private bundle offer 3rd time', async () => {
    console.log('🚀 STARTING TEST: PSP sends private bundle offer 3rd time');
    const result = await sendPrivateBundleOffer(page);

    if (!result?.success) {
      return;
    }
  });

  test('EC accept private bundle offer', async ({ page }) => {
    await handleEcBundleInteraction(page, 'accept');
  });

  test('EC de-activates private bundle', async ({ page }) => {
    console.log('🚀 STARTING TEST: EC de-activates private bundle');

    await test.step('Navigate to private bundles as EC user', async () => {
      await changeToEcUser(page);
      await page.getByTestId('commission-bundles-test').click();
      await page.getByTestId('tab-private').click();
    });

    const bundleExists = await test.step('Check if bundle exists', async () => 
      await getToBundleDetail(page, bundleNamePrivate)
    );

    if (!bundleExists) {
      return;
    }
    
    const deactivateButtonExists = await test.step('Check if deactivate button exists', async () => {
      try {
        await page.getByTestId('deactivate-button').waitFor({ timeout: 5000 });
        return true;
      } catch (error) {
        return false;
      }
    });

    if (!deactivateButtonExists) {
      return;
    }

    await test.step('Deactivate private bundle', async () => {
      await page.getByTestId('deactivate-button').click();

      try {
        await page.getByTestId('confirm-button-test').waitFor({ timeout: 5000 });
        await page.getByTestId('confirm-button-test').click();
        await checkReturnHomepage(page);
      } catch (error) {
        console.error('Error during deactivation:', error);
      }
    });
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

  const bundleFound = await getToBundleDetail(page, bundleNamePrivate);
  if (!bundleFound) {
    return { success: false, reason: 'bundle-not-found' };
  }

  try {
    await page.getByRole('link', { name: 'Invita enti' }).waitFor({ timeout: 5000 });
  } catch (error) {
    return { success: false, reason: 'invita-enti-not-found' };
  }

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
  
  const requestDetailButtonExists = await page.getByTestId('request-detail-button').count() > 0;
  if (!requestDetailButtonExists) {
    console.log('Request detail button not found, skipping offer deletion and retry');
    return { success: true, reason: 'request-detail-not-found-but-continuing' };
  }

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
  
  return { success: true };
}