import { test, Page } from '@playwright/test';
import { bundleNameGlobal } from '../bundleUtils';
import { getTomorrowDate, DEV_URL, login } from '../e2eUtils';

test('PSP creates global bundle', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Comune di Frosinone Referente' }).click();
  await page.getByLabel('Cerca ente').click();
  await page.getByLabel('Cerca ente').fill('PSP');
  await page.getByRole('button', { name: 'PSP DEMO DIRECT Responsabile' }).click();
  await page.getByTestId('commission-bundles-test').click();
  await page.getByTestId('create-bundle-button').click();
  await page.getByLabel('Per tutti').check();
  await page.getByTestId('name-test').click();
  await page.getByTestId('name-test').fill(bundleNameGlobal);
  await page.getByTestId('description-test').click();
  await page.getByTestId('description-test').fill('desc');
  await page.getByLabel('Tipo di pagamento').click();
  await page.getByRole('option', { name: 'xiao - REMOVEME' }).click();
  await page.getByLabel('Touchpoint').click();
  await page.getByRole('option', { name: 'CHECKOUT' }).click();
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
});

test('PSP edits global bundle', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Comune di Frosinone Referente' }).click();
  await page.getByLabel('Cerca ente').click();
  await page.getByLabel('Cerca ente').fill('PSP');
  await page.getByRole('button', { name: 'PSP DEMO DIRECT Responsabile' }).click();
  await page.getByTestId('commission-bundles-test').click();
  await getToBundleDetail(page);
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
});

test('PSP deletes global bundle', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Comune di Frosinone Referente' }).click();
  await page.getByLabel('Cerca ente').click();
  await page.getByLabel('Cerca ente').fill('PSP');
  await page.getByRole('button', { name: 'PSP DEMO DIRECT Responsabile' }).click();
  await page.getByTestId('commission-bundles-test').click();
  await getToBundleDetail(page);
  await page.getByTestId('delete-button').click();
  await page.getByTestId('confirm-button-test').click();
});

test('EC goes to global bundle detail', async ({ page }) => {
  await login(page);
  await page.getByTestId('commission-bundles-test').click();
  await page.getByTestId('search-input').click();
  await page.getByTestId('search-input').fill(bundleNameGlobal);
  await page.waitForTimeout(2000);
  await page.getByLabel('Gestisci pacchetto').first().click();
  await page.getByTestId('exit-btn-test').click();
});

async function getToBundleDetail(page: Page) {
  await page.getByTestId('search-input').click();
  await page.getByTestId('search-input').fill(bundleNameGlobal);
  await page.getByTestId('page-limit-select').getByLabel('5').click();
  await page.getByRole('option', { name: '20' }).click();
  const tomorrowDate = getTomorrowDate();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await page.waitForTimeout(2000);
    const isVisible = await page
      .getByRole('row', {
        name: `${bundleNameGlobal} ${tomorrowDate} ${tomorrowDate} CHECKOUT REMOVEME Status`,
      })
      .isVisible();
    if (isVisible) {
      await page
        .getByRole('row', {
          name: `${bundleNameGlobal} ${tomorrowDate} ${tomorrowDate} CHECKOUT REMOVEME Status`,
        })
        .getByLabel('Gestisci pacchetto')
        .click();
      break;
    } else {
      await page.getByLabel('Go to next page').click();
    }
  }
}
