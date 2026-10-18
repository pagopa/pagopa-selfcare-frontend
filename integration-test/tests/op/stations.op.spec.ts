import { Page, expect, test } from '@playwright/test';
import { changeToOperatorOnEc, checkReturnHomepage } from '../utils/e2eUtils';
import { createStationAsEc, searchStation } from '../utils/stationUtils';

/**
 * PagoPA operator flow on stations.
 *
 * An operator cannot create stations, so the setup creates two of them as EC
 * (this is the only place this suite runs as EC): one for each operator test,
 * so the tests do not depend on each other's outcome.
 */
test.describe.serial('Station flow (PagoPA operator)', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;
  // eslint-disable-next-line functional/no-let
  let stationToApprove = '';
  // eslint-disable-next-line functional/no-let
  let stationToRequestEdit = '';

  test.setTimeout(100000);

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: op/stations.op.spec.ts');
    test.setTimeout(240000);
    page = await browser.newPage({ storageState: undefined });

    console.log('🔧 SETUP: EC creates the stations the operator will work on');
    stationToApprove = await createStationAsEc(page);
    stationToRequestEdit = await createStationAsEc(page);
  });

  test.afterAll(async () => {
    // TODO delete stations
    await page.close();
  });

  const openToBeValidatedStation = async (stationId: string) => {
    await changeToOperatorOnEc(page);
    await page.getByTestId('stations-test').click();
    await page.getByTestId('tab-toBeValidated').click();

    const stationFound = await searchStation(page, stationId);
    expect(stationFound, `station ${stationId} not found in "To Be Validated" tab`).toBe(true);

    await page.getByLabel('more').first().click();
    await page.getByRole('link', { name: 'Gestisci stazione' }).click();
  };

  test('Pagopa Operator approves station', async () => {
    console.log('🚀 STARTING TEST: Pagopa Operator approves station');
    await openToBeValidatedStation(stationToApprove);

    await page.getByTestId('edit-button').click();

    // The validation sub-form only renders for an operator.
    await expect(page.getByTestId('password-test')).toBeVisible({ timeout: 10000 });

    try {
      await page.getByTestId('password-test').clear();
      await page.getByTestId('password-test').dblclick();
      await page.getByTestId('password-test').type('password', { delay: 50 });
    } catch (error) {
      console.error('Error while entering password:', error);
      await page.getByTestId('password-test').fill('password');
    }
    await page.waitForTimeout(500);
    await page.getByTestId('confirm-button-test').click();
    await page.getByTestId('confirm-button-modal-test').click();
    await page.waitForTimeout(1000);
    await page.getByTestId('back-btn-test').click();
    await checkReturnHomepage(page);
  });

  test('Pagopa Operator request edit', async () => {
    console.log('🚀 STARTING TEST: Pagopa Operator request edit');
    await openToBeValidatedStation(stationToRequestEdit);

    // Only rendered for an operator on a station waiting for validation.
    await expect(page.getByTestId('request-edit-button')).toBeVisible({ timeout: 10000 });

    await page.getByTestId('request-edit-button').click();
    await page.getByTestId('requestInput').click();
    await page.getByTestId('requestInput').fill('Edit');
    await page.getByTestId('confirm-and-send-button').click();
    await page.waitForTimeout(1000);
    await page.getByTestId('back-btn-test').click();
    await checkReturnHomepage(page);
  });
});
