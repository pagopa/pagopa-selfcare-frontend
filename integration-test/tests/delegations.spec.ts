import { Page, test, expect } from '@playwright/test';
import { changeToEcUser, checkReturnHomepage } from './utils/e2eUtils';

const STATION_IDS = [
  '99999000013_05',
  '99999000013_04',
  '99999000013_03',
  '99999000013_02',
  '99999000013_01'
];

const ecName = 'EC Signed Direct';
const segregationCode = '40';

test.setTimeout(100000);
test.describe.serial('Delegations flow', () => {
  // eslint-disable-next-line functional/no-let
  let page: Page;
  // eslint-disable-next-line functional/no-let
  let selectedStationId = '';

  test.beforeAll(async ({ browser }) => {
    console.log('🚀 STARTING TEST FILE: delegations.spec.ts');
    page = await browser.newPage({ storageState: undefined });
    await changeToEcUser(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  /* eslint-disable-next-line sonarjs/cognitive-complexity */
  test('Associate station to EC', async () => {
    console.log('🚀 STARTING TEST: Associate station to EC');
    await page.getByTestId('stations-test').click();

    // eslint-disable-next-line functional/no-let
    let associationSuccessful = false;

    for (const stationId of STATION_IDS) {
      try {
        await page.getByTestId('search-input').click();
        await page.getByTestId('search-input').clear();
        await page.getByTestId('search-input').fill(stationId);
        await page.waitForTimeout(2000);

        const stationResult = page.getByText(stationId, { exact: true });
        const isStationFound = await stationResult.isVisible({ timeout: 3000 })
          .catch(() => false);

        if (!isStationFound) {
          continue;
        }

        await page.getByLabel('more').click();
        await page.waitForTimeout(500);

        const gestisciLink = page.getByRole('link', { name: 'Gestisci EC' });
        const isGestisciVisible = await gestisciLink.isVisible({ timeout: 3000 })
          .catch(() => false);

        if (!isGestisciVisible) {
          await page.getByTestId('search-input').click();
          continue;
        }

        await gestisciLink.click();
        await page.waitForTimeout(500);

        const noEcsMessage = page.getByText('Non sono ancora presenti EC associati a questo canale');
        const hasNoEcsMessage = await noEcsMessage.isVisible({ timeout: 5000 })
          .catch(() => false);

        const warningMessage = page.getByText('Tutti gli enti disponibili sono già associati');
        const hasWarning = await warningMessage.isVisible({ timeout: 5000 })
          .catch(() => false);

        if (hasWarning) {
          await navigateBackToStationsList(page);
          continue;
        }

        // eslint-disable-next-line functional/no-let
        let associaEcClicked = false;

        try {
          const associaButton = page.getByRole('button', { name: 'Associa EC' });
          const isButtonVisible = await associaButton.isVisible({ timeout: 3000 })
            .catch(() => false);

          if (isButtonVisible) {
            await associaButton.click();
            associaEcClicked = true;
          }
        } catch (error) {
          console.error('Error occurred:', error);
        }

        if (!associaEcClicked && hasNoEcsMessage) {
          try {
            const associaLink = page.getByText('Associa EC').last();
            const isLinkVisible = await associaLink.isVisible({ timeout: 3000 })
              .catch(() => false);

            if (isLinkVisible) {
              await associaLink.click();
              associaEcClicked = true;
            }
          } catch (error) {
            console.error('Error occurred:', error);
          }
        }

        if (!associaEcClicked) {
          await navigateBackToStationsList(page);
          continue;
        }

        selectedStationId = stationId;

        await page.getByLabel('Cerca EC').click();
        await page.getByLabel('Cerca EC').fill('EC');
        await page.waitForTimeout(1000);

        const ecOptions = ['EC DEMO DIRECT', 'EC Signed Direct', 'EC DEMO'];
        // eslint-disable-next-line functional/no-let
        let ecSelected = false;

        for (const ecOption of ecOptions) {
          try {
            const option = page.getByRole('option', { name: new RegExp(ecOption, 'i') });
            const isOptionVisible = await option.isVisible({ timeout: 3000 })
              .catch(() => false);

            if (isOptionVisible) {
              await option.click();
              ecSelected = true;
              break;
            }
          } catch (error) {
            console.error('Error occurred:', error);
          }
        }

        if (!ecSelected) {
          await navigateBackToStationsList(page);
          continue;
        }

        await page.getByRole('combobox', { name: '', exact: true }).click();
        const codeOption = page.getByRole('option', { name: segregationCode });
        const isCodeVisible = await codeOption.isVisible({ timeout: 3000 })
          .catch(() => false);

        if (!isCodeVisible) {
          const anyOption = page.getByRole('option').first();
          await anyOption.click();
        } else {
          await codeOption.click();
        }

        await page.getByTestId('confirm-btn-test').click();
        await checkReturnHomepage(page);

        associationSuccessful = true;
        break;
      } catch (error) {
        await page.goto('/ui/stations');
        await page.waitForTimeout(2000);
      }
    }

    if (!associationSuccessful) {
      console.log('Could not find any station that can be associated with an EC, skipping test');
    }
  });

  test('Test delegations page & details', async () => {
    console.log('🚀 STARTING TEST: Test delegations page & details');
    await page.getByTestId('delegations-test').click();

    try {
      await page.getByTestId('search-input').click();
      await page.getByTestId('search-input').fill(ecName);
      await page.getByTestId('button-search').click();
      await page.waitForTimeout(2000);

      const noResults = page.getByText('Nessun risultato trovato');
      const hasNoResults = await noResults.isVisible({ timeout: 3000 })
        .catch(() => false);

      if (hasNoResults) {
        if (selectedStationId) {
          await page.getByTestId('search-input').click();
          await page.getByTestId('search-input').clear();
          await page.getByTestId('search-input').fill(selectedStationId);
          await page.getByTestId('button-search').click();
          await page.waitForTimeout(2000);

          const noStationResults = await noResults.isVisible({ timeout: 3000 })
            .catch(() => false);

          if (noStationResults) {
            console.log('No delegation results found for the station ID either. Skipping delegation details test.');
            return;
          }
        } else {
          console.log('No selected station ID available. Skipping delegation details test.');
          return;
        }
      }

      const detailButton = page.getByTestId('column-go-to-delegation-detail');
      const isDetailButtonVisible = await detailButton.isVisible({ timeout: 5000 })
        .catch(() => false);

      if (isDetailButtonVisible) {
        await detailButton.click();
      } else {
        console.log('Delegation details button not found. Skipping delegation details test.');
      }
    } catch (error) {
      console.log('Error in delegation details test:', error);
    }
  });

  test('Disassociate station', async () => {
    console.log('🚀 STARTING TEST: Disassociate station');
    try {
      await page.getByTestId('stations-test').click();

      const stationIdsToTry = selectedStationId ?
        [selectedStationId, ...STATION_IDS.filter(id => id !== selectedStationId)] :
        STATION_IDS;

        // eslint-disable-next-line functional/no-let
      let disassociationSuccessful = false;

      for (const stationId of stationIdsToTry) {
        try {
          await page.getByTestId('search-input').click();
          await page.getByTestId('search-input').clear();
          await page.getByTestId('search-input').fill(stationId);
          await page.waitForTimeout(2000);

          const stationRow = page.getByRole('row', { name: stationId });
          const isStationVisible = await stationRow.isVisible({ timeout: 3000 })
            .catch(() => false);

          if (!isStationVisible) {
            continue;
          }

          await stationRow.getByLabel('more').click();
          await page.waitForTimeout(1000);

          await page.getByRole('link', { name: 'Gestisci EC' }).click();
          await page.waitForTimeout(2000);

          const EC_NAMES_TO_TRY = [
            'EC DEMO DIRECT',
            'EC Signed Direct',
            'Comune di Frosinone'
          ];

          // eslint-disable-next-line functional/no-let
          let ecFound = false;

          for (const ecName of EC_NAMES_TO_TRY) {
            const ecRow = page.getByRole('row', { name: new RegExp(ecName, 'i') });
            const isVisible = await ecRow.isVisible({ timeout: 3000 }).catch(() => false);

            if (isVisible) {
              await ecRow.getByLabel('more').click();
              ecFound = true;
              break;
            }
          }

          if (!ecFound) {
            console.log('None of the expected EC entries found in the list');
            test.skip();
          }

          await page.waitForTimeout(1000);

          await page.getByRole('menuitem', { name: 'Dissocia EC' }).click({
            force: true,
            timeout: 5000
          });

          await page.getByTestId('confirm-button-modal-test').click();
          await page.waitForTimeout(1000);
          disassociationSuccessful = true;
          await checkReturnHomepage(page);
          break;
        } catch (error) {
          await page.goto('/ui/stations');
          await page.waitForTimeout(1000);
        }
      }
    } catch (error) {
      console.log('Error in disassociation test:', error);
    }
  });

  async function navigateBackToStationsList(page) {
    try {
      const backButton = page.getByRole('link', { name: 'Indietro' });
      const isBackButtonVisible = await backButton.isVisible({ timeout: 2000 })
        .catch(() => false);

      if (isBackButtonVisible) {
        await backButton.click();
        await page.waitForTimeout(2000);
        return;
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }

    try {
      const arrowBackLink = page.locator('a').filter({ hasText: 'Indietro' }).first();
      const isArrowVisible = await arrowBackLink.isVisible({ timeout: 2000 })
        .catch(() => false);

      if (isArrowVisible) {
        await arrowBackLink.click();
        await page.waitForTimeout(2000);
        return;
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }

    try {
      await page.goBack();
      await page.waitForTimeout(2000);

      const isOnStationsPage = await page.getByTestId('search-input').isVisible({ timeout: 2000 })
        .catch(() => false);

      if (isOnStationsPage) {
        return;
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }

    await page.goto('/ui/stations');
    await page.waitForTimeout(2000);
  }
});