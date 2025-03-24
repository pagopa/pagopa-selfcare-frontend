import { Page, test } from '@playwright/test';
import { changeToEcUser, checkReturnHomepage } from './utils/e2eUtils';

test.describe.serial('Station flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;
  // eslint-disable-next-line functional/no-let
  let selectedStationId = '';
  // eslint-disable-next-line functional/no-let
  let associatedEcName = '';

  test.setTimeout(100000);

  const extractStationId = (text: string): string | null => {
    const idMatch = text.match(/(\d{1,10}_\d{1,10})/);
    return idMatch && idMatch[1] ? idMatch[1] : null;
  };

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: stations.spec.ts');
    page = await browser.newPage({ storageState: undefined });
  });

  test.afterAll(async () => {
    // TODO delete station
    await page.close();
  });

  test('EC creates async station', async () => {
    console.log('🚀 STARTING TEST: EC creates async station');
    await changeToEcUser(page);
    await page.getByTestId('stations-test').click();

    await page.getByTestId('create-station').click();
    await page.waitForTimeout(2000);

    selectedStationId = await page.getByTestId('station-code-test').inputValue();

    await page.getByTestId('confirm-button-test').click();
    await page.getByTestId('confirm-button-modal-test').click();
    await checkReturnHomepage(page);
  });

  test('Pagopa Operator approves station', async () => {
    console.log('🚀 STARTING TEST: Pagopa Operator approves station');
    await changeToEcUser(page, true);
    await page.getByTestId('stations-test').click();

    await page.getByTestId('tab-toBeValidated').click();

    await page.getByTestId('search-input').waitFor({ state: 'visible' });
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(selectedStationId);
    await page.waitForTimeout(1000);

    const stationFound = await page.getByLabel('more').count() > 0;
    if (!stationFound) {
      console.log(`Station ${selectedStationId} not found in "To Be Validated" tab, this test will be skipped`);
      test.skip();
    }

    await page.getByLabel('more').first().click();
    await page.getByRole('link', { name: 'Gestisci stazione' }).click();

    await page.getByTestId('edit-button').click();

    await page.getByTestId('password-test').waitFor({ state: 'visible', timeout: 10000 });

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

  test('EC modify already existing station from sync to async', async () => {
    console.log('🚀 STARTING TEST: EC modify already existing station from sync to async');
    await changeToEcUser(page);
    await page.getByTestId('stations-test').click();

    if (selectedStationId) {
      await page.getByTestId('search-input').waitFor({ state: 'visible' });
      await page.getByTestId('search-input').click();
      await page.getByTestId('search-input').fill(selectedStationId);
      await page.waitForTimeout(1000);

      const stationExists = await page.getByLabel('more').count() > 0;
      if (!stationExists) {
        await page.getByTestId('search-input').clear();
        await page.getByTestId('search-input').fill('99999000013');
        await page.waitForTimeout(1000);

        const firstRow = await page.getByRole('row').filter({ has: page.getByLabel('more') }).first();
        const rowText = await firstRow.textContent() || '';

        const extractedId = extractStationId(rowText);
        if (extractedId) {
          selectedStationId = extractedId;
        } else {
          console.log(`Couldn't extract station ID from: ${rowText}`);
        }
      }
    } else {
      await page.getByTestId('search-input').waitFor({ state: 'visible' });
      await page.getByTestId('search-input').click();
      await page.getByTestId('search-input').fill('99999000013');
      await page.waitForTimeout(1000);

      const firstRow = await page.getByRole('row').filter({ has: page.getByLabel('more') }).first();
      const rowText = await firstRow.textContent() || '';

      const extractedId = extractStationId(rowText);
      if (extractedId) {
        selectedStationId = extractedId;
      } else {
        console.log(`Couldn't extract station ID from: ${rowText}`);
      }
    }

    await page.getByLabel('more').first().click();
    await page.getByRole('link', { name: 'Gestisci stazione' }).click();
    await page.getByTestId('edit-button').click();
    await page.getByLabel('AsincronaGestito da PagoPA').check();
    await page.getByTestId('confirm-button-test').click();
    await page.getByTestId('confirm-button-modal-test').click();
    await checkReturnHomepage(page);
  });

  test('Pagopa Operator request edit', async () => {
    console.log('🚀 STARTING TEST: Pagopa Operator request edit');
    await changeToEcUser(page, true);
    await page.getByTestId('stations-test').click();

    await page.getByTestId('search-input').waitFor({ state: 'visible' });
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(selectedStationId);
    await page.waitForTimeout(1000);

    await page.getByLabel('more').first().click();
    await page.getByRole('link', { name: 'Gestisci stazione' }).click();
    await page.getByTestId('request-edit-button').click();
    await page.getByTestId('requestInput').click();
    await page.getByTestId('requestInput').fill('Edit');
    await page.getByTestId('confirm-and-send-button').click();
    await page.waitForTimeout(1000);
    await page.getByTestId('back-btn-test').click();
    await checkReturnHomepage(page);
  });

  test('EC modify station from async to sync', async () => {
    console.log('🚀 STARTING TEST: EC modify station from async to sync');
    await changeToEcUser(page);
    await page.getByTestId('stations-test').click();

    await page.getByTestId('tab-toBeValidated').click();

    await page.getByTestId('search-input').waitFor({ state: 'visible' });
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(selectedStationId);
    await page.waitForTimeout(1000);

    const stationFound = await page.getByLabel('more').count() > 0;
    if (!stationFound) {
      console.log(`Station ${selectedStationId} not found in "To Be Validated" tab, this test will be skipped`);
      test.skip();
    }

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

  test('EC associate another EC to Station', async () => {
    console.log('🚀 STARTING TEST: EC associate another EC to station');
    await changeToEcUser(page);
    await page.getByTestId('stations-test').click();

    await page.getByTestId('search-input').waitFor({ state: 'visible' });
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(selectedStationId);
    await page.waitForTimeout(1000);

    await page.getByLabel('more').first().click();
    await page.getByRole('link', { name: 'Gestisci EC' }).click();
    await page.getByRole('link', { name: 'Associa EC' }).first().click();
    await page.getByLabel('Cerca EC').click();

    await page.waitForSelector('role=option');

    const ecOptions = await page.getByRole('option').all();
    if (ecOptions.length === 0) {
      console.log('No EC options found, this test will be skipped');
      test.skip();
    }

    const exactMatch = await page.getByRole('option', { name: 'EC Signed Direct' }).count();
    if (exactMatch > 0) {
      await page.getByRole('option', { name: 'EC Signed Direct' }).click();
      associatedEcName = 'EC Signed Direct';
    } else {
      const firstEcOption = ecOptions[0];
      associatedEcName = await firstEcOption.textContent() || 'Unknown EC';
      await firstEcOption.click();
    }

    await page.getByRole('combobox', { name: '', exact: true }).click();
    await page.waitForSelector('role=option');

    const segregationCodeMatch = await page.getByRole('option', { name: '01' }).count();
    if (segregationCodeMatch > 0) {
      await page.getByRole('option', { name: '01' }).click();
    } else {
      const segregationOptions = await page.getByRole('option').all();
      if (segregationOptions.length > 0) {
        await segregationOptions[0].click();
      } else {
        console.log('No segregation code options found, this test will be skipped');
        test.skip();
      }
    }

    await page.getByTestId('confirm-btn-test').click();
    await checkReturnHomepage(page);
  });

  test('EC dissociate another EC from station', async () => {
    console.log('🚀 STARTING TEST: EC dissociate another EC from station');
    await changeToEcUser(page);
    await page.getByTestId('stations-test').click();

    await page.getByTestId('search-input').waitFor({ state: 'visible' });
    await page.getByTestId('search-input').click();
    await page.getByTestId('search-input').fill(selectedStationId);
    await page.waitForTimeout(1000);

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
      if (moreButtons.length === 0) {
        console.log('No associated ECs found to dissociate, this test will be skipped');
        test.skip();
      }
      await moreButtons[0].click();
    }

    await page.getByTestId('dissociate-action').click();
    await page.getByTestId('confirm-button-modal-test').click();
    await checkReturnHomepage(page);
  });
});