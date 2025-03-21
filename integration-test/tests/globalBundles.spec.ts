import { Page, test, expect } from '@playwright/test';
import { bundleNameGlobal, deleteAllExpiredBundles, getToBundleDetail } from './utils/bundleUtils';
import {
  BundleTypes,
  changeToEcUser,
  changeToPspUser,
  checkReturnHomepage,
} from './utils/e2eUtils';

test.setTimeout(100000);
test.describe('Global bundles flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({ storageState: undefined });
  });

  test.afterAll(async () => {
    await deleteAllExpiredBundles(bundleNameGlobal, BundleTypes.GLOBAL);
    await page.close();
  });

  test('PSP creates global bundle', async () => {
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
    // Test payment type
    await page.getByLabel('Tipo di pagamento').click();
    await page.getByRole('option', { name: 'xiao - REMOVEME' }).click();
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
    expect(page.getByRole('checkbox', { name: 'onUs' })).not.toBeChecked();
    expect(page.getByRole('checkbox', { name: 'onUs' })).toBeDisabled();

    await page.getByLabel('Tipo di pagamento').click();
    await page.getByRole('option', { name: 'Carta di pagamento - CP' }).click();

    expect(page.getByRole('checkbox', { name: 'onUs' })).not.toBeDisabled();
    await page.getByRole('checkbox', { name: 'onUs' }).check();
    expect(page.getByRole('checkbox', { name: 'onUs' })).toBeChecked();

    await page.getByLabel('Tipo di pagamento').click();
    await page.getByRole('option', { name: 'xiao - REMOVEME' }).click();
    expect(page.getByRole('checkbox', { name: 'onUs' })).not.toBeChecked();
    expect(page.getByRole('checkbox', { name: 'onUs' })).toBeDisabled();
    // Test broker
    await page.getByLabel('Codice intermediario').click();
    await page.getByRole('option', { name: 'PSP DEMO DIRECT' }).click();
    // Test channels
    await page.getByLabel('Codice canale').click();
    await page.getByRole('option', { name: '99999000011_03' }).click();
    // Test flag cart
    expect(
      page.getByRole('checkbox', { name: 'Gestione carrello di pagamenti' })
    ).not.toBeChecked();
    expect(page.getByRole('checkbox', { name: 'Gestione carrello di pagamenti' })).toBeDisabled();

    await page.getByLabel('Codice canale').fill('99999000011_01');
    await page.getByRole('option', { name: '99999000011_01' }).click();
    expect(
      page.getByRole('checkbox', { name: 'Gestione carrello di pagamenti' })
    ).not.toBeDisabled();
    await page.getByRole('checkbox', { name: 'Gestione carrello di pagamenti' }).check();
    expect(page.getByRole('checkbox', { name: 'Gestione carrello di pagamenti' })).toBeChecked();

    await page.getByLabel('Codice canale').fill('99999000011_03');
    await page.getByRole('option', { name: '99999000011_03' }).click();
    expect(
      page.getByRole('checkbox', { name: 'Gestione carrello di pagamenti' })
    ).not.toBeChecked();
    expect(page.getByRole('checkbox', { name: 'Gestione carrello di pagamenti' })).toBeDisabled();
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
    await page.getByTestId('open-modal-button-test').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('PSP edits global bundle', async () => {
    await page.getByTestId('commission-bundles-test').click();
    await getToBundleDetail(page, bundleNameGlobal);
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

  test('PSP deletes global bundle', async () => {
    await page.getByTestId('commission-bundles-test').click();
    await getToBundleDetail(page, bundleNameGlobal);
    await page.getByTestId('delete-button').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC goes to global bundle detail', async () => {
    await changeToEcUser(page);
    await page.getByTestId('commission-bundles-test').click();
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(bundleNameGlobal);
    await page.waitForTimeout(2000);
    await page.getByLabel('Gestisci pacchetto').first().click();
    await page.getByTestId('exit-btn-test').click();
  });
});
