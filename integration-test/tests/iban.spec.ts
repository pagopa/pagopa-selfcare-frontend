import { Page, test } from '@playwright/test';
import { changeToEcUser, checkReturnHomepage } from './utils/e2eUtils';

test.setTimeout(100000);
test.describe.serial('IBAN flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;
  const IBAN: string = 'IT49S0300203280447684177591';

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: iban.spec.ts');
    page = await browser.newPage({ storageState: undefined });
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('EC creates IBAN', async () => {
    console.log('🚀 STARTING TEST: EC creates IBAN');
    await changeToEcUser(page);
    await page.getByTestId('iban-test').click();
    await page.getByRole('button', { name: 'Aggiungi IBAN' }).click();
    await page.getByTestId('iban-test').click();
    await page.getByTestId('iban-test').fill(IBAN);
    await page.getByTestId('description-test').click();
    await page.getByTestId('description-test').fill('desc');
    await page.getByTestId('submit-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC edits IBAN', async () => {
    console.log('🚀 STARTING TEST: EC edits IBAN');
    await changeToEcUser(page);
    await page.getByTestId('iban-test').click();
    await page.getByPlaceholder('Cerca per Codice IBAN').click();
    await page.getByPlaceholder('Cerca per Codice IBAN').fill(IBAN);
    await page.getByTestId(`open-${IBAN}`).click();
    await page.getByTestId('button Edit').click();
    await page.getByTestId('description-test').click();
    await page.getByTestId('description-test').fill('desc2');
    await page.getByTestId('submit-button-test').click();
    await checkReturnHomepage(page);
  });

  test('EC deletes IBAN', async () => {
    console.log('🚀 STARTING TEST: EC deletes IBAN');
    await changeToEcUser(page);
    await page.getByTestId('iban-test').click();
    await page.getByPlaceholder('Cerca per Codice IBAN').click();
    await page.getByPlaceholder('Cerca per Codice IBAN').fill(IBAN);
    await page.getByTestId(`open-${IBAN}`).click();
    await page.getByTestId('delete-button-test').click();
    await page.getByTestId('confirm-button-test').click();
    await checkReturnHomepage(page);
  });
});
