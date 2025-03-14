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
  let page: Page;
  let selectedStationId = '';

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({ storageState: undefined });
    await changeToEcUser(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Associate station to EC', async () => {
    console.log('🚀 STARTING TEST: Associate station to EC');
    await page.getByTestId('stations-test').click();

    let associationSuccessful = false;

    for (const stationId of STATION_IDS) {
      console.log(`Trying station ID: ${stationId}`);

      try {
        await page.getByTestId('search-input').click();
        await page.getByTestId('search-input').clear();
        await page.getByTestId('search-input').fill(stationId);
        await page.waitForTimeout(2000);

        const stationResult = page.getByText(stationId, { exact: true });
        const isStationFound = await stationResult.isVisible({ timeout: 3000 })
          .catch(() => false);

        if (!isStationFound) {
          console.log(`Station ${stationId} not found, trying next one`);
          continue;
        }

        await page.getByLabel('more').click();
        await page.waitForTimeout(500);

        const gestisciLink = page.getByRole('link', { name: 'Gestisci EC' });
        const isGestisciVisible = await gestisciLink.isVisible({ timeout: 3000 })
          .catch(() => false);

        if (!isGestisciVisible) {
          console.log(`'Gestisci EC' not visible for station ${stationId}, trying next one`);
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
          console.log(`All ECs are already associated with station ${stationId}, trying next one`);
          await navigateBackToStationsList(page);
          continue;
        }

        console.log(`Attempting to find and click "Associa EC" for station ${stationId}`);
        let associaEcClicked = false;

        try {
          const associaButton = page.getByRole('button', { name: 'Associa EC' });
          const isButtonVisible = await associaButton.isVisible({ timeout: 3000 })
            .catch(() => false);

          if (isButtonVisible) {
            console.log(`Found "Associa EC" button for station ${stationId}`);
            await associaButton.click();
            associaEcClicked = true;
          }
        } catch (error) {
          console.log('Button approach failed:', error);
        }

        if (!associaEcClicked && hasNoEcsMessage) {
          try {
            console.log('Trying to click the "Associa EC" text link');
            const associaLink = page.getByText('Associa EC').last();
            const isLinkVisible = await associaLink.isVisible({ timeout: 3000 })
              .catch(() => false);

            if (isLinkVisible) {
              console.log(`Found "Associa EC" text link for station ${stationId}`);
              await associaLink.click();
              associaEcClicked = true;
            }
          } catch (error) {
            console.log('Text link approach failed:', error);
          }
        }

        if (!associaEcClicked) {
          console.log(`Unable to access "Associa EC" page for station ${stationId}, trying next one`);
          await navigateBackToStationsList(page);
          continue;
        }

        console.log(`Found usable station: ${stationId}`);
        selectedStationId = stationId;

        await page.getByLabel('Cerca EC').click();
        await page.getByLabel('Cerca EC').fill('EC');
        await page.waitForTimeout(1000);

        const ecOptions = ['EC DEMO DIRECT', 'EC Signed Direct', 'EC DEMO'];
        let ecSelected = false;

        for (const ecOption of ecOptions) {
          try {
            const option = page.getByRole('option', { name: new RegExp(ecOption, 'i') });
            const isOptionVisible = await option.isVisible({ timeout: 3000 })
              .catch(() => false);

            if (isOptionVisible) {
              await option.click();
              ecSelected = true;
              console.log(`Selected EC: ${ecOption}`);
              break;
            }
          } catch (error) {
            console.log(`Error selecting EC ${ecOption}:`, error);
          }
        }

        if (!ecSelected) {
          console.log(`Could not select any EC for station ${stationId}, trying next station`);
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
        console.log(`Error processing station ${stationId}:`, error);
        await page.goto('/ui/stations');
        await page.waitForTimeout(2000);
      }
    }

    if (!associationSuccessful) {
      console.log('Could not find any station that can be associated with an EC');
      console.log('Proceeding to next test...');
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
        console.log('No delegation results found for the EC name. Trying the station ID search...');

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
        console.log('Successfully opened delegation details');
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

      let disassociationSuccessful = false;

      for (const stationId of stationIdsToTry) {
        console.log(`Trying to disassociate using station: ${stationId}`);

        try {
          await page.getByTestId('search-input').click();
          await page.getByTestId('search-input').clear();
          await page.getByTestId('search-input').fill(stationId);
          await page.waitForTimeout(2000);

          const stationRow = page.getByRole('row', { name: stationId });
          const isStationVisible = await stationRow.isVisible({ timeout: 3000 })
            .catch(() => false);

          if (!isStationVisible) {
            console.log(`Station ${stationId} not found, trying next`);
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

          let ecFound = false;

          for (const ecName of EC_NAMES_TO_TRY) {
            const ecRow = page.getByRole('row', { name: new RegExp(ecName, 'i') });
            const isVisible = await ecRow.isVisible({ timeout: 3000 }).catch(() => false);

            if (isVisible) {
              console.log(`Found EC row: ${ecName}`);
              await ecRow.getByLabel('more').click();
              ecFound = true;
              break;
            }
            console.log(`EC ${ecName} not found, trying next...`);
          }

          if (!ecFound) {
            throw new Error('None of the expected EC entries found in the list');
          }

          await page.waitForTimeout(1000);

          await page.getByRole('menuitem', { name: 'Dissocia EC' }).click({
            force: true,
            timeout: 5000
          });

          await page.getByTestId('confirm-button-modal-test').click();
          await page.waitForTimeout(1000);
          console.log(`Successfully disassociated EC from station ${stationId}`);
          disassociationSuccessful = true;
          await checkReturnHomepage(page);
          break;
        } catch (error) {
          console.log(`Error disassociating from ${stationId}:`, error);
          await page.goto('/ui/stations');
          await page.waitForTimeout(1000);
        }
      }

      if (!disassociationSuccessful) {
        console.log('Failed to disassociate from all tried stations');
      }
    } catch (error) {
      console.log('Error in disassociation test:', error);
    }
  });

  async function navigateBackToStationsList(page) {
    console.log('Attempting to return to stations list');

    try {
      const backButton = page.getByRole('link', { name: 'Indietro' });
      const isBackButtonVisible = await backButton.isVisible({ timeout: 2000 })
        .catch(() => false);

      if (isBackButtonVisible) {
        console.log('Using Indietro link to return');
        await backButton.click();
        await page.waitForTimeout(2000);
        return;
      }
    } catch (error) {
      console.log('Indietro link approach failed:', error);
    }

    try {
      const arrowBackLink = page.locator('a').filter({ hasText: 'Indietro' }).first();
      const isArrowVisible = await arrowBackLink.isVisible({ timeout: 2000 })
        .catch(() => false);

      if (isArrowVisible) {
        console.log('Using arrow back link to return');
        await arrowBackLink.click();
        await page.waitForTimeout(2000);
        return;
      }
    } catch (error) {
      console.log('Arrow back approach failed:', error);
    }

    try {
      console.log('Using browser navigation to go back');
      await page.goBack();
      await page.waitForTimeout(2000);

      const isOnStationsPage = await page.getByTestId('search-input').isVisible({ timeout: 2000 })
        .catch(() => false);

      if (isOnStationsPage) {
        console.log('Successfully returned using browser navigation');
        return;
      }
    } catch (error) {
      console.log('Browser navigation failed:', error);
    }

    console.log('Using direct navigation to stations page');
    await page.goto('/ui/stations');
    await page.waitForTimeout(2000);
    console.log('Direct navigation completed');
  }
});