import { Page } from '@playwright/test';
import { changeToEcUser, checkReturnHomepage } from './e2eUtils';

/**
 * Logs in as the EC user and creates an async station. The station ends up in
 * the "to be validated" tab, waiting for a PagoPA operator.
 *
 * Used by the EC suite and, as a setup step, by the OP suite (an operator
 * cannot create stations, so it needs an EC to put one in its queue).
 * @returns the code of the created station
 */
export const createStationAsEc = async (page: Page): Promise<string> => {
  await changeToEcUser(page);
  await page.getByTestId('stations-test').click();

  await page.getByTestId('create-station').click();
  await page.waitForTimeout(2000);

  const stationId = await page.getByTestId('station-code-test').inputValue();

  await page.getByTestId('confirm-button-test').click();
  await page.getByTestId('confirm-button-modal-test').click();
  await checkReturnHomepage(page);

  return stationId;
};

/**
 * Searches the station list for `stationId` (on the currently open tab).
 * @returns true if at least one row matched
 */
export const searchStation = async (page: Page, stationId: string): Promise<boolean> => {
  await page.getByTestId('search-input').waitFor({ state: 'visible' });
  await page.getByTestId('search-input').click();
  await page.getByTestId('search-input').clear();
  await page.getByTestId('search-input').fill(stationId);
  await page.waitForTimeout(1500);
  return (await page.getByLabel('more').count()) > 0;
};

/**
 * Extracts a station code like `99999000013_01` from a table row text.
 */
export const extractStationId = (text: string): string | null => {
  const match = text.match(/(\d+)_(\d+)/);
  return match ? `${match[1]}_${match[2]}` : null;
};
