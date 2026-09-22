import { Page, expect, test } from '@playwright/test';
import { changeToEcUser, checkReturnHomepage } from '../utils/e2eUtils';
import { createStationAsEc, extractStationId, searchStation } from '../utils/stationUtils';

// Search key that matches every station of the demo EC (codes look like `99999000013_01`).
const DEMO_EC_TAX_CODE = '99999000013';

test.describe.serial('Station flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;
  // eslint-disable-next-line functional/no-let
  let selectedStationId = '';
  // eslint-disable-next-line functional/no-let
  let associatedEcName = '';

  test.setTimeout(100000);

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: ec/stations.spec.ts');
    page = await browser.newPage({ storageState: undefined });
  });

  test.afterAll(async () => {
    // TODO delete station
    await page.close();
  });

  /**
   * Opens the stations list and returns the id of an already approved station
   * of the demo EC. The stations created by this suite stay "to be validated"
   * (only a PagoPA operator can approve them, see tests/op), so the EC
   * management actions run against a station that is already on DEV.
   */
  const openApprovedStation = async (): Promise<string> => {
    await changeToEcUser(page);
    await page.getByTestId('stations-test').click();

    const found = await searchStation(page, DEMO_EC_TAX_CODE);
    expect(found, `no approved station found for EC ${DEMO_EC_TAX_CODE} on DEV`).toBe(true);

    const firstRow = page.getByRole('row').filter({ has: page.getByLabel('more') }).first();
    const stationId = extractStationId((await firstRow.textContent()) || '');
    expect(stationId, 'cannot read the station code from the first row').not.toBeNull();
    return stationId as string;
  };

  test('EC creates async station', async () => {
    console.log('🚀 STARTING TEST: EC creates async station');
    selectedStationId = await createStationAsEc(page);
  });

  test('EC modify station from async to sync', async () => {
    console.log('🚀 STARTING TEST: EC modify station from async to sync');
    await changeToEcUser(page);
    await page.getByTestId('stations-test').click();
    await page.getByTestId('tab-toBeValidated').click();

    const stationFound = await searchStation(page, selectedStationId);
    expect(stationFound, `station ${selectedStationId} not found in "To Be Validated" tab`).toBe(
      true
    );

    await page.getByLabel('more').first().click();
    await page.getByRole('link', { name: 'Gestisci stazione' }).click();
    await page.getByTestId('edit-button').click();
    await page.getByLabel('SincronaGestito da EC/PT').check();
    await page.getByTestId('targetConcat-test').click();
    await page.getByTestId('targetConcat-test').fill('test');
    await page.getByTestId('redirectConcat-test').click();
    await page.getByTestId('targetConcat-test').click();
    await page.getByTestId('targetConcat-test').fill('https://test.it');
    await page.getByTestId('redirectConcat-test').click();
    await page.getByTestId('redirectConcat-test').fill('https://test.it');
    await page.getByTestId('targetPofConcat-test').click();
    await page.getByTestId('targetPofConcat-test').click();
    await page.getByTestId('targetPofConcat-test').fill('https://test.it');
    await page.getByTestId('restEndpoint-test').click();
    await page.getByTestId('restEndpoint-test').fill('https://restendpoint.it');
    await page.locator('#odpService').check();
    await page.getByTestId('confirm-button-test').click();
    await page.getByTestId('confirm-button-modal-test').click();
    await checkReturnHomepage(page);
  });

  test('EC modify station from sync to async', async () => {
    console.log('🚀 STARTING TEST: EC modify station from sync to async');
    await changeToEcUser(page);
    await page.getByTestId('stations-test').click();
    await page.getByTestId('tab-toBeValidated').click();

    const stationFound = await searchStation(page, selectedStationId);
    expect(stationFound, `station ${selectedStationId} not found in "To Be Validated" tab`).toBe(
      true
    );

    await page.getByLabel('more').first().click();
    await page.getByRole('link', { name: 'Gestisci stazione' }).click();

    // A station that is not approved yet has no pending update, so the edit
    // button must be enabled for the EC.
    const editBtn = page.getByTestId('edit-button');
    await expect(editBtn).toBeEnabled({ timeout: 10000 });
    await editBtn.click();
    await page.getByLabel('AsincronaGestito da PagoPA').check();
    await page.getByTestId('confirm-button-test').click();
    await page.getByTestId('confirm-button-modal-test').click();
    await checkReturnHomepage(page);
  });

  test('EC associate another EC to Station', async () => {
    console.log('🚀 STARTING TEST: EC associate another EC to station');
    const approvedStationId = await openApprovedStation();
    console.log(`Using approved station ${approvedStationId}`);

    await page.getByLabel('more').first().click();
    await page.getByRole('link', { name: 'Gestisci EC' }).click();
    await page.getByRole('link', { name: 'Associa EC' }).first().click();
    await page.getByLabel('Cerca EC').click();

    await page.waitForSelector('role=option');

    const ecOptions = await page.getByRole('option').all();
    expect(ecOptions.length, 'no EC options available to associate').toBeGreaterThan(0);

    const exactMatch = await page.getByRole('option', { name: 'EC Signed Direct' }).count();
    if (exactMatch > 0) {
      await page.getByRole('option', { name: 'EC Signed Direct' }).click();
      associatedEcName = 'EC Signed Direct';
    } else {
      const firstEcOption = ecOptions[0];
      associatedEcName = (await firstEcOption.textContent()) || 'Unknown EC';
      await firstEcOption.click();
    }

    await page.getByRole('combobox', { name: '', exact: true }).click();
    await page.waitForSelector('role=option');

    const segregationCodeMatch = await page.getByRole('option', { name: '01' }).count();
    if (segregationCodeMatch > 0) {
      await page.getByRole('option', { name: '01' }).click();
    } else {
      const segregationOptions = await page.getByRole('option').all();
      expect(segregationOptions.length, 'no segregation code options available').toBeGreaterThan(
        0
      );
      await segregationOptions[0].click();
    }

    await page.getByTestId('confirm-btn-test').click();
    await checkReturnHomepage(page);
  });

  test('EC dissociate another EC from station', async () => {
    console.log('🚀 STARTING TEST: EC dissociate another EC from station');
    const approvedStationId = await openApprovedStation();
    console.log(`Using approved station ${approvedStationId}`);

    await page.getByLabel('more').first().click();
    await page.getByRole('link', { name: 'Gestisci EC' }).click();
    await page.waitForTimeout(1000);

    // eslint-disable-next-line functional/no-let
    let foundEc = false;
    if (associatedEcName) {
      const associatedRows = await page.getByRole('row', { name: associatedEcName }).count();
      if (associatedRows > 0) {
        await page.getByRole('row', { name: associatedEcName }).getByLabel('more').click();
        foundEc = true;
      }
    }

    if (!foundEc) {
      const moreButtons = await page.getByLabel('more').all();
      expect(moreButtons.length, 'no associated ECs found to dissociate').toBeGreaterThan(0);
      await moreButtons[0].click();
    }

    await page.getByTestId('dissociate-action').click();
    await page.getByTestId('confirm-button-modal-test').click();
    await checkReturnHomepage(page);
  });
});
